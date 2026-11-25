export interface BrandConfig {
  name: string;
  subtitle: string;
  repoSlug: string;
  publicBaseUrl: string;
  discordInviteUrl: string;
  ownedSubredditUrl: string;
}

export const BRAND_CONFIG: BrandConfig = {
  name: 'The Velvet Den: Cougars & Cubs',
  subtitle: 'Vet His Maturity. Master the Code-Switch. Earn the Short Leash.',
  repoSlug: 'sudosoph/velvet-den',
  publicBaseUrl: 'https://sudosoph.github.io/velvet-den/',
  discordInviteUrl: 'https://discord.gg/velvetden',
  ownedSubredditUrl: 'https://www.reddit.com/r/TheVelvetDenClub/',
};
