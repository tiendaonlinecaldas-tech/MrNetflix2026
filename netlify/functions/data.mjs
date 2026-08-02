import { getStore } from "@netlify/blobs";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const store = getStore("mrnetflix-data");

  if (req.method === "GET") {
    const data = (await store.get("mn_data", { type: "json" })) || {};
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8", ...CORS_HEADERS },
    });
  }

  if (req.method === "POST") {
    try {
      const body = await req.json();
      await store.setJSON("mn_data", body);
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json; charset=utf-8", ...CORS_HEADERS },
      });
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: String(e) }), {
        status: 400,
        headers: { "Content-Type": "application/json; charset=utf-8", ...CORS_HEADERS },
      });
    }
  }

  return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
};

export const config = {
  path: "/api/data",
};
