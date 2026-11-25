/**
 * Clean service boundaries for seamless Phase A -> Phase B -> Phase C upgrades:
 * - Phase A (active now): deterministic local baseline with zero backend cost.
 * - Phase B (Cloudflare Worker + KV): live global Telltale-style choice percentages & Stripe webhook token verification.
 * - Phase C (Gemini Flash Worker): live freeform "Survive Her Inbox" DM vetting rounds.
 */

export interface CrowdStatsService {
  getChoicePercentages(episodeId: string, choiceCount: number): Promise<number[]>;
  recordChoice(episodeId: string, choiceIndex: number): Promise<void>;
}

export interface AiDmVettingResponse {
  maturityDelta: number;
  chemistryDelta: number;
  herReply: string;
  passedVibeCheck: boolean;
}

export interface AiDmVettingService {
  isEnabled(): boolean;
  evaluateOpeningDm(params: {
    herArchetypeId: string;
    playerMessage: string;
  }): Promise<AiDmVettingResponse>;
}

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function getLocalChoicePercentagesSync(
  episodeId: string,
  choiceCount: number,
): number[] {
  if (choiceCount <= 0) return [];
  if (choiceCount === 1) return [100];

  const weights: number[] = [];
  let total = 0;
  for (let i = 0; i < choiceCount; i++) {
    const w = 18 + (hashSeed(`${episodeId}:${i}`) % 39);
    weights.push(w);
    total += w;
  }

  const rounded = weights.map((w) => Math.round((w / total) * 100));
  const drift = 100 - rounded.reduce((a, b) => a + b, 0);
  rounded[0] += drift;
  return rounded;
}

export const localCrowdStatsService: CrowdStatsService = {
  async getChoicePercentages(episodeId: string, choiceCount: number): Promise<number[]> {
    return getLocalChoicePercentagesSync(episodeId, choiceCount);
  },

  async recordChoice(): Promise<void> {
    // No-op in Phase A static build; POSTs to Cloudflare Worker in Phase B.
  },
};

export const phaseCAiVettingStub: AiDmVettingService = {
  isEnabled() {
    return false;
  },
  async evaluateOpeningDm() {
    throw new Error('Phase C live AI DM Vetting requires connecting the Cloudflare + Gemini Worker.');
  },
};
