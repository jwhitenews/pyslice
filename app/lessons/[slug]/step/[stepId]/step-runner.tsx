"use client";

import { useState } from "react";
import type { LessonStep } from "@/lib/lessons";

export default function StepRunner({
  step,
  lessonSlug,
  stepId,
}: {
  step: LessonStep;
  lessonSlug: string;
  stepId: string;
}) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function run() {
    setBusy(true);
    setResult(null);

    const res = await fetch("/api/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...step.request,
        meta: { lessonSlug, stepId }, // 👈 this is what connects lessons to runs
      }),
    });

    const text = await res.text();
    let data: any;
    try {
      data = text ? JSON.parse(text) : { error: "Empty response body" };
    } catch {
      data = { error: "Non-JSON response body", preview: text.slice(0, 500) };
    }

    setResult({ httpStatus: res.status, ...data });
    setBusy(false);
  }

  return (
    <section className="mt-8">
      <div className="p-4 border rounded-lg">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm text-gray-600">Request</div>
            <div className="font-mono text-sm mt-1">
              {step.request.method} {step.request.url}
            </div>
          </div>

          <button
            onClick={run}
            disabled={busy}
            className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
          >
            {busy ? "Running..." : "Run request"}
          </button>
        </div>

        <details className="mt-3">
          <summary className="cursor-pointer text-sm text-gray-700">Show request details</summary>
          <pre className="mt-3 p-3 rounded bg-gray-950 text-gray-100 overflow-x-auto text-sm">
            {JSON.stringify({ ...step.request, meta: { lessonSlug, stepId } }, null, 2)}
          </pre>
        </details>
      </div>

      {result && (
        <div className="mt-6 p-4 border rounded-lg">
          <div className="text-sm text-gray-600">Response</div>
          <pre className="mt-3 p-3 rounded bg-gray-950 text-gray-100 overflow-x-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </section>
  );
}