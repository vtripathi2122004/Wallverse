# 🖼️ Wallpaper Hub

A private gallery where friends upload self-clicked photos, automatically formatted as wallpapers for desktop and mobile screens. Built with **Next.js 14**, **Cloudflare R2**, and **Supabase**.

---

## ✨ Features

- **Upload** photos with drag-and-drop, choose Desktop or Mobile category
- **Auto-resize** with `sharp`: Desktop → 1920×1080, Mobile → 1080×1920 (cover crop)
- **Browse** a responsive image gallery with category filters
- **Preview** photos in a full-screen lightbox
- **Download** the perfectly-cropped wallpaper directly to your device
- No login required — share the link with trusted friends

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend + Backend | Next.js 14 (App Router, TypeScript) |
| Image Resizing | `sharp` (server-side, Node.js runtime) |
| File Storage | Cloudflare R2 (S3-compatible, generous free tier) |
| Database | Supabase PostgreSQL (metadata only) |
| Styling | Tailwind CSS |
| Deployment | Vercel |

---

## 🚀 Setup Guide

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd WallpaperHub
npm install
```

### 2. Create the Supabase Table

1. Go to your [Supabase project](https://supabase.com/dashboard) → **SQL Editor**
2. Run the following SQL:

```sql
-- Create the wallpapers metadata table
create table if not exists wallpapers (
  id          uuid primary key default gen_random_uuid(),
  name        text,
  category    text not null check (category in ('desktop', 'mobile')),
  r2_key      text not null unique,
  created_at  timestamptz not null default now()
);

-- Index for fast category filtering
create index if not exists wallpapers_category_idx on wallpapers (category);

-- Index for chronological ordering
create index if not exists wallpapers_created_idx on wallpapers (created_at desc);

-- Optional: Row Level Security (RLS) — disable or configure as needed
-- Since this is an open-access app, you can leave RLS disabled for now.
-- alter table wallpapers enable row level security;
```

### 3. Set Up Cloudflare R2

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **R2 Object Storage** → **Create bucket**
   - Name it something like `wallpaper-hub`
3. **Enable public access** on the bucket:
   - Bucket → **Settings** → **Public Access** → Allow
   - Note the public bucket URL (e.g., `https://pub-XXXXX.r2.dev`)
4. **Create an API token**:
   - R2 → **Manage R2 API Tokens** → **Create API Token**
   - Permission: **Object Read & Write** for your bucket
   - Copy the **Access Key ID** and **Secret Access Key**
5. Find your **Account ID** in the Cloudflare dashboard sidebar

### 4. Configure Environment Variables

Copy the example file and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

| Variable | Where to find it |
|---|---|
| `R2_ACCOUNT_ID` | Cloudflare dashboard → right sidebar |
| `R2_ACCESS_KEY_ID` | R2 API Token you created |
| `R2_SECRET_ACCESS_KEY` | R2 API Token you created |
| `R2_BUCKET_NAME` | The name of your R2 bucket |
| `R2_PUBLIC_URL` | Bucket → Settings → Public URL |
| `NEXT_PUBLIC_R2_PUBLIC_URL` | Same as `R2_PUBLIC_URL` (exposed to browser for image rendering) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → `service_role` secret |

> ⚠️ **Security note:** `SUPABASE_SERVICE_ROLE_KEY` is server-only. It is **never** sent to the browser.

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

- **Gallery**: `/` — browse all wallpapers
- **Upload**: `/upload` — add a new wallpaper

---

## ☁️ Deploy to Vercel

### Option A: Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option B: Vercel Dashboard

1. Push your code to a GitHub/GitLab/Bitbucket repo
2. Go to [vercel.com/new](https://vercel.com/new) → import your repository
3. Framework preset: **Next.js** (auto-detected)
4. **Add all environment variables** from your `.env.local` file in the Vercel project settings
5. Deploy!

> **Important:** Add every env variable from `.env.local.example` in Vercel → Project Settings → Environment Variables. Without them, the app will fail to start.

---

## 📁 Project Structure

```
WallpaperHub/
├── app/
│   ├── layout.tsx              # Root layout + metadata
│   ├── page.tsx                # Gallery (ISR, 30s revalidation)
│   ├── globals.css             # Global styles + design tokens
│   ├── upload/
│   │   └── page.tsx            # Upload page
│   └── api/
│       ├── upload/route.ts     # POST: resize → R2 → Supabase
│       └── download/[key]/
│           └── route.ts        # GET: stream from R2 as download
├── components/
│   ├── Navbar.tsx
│   ├── Gallery.tsx             # Tabs + grid (client component)
│   ├── ImageCard.tsx           # Thumbnail with hover overlay
│   ├── Lightbox.tsx            # Full preview + download modal
│   └── UploadForm.tsx          # Drag-drop upload form
├── lib/
│   ├── r2.ts                   # Cloudflare R2 S3 client
│   └── supabase.ts             # Supabase server client
├── types/
│   └── wallpaper.ts            # TypeScript types
├── .env.local.example          # Env var template
└── README.md
```

---

## 🔒 Security Notes

- All file uploads are validated server-side (type check, 15 MB size limit)
- Images are re-encoded by `sharp` — no raw user files are stored as-is
- R2 keys are base64url-encoded in download URLs (prevents path traversal)
- The download endpoint verifies the key exists in Supabase before fetching from R2
- `SUPABASE_SERVICE_ROLE_KEY` is never bundled into the client

---

## 🛠️ Local Development Tips

```bash
# Install dependencies
npm install

# Start dev server with hot reload
npm run dev

# Type-check without building
npx tsc --noEmit

# Build for production (validates everything)
npm run build
```

---

## 📝 License

MIT — use it however you like.
