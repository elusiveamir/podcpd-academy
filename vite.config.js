# PodCPD Academy — Vercel Deployment

This is a complete, buildable Vite + React project. Previously you only had the single `App.jsx` file, which Vercel cannot deploy on its own — it needs a real project structure with a build configuration, an HTML entry point, and a React mounting file. Those are now all included.

## What was added around your existing app

- `package.json` — declares React and Vite as dependencies, defines the `build` command Vercel will run
- `vite.config.js` — tells Vite to use the React plugin so JSX compiles correctly
- `index.html` — the actual HTML page that gets served; loads your app into it
- `src/main.jsx` — mounts your `App` component into the page
- `src/App.jsx` — **this is your original file, unchanged**

## How to deploy

**Option A — GitHub + Vercel (recommended)**
1. Create a new GitHub repository
2. Upload this entire folder's contents (all files, keeping the folder structure — `src/App.jsx` must stay inside `src/`)
3. Go to vercel.com → **Add New Project** → import that GitHub repo
4. Vercel will auto-detect it as a Vite project. Leave the default build settings (Build Command: `vite build`, Output Directory: `dist`) and click **Deploy**

**Option B — Vercel CLI**
1. Install the CLI: `npm install -g vercel`
2. From inside this project folder, run: `vercel`
3. Follow the prompts — it will detect the Vite setup automatically

## Before your first deploy

Update the placeholder values in `src/App.jsx` if you haven't already:
- The 8 Square payment links + bundle link (`SQUARE` object near the top)
- The 4-digit access codes (`ACCESS_CODES` object)

## Local testing before deploying (optional but recommended)

If you have Node.js installed on your own computer:
```
npm install
npm run dev
```
This runs it locally at `http://localhost:5173` so you can click through everything before pushing live.
