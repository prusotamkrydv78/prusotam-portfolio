import { NextRequest, NextResponse } from 'next/server'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const name    = String(body.name ?? '').trim()
    const email   = String(body.email ?? '').trim()
    const message = String(body.message ?? '').trim()
    const honeypot = String(body.company ?? '')   // hidden field; only bots fill it

    /* Bot caught by honeypot — pretend success, send nothing */
    if (honeypot) return NextResponse.json({ ok: true })

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    if (name.length > 100 || email.length > 150 || message.length > 5000) {
      return NextResponse.json({ error: 'Field too long' }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      /* No key configured. In dev, log & succeed so local testing works.
         In production this is a misconfiguration — fail loudly so the form
         never reports a false success to a real visitor. */
      if (process.env.NODE_ENV !== 'production') {
        console.log('Contact form (dev, no RESEND_API_KEY):', { name, email, message })
        return NextResponse.json({ ok: true })
      }
      console.error('RESEND_API_KEY is not set — cannot send contact email')
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
    }

    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)

    await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: 'prusotamkumaryadav78@gmail.com',
      subject: `Portfolio contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      replyTo: email,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
