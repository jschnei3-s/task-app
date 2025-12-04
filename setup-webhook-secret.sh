#!/bin/bash

# Helper script to set up Stripe webhook secret
# Usage: ./setup-webhook-secret.sh whsec_YOUR_SECRET_HERE

if [ -z "$1" ]; then
  echo "❌ Error: Webhook secret required"
  echo ""
  echo "Usage: ./setup-webhook-secret.sh whsec_YOUR_SECRET_HERE"
  echo ""
  echo "To get your webhook secret:"
  echo "1. Go to: https://dashboard.stripe.com/test/webhooks"
  echo "2. Create endpoint: https://gnoknthlsubjmigmbecy.supabase.co/functions/v1/stripe-webhook"
  echo "3. Copy the 'Signing secret' (starts with whsec_)"
  exit 1
fi

WEBHOOK_SECRET=$1
PROJECT_REF="gnoknthlsubjmigmbecy"

echo "🔧 Setting up Stripe webhook secret..."
echo ""

# Set the secret
echo "Setting STRIPE_WEBHOOK_SECRET in Supabase..."
npx supabase secrets set STRIPE_WEBHOOK_SECRET="$WEBHOOK_SECRET" --project-ref "$PROJECT_REF"

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Webhook secret set successfully!"
  echo ""
  echo "📋 Next steps:"
  echo "1. Disable JWT verification:"
  echo "   https://supabase.com/dashboard/project/$PROJECT_REF/functions/stripe-webhook"
  echo "   → Go to 'Details' tab → Turn OFF 'Enforce JWT Verification'"
  echo ""
  echo "2. Test the webhook in Stripe Dashboard:"
  echo "   https://dashboard.stripe.com/test/webhooks"
  echo "   → Click 'Send test webhook' → Select 'checkout.session.completed'"
  echo ""
  echo "3. Check logs:"
  echo "   https://supabase.com/dashboard/project/$PROJECT_REF/functions/stripe-webhook/logs"
else
  echo ""
  echo "❌ Failed to set webhook secret. Please check the error above."
  exit 1
fi

