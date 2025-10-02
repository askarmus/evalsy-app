import { NextRequest } from 'next/server';

export const runtime = 'nodejs'; // ensure Node runtime (not edge)

export async function POST(req: NextRequest) {
  try {
    const { previewText, voiceId = 'Rachel', modelId = 'eleven_turbo_v2_5', voiceSettings } = await req.json();

    if (!process.env.XI_API_KEY) {
      return new Response(JSON.stringify({ error: 'XI_API_KEY not set' }), { status: 500 });
    }
    if (!previewText) {
      return new Response(JSON.stringify({ error: 'Missing text' }), { status: 400 });
    }

    // ElevenLabs TTS (streaming) endpoint
    const elevenRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}/stream`, {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.XI_API_KEY!,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text: previewText,
        model_id: modelId,
        // optional voice settings
        voice_settings: voiceSettings ?? {
          stability: 0.4,
          similarity_boost: 0.8,
          style: 0.0,
          use_speaker_boost: true,
        },
      }),
    });

    if (!elevenRes.ok || !elevenRes.body) {
      const errTxt = await elevenRes.text().catch(() => '');
      return new Response(JSON.stringify({ error: `ElevenLabs error: ${elevenRes.status} ${errTxt}` }), { status: 500 });
    }

    // Proxy the audio/mpeg stream back to the client
    return new Response(elevenRes.body, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
      },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'Unknown error' }), { status: 500 });
  }
}
