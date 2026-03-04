export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";

export async function GET() {
  const count = await prisma.test.count();
  return Response.json({ ok: true, count });
}