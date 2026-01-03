# Metrixa AI Deployment Guide

This guide explains how to deploy the Metrixa AI ecosystem online.

## 1. Backend (FastAPI) - Deploy to Render
1. Create a [Render](https://render.com/) account.
2. Connect your GitHub repository containing the `backend/` folder.
3. Use the following settings (if you don't use the `render.yaml` blueprint):
   - **Environment**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app`
4. Add **Environment Variables**:
   - `OPENAI_API_KEY`: Your OpenAI API key.
5. Copy the **Service URL** (e.g., `https://metrixa-backend.onrender.com`).

## 2. Frontend (Landing Page) - Deploy to Vercel/Netlify
1. Create a [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/) account.
2. Connect your repository and select the `frontend/` folder as the root.
3. Set the **Build Command**: `npm run build`
4. Set the **Output Directory**: `dist`
5. Add **Environment Variables**:
   - `VITE_API_URL`: The URL of your deployed backend from Step 1.

## 3. Desktop App (Electron) - Build and Distribute
1. Go to the `desktop-app/` directory.
2. Run `npm install` (if not already done).
3. Run `npm run build:dmg`.
4. The `.dmg` file will be generated in the `dist/` folder.
5. To distribute it:
   - Upload the `.dmg` to a public storage (S3, GitHub Releases, etc.).
   - Update the **Download Link** in `frontend/src/App.tsx` (line 91) to point to your hosted file.

```typescript
// Example update in App.tsx
<a href="https://your-storage-url.com/Metrixa-AI.dmg" download ...>
```

## Maintenance & Monitoring
- Check Render logs for backend errors.
- Ensure your OpenAI quota is sufficient.
- The desktop app will need to be re-built and distributed whenever you make major changes to the Electron logic.
