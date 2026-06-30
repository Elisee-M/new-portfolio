import { SignJWT, jwtVerify } from 'jose';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

function getAuthToken(request) {
  const auth = request.headers.get('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) return null;
  return auth.slice(7);
}

async function verifyAdmin(request, env) {
  const token = getAuthToken(request);
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(env.JWT_SECRET));
    return payload;
  } catch {
    return null;
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (!path.startsWith('/api/')) {
      return env.ASSETS.fetch(request);
    }

    try {
      const body = ['POST', 'PUT'].includes(request.method)
        ? await request.json().catch(() => ({}))
        : {};

      // Health check
      if (path === '/api/health') {
        return json({ status: 'ok' });
      }

      // Auth login
      if (path === '/api/auth/login' && request.method === 'POST') {
        if (body.email === env.ADMIN_EMAIL && body.password === env.ADMIN_PASSWORD) {
          const secret = new TextEncoder().encode(env.JWT_SECRET);
          const token = await new SignJWT({ email: body.email, role: 'admin' })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .sign(secret);
          return json({ token });
        }
        return json({ error: 'Invalid credentials' }, 401);
      }

      // Auth verify
      if (path === '/api/auth/verify' && request.method === 'GET') {
        const payload = await verifyAdmin(request, env);
        if (payload) return json({ valid: true, email: payload.email });
        return json({ error: 'Unauthorized' }, 401);
      }

      // Contact form
      if (path === '/api/contact' && request.method === 'POST') {
        const { name, email, topic, message } = body;
        if (!name || !email || !topic || !message) {
          return json({ error: 'All fields are required' }, 400);
        }

        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Portfolio Contact <onboarding@resend.dev>',
            to: env.RESEND_EMAIL,
            subject: `Portfolio Contact: ${topic}`,
            html: `<h2>New Contact Message</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Topic:</strong> ${topic}</p>
<p><strong>Message:</strong></p>
<p>${message}</p>`,
          }),
        });

        if (res.ok) return json({ ok: true });
        const err = await res.text();
        return json({ error: 'Failed to send email', detail: err }, 500);
      }

      // Proxy to backend if configured
      if (env.BACKEND_URL) {
        const target = `${env.BACKEND_URL}${path}${url.search}`;
        const proxyHeaders = { 'Content-Type': 'application/json' };
        const token = getAuthToken(request);
        if (token) proxyHeaders['Authorization'] = `Bearer ${token}`;

        const proxyRes = await fetch(target, {
          method: request.method,
          headers: proxyHeaders,
          body: ['POST', 'PUT'].includes(request.method) ? JSON.stringify(body) : undefined,
        });

        const proxyBody = await proxyRes.text();
        return new Response(proxyBody, {
          status: proxyRes.status,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      return json({ error: 'Backend not configured. Set BACKEND_URL env var or deploy the Express backend separately.' }, 501);
    } catch (err) {
      return json({ error: err.message }, 500);
    }
  },
};
