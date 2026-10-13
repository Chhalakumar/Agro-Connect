# Fix Vercel Node.js Version Error

## The Problem
You're getting: "Found invalid or discontinued Node.js Version: 18.x"

This happens because Vercel is still reading old configuration or cached deployment settings.

---

## Solution: Reconfigure Vercel Project Settings

### Step 1: Go to Project Settings

1. Open your Vercel dashboard
2. Click on your **backend** project
3. Click **"Settings"** (top navigation)

### Step 2: Update Node.js Version in Settings

1. In Settings, click **"General"** in left sidebar
2. Scroll down to **"Node.js Version"**
3. Change it to: **20.x** (select from dropdown)
4. Click **"Save"**

### Step 3: Clear Old Deployments

1. Go to **"Deployments"** tab
2. Find the latest deployment
3. Click the 3 dots (•••)
4. Click **"Delete"** (delete old failed deployments)

### Step 4: Trigger Fresh Deployment

Option A - From GitHub (Recommended):
```bash
# Make a small change and push
cd c:\Users\vivek\Downloads\Agro-Connect\Agro-Connect
git commit --allow-empty -m "Trigger fresh Vercel deployment"
git push
```

Option B - From Vercel:
1. Go to **"Deployments"** tab
2. Click **"Redeploy"** button
3. **IMPORTANT:** Uncheck "Use existing Build Cache" ❌
4. Click **"Redeploy"**

---

## Alternative: Delete and Recreate Project

If the above doesn't work, you may need to delete and recreate:

### Step 1: Delete Vercel Project

1. Go to Project Settings
2. Scroll to bottom
3. Click **"Delete Project"**
4. Confirm deletion

### Step 2: Create New Project

1. Go to https://vercel.com/new
2. Import your GitHub repo again
3. Configure:
   - **Root Directory:** `server`
   - **Framework Preset:** Other
   - **Node.js Version:** 20.x (in dropdown)
   - **Build Command:** Leave empty
   - **Output Directory:** Leave empty

4. Add all environment variables again

5. Deploy

---

## Verify package.json Files

Make sure both package.json files have the correct Node version:

### Root package.json:
```json
{
  "engines": {
    "node": "20.x"
  },
  "dependencies": {
    "@google/genai": "^2.23.0"
  }
}
```

### server/package.json:
```json
{
  "name": "backend",
  "version": "1.0.0",
  "engines": {
    "node": "20.x"
  },
  ...
}
```

---

## Check Deployment Logs

After deploying, check the logs:

1. Go to Deployments
2. Click on the deployment
3. Click "Building" or "Build Logs"
4. Look for: `Using Node.js 20.x` ✅

If you still see `18.x`, the settings haven't been updated properly.

---

## Last Resort: Use vercel.json to Force Node Version

Add this to `server/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node",
      "config": {
        "maxLambdaSize": "50mb"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ]
}
```

Then in Vercel project settings, manually select Node.js 20.x.

---

## Important Note

Vercel sometimes caches the Node.js version from the **first deployment**. That's why deleting and recreating the project often fixes the issue immediately.

---

## Expected Success Output

When it works, you should see in build logs:

```
✓ Installing dependencies...
✓ Using Node.js 20.x
✓ Building...
✓ Build completed
```

NOT:

```
✗ Found invalid Node.js Version: "18.x"
```
