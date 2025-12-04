# Setting Up Stripe Webhook Endpoint in Dashboard

## Step-by-Step Instructions

### 1. Go to Stripe Webhooks Dashboard
Visit: https://dashboard.stripe.com/test/webhooks

**Make sure you're in TEST MODE** (toggle in top right should say "Test mode")

### 2. Add the Webhook Endpoint

1. Click the **"+ Add endpoint"** button (top right)
2. In the "Endpoint URL" field, enter:
   ```
   https://gnoknthlsubjmigmbecy.supabase.co/functions/v1/stripe-webhook
   ```
3. Click **"Select events"** button
4. In the events list, check these two events:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.deleted`
5. Click **"Add endpoint"** button at the bottom

### 3. Get the Signing Secret

After creating the endpoint:
- You'll see a **"Signing secret"** (starts with `whsec_...`)
- **Copy this secret** - you'll need it (but it looks like you already have one set)

### 4. Test the Webhook

Once the endpoint is created:
1. Click on your webhook endpoint in the list
2. Scroll down to the **"Recent events"** section
3. Click **"Send test webhook"** button
4. Select event type: `checkout.session.completed`
5. Click **"Send test webhook"**

### 5. Check the Results

- **In Stripe**: You should see a 200 OK response
- **In Supabase Logs**: Check https://supabase.com/dashboard/project/gnoknthlsubjmigmbecy/functions/stripe-webhook/logs

---

## Alternative: If You Want to Use Stripe CLI

If you prefer using CLI, you need to:
1. Install Stripe CLI (download from GitHub releases)
2. Run `stripe login`
3. Run `stripe listen --forward-to https://gnoknthlsubjmigmbecy.supabase.co/functions/v1/stripe-webhook`
4. In another terminal: `stripe trigger checkout.session.completed`

But the Dashboard method is easier and doesn't require CLI installation!

