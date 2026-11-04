export const prerender = false;

import type { APIRoute } from 'astro';

// Visitor's country from Vercel's edge, for the market swap in Base.astro. Empty in local dev.
export const GET: APIRoute = ({ request }) =>
  new Response(JSON.stringify({ country: request.headers.get('x-vercel-ip-country') ?? '' }), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'private, no-store' },
  });
