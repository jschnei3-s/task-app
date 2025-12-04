# Installing Stripe CLI (Manual Method)

Since automatic download isn't working, here's how to install manually:

## Option 1: Direct Download (Recommended)

1. **Visit the releases page:**
   https://github.com/stripe/stripe-cli/releases/latest

2. **Download the macOS ARM64 version:**
   - Look for `stripe_X.X.X_darwin_arm64.tar.gz`
   - Click to download

3. **Extract and install:**
   ```bash
   cd ~/Downloads
   tar -xzf stripe_*.tar.gz
   sudo mv stripe /usr/local/bin/
   ```

4. **Verify installation:**
   ```bash
   stripe --version
   ```

## Option 2: Use Stripe Dashboard (No CLI Needed)

You can test webhooks directly in the Stripe Dashboard without installing CLI - see the testing guide below.

