export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function hasOwn<T extends object, K extends PropertyKey>(
  value: T,
  key: K,
): value is T & Record<K, unknown> {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (!isRecord(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function isNonTransformable(value: unknown): boolean {
  if (value instanceof Date) return true;
  if (value instanceof URLSearchParams) return true;
  if (typeof FormData !== "undefined" && value instanceof FormData) return true;
  if (typeof Blob !== "undefined" && value instanceof Blob) return true;
  if (typeof ArrayBuffer !== "undefined" && value instanceof ArrayBuffer) return true;
  if (typeof ReadableStream !== "undefined" && value instanceof ReadableStream) return true;
  return value instanceof Uint8Array;
}

export function strip<T>(value: T): T {
  const stripped = stripInternal(value);
  return stripped as T;
}

function stripInternal(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => stripInternal(entry));
  }

  if (!isPlainObject(value)) {
    return value;
  }

  const output: Record<string, unknown> = {};
  for (const [key, nestedValue] of Object.entries(value)) {
    if (nestedValue !== undefined) {
      output[key] = stripInternal(nestedValue);
    }
  }

  return output;
}

export function deepMerge<T extends Record<string, unknown>>(
  base: T,
  ...sources: Array<Record<string, unknown> | undefined>
): T {
  const output: Record<string, unknown> = { ...base };

  for (const source of sources) {
    if (!source) continue;
    for (const [key, value] of Object.entries(source)) {
      const current = output[key];
      if (isPlainObject(current) && isPlainObject(value)) {
        output[key] = deepMerge(current, value);
      } else {
        output[key] = value;
      }
    }
  }

  return output as T;
}

export function toSnakeCaseKey(input: string): string {
  if (input.startsWith("_")) return input;
  return input.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);
}

export function toCamelCaseKey(input: string): string {
  if (input.startsWith("_")) return input;
  return input.replace(/_([a-z0-9])/g, (_, char: string) => char.toUpperCase());
}

export function toSnakeCase<T>(value: T): T {
  return transformKeys(value, toSnakeCaseKey);
}

export function toCamelCase<T>(value: T): T {
  return transformKeys(value, toCamelCaseKey);
}

function transformKeys<T>(value: T, keyTransform: (key: string) => string): T {
  if (Array.isArray(value)) {
    return value.map((entry) => transformKeys(entry, keyTransform)) as T;
  }

  if (!isPlainObject(value) || isNonTransformable(value)) {
    return value;
  }

  const output: Record<string, unknown> = {};
  for (const [key, nestedValue] of Object.entries(value)) {
    output[keyTransform(key)] = transformKeys(nestedValue, keyTransform);
  }

  return output as T;
}

export function attachRaw<T>(data: T, raw: unknown): T {
  if (!isRecord(data) && !Array.isArray(data)) {
    return data;
  }

  Object.defineProperty(data, "_raw", {
    value: raw,
    enumerable: false,
    configurable: false,
    writable: false,
  });
  return data;
}

export function parseJsonWithCamelCase<T>(raw: string): T {
  const parsed = JSON.parse(raw) as unknown;
  return attachRaw(toCamelCase(parsed) as T, parsed);
}

export function toQueryParams(
  params: Record<string, string | number | boolean | undefined> | undefined,
): URLSearchParams {
  const searchParams = new URLSearchParams();
  if (!params) return searchParams;

  const transformed = toSnakeCase(strip(params)) as Record<string, string | number | boolean>;
  for (const [key, value] of Object.entries(transformed)) {
    searchParams.set(key, String(value));
  }

  return searchParams;
}
