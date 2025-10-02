export const runtime = 'nodejs';

export async function GET() {
  if (!process.env.XI_API_KEY) {
    return new Response(JSON.stringify({ error: 'XI_API_KEY not set' }), { status: 500 });
  }
  const r = await fetch('https://api.elevenlabs.io/v1/voices', {
    headers: { 'xi-api-key': process.env.XI_API_KEY! },
    cache: 'no-store',
  });
  if (!r.ok) {
    const body = await r.text().catch(() => '');
    return new Response(JSON.stringify({ error: `Failed to load voices: ${r.status} ${body}` }), { status: 500 });
  }
  const data = await r.json(); // { voices: [{ voice_id, name, ... }] }
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
}
