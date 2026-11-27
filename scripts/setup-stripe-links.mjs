#!/usr/bin/env node
/**
 * One-shot Stripe Products & Payment Links provisioner for Cougars & Cubs Club.
 *
 * SAFETY GUARDRAIL:
 * - Refuses to run against other-projects (acct_1H31MFAJieCRWgkr)!
 * - Verifies active Stripe account ID matches Cougars & Cubs Club (acct_1UfZxrGe1v4Y7bXE)
 *   before creating products (+15 Velvet Credits $2.99, VIP Black Card $6.99, Martini Tip $5, Cameo $29).
 *
 * Usage (after completing Stripe onboarding on acct_1UfZxrGe1v4Y7bXE):
 *   STRIPE_SECRET_KEY=sk_live_... node scripts/setup-stripe-links.mjs
 */

const EXPECTED_ACCOUNT_ID = 'acct_1UfZxrGe1v4Y7bXE';
const FORBIDDEN_ACCOUNT_ID = 'acct_1H31MFAJieCRWgkr'; // other-projects, NEVER TOUCH

const apiKey = process.env.STRIPE_SECRET_KEY;
if (!apiKey) {
  console.error('Missing STRIPE_SECRET_KEY environment variable.');
  process.exit(1);
}

async function stripeGet(path) {
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || `Stripe GET ${path} failed`);
  return data;
}

async function stripePost(path, params) {
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(params).toString(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || `Stripe POST ${path} failed`);
  return data;
}

const acct = await stripeGet('/account');
if (acct.id === FORBIDDEN_ACCOUNT_ID) {
  console.error(
    `ABORTING: Key belongs to ${FORBIDDEN_ACCOUNT_ID} (other-projects)! Use the key from Cougars & Cubs Club (${EXPECTED_ACCOUNT_ID}).`,
  );
  process.exit(1);
}
if (acct.id !== EXPECTED_ACCOUNT_ID) {
  console.error(
    `ABORTING: Expected Cougars & Cubs Club account ${EXPECTED_ACCOUNT_ID}, got ${acct.id}.`,
  );
  process.exit(1);
}

console.log(`Verified dedicated Stripe account: ${acct.id} (${acct.settings?.dashboard?.display_name || 'Cougars & Cubs Club'})`);

const catalog = [
  {
    key: 'stripeCreditPackUrl',
    name: 'Cougars & Cubs Club, +15 Velvet Credits Pack',
    amount: '299',
    tier: 'credits',
    successUrl: 'https://cougarsandcubs.club/?session_id={CHECKOUT_SESSION_ID}',
  },
  {
    key: 'stripeVipPassUrl',
    name: 'Cougars & Cubs Club, Lifetime VIP Black Card',
    amount: '699',
    tier: 'vip',
    successUrl: 'https://cougarsandcubs.club/?session_id={CHECKOUT_SESSION_ID}&unlock=VELVETVIP',
  },
  {
    key: 'tipJarUrl',
    name: 'Espresso Martini Creator Tip, Cougars & Cubs Club',
    amount: '500',
    tier: 'tip',
    successUrl: 'https://cougarsandcubs.club/',
  },
  {
    key: 'cameoCommissionUrl',
    name: 'Sponsor Custom Cougar/Cub Scenario Cameo',
    amount: '2900',
    tier: 'cameo',
    successUrl: 'https://cougarsandcubs.club/',
  },
];

const results = {};
for (const item of catalog) {
  const product = await stripePost('/products', { name: item.name });
  const price = await stripePost('/prices', {
    product: product.id,
    unit_amount: item.amount,
    currency: 'usd',
  });
  const link = await stripePost('/payment_links', {
    'line_items[0][price]': price.id,
    'line_items[0][quantity]': '1',
    'metadata[tier]': item.tier,
    'after_completion[type]': 'redirect',
    'after_completion[redirect][url]': item.successUrl,
  });
  results[item.key] = link.url;
}

console.log('\nPaste these URLs into src/config/monetization.ts and set sandboxPreviewMode: false:\n');
console.log(JSON.stringify(results, null, 2));
