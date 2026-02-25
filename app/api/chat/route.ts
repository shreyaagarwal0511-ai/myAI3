import {
  streamText,
  UIMessage,
  convertToModelMessages,
  stepCountIs,
  createUIMessageStream,
  createUIMessageStreamResponse,
} from "ai";
import { MODEL } from "@/config";
import { SYSTEM_PROMPT } from "@/prompts";
import { isContentFlagged } from "@/lib/moderation";
import { webSearch } from "./tools/web-search";
import { vectorDatabaseSearch } from "./tools/search-vector-database";

export const maxDuration = 30;

function getLatestUserText(messages: UIMessage[]): string {
  const latestUserMessage = messages.filter((m) => m.role === "user").pop();
  if (!latestUserMessage) return "";

  return latestUserMessage.parts
    .filter((p) => p.type === "text")
    .map((p) => ("text" in p ? p.text : ""))
    .join("")
    .trim();
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // 1) Moderation check on latest user text
  const latestUserText = getLatestUserText(messages);

  if (latestUserText) {
    const moderationResult = await isContentFlagged(latestUserText);

    if (moderationResult.flagged) {
      const stream = createUIMessageStream({
        execute({ writer }) {
          const textId = "moderation-denial-text";

          writer.write({ type: "start" });
          writer.write({ type: "text-start", id: textId });
          writer.write({
            type: "text-delta",
            id: textId,
            delta:
              moderationResult.denialMessage ||
              "Your message violates our guidelines. I can't answer that.",
          });
          writer.write({ type: "text-end", id: textId });
          writer.write({ type: "finish" });
        },
      });

      return createUIMessageStreamResponse({ stream });
    }
  }

  // 2) RAG-first: fetch vector context BEFORE calling the model
  // This makes the assistant consistently grounded + more likely to cite sources.
  let ragContext = "";
  try {
    if (latestUserText) {
      // Call the tool implementation directly
      // vectorDatabaseSearch returns text that already includes <results>...</results>
      // (coming from your Pinecone search context builder)
      const toolResult = await vectorDatabaseSearch.execute({ query: latestUserText } as any);
      ragContext = typeof toolResult === "string" ? toolResult : JSON.stringify(toolResult);
    }
  } catch (e) {
    // If RAG fails, we still allow the model to respond (and webSearch can help)
    ragContext = "";
  }

  // 3) Inject RAG context into the conversation as an additional system message
  const modelMessages = convertToModelMessages(messages);

  const ragSystemBlock = ragContext
    ? `You MUST use the following retrieved context first when answering. If it is relevant, incorporate it and cite sources. If it is not relevant, say so briefly and proceed.\n\n${ragContext}`
    : `No relevant vector-database context was retrieved for this question. If needed, use web search.`;

  const result = streamText({
    model: MODEL,
    system: `${SYSTEM_PROMPT}\n\n<rag_instructions>\n${ragSystemBlock}\n</rag_instructions>`,
    messages: modelMessages,
    tools: {
      // Keep tools available, but we already did RAG-first injection above
      webSearch,
      vectorDatabaseSearch,
    },
    stopWhen: stepCountIs(10),
    providerOptions: {
      openai: {
        reasoningSummary: "auto",
        reasoningEffort: "low",
        parallelToolCalls: false,
      },
    },
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
  });
}
