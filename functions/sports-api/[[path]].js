const TARGET_ORIGIN = "https://bigwinner.couchchao.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

export async function onRequest({ request }) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (request.method !== "GET") {
    return Response.json(
      { error: "Method not allowed" },
      {
        status: 405,
        headers: corsHeaders,
      }
    );
  }

  const requestUrl = new URL(request.url);
  const targetPath = requestUrl.pathname.replace(/^\/sports-api/, "");
  const targetUrl = new URL(targetPath || "/", TARGET_ORIGIN);
  targetUrl.search = requestUrl.search;

  try {
    const upstreamResponse = await fetch(targetUrl.toString(), {
      headers: {
        Accept: "application/json, text/plain, */*",
        "User-Agent": "Mozilla/5.0",
      },
    });

    const headers = new Headers(corsHeaders);
    const contentType = upstreamResponse.headers.get("content-type");

    if (contentType) {
      headers.set("Content-Type", contentType);
    }

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers,
    });
  } catch (error) {
    return Response.json(
      {
        error: "Sports API proxy failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 502,
        headers: corsHeaders,
      }
    );
  }
}
