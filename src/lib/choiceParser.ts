/**
 * Runtime Action-Card Parser (`Cougars & Cubs Club`).
 * Transforms prose-length choice strings into scannable 2-tier Play Cards
 * (Tone Chip + Bold Tactical Headline + Crisp Dialogue/Action Subtext)
 * WITHOUT spoiling red/green outcomes and WITHOUT altering underlying accessible button text.
 */

export interface ParsedChoiceCard {
  toneIcon: string;
  toneLabel: string;
  headline: string;
  restText: string;
}

export function parseChoiceCardSpec(fullLabel: string, role: 'her' | 'him'): ParsedChoiceCard {
  const clean = fullLabel.trim();

  // Derive non-spoiler social style chip purely from lexical cues
  const lower = clean.toLowerCase();
  let toneIcon = '✨';
  let toneLabel = role === 'her' ? 'Vet Instinct' : 'Direct Move';

  if (/[“"'].*[”"']/.test(clean) && /(wink|laugh|grin|tease|playful|joke|cheeky)/i.test(lower)) {
    toneIcon = '😏';
    toneLabel = 'Playful Wit';
  } else if (/(card|check|peonies|door|toast|champagne|early|linen|key|espresso)/i.test(lower)) {
    toneIcon = '🥂';
    toneLabel = 'Classic Charm';
  } else if (/(boundary|rule|calm|honest|ask|listen|pace|phone-free|quiet)/i.test(lower)) {
    toneIcon = '💬';
    toneLabel = 'Grounded Frame';
  } else if (/(late|split-tab|calculator|tiktok|ps5|shot|whine|lecture|pout|sulk|snap)/i.test(lower)) {
    toneIcon = '⚡';
    toneLabel = 'Bold / Wildcard';
  }

  // Split lead clause into a crisp 3-7 word headline + remaining subtext so full text remains in DOM
  const colonIdx = clean.indexOf(':');
  if (colonIdx > 6 && colonIdx <= 44) {
    return {
      toneIcon,
      toneLabel,
      headline: clean.slice(0, colonIdx),
      restText: clean.slice(colonIdx + 1).trim(),
    };
  }

  const dashMatch = clean.match(/^([^—–(]{10,54}?)(?:\s*[—–]\s*|\s+\()/);
  if (dashMatch && dashMatch[1]) {
    const head = dashMatch[1].trim();
    const remainder = clean.slice(head.length).trim();
    return {
      toneIcon,
      toneLabel,
      headline: head,
      restText: remainder,
    };
  }

  const words = clean.split(/\s+/);
  if (words.length <= 8) {
    return {
      toneIcon,
      toneLabel,
      headline: clean,
      restText: '',
    };
  }

  const headWords = words.slice(0, 6).join(' ');
  const restWords = words.slice(6).join(' ');
  return {
    toneIcon,
    toneLabel,
    headline: headWords,
    restText: restWords,
  };
}
