export async function GET() {
  return Response.json({
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim()),
    hasDirectUrl: Boolean(process.env.DIRECT_URL && process.env.DIRECT_URL.trim()),
    nodeEnv: process.env.NODE_ENV,
  });
}