import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const ALLOWED_HOSTS = new Set<string>([
  "jsonplaceholder.typicode.com",
  "api.openweathermap.org",
]);

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function sanitizeHeaders(input?: Record<string, unknown>) {
  const out: Record<string, string> = {};
  if (!input) return out;

  for (const [k, v] of Object.entries(input)) {
    if (typeof v !== "string") continue;

    const key = k.toLowerCase();
    if (key === "authorization" || key === "cookie" || key === "set-cookie") continue;
    if (key === "host" || key === "content-length") continue;

    out[k] = v;
  }
  return out;
}

export async function POST(req: Request) {
  try {
    const payloadText = await req.text();
    if (!payloadText) return Response.json({ error: "Empty request body" }, { status: 400 });

    let payload: unknown;
    try {
      payload = JSON.parse(payloadText);
    } catch {
      return Response.json({ error: "Request body is not valid JSON" }, { status: 400 });
    }

    if (!isRecord(payload)) {
      return Response.json({ error: "Body must be a JSON object" }, { status: 400 });
    }

    const method = payload.method;
    const url = payload.url;
    const meta = isRecord(payload.meta) ? payload.meta : undefined;
    const lessonSlug = meta && typeof meta.lessonSlug === "string" ? meta.lessonSlug : undefined;
    const stepId = meta && typeof meta.stepId === "string" ? meta.stepId : undefined;

    if (method !== "GET" && method !== "POST") {
      return Response.json({ error: "method must be GET or POST" }, { status: 400 });
    }
    if (typeof url !== "string") {
      return Response.json({ error: "url must be a string" }, { status: 400 });
    }

    const u = new URL(url);
    if (u.protocol !== "https:") {
      return Response.json({ error: "Only https URLs are allowed" }, { status: 400 });
    }
    if (!ALLOWED_HOSTS.has(u.host)) {
      return Response.json({ error: `Host not allowed: ${u.host}` }, { status: 400 });
    }

    // optional query
    if (isRecord(payload.query)) {
      for (const [k, v] of Object.entries(payload.query)) {
        u.searchParams.set(k, String(v));
      }
    }

    // optional headers
    const finalHeaders: Record<string, string> = {
      Accept: "application/json",
      ...sanitizeHeaders(isRecord(payload.headers) ? payload.headers : undefined),
    };

    // Example: inject OpenWeather key server-side
    if (u.host === "api.openweathermap.org") {
      const key = process.env.OPENWEATHER_API_KEY;
      if (!key) return Response.json({ error: "OPENWEATHER_API_KEY missing" }, { status: 500 });
      u.searchParams.set("appid", key);
    }

    const started = Date.now();
    const upstream = await fetch(u.toString(), {
      method,
      headers: finalHeaders,
      body: method === "POST" ? JSON.stringify(payload.body ?? {}) : undefined,
    });
    const durationMs = Date.now() - started;

    const upstreamText = await upstream.text();

    await prisma.apiRun.create({
      data: {
        host: u.host,
        method,
        url: u.toString(),
        upstreamStatus: upstream.status,
        ok: upstream.ok,
        durationMs,
        responsePreview: upstreamText.slice(0, 2000),
        lessonSlug,
        stepId,
      },
    });

    const data = safeJson(upstreamText);

    return Response.json(
      { ok: upstream.ok, upstreamStatus: upstream.status, durationMs, data },
      { status: 200 }
    );
  } catch (e: any) {
    await prisma.apiRun.create({
      data: {
        host: "proxy-error",
        method: "UNKNOWN",
        url: "UNKNOWN",
        ok: false,
        error: e?.message ?? "Proxy error",
      },
    });

    return Response.json(
      {
        error: e?.message ?? "Proxy route crashed",
        name: e?.name,
        cause: e?.cause ? String(e.cause) : undefined,
        stack: process.env.NODE_ENV === "development" ? e?.stack : undefined,
      },
      { status: 500 }
    );
  }
}

function safeJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}