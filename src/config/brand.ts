export interface BrandConfig {
  name: string;
  shortName: string;
  subtitle: string;
  repoSlug: string;
  publicBaseUrl: string;
  discordInviteUrl: string;
  ownedSubredditUrl: string;
}

export const BRAND_CONFIG: BrandConfig = {
  name: 'The Velvet Den: Cougars & Cubs',
  shortName: 'Cougars & Cubs Club',
  subtitle: 'Swipe. Vet His Maturity. Survive Her 6 AM Pace. Win Commitment.',
  repoSlug: 'sudosoph/velvet-den',
  publicBaseUrl: 'https://cougarsandcubs.club/',
  discordInviteUrl: 'https://discord.gg/velvetden',
  ownedSubredditUrl: 'https://www.reddit.com/r/TheVelvetDenClub/',
};
