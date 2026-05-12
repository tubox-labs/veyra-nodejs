import { toSnakeCaseKey } from "../lib/typeUtils.js";
import { VeyraError } from "./errors.js";

export type MultipartUpload =
  | Blob
  | Buffer
  | ReadableStream<Uint8Array>
  | {
      name: string;
      data: Blob | Buffer | ReadableStream<Uint8Array>;
      type?: string;
    };

export async function buildFormData(
  params: Record<string, unknown>,
  fileField = "file",
): Promise<FormData> {
  const form = new FormData();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;

    const fieldName = toSnakeCaseKey(key);

    if (key === fileField) {
      const { blob, filename } = await normaliseUpload(value);
      form.append(fieldName, blob, filename);
      continue;
    }

    appendFormValue(form, fieldName, value);
  }

  return form;
}

function appendFormValue(form: FormData, fieldName: string, value: unknown): void {
  if (Array.isArray(value)) {
    for (const entry of value) {
      appendFormValue(form, fieldName, entry);
    }
    return;
  }

  if (value === null) {
    form.append(fieldName, "null");
    return;
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    form.append(fieldName, String(value));
    return;
  }

  form.append(fieldName, JSON.stringify(value));
}

async function normaliseUpload(input: unknown): Promise<{ blob: Blob; filename: string }> {
  if (!input) {
    throw new VeyraError("Audio file is required.");
  }

  if (isDescriptor(input)) {
    const blob = await toBlob(input.data, input.type);
    if (blob.size === 0) {
      throw new VeyraError("Audio file cannot be empty.");
    }
    return { blob, filename: input.name };
  }

  const blob = await toBlob(input as MultipartUpload);
  if (blob.size === 0) {
    throw new VeyraError("Audio file cannot be empty.");
  }
  return { blob, filename: "audio" };
}

function isDescriptor(
  input: unknown,
): input is { name: string; data: Blob | Buffer | ReadableStream<Uint8Array>; type?: string } {
  return (
    typeof input === "object" &&
    input !== null &&
    "name" in input &&
    "data" in input &&
    typeof (input as { name: unknown }).name === "string"
  );
}

async function toBlob(input: MultipartUpload, forceType?: string): Promise<Blob> {
  if (typeof Blob !== "undefined" && input instanceof Blob) {
    if (forceType && input.type !== forceType) {
      return new Blob([input], { type: forceType });
    }
    return input;
  }

  if (typeof Buffer !== "undefined" && input instanceof Buffer) {
    if (input.byteLength === 0) {
      throw new VeyraError("Audio file cannot be empty.");
    }
    return new Blob([new Uint8Array(input)], { type: forceType ?? "application/octet-stream" });
  }

  if (typeof ReadableStream !== "undefined" && input instanceof ReadableStream) {
    const response = new Response(input);
    const blob = await response.blob();
    if (blob.size === 0) {
      throw new VeyraError("Audio file cannot be empty.");
    }
    if (forceType && blob.type !== forceType) {
      return new Blob([blob], { type: forceType });
    }
    return blob;
  }

  throw new VeyraError("Unsupported upload type for multipart form data.");
}
