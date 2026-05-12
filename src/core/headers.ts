import { VERSION } from "../version.js";

export function mergeHeaders(
  ...sources: Array<Record<string, string> | undefined>
): Record<string, string> {
  const merged: Record<string, string> = {};
  for (const source of sources) {
    if (!source) continue;
    for (const [key, value] of Object.entries(source)) {
      merged[key] = value;
    }
  }
  return merged;
}

export function buildHeaders(options: {
  apiKey: string;
  defaultHeaders?: Record<string, string> | undefined;
  requestHeaders?: Record<string, string> | undefined;
  hasBody?: boolean | undefined;
  isMultipart?: boolean | undefined;
}): Record<string, string> {
  const baseHeaders: Record<string, string> = {
    "User-Agent": `veyra-node/${VERSION}`,
    Accept: "application/json",
    Authorization: `Bearer ${options.apiKey}`,
  };

  if (options.hasBody && !options.isMultipart) {
    baseHeaders["Content-Type"] = "application/json";
  }

  return mergeHeaders(baseHeaders, options.defaultHeaders, options.requestHeaders);
}
