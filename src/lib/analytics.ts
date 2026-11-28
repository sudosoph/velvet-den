import posthog, { type PostHog } from 'posthog-js';

export type VelvetAnalyticsEvent =
  | 'velvet_profile_saved'
  | 'velvet_profile_customized'
  | 'swipe_decision'
  | 'profile_swiped'
  | 'match_earned'
  | 'match_unlocked'
  | 'profile_memory_bonus'
  | 'imessage_unlocked'
  | 'off_app_imessage_unlocked'
  | 'obedience_rehab_completed'
  | 'cub_obedience_graduated'
  | 'cub_rehab_graduated'
  | 'date_stage_started'
  | 'date_stage_completed'
  | 'credit_gate_shown'
  | 'paywall_opened'
  | 'credit_spent'
  | 'checkout_clicked'
  | 'stripe_checkout_clicked'
  | 'checkout_verified'
  | 'purchase_verified'
  | 'tip_jar_clicked'
  | 'affiliate_clicked'
  | 'share_triggered'
  | 'guide_opened'
  | 'trivia_completed'
  | 'checklist_completed'
  | 'checklist_shared'
  | 'waitlist_submitted'
  | 'newsletter_subscribed'
  | 'audition_completed'
  | 'courtroom_voted'
  | 'roast_lab_executed';

const PLAYER_UUID_STORAGE_KEY = 'cc_player_uuid_v1';
const APP_NAMESPACE = 'cougars_and_cubs_club';

let fallbackMemoryUuid: string | null = null;
let initializedClient: PostHog | null = null;
let didInitAttempt = false;

function generateRandomId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `cc_${crypto.randomUUID()}`;
  }
  return `cc_${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getOrCreateStablePlayerUuid(): string {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const existing = window.localStorage.getItem(PLAYER_UUID_STORAGE_KEY);
      if (existing && /^cc_[a-z0-9-]+$/i.test(existing)) {
        return existing;
      }
      const created = generateRandomId();
      window.localStorage.setItem(PLAYER_UUID_STORAGE_KEY, created);
      return created;
    }
  } catch {
    // Storage unavailable (e.g., private browsing or restricted iframe)
  }
  if (!fallbackMemoryUuid) {
    fallbackMemoryUuid = generateRandomId();
  }
  return fallbackMemoryUuid;
}

export function buildAnalyticsPayload(
  properties?: Record<string, unknown>,
): Record<string, unknown> {
  return {
    ...(properties ?? {}),
    app: APP_NAMESPACE,
  };
}

function isRealPostHogToken(token: string | undefined): token is string {
  if (!token) return false;
  const trimmed = token.trim();
  return (
    trimmed.length > 8 &&
    trimmed.startsWith('phc_') &&
    trimmed !== 'phc_your_project_token_here'
  );
}

export function initPostHogClient(): PostHog | null {
  if (didInitAttempt) {
    return initializedClient;
  }
  didInitAttempt = true;

  const rawToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN as string | undefined;
  const rawHost = import.meta.env.VITE_POSTHOG_HOST as string | undefined;

  if (!isRealPostHogToken(rawToken)) {
    if (import.meta.env.DEV && !import.meta.env.VITEST) {
      console.error(
        'VITE_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_PROJECT_TOKEN is configured',
      );
    }
    return null;
  }

  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stableUuid = getOrCreateStablePlayerUuid();
    posthog.init(rawToken.trim(), {
      api_host: (rawHost && rawHost.trim()) || '/ingest',
      ui_host: 'https://us.posthog.com',
      defaults: '2026-01-30',
      capture_exceptions: true,
      bootstrap: {
        distinctID: stableUuid,
      },
      loaded: (ph) => {
        ph.register({ app: APP_NAMESPACE });
      },
    });
    initializedClient = posthog;
    return initializedClient;
  } catch {
    initializedClient = null;
    return null;
  }
}

export function trackEvent(
  event: VelvetAnalyticsEvent,
  properties?: Record<string, unknown>,
): void {
  const payload = buildAnalyticsPayload(properties);
  if (!initializedClient) return;
  try {
    initializedClient.capture(event, payload);
  } catch {
    // Non-blocking telemetry guard
  }
}

export function identifyPlayerWithContact(
  contactEmailOrHandle: string,
  extraProps?: Record<string, unknown>,
): void {
  const stableUuid = getOrCreateStablePlayerUuid();
  const trimmed = String(contactEmailOrHandle || '').trim();
  if (!trimmed || !initializedClient) return;

  const isEmail = trimmed.includes('@') && !trimmed.startsWith('@');
  const personProps: Record<string, unknown> = {
    ...(extraProps ?? {}),
    app: APP_NAMESPACE,
    ...(isEmail ? { email: trimmed.toLowerCase() } : { handle: trimmed }),
  };

  try {
    initializedClient.identify(stableUuid, personProps);
  } catch {
    // Non-blocking identify guard
  }
}

export function getPostHogTracingHeaders(): Record<string, string> {
  const distinctId = initializedClient?.get_distinct_id?.() || getOrCreateStablePlayerUuid();
  const sessionId = initializedClient?.get_session_id?.();
  return {
    'X-POSTHOG-DISTINCT-ID': distinctId,
    ...(sessionId ? { 'X-POSTHOG-SESSION-ID': sessionId } : {}),
  };
}
