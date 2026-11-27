import {
  type PortraitExpression,
  V35_CAST_VISUALS,
  V35_SCENE_BACKDROPS,
} from './v35AssetManifest';
import { V35_CAST_PROFILES, type V35CastProfile } from './v35Cast';

export interface ChatBeat {
  beatNumber: 1 | 2 | 3 | 4 | 5 | 6;
  incomingMessages: string[];
  photoDrop?: {
    id: string;
    previewCaption: string;
    imageUrl: string;
    unlockCost: 1;
    exifClue: string;
    secretNote: string;
  };
  choices: [
    { text: string; reply: string; delta: number },
    { text: string; reply: string; delta: number },
    { text: string; reply: string; delta: number; cost: 1; badge: string },
  ];
  trapClueHint?: string;
}

export interface CutLooseVerdict {
  isActualTrap: boolean;
  headline: string;
  bestieNote: string;
  receiptShareLine: string;
  conspiracyClueId?: string;
}

export interface DateSceneScript {
  dateNumber: 1 | 2 | 3 | 4;
  title: string;
  venueBackdrop: string;
  prepAffiliateIds?: string[];
  isEpilogueUnlock?: boolean;
  epilogueCost?: number;
  beats: {
    speakerExpression: PortraitExpression;
    dialogue: string;
    bestiePopIn?: string;
    choices: {
      label: string;
      response: string;
      nextExpression: PortraitExpression;
      chemistryDelta: number;
      cost?: number;
      locksOutSRank?: boolean;
      triggersCubSparring?: boolean;
      triggersTurnTablesRevenge?: boolean;
      triggersDisasterHeartLoss?: boolean;
    }[];
  }[];
  secretBestiePovLeak: {
    friendName: string;
    messages: string[];
    cost: 2;
  };
}

export interface DiscordChannelSpec {
  id: string;
  handleLabel: string;
  topicSubtitle: string;
  seededMessages: { sender: string; badge: string; text: string }[];
  suggestionsHer: string[];
  suggestionsHim: string[];
  repliesHer: [string, string, string];
  repliesHim: [string, string, string];
  botReplies: string[];
  conspiracyClueId?: string;
}

export const V35_DISCORD_CHANNELS: DiscordChannelSpec[] = [
  {
    id: 'velvet-lounge',
    handleLabel: '#friday-lounge',
    topicSubtitle: 'Sunset Hills Friday check-ins, outfit checks & pre-date hype',
    seededMessages: [
      {
        sender: 'Jade_42F',
        badge: '🐆 Sunset Hills Host',
        text: 'Friday roll call: Miles just renovated the patio lanterns at The Marlow Lounge and Claire is already holding down the corner bar stool.',
      },
      {
        sender: 'Hampstead_Julian',
        badge: '🇬🇧 Visiting Fellow',
        text: 'Fair warning, the pianist is taking Sade requests tonight if anyone fancies a proper drink before eight.',
      },
    ],
    suggestionsHer: [
      'Just moved into Sunset Hills, tell me which cocktail bar has zero tech-bro shouting.',
      'Testing a 27-year-old British fellow on Thursday logistics. Wish him luck.',
      'Who else refuses to leave the house after 8:30 PM unless the reservation is confirmed?',
    ],
    suggestionsHim: [
      'Booked a quiet corner banquette for 7:30 Friday, peonies in the car or too much for Date #1?',
      'New to Sunset Hills: best florist open past six near Westwood?',
      'Taking notes so I never fumble a second date in this zip code.',
    ],
    repliesHer: [
      'Jade_42F: Slip straight into The Marlow Lounge’s back piano lounge or Left Bank’s courtyard, acoustic warmth, proper glassware, zero finance vests shouting.',
      'Claire_M&A: If it’s Hampstead Julian, you are in very good hands, he arrives five minutes early and actually silences his phone.',
      'Sienna_Design: Hard Club law! After 8:30 PM I am already in silk loungewear unless a confirmed Resy pin hit my phone by noon.',
    ],
    repliesHim: [
      'Claire_M&A: Keep a small paper-wrapped bouquet in the trunk for the walk back to her car after dinner so she doesn’t carry stems across the bar.',
      'Sienna_Design: Left Bank Botanica on Westwood stays open until 7:30 PM, ask for ivory ranunculus or pale peonies, zero baby’s breath.',
      'Jade_42F: Confirm at noon Friday, stand up when she arrives, and listen twice as much as you pitch, you’ll outclass ninety percent of the city.',
    ],
    botReplies: [
      'Jade_42F: Quiet corner banquette at 7:30 is undefeated, keep your phone off the table and you are golden.',
      'Claire_M&A: One single stem or small seasonal bouquet works wonders; carrying a parade float across the bar does not.',
    ],
  },
  {
    id: 'red-flag-emergency',
    handleLabel: '#red-flag-emergency',
    topicSubtitle: 'Live triage for suspicious curfews, filter liars & Friday flakes',
    seededMessages: [
      {
        sender: 'Sienna_Design',
        badge: '🏡 Sunset Hills',
        text: 'PSA: If a blonde finance guy in a navy blazer vanishes at 6:44 PM sharp every weekday for "Tokyo calls," check his left ring finger.',
      },
      {
        sender: 'Priya_TraumaRN',
        badge: '🏥 Night Shift',
        text: 'Also watch out for the Palisades tennis regular who keeps booking Table 9 just so her ex-husband walks past!',
      },
    ],
    suggestionsHer: [
      'He says his evenings after 6:45 PM are blocked for Tokyo markets, am I crazy or is that a commuter train home?',
      'He confessed on Message 2 that Hinge "accidentally" listed him as 27 instead of 21. Hitting Cut Loose immediately.',
      'Wrote me three paragraphs of poetry on Tuesday and just went radio silent Friday afternoon.',
    ],
    suggestionsHim: [
      'She says she is "practically divorced" while still sharing the Bel Air house, run for the hills?',
      'She insisted I wear a navy blazer and sit facing Table 9 where her ex dines every Friday.',
      'How do I tell normal post-divorce caution apart from someone using me as a rebound prop?',
    ],
    repliesHer: [
      'Jade_42F: Trust your gut! Tokyo opens at 5 PM Pacific and closes Friday, a nightly + Sunday 6:45 blackout is 100% a Montecito marriage curfew. Hit Cut Loose!',
      'Priya_TraumaRN: Instant Cut Loose! Nobody "accidentally" ages six years via Facebook, he deliberately bypassed women’s age filters.',
      'Claire_M&A: Textbook Tuesday poet, Friday 4 PM flake. Love-bombing before Date #1 is fantasy projection, not real follow-through.',
    ],
    repliesHim: [
      'Sam_27M: Sprint, brother! "Practically divorced in the same Bel Air house" means Lawrence is eating breakfast in that kitchen right now.',
      'Jade_42F: That’s Brooke’s Friday revenge audition! Wait, Graham’s 6:45 vanish AND Table 9 are connected. Check #blind-spark-dm!',
      'Prof_Elena: Healthy caution protects her peace and moves steadily in private; a rebound prop only wants noisy public photo ops in front of an ex.',
    ],
    botReplies: [
      'Priya_TraumaRN: Clock it and hit Cut Loose! Saving your Friday night heart beats playing unpaid marriage counselor.',
      'Jade_42F: Wait, Graham’s 6:45 vanish AND Brooke’s Table 9 obsession are connected. Check #blind-spark-dm!',
    ],
    conspiracyClueId: 'clue-discord-triage',
  },
  {
    id: 'ask-a-cougar',
    handleLabel: '#ask-a-cougar',
    topicSubtitle: 'Direct Q&A with Claire, Elena, Priya & seasoned Sunset Hills regulars',
    seededMessages: [
      {
        sender: 'Prof_Elena',
        badge: '🎓 Literature Chair',
        text: 'Office hours are open for five minutes: ask your honest courtship questions before I pour my Sancerre.',
      },
      {
        sender: 'Claire_M&A',
        badge: '🍸 Deal Partner',
        text: 'Rule one: never ask us to plan the neighborhood, restaurant, and time after we just led meetings for ten hours.',
      },
    ],
    suggestionsHer: [
      'Ladies, when a sweet 26-year-old gets nervous about earning less than me, what puts him at ease without mothering him?',
      'Do we give a second chance to a guy who nervously talked too fast for the first ten minutes?',
      'Best boundary line when you love Living-Apart-Together and never want to merge houses again?',
    ],
    suggestionsHim: [
      'When she makes triple my grad stipend, what is the classiest way to handle alternating date nights?',
      'How early should I prep my mom before introducing a partner who is closer to her age?',
      'Does sending a calm confirmation text at noon on Friday still count as a top-tier green flag?',
    ],
    repliesHer: [
      'Prof_Elena: Let him plan and pay squarely inside his budget when he invites, then host weekend escapes you initiate. Alternate turns as equals, never mother him.',
      'Priya_TraumaRN: Ten minutes of first-date nerves is endearing if he settles down and truly listens. Smooth players rehearse; real Cubs actually care what you think.',
      'Claire_M&A: Toast to it early: "I want real commitment and great weekends together, and I am keeping my own house keys forever." Secure men love Living-Apart-Together clarity.',
    ],
    repliesHim: [
      'Prof_Elena: Plan thoughtful dates squarely inside your budget and pay cleanly when you invite, pretension fails, sincerity wins.',
      'Sienna_Design: Prep your mom warmly a full week ahead so she feels respected and zero people blink at Sunday dinner, never spring an ambush.',
      'Claire_M&A: A noon Friday confirmation text ("Looking forward to 7:30 tonight, table is set") puts you in the top two percent.',
    ],
    botReplies: [
      'Prof_Elena: Plan thoughtful dates squarely inside your budget and pay cleanly when you invite, pretension fails, sincerity wins.',
      'Claire_M&A: A noon Friday confirmation text ("Looking forward to 7:30 tonight, table is set") puts you in the top two percent.',
    ],
  },
  {
    id: 'spotted-in-the-wild',
    handleLabel: '#spotted-in-the-wild',
    topicSubtitle: 'Missed connections at Terminal B, Dawn Lap Pool & Left Bank Books',
    seededMessages: [
      {
        sender: 'Sam_27M',
        badge: '🏡 Cul-de-Sac Neighbor',
        text: 'Just watched a wildlife officer at Dawn Lap Pool explain to a tourist from Paramus that "there aren’t wild cougars in New Jersey."',
      },
      {
        sender: 'Rory_Ranger',
        badge: '🌳 Hampstead Exchange',
        text: 'Still blushing from tapping the wrong woman on the shoulder in the fig aisle at Cougarmarket, thank heaven she laughed.',
      },
    ],
    suggestionsHer: [
      'To the platinum-blonde architect on Court 3 with the wicked lefty slice, rematch Thursday?',
      'Whoever met his match curbside at Terminal B with two hot espressos and a town car just raised the bar for the whole city.',
      'Spotted at Havana & Vine: clean-shaven woodworker who spun three partners effortlessly without spilling a drop.',
    ],
    suggestionsHim: [
      'To the honey-blonde professor at Left Bank Books, waiting respectfully until Friday 5 PM when grades post!',
      'Survived three weeks of polite nods at Dawn Lap Pool before saying hi at the smoothie counter. Worth every lap.',
      'Note to self: empty grocery baskets in the Rioja aisle fool zero women.',
    ],
    repliesHer: [
      'Jade_42F: That’s Søren on Court 3 at Palisades Racquet! Step onto the In The Wild map, he loves a fearless mixed-doubles challenge.',
      'Claire_M&A: Guilty, Miles met me at Terminal B Baggage Claim and handled both weekender bags in one hand. Check Terminal B on the map!',
      'Sienna_Design: That’s Rafael from Silver Lake! Catch him Thursday night at Havana & Vine before the brass band wraps.',
    ],
    repliesHim: [
      'Prof_Elena: Punctual and ethically literate, meet me on the north quad bench at 5:01 PM sharp once registrar grades lock.',
      'Priya_TraumaRN: Slow-burn lap-pool etiquette works every time, zero mid-set interruptions, warm conversation over smoothies after.',
      'Sienna_Design: Haha put actual olive oil and figs in the basket first, we spot empty-basket aisle lurkers from thirty paces!',
    ],
    botReplies: [
      'Sam_27M: Confirmed, half the best romances in Sunset Hills started curbside at Terminal B or by the fig counter.',
      'Jade_42F: Go check the In The Wild map before someone else claims that 8:15 corner table!',
    ],
  },
  {
    id: 'blind-velvet-dm',
    handleLabel: '#blind-spark-dm',
    topicSubtitle: 'Anonymous handle mystery channel & Table 9 Alibi Club leaks',
    seededMessages: [
      {
        sender: 'Anon_Cedar_7',
        badge: '🎭 Mystery Regular',
        text: 'Insider tip from behind the mahogany bar: Table 9 at The Marlow Lounge is booked every Friday under a shared shell account called "The 6:45 Tokyo Call."',
      },
      {
        sender: 'Anon_Marlow_9',
        badge: '🕵️ Insider',
        text: 'Graham, Vanessa’s husband, AND Brooke’s ex Richard split that booth tab to cover each other’s alibis. Collect 3 clues to crash their dinner!',
      },
    ],
    suggestionsHer: [
      'Wait, Graham’s 6:45 Tokyo call is actually a shared alibi tab at Table 9?! Tell me everything.',
      'Who is behind Anon_Cedar_7, your cadence sounds suspiciously like someone who builds cedar pergolas.',
      'Count me in for crashing the Table 9 Alibi Club once I have all three receipts.',
    ],
    suggestionsHim: [
      'So Brooke only wanted me at that steakhouse to rattle Richard at Table 9, and Vanessa’s husband is in on it?!',
      'Anon_Cedar_7, drop one clue who you are in Sunset Hills.',
      'Logging this Table 9 receipt right now, nobody uses us as alibi props on Friday night.',
    ],
    repliesHer: [
      'Anon_Cedar_7: Every word is true, three husbands split one cash ledger at Table 9 so none of their credit cards show The Marlow Lounge. Clue logged!',
      'Anon_Cedar_7: Let’s just say I care deeply about room acoustics, cedar joinery, and making sure good women don’t waste Friday nights on liars.',
      'Anon_Marlow_9: Dossier updated! Grab two more clues from #red-flag-emergency or Cut Loose vetting to unlock the Table 9 Takedown finale.',
    ],
    repliesHim: [
      'Anon_Marlow_9: Bingo, Richard, Lawrence, and Graham run a three-way alibi ring out of Table 9 every Friday at 6:15 PM. Clue logged!',
      'Anon_Cedar_7: Check Terminal B or the mahogany bar rail. I build the rooms where Sunset Hills regulars tell the truth.',
      'Anon_Marlow_9: Receipt locked into your vault! Hit 3/3 clues to crash their Friday booth in the secret finale.',
    ],
    botReplies: [
      'Anon_Cedar_7: Sharp eye. Clock three Table 9 clues across your chats and venues to unlock the secret Friday Takedown episode.',
      'Anon_Marlow_9: Clue logged! Keep vetting suspicious curfews via Cut Loose to complete the dossier.',
    ],
    conspiracyClueId: 'clue-discord-table9',
  },
];

function buildLeadOrCameoChapter(profile: V35CastProfile): {
  tinder: ChatBeat[];
  imessage: ChatBeat[];
  spicySuggestions: string[];
  cutLooseVerdict: CutLooseVerdict;
} {
  const photos = V35_CAST_VISUALS[profile.id].sixUniquePhotos;
  const isHimMatch = profile.role === 'him';

  // Special bespoke voices for signature leads & traps
  if (profile.id === 'julian') {
    return {
      tinder: [
        {
          beatNumber: 1,
          incomingMessages: [
            'Properly thrilled you said hello, most people on here open with a waving hand emoji and vanish into thin air x',
          ],
          choices: [
            {
              text: 'Do you actually climb library ladders all day, or was Slide 5 staged for sympathy?',
              reply: '100% real ladders, nearly dropped a 1920s courtyard folio trying to look cool last Tuesday xx',
              delta: 16,
            },
            {
              text: 'Quick litmus test: what is the most pretentious thing you’ve overheard in LA this week?',
              reply: 'A bloke in Erewhon calling his sparkling water "emotionally grounding." Nearly choked on my espresso x',
              delta: 15,
            },
            {
              text: '💎 Fair warning, professor, dry wit is mandatory in my inbox. Give me your most unapologetic hot take.',
              reply: 'Loud dinner DJs should be illegal, and California sunshine still doesn’t excuse bad tea xx',
              delta: 24,
              cost: 1,
              badge: 'VIP Spark',
            },
          ],
        },
        {
          beatNumber: 2,
          incomingMessages: [
            'Alright, my turn to test your instincts: what is one tiny pet peeve that makes you silently judge someone in five seconds?',
          ],
          choices: [
            {
              text: 'Men who clap when the plane lands or snap at bartenders.',
              reply: 'Instant lifetime ban, how you treat bar staff tells the whole story x',
              delta: 18,
            },
            {
              text: 'People who treat Hinge like a calendar invite before proving they’re actually fun to talk to.',
              reply: 'Haha noted, zero rushing from me, half the fun is seeing if our banter actually sparks xx',
              delta: 16,
            },
            {
              text: '💎 Guys who get intimidated by a woman who genuinely loves her own life.',
              reply: 'Bloody hell, that’s my favorite thing on earth, ambition looks brilliant on you xx',
              delta: 24,
              cost: 1,
              badge: 'Queen Frame',
            },
          ],
        },
        {
          beatNumber: 3,
          incomingMessages: [
            'Full disclosure while we’re trading truths: I’m here on an academic fellowship stipend, not a tech-founder yacht, though my risotto game is genuinely undefeated.',
          ],
          choices: [
            {
              text: 'Good, I fund my own life. Wit, curiosity, and real manners beat yacht talk every time.',
              reply: 'You have no idea how refreshing it is to hear a woman say that plainly x',
              delta: 18,
            },
            {
              text: 'Bold claim on the risotto, do you stir for twenty minutes straight or take shortcuts?',
              reply: 'Warm stock ladle by ladle with a glass of Barolo in the other hand, obviously xx',
              delta: 16,
            },
            {
              text: '💎 Keep bringing this exact banter and your risotto might get an audition eventually.',
              reply: 'Challenge very happily accepted, darling, no rush, enjoying every minute of this xx',
              delta: 24,
              cost: 1,
              badge: 'Slow-Burn Tease',
            },
          ],
        },
        {
          beatNumber: 4,
          incomingMessages: [
            'Just ducked out of the archive stacks, caught the best late-afternoon light on the river walk.',
          ],
          photoDrop: {
            id: 'photo-julian-scull',
            previewCaption: 'Private camera-roll evening portrait from Julian',
            imageUrl: photos[5],
            unlockCost: 1,
            exifClue: '📍 Live Photo • Taken 4 min ago near Westwood • Zero filters, real pub-garden grin.',
            secretNote: '“Didn’t put this one at the top of Hinge, practicing my Thursday toast to you xx”',
          },
          choices: [
            {
              text: 'Rolled sleeves and zero mirror-selfie preening, you’re passing every test so far.',
              reply: 'Trying my absolute best to stay at the top of your queue x',
              delta: 15,
            },
            {
              text: 'Save some of that energy for Thursday night.',
              reply: 'Plenty in reserve, I promise.',
              delta: 12,
            },
            {
              text: '💎 Dangerous photo to send while I’m still in afternoon meetings, professor.',
              reply: 'Apologies to your calendar, blame the California sun xx',
              delta: 22,
              cost: 1,
              badge: 'Flirt Hit',
            },
          ],
        },
        {
          beatNumber: 5,
          incomingMessages: [
            'One small check-in: does our age gap ever feel weird from your side, or do you judge strictly on chemistry?',
          ],
          choices: [
            {
              text: 'Strictly chemistry and emotional maturity, and you’re ahead of most men my age.',
              reply: 'Music to my ears. I’d much rather match wits with you than explain basic cinema to twenty-two-year-olds.',
              delta: 18,
            },
            {
              text: 'Only gets weird if you call 2004 "ancient history" at dinner.',
              reply: 'Haha noted, 2004 is officially last Tuesday x',
              delta: 16,
            },
            {
              text: '💎 Keep showing up like a grown gentleman and the calendar math takes care of itself.',
              reply: 'Sorted. I intend to make Thursday your favorite night all month xx',
              delta: 24,
              cost: 1,
              badge: 'Poised Assurance',
            },
          ],
        },
        {
          beatNumber: 6,
          incomingMessages: [
            'Table is confirmed for Thursday at half seven. Whenever you’re comfortable moving off this app, I’d love to text you properly, zero rush x',
          ],
          choices: [
            {
              text: 'You earned off-app privileges, sending you my real number now.',
              reply: 'Just saved it with a star, texting you on iMessage right now xx',
              delta: 20,
            },
            {
              text: 'Here’s my cell, confirm with me Thursday at noon so I know you’re real.',
              reply: 'Noon confirmation locked into my diary x',
              delta: 18,
            },
            {
              text: '💎 Here’s my personal number, Julian, ring me for two minutes at six tomorrow so I hear that Hampstead voice.',
              reply: 'Six sharp tomorrow, cannot wait to hear your laugh xx',
              delta: 26,
              cost: 1,
              badge: 'VIP Graduation',
            },
          ],
        },
      ],
      imessage: buildImessageFollowup('Julian', true, photos[4]),
      spicySuggestions: [
        'Wear that rolled white linen shirt Thursday, consider it a formal request.',
        'If conversation flows half this well in person, I’m not rushing home at nine.',
        'Whisper "half seven is sorted" across the table once and see what happens.',
      ],
      cutLooseVerdict: {
        isActualTrap: false,
        headline: 'Hold On, Julian Is Genuine!',
        bestieNote:
          'Jade here: being honest upfront about an academic fellowship stipend is real human vulnerability, NOT a freeloader red flag! Are you sure you want to let a polite British charmer go?',
        receiptShareLine: 'Nearly ghosted a green-flag Hampstead gentleman before Jade talked sense into me!',
      },
    };
  }

  // Traps with investigative red-flag breadcrumbs across Beats 1-6!
  if (profile.tier === 'trap') {
    return buildTrapChapter(profile, photos);
  }

  const bespokeBeat1OpenerById: Record<string, string> = {
    soren:
      'Rarely open this app after clay-court mornings, yet your profile stopped me cold. Tell me you despise overhead restaurant lighting as much as I do.',
    miles:
      'Still smiling from our Terminal B curbside handoff, my calendar is cleared for Friday at 8:15 so you don’t have to make a single decision.',
    rafael:
      'Just brushed the walnut sawdust off my sleeves in Silver Lake, still thinking about spinning you under those courtyard string lights.',
    marcus:
      'Off a quiet morning swim after shift at Station 14, your directness already lowered my resting heart rate to forty-six.',
    elena:
      'Grades are officially posted and my office door is locked, congratulations on writing an actual complete sentence without a seminar cliché.',
    claire:
      'Ninety seconds between board calls on the 34th floor, and your note actually made me laugh out loud. Good start.',
    sienna:
      'Taking five minutes in the olive-tree courtyard with fabric samples, love that you didn’t open with a generic "hey."',
    priya:
      'Just clocked off three twelve-hour trauma nights with a cardamom cold brew, your message beat hospital coffee by a mile.',
    summer:
      'Wrapped my last Malibu consult before sunset, bonus points right away if you remembered mineral SPF 50 on your neck today.',
  };

  const bespokeBeat2IncomingById: Record<string, string> = {
    soren:
      'Quick personality check before anything else: are you secretly competitive at games, or do you pretend to play "just for fun"?',
    miles:
      'Be honest, what is the fastest way someone on this app accidentally bores you to tears?',
    rafael:
      'Quick musical litmus test: what record goes on in your living room when you finally close your laptop for the week?',
    marcus:
      'Tell me one unpopular food or travel opinion you refuse to back down on. I want to see your ruthless side.',
    elena:
      'Quick litmus test: if my seminar day runs silent until six and I reply "Sounds good." with a period, do you panic or hold steady?',
    claire:
      'Be honest: what is the boldest spontaneous decision you’ve made this year outside of work?',
    sienna:
      'Quick aesthetic test: dim candlelit wine bar with vinyl, or chaotic trendy hotspot where everyone yells?',
    priya:
      'Quick shift-worker check: when blackout curtains are drawn until 2 PM after nights, do you guard the peace or blow up my phone?',
    summer:
      'Playful question first: what’s one harmless guilty pleasure you’d never put on a serious resume?',
  };

  // Clean role-accurate 6-beat arc for all other Genuine Main Leads & Cameos
  return {
    tinder: [
      {
        beatNumber: 1,
        incomingMessages: [
          bespokeBeat1OpenerById[profile.id] ||
            (isHimMatch
              ? `Best surprise in my likes all week, ${profile.name} here, glad you stopped scrolling and said hi.`
              : `Well, you already beat ninety percent of this app by writing an actual sentence.`),
        ],
        choices: [
          {
            text: isHimMatch
              ? `Your profile actually sounded written by a human, what’s the story behind Slide 2?`
              : `Happy to raise the curve, what’s the funniest opener someone tried on you this week?`,
            reply: isHimMatch
              ? `Haha caught right in my element, friend snapped that mid-laugh when I didn’t know the camera was up.`
              : `Someone sent seventeen fire emojis and zero words. You’re winning by a landslide.`,
            delta: 16,
          },
          {
            text: isHimMatch
              ? `Quick vibe check: dry banter or polite small talk?`
              : `Slide 2 caught my eye, what’s your go-to way to unwind after a long day?`,
            reply: isHimMatch
              ? `Dry banter every single time, polite small talk puts me straight to sleep.`
              : `Phone on silent, something great in a glass, and zero work talk.`,
            delta: 14,
          },
          {
            text: isHimMatch
              ? `💎 Skip the rehearsed Hinge script, ${profile.name}, tell me one thing about you nobody guesses right away.`
              : `💎 No generic small talk here, give me one unpopular opinion you stand by 100%.`,
            reply: isHimMatch
              ? `People expect nonstop extrovert energy, when really I’m happiest cooking late-night pasta for one person.`
              : `Dessert menus beat networking events ten times out of ten, glad you skipped the script.`,
            delta: 24,
            cost: 1,
            badge: 'VIP Spark',
          },
        ],
      },
      {
        beatNumber: 2,
        incomingMessages: [
          bespokeBeat2IncomingById[profile.id] ||
            (isHimMatch
              ? `My turn to ask: what’s one tiny pet peeve that makes you mentally unmatch someone in ten seconds?`
              : `Quick test while we’re riffing: how do you handle it when my workday runs silent until 6 PM?`),
        ],
        choices: [
          {
            text: isHimMatch
              ? `People who brag nonstop or rush straight to scheduling before we’ve even laughed once.`
              : `Zero panic here. I stay busy with my own craft and catch up warmly when you’re off.`,
            reply: isHimMatch
              ? `Couldn’t agree more, if the banter isn’t effortless here, dinner would feel like homework.`
              : `Thank heaven, self-assured patience is rarer than gold.`,
            delta: 16,
          },
          {
            text: isHimMatch
              ? `Secretly super competitive, though I’m graceful when I win.`
              : `Candlelit vinyl bar every time, shouting over bass is an instant pass.`,
            reply: isHimMatch
              ? `Haha noted, now I definitely know not to go easy on you.`
              : `Impeccable taste. My ears thank you already.`,
            delta: 15,
          },
          {
            text: isHimMatch
              ? `💎 Boring texters, thankfully you’re passing round two with flying colors.`
              : `💎 Zero fragile ego here, take all the space your day needs and bring your wit at six.`,
            reply: isHimMatch
              ? `High praise, now I’m determined to keep that streak alive.`
              : `Consider me officially intrigued.`,
            delta: 24,
            cost: 1,
            badge: 'High-EQ Banter',
          },
        ],
      },
      {
        beatNumber: 3,
        incomingMessages: [
          profile.vulnerabilityNote
            ? isHimMatch
              ? `Honest moment: sometimes people assume a ${profile.age}-year-old isn’t looking for something real, when that’s the whole reason I’m here.`
              : `Fair warning up front: I’ve built a very peaceful life on my own, so I pace things intentionally.`
            : `Halfway through the week and you’re easily my favorite notification.`,
        ],
        choices: [
          {
            text: isHimMatch
              ? `Actions prove way more than birth years, keep showing up consistently and you’ll stand out fast.`
              : `I love that you guard your peace, no rushing from my side, just good company.`,
            reply: isHimMatch
              ? `Consistent is my baseline. You won’t have to guess where I stand.`
              : `Best possible answer you could have given.`,
            delta: 18,
          },
          {
            text: `Let’s see how our chemistry feels across a real table before writing the memoir.`,
            reply: `Haha fair call, one great dinner at a time.`,
            delta: 14,
          },
          {
            text: isHimMatch
              ? `💎 Good, because I don’t audition rookies, I only date men who step up as equals.`
              : `💎 Unhurried pace respected, earning your trust slowly is half the fun.`,
            reply: isHimMatch
              ? `Loud and clear, wouldn’t want it any other way.`
              : `Okay, you definitely know what you’re doing.`,
            delta: 24,
            cost: 1,
            badge: 'Magnetic Polarity',
          },
        ],
      },
      {
        beatNumber: 4,
        incomingMessages: [
          `Stepped outside for five minutes of golden-hour air and thought of our Friday plan.`,
        ],
        photoDrop: {
          id: `photo-${profile.id}-candid`,
          previewCaption: `Private evening camera-roll check-in from ${profile.name}`,
          imageUrl: photos[5],
          unlockCost: 1,
          exifClue: `📍 Live Camera Roll • Taken 6 min ago • Authentic portrait, zero app retouching.`,
          secretNote: `“Saved this dressed-up look for Friday night, fair warning, I clean up well for you.”`,
        },
        choices: [
          {
            text: `Okay, that golden-hour lighting is doing very persuasive work.`,
            reply: `Wait until Friday night, even better in person.`,
            delta: 16,
          },
          {
            text: `Looking sharp, hope your afternoon wraps smoothly.`,
            reply: `Just wrapped the hardest part, smooth sailing toward Friday.`,
            delta: 13,
          },
          {
            text: `💎 Unfair distraction mid-afternoon, ${profile.name}, save that smile for across the table.`,
            reply: `Saved exclusively for Friday at eight.`,
            delta: 23,
            cost: 1,
            badge: 'Spark Boost',
          },
        ],
      },
      {
        beatNumber: 5,
        incomingMessages: [
          isHimMatch
            ? `Reservation is locked in under ${profile.name}. Anything I should know so Friday feels completely effortless for you?`
            : `Friday is looking clear on my calendar, do you actually keep your phone off the table at dinner?`,
        ],
        choices: [
          {
            text: isHimMatch
              ? `Just show up on time, smell great, and don’t check sports scores mid-sentence.`
              : `Silent mode from the moment you sit down until I walk you to your car.`,
            reply: isHimMatch
              ? `Phone stays on Do Not Disturb in my jacket pocket all night.`
              : `Rare breed. Now I’m genuinely looking forward to Friday.`,
            delta: 17,
          },
          {
            text: isHimMatch
              ? `Quiet booth away from the kitchen door and we’re set.`
              : `Always, real conversation beats scrolling every time.`,
            reply: isHimMatch
              ? `Already requested the corner banquette when I called.`
              : `Good instinct.`,
            delta: 15,
          },
          {
            text: isHimMatch
              ? `💎 Just bring steady eye contact and zero rehearsed lines. I spot fake bravado in ten seconds.`
              : `💎 Phone stays buried, car door handled, and zero rushing the evening.`,
            reply: isHimMatch
              ? `Real conversation only, wouldn’t insult your intelligence with a script.`
              : `Smooth from start to finish.`,
            delta: 24,
            cost: 1,
            badge: 'S-Tier Chemistry',
          },
        ],
      },
      {
        beatNumber: 6,
        incomingMessages: [
          isHimMatch
            ? `Everything is set for Friday night. Only if you’d like to move off the app. I’d love to text you from my real number.`
            : `Alright, you passed my app filter cleanly. Take my personal number so we can coordinate Friday on iMessage.`,
        ],
        choices: [
          {
            text: isHimMatch
              ? `You kept my interest, here’s my real number for Friday.`
              : `Saved, texting you on iMessage right now so you have mine.`,
            reply: `Got it! Switching over to blue bubbles now.`,
            delta: 20,
          },
          {
            text: isHimMatch
              ? `Sending my cell, text me Friday afternoon to confirm.`
              : `Thank you, sending a quick hello on iMessage now.`,
            reply: `Message sent, see you in real texts!`,
            delta: 18,
          },
          {
            text: isHimMatch
              ? `💎 You earned my personal number, ${profile.name}, don’t make me regret graduating you off Hinge.`
              : `💎 Personal number saved. I’ll text you the exact pin on iMessage right now.`,
            reply: `Best upgrade of my week, check your iMessage!`,
            delta: 26,
            cost: 1,
            badge: 'Number Graduated',
          },
        ],
      },
    ],
    imessage: buildImessageFollowup(profile.name, isHimMatch, photos[5]),
    spicySuggestions: isHimMatch
      ? [
          `Wear that dark linen shirt with rolled sleeves Friday. I’m not subtle when I like a view.`,
          `Keep making Friday this effortless and dessert might move back to Sunset Hills.`,
          `Tell me one thing you’ve been wanting to do since we matched.`,
        ]
      : [
          `Fair warning: if you wear silk on Friday it’s going to test my composure.`,
          `Save the last glass of Pinot for a quiet nightcap after the restaurant closes.`,
          `What’s one thing most men are too timid to say across a candlelit table?`,
        ],
    cutLooseVerdict: {
      isActualTrap: false,
      headline: `Wait, ${profile.name} Is a Genuine Match!`,
      bestieNote: isHimMatch
        ? `Jade here: hold up! ${profile.name} has been consistent, respectful, and transparent, that’s normal human vulnerability, NOT a red flag!`
        : `Sam here: bro, ${profile.name} setting healthy boundaries is poise, NOT a trap! Don’t self-sabotage a real catch!`,
      receiptShareLine: `Almost over-vetted a genuine ${profile.age}-year-old catch before my bestie stepped in!`,
    },
  };
}

function buildImessageFollowup(
  name: string,
  isHimMatch: boolean,
  candidUrl: string,
): ChatBeat[] {
  return [
    {
      beatNumber: 1,
      incomingMessages: [
        isHimMatch
          ? `Blue bubbles unlocked ✨ Saved your contact properly, still smiling from earlier.`
          : `Much better off that noisy app. Now you have my actual line.`,
      ],
      choices: [
        {
          text: isHimMatch
            ? `Much cleaner in here, don’t abuse direct access during business hours 😉`
            : `Honored to make the real contact list, confirming Friday at 7:45 sharp.`,
          reply: isHimMatch
            ? `Strictly high-signal texts only, promise.`
            : `Punctual and concise, off to a strong start.`,
          delta: 16,
        },
        {
          text: `Glad we graduated off Hinge, how is your evening winding down?`,
          reply: `Glass of red and vinyl spinning on low, wish you were here to pick the next record.`,
          delta: 15,
        },
        {
          text: `💎 Direct line looks good on you, ${name}, save your best banter for Friday’s first toast.`,
          reply: `First toast is already rehearsed in my head.`,
          delta: 24,
          cost: 1,
          badge: 'Blue-Bubble Spark',
        },
      ],
    },
    {
      beatNumber: 2,
      incomingMessages: [
        isHimMatch
          ? `Quick question before Friday: do you prefer I meet you right at the host stand, or send a car for you?`
          : `Tell me honestly, are you an "arrive ten minutes early" person or a last-second sprinter?`,
      ],
      choices: [
        {
          text: isHimMatch
            ? `Meet me at the bar five minutes early with a drink already ordered, classic first-date rule.`
            : `Ten minutes early at the bar so you never walk into an empty table.`,
          reply: isHimMatch
            ? `Smart rule. I’ll be waiting by the mahogany bar at 7:40.`
            : `Exact right answer.`,
          delta: 18,
        },
        {
          text: isHimMatch
            ? `Sending a car for Date #2 once you pass Date #1 inspection.`
            : `Early every time, traffic in LA is never an excuse.`,
          reply: isHimMatch
            ? `Haha fair. I’ll earn Date #2 car privileges Friday.`
            : `Spoken like a grown adult.`,
          delta: 16,
        },
        {
          text: `💎 Be at the bar five minutes early, and stand up when I walk in.`,
          reply: `Every single time, without fail.`,
          delta: 24,
          cost: 1,
          badge: 'Classic Standard',
        },
      ],
    },
    {
      beatNumber: 3,
      incomingMessages: [
        `Just walked past The Marlow Lounge patio on my way home, the string lights look unreal tonight.`,
      ],
      choices: [
        {
          text: `Save that view for us tomorrow night.`,
          reply: `Already counting down.`,
          delta: 15,
        },
        {
          text: `Did you spot Jade or Sam holding court by the piano?`,
          reply: `Pretty sure Jade waved at me from the martini rail!`,
          delta: 16,
        },
        {
          text: `💎 Good scouting, make sure they hold the corner away from Table 9’s drama.`,
          reply: `Quiet alcove corner is locked in with the host.`,
          delta: 23,
          cost: 1,
          badge: 'Insider Wink',
        },
      ],
    },
    {
      beatNumber: 4,
      incomingMessages: [
        `Off-app bonus: wardrobe check before tomorrow night.`,
      ],
      photoDrop: {
        id: `photo-${name.toLowerCase()}-imessage`,
        previewCaption: `Private iMessage pre-date outfit check from ${name}`,
        imageUrl: candidUrl,
        unlockCost: 1,
        exifClue: `📍 Personal iMessage Live Photo • Sent just now • Dressed for tonight’s reservation.`,
        secretNote: `“Private eyes only before 7:45, tell me honestly if this wins the corner booth.”`,
      },
      choices: [
        {
          text: `Approved, zero notes, don’t change a thing.`,
          reply: `High praise coming from you.`,
          delta: 18,
        },
        {
          text: `Okay, now I actually have to put thought into what I’m wearing.`,
          reply: `Impossible for you to miss, I’m certain.`,
          delta: 16,
        },
        {
          text: `💎 Dangerous preview after 9 PM, you’re officially trouble.`,
          reply: `The very best kind of trouble.`,
          delta: 24,
          cost: 1,
          badge: 'After-Dark Spark',
        },
      ],
    },
    {
      beatNumber: 5,
      incomingMessages: [
        `Friday noon check-in: table confirmed for tonight, weather is warm, and my evening is 100% yours.`,
      ],
      choices: [
        {
          text: `Love a man/woman who confirms at noon without prompting, see you tonight!`,
          reply: `Wouldn’t dream of leaving Friday up in the air.`,
          delta: 18,
        },
        {
          text: `Confirmed on my end, wrapping my last call at five.`,
          reply: `Crush your afternoon, first round is waiting at 7:45.`,
          delta: 16,
        },
        {
          text: `💎 Noon confirmation sealed it, bring your best smile tonight.`,
          reply: `Counting the hours until 7:45.`,
          delta: 24,
          cost: 1,
          badge: 'Date Locked',
        },
      ],
    },
    {
      beatNumber: 6,
      incomingMessages: [
        `Just arrived and grabbed our corner table, candlelight is warm and the bartender knows your drink. Ready whenever you step inside ✨`,
      ],
      choices: [
        {
          text: `Walking through the lounge curtains right now, stand up so I spot you.`,
          reply: `Already standing, wow, you look breathtaking.`,
          delta: 20,
        },
        {
          text: `Pulling up curbside now, two minutes out!`,
          reply: `Drinks are hitting the coasters right on cue.`,
          delta: 18,
        },
        {
          text: `💎 Stepping inside now, let’s make Date #1 one for the books.`,
          reply: `Best entrance in the whole room. Let’s begin.`,
          delta: 25,
          cost: 1,
          badge: 'Launch Date #1',
        },
      ],
    },
  ];
}

function buildTrapChapter(
  profile: V35CastProfile,
  photos: [string, string, string, string, string, string],
): {
  tinder: ChatBeat[];
  imessage: ChatBeat[];
  spicySuggestions: string[];
  cutLooseVerdict: CutLooseVerdict;
} {
  if (profile.id === 'graham') {
    return {
      tinder: [
        {
          beatNumber: 1,
          incomingMessages: [
            'So glad we connected, how about a spontaneous 5:15 PM martini tomorrow before my 6:45 Tokyo portfolio call?',
          ],
          trapClueHint: 'Clue #1: Strict 5:15–6:40 PM window before evening commute.',
          choices: [
            {
              text: 'Why 5:15 PM instead of normal 8 PM dinner?',
              reply: 'Asian markets keep my evenings after 6:45 completely tied up every night!',
              delta: 12,
            },
            {
              text: 'Wait, Tokyo opens at 5 PM Pacific, why would calls lock you out all weekend too?',
              reply: 'Haha private equity never sleeps! Trust me, two hours at 5:15 is way more fun.',
              delta: 14,
            },
            {
              text: '💎 What’s really waiting at 7:15 PM, Graham. Tokyo equities or a Montecito dinner table?',
              reply: 'Haha sharp sense of humor! Strictly deal flow, I swear.',
              delta: 18,
              cost: 1,
              badge: 'Press Clue',
            },
          ],
        },
        {
          beatNumber: 2,
          incomingMessages: [
            'Also quick heads-up: my firm has strict compliance rules, so I keep zero personal social media and prefer dark corner booths.',
          ],
          trapClueHint: 'Clue #2: Blames SEC "compliance" for hiding in dark booths.',
          choices: [
            {
              text: 'SEC compliance bans sitting near restaurant windows now?',
              reply: 'Clients are everywhere downtown. Table 9 in the back alcove is much cozier.',
              delta: 14,
            },
            {
              text: 'Sounds very undercover, Mr. Wharton.',
              reply: 'Privacy is luxury these days!',
              delta: 10,
            },
            {
              text: '💎 Funny, someone in Discord just mentioned a shared "Table 9 Tokyo Call" tab.',
              reply: '...Must be a totally different Graham! Anyway, 5:15 tomorrow?',
              delta: 18,
              cost: 1,
              badge: 'Clock Sweat',
            },
          ],
        },
        {
          beatNumber: 3,
          incomingMessages: [
            'One small favor: if you text me after 6:45 PM or on Sundays, my notifications are muted for deep work.',
          ],
          trapClueHint: 'Clue #3: Muted notifications every night + all Sunday.',
          choices: [
            {
              text: 'Muted every single evening AND Sunday morning? That’s a marriage schedule.',
              reply: 'Just ruthless executive boundaries! You’ll love how focused I am at 5:15.',
              delta: 12,
            },
            {
              text: 'Sure, let’s hear the next excuse.',
              reply: 'Wait until you try the martinis at The Marlow Lounge.',
              delta: 10,
            },
            {
              text: '💎 Does your left ring finger have a matching "deep work" tan line too?',
              reply: 'That’s from my sailing watch... Wait, my watch goes on my wrist. Golf glove!',
              delta: 18,
              cost: 1,
              badge: 'Gotcha Check',
            },
          ],
        },
        {
          beatNumber: 4,
          incomingMessages: [
            'Grabbed a suite room key downtown for happy hour convenience!',
          ],
          photoDrop: {
            id: 'photo-graham-watch',
            previewCaption: 'Graham’s 6:30 PM bar check (inspect the wrist & ring-finger tan line)',
            imageUrl: photos[3],
            unlockCost: 1,
            exifClue: '📍 EXIF Alert: Geotagged 6:41 PM near Montecito Commuter Lot, shared family calendar alert visible on watch face!',
            secretNote: '🚨 SMOKING GUN: Zooming in reveals a pale wedding-band tan line on his left ring finger and “Carpool 7:15 AM” on his watch!',
          },
          choices: [
            {
              text: 'Booking a daytime hotel key before we’ve even had one coffee? Huge tell.',
              reply: 'Just trying to be efficient with our 90-minute window!',
              delta: 10,
            },
            {
              text: 'Interesting how your left hand stays tucked under the napkin.',
              reply: 'Pure coincidence, promise!',
              delta: 12,
            },
            {
              text: '💎 Keep talking, you’re handing me every receipt for the group chat.',
              reply: 'Haha love feisty banter! Let’s move to my work burner, er, second iPhone.',
              delta: 16,
              cost: 1,
              badge: 'Receipt Collector',
            },
          ],
        },
        {
          beatNumber: 5,
          incomingMessages: [
            'Let’s pay cash at the bar tomorrow too, keeps corporate accounting super clean.',
          ],
          choices: [
            {
              text: 'Corporate accounting or a joint Chase Sapphire statement?',
              reply: 'You should have been a litigator haha!',
              delta: 12,
            },
            {
              text: 'Uh-huh, paper bills only.',
              reply: 'Old-school gentleman style!',
              delta: 8,
            },
            {
              text: '💎 Last chance to come clean before Friday, Graham.',
              reply: '5:15 PM sharp tomorrow, don’t be late because I have to dash at 6:42!',
              delta: 14,
              cost: 1,
              badge: 'Final Warning',
            },
          ],
        },
        {
          beatNumber: 6,
          incomingMessages: [
            'Here is my "travel phone" number so we can lock in 5:15 PM, or are you having second thoughts?',
          ],
          choices: [
            {
              text: 'Let’s see what happens if I actually walk into this 5:15 PM circus.',
              reply: 'Amazing, texting you from my second phone now!',
              delta: 10,
            },
            {
              text: 'Sure, send the burner text.',
              reply: 'See you at Table 9 at 5:15!',
              delta: 10,
            },
            {
              text: '💎 Send the number, though my finger is hovering right over Cut Loose.',
              reply: 'Trust me, 5:15 tomorrow will be unforgettable!',
              delta: 12,
              cost: 1,
              badge: 'Risky Walk-In',
            },
          ],
        },
      ],
      imessage: buildImessageFollowup('Graham', true, photos[5]),
      spicySuggestions: [
        'Explain why your phone goes straight to voicemail at 6:46 PM.',
        'Tell me who else shares the Table 9 corporate tab.',
      ],
      cutLooseVerdict: {
        isActualTrap: true,
        headline: '🏆 BULLET DODGED: Married 6:45 Commuter Clocked!',
        bestieNote:
          'Jade: Pale ring-tan line, strict 6:45 curfew, cash-only booths, and a "travel phone." 100% married in Montecito.',
        receiptShareLine:
          'Clocked a secretly married "6:45 PM Tokyo Call" commuter in 3 texts flat. Friday Night Heart preserved 🏆🚩',
        conspiracyClueId: 'clue-graham-645',
      },
    };
  }

  const trapCluesByPerson: Record<
    string,
    { m1: string; m2: string; m3: string; headline: string; note: string; clue?: string }
  > = {
    connor: {
      m1: 'Yo!! Okay funny story before we meet. Hinge locked my birth year at 27 from an old account lol, I’m actually 21 turning 22 next spring.',
      m2: 'Age is just a number anyway right?? Skip crowded bars, just send me your home address and I’ll Uber straight over tonight.',
      m3: 'My four frat roommates are throwing a dye tournament so my place is packed, yours has a pool right?',
      headline: '🏆 BULLET DODGED: Age-Filter Liar & House-Invite Tourist Blocked!',
      note: 'Jade: Lied by six years to slip past your age filter and invited himself straight to your house without a public drink.',
    },
    devon: {
      m1: 'I haven’t stopped staring at your photos. I already started writing a chorus about us driving up to Big Sur next month.',
      m2: 'Is it crazy that after ten minutes I feel like you understand me better than anyone I’ve ever met?',
      m3: 'Wait... Friday dinner is stressing me out, also if we grab coffee first do you mind splitting the $6.50 meter on Venmo? Staying home on Roblox tonight to clear my head.',
      headline: '🏆 BULLET DODGED: Tuesday Poet / Friday 4 PM Flake Clocked!',
      note: 'Jade: Textbook 48-hour love-bomber. Writes Big Sur sonnets on Tuesday and flakes before Friday appetizers.',
    },
    vanessa: {
      m1: 'Darling, just so there’s zero confusion. Lawrence and I are practically divorced, we simply still live in the same Bel Air house for property taxes.',
      m2: 'Let’s meet strictly between 1 PM and 4 PM Wednesdays at a hotel bar near your side of town, never call after six because the house gets loud.',
      m3: 'Also if a tall guy in a golf vest ever walks into The Marlow Lounge near Table 9, pretend you’re my interior-lighting consultant!',
      headline: '🏆 BULLET DODGED: "Practically Divorced" Same-House Mirage!',
      note: 'Sam: "Practically divorced in the same house" plus pretending to be her lighting consultant? Full Bel Air soap opera dodged.',
      clue: 'clue-vanessa-alibi',
    },
    brooke: {
      m1: 'Friday at 8:00 PM sharp. I booked us the center patio table directly across from Table 9 where my ex-husband Richard eats every week!',
      m2: 'Wear a dark navy blazer. Richard hates when younger guys look better in tailoring than him, and remember to laugh loud when he looks over.',
      m3: 'Honestly I don’t even care what’s on the menu, I just need his golf buddies to see I upgraded by fifteen years!',
      headline: '🏆 BULLET DODGED: Ex-Husband Revenge Pawn Escaped!',
      note: 'Sam: She cast you as an unpaid prop just to rattle her ex-husband Richard across from Table 9.',
      clue: 'clue-brooke-table9',
    },
  };

  const spec = trapCluesByPerson[profile.id];
  return {
    tinder: [
      {
        beatNumber: 1,
        incomingMessages: [spec.m1],
        trapClueHint: 'Red Flag #1 surfaced right out of the gate.',
        choices: [
          {
            text: 'Hold on, repeat that part again slowly.',
            reply: 'Haha I knew you’d appreciate total honesty!',
            delta: 10,
          },
          {
            text: 'That sounds like a giant red banner waving in the wind.',
            reply: 'Nooo trust me, everyone does it!',
            delta: 12,
          },
          {
            text: '💎 Keep talking, let’s see how deep this hole gets.',
            reply: spec.m2,
            delta: 16,
            cost: 1,
            badge: 'Probe Deeper',
          },
        ],
      },
      {
        beatNumber: 2,
        incomingMessages: [spec.m2],
        trapClueHint: 'Red Flag #2: boundary or timeline dodge.',
        choices: [
          {
            text: 'Wait, you really don’t hear how wild that sounds?',
            reply: 'You’re way overthinking the logistics!',
            delta: 10,
          },
          {
            text: 'Interesting strategy, what happens on Friday night?',
            reply: 'Well, about Friday...',
            delta: 10,
          },
          {
            text: '💎 Let’s hear excuse number three before I call my bestie.',
            reply: 'Zero excuses, just vibes!',
            delta: 14,
            cost: 1,
            badge: 'Spot Tell',
          },
        ],
      },
      {
        beatNumber: 3,
        incomingMessages: [spec.m3],
        trapClueHint: 'Red Flag #3: full motive exposed.',
        choices: [
          {
            text: 'And there is the entire plot twist in plain English.',
            reply: 'Come on, live a little!',
            delta: 10,
          },
          {
            text: 'My intuition meter is flashing bright crimson right now.',
            reply: 'Crimson is a romantic color though!',
            delta: 10,
          },
          {
            text: '💎 Screenshotting this masterclass in red flags for research.',
            reply: 'Wait don’t screenshot lol!',
            delta: 14,
            cost: 1,
            badge: 'Receipt Saved',
          },
        ],
      },
      {
        beatNumber: 4,
        incomingMessages: ['Anyway here’s a photo so you forget all those pesky details!'],
        photoDrop: {
          id: `photo-trap-${profile.id}`,
          previewCaption: `Suspicious camera-roll snapshot from ${profile.name}`,
          imageUrl: photos[5],
          unlockCost: 1,
          exifClue:
            profile.id === 'connor'
              ? '📍 EXIF Alert: Shot at 1:48 AM on Fraternity Row, four red solo cups cropped right out of frame!'
              : profile.id === 'devon'
                ? '📍 EXIF Alert: Saved from a two-year-old camera roll folder, definitely not taken tonight!'
                : profile.id === 'vanessa'
                  ? '📍 EXIF Alert: Geotagged inside the Bel Air main residence, framed wedding portrait blurred behind her!'
                  : '📍 EXIF Alert: Shot on ring-light timer #14 aimed directly across at Table 9!',
          secretNote:
            profile.id === 'connor'
              ? '🚨 SMOKING GUN: Sophomores in fraternity hoodies photobombing the mirror reflection, hit Block & Cut Loose for +25 XP!'
              : profile.id === 'devon'
                ? '🚨 SMOKING GUN: Recycled thirst trap while stalling on Friday plans, hit Block & Cut Loose for +25 XP!'
                : profile.id === 'vanessa'
                  ? '🚨 SMOKING GUN: Husband’s golf bag sitting right by the front door, hit Block & Cut Loose for +25 XP!'
                  : '🚨 SMOKING GUN: Ex-husband Richard is literally circled in the background booth, hit Block & Cut Loose for +25 XP!',
        },
        choices: [
          {
            text: 'Great jawline, terrible logistics.',
            reply: 'One out of two isn’t bad!',
            delta: 10,
          },
          {
            text: 'Pretty photos don’t fix a chaotic Friday setup.',
            reply: 'Give it one drink and see!',
            delta: 10,
          },
          {
            text: '💎 Almost distracting, almost.',
            reply: 'Almost counts!',
            delta: 12,
            cost: 1,
            badge: 'Unfazed',
          },
        ],
      },
      {
        beatNumber: 5,
        incomingMessages: ['So are we still on, or are you going to hit that little red flag button?'],
        choices: [
          {
            text: 'Still deciding whether to cut you loose right here.',
            reply: 'Take a gamble on Friday!',
            delta: 8,
          },
          {
            text: 'Testing what happens if we keep talking.',
            reply: 'Bold choice!',
            delta: 8,
          },
          {
            text: '💎 One last beat before the verdict drops.',
            reply: 'Fingers crossed!',
            delta: 10,
            cost: 1,
            badge: 'Final Beat',
          },
        ],
      },
      {
        beatNumber: 6,
        incomingMessages: ['Last call, moving this chaos to iMessage or cutting loose back to the drawing board?'],
        choices: [
          {
            text: 'Fine, let’s watch this Friday trainwreck unfold.',
            reply: 'Locked in, don’t say I didn’t warn you!',
            delta: 8,
          },
          {
            text: 'Proceeding strictly for science.',
            reply: 'Science wins!',
            delta: 8,
          },
          {
            text: '💎 Walking in eyes wide open just to turn the tables.',
            reply: 'See you Friday!',
            delta: 12,
            cost: 1,
            badge: 'Chaos Route',
          },
        ],
      },
    ],
    imessage: buildImessageFollowup(profile.name, profile.role === 'him', photos[4]),
    spicySuggestions: ['Confess the real Friday agenda in five words.'],
    cutLooseVerdict: {
      isActualTrap: true,
      headline: spec.headline,
      bestieNote: spec.note,
      receiptShareLine: `${spec.headline} (+25 Discernment XP on Cougars & Cubs Club!)`,
      conspiracyClueId: spec.clue,
    },
  };
}

export const V35_CHAT_CHAPTERS: Record<
  string,
  {
    tinder: ChatBeat[];
    imessage: ChatBeat[];
    spicySuggestions: string[];
    cutLooseVerdict: CutLooseVerdict;
  }
> = Object.fromEntries(
  V35_CAST_PROFILES.map((profile) => [profile.id, buildLeadOrCameoChapter(profile)]),
);

interface BespokeLeadStoryPack {
  date1Title: string;
  date1Beat1Dialogue: string;
  date1Beat2Dialogue: string;
  date2Title: string;
  date2Backdrop: string;
  date2Beat1Dialogue: string;
  date2Beat1GoodLabel: string;
  date2Beat1GoodResponse: string;
  date2Beat1BadLabel: string;
  date2Beat1BadResponse: string;
  date2Beat2Dialogue: string;
  date2Beat2GoodLabel: string;
  date2Beat2GoodResponse: string;
  date2Beat2VipLabel: string;
  date2Beat2VipResponse: string;
  date3Title: string;
  date3Backdrop: string;
  date3Beat1Dialogue: string;
  date3Beat1GoodLabel: string;
  date3Beat1GoodResponse: string;
}

const BESPOKE_MAIN_LEAD_STORIES: Record<string, BespokeLeadStoryPack> = {
  julian: {
    date1Title: 'Half Seven at Left Bank’s Candlelit Courtyard',
    date1Beat1Dialogue:
      'Julian stands five minutes early in rolled white linen beside fresh peonies: "Zero phones on the table tonight, darling, and I already checked the courtyard acoustics."',
    date1Beat2Dialogue:
      'Julian sets his fellowship card on the leather check presenter without fanfare: "Tonight was my invitation. You can spoil me at your favorite coastal bistro next week if I earn Date Two."',
    date2Title: 'Date #2: Westwood Gallery Opening & Catching Himself "Cubsplaining"',
    date2Backdrop: V35_SCENE_BACKDROPS['left-bank-books'],
    date2Beat1Dialogue:
      'Halfway through lecturing on 1995 Camden Britpop vinyl, Julian freezes and blushes crimson: "Oh God, I was three seconds from Cubsplaining Pulp to someone who actually lived nineties London. Shutting up immediately."',
    date2Beat1GoodLabel:
      'Tease him warmly for catching himself in record time and trade real 1995 stories.',
    date2Beat1GoodResponse:
      'Julian grins with relief, kissing your knuckles right in front of the curator.',
    date2Beat1BadLabel: 'Roll your eyes coldly and leave him squirming by the wall.',
    date2Beat1BadResponse: 'Julian apologizes politely while the playful spark dims.',
    date2Beat2Dialogue:
      'Over espresso, a snooty acquaintance eyes your 27-year-old British date: "How sweet, are you interning nearby?"',
    date2Beat2GoodLabel:
      'Introduce Julian proudly by his UCL fellowship and laugh it off together.',
    date2Beat2GoodResponse:
      '"Bloody hell, the way you backed me just then made my whole month," Julian murmurs.',
    date2Beat2VipLabel:
      '💎 Slip your arm through Julian’s: "Visiting architectural historian, and spoken for all Friday."',
    date2Beat2VipResponse:
      'Julian’s ears turn pink with delight: "Consider me utterly yours, darling."',
    date3Title: 'Date #3: Sunday Saffron Risotto & Morning-Light Honesty',
    date3Backdrop: './images/scenes/sunday-kitchen-sanctuary.jpg',
    date3Beat1Dialogue:
      'Bright Sunday sunlight hits the kitchen island as Julian wraps his arms around your waist: "Truth? All week I worried whether I had enough presence to keep an extraordinary woman like you intrigued."',
    date3Beat1GoodLabel:
      'Meet his honesty head-on and plan his post-fellowship chapter on the coast.',
    date3Beat1GoodResponse:
      'Julian exhales against your neck: "Best call of my life was saying hello at half seven."',
  },
  soren: {
    date1Title: 'Clay-Court Twilight & The "Two Queen Beds?" Mix-Up',
    date1Beat1Dialogue:
      'At the inn lounge bar, a flustered young clerk glances between you and 6\'3" Søren before asking about two Queen beds. Søren doesn’t blink: "Two dry martinis by the fire tonight, tack, and one King would be plenty."',
    date1Beat2Dialogue:
      'Away from the blushing clerk, Søren speaks with quiet Nordic candor: "People misread my silence as distance. Truth is, I date once every few years and commit all the way."',
    date2Title: 'Date #2: 62°F Timber Sanctuary & Two Linen Duvets',
    date2Backdrop: './images/scenes/sunday-kitchen-sanctuary.jpg',
    date2Beat1Dialogue:
      'Warm 2700K lamps glow in Søren’s timber studio as lemon sole sizzles: "Thermostat at 62 degrees, overhead lights banned, and two separate Scandinavian linen duvets so nobody ever fights for covers."',
    date2Beat1GoodLabel:
      'Praise his two-duvet Scandinavian setup and toast to elite adult hosting.',
    date2Beat1GoodResponse:
      'Søren breaks into a rare, boyish grin over the stove.',
    date2Beat1BadLabel: 'Complain about 62°F and flip on the harsh ceiling light.',
    date2Beat1BadResponse: 'Søren winces playfully at the ceiling glare and taps the dimmer.',
    date2Beat2Dialogue:
      'Out on the canyon deck, Søren clinks glasses softly: "My favorite luxury is comfortable silence with someone where neither of us has to perform."',
    date2Beat2GoodLabel:
      'Embrace unhurried silence, airplane-mode nights, and 7 AM ocean swims.',
    date2Beat2GoodResponse: '"In Denmark we call that finding harbor," Søren says softly.',
    date2Beat2VipLabel:
      '💎 Claim the left linen duvet and lock in Thursday mixed-doubles rematches.',
    date2Beat2VipResponse: 'Søren pulls you into his chest: "Left duvet is officially yours."',
    date3Title: 'Date #3: Coastal Bluff Fog & Intentional Horizon',
    date3Backdrop: './images/scenes/cozy-rain-suite.jpg',
    date3Beat1Dialogue:
      'Morning fog rolls past the glass as Søren sets down two cortados: "Zero ambiguity and zero kid pressure neither of us wants. Just building a calm coastal life side by side."',
    date3Beat1GoodLabel:
      'Say yes with full clarity to travel and unhurried mornings together.',
    date3Beat1GoodResponse:
      'Søren rests his forehead against yours: "I was done looking the night we met."',
  },
  miles: {
    date1Title: 'The 8:15 Corner Banquette Zero-Decision Takeover',
    date1Beat1Dialogue:
      'Miles opens the passenger door with your seat warmer already humming, then guides you into a cedar booth: "You made forty executive calls since Monday. Tonight your decision count is officially zero."',
    date1Beat2Dialogue:
      'Over bourbon and oysters, Miles lets his guard drop: "Everyone hands me blueprints to fix all week. I almost forgot how good it feels when someone asks how my day went."',
    date2Title: 'Date #2: The Sommelier "Your Son?" Hand-Kiss Save',
    date2Backdrop: V35_SCENE_BACKDROPS['velvet-room'],
    date2Beat1Dialogue:
      'A nervous rookie sommelier asks if "your son" will join the pairing. Miles lifts your hand, kisses your knuckles, and deadpans: "Definitely not her son, mate, though we will take two comped pours of vintage Champagne while you recover."',
    date2Beat1GoodLabel:
      'Laugh right alongside Miles as two comped Champagne flutes arrive.',
    date2Beat1GoodResponse:
      'The chef’s counter applauds softly while Miles winks across the crystal.',
    date2Beat1BadLabel: 'Get mortified and ask to pack up dinner early.',
    date2Beat1BadResponse: 'Miles handles the exit smoothly, wishing you saw how radiant you look.',
    date2Beat2Dialogue:
      'Strolling the marina dock with boxed tiramisu, Miles smiles: "When both our weeks run hot, what is your golden rule for protecting our weekends?"',
    date2Beat2GoodLabel:
      'Friday passenger-seat exhale paired with protected Sunday recharge hours.',
    date2Beat2GoodResponse: '"Spoken like a woman who knows her worth," Miles grins.',
    date2Beat2VipLabel:
      '💎 Reward his sommelier save with one slow bourbon nightcap aboard.',
    date2Beat2VipResponse: 'Miles’s voice drops an octave: "Best save of my career."',
    date3Title: 'Date #3: Two Sanctuaries & True Partner Keys',
    date3Backdrop: './images/scenes/palm-springs-resort.jpg',
    date3Beat1Dialogue:
      'Out past the breakwater at sunset, Miles pulls you close: "I never want to crowd the home you built. With you, I finally get to stop playing invincible."',
    date3Beat1GoodLabel:
      'Choose full partnership while keeping both sanctuaries thriving.',
    date3Beat1GoodResponse:
      'Miles wraps his wool coat around your shoulders: "Home port found."',
  },
  rafael: {
    date1Title: 'Havana Courtyard Salsa & Midnight Garlic Oil',
    date1Beat1Dialogue:
      'Under courtyard string lights, Rafael spins you cleanly before your Rioja touches the table: "Relax your shoulders. I have the frame, nobody bumps into you on my watch."',
    date1Beat2Dialogue:
      'Rafael traces the joinery calluses on his palm with quiet pride: "Built every inch of my Silver Lake studio by hand, zero family money."',
    date2Title: 'Date #2: Industry Black-Tie Gala & The Whisper Test',
    date2Backdrop: V35_SCENE_BACKDROPS['velvet-room'],
    date2Beat1Dialogue:
      'At your black-tie gala, two VPs whisper near the champagne tower about your 26-year-old woodworker. Rafael meets your eyes calmly: "Your room, meu bem. Say the word and we own that dance floor."',
    date2Beat1GoodLabel:
      'Introduce Rafael by full name and studio title, then take the ballroom floor.',
    date2Beat1GoodResponse:
      'Jaws drop across Table 1 as Rafael leads the smoothest slow dance of the night.',
    date2Beat1BadLabel: 'Drop his hand awkwardly and steer him away from colleagues.',
    date2Beat1BadResponse: 'Rafael stays polite, though hurt flickers in his dark eyes.',
    date2Beat2Dialogue:
      'Out on the terrace after out-dancing every stiff VP inside, Rafael grins: "Tell me what wins permanent Sunday-morning points at your house."',
    date2Beat2GoodLabel:
      'Acts of service and great espresso beat empty poetry every time.',
    date2Beat2GoodResponse: '"Just wait until Sunday at seven," Rafael winks.',
    date2Beat2VipLabel:
      '💎 Loosen his black silk bow tie: "Take me to Silver Lake and play the seven-string."',
    date2Beat2VipResponse: 'Rafael’s breath catches against your palm: "Car is right out front."',
    date3Title: 'Date #3: Warm Pão de Queijo & The Fixed Patio Latch',
    date3Backdrop: './images/scenes/sunday-kitchen-sanctuary.jpg',
    date3Beat1Dialogue:
      'You wake to Brazilian espresso and discover Rafael quietly planed and oiled your sticky patio latch at dawn: "Couldn’t let a good door stick on my watch."',
    date3Beat1GoodLabel:
      'Pull the woodworker into your arms and lock in real commitment.',
    date3Beat1GoodResponse:
      'Rafael laughs against your lips: "Every door here opens smoothly from now on."',
  },
  marcus: {
    date1Title: 'Jazz-Lounge Doorman Stand & The UV ID Check',
    date1Beat1Dialogue:
      'The jazz-club doorman UV-scans 27-year-old Marcus’s ID for ten seconds, then waves you straight in. Marcus grins with zero ego: "Means I absorb the carding delay and you get the booth by the saxophonist."',
    date1Beat2Dialogue:
      'Over charred mahi-mahi, Marcus speaks warmly about his 24-hour ocean-rescue shifts: "My mom Denise is forty-nine, and I promise you will never walk into an unprepped family surprise."',
    date2Title: 'Date #2: Vinyl Sunday Grill & Meeting His Mom Denise',
    date2Backdrop: './images/scenes/sunday-kitchen-sanctuary.jpg',
    date2Beat1Dialogue:
      'Marvin Gaye spins by the backyard grill as Marcus’s 49-year-old mom Denise hands you chilled Pinot Grigio: "Marcus told me all week how brilliant you are. Want to see his rookie braces photos?"',
    date2Beat1GoodLabel:
      'Bond with Denise over 90s R&B and roast Marcus’s academy haircut together.',
    date2Beat1GoodResponse:
      'Denise whispers by the kitchen door: "Keep him, he hasn’t smiled like this in years."',
    date2Beat1BadLabel: 'Act stiff and defensive about being close to Denise’s age.',
    date2Beat1BadResponse: 'Marcus smooths things over kindly, though the afternoon stays formal.',
    date2Beat2Dialogue:
      'After Denise hugs you at the gate, Marcus leans against the porch rail: "How do you feel about my 24-hour station shifts once things get serious?"',
    date2Beat2GoodLabel:
      'Solo weeknights on shift days followed by undivided 48-hour weekends together.',
    date2Beat2GoodResponse: '"Dream rhythm," Marcus smiles, lifting you onto the counter.',
    date2Beat2VipLabel:
      '💎 Test whether his 48-BPM resting pulse survives five minutes alone on the patio.',
    date2Beat2VipResponse: 'Marcus checks his watch laughing: "Officially up to ninety-two."',
    date3Title: 'Date #3: Post-Shift Harbor & Steady Anchor',
    date3Backdrop: './images/scenes/cozy-rain-suite.jpg',
    date3Beat1Dialogue:
      'At 8 PM after a long week, Marcus arrives with homemade lemon pasta and calm arms: "No drama, no disappearing acts. Let me be your steady harbor."',
    date3Beat1GoodLabel:
      'Go all in together with the steadiest heart on the coast.',
    date3Beat1GoodResponse:
      'Marcus holds you close: "Never canceling, never running, you have me."',
  },
  elena: {
    date1Title: 'Post-Grades Sancerre & The Sixty-Second Test',
    date1Beat1Dialogue:
      'Elena tucks a blonde curl behind her ear over chilled Sancerre: "Sixty seconds on the clock. Make me laugh without mentioning seminars, footnotes, or my height."',
    date1Beat2Dialogue:
      'Her Department Chair armor softens over the second pour: "Men my age always treated my books like competition instead of foreplay."',
    date2Title: 'Date #2: Gen-X Punctuation & The Dean’s Salon Dinner',
    date2Backdrop: V35_SCENE_BACKDROPS['left-bank-books'],
    date2Beat1Dialogue:
      'At the Dean’s dinner, Elena raises her glass with an impressed smirk: "Thank heaven you didn’t spiral when I texted \'Sounds good.\' with a period today. Ready for my pompous Philosophy rival at twelve o’clock?"',
    date2Beat1GoodLabel:
      'Charm the Dean, back Elena’s sharp wit, and never compete for her spotlight.',
    date2Beat1GoodResponse:
      'Her rival retreats while Elena squeezes your knee under the linen.',
    date2Beat1BadLabel: 'Try to out-lecture two tenured professors using skimmed Wikipedia notes.',
    date2Beat1BadResponse: 'Elena rescues the topic gracefully with one warning tap on your ankle.',
    date2Beat2Dialogue:
      'Walking the moonlit quad in your jacket, Elena glances up: "Book deadline month starts Monday. What is your Sunday morning house law?"',
    date2Beat2GoodLabel:
      'Silent tea delivery before ten, quiet phones, and full Sunday dinner duty.',
    date2Beat2GoodResponse: '"A+ with distinction," Elena purrs, tugging your lapel.',
    date2Beat2VipLabel:
      '💎 Carry her hardcovers in one hand and steal a slow kiss under the arches.',
    date2Beat2VipResponse: 'Elena laughs breathlessly: "Forget office hours."',
    date3Title: 'Date #3: Rainy Westwood Study & Dropping the Armor',
    date3Backdrop: './images/scenes/cozy-rain-suite.jpg',
    date3Beat1Dialogue:
      'Rain streaks her study windows as Elena sets down her teacup: "Tell me straight. Do you want a fun semester story, or a real equal partnership?"',
    date3Beat1GoodLabel:
      'Choose the real partnership and delight in her brilliance long-term.',
    date3Beat1GoodResponse:
      'Elena steps onto your chair rung to kiss you deeply: "Best plot twist of my forties."',
  },
  claire: {
    date1Title: 'Three-Olive Gibsons & The Smooth Check-Drop',
    date1Beat1Dialogue:
      'Claire studies you across The Marlow Lounge leather booth over a three-olive Gibson: "Five minutes early, crisp collar, phone face-down. You just survived the ninety-second M&A audit."',
    date1Beat2Dialogue:
      'Discovering you already tapped Apple Pay cleanly on your way back from washing up, Claire arches a brow: "Zero awkward speech, zero hesitation. Very smooth."',
    date2Title: 'Date #2: Manhattan Beach Brunch & Her 22-Year-Old Son Leo',
    date2Backdrop: V35_SCENE_BACKDROPS['st-jude-coffee'],
    date2Beat1Dialogue:
      'Halfway through patio brunch, Claire’s 22-year-old Stanford senior son Leo drops by in surf shorts: "Wait, Mom, this guy is like four years older than me!"',
    date2Beat1GoodLabel:
      'Stand up with easy peer warmth, zero fake stepdad posture, and ask about his finals.',
    date2Beat1GoodResponse:
      'Leo fist-bumps you on the way out and texts Claire: "Okay Mom, he is actually cool."',
    date2Beat1BadLabel: 'Posture stiffly like a stern stepdad handing out career lectures.',
    date2Beat1BadResponse: 'Claire shoots you a crisp boardroom look as Leo heads out.',
    date2Beat2Dialogue:
      'Barefoot on the strand afterward, Claire watches the surf: "I fought hard for my post-divorce peace. Think you can handle high romance without merging houses?"',
    date2Beat2GoodLabel:
      'Honor her independence: two homes, zero pressure, electric Fridays through Sundays.',
    date2Beat2GoodResponse: '"God, where were you ten years ago?" Claire laughs into the wind.',
    date2Beat2VipLabel:
      '💎 Book next Friday’s coastal inn yourself so the boss finally gets spoiled.',
    date2Beat2VipResponse: 'Claire’s eyes warm instantly: "Keep leading like that and I’m hooked."',
    date3Title: 'Date #3: Oceanfront Deck & The Two-Keys Pact',
    date3Backdrop: './images/scenes/palm-springs-resort.jpg',
    date3Beat1Dialogue:
      'Claire slides a brass spare key across her teak deck table: "Committed Living-Apart-Together devotion. Two homes, zero marriage paperwork, choosing each other every week."',
    date3Beat1GoodLabel:
      'Accept the brass key joyfully and commit on purpose.',
    date3Beat1GoodResponse:
      'Claire pulls you down onto the sunset daybed: "Every Friday is yours."',
  },
  sienna: {
    date1Title: 'Olive-Tree Courtyard Rosé & Junior-Cougar Math',
    date1Beat1Dialogue:
      'Under terracotta lanterns, 39-year-old Sienna clinks chilled rosé and laughs: "Wait, when I was parallel-parking into 2009 UCLA critiques, you were surviving tenth-grade geometry!"',
    date1Beat2Dialogue:
      'Sienna’s tone turns candid over warm olives: "The last younger guy acted weird whenever friends walked past. Secrecy is my one instant dealbreaker."',
    date2Title: 'Date #2: Courtyard Dinner & Nephew Sam’s Crew',
    date2Backdrop: V35_SCENE_BACKDROPS['velvet-palms-bbq'],
    date2Beat1Dialogue:
      'At a courtyard dinner, your twenty-something rec-league buddies walk in right beside Sienna’s 27-year-old nephew Sam: "Whoa, no way, you two are together?!"',
    date2Beat1GoodLabel:
      'Rest your hand at Sienna’s waist and claim her proudly in front of everyone.',
    date2Beat1GoodResponse:
      'Sam raises a bottle grinning, "Approved, Aunt Sienna!" while she beams all night.',
    date2Beat1BadLabel: 'Step sideways and pretend you were only talking about patio tile.',
    date2Beat1BadResponse: 'Sienna’s smile freezes instantly. Secrecy never flies here.',
    date2Beat2Dialogue:
      'With Al Green spinning in her kitchen afterward, Sienna grins: "Think you can survive 6:45 AM Rose Bowl antique-market runs with me?"',
    date2Beat2GoodLabel:
      'Promise cortados in the cupholders and heavy vintage-brass lifting duty.',
    date2Beat2GoodResponse: '"Officially hired for life," Sienna laughs, kissing your jaw.',
    date2Beat2VipLabel:
      '💎 Spin her across the terracotta kitchen tile before touching the dishes.',
    date2Beat2VipResponse: 'Sienna melts into your shoulder as Al Green plays on.',
    date3Title: 'Date #3: Dawn Brass Finds & Sunlit Future',
    date3Backdrop: './images/scenes/sunday-kitchen-sanctuary.jpg',
    date3Beat1Dialogue:
      'Fresh figs sit beside antique sconces on her sunlit patio as Sienna meets your eyes: "Six years apart turned out to be the sweet spot. Ready to do this for real?"',
    date3Beat1GoodLabel:
      'Say yes wholeheartedly to an open-door life under the olive trees.',
    date3Beat1GoodResponse:
      'Sienna kisses you in full morning sun: "Best find in Pasadena."',
  },
  priya: {
    date1Title: '7:30 AM Bluff Croissants & Cardamom Cold Brew',
    date1Beat1Dialogue:
      'Meeting Priya at 7:30 AM after her night shift with warm almond croissants overlooking the waves, she exhales: "Zero loud restaurant menus after trauma bay. You actually listened."',
    date1Beat2Dialogue:
      'Priya leans back against the coastal bench: "My ex resented my hospital shifts and still expected dinner waiting. Off-duty, I want a teammate."',
    date2Title: 'Date #2: Blackout-Curtain Law & Cutthroat Scrabble',
    date2Backdrop: './images/scenes/sunday-kitchen-sanctuary.jpg',
    date2Beat1Dialogue:
      'You guard her sleep until 3 PM and greet her in a linen apron with seared lamb chops right as her ER bestie FaceTimes in: "Hold the phone, show me the chef immediately!"',
    date2Beat1GoodLabel:
      'Charm her ER bestie on FaceTime and take Priya’s Scrabble trash talk with a grin.',
    date2Beat1GoodResponse:
      'Priya drops a 64-point triple word while her bestie yells "MARRY HIM!" on speaker.',
    date2Beat1BadLabel: 'Sulk over losing Scrabble and complain about her daytime sleep schedule.',
    date2Beat1BadResponse: 'Priya packs away the tiles with charge-nurse precision.',
    date2Beat2Dialogue:
      'Curled on the sofa after beating you by forty points, Priya smirks: "Still brave enough to date a charge nurse who shows zero mercy at board games?"',
    date2Beat2GoodLabel:
      'Volley her tease right back and pull her tired feet into your lap.',
    date2Beat2GoodResponse: '"A man who banters back AND rubs my feet," Priya sighs happily.',
    date2Beat2VipLabel:
      '💎 Pack tomorrow night’s hospital tiffin box with lamb and a cheeky note.',
    date2Beat2VipResponse: 'Priya blinks hard: "Nobody has ever packed my shift meal before."',
    date3Title: 'Date #3: Safe Harbor at Culver Bluff Sunset',
    date3Backdrop: './images/scenes/cozy-rain-suite.jpg',
    date3Beat1Dialogue:
      'In evening silk instead of scrubs, Priya rests against your chest overlooking the bluffs: "All week I hold everyone else together. Sure you want to be my off-duty harbor?"',
    date3Beat1GoodLabel:
      'Commit completely to caring for the caretaker with zero scorekeeping.',
    date3Beat1GoodResponse:
      'Priya kisses you fiercely: "My off-shift calendar is permanently yours."',
  },
  summer: {
    date1Title: 'Malibu Dawn Surf & The Mineral SPF 50 Check',
    date1Beat1Dialogue:
      'Fresh out of First Point surf, 33-year-old dermatologist Summer traces your jaw: "Mineral SPF 50 down your neck, zero whining about cold water, and peonies in the trunk? Dangerous start."',
    date1Beat2Dialogue:
      'Over oceanfront fish tacos, Summer speaks plainly: "Every 38-year-old guy in Brentwood wanted endless situationships. I lowered my age slider for real partnership and family."',
    date2Title: 'Date #2: Rooftop Dinner & Outclassing the Stallers',
    date2Backdrop: V35_SCENE_BACKDROPS['velvet-room'],
    date2Beat1Dialogue:
      'At dinner with Summer’s med-school friends, a stalling 39-year-old hedge-fund date smirks across the table: "Must be nice having zero marriage timeline pressure in your twenties, kid."',
    date2Beat1GoodLabel:
      'Reply calmly that knowing what you want to build is character, not birth year.',
    date2Beat1GoodResponse:
      'Every woman at the table trades impressed glances while Summer beams.',
    date2Beat1BadLabel: 'Laugh nervously and agree marriage is way off in the distant future.',
    date2Beat1BadResponse: 'Summer’s smile cools. She is done wasting years on stallers.',
    date2Beat2Dialogue:
      'Walking Carbon Beach barefoot under moonlight, Summer nudges your shoulder: "What does our ideal Malibu Saturday morning look like?"',
    date2Beat2GoodLabel:
      'Dawn longboards, farmers-market matcha, and proactive Friday reservations.',
    date2Beat2GoodResponse: '"Energy and follow-through in one man," Summer laughs.',
    date2Beat2VipLabel:
      '💎 Scoop her up over a sudden tide surge so her heels stay dry.',
    date2Beat2VipResponse: 'Summer loops both arms around your neck laughing: "Ten out of ten reflexes."',
    date3Title: 'Date #3: Malibu Sunrise & Shared Family Chapter',
    date3Backdrop: './images/scenes/palm-springs-resort.jpg',
    date3Beat1Dialogue:
      'Morning light hits peonies on her Malibu island as Summer asks the chapter-one question: "Marriage, ocean mornings, and kids in a few years. Are we aligned?"',
    date3Beat1GoodLabel:
      'Say yes with clear eyes and build the Malibu future together.',
    date3Beat1GoodResponse:
      'Summer kisses you in the sunrise: "Thank God I lowered that age slider."',
  },
};

function buildMainLeadDateScripts(profile: V35CastProfile): DateSceneScript[] {
  const isHimMatch = profile.role === 'him';
  const bestie = isHimMatch ? 'Jade' : 'Sam';
  const pack = BESPOKE_MAIN_LEAD_STORIES[profile.id];

  return [
    {
      dateNumber: 1,
      title: pack ? pack.date1Title : `Date #1 with ${profile.name}`,
      venueBackdrop:
        V35_SCENE_BACKDROPS[profile.primaryWildVenueId || 'velvet-room'] ||
        V35_SCENE_BACKDROPS['velvet-room'],
      beats: [
        {
          speakerExpression: 'smirk',
          dialogue: pack
            ? pack.date1Beat1Dialogue
            : `${profile.name} looks up over candlelit crystal with an unhurried smile.`,
          bestiePopIn: `${bestie}: Just walked past the window, chemistry is already off the charts. Pace Night 1 smartly!`,
          choices: [
            {
              label: 'Match their eye contact warmly and toast to skipping dating-app small talk.',
              response: `${profile.name}'s shoulders drop into an easy, magnetic laugh as glasses clink.`,
              nextExpression: 'laugh',
              chemistryDelta: 20,
            },
            {
              label: 'Check your work email for two minutes before sitting down.',
              response: `${profile.name} raises one polite eyebrow while waiting for your screen to lock.`,
              nextExpression: 'icked',
              chemistryDelta: -12,
            },
            {
              label: `💎 Lean in with a slow smile: "You set a high bar in the first thirty seconds, ${profile.name}, let’s see if Act Two keeps up."`,
              response: `A flush of delighted heat crosses ${profile.name}'s face: "Gladly."`,
              nextExpression: 'blush',
              chemistryDelta: 26,
              cost: 1,
            },
          ],
        },
        {
          speakerExpression: 'neutral',
          dialogue: pack
            ? pack.date1Beat2Dialogue
            : profile.vulnerabilityNote ||
              `${profile.name} shares a candid story about wanting real connection over surface flash.`,
          choices: [
            {
              label: 'Listen attentively and respond to the real person underneath the polish.',
              response: `"Not many people catch that on a first drink," ${profile.name} murmurs warmly.`,
              nextExpression: 'blush',
              chemistryDelta: 22,
            },
            {
              label: 'Pivot the conversation into bragging about your own resume for ten minutes.',
              response: `${profile.name} nods politely while the spark cools slightly.`,
              nextExpression: 'neutral',
              chemistryDelta: -6,
            },
          ],
        },
        {
          speakerExpression: 'blush',
          dialogue: `Outside under warm evening streetlights, ${profile.name}'s hand brushes yours. The Night-1 Pacing Test arrives: rush straight upstairs tonight, or let the slow burn build toward S-Rank?`,
          choices: [
            {
              label: 'Savor a lingering goodnight kiss by the car and lock in Date #2 so the slow burn builds properly.',
              response: `${profile.name} exhales breathless against your cheek: "Smart move, now I’m going to think about you all week."`,
              nextExpression: 'blush',
              chemistryDelta: 25,
            },
            {
              label: 'Push hard to rush straight home on Night 1 before real trust is built.',
              response: `Hot spark in the moment, though rushing past ${profile.name}'s slow-burn guard caps your final relationship rank below S-Rank!`,
              nextExpression: 'smirk',
              chemistryDelta: 6,
              locksOutSRank: true,
            },
          ],
        },
      ],
      secretBestiePovLeak: {
        friendName: isHimMatch ? 'Søren (His Group Chat)' : 'Jade (Her Bestie)',
        messages: isHimMatch
          ? [
              `${profile.name}: Mate, I am completely done for.`,
              `${profile.name}: Didn't rush Night 1 either, composed, funny as hell, and smelled incredible.`,
              `Group Chat: Don't fumble Date 2. Bring your absolute A-game.`,
            ]
          : [
              `${profile.name}: Okay, you were right, zero rookie fumbles all night.`,
              `${profile.name}: Held eye contact, handled the evening cleanly, and left me wanting Date 2.`,
              `Jade: TOLD YOU!! Let him cook or meet the inner circle next.`,
            ],
        cost: 2,
      },
    },
    {
      dateNumber: 2,
      title: pack ? pack.date2Title : `Date #2 with ${profile.name}`,
      venueBackdrop: pack ? pack.date2Backdrop : V35_SCENE_BACKDROPS['havana-salsa'],
      prepAffiliateIds: isHimMatch
        ? ['princess-mulberry-silk-robe', 'chic-candlelit-menu-readers', 'espresso-martini-barware']
        : ['date-night-oud-bergamot', 'houseboy-linen-apron', 'silk-pillowcase-sleepover-duo'],
      beats: [
        {
          speakerExpression: 'laugh',
          dialogue: pack
            ? pack.date2Beat1Dialogue
            : `Halfway through Date #2 with ${profile.name}, real worlds collide.`,
          choices: [
            {
              label: pack
                ? pack.date2Beat1GoodLabel
                : 'Introduce each other with effortless pride, warm humor, and zero defensiveness.',
              response: pack
                ? pack.date2Beat1GoodResponse
                : `${profile.name} squeezes your hand under the linen tablecloth.`,
              nextExpression: 'blush',
              chemistryDelta: 24,
              triggersCubSparring: true,
            },
            {
              label: pack
                ? pack.date2Beat1BadLabel
                : 'Freeze up and act awkward until they walk away.',
              response: pack
                ? pack.date2Beat1BadResponse
                : `${profile.name} covers the silence gracefully, though you feel the hesitation.`,
              nextExpression: 'icked',
              chemistryDelta: -14,
            },
          ],
        },
        {
          speakerExpression: 'smirk',
          dialogue: pack
            ? pack.date2Beat2Dialogue
            : `Back on the terrace over espresso, ${profile.name} challenges you on shared weekend rules.`,
          choices: [
            {
              label: pack
                ? pack.date2Beat2GoodLabel
                : 'Pass with flying colors: phones silent after nine and honest communication.',
              response: pack
                ? pack.date2Beat2GoodResponse
                : `"Certified S-Rank manners," ${profile.name} grins.`,
              nextExpression: 'laugh',
              chemistryDelta: 24,
            },
            {
              label: pack
                ? pack.date2Beat2VipLabel
                : '💎 Add a custom weekend ritual: Sunday morning farmers-market coffee runs.',
              response: pack
                ? pack.date2Beat2VipResponse
                : `${profile.name}'s eyes shine: "Consider every Sunday morning officially spoken for."`,
              nextExpression: 'blush',
              chemistryDelta: 28,
              cost: 1,
            },
          ],
        },
      ],
      secretBestiePovLeak: {
        friendName: isHimMatch ? 'Miles (Club Group Chat)' : 'Claire (Her Group Chat)',
        messages: [
          `${profile.name}: Passed Date #2 without blinking an eye.`,
          `${profile.name}: Honestly haven't felt this safe and excited with someone in years.`,
        ],
        cost: 2,
      },
    },
    {
      dateNumber: 3,
      title: pack ? pack.date3Title : `Date #3: Midnight Sanctuary with ${profile.name}`,
      venueBackdrop: pack ? pack.date3Backdrop : './images/scenes/sunday-kitchen-sanctuary.jpg',
      beats: [
        {
          speakerExpression: 'blush',
          dialogue: pack
            ? pack.date3Beat1Dialogue
            : `${profile.name} sets down two glasses and asks the real Month-Three question about your future together.`,
          bestiePopIn: `${bestie}: Deep breath, honesty + emotional courage right here locks in True Romance!`,
          choices: [
            {
              label: pack
                ? pack.date3Beat1GoodLabel
                : 'Speak from the heart: align openly on your shared rhythm, public pride, and choosing each other.',
              response: pack
                ? pack.date3Beat1GoodResponse
                : `${profile.name} steps into your arms: "Then I’m all in with you."`,
              nextExpression: 'blush',
              chemistryDelta: 30,
            },
            {
              label: 'Keep things vague and noncommittal so nobody risks getting hurt.',
              response: `A bittersweet smile from ${profile.name}: "It’s been a lovely chapter, even if we stay right here."`,
              nextExpression: 'neutral',
              chemistryDelta: -5,
            },
          ],
        },
      ],
      secretBestiePovLeak: {
        friendName: bestie,
        messages: [
          `${profile.name}: Just deleted Hinge off my phone for good.`,
          `${bestie}: POPPING CHAMPAGNE ON THE CUL-DE-SAC RIGHT NOW 🥂👑`,
        ],
        cost: 2,
      },
    },
    {
      dateNumber: 4,
      title: `🌙 Weekend Escape Epilogue: Six Months Later with ${profile.name}`,
      venueBackdrop: './images/scenes/coastal-convertible.jpg',
      isEpilogueUnlock: true,
      epilogueCost: 3,
      beats: [
        {
          speakerExpression: 'laugh',
          dialogue: `Six months past the skeptics’ "two weekends" prediction: coastal wind tangles your hair on a Friday weekend escape as ${profile.name} hands you morning espresso on a private ocean deck.`,
          choices: [
            {
              label: 'Clink mugs overlooking the waves and plan your one-year trip abroad together.',
              response: `"Best chapter in Sunset Hills history," ${profile.name} whispers, kissing your shoulder in the morning sun.`,
              nextExpression: 'blush',
              chemistryDelta: 30,
            },
          ],
        },
      ],
      secretBestiePovLeak: {
        friendName: bestie,
        messages: [
          `${bestie}: Six months glowing and undefeated, frame this Polaroid immediately!`,
        ],
        cost: 2,
      },
    },
  ];
}

function buildTrapOrCameoDateScripts(profile: V35CastProfile): DateSceneScript[] {
  if (profile.tier === 'trap') {
    return [
      {
        dateNumber: 1,
        title: `Friday Disaster at Table 9 with ${profile.name}`,
        venueBackdrop: V35_SCENE_BACKDROPS['velvet-room'],
        beats: [
          {
            speakerExpression: 'icked',
            dialogue:
              profile.id === 'graham'
                ? `At 6:38 PM, Graham’s spouse walks straight into The Marlow Lounge holding his shared credit-card alert while Graham dives behind a potted palm!`
                : profile.id === 'connor'
                  ? `The Marlow Lounge doorman UV-scans Connor’s ID for ten seconds and hands it back: "Nice try, sophomore, come back when you turn twenty-one next April."`
                  : profile.id === 'devon'
                    ? `It is 8:15 PM at your table when Devon sends a 400-word voice note from Echo Park saying he "got overwhelmed by your aura and stayed home with his guitar."`
                    : profile.id === 'vanessa'
                      ? `Halfway through drinks, Vanessa’s very-much-still-married husband walks over to ask why his "lighting consultant" is holding her hand!`
                      : `Brooke spends forty minutes waving loudly at Table 9 until her ex Richard walks over, revealing you were booked strictly as a jealousy prop!`,
            choices: [
              {
                label: 'Walk into the ambush unprepared (-1 Friday Night Heart, next time hit 🚩 Cut Loose in chat!).',
                response:
                  'Friday night torpedoed! Lesson learned: when chat drops three red flags in a row, hit 🚩 Cut Loose before Friday!',
                nextExpression: 'icked',
                chemistryDelta: -30,
                triggersDisasterHeartLoss: true,
              },
              {
                label: '💎 Turn the Tables (1 Cr): Clink glasses with the ambushed ex/bartender, expose the Table 9 alibi, and walk out laughing!',
                response:
                  'Legendary exit! The entire mahogany bar applauds as you pocket a Table 9 Conspiracy Clue unscathed!',
                nextExpression: 'laugh',
                chemistryDelta: 15,
                cost: 1,
                triggersTurnTablesRevenge: true,
              },
            ],
          },
        ],
        secretBestiePovLeak: {
          friendName: 'Marlow Bartender',
          messages: [
            'Bartender: Never seen someone roast a Table 9 regular that cleanly, drinks on the house next Friday.',
          ],
          cost: 2,
        },
      },
    ];
  }

  // Cameo joyful 1-date whirlwind romance
  return [
    {
      dateNumber: 1,
      title: `Golden-Hour Whirlwind Date with ${profile.name}`,
      venueBackdrop:
        V35_SCENE_BACKDROPS[profile.primaryWildVenueId || 'cougarmarket'] ||
        V35_SCENE_BACKDROPS['velvet-room'],
      beats: [
        {
          speakerExpression: 'laugh',
          dialogue: `${profile.name} greets you in warm golden dusk, turning a spontaneous evening into effortless laughter and undeniable spark.`,
          choices: [
            {
              label: 'Lean all the way into the adventure and toast to unexpected chemistry.',
              response: `${profile.name}'s smile lights up the whole terrace: "Best spontaneous Friday all year."`,
              nextExpression: 'blush',
              chemistryDelta: 26,
            },
            {
              label: '💎 Extend the night with a moonlight walk and trade favorite records.',
              response: `An S-Rank cameo memory sealed into your Cougars & Cubs Dateodex!`,
              nextExpression: 'blush',
              chemistryDelta: 30,
              cost: 1,
            },
          ],
        },
      ],
      secretBestiePovLeak: {
        friendName: profile.role === 'him' ? 'Jade' : 'Sam',
        messages: [
          `${profile.name}: Still smiling from tonight, tell Sunset Hills they have competition.`,
        ],
        cost: 2,
      },
    },
  ];
}

export const V35_DATE_SCRIPTS: Record<string, DateSceneScript[]> = Object.fromEntries(
  V35_CAST_PROFILES.map((profile) => [
    profile.id,
    profile.tier === 'main_lead'
      ? buildMainLeadDateScripts(profile)
      : buildTrapOrCameoDateScripts(profile),
  ]),
);

export const V35_TABLE_9_CONSPIRACY = {
  id: 'table-9-alibi-club',
  title: '🕵️ Secret Finale: The Table 9 / 6:45 Alibi Club Takedown',
  requiredClueCount: 3,
  unlockCost: 3,
  backdropUrl: V35_SCENE_BACKDROPS['velvet-room'],
  beats: [
    {
      speakerExpression: 'smirk' as PortraitExpression,
      speakerName: 'Jade & Sam (Co-Conspirators)',
      dialogue:
        'Friday, 6:40 PM at The Marlow Lounge. Armed with all three clues. Graham’s 6:45 "Tokyo Call" shell tab, Vanessa’s "lighting consultant" cover story, and Brooke’s ex-husband Richard holding down Table 9, you, Jade, Claire, and Miles surround the corner banquette.',
      choices: [
        {
          label: 'Have the pianist announce a special dedication to "The 6:45 Tokyo Portfolio Alibi Club at Table 9"!',
          response:
            'Graham drops his olive pick, Richard chokes on his club soda, and Claire raises her Gibson in salute as all three alibis implode simultaneously!',
          nextExpression: 'laugh' as PortraitExpression,
        },
        {
          label: 'Slide the combined Table 9 bar tab straight onto Graham & Richard’s laps and commandeer the best booth in town for your real romance!',
          response:
            'Standing ovation from the mahogany bar. Table 9 is officially liberated forever, unlocking the Golden Detective Stamp!',
          nextExpression: 'blush' as PortraitExpression,
        },
      ],
    },
  ],
};
