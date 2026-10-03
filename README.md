# @iBzA Tuition Class — Student & Certificate Manager

A Next.js app to manage students, test results and official certificates for
**@iBzA Tuition Class**. Every test result you add first lands in **Pending
Approval** — nothing is added to a student's record (and no certificate can
be generated) until you tap **Accept**.

## What's inside

- Add students with name, batch, phone, parent's phone, date of birth,
  address and a photo
- Add test results per student (with a photo of the hard-copy exam paper)
- Every new result waits in **Pending Approval** until you accept it
- One-tap official certificate generation (PNG, print-ready) for accepted
  **Pass** results — includes a unique Certificate ID, the date, and your
  digital signature (auto-styled from your name in Settings)
- Institute Settings page — set your institute name, tagline, your name &
  title (used for the signature), and contact details
- All data is stored locally in the browser (no account, no server needed)

## Run it on your computer

You need [Node.js](https://nodejs.org) 18 or newer installed.

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Put it live on the internet (free) — Vercel

1. Create a free account at https://vercel.com (you can sign up with GitHub,
   GitLab, or an email address).
2. Create a free account at https://github.com if you don't have one, create
   a new empty repository, and push this project to it:
   ```bash
   git init
   git add .
   git commit -m "iBzA Tuition Class"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
3. In Vercel, click **Add New → Project**, pick your repository, and click
   **Deploy**. No settings need to change — Vercel detects Next.js
   automatically.
4. In a minute or two you'll get a live link like
   `https://ibza-tuition.vercel.app` that works on every device — phone,
   tablet, laptop.

(You can also drag-and-drop deploy without Git using the Vercel CLI:
`npx vercel` from this folder, then follow the prompts.)

## Important note about data storage

This version stores all data **in your browser's local storage only** — it
is private to one browser on one device, and is not synced anywhere. This
was the simple option you chose. If you'd like to switch later to a shared
online database (so you and/or students can add things from different
phones/computers and see the same data), that's a bigger change — just ask
and it can be added using a free database like Firebase or Supabase.

## Customising your signature

Right now your signature is your name, auto-rendered in a stylish script
font on every certificate (set it under **Settings → Your Name**). If you'd
rather use a photo of your actual handwritten signature:

1. Sign your name on a plain white sheet of paper with a dark pen.
2. Take a clear, well-lit photo (or scan it).
3. Crop it tightly and remove the background so only the signature remains
   on a transparent PNG (apps like **remove.bg** or **Background Eraser**
   can do this for free).
4. Save the file as `public/signature.png` in this project.
5. Ask Claude to wire it into `lib/certificate.ts` in place of the script
   font — a one-line change once the file is in place.

## Project structure

```
app/            Next.js pages (App Router)
components/     UI building blocks (forms, cards, certificate trigger)
lib/            Data storage, types, and the certificate generator
public/         Static files (add signature.png here if you use one)
```
# tutionclasses
