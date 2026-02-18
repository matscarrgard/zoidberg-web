# 🦀 Zoidberg Web

A Next.js chat interface for [Zoidberg](https://github.com/openclaw/openclaw) — your claw-powered AI assistant.

## Features

- 💬 Real-time chat with Zoidberg via OpenClaw
- 🔐 Cognito authentication (protected access)
- 🎨 Ocean-themed dark UI with Tailwind CSS
- 📱 Responsive design
- ⚡ Deployed on AWS Amplify

## Architecture

```
Browser → Amplify (Next.js) → API Route → OpenClaw Gateway → Bedrock (Opus 4.6)
                ↓
         Cognito Auth
```

## Local Development

```bash
npm install
npm run dev
```

Set environment variables:

```bash
OPENCLAW_GATEWAY_URL=http://localhost:18789
OPENCLAW_GATEWAY_TOKEN=your_token_here
```

## Deployment

This app is designed to be deployed on **AWS Amplify** with:
- Cognito User Pool for authentication
- Environment variables for OpenClaw gateway connection

## Tech Stack

- [Next.js 15](https://nextjs.org/) with App Router
- [Tailwind CSS](https://tailwindcss.com/) 
- [AWS Amplify](https://aws.amazon.com/amplify/)
- [Amazon Cognito](https://aws.amazon.com/cognito/)
- [OpenClaw](https://github.com/openclaw/openclaw)

---

*Why not Zoidberg? (V)(;,,;)(V)*
