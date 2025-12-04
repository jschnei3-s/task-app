# Testing Stripe Webhook - Step by Step Guide

Your webhook endpoint: `https://gnoknthlsubjmigmbecy.supabase.co/functions/v1/stripe-webhook`

## Method 1: Test via Stripe Dashboard (Easiest - No CLI Needed)

### Step 1: Set up Webhook Endpoint in Stripe

1. **Go to Stripe Dashboard:**
   - Visit: https://dashboard.stripe.com/test/webhooks
   - Make sure you're in **Test mode** (toggle in top right)

2. **Add Webhook Endpoint:**
   - Click **"+ Add endpoint"** button
   - Enter endpoint URL:
     ```
     https://gnoknthlsubjmigmbecy.supabase.co/functions/v1/stripe-webhook
     ```
   - Click **"Select events"**

3. **Select Events:**
   - Check these events:
     - ✅ `checkout.session.completed`
     - ✅ `customer.subscription.deleted`
   - Click **"Add endpoint"**

4. **Save the Signing Secret:**
   - After creating, you'll see a **"Signing secret"** (starts with `whsec_...`)
   - **Copy this** - you'll need it for Supabase secrets

### Step 2: Set Webhook Secret in Supabase

Run this command (replace `whsec_...` with your actual secret):

```bash
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE --project-ref gnoknthlsubjmigmbecy
```

### Step 3: Disable JWT Verification (Important!)

Your webhook function needs to accept requests from Stripe without JWT:

1. Go to: https://supabase.com/dashboard/project/gnoknthlsubjmigmbecy/functions/stripe-webhook
2. Click **"Details"** tab
3. Find **"Enforce JWT Verification"**
4. **Disable it** (toggle off)

### Step 4: Send Test Webhook

1. In Stripe Dashboard, go to your webhook endpoint
2. Click **"Send test webhook"**
3. Select event: `checkout.session.completed`
4. Click **"Send test webhook"**

### Step 5: Check Results

1. **Check Stripe Dashboard:**
   - Look at the webhook endpoint page
   - You should see a successful response (200 status)

2. **Check Supabase Logs:**
   - Go to: https://supabase.com/dashboard/project/gnoknthlsubjmigmbecy/functions/stripe-webhook/logs
   - You should see logs like:
     ```
     🌍 Stripe Webhook is running...
     Received event: checkout.session.completed
     ✅ Webhook processed successfully
     ```

3. **Check Database:**
   - The webhook should update `profiles.subscription_plan` to `premium`
   - You can verify in Supabase Dashboard > Table Editor > profiles

## Method 2: Using Stripe CLI (If you install it later)

Once Stripe CLI is installed:

1. **Login:**
   ```bash
   stripe login
   ```

2. **Forward webhooks:**
   ```bash
   stripe listen --forward-to https://gnoknthlsubjmigmbecy.supabase.co/functions/v1/stripe-webhook
   ```

3. **In another terminal, trigger events:**
   ```bash
   stripe trigger checkout.session.completed
   stripe trigger customer.subscription.deleted
   ```

## Troubleshooting

- **401 Unauthorized:** Make sure JWT verification is disabled
- **Invalid signature:** Check that STRIPE_WEBHOOK_SECRET is set correctly
- **No logs:** Check that the function is deployed and active

