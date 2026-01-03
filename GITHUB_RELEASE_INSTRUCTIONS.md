# GitHub Release Instructions - Host .dmg File

## Problem
Vercel cannot serve the 95MB .dmg file properly, causing HTML error pages to download instead.

## Solution: Host on GitHub Releases

### Step 1: Create a New Release on GitHub

1. **Go to your GitHub repository**: https://github.com/KishuSInha/Metrixa-AI

2. **Click on "Releases"** (right sidebar)

3. **Click "Create a new release"**

4. **Fill in the release form**:
   - **Tag version**: `v0.1.0`
   - **Release title**: `Metrixa AI v0.1.0 - Ghost Edition`
   - **Description**:
     ```markdown
     Initial release of Metrixa AI with Ghost AI light theme design

     ## ✨ Features
     - Light-themed interface with Ghost character
     - Beautiful cloud backgrounds
     - Chat-based AI interaction
     - Permission management for Screen, File, and Location access
     - Cross-app orchestration on macOS

     ## 📥 Download
     Download the .dmg file below and drag it to your Applications folder.

     ## ⚙️ Requirements
     - macOS 10.12 or later
     - Apple Silicon (M1/M2/M3) recommended
     ```

5. **Upload the .dmg file**:
   - Drag and drop or click to upload: `/Users/utkarshsinha/Metrixa AI/desktop-app/dist/Metrixa AI-0.1.0-arm64.dmg`
   - Or rename it to: `Metrixa-AI.dmg` before uploading

6. **Check "Set as the latest release"**

7. **Click "Publish release"**

### Step 2: Copy the Download URL

After publishing, you'll get a URL like:
```
https://github.com/KishuSInha/Metrixa-AI/releases/download/v0.1.0/Metrixa-AI.dmg
```

### Step 3: Update App.tsx

The download link in `frontend/src/App.tsx` will be automatically updated to:
```tsx
<a href="https://github.com/KishuSInha/Metrixa-AI/releases/download/v0.1.0/Metrixa-AI.dmg" download>
```

### Step 4: Deploy

After completing the release, I'll rebuild and deploy the frontend.

---

## Alternative: Using GitHub CLI (if you install it)

```bash
# Install GitHub CLI
brew install gh

# Authenticate
gh auth login

# Create release
gh release create v0.1.0 "/Users/utkarshsinha/Metrixa AI/desktop-app/dist/Metrixa AI-0.1.0-arm64.dmg" \
  --title "Metrixa AI v0.1.0 - Ghost Edition" \
  --notes "Initial release with Ghost AI design"
```
