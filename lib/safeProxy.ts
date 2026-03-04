import { z } from "zod";

export const ProxyRequestSchema = z.object({
  method: z.enum(["GET", "POST"]),
  url: z.string().url(),
  headers: z.record(z.string()).optional(),
  query: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
  body: z.unknown().optional(),
});

const ALLOWED_HOSTS = new Set<string>([
  "api.quotable.io",
  "api.openweathermap.org",
]);

export function assertAllowedUrl(rawUrl: string) {
  const u = new URL(rawUrl);

  if (u.protocol !== "https:") throw new Error("Only https URLs are allowed");
  if (!ALLOWED_HOSTS.has(u.host)) throw new Error(`Host not allowed: ${u.host}`);

  return u;
}

export function buildUrlWithQuery(rawUrl: string, query?: Record<string, any>) {
  const u = new URL(rawUrl);
  if (query) {
    for (const [k, v] of Object.entries(query)) u.searchParams.set(k, String(v));
  }
  return u.toString();
}

export function sanitizeHeaders(input?: Record<string, string>) {
  const headers: Record<string, string> = {};
  if (!input) return headers;

  for (const [k, v] of Object.entries(input)) {
    const key = k.toLowerCase();
    if (key === "authorization" || key === "cookie" || key === "set-cookie") continue;
    if (key === "host" || key === "content-length") continue;
    headers[k] = v;
  }

  return headers;
}