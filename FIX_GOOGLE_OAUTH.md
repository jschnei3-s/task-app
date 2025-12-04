# Fix Google OAuth Redirect URI Error

## Error
`Error 400: redirect_uri_mismatch`

## Solution

### Step 1: Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/apis/credentials
2. Make sure you're in the correct project

### Step 2: Find Your OAuth 2.0 Client
1. Look for "OAuth 2.0 Client IDs" in the credentials list
2. Click on your client (or create a new one if needed)

### Step 3: Add Authorized Redirect URIs

Add these **exact** URIs (copy-paste, don't modify):

**For Production:**
```
https://gnoknthlsubjmigmbecy.supabase.co/auth/v1/callback
```

**For Local Development (if testing locally):**
```
http://localhost:3000/auth/v1/callback
http://127.0.0.1:3000/auth/v1/callback
```

### Step 4: Save Changes
- Click **"Save"** at the bottom
- Wait a few seconds for changes to propagate

### Step 5: Test Again
1. Go back to your app
2. Try signing in with Google again
3. It should work now!

## Important Notes

- The redirect URI **must match exactly** - no trailing slashes, correct protocol (https/http)
- Changes can take a few minutes to propagate
- Make sure you're using the correct Google Cloud project
- The redirect URI goes to Supabase, not directly to your app

## Verify Your Setup

1. **Check Supabase Dashboard:**
   - Go to: https://supabase.com/dashboard/project/gnoknthlsubjmigmbecy/auth/providers
   - Make sure Google provider is enabled
   - Verify Client ID and Secret are set

2. **Check Google Cloud Console:**
   - Verify the redirect URI is in the list
   - Make sure OAuth consent screen is configured

