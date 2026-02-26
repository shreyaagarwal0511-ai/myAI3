"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useChat } from "@ai-sdk/react";
import { ArrowUp, Loader2, Plus, Square } from "lucide-react";
import { MessageWall } from "@/components/messages/message-wall";
import { ChatHeader } from "@/app/parts/chat-header";
import { ChatHeaderBlock } from "@/app/parts/chat-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UIMessage } from "ai";
import { useEffect, useState, useRef } from "react";
import { AI_NAME, CLEAR_CHAT_TEXT, OWNER_NAME, WELCOME_MESSAGE } from "@/config";
import Image from "next/image";
import Link from "next/link";

const formSchema = z.object({
  message: z.string().min(1).max(2000),
});

const STORAGE_KEY = "chat-messages";

export default function Chat() {
  const [isClient, setIsClient] = useState(false);
  const welcomeMessageShownRef = useRef<boolean>(false);

  const { messages, sendMessage, status, stop, setMessages } = useChat();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !welcomeMessageShownRef.current) {
      const welcomeMessage: UIMessage = {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        parts: [{ type: "text", text: WELCOME_MESSAGE }],
      };
      setMessages([welcomeMessage]);
      welcomeMessageShownRef.current = true;
    }
  }, [isClient, setMessages]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: "" },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    sendMessage({ text: data.message });
    form.reset();
  }

  function clearChat() {
    setMessages([]);
    toast.success("Chat cleared");
  }

  return (
    <div className="flex h-screen items-center justify-center font-sans dark:bg-black">
      <main className="w-full dark:bg-black h-screen relative">

        <div className="fixed top-0 left-0 right-0 z-50 bg-background pb-10">
          <ChatHeader>
            <ChatHeaderBlock />
            <ChatHeaderBlock className="justify-center items-center">
              <Avatar className="size-8 ring-1 ring-primary">
                <AvatarImage src="/logo.png" />
                <AvatarFallback>
                  <Image src="/logo.png" alt="Logo" width={36} height={36} />
                </AvatarFallback>
              </Avatar>
              <p className="tracking-tight">Chat with {AI_NAME}</p>
            </ChatHeaderBlock>
            <ChatHeaderBlock className="justify-end">
              <Button variant="outline" size="sm" onClick={clearChat}>
                <Plus className="size-4" />
                {CLEAR_CHAT_TEXT}
              </Button>
            </ChatHeaderBlock>
          </ChatHeader>
        </div>

        <div className="h-screen overflow-y-auto px-5 py-4 w-full pt-[88px] pb-[200px]">
          <div className="flex flex-col items-center justify-end min-h-full">
            {isClient ? (
              <>
                <MessageWall messages={messages} status={status} />
                {status === "submitted" && (
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                )}
              </>
            ) : (
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background pt-5">

          <div className="w-full px-5 pb-2 flex justify-center">
            <p className="max-w-3xl text-[11px] leading-snug text-muted-foreground opacity-80">
              <strong>Disclaimer:</strong> SQLSherpa is an AI system and may be inaccurate or incomplete.
              It does not provide legal, financial, or professional advice. Validate all SQL before execution.
              Use at your own risk.
            </p>
          </div>

          <div className="w-full px-5 pb-4 flex justify-center">
            <div className="max-w-3xl w-full">
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                  <Controller
                    name="message"
                    control={form.control}
                    render={({ field }) => (
                      <Field>
                        <FieldLabel className="sr-only">Message</FieldLabel>
                        <div className="relative">
                          <Input
                            {...field}
                            className="pr-14"
                            placeholder="Type your message..."
                            disabled={status === "streaming"}
                            autoComplete="off"
                          />
                          {status !== "streaming" && (
                            <Button
                              className="absolute right-2 top-2"
                              type="submit"
                              size="icon"
                            >
                              <ArrowUp className="size-4" />
                            </Button>
                          )}
                          {status === "streaming" && (
                            <Button
                              className="absolute right-2 top-2"
                              size="icon"
                              onClick={() => stop()}
                            >
                              <Square className="size-4" />
                            </Button>
                          )}
                        </div>
                      </Field>
                    )}
                  />
                </FieldGroup>
              </form>
            </div>
          </div>

          <div className="w-full px-5 py-3 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} {OWNER_NAME} · 
            <Link href="/terms" className="underline"> Terms of Use</Link> · 
            Powered by <Link href="https://ringel.ai/" className="underline">Ringel.AI</Link>
          </div>

        </div>

      </main>
    </div>
  );
}
