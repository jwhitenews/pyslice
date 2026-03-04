import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function RunsPage() {
  const runs = await prisma.apiRun.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold">API Runs</h1>
      <p className="text-gray-600 mt-2">Last 50 proxy calls saved to Postgres.</p>

      <div className="mt-6 space-y-3">
        {runs.map((r) => (
          <div key={r.id} className="border rounded-lg p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-sm">{r.method}</span>
              <span className="font-mono text-sm text-gray-700">{r.host}</span>
              <span className="text-sm text-gray-600">
                {new Date(r.createdAt).toLocaleString()}
              </span>
              <span className={`text-sm ${r.ok ? "text-green-700" : "text-red-700"}`}>
                {r.ok ? "OK" : "FAIL"}
              </span>
              {typeof r.upstreamStatus === "number" && (
                <span className="text-sm text-gray-700">HTTP {r.upstreamStatus}</span>
              )}
              {typeof r.durationMs === "number" && (
                <span className="text-sm text-gray-700">{r.durationMs}ms</span>
              )}
            </div>

            <div className="mt-2 font-mono text-xs break-all text-gray-700">{r.url}</div>
            
            {(r.lessonSlug || r.stepId) && (
              <div className="mt-1 text-sm text-gray-600">
                Lesson: <span className="font-mono">{r.lessonSlug ?? "—"}</span> • Step:{" "}
                <span className="font-mono">{r.stepId ?? "—"}</span>
              </div>
            )}

            {r.error && (
              <div className="mt-2 text-sm text-red-700">
                Error: {r.error}
              </div>
            )}

            {r.responsePreview && (
              <details className="mt-3">
                <summary className="cursor-pointer text-sm text-gray-700">
                  Response preview
                </summary>
                <pre className="mt-2 p-3 rounded bg-gray-950 text-gray-100 overflow-x-auto text-xs">
                  {r.responsePreview}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}