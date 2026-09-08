export const runtime = 'edge';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: Request) {
  const origin = req.headers.get('origin') || '*';
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const body = await req.json();
    const { event, pid, game, ts, ...data } = body;

    if (!event || !pid) {
      return new Response(JSON.stringify({ error: 'missing event or pid' }), { status: 400, headers: cors });
    }

    const row = {
      event: String(event).slice(0, 64),
      pid: String(pid).slice(0, 64),
      game: String(game || '').slice(0, 64),
      data: data ?? {},
      ts: typeof ts === 'number' ? ts : Date.now(),
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/jst_game_events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: err }), { status: 500, headers: cors });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: cors });
  } catch {
    return new Response(JSON.stringify({ ok: false }), { status: 200, headers: cors });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
