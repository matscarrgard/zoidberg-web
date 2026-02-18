import { NextRequest, NextResponse } from 'next/server';

const OPENCLAW_GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:18789';
const OPENCLAW_GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN || '';

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Forward to OpenClaw gateway
    const response = await fetch(`${OPENCLAW_GATEWAY_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(OPENCLAW_GATEWAY_TOKEN && {
          Authorization: `Bearer ${OPENCLAW_GATEWAY_TOKEN}`,
        }),
      },
      body: JSON.stringify({
        message,
        sessionId: sessionId || undefined,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenClaw gateway error:', error);
      return NextResponse.json(
        { error: 'Failed to get response from Zoidberg' },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
