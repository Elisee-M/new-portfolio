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

async function requireAuth(request, env) {
  const token = getToken(request);
  if (!token) return null;
  try { return await verifyJWT(token, env.JWT_SECRET); } catch { return null; }
}

async function getKV(kv, key) {
  const val = await kv.get(key);
  return val ? JSON.parse(val) : null;
}

function genId() {
  return crypto.randomUUID();
}

function matchPath(path, pattern) {
  const patParts = pattern.split('/');
  const pathParts = path.split('/');
  if (patParts.length !== pathParts.length) return null;
  const params = {};
  for (let i = 0; i < patParts.length; i++) {
    if (patParts[i].startsWith(':')) {
      params[patParts[i].slice(1)] = pathParts[i];
    } else if (patParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return params;
}

async function handleCrud(kv, type, method, params, body, user) {
  const items = (await getKV(kv, type)) || [];

  if (method === 'GET' && !params?.id) return json(items);

  if (method === 'POST') {
    if (!user) return json({ error: 'Unauthorized' }, 401);
    const id = genId();
    const item = { ...body, id, _id: id };
    items.push(item);
    await kv.put(type, JSON.stringify(items));
    return json(item, 201);
  }

  if (params?.id) {
    const idx = items.findIndex(i => i.id === params.id || i._id === params.id);
    if (idx === -1) return json({ error: 'Not found' }, 404);

    if (method === 'GET') return json(items[idx]);

    if (method === 'PUT') {
      if (!user) return json({ error: 'Unauthorized' }, 401);
      items[idx] = { ...items[idx], ...body, id: items[idx].id, _id: items[idx]._id };
      await kv.put(type, JSON.stringify(items));
      return json(items[idx]);
    }

    if (method === 'DELETE') {
      if (!user) return json({ error: 'Unauthorized' }, 401);
      const removed = items.splice(idx, 1)[0];
      await kv.put(type, JSON.stringify(items));
      return json(removed);
    }
  }

  return json({ error: 'Method not allowed' }, 405);
}

const CRUD_TYPES = ['projects', 'skills', 'experiences', 'certifications', 'ratings'];

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const url = new URL(request.url);
  const path = url.pathname;

  try {
    const body = ['POST', 'PUT'].includes(request.method) ? await request.json().catch(() => ({})) : {};

    if (path === '/api/auth/login' && request.method === 'POST') {
      if (body.email === env.ADMIN_EMAIL && body.password === env.ADMIN_PASSWORD) {
        const token = await signJWT({ email: body.email, role: 'admin' }, env.JWT_SECRET, 86400);
        return json({ token });
      }
      return json({ error: 'Invalid credentials' }, 401);
    }

    if (path === '/api/auth/verify' && request.method === 'GET') {
      const token = getToken(request);
      if (!token) return json({ error: 'Unauthorized' }, 401);
      try {
        const payload = await verifyJWT(token, env.JWT_SECRET);
        return json({ valid: true, email: payload.email });
      } catch { return json({ error: 'Invalid token' }, 401); }
    }

    if (path === '/api/health') return json({ status: 'ok' });

    if (path === '/api/contact' && request.method === 'POST') {
      const { name, email, topic, message } = body;
      if (!name || !email || !topic || !message) return json({ error: 'All fields are required' }, 400);
      const resendHeaders = { Authorization: 'Bearer ' + env.RESEND_API_KEY, 'Content-Type': 'application/json' };
      const [notify, reply] = await Promise.all([
        fetch('https://api.resend.com/emails', {
          method: 'POST', headers: resendHeaders,
          body: JSON.stringify({
            from: 'Elisee <onboarding@resend.dev>',
            to: env.RESEND_EMAIL,
            subject: 'Portfolio Contact: ' + topic,
            html: '<p><strong>Name:</strong> ' + name + '</p><p><strong>Email:</strong> ' + email + '</p><p><strong>Message:</strong></p><p>' + message + '</p>',
          }),
        }),
        fetch('https://api.resend.com/emails', {
          method: 'POST', headers: resendHeaders,
          body: JSON.stringify({
            from: 'Elisee <onboarding@resend.dev>',
            to: email,
            subject: "Thanks for contacting me!",
            html: "I got your message 👍 I'll reply soon.",
          }),
        }),
      ]);
      if (notify.ok) return json({ ok: true, replySent: reply.ok });
      return json({ error: 'Failed to send email' }, 500);
    }

    if (path === '/api/cv/download' && request.method === 'GET') {
      const cv = await getKV(env.PORTFOLIO_KV, 'cv_meta');
      if (!cv || !cv.data) return json({ error: 'No CV uploaded' }, 404);
      const bytes = Uint8Array.from(atob(cv.data), c => c.charCodeAt(0));
      return new Response(bytes, {
        headers: {
          'Content-Type': cv.contentType || 'application/pdf',
          'Content-Disposition': 'inline; filename="' + (cv.filename || 'Elisee_CV.pdf') + '"',
          ...corsHeaders,
        },
      });
    }

    if (path === '/api/cv/upload' && request.method === 'POST') {
      const user = await requireAuth(request, env);
      if (!user) return json({ error: 'Unauthorized' }, 401);
      const fd = await request.formData();
      const file = fd.get('cv');
      if (!file) return json({ error: 'No file provided' }, 400);
      const buffer = await file.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
      await env.PORTFOLIO_KV.put('cv_meta', JSON.stringify({
        filename: file.name,
        contentType: file.type,
        data: base64,
      }));
      return json({ url: '/api/cv/download' });
    }

    if (path === '/api/cv') {
      const cv = await getKV(env.PORTFOLIO_KV, 'cv_meta');
      return json({ url: cv && cv.data ? '/api/cv/download' : null });
    }

    for (const type of CRUD_TYPES) {
      const params = matchPath(path, `/api/${type}/:id`) || (path === `/api/${type}` ? {} : null);
      if (params !== null) {
        const user = (method === 'GET') ? true : await requireAuth(request, env);
        if (type === 'ratings' && method === 'POST') {
          return handleCrud(env.PORTFOLIO_KV, type, method, params, body, { role: 'public' });
        }
        return handleCrud(env.PORTFOLIO_KV, type, method, params, body, user);
      }
    }

    return json({ error: 'Not found' }, 404);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
