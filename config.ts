import { openai } from "@ai-sdk/openai";
import { fireworks } from "@ai-sdk/fireworks";
import { wrapLanguageModel, extractReasoningMiddleware } from "ai";

export const MODEL = openai("gpt-4.1");

// If you want to use a Fireworks model, uncomment the following code and set the FIREWORKS_API_KEY in Vercel
// NOTE: Use middleware when the reasoning tag is different than think. (Use ChatGPT to help you understand the middleware)
// export const MODEL = wrapLanguageModel({
//     model: fireworks('fireworks/deepseek-r1-0528'),
//     middleware: extractReasoningMiddleware({ tagName: 'think' }), // Use this only when using Deepseek
// });

function getDateAndTime(): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
  return `The day today is ${dateStr} and the time right now is ${timeStr}.`;
}

export const DATE_AND_TIME = getDateAndTime();

// -----------------------
// SQL Expert Branding
// -----------------------
export const AI_NAME = "SQLSherpa";
export const OWNER_NAME = "Shreya Agarwal";

export const WELCOME_MESSAGE = `Hi! I'm ${AI_NAME}, your SQL expert assistant. I can help you write queries, debug errors, and optimize SQL across PostgreSQL, MySQL, BigQuery, Snowflake, and SQL Server.`;

// Optional UI copy
export const CLEAR_CHAT_TEXT = "New";

// Optional: suggested prompts (safe even if your UI doesn’t use it)
export const SUGGESTED_PROMPTS: string[] = [
  "Write a SQL query to find top 5 customers by total spend in the last 90 days.",
  "Debug this SQL error and fix my query: <paste query + error>",
  "Explain window functions with an example using ROW_NUMBER().",
  "Optimize this query for Postgres: <paste query>",
  "Convert this query from MySQL to BigQuery: <paste query>",
  "Help me design the correct joins: here are my tables and keys...",
];

// Public deployment disclaimer (recommended for your assignment)
export const PUBLIC_DISCLAIMER =
  "SQLSherpa provides educational guidance only. Validate queries before running in production. Do not use on systems you do not own or have permission to access.";

// -----------------------
// Moderation messages (unchanged)
// -----------------------
export const MODERATION_DENIAL_MESSAGE_SEXUAL =
  "I can't discuss explicit sexual content. Please ask something else.";
export const MODERATION_DENIAL_MESSAGE_SEXUAL_MINORS =
  "I can't discuss content involving minors in a sexual context. Please ask something else.";
export const MODERATION_DENIAL_MESSAGE_HARASSMENT =
  "I can't engage with harassing content. Please be respectful.";
export const MODERATION_DENIAL_MESSAGE_HARASSMENT_THREATENING =
  "I can't engage with threatening or harassing content. Please be respectful.";
export const MODERATION_DENIAL_MESSAGE_HATE =
  "I can't engage with hateful content. Please be respectful.";
export const MODERATION_DENIAL_MESSAGE_HATE_THREATENING =
  "I can't engage with threatening hate speech. Please be respectful.";
export const MODERATION_DENIAL_MESSAGE_ILLICIT =
  "I can't discuss illegal activities. Please ask something else.";
export const MODERATION_DENIAL_MESSAGE_ILLICIT_VIOLENT =
  "I can't discuss violent illegal activities. Please ask something else.";
export const MODERATION_DENIAL_MESSAGE_SELF_HARM =
  "I can't discuss self-harm. If you're struggling, please reach out to a mental health professional or crisis helpline.";
export const MODERATION_DENIAL_MESSAGE_SELF_HARM_INTENT =
  "I can't discuss self-harm intentions. If you're struggling, please reach out to a mental health professional or crisis helpline.";
export const MODERATION_DENIAL_MESSAGE_SELF_HARM_INSTRUCTIONS =
  "I can't provide instructions related to self-harm. If you're struggling, please reach out to a mental health professional or crisis helpline.";
export const MODERATION_DENIAL_MESSAGE_VIOLENCE =
  "I can't discuss violent content. Please ask something else.";
export const MODERATION_DENIAL_MESSAGE_VIOLENCE_GRAPHIC =
  "I can't discuss graphic violent content. Please ask something else.";
export const MODERATION_DENIAL_MESSAGE_DEFAULT =
  "Your message violates our guidelines. I can't answer that.";

// -----------------------
// RAG / Pinecone settings
// -----------------------
export const PINECONE_TOP_K = 40;

// Keep your existing index name unless you already created a different one in Pinecone
export const PINECONE_INDEX_NAME = "my-ai";

// Namespace is commonly used in the notebook upsert; safe to define here for consistency
export const PINECONE_NAMESPACE = "sql";
