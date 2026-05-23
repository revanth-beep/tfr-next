# The Finance Room — Next.js

Practitioner-led finance events platform. Next.js 14 + Prisma + Google Auth + custom admin CMS.

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Database (Vercel Postgres)
1. Go to [Vercel Dashboard](https://vercel.com) → Storage → Create Database → Postgres
2. In the database panel, go to `.env.local` tab and copy the connection strings
3. You'll get `POSTGRES_PRISMA_URL` (pooled) and `POSTGRES_URL_NON_POOLING` (direct)

### 3. Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
2. Create an OAuth 2.0 Client ID (Web application)
3. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://your-domain.vercel.app/api/auth/callback/google` (prod)

### 4. Environment variables
```bash
cp .env.example .env.local
```
Fill in all values in `.env.local`:
```env
DATABASE_URL="..."           # From Vercel Postgres (pooled)
DIRECT_URL="..."             # From Vercel Postgres (direct)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."        # openssl rand -base64 32
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
ADMIN_PASSWORD="..."         # Your chosen admin password
ADMIN_SECRET="..."           # openssl rand -hex 32
```

### 5. Push schema & seed
```bash
npm run db:push    # Push schema to Vercel Postgres
npm run db:seed    # Seed with Session 01 sample data
```

### 6. Run dev
```bash
npm run dev
```

---

## Admin CMS

Visit `/admin` — sign in with `ADMIN_PASSWORD`.

**Manage events:**
- Create: `/admin/events/new`
- Edit: `/admin/events/[id]`
- Delete: from the dashboard

**Event fields:**
| Field | Description |
|---|---|
| Title | Main event headline |
| Subtitle | Secondary description |
| Description | Full session description (markdown paragraphs, use blank lines) |
| Opening pull-quote | Highlighted quote shown at top of event page |
| Topic | Short category label (e.g. PE/VC Investments) |
| Tracks | Comma-separated interest tracks for registration form |
| Date & Time | Event datetime (shown in IST) |
| Format | Online / In-person / Hybrid |
| Duration | Session length in minutes |
| Total seats | Seat limit (registrations are capped here) |
| Practitioner | Name (optional), title, company, experience, bio |
| Published | Makes event visible to public |
| Featured | Shows on home page prominently |

---

## Vercel Deploy

1. Push to GitHub
2. Import repo in Vercel
3. Add all env vars from `.env.local` in Vercel project settings
4. Deploy — `npm run build` runs `prisma generate` automatically

---

## Tech Stack

- **Next.js 14** (App Router, Server Components, Server Actions)
- **Prisma** ORM with Vercel Postgres (Neon)
- **NextAuth v4** with Google provider + Prisma adapter
- **Tailwind CSS** with custom design tokens
- **Framer Motion** ready (installed)
- Custom cursor, progress bar, grain texture

## Design Tokens

| Token | Value | Use |
|---|---|---|
| `#08080F` | Near-black | Page background |
| `#0F0F1A` | Dark surface | Cards, nav on scroll |
| `#E8902D` | Amber | Primary accent, CTAs |
| `#F2EFE8` | Warm white | Body text |
| Bricolage Grotesque | Display font | All headings |
| Instrument Serif | Serif font | Pull quotes, italics |
| DM Sans | Body font | Body copy, UI |
