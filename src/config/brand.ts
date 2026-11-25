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
  name: 'Cougars & Cubs Club: The Cougar Den',
  shortName: 'The Cougar Den',
  subtitle: 'Lower Your Age Slider. Vet the Red Flags. Win Real Romance.',
  repoSlug: 'sudosoph/velvet-den',
  publicBaseUrl: 'https://cougarsandcubs.club/',
  discordInviteUrl: 'https://discord.gg/cougarsandcubs',
  ownedSubredditUrl: 'https://www.reddit.com/r/CougarsAndCubsClub/',
};
