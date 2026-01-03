# Metrixa AI - The Intelligent OS Layer

Metrixa AI is now a professional, downloadable platform with a premium marketing presence and a powerful Electron-based desktop tool.

## 📂 Project Structure

- **`/landing-page`**: React + Tailwind CSS marketing site
- **`/desktop-app`**: Electron + Node.js desktop application with system-level control.
- **`/backend`**: (Legacy) Python service (can still be used for advanced AI logic).

## 🚀 Getting Started

### 1. View the Landing Page
```bash
cd landing-page
npm install
npm run dev
```
Explore the premium, optimistic UI designed to wow your users.

### 2. Launch the Desktop App
```bash
cd desktop-app
npm install
npm start
```
The floating AI bar will appear. Try typing "open notepad" or "calc" to see the PowerShell integration in action.

## 📦 Packaging for Windows
To create a real installable `.exe` for Windows:
```bash
cd desktop-app
# Add electron-builder configuration to package.json
npm install electron-builder --save-dev
npx electron-builder --windows
```

## ✨ Why this version wins
- **SaaS-Ready**: Professional branding and marketing flow.
- **Installable**: Users feel like they are getting a "real" product, not just a website.
- **100% JS**: Simplified maintenance and rapid iteration.
