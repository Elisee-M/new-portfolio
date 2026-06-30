function base64url(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64urlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return Uint8Array.from(atob(str), c => c.charCodeAt(0));
}

async function signJWT(payload, secret, expiresIn) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const enc = new TextEncoder();
  const now = Math.floor(Date.now() / 1000);
  const h = base64url(enc.encode(JSON.stringify(header)));
  const p = base64url(enc.encode(JSON.stringify({ ...payload, iat: now, exp: now + expiresIn })));
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(h + '.' + p));
  return h + '.' + p + '.' + base64url(sig);
}

async function verifyJWT(token, secret) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token');
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
  const valid = await crypto.subtle.verify({ name: 'HMAC', hash: 'SHA-256' }, key, base64urlDecode(parts[2]), enc.encode(parts[0] + '.' + parts[1]));
  if (!valid) throw new Error('Invalid signature');
  const payload = JSON.parse(new TextDecoder().decode(base64urlDecode(parts[1])));
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) throw new Error('Token expired');
  return payload;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function json(data, status) {
  return new Response(JSON.stringify(data), { status: status || 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
}

function getToken(request) {
  const a = request.headers.get('Authorization');
  return (a && a.startsWith('Bearer ')) ? a.slice(7) : null;
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);

    try {
      const body = ['POST', 'PUT'].includes(request.method) ? await request.json().catch(() => ({})) : {};

      if (url.pathname === '/api/auth/login' && request.method === 'POST') {
        if (body.email === env.ADMIN_EMAIL && body.password === env.ADMIN_PASSWORD) {
          const token = await signJWT({ email: body.email, role: 'admin' }, env.JWT_SECRET, 86400);
          return json({ token });
        }
        return json({ error: 'Invalid credentials' }, 401);
      }

      if (url.pathname === '/api/auth/verify' && request.method === 'GET') {
        const token = getToken(request);
        if (!token) return json({ error: 'Unauthorized' }, 401);
        try {
          const payload = await verifyJWT(token, env.JWT_SECRET);
          return json({ valid: true, email: payload.email });
        } catch { return json({ error: 'Invalid token' }, 401); }
      }

      if (url.pathname === '/api/health') return json({ status: 'ok' });

      if (url.pathname === '/api/contact' && request.method === 'POST') {
        const { name, email, topic, message } = body;
        if (!name || !email || !topic || !message) return json({ error: 'All fields are required' }, 400);
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + env.RESEND_API_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'Portfolio Contact <onboarding@resend.dev>',
            to: env.RESEND_EMAIL,
            subject: 'Portfolio Contact: ' + topic,
            html: '<p><strong>Name:</strong> ' + name + '</p><p><strong>Email:</strong> ' + email + '</p><p><strong>Message:</strong></p><p>' + message + '</p>',
          }),
        });
        if (res.ok) return json({ ok: true });
        return json({ error: 'Failed to send email' }, 500);
      }

      if (env.BACKEND_URL) {
        const headers = { 'Content-Type': 'application/json' };
        const token = getToken(request);
        if (token) headers['Authorization'] = 'Bearer ' + token;
        const res = await fetch(env.BACKEND_URL + url.pathname + url.search, {
          method: request.method,
          headers,
          body: ['POST', 'PUT'].includes(request.method) ? JSON.stringify(body) : undefined,
        });
        const text = await res.text();
        return new Response(text, { status: res.status, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
      }

      return json({ error: 'Backend not configured.' }, 501);
    } catch (err) {
      return json({ error: err.message }, 500);
    }
  },
};
