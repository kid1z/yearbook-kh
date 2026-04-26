# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack
- **Language**: JavaScript (no TypeScript)
- **Framework**: Next.js 15.4.8 (App Router), React 19
- **Styling**: Tailwind CSS 4 + CSS Modules (`*.module.css`)
- **Animation**: GSAP (with SplitText plugin) + Motion (formerly Framer Motion)
- **Package manager**: npm
- **Backend**: Appwrite (client-side SDK + server-side `node-appwrite`)

## Commands
- Install: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Start prod: `npm run start`
- Lint: `npm run lint`
- No test suite is configured.

## Architecture

```
src/
  app/
    layout.js          # Root layout — local fonts, global CSS, Appwrite Pink Icons, Google Fonts
    page.js            # "use client" — graduation landing page (GSAP intro + reveal, countdown, chat feed)
    page.module.css    # All styles for page.js + info-card.js (single CSS module)
    app.css            # @import "tailwindcss" + global custom properties
    info-card.js       # Server-compatible info card (time/location/dresscode)
    api/chat/route.js  # GET route — fetches latest 30 messages from Appwrite DB via server-side SDK
    fonts/             # Local .otf/.ttf font files loaded via next/font/local
  lib/appwrite.js      # Client-side Appwrite init (Client, Account, Databases) — uses NEXT_PUBLIC_* env vars
  static/              # SVG icons (appwrite, nextjs)
public/                # Static assets — images, photos, SVGs (school.jpg, avatar.png, flower.png, etc.)
```

- `@/*` path alias maps to `./src/*` (configured in jsconfig.json)
- API route uses server-side `node-appwrite` with API key auth; client-side lib uses `appwrite` web SDK
- Chat messages are stored in Appwrite database `69ec2b290022e98c5311`, collection `chat`

## Key patterns
- The page is a single `"use client"` component — no server/client component split
- All page styles live in one CSS Module (`page.module.css`), including sub-component styles
- GSAP animations use the `useGSAP` hook with a scope ref; SplitText instances must be reverted on cleanup
- Intro overlay auto-hides after 4.5s, then the poster reveal timeline plays
- `.env` contains both `NEXT_PUBLIC_*` (client) and `APPWRITE_API_KEY` (server) Appwrite credentials
