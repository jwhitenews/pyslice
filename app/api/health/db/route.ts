export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";

export async function GET() {
  const count = await prisma.apiRun.count();
  return Response.json({ ok: true, apiRunCount: count });
}