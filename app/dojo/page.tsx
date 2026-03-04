"use client";

import { useState } from "react";

export default function DojoPage() {
  const [result, setResult] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  async function runQuotable() {
    setBusy(true);
    setResult(null);

    const res = await fetch("/api/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        method: "GET",
        url: "https://jsonplaceholder.typicode.com/todos/1",
        headers: { Accept: "application/json" },
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
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold">PySlice Dojo</h1>
      <p className="text-gray-600 mt-2">
        This page calls <code className="px-1 bg-gray-100 rounded">/api/proxy</code>{" "}
        which calls an allowlisted external API.
      </p>

      <button
        onClick={runQuotable}
        disabled={busy}
        className="mt-6 px-4 py-2 rounded bg-black text-white disabled:opacity-50"
      >
        {busy ? "Running..." : "Run: GET random quote"}
      </button>

      {result && (
        <pre className="mt-6 p-4 rounded bg-gray-950 text-gray-100 overflow-x-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  );
}