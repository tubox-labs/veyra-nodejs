import type { ChatCompletion, ChatCompletionChunk } from "../types/chat.js";
import type { Stream } from "../core/streaming.js";

/**
 * Consume a streaming chat completion and reassemble all chunks into a single completion object.
 */
export async function collectStream(stream: Stream<ChatCompletionChunk>): Promise<ChatCompletion> {
  const parts = new Map<number, { role: "assistant"; content: string; finishReason: string | null }>();
  let id = "";
  let created = 0;
  let model = "";
  let usage: ChatCompletion["usage"] = null;
  let systemFingerprint: string | null = null;

  for await (const chunk of stream) {
    id = chunk.id;
    created = chunk.created;
    model = chunk.model;
    usage = chunk.usage ?? usage;
    systemFingerprint = chunk.systemFingerprint ?? systemFingerprint;

    for (const choice of chunk.choices) {
      const existing = parts.get(choice.index) ?? {
        role: "assistant" as const,
        content: "",
        finishReason: null,
      };

      if (choice.delta.role === "assistant") {
        existing.role = "assistant";
      }

      if (choice.delta.content) {
        existing.content += choice.delta.content;
      }

      if (choice.finishReason !== null) {
        existing.finishReason = choice.finishReason;
      }

      parts.set(choice.index, existing);
    }
  }

  const indices = [...parts.keys()].sort((a, b) => a - b);

  return {
    id,
    object: "chat.completion",
    created,
    model,
    choices: indices.map((index) => {
      const choice = parts.get(index)!;
      return {
        index,
        message: {
          role: choice.role,
          content: choice.content,
        },
        finishReason: choice.finishReason,
      };
    }),
    usage,
    systemFingerprint,
  };
}

/**
 * Collect all delta text from a streaming chat completion into a single string.
 */
export async function streamToString(stream: Stream<ChatCompletionChunk>): Promise<string> {
  let output = "";
  for await (const chunk of stream) {
    for (const choice of chunk.choices) {
      output += choice.delta.content ?? "";
    }
  }
  return output;
}
