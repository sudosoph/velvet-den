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
    topicSubtitle: 'Friday date plans, outfit gut-checks & live pre-drink chat',
    seededMessages: [
      {
        sender: 'Maya_43F',
        badge: '🐆 Cougar Regular',
        text: 'Honest poll before I get dressed: he booked a 7:30 wine bar on a rainy Friday. Silk blouse + jeans, or am I putting on heels after a 50-hour workweek?',
      },
      {
        sender: 'Liam_29M',
        badge: '🥂 Vetted Cub',
        text: 'Silk blouse + comfortable boots wins ten times out of ten. If a guy cares more about heels than you actually enjoying your glass of red, leave him at the bar.',
      },
      {
        sender: 'Jade_42F',
        badge: '🐆 Lounge Host',
        text: 'Co-signing Liam! Also shoutout to whoever reminded the 20-somethings in here that a noon Friday "Still excited for 7:30 tonight" text is hotter than any pickup line.',
      },
    ],
    suggestionsHer: [
      'Just moved to town, which neighborhood wine bar is quiet enough to actually hear your date?',
      'Meeting a 27-year-old British guy for Thursday drinks. Give me your quickest green-flag test.',
      'Anyone else refuse to get out of loungewear after 8:30 PM unless plans were locked by noon?',
    ],
    suggestionsHim: [
      'Booked a 7:30 patio table for Date #1 tonight. Flowers in the car for after dinner or wait for Date #2?',
      'Best local florist open past 6 PM when you want zero cheesy red roses?',
      'Taking notes in here so I don’t pull a rookie move on a second date.',
    ],
    repliesHer: [
      'Jade_42F: Try the back room at The Marlow Lounge or Left Bank’s courtyard, warm lighting, real glassware, and zero shouting over bass.',
      'Claire_M&A: Watch two things: whether he shows up five minutes early and how he treats the bartender. Everything else follows.',
      'Sienna_Design: Hard rule in this server! After 8:30 PM my skincare is on and my phone is on Do Not Disturb unless dinner was confirmed by midday.',
    ],
    repliesHim: [
      'Claire_M&A: Save flowers for Date #2 or keep a small paper-wrapped bunch in the trunk for the walk back to her car so she isn’t holding stems all night.',
      'Sienna_Design: Left Bank Botanica stays open until 7:30 PM, ask for ivory ranunculus or peonies and skip the baby’s breath.',
      'Jade_42F: Confirm at noon Friday, put your phone face-down when she sits, and actually listen. You’ll lap ninety percent of men out there.',
    ],
    botReplies: [
      'Jade_42F: Confirming by noon and putting your phone away at the table beats every rehearsed line in the book.',
      'Claire_M&A: Relax, listen well, and pick a spot quiet enough for real conversation.',
    ],
  },
  {
    id: 'red-flag-emergency',
    handleLabel: '#red-flag-emergency',
    topicSubtitle: 'Live gut-checks on shady schedules, age-filter liars & Friday flakes',
    seededMessages: [
      {
        sender: 'Tasha_41F',
        badge: '🐆 Cougar Regular',
        text: 'Need a sanity check: matched with a 34M finance guy who only wants 5:15 PM drinks and says his phone is muted after 6:45 PM for "Tokyo markets." Married, right?',
      },
      {
        sender: 'Priya_TraumaRN',
        badge: '🏥 Night Shift',
        text: '1000% married. Tokyo opens at 5 PM Pacific and is closed Saturday night! That 6:45 PM cutoff is him pulling into his driveway in Montecito.',
      },
      {
        sender: 'Sam_27M',
        badge: '🏡 Vetted Cub',
        text: 'Same energy on our side when someone says they’re "practically divorced" while still living in the same house for property taxes. Instant block.',
      },
    ],
    suggestionsHer: [
      'He says his evenings after 6:45 PM are blocked for Tokyo markets, am I crazy or is that a commuter train home?',
      'He confessed on Message 2 that the app "accidentally" listed him as 27 instead of 21. Blocking right now.',
      'Wrote me three paragraphs of poetry on Tuesday and just went radio silent Friday afternoon.',
    ],
    suggestionsHim: [
      'She says she is "practically divorced" while still sharing the Bel Air house, run for the hills?',
      'She insisted I wear a navy blazer and sit right across from Table 9 where her ex eats every Friday.',
      'How do I tell normal post-divorce caution apart from someone using me to make an ex jealous?',
    ],
    repliesHer: [
      'Jade_42F: Trust your gut! Tokyo closes Friday afternoon, a nightly + Sunday 6:45 blackout is 100% a suburban marriage schedule. Hit Cut Loose!',
      'Priya_TraumaRN: Instant block! Nobody "accidentally" ages six years linking an account, he deliberately bypassed your age filter.',
      'Claire_M&A: Classic Tuesday poet, Friday 4 PM flake. Big speeches before Date #1 are almost always fantasy projection.',
    ],
    repliesHim: [
      'Sam_27M: Sprint, brother! "Practically divorced in the same house" means her husband is making coffee in that kitchen right now.',
      'Jade_42F: Oh no, that’s the Table 9 revenge setup! Wait, the 6:45 commuter guy and Table 9 are connected. Check #blind-spark-dm!',
      'Prof_Elena: Healthy caution protects privacy and moves steadily; someone using you as a prop only cares who sees you two in public.',
    ],
    botReplies: [
      'Priya_TraumaRN: Clock it and hit Cut Loose! Protecting your Friday night beats playing detective for free.',
      'Jade_42F: Wait, the 6:45 curfew guy and the Table 9 drama are connected. Check #blind-spark-dm!',
    ],
    conspiracyClueId: 'clue-discord-triage',
  },
  {
    id: 'ask-a-cougar',
    handleLabel: '#ask-a-cougar',
    topicSubtitle: 'Honest Q&A between Cougars and Cubs on etiquette, money & pacing',
    seededMessages: [
      {
        sender: 'Jordan_26M',
        badge: '🥂 Honest Cub Q',
        text: 'Genuine question for the women in here: if she’s a director making way more than me, does planning a casual taco-and-jazz night look cheap, or is it all about owning the plan?',
      },
      {
        sender: 'Prof_Elena',
        badge: '🎓 Literature Chair',
        text: 'Own the plan inside your real budget every single time. A thoughtful $40 evening you planned yourself beats nervously splitting a $300 steakhouse tab.',
      },
      {
        sender: 'Claire_M&A',
        badge: '🍸 Deal Partner',
        text: '100% this. We already fund our own lives; we date younger for warmth, curiosity, and zero boardroom ego at dinner.',
      },
    ],
    suggestionsHer: [
      'Ladies, when a sweet 26-year-old gets nervous about earning less than me, what puts him at ease without mothering him?',
      'Do we give a second chance to a guy who talked a little too fast from first-date nerves?',
      'Best boundary line when you love Living-Apart-Together and never want to merge houses again?',
    ],
    suggestionsHim: [
      'When she makes triple my grad stipend, what is the classiest way to handle alternating date nights?',
      'How early should I give my mom a heads-up before introducing a partner closer to her age?',
      'Does sending a quick confirmation text around noon on Friday still count as a big green flag?',
    ],
    repliesHer: [
      'Prof_Elena: Let him plan and host squarely inside his budget when he invites, then treat him when you pick a weekend getaway. Equal turns, zero mothering.',
      'Priya_TraumaRN: Ten minutes of first-date nerves is honestly sweet if he settles in and listens. Smooth players rehearse; good guys actually care.',
      'Claire_M&A: Toast to it early: "I want real commitment and great weekends together, and I am keeping my own house keys forever." Secure men love Living-Apart-Together clarity.',
    ],
    repliesHim: [
      'Prof_Elena: Plan thoughtful dates squarely inside your budget and cover the tab cleanly when you invite. Sincerity always beats pretending.',
      'Sienna_Design: Tell your mom warmly a week ahead so nobody is caught off guard at Sunday dinner, never spring a surprise.',
      'Claire_M&A: A calm noon Friday confirmation ("Still looking forward to 7:30 tonight, see you there") puts you in the top two percent.',
    ],
    botReplies: [
      'Prof_Elena: Plan thoughtful dates inside your real budget and cover the check cleanly when you invite.',
      'Claire_M&A: A simple noon confirmation text on Friday puts you ahead of almost everyone on the apps.',
    ],
  },
  {
    id: 'spotted-in-the-wild',
    handleLabel: '#spotted-in-the-wild',
    topicSubtitle: 'Real-world meet-cutes, grocery-aisle fumbles & off-app wins',
    seededMessages: [
      {
        sender: ' Devon_44F_Runner',
        badge: '🐆 Morning Crew',
        text: 'Shoutout to the polite 28-year-old at Dawn Lap Pool who waited until I took my swim cap and goggles off at the smoothie counter before asking me out.',
      },
      {
        sender: 'Rory_Ranger',
        badge: '🌳 Park Service',
        text: 'Better than me yesterday! Asked a woman in the olive-oil aisle how to pick ripe figs while holding an empty basket and turned bright red.',
      },
      {
        sender: 'Sienna_Design',
        badge: '🏡 Pasadena',
        text: 'Haha pro tip for every Cub in here: put at least two real groceries in your basket first so you don’t look like you’re doing laps around aisle four!',
      },
    ],
    suggestionsHer: [
      'To the tall architect on Court 3 with the lefty slice, rematch Thursday evening?',
      'Meeting someone curbside at Terminal B with hot coffee in hand still beats six weeks of app texting.',
      'Best body-language cue to give a younger guy at a bookstore so he knows it’s okay to say hi?',
    ],
    suggestionsHim: [
      'Waiting until Friday 5 PM when university grades lock before asking a literature professor to coffee.',
      'Three weeks of friendly nods at the lap pool before talking at the smoothie counter actually worked!',
      'Note to self: put actual food in the basket before striking up conversation in the wine aisle.',
    ],
    repliesHer: [
      'Jade_42F: That sounds like Søren at Palisades Racquet! Check Out In The Wild, he never turns down mixed doubles.',
      'Claire_M&A: Airport pickups with your coffee order memorized are undefeated. Check Terminal B on the map!',
      'Sienna_Design: Close your book for a second, catch his eye with a real smile, and ask what he’s reading. Good guys just want to know they aren’t bothering you.',
    ],
    repliesHim: [
      'Prof_Elena: Smart man. Waiting until grades officially post at 5:00 PM Friday shows actual integrity.',
      'Priya_TraumaRN: Never interrupting mid-workout and chatting calmly afterward is textbook gym etiquette.',
      'Sienna_Design: Olive oil, sourdough, and lemons in the basket first, works like a charm!',
    ],
    botReplies: [
      'Sam_27M: Half the best couples in here met at the grocery store, airport pickup lane, or tennis courts.',
      'Jade_42F: Tap In The Wild up top if you want to try offline meet-cutes instead of swiping!',
    ],
  },
  {
    id: 'blind-velvet-dm',
    handleLabel: '#blind-spark-dm',
    topicSubtitle: 'Anonymous neighborhood gossip & the Table 9 married-alibi investigation',
    seededMessages: [
      {
        sender: 'Bartender_Anon',
        badge: '🍸 Service Industry Tea',
        text: 'Service-industry PSA: three married guys in navy blazers split one cash tab every Friday at Table 9 under the fake calendar invite "6:45 Tokyo Call."',
      },
      {
        sender: 'Anon_Marlow_9',
        badge: '🕵️ Regular',
        text: 'Wait, it gets messier: Graham, Vanessa’s husband Lawrence, AND Brooke’s ex Richard are all covering each other’s alibis at that exact booth!',
      },
      {
        sender: 'Jade_42F',
        badge: '🐆 Lounge Host',
        text: 'If you collect 3 Table 9 clues across red-flag chats and lounge channels, we can crash their Friday dinner together.',
      },
    ],
    suggestionsHer: [
      'Wait, Graham’s 6:45 "Tokyo call" excuse is actually a shared cash tab at Table 9?! Spill everything.',
      'How are three different husbands running the exact same Friday alibi at one restaurant?',
      'Count me in for crashing Table 9 once I’ve collected all three receipts.',
    ],
    suggestionsHim: [
      'So Brooke only wanted me across from Table 9 to rattle Richard, and Vanessa’s husband is in on it too?!',
      'Paying cash so nothing hits their joint credit-card statements is diabolical.',
      'Logging this Table 9 clue right now, nobody uses us as Friday night props.',
    ],
    repliesHer: [
      'Bartender_Anon: Every word is true, one shared cash envelope at Table 9 so zero spouses see The Marlow Lounge on a statement. Clue logged!',
      'Anon_Marlow_9: They rotate who "hosts clients" each week while the other two slip out until 6:40 PM. Clue added to your file!',
      'Anon_Marlow_9: Dossier updated! Catch two more clues from #red-flag-emergency or blocking Trap profiles to unlock the Table 9 Takedown.',
    ],
    repliesHim: [
      'Anon_Marlow_9: Bingo, Richard, Lawrence, and Graham run a three-way alibi ring out of Table 9 every Friday at 6:15 PM. Clue logged!',
      'Bartender_Anon: Tipped terribly too, which is why the whole bar staff is rooting for you to expose them. Clue logged!',
      'Anon_Marlow_9: Receipt saved! Hit 3/3 clues to unlock the secret Friday Takedown finale.',
    ],
    botReplies: [
      'Bartender_Anon: Clock three Table 9 clues across your chats and channels to unlock the secret Friday Takedown.',
      'Anon_Marlow_9: Clue logged! Block suspicious curfew traps in your DMs to complete all 3/3 clues.',
    ],
    conspiracyClueId: 'clue-discord-table9',
  },
  {
    id: 'enm-and-plot-twists',
    handleLabel: '#enm-and-plot-twists',
    topicSubtitle: 'Solo-poly calendars, stag/vixen etiquette vs. fake DADT & Slide-5 surprises',
    seededMessages: [
      {
        sender: 'Astrid_Stockholm',
        badge: '🍍 Solo-Poly Founder',
        text: 'Friendly PSA from the Solo-Poly corner: ethical non-monogamy goes in Prompt #1 with a shared calendar, NEVER as a surprise "my husband Brad is parking the car" ambush on Date #1!',
      },
      {
        sender: 'Miles_31M',
        badge: '🥂 Vetted Regular',
        text: 'Preach. Huge difference between an honest open dynamic with clear boundaries vs. someone whispering in a parking garage claiming "Don’t Ask Don’t Tell" on Telegram.',
      },
      {
        sender: 'Jade_42F',
        badge: '🐆 Lounge Host',
        text: 'Also laughing forever at yesterday’s confession where a 46F held her date’s iPhone at full medieval town-crier arm’s length to read his tiny font and he smoothly narrated the menu like a sommelier.',
      },
    ],
    suggestionsHer: [
      'How do Solo-Poly women in here filter out guys who say they are cool with it and then get possessive by Week 3?',
      'Matched with a guy claiming an "open DADT marriage" who refuses to meet within ten miles of his zip code.',
      'Anyone else love Living-Apart-Together or Solo-Poly purely because diagonal king-bed sleep is sacred?',
    ],
    suggestionsHim: [
      'Matched with four solo photos and then Slide 5 said "Looking for a third for Brad & me 🍍", instant left swipe?',
      'If an accomplished Solo-Poly woman shares her Google Calendar upfront, what is the best green-flag etiquette?',
      'How do you verify a Stag/Vixen or open-marriage setup is actually 100% consensual and drama-free?',
    ],
    repliesHer: [
      'Astrid_Stockholm: Watch how he handles your existing Thursday plans in Month One; secure men enjoy their own hobbies instead of auditing your calendar.',
      'Priya_TraumaRN: "Open marriage + secret zip code + vanishing app" is a cheating husband in a trench coat. Block immediately!',
      'Claire_M&A: Starfish diagonal sleep in a 63-degree bedroom with zero snoring negotiations is peak civilization.',
    ],
    repliesHim: [
      'Jade_42F: Unless you explicitly signed up for couples, hiding Brad until Slide 5 (or worse, at the bar!) is a textbook unicorn-hunter foul.',
      'Astrid_Stockholm: Respect her scheduled nights without pouting, show up reliably on your shared Fridays, and communicate directly.',
      'Miles_31M: Real ethical couples are transparent, unhurried, and can verify consent openly without weird midnight secrecy.',
    ],
    botReplies: [
      'Astrid_Stockholm: Real ENM is calm, upfront in Bio Line #1, and never requires hiding behind patio ferns.',
      'Jade_42F: Run any questionable ENM or DADT excuse through the Wingwoman Roast Lab up top!',
    ],
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
              text: 'People who treat dating apps like a calendar invite before proving they’re actually fun to talk to.',
              reply: 'Haha noted, zero rushing from me, half the fun is seeing if our banter actually sparks xx',
              delta: 16,
            },
            {
              text: '💎 Guys who get intimidated by a woman who genuinely loves her own life.',
              reply: 'Bloody hell, that’s my favorite thing on earth, ambition looks brilliant on you xx',
              delta: 24,
              cost: 1,
              badge: 'Bold Spark',
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
            previewCaption: 'Photo from Julian',
            imageUrl: photos[5],
            unlockCost: 1,
            exifClue: '📍 Live Photo · Taken 4 min ago near Westwood · Unfiltered late-afternoon walk.',
            secretNote: 'Just escaped the library stacks before sunset, finally getting some fresh air x',
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
      imessage: buildImessageFollowup(profile, photos[4]),
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
      'Rarely check notifications on here, glad I looked tonight. You seem delightfully allergic to small talk.',
    miles:
      'Good to match with you. Tell me your week is winding down somewhere quieter than rush-hour traffic.',
    rafael:
      'You have dangerously good timing, I was about ten seconds from closing this app for the night. How’s your week treating you?',
    marcus:
      'Well, that beat ninety-nine percent of my inbox right out of the gate. Hope your week hasn’t been too chaotic.',
    elena:
      'A complete sentence with actual wit attached. Careful, you are going to spoil my low expectations of this app.',
    claire:
      'Long day, short fuse for bad openers, and yours actually made me laugh. Good start.',
    sienna:
      'Love that you skipped the polite small-talk script. What’s been the best part of your week so far?',
    priya:
      'Finally, someone on this app with actual comedic timing. Tell me you’re just as quick in person.',
    summer:
      'Okay, points right away for writing a real sentence instead of "hey trouble." How’s your week looking?',
    celeste:
      'Well, someone actually knows how to start a conversation properly. Pleasure to meet you.',
    astrid:
      'No small talk, clean delivery. You are already ahead of most of Los Angeles.',
    camila:
      'Pouring a late glass of red and your note genuinely made me smile. How is your night going?',
    vivienne:
      'Charming and concise. You already outclassed every man who opened with "how was your weekend" today.',
    rory:
      'Alright, full confession, I grinned at my phone in public reading that x How is your week going so far?',
    jin:
      'okay wait, an actual human prompt reply instead of a waving emoji. highlight of my afternoon honestly.',
    liam:
      'Glad we matched. Always refreshing when someone on here actually sounds like themselves.',
  };

  const bespokeBeat2IncomingById: Record<string, string> = {
    soren:
      'Quick personality check before anything else: are you secretly ruthless at games, or do you pretend to play "just for fun"?',
    miles:
      'Be honest with me: what is the fastest way a first date accidentally bores you to tears?',
    rafael:
      'Quick question while we’re talking: are you a stay-out-late person on Fridays, or a slow-dinner-and-good-music person?',
    marcus:
      'Tell me one unpopular food or movie opinion you refuse to back down on. I want to hear your honest side.',
    elena:
      'Fair litmus test: if my day runs busy until six and I reply "Sounds good." with a period, do you spiral or hold steady?',
    claire:
      'Be honest: what is the boldest spontaneous decision you’ve made this year outside of work?',
    sienna:
      'Quick vibe check: dim candlelit wine bar where we can actually hear each other, or chaotic trendy hotspot?',
    priya:
      'Honest question: after a marathon workweek, do you want someone to vent with or someone to distract you completely?',
    summer:
      'Playful question first: what’s one harmless guilty pleasure your friends tease you about?',
    celeste:
      'Tell me one thing right away: do you actually arrive on time for dinner, or blame Westside traffic?',
    astrid:
      'Honest question: can you sit through ten quiet minutes watching the ocean without reaching for your phone?',
    camila:
      'Crucial dinner check: are you adventurous with ordering for the table, or strictly a safe-menu person?',
    vivienne:
      'One ground rule before we flirt properly: utter the words "for your age" and you walk home from dinner. Deal?',
    rory:
      'Be honest with me: does a London accent earn me five minutes of grace if I talk slightly too fast at first? x',
    jin:
      'quick check before the weekend: quiet neighborhood bar with phones put away, or loud crowded lounge?',
    liam:
      'Fair question before Friday: dressed-up corner table in town, or low-key drinks somewhere with a view?',
  };

  interface PersonaChatCustomization {
    beat1ChoiceA: string;
    beat1ReplyA: string;
    beat1ChoiceB: string;
    beat1ReplyB: string;
    beat1Vip: string;
    beat1VipReply: string;
    beat2ChoiceA: string;
    beat2ReplyA: string;
    beat2ChoiceB: string;
    beat2ReplyB: string;
    beat2Vip: string;
    beat2VipReply: string;
    beat3Incoming: string;
    beat3ChoiceA: string;
    beat3ReplyA: string;
    beat3ChoiceB: string;
    beat3ReplyB: string;
    beat3Vip: string;
    beat3VipReply: string;
    beat4Incoming: string;
    beat4PhotoNote: string;
    beat4ChoiceA: string;
    beat4ReplyA: string;
    beat4ChoiceB: string;
    beat4ReplyB: string;
    beat4Vip: string;
    beat4VipReply: string;
    beat5Incoming: string;
    beat5ChoiceA: string;
    beat5ReplyA: string;
    beat5ChoiceB: string;
    beat5ReplyB: string;
    beat5Vip: string;
    beat5VipReply: string;
    imsg1Incoming: string;
    imsg1ReplyA: string;
    imsg1ReplyB: string;
    imsg2Incoming: string;
    imsg2ChoiceA: string;
    imsg2ReplyA: string;
    imsg3Incoming: string;
    imsg3ReplyA: string;
    imsg4Incoming: string;
    imsg4PhotoNote: string;
    imsg5Incoming: string;
    imsg6Incoming: string;
    spicy: [string, string, string];
  }

  const GENUINE_PERSONA_PACKS: Record<string, PersonaChatCustomization> = {
    soren: {
      beat1ChoiceA: 'Wait, do Danes actually skip small talk completely, or is that just your excuse?',
      beat1ReplyA: 'Both. In Copenhagen if you ask "how are you," people actually tell you the truth for ten minutes.',
      beat1ChoiceB: 'Slide 3 caught my eye, how long have you been living on the Westside?',
      beat1ReplyB: 'Two years now, still baffled that Angelenos wear puffer jackets when it hits 63 degrees.',
      beat1Vip: '💎 Skip the polite intro, Søren: what’s one thing American dating gets hilarious wrong?',
      beat1VipReply: 'Waiting three days to text back like teenagers. If I want to see you Friday, you will know by Tuesday.',
      beat2ChoiceA: 'Ruthlessly competitive at backgammon, though I smile politely while winning.',
      beat2ReplyA: 'Dangerous combination. Consider a rematch board packed for Date #2.',
      beat2ChoiceB: 'Playful until someone gloats, then all bets are off.',
      beat2ReplyB: 'Fair warning received, zero gloating from my side of the table.',
      beat2Vip: '💎 Ruthless when it counts, though I let handsome Danes think they have a chance in round one.',
      beat2VipReply: 'Bold talk before the first glass is even poured. I like my odds.',
      beat3Incoming: 'Full disclosure: my friends back home joke I’m allergic to twenty-something LA club nights. Give me one quiet candlelit table over a velvet rope any night.',
      beat3ChoiceA: 'Thank heaven, my days of shouting over a DJ at midnight are happily retired.',
      beat3ReplyA: 'Good. Real conversation and being home before midnight beats sticky floors every time.',
      beat3ChoiceB: 'Wait, so no surprise invites to a 1 AM warehouse techno set?',
      beat3ReplyB: 'Only if we both want migraines. Quiet wine bar wins.',
      beat3Vip: '💎 Save your stamina for good conversation and after-hours company, never nightclub lines.',
      beat3VipReply: 'Now that is a philosophy I can get behind completely.',
      beat4Incoming: 'Quick espresso break on the studio steps before wrapping up for the day.',
      beat4PhotoNote: 'Proof I own clean linen without any workshop dust on it.',
      beat4ChoiceA: 'Clean linen and afternoon sun, Copenhagen did good work here.',
      beat4ReplyA: 'High praise, wait until Friday evening.',
      beat4ChoiceB: 'Looking very composed for 4 PM on a weekday.',
      beat4ReplyB: 'Double espresso is doing half the heavy lifting.',
      beat4Vip: '💎 Unfair mid-afternoon distraction, Søren. Keep that shirt in rotation for Friday.',
      beat4VipReply: 'Already pressed and hanging on the door for you.',
      beat5Incoming: 'Booked us an 8 PM patio table for Friday, and yes, I keep a spare cashmere throw in the trunk because LA restaurants freeze every patio.',
      beat5ChoiceA: 'Trunk blanket prep? Okay, you clearly paid attention in adulting class.',
      beat5ReplyA: 'Learned quickly that shivering ruins even the best Pinot Noir.',
      beat5ChoiceB: 'Love a man who plans ahead without turning it into a questionnaire.',
      beat5ReplyB: 'Easy call. You make enough decisions all week.',
      beat5Vip: '💎 Smart prep, good manners, and zero "idk what u want" texts. You’re setting a high bar.',
      beat5VipReply: 'Intend to clear it comfortably on Friday night.',
      imsg1Incoming: 'Off the app at last. Saved your contact properly, zero notifications muted.',
      imsg1ReplyA: 'Calm and punctual, I don’t blow up phones during work hours.',
      imsg1ReplyB: 'Pouring sparkling water and sketching a chair joint, peaceful night here.',
      imsg2Incoming: 'Quick check for Friday: want to meet inside by the fireplace at 7:55, or would you rather I scoop you up?',
      imsg2ChoiceA: 'Meet me by the fireplace five minutes early, classic Date #1 rule.',
      imsg2ReplyA: 'Agreed. I will be by the hearth with two glasses ready.',
      imsg3Incoming: 'Drove past the coast on Sunset earlier and the marine layer cleared right at dusk. Friday weather looks crisp.',
      imsg3ReplyA: 'Good excuse to test that spare cashmere blanket after dinner.',
      imsg4Incoming: 'Debating between navy wool or dark olive overshirt for tomorrow night.',
      imsg4PhotoNote: 'Honest tie-breaker vote before tomorrow?',
      imsg5Incoming: 'Hey! Just confirming our 7:45 table is all set for tonight. Looking forward to seeing you.',
      imsg6Incoming: 'Just got here and claimed the quiet table near the fireplace. Take your time parking.',
      spicy: [
        'Wear the dark olive shirt Friday, brings out those Nordic eyes.',
        'Keep planning this smoothly and one drink might turn into two.',
        'Tell me the boldest compliment you kept to yourself when we matched.',
      ],
    },
    miles: {
      beat1ChoiceA: 'Quieter than the 405 is a low bar, Miles, though pouring a Sancerre definitely helps.',
      beat1ReplyA: 'Sancerre beats evening traffic by about forty miles. Glad you answered.',
      beat1ChoiceB: 'Wait, do litigators ever actually clock out, or are you cross-examining your dates too?',
      beat1ReplyB: 'Cross-examination stays strictly in downtown courthouses, off the clock I’m all ears.',
      beat1Vip: '💎 You carry 38-year-old poise for 31, Miles. Did law school age you fast or were you born in a suit?',
      beat1VipReply: 'Haha oldest brother of four, had to learn how to stay calm while chaos flew around the kitchen.',
      beat2ChoiceA: 'Men who recite their LinkedIn resume for forty minutes without asking a single question.',
      beat2ReplyA: 'Painful. If dinner feels like a quarterly earnings call, I’m signaling for the check.',
      beat2ChoiceB: 'Anyone who pulls out their phone every time a notification buzzes on the table.',
      beat2ReplyB: 'Instant dealbreaker for me too. Airplane mode exists for a reason.',
      beat2Vip: '💎 Indecisive planners who ask "so where should we go?" ten minutes before seven.',
      beat2VipReply: 'Rest easy, Friday’s reservation was locked in before I even sent question two.',
      beat3Incoming: 'Funny moment today: opposing counsel assumed I was the junior associate carrying briefcases until oral arguments started. Happens in dating too until we sit down.',
      beat3ChoiceA: 'Letting people underestimate you for five minutes is secretly a superpower.',
      beat3ReplyA: 'Exactly my strategy, watching their expression shift never gets old.',
      beat3ChoiceB: 'At least nobody asks you to explain TikTok slang in court.',
      beat3ReplyB: 'Thank God, I barely survived Instagram Reels.',
      beat3Vip: '💎 Substance shows in two minutes flat across a dinner table, birth year never enters it.',
      beat3VipReply: 'Couldn’t have put it better myself.',
      beat4Incoming: 'Out of a four-hour deposition with my sanity intact and ten minutes of sunshine left.',
      beat4PhotoNote: 'Tie officially loosened until Monday morning.',
      beat4ChoiceA: 'Post-courtroom relief suits you remarkably well.',
      beat4ReplyA: 'Winning the motion helped, matching with you helped more.',
      beat4ChoiceB: 'Okay, the loosened-tie look is doing strong persuasive work.',
      beat4ReplyB: 'Motion granted, counsel.',
      beat4Vip: '💎 Dangerous jawline for 4:30 PM on a weekday, Counselor.',
      beat4VipReply: 'Wait until there’s candlelight across the table on Friday.',
      beat5Incoming: 'Valet is pre-arranged at the lounge for Friday at 7:45 so you aren’t walking two blocks in heels. Any dietary notes I should flag?',
      beat5ChoiceA: 'Pre-arranged valet? Okay, gold star before appetizers even arrive.',
      beat5ReplyA: 'Downtown cobblestones vs. heels is a losing case every time.',
      beat5ChoiceB: 'Zero allergies, just keep the martinis cold and dry.',
      beat5ReplyB: 'Chilled gin and dry vermouth noted.',
      beat5Vip: '💎 Turn-my-brain-off Friday logistics executed to perfection. Impressively smooth, Miles.',
      beat5VipReply: 'You run enough all week. Friday night is off-duty.',
      imsg1Incoming: 'Good to have your direct line. Friday at 7:45 is confirmed on my calendar.',
      imsg1ReplyA: 'Don’t worry, my daytime pings stay brief and civil.',
      imsg1ReplyB: 'Two fingers of rye and reading a novel with zero footnotes for once.',
      imsg2Incoming: 'Quick check before Friday: prefer meeting right inside at the lounge bar, or shall I send a car?',
      imsg2ChoiceA: 'I’ll meet you inside by the bar five minutes early for Date #1.',
      imsg2ReplyA: 'Smart rule. I’ll be standing near the host stand at 7:40.',
      imsg3Incoming: 'My paralegal just asked why I looked unusually cheerful reviewing a contract. Blaming you.',
      imsg3ReplyA: 'Plead the Fifth until after tomorrow’s dinner.',
      imsg4Incoming: 'Charcoal blazer vs. midnight navy jacket for tomorrow night.',
      imsg4PhotoNote: 'Counsel requests your ruling before 8 PM tomorrow.',
      imsg5Incoming: 'Hey! Just confirming we’re all set for 7:45 tonight. Can’t wait to see you.',
      imsg6Incoming: 'Just got here and grabbed our table away from the bar crowd. Let the valet leave your car up front.',
      spicy: [
        'Skip the tie Friday, top button open suits you way better.',
        'Keep handling logistics like this and Date #2 is already yours.',
        'Tell me what made you stop on my profile first.',
      ],
    },
    rafael: {
      beat1ChoiceA: 'Glad I caught you before you closed the app, long night in the kitchen?',
      beat1ReplyA: 'Wrapped menu tasting twenty minutes ago, legs tired, spirits way up now.',
      beat1ChoiceB: 'Wait, do chefs judge everyone’s restaurant picks on first dates?',
      beat1ReplyB: 'Haha never! After cooking all week, honestly someone handing me a warm taco feels romantic.',
      beat1Vip: '💎 Dangerous timing is my specialty, Rafael. What were you cooking tonight?',
      beat1VipReply: 'Brown-butter sage agnolotti, and yes, saving that recipe in my back pocket for you.',
      beat2ChoiceA: 'Slow candlelit dinner and real conversation every single time.',
      beat2ReplyA: 'Same here. After loud kitchen tickets all week, peace and a great bottle win.',
      beat2ChoiceB: 'Depends on the company, good chemistry makes a Tuesday feel electric.',
      beat2ReplyB: 'True, the right person across the table changes the whole room.',
      beat2Vip: '💎 Unhurried dinner first, and if sparks fly, lingering over one late nightcap.',
      beat2VipReply: 'Now you’re speaking my exact language.',
      beat3Incoming: 'Chef pet peeve confession: guys my age bragging they "cook" when they just boiled penne and poured cold jar sauce on top. My grandmother would disown me.',
      beat3ChoiceA: 'Haha finally someone said it! Jar sauce presented like Michelin cuisine is comedy gold.',
      beat3ReplyA: 'Garlic, olive oil, and twelve minutes is all it takes, zero excuse!',
      beat3ChoiceB: 'Careful, now my expectations for eventual Sunday pasta are sky-high.',
      beat3ReplyB: 'Challenge happily accepted whenever I earn kitchen privileges.',
      beat3Vip: '💎 Any man who respects real butter, salt, and sharp knives jumps straight to the front of the line.',
      beat3VipReply: 'Best culinary endorsement I’ve heard all year.',
      beat4Incoming: 'Five minutes of fresh air behind the market after grabbing black mission figs.',
      beat4PhotoNote: 'Pre-prep espresso before the evening rush kicks off.',
      beat4ChoiceA: 'Rolled sleeves and farmers-market figs, very strong argument.',
      beat4ReplyA: 'Wait until you taste the fig and prosciutto flatbread.',
      beat4ChoiceB: 'Hope tonight’s dinner rush flies by smoothly.',
      beat4ReplyB: 'Easy breeze tonight with Friday to look forward to.',
      beat4Vip: '💎 Unfairly handsome between prep shifts, Rafael.',
      beat4VipReply: 'Making me grin in the middle of the produce aisle.',
      beat5Incoming: 'Booked us a cozy corner at a friend’s wine bistro Friday at 7:45. Real printed menus, zero QR codes, and the sommelier owes me a favor.',
      beat5ChoiceA: 'Zero QR codes?! You know the fastest route to a woman’s heart.',
      beat5ReplyA: 'Squinting at a PDF menu over candlelight should be illegal.',
      beat5ChoiceB: 'Chef connections at a wine bistro sound dangerously hard to beat.',
      beat5ReplyB: 'Wait until the warm olive oil bread hits the table.',
      beat5Vip: '💎 Thoughtful, decisive, and zero homework handed to me. Friday is officially a lock.',
      beat5VipReply: 'Count on it, I’ll take great care of the evening.',
      imsg1Incoming: 'Got your number saved! Way easier texting you here than on Prowl.',
      imsg1ReplyA: 'Kitchen hours respected, text me once the knives are down.',
      imsg1ReplyB: 'Just wrapped clean-down, sipping chamomile tea like an eighty-year-old.',
      imsg2Incoming: 'Quick question for Friday: want to meet right inside by the wine bar at 7:40, or want me to swing by?',
      imsg2ChoiceA: 'Meet me right inside by the wine bar five minutes early.',
      imsg2ReplyA: 'Done. I’ll have two glasses breathing before you step in.',
      imsg3Incoming: 'Tested a new espresso-martini reduction at tasting today and immediately thought you’d have opinions on it.',
      imsg3ReplyA: 'Save the verdict for tomorrow night’s toast.',
      imsg4Incoming: 'Out of chef whites and trying on real civilian clothes for tomorrow.',
      imsg4PhotoNote: 'Crisp black collar or open linen shirt for Friday?',
      imsg5Incoming: 'Hey! Just confirming we’re all set for 7:45 tonight. Can’t wait to see you.',
      imsg6Incoming: 'Just got here and grabbed our quiet corner away from the kitchen swing door. No rush walking in.',
      spicy: [
        'Definitely the rolled sleeves Friday, chef.',
        'If Date #1 goes half as well as your banter, start planning that fig pasta.',
        'Tell me one dish you only cook when you really like someone.',
      ],
    },
    marcus: {
      beat1ChoiceA: 'Glad to rescue your inbox, Marcus, how wild were the other openers?',
      beat1ReplyA: 'Three bicep emojis and someone asking my bench max. Yours won by a mile.',
      beat1ChoiceB: 'Do sports PTs secretly diagnose everyone’s posture walking into a bar?',
      beat1ReplyB: 'Haha occupational hazard, though I promise zero posture notes on Friday.',
      beat1Vip: '💎 You look way too grounded for 26, Marcus. Who raised you with actual manners?',
      beat1VipReply: 'My mom and two older sisters! Try acting cocky at that dinner table and you get humbled in four seconds.',
      beat2ChoiceA: 'Cold pizza the morning after beats fancy brunch lines every single time.',
      beat2ReplyA: '100% facts. Standing forty-five minutes on concrete for eggs makes zero sense.',
      beat2ChoiceB: '90s R&B clears every modern playlist without breaking a sweat.',
      beat2ReplyB: 'Instant green flag, that’s literally half my clinic playlist.',
      beat2Vip: '💎 Movie theaters need intermissions again, and dinner at 7:30 beats 9:30 every time.',
      beat2VipReply: 'Preach. Eating steak at 10 PM ruins Saturday recovery.',
      beat3Incoming: 'Funny contrast: my buddies just invited me to a midnight rooftop rager Friday, and all I could think was how much rather I’d sit across from you with good pasta and be horizontal by eleven.',
      beat3ChoiceA: 'A 26-year-old who respects an 11 PM wind-down? Unicorn behavior.',
      beat3ReplyA: '6 AM training blocks cured me of 2 AM clubs permanently.',
      beat3ChoiceB: 'Your buddies don’t know what they’re missing.',
      beat3ReplyB: 'Trust me, I know I got the better Friday plan.',
      beat3Vip: '💎 Smart man. Quiet chemistry behind closed doors beats shouting over a DJ every night of the week.',
      beat3VipReply: 'Okay yeah, Friday cannot get here fast enough.',
      beat4Incoming: 'Stepped down to the Santa Monica bluff for ten minutes after my last athlete cleared rehab.',
      beat4PhotoNote: 'Finally out of clinic scrubs and into ocean air.',
      beat4ChoiceA: 'Ocean breeze suits you way better than fluorescent clinic lighting.',
      beat4ReplyA: 'Couldn’t agree more, needed some real sky.',
      beat4ChoiceB: 'Looking very relaxed for the end of a busy clinic day.',
      beat4ReplyB: 'Good company in my notifications helps.',
      beat4Vip: '💎 Okay, the post-work ocean glow is unfair competition, Marcus.',
      beat4VipReply: 'Saving my A-game for Friday evening.',
      beat5Incoming: 'Locked in a 7:30 patio table near the beach for Friday, and I promise zero talk about protein macros or marathon splits.',
      beat5ChoiceA: 'Zero macro math over bread and butter? Deal of the century.',
      beat5ReplyA: 'Sourdough basket is sacred territory, I never interfere.',
      beat5ChoiceB: '7:30 near the water sounds effortless.',
      beat5ReplyB: 'Easy parking right next door too, checked earlier.',
      beat5Vip: '💎 Early reservation, ocean air, and zero gym-bro monologues. Gold star, Marcus.',
      beat5VipReply: 'Mom and sisters would be proud!',
      imsg1Incoming: 'Got your number saved! Way easier texting you here than on Prowl.',
      imsg1ReplyA: 'Deal, I keep workdays focused and evenings relaxed.',
      imsg1ReplyB: 'Foam-rolling my shoulders and watching classic basketball highlights.',
      imsg2Incoming: 'Quick check before Friday: want to meet right out front at 7:25, or want me to pick you up?',
      imsg2ChoiceA: 'Meet me inside by the host stand five minutes early.',
      imsg2ReplyA: 'Locked in, I’ll be there ten early just to be safe.',
      imsg3Incoming: 'My older sister asked why I ironed two shirts on a Thursday night. Told her mind her business.',
      imsg3ReplyA: 'Tell your sister she raised a gentleman.',
      imsg4Incoming: 'Quick shirt check before tomorrow’s coastal breeze.',
      imsg4PhotoNote: 'Tailored knit polo or crisp button-down?',
      imsg5Incoming: 'Hey! Just confirming we’re all set for tonight. Can’t wait to see you.',
      imsg6Incoming: 'Just got here and grabbed us the warm booth under the patio heaters. Take your time.',
      spicy: [
        'Tailored knit polo wins by a landslide for tomorrow.',
        'Keep bringing this energy and Friday won’t end at nine.',
        'What’s one thing you noticed in my photos that you didn’t mention yet?',
      ],
    },
    rory: {
      beat1ChoiceA: 'Grinning at your phone on the Tube or in LA traffic, Rory?',
      beat1ReplyA: 'Coffee line in Silver Lake, barista fully clocked me blushing at my screen x',
      beat1ChoiceB: 'Does every British musician in LA lead with charm like that?',
      beat1ReplyB: 'Only the well-behaved ones who actually write back in full sentences x',
      beat1Vip: '💎 Cute grin, Rory. Just promise you don’t serenade dates with acoustic Wonderwall on Night 1.',
      beat1VipReply: 'God no, playing guitar AT a woman uninvited should carry jail time xx',
      beat2ChoiceA: 'Five minutes of grace granted, provided you don’t call 2003 "retro."',
      beat2ReplyA: '2003 produced the best records of the century, sacred ground in my flat x',
      beat2ChoiceB: 'Accents earn three bonus points, follow-through earns the rest.',
      beat2ReplyB: 'Fair terms, I’m much stronger on follow-through than sweet talk x',
      beat2Vip: '💎 Talk as fast as you like across a candlelit booth, I keep up effortlessly.',
      beat2VipReply: 'Already counting down to testing that live xx',
      beat3Incoming: 'Honest confession: you dropped a cultural reference earlier that I quietly Googled over tea rather than pretending I knew it. Points for candor? x',
      beat3ChoiceA: 'Ten points for candor! Guys who fake knowing everything are exhausting.',
      beat3ReplyA: 'Brilliant, curiosity is half the fun anyway x',
      beat3ChoiceB: 'Adorable, consider your cultural syllabus officially started.',
      beat3ReplyB: 'Taking diligent notes in the front row x',
      beat3Vip: '💎 Owning what you don’t know with a grin is ten times hotter than bluffing, Rory.',
      beat3VipReply: 'Best relief of my week hearing that xx',
      beat4Incoming: 'Ducking into Amoeba Records between studio sessions to hunt vinyl.',
      beat4PhotoNote: 'Found an original Sade pressing and thought of Friday x',
      beat4ChoiceA: 'Pulling Sade off the vinyl wall? Dangerously good taste for 24.',
      beat4ReplyA: 'Diamond Life stays undefeated in every decade x',
      beat4ChoiceB: 'Record-store lighting suits you.',
      beat4ReplyB: 'Beats studio fluorescents any afternoon x',
      beat4Vip: '💎 Sade and tousled hair is a lethal mid-week combination, Rory.',
      beat4VipReply: 'Behaving myself until Friday night is getting tricky xx',
      beat5Incoming: 'Sorted us a tucked-away booth at a hi-fi vinyl lounge for Friday at 7:45. Proper cocktails and low volume so we can actually talk x',
      beat5ChoiceA: 'Low volume and real cocktails? You’re speaking fluent grown-up.',
      beat5ReplyA: 'Can’t flirt properly if we’re miming across a speaker stack x',
      beat5ChoiceB: 'Hi-fi vinyl lounge sounds right up my alley.',
      beat5ReplyB: 'Wait until you see their Japanese whisky shelf x',
      beat5Vip: '💎 Thoughtful spot, real reservation, zero prompting needed. Top marks x',
      beat5VipReply: 'Trying to earn a permanent gold star here xx',
      imsg1Incoming: 'Properly off that noisy app now x Saved your number with a star.',
      imsg1ReplyA: 'Promise not to spam your phone while you’re tracking guitars x',
      imsg1ReplyB: 'Making Yorkshire tea at 9 PM like a proper expat x',
      imsg2Incoming: 'Quick check before Friday: fancy meeting right inside by the record wall at 7:40, or shall I pick you up? x',
      imsg2ChoiceA: 'Meet me by the record wall five minutes early x',
      imsg2ReplyA: 'Sorted, I’ll be there at 7:40 sharp with a gin & tonic waiting x',
      imsg3Incoming: 'Walked past a florist with white peonies in the window earlier and nearly got ahead of myself x',
      imsg3ReplyA: 'Pace yourself, charmer, Friday is tomorrow night.',
      imsg4Incoming: 'Suede jacket or dark vintage blazer for tomorrow night? x',
      imsg4PhotoNote: 'Quick check before tomorrow night, too dressed up or about right? x',
      imsg5Incoming: 'Friday check-in: table is all set for 7:45 tonight, weather’s lovely, looking forward to seeing you xx',
      imsg6Incoming: 'Just got here and grabbed us a great table near the turntables, take your time walking in x',
      spicy: [
        'Suede jacket tomorrow night, zero contest.',
        'Keep charming me like this and I’m picking the late-night vinyl.',
        'Whisper one thing in that accent across the booth Friday.',
      ],
    },
    jin: {
      beat1ChoiceA: 'Waving-hand emojis really are the bare-minimum epidemic on here.',
      beat1ReplyA: 'Right? Feels like getting poked on Facebook in 2009.',
      beat1ChoiceB: 'Do cinematographers judge every restaurant strictly by the lighting?',
      beat1ReplyB: '100%. Harsh overhead white bulbs after sunset are an immediate walk-out.',
      beat1Vip: '💎 Glad I raised the bar, Jin. What movie frame sums up your ideal Friday night?',
      beat1VipReply: 'Wong Kar-wai warm tungsten glow, two drinks, zero phones on the table.',
      beat2ChoiceA: 'Quiet neighborhood bar with warm lamps and phones buried in pockets.',
      beat2ReplyA: 'Exact right answer. Eye contact beats glowing screens every time.',
      beat2ChoiceB: 'Anywhere we don’t have to repeat "WHAT?" three times per sentence.',
      beat2ReplyB: 'My ears and my sanity agree completely.',
      beat2Vip: '💎 Moody corner booth, great mezcal, and zero rush on the clock.',
      beat2VipReply: 'Already picturing the exact spot in Koreatown.',
      beat3Incoming: 'Funny realization on set today: everyone assumes twenty-five means chasing chaotic parties, when honestly my favorite night is cooking Midnight Diner ramen and debating movies.',
      beat3ChoiceA: 'Midnight Diner ramen and film debates beat crowded clubs ten to zero.',
      beat3ReplyA: 'Knew you had impeccable taste the second we matched.',
      beat3ChoiceB: 'Okay, what’s one recent movie you’ll defend to the end?',
      beat3ReplyB: 'Past Lives and Babygirl back-to-back, wildly different, both electric.',
      beat3Vip: '💎 Quiet confidence beats loud twenty-something party energy every single time, Jin.',
      beat3VipReply: 'Glad you aren’t looking for a frat boy.',
      beat4Incoming: 'Catching the last ten minutes of real golden hour on a rooftop location scout.',
      beat4PhotoNote: 'Camera finally packed in the Pelican case for the day.',
      beat4ChoiceA: 'Of course the cinematographer nails golden-hour lighting effortlessly.',
      beat4ReplyA: 'Had to earn my day rate somehow.',
      beat4ChoiceB: 'Great view up there, hope wrap went smoothly.',
      beat4ReplyB: 'Clean wrap, free all evening Friday.',
      beat4Vip: '💎 Framing, lighting, and collar all 10/10, Jin.',
      beat4VipReply: 'Making the guy behind the camera blush for once.',
      beat5Incoming: 'Reserved two seats at a hidden speakeasy lounge for Friday at 8 PM. Warm amber lamps, vinyl spinning, and my phone stays off.',
      beat5ChoiceA: 'Amber lamps and phone off? Cinematographer privileges approved.',
      beat5ReplyA: 'Lighting vetted in person last week, promise it delivers.',
      beat5ChoiceB: 'Sounds moody and effortless, count me in.',
      beat5ReplyB: 'Locked in under Jin for Friday.',
      beat5Vip: '💎 Curated lighting, real plan, zero texting games. Smooth work, Jin.',
      beat5VipReply: 'Can’t wait to see you across the table.',
      imsg1Incoming: 'Off the app at last. Saved your contact properly.',
      imsg1ReplyA: 'Set hours respected, text whenever they call wrap.',
      imsg1ReplyB: 'Editing color grades with Miles Davis on low.',
      imsg2Incoming: 'Quick check before Friday: meet right outside the unmarked speakeasy door at 7:55, or want a lift?',
      imsg2ChoiceA: 'Meet me right outside the door five minutes early.',
      imsg2ReplyA: 'Easy. Look for the brass lamp over the doorway.',
      imsg3Incoming: 'Just drove past the Alamo Drafthouse marquee playing 35mm classics, filing that away for Date #2 if I pass Date #1.',
      imsg3ReplyA: '35mm archive screening is a very strong Date #2 pitch.',
      imsg4Incoming: 'Minimalist black mock-neck or open charcoal collar for tomorrow?',
      imsg4PhotoNote: 'Director’s cut wardrobe check before Friday.',
      imsg5Incoming: 'Hey! Just confirming we’re all set for tonight. Can’t wait to see you.',
      imsg6Incoming: 'Just got here and grabbed our candlelit table in the back alcove. Text me if the hidden door is tricky.',
      spicy: [
        'Black mock-neck wins hands down tomorrow night.',
        'Keep setting scenes like this and Friday might run past closing.',
        'What’s the first detail you clock when someone walks into a room?',
      ],
    },
    liam: {
      beat1ChoiceA: 'Refreshing is rare on dating apps, surviving ER shifts this week?',
      beat1ReplyA: 'Two twelve-hour nights down, seventy-two hours completely off starting Friday morning.',
      beat1ChoiceB: 'Do ER doctors stay eerie-calm when everyone else panics?',
      beat1ReplyB: 'In trauma bays yes, around a stunning match I’m decidedly human.',
      beat1Vip: '💎 Glad we matched, Liam. Tell me doctors actually own furniture and real coffee mugs.',
      beat1VipReply: 'Haha four real pillows, oak bedframe, and an espresso machine that saved my residency!',
      beat2ChoiceA: 'Low-key neighborhood drinks with an ocean view where we can relax.',
      beat2ReplyA: 'After hospital beeping all week, ocean air and a quiet glass sound heavenly.',
      beat2ChoiceB: 'Dressed-up corner booth, good excuse to wear heels.',
      beat2ReplyB: 'Love an excuse to trade scrubs for a tailored blazer.',
      beat2Vip: '💎 Start with sunset drinks overlooking the water, then play dinner by ear if chemistry hits.',
      beat2VipReply: 'Best plan on the board. Zero pressure, great setting.',
      beat3Incoming: 'Funny ER side effect: trivial dating drama bounces right off me, all I really care about is warmth, dry humor, and someone comfortable in her own skin.',
      beat3ChoiceA: 'Same here, past thirty-five your patience for manufactured drama drops to zero.',
      beat3ReplyA: 'Exactly why I matched with you instead of twenty-four-year-old chaos.',
      beat3ChoiceB: 'Dry humor and calm energy are my two best vital signs.',
      beat3ReplyB: 'Chart looks exceptional already, doctor’s orders.',
      beat3Vip: '💎 Grounded men who don’t flinch or play games are worth their weight in gold, Liam.',
      beat3VipReply: 'No games here. Just glad you swiped back.',
      beat4Incoming: 'First real sunlight in forty-eight hours outside the hospital coffee cart.',
      beat4PhotoNote: 'Pager officially handed off until Monday morning.',
      beat4ChoiceA: 'Post-shift sunshine looks remarkably good on you, Doc.',
      beat4ReplyA: 'Eight hours of sleep tonight will make me look even more alive for Friday.',
      beat4ChoiceB: 'Enjoy that freedom, well earned!',
      beat4ReplyB: 'Tasting every drop of this iced espresso.',
      beat4Vip: '💎 Unfairly charming even coming off a twelve-hour shift, Liam.',
      beat4VipReply: 'Best pick-me-up all week reading that.',
      beat5Incoming: 'Reserved a coastal terrace table for 7:45 Friday, and cross my heart, zero gross hospital stories at dinner.',
      beat5ChoiceA: 'Appreciated! Keep dinner strictly wine, laughter, and civilian life.',
      beat5ReplyA: 'Civilian mode locked in 100%.',
      beat5ChoiceB: '7:45 by the water sounds restorative for both of us.',
      beat5ReplyB: 'Couldn’t ask for a better Friday reset.',
      beat5Vip: '💎 Thoughtful spot, pager off, and full presence. You’re acing pre-date triage.',
      beat5VipReply: 'Saving my best focus for Friday night.',
      imsg1Incoming: 'Got your number saved! Way easier texting you here than on Prowl.',
      imsg1ReplyA: 'Rest up post-shift, zero rush replying during hospital days.',
      imsg1ReplyB: 'Cooking salmon and enjoying complete silence in my apartment.',
      imsg2Incoming: 'Quick check before Friday: want to meet at the terrace bar at 7:40, or want me to swing by?',
      imsg2ChoiceA: 'Meet me at the terrace bar five minutes early.',
      imsg2ReplyA: 'Deal, I’ll be there early enjoying the sea breeze.',
      imsg3Incoming: 'Slept nine straight hours like a normal citizen. Officially dangerous company for tomorrow night.',
      imsg3ReplyA: 'Well-rested ER resident sounds like formidable company.',
      imsg4Incoming: 'Navy sport coat or relaxed cashmere sweater for the coastal breeze tomorrow?',
      imsg4PhotoNote: 'Post-residency civilian wardrobe check.',
      imsg5Incoming: 'Hey! Just confirming we’re all set for 7:45 tonight. Can’t wait to see you.',
      imsg6Incoming: 'Just got here and grabbed us a warm terrace table facing the water. Take your time.',
      spicy: [
        'Cashmere sweater for the ocean breeze, zero hesitation.',
        'Good thing your pager is off until Monday morning.',
        'Tell me what caught your eye first when my card popped up.',
      ],
    },
    elena: {
      beat1ChoiceA: 'Glad I cleared seminar standards, Professor, rough stack of essays today?',
      beat1ReplyA: 'Two undergraduates cited quotes that do not exist on Earth. Pouring Pinot to recover.',
      beat1ChoiceB: 'What’s the fastest way a guy fails your app filter in message two?',
      beat1ReplyB: 'Calling me "intimidating" like having a vocabulary is a felony.',
      beat1Vip: '💎 Zero intimidation here, Elena: give me your most ruthless unpopular literary opinion.',
      beat1VipReply: 'Half the men carrying Infinite Jest on airplanes never made it past page thirty. Glad you asked.',
      beat2ChoiceA: 'Hold completely steady. Grown adults have real jobs before 6 PM.',
      beat2ReplyA: 'Miracles happen. Last guy panicked because I was teaching a three-hour seminar.',
      beat2ChoiceB: 'A crisp period just tells me you punctuate properly.',
      beat2ReplyB: 'Finally, a younger man who doesn’t treat grammar like hostility.',
      beat2Vip: '💎 Zero fragile ego here, crush your lectures all day and bring that sharp wit to dinner.',
      beat2VipReply: 'Okay, you just jumped to the top of the curve.',
      beat3Incoming: 'Full confession so you don’t put me on an ivory pedestal: after teaching comparative literature all day, I watch trashy Bravo reality shows in silk pajamas with zero shame.',
      beat3ChoiceA: 'Highbrow by day, Bravo chaos by night is peak human balance.',
      beat3ReplyA: 'Exactly, my brain refuses subtitles after 9 PM on Wednesdays.',
      beat3ChoiceB: 'Promise never to bluff reading Russian novels if you share the popcorn.',
      beat3ReplyB: 'Deal. Bluffers get caught in ninety seconds anyway.',
      beat3Vip: '💎 Smart, self-aware, and zero pretension. That combination is lethal, Elena.',
      beat3VipReply: 'Flattery with actual rhythm to it, nicely done.',
      beat4Incoming: 'Five quiet minutes under the sycamores after my last office-hours student left.',
      beat4PhotoNote: 'Red pen capped until Monday morning.',
      beat4ChoiceA: 'If professors looked like that at my college I never would have skipped a Friday lecture.',
      beat4ReplyA: 'Careful, smooth lines earn extra-credit oral exams.',
      beat4ChoiceB: 'Autumn campus light looks incredible on you.',
      beat4ReplyB: 'Golden hour on the quad is the best perk of the department.',
      beat4Vip: '💎 Unfair distraction mid-afternoon, Elena. Save that smirk for across the wine bar.',
      beat4VipReply: 'Consider it reserved for Friday at eight.',
      beat5Incoming: 'My Friday evening is clear after five. Tell me you pick an actual spot and time instead of asking "idk what are u in the mood for?"',
      beat5ChoiceA: 'Quiet wine bar near Westwood, 7:45 table held under my name, parking right behind.',
      beat5ReplyA: 'Decisive, local, and parking scouted. A+ execution.',
      beat5ChoiceB: 'Already have two candlelit spots ready so you don’t make a single work decision after five.',
      beat5ReplyB: 'Music to my ears after grading all week.',
      beat5Vip: '💎 Table is held for 7:45, phone stays off the wood, and first glass of Pinot is waiting.',
      beat5VipReply: 'Rare composure. Now I’m genuinely excited for Friday.',
      imsg1Incoming: 'Much cleaner off the app. You have my direct line now.',
      imsg1ReplyA: 'Sounds good. Punctuality goes a long way with me.',
      imsg1ReplyB: 'Glass of Sancerre on the sofa and zero student emails allowed.',
      imsg2Incoming: 'Quick litmus test before Friday: are you an "arrive ten minutes early" man or a traffic-excuse sprinter?',
      imsg2ChoiceA: 'Ten minutes early at the bar so you never walk in looking around alone.',
      imsg2ReplyA: 'Exact right answer. Chivalry isn’t complicated.',
      imsg3Incoming: 'Just walked past the faculty club and laughed remembering how stuffy campus dinners are. Glad tomorrow is off-campus.',
      imsg3ReplyA: 'Zero faculty politics allowed tomorrow night, strictly good wine.',
      imsg4Incoming: 'Debating burgundy silk blouse vs. black cashmere for tomorrow night.',
      imsg4PhotoNote: 'Honest vote before Friday dinner?',
      imsg5Incoming: 'Sounds good for 7:45 tonight. Looking forward to trading campus talk for real wine.',
      imsg6Incoming: 'Just sat down at our table near the bookshelves. No rush walking in.',
      spicy: [
        'Burgundy silk tomorrow night is going to test my focus.',
        'Save one glass of Pinot for a quiet nightcap after they close.',
        'What’s one thing men my age usually get nervous to ask you?',
      ],
    },
    claire: {
      beat1ChoiceA: 'Happy to rescue your evening from boring openers, surviving biotech board week?',
      beat1ReplyA: 'Barely, three clinical-trial decks down and zero patience left for small talk.',
      beat1ChoiceB: 'What’s the fastest way someone loses your attention in three texts?',
      beat1ReplyB: 'Asking "wyd" at 2 PM on a Tuesday like I’m sitting in a dorm lounge.',
      beat1Vip: '💎 Direct women are my favorite match, Claire. What does your ideal off-the-clock Friday look like?',
      beat1VipReply: 'Someone sharp taking the wheel on dinner plans so I don’t make decision #201 of the day.',
      beat2ChoiceA: 'Booked a last-minute weekend flight to Oaxaca with carry-on only and zero itinerary.',
      beat2ReplyA: 'Okay, carry-on only to Oaxaca earns serious respect.',
      beat2ChoiceB: 'Signed up for coastal sailing lessons just to stop staring at screens.',
      beat2ReplyB: 'Smart move, salt water resets everything.',
      beat2Vip: '💎 Swiping on a razor-sharp Biotech VP who clearly doesn’t suffer fools.',
      beat2VipReply: 'Smooth delivery, and accurate on the fools count.',
      beat3Incoming: 'Let’s get the obvious elephant out of the way early: does sitting across from a woman who owns her home and runs a division make you weird about the check, or relaxed?',
      beat3ChoiceA: 'Completely relaxed. If I invite you to dinner, I’ve got the tab proudly within my own lane.',
      beat3ReplyA: 'Best answer possible. Effort and pride beat ego games every time.',
      beat3ChoiceB: 'Accomplished women inspire me, zero fragile ego over here.',
      beat3ReplyB: 'Refreshing, half the men my age turn dinner into a résumé contest.',
      beat3Vip: '💎 Your success is attractive, never intimidating. Tonight’s plan and tab are handled cleanly on my end.',
      beat3VipReply: 'Consider me officially impressed.',
      beat4Incoming: 'Out of the lab tower before dark for the first Thursday all month.',
      beat4PhotoNote: 'Boardroom blazer officially off duty.',
      beat4ChoiceA: 'Executive poise in sunset lighting is an unfair combination.',
      beat4ReplyA: 'Wait until Friday when work is completely out of mind.',
      beat4ChoiceB: 'Well-deserved breather after three board decks.',
      beat4ReplyB: 'Cold Sancerre is calling my name.',
      beat4Vip: '💎 Stunning photo, Claire. Every head in that restaurant is turning tomorrow night.',
      beat4VipReply: 'Keep your eyes on our side of the booth and we’ll get along great.',
      beat5Incoming: 'Calendar is clear Friday after six. One non-negotiable question: does your phone stay off the table during dinner?',
      beat5ChoiceA: 'Do Not Disturb inside my jacket pocket from hello until I walk you to your car.',
      beat5ReplyA: 'Rare manners. Friday is officially locked.',
      beat5ChoiceB: '100%, nothing on a screen beats the woman across the table.',
      beat5ReplyB: 'Good instinct.',
      beat5Vip: '💎 Phone buried, 7:45 banquette booked, and car door handled. Just show up and unwind.',
      beat5VipReply: 'Now that is how you lock in a Friday date.',
      imsg1Incoming: 'Much cleaner off the app. You have my direct line now.',
      imsg1ReplyA: 'Sounds good. Zero midday text spam from my end.',
      imsg1ReplyB: 'Unwinding on the patio with chilled white wine and zero Slack alerts.',
      imsg2Incoming: 'Quick check before Friday: I’ll meet you inside at the bar at 7:40, trust you aren’t chronically late?',
      imsg2ChoiceA: 'I’ll be at the bar at 7:35 with your Sancerre already ordered.',
      imsg2ReplyA: 'Sounds good. Exact right move.',
      imsg3Incoming: 'My best friend Jade asked who had me smiling between budget reviews today. Told her jury’s out until Friday.',
      imsg3ReplyA: 'Tell Jade I plan on winning a unanimous verdict tomorrow.',
      imsg4Incoming: 'Emerald cocktail cut or tailored black jumpsuit for tomorrow night.',
      imsg4PhotoNote: 'Quick verdict before 7:45 tomorrow?',
      imsg5Incoming: 'Sounds good for 7:45 tonight. Looking forward to it.',
      imsg6Incoming: 'Just sat down at our table near the patio. No rush parking.',
      spicy: [
        'That tailored black jumpsuit is lethal, wear that.',
        'Keep that smile past dessert and we’re finding a late wine bar.',
        'Tell me the exact second you decided I wasn’t like other guys on Prowl.',
      ],
    },
    sienna: {
      beat1ChoiceA: 'Best part of my week was matching with an architect who appreciates good lighting.',
      beat1ReplyA: 'Careful, compliment my lighting taste and we’ll talk for three hours straight.',
      beat1ChoiceB: 'Do interior architects silently redesign every restaurant they walk into?',
      beat1ReplyB: 'Within four seconds of sitting down! Bad acoustic tile haunts my dreams.',
      beat1Vip: '💎 Give me your #1 bachelor-apartment design crime so I can brag I already passed.',
      beat1VipReply: 'Shiny black polyester sheets and a bare bulb brighter than an operating room. Tell me you’re innocent!',
      beat2ChoiceA: 'Dim candlelit wine bar every time, shouting over house music is torture.',
      beat2ReplyA: 'Thank heaven, acoustic warmth and real glassware win.',
      beat2ChoiceB: 'Quiet courtyard patio with olive trees and low music.',
      beat2ReplyB: 'Now you’re painting my exact dream Friday.',
      beat2Vip: '💎 Warm amber lamps, corner leather booth, and zero TV screens on the walls.',
      beat2VipReply: 'You speak fluent design language, dangerous.',
      beat3Incoming: 'Playful honesty check: if things go great and I eventually see your apartment, is there an actual hand towel and soap in your bathroom or a roll of Bounty?',
      beat3ChoiceA: 'Lidded trash bin, botanical hand soap, and two fresh white linen towels ready.',
      beat3ReplyA: 'Stop it, did my girlfriends coach you?! Instant top 1% score.',
      beat3ChoiceB: 'Real cotton sheets, four pillows, AND warm table lamps, zero Bounty in sight.',
      beat3ReplyB: 'Miracles really do live in Los Angeles.',
      beat3Vip: '💎 Spotless bathroom, 64-degree sleep AC, and a spare phone cord on the nightstand.',
      beat3VipReply: 'Okay, hang a gold plaque on your front door immediately.',
      beat4Incoming: 'Quick iced cortado outside the stone showroom after talking a client out of grey vinyl floors.',
      beat4PhotoNote: 'Doing public service for Los Angeles interiors one house at a time.',
      beat4ChoiceA: 'Saving LA from sad grey floors AND looking radiant doing it.',
      beat4ReplyA: 'Hard work, someone had to step in!',
      beat4ChoiceB: 'Showroom courtyard sun suits you.',
      beat4ReplyB: 'Needed five minutes away from paint swatches.',
      beat4Vip: '💎 Effortless style, Sienna. Friday’s restaurant better live up to you.',
      beat4VipReply: 'With good company I promise not to grade the wallpaper.',
      beat5Incoming: 'Friday evening is wide open. Pick somewhere with warm lighting and real linen napkins and you have my undivided attention.',
      beat5ChoiceA: 'Courtyard wine bar in West Hollywood at 7:45, olive trees and real candlelight.',
      beat5ReplyA: 'Oh I love that courtyard, ten out of ten pick.',
      beat5ChoiceB: 'Booked an intimate booth with plaster walls and zero neon signs for 7:45.',
      beat5ReplyB: 'You actually listened! Count me very in.',
      beat5Vip: '💎 7:45 corner booth under warm lanterns is locked in. Bring your sharp eye and appetite.',
      beat5VipReply: 'Counting down to Friday already ✨',
      imsg1Incoming: 'Officially off Prowl ✨ Saved your number, much easier texting here.',
      imsg1ReplyA: 'Punctual and zero rambling, green flag already 🍷',
      imsg1ReplyB: 'Sketching patio tile with Chet Baker playing and a candle lit.',
      imsg2Incoming: 'Honest check before Friday: ten minutes early at the bar, or sprinting from valet at 7:48?',
      imsg2ChoiceA: 'Ten minutes early so your glass is waiting when you walk in.',
      imsg2ReplyA: 'Smooth and considerate, love that.',
      imsg3Incoming: 'Just passed a courtyard draped in jasmine and warm string lights, good omen for tomorrow night.',
      imsg3ReplyA: 'Save that exact mood for 7:45 tomorrow.',
      imsg4Incoming: 'Cream silk slip + blazer or terracotta wrap dress for tomorrow night?',
      imsg4PhotoNote: 'Architect wardrobe tie-breaker before Friday ✨',
      imsg5Incoming: 'Hey! Just confirming we’re all set for 7:45 tonight. Can’t wait to see you.',
      imsg6Incoming: 'Just got here and grabbed our table under the courtyard lanterns! Text me when you walk in ✨',
      spicy: [
        'Cream silk slip + blazer is untouchable for tomorrow.',
        'Play your cards right and you can audit my lamp lighting on Date #2.',
        'Tell me what made you swipe yes before reading prompt three.',
      ],
    },
    priya: {
      beat1ChoiceA: 'Quick in person and zero squeamishness if ER stories slip out over wine.',
      beat1ReplyA: 'Haha strong stomach AND quick banter? Rare breed.',
      beat1ChoiceB: 'Survived your trauma shift streak this week?',
      beat1ReplyB: 'Just clocked off three twelves, running on espresso and pure freedom until Monday.',
      beat1Vip: '💎 Charge Trauma RN means zero patience for nonsense, Priya. What’s your #1 green flag on Date 1?',
      beat1VipReply: 'A man who picks the spot decisively and laughs with me instead of acting like dinner is a job interview.',
      beat2ChoiceA: 'Complete distraction: cold cocktails, great stories, and zero work talk unless you start it.',
      beat2ReplyA: 'Yes please! Leaving hospital fluorescents behind is the entire goal.',
      beat2ChoiceB: 'Five minutes to vent if needed, then straight into laughing until midnight.',
      beat2ReplyB: 'Ideal ratio honestly, five minutes clears the slate.',
      beat2Vip: '💎 Good food in front of you immediately, phone put away, and making you laugh until your shoulders drop.',
      beat2VipReply: 'Sold. Prescribe that every Friday.',
      beat3Incoming: 'Real-life check: I parallel park in one smooth move, talk fast, and pay my own mortgage. Does a woman who moves decisively rattle you or turn you on?',
      beat3ChoiceA: 'Turns me way on. Helpless damsel routines put me to sleep.',
      beat3ReplyA: 'Thank God, last guy sulked because I backed his SUV into a tight spot!',
      beat3ChoiceB: 'Competence is the most attractive trait on earth, bring all of it.',
      beat3ReplyB: 'Okay, we are going to have a dangerously good time Friday.',
      beat3Vip: '💎 Decisive women are electric, Priya. And on Friday night, let me handle the driving so you actually rest.',
      beat3VipReply: 'Smooth pivot, keeping my fierce side AND spoiling me a little.',
      beat4Incoming: 'Hair finally out of a scrub cap and blinking into real daylight.',
      beat4PhotoNote: 'Seventy-two hours off duty starts right now.',
      beat4ChoiceA: 'Off-duty glow hits ten out of ten, Priya.',
      beat4ReplyA: 'Amazing what sunshine and real coffee can do!',
      beat4ChoiceB: 'Freedom looks great on you, enjoy every hour off.',
      beat4ReplyB: 'Starting with a nap, ending with Friday drinks.',
      beat4Vip: '💎 Devastating smile for someone coming off three twelve-hour shifts.',
      beat4VipReply: 'Flattery works embarrassingly fast post-shift.',
      beat5Incoming: 'I am wide awake and free Friday night. Pitch me an actual plan instead of making the off-duty nurse triage restaurants!',
      beat5ChoiceA: '7:45 booth at a lively tapas & wine spot on 3rd, patatas bravas and sangria ready.',
      beat5ReplyA: 'Tapas and zero dishes to wash? Instant yes.',
      beat5ChoiceB: 'Quiet cocktail lounge with plush seating at 7:45 so your feet get royal treatment.',
      beat5ReplyB: 'Plush seating after hospital floors wins my whole heart.',
      beat5Vip: '💎 Plush corner banquette held for 7:45, easy valet out front, and zero decisions required from you.',
      beat5VipReply: 'Triage complete, 10/10 plan.',
      imsg1Incoming: 'Officially off Prowl ✨ Saved your number, much easier texting here.',
      imsg1ReplyA: 'Punctual and zero rambling, green flag already 🍷',
      imsg1ReplyB: 'Curled up on the couch in cashmere socks watching terrible heist movies.',
      imsg2Incoming: 'Quick check before Friday: ten minutes early at the bar, or sprinting through parking at 7:46?',
      imsg2ChoiceA: 'Ten minutes early with two seats secured away from the door.',
      imsg2ReplyA: 'ER precision approved.',
      imsg3Incoming: 'Slept ten glorious hours and woke up actually excited for a first date for once.',
      imsg3ReplyA: 'Well-rested Priya doesn’t stand a chance of being bored tomorrow.',
      imsg4Incoming: 'Deep crimson lip + black halter or gold satin top for tomorrow night?',
      imsg4PhotoNote: 'Post-scrubs transformation check ✨',
      imsg5Incoming: 'Hey! Just confirming we’re all set for 7:45 tonight. Can’t wait to see you.',
      imsg6Incoming: 'Just got here and grabbed our plush booth! Text me when you pull up ✨',
      spicy: [
        'Crimson lip + black halter is going to stop my pulse.',
        'Good thing you don’t have a morning shift Saturday.',
        'What’s one bold thought you edited out of your first message?',
      ],
    },
    summer: {
      beat1ChoiceA: 'Do guys seriously open with "hey trouble" in the year 2026?',
      beat1ReplyA: 'At least four times a day! Usually paired with a bathroom mirror flex.',
      beat1ChoiceB: 'Week’s rolling smoothly, how many reformer classes did you teach today?',
      beat1ReplyB: 'Four packed morning classes, legs are humming, iced matcha in hand.',
      beat1Vip: '💎 Glad I skipped the clichés, Summer. What’s the funniest thing a guy tried in your Pilates studio?',
      beat1VipReply: 'A 24-year-old marathon bro swore reformer Pilates was "just stretching" before shaking like a leaf ninety seconds in!',
      beat2ChoiceA: 'Singing 2000s pop hooks at full volume whenever I’m driving solo on PCH.',
      beat2ReplyA: 'Haha elite habit, zero judgment from my passenger seat.',
      beat2ChoiceB: 'Ordering two desserts for the table even when I claim I’m full.',
      beat2ReplyB: 'Always two spoons AND two desserts, non-negotiable rule.',
      beat2Vip: '💎 Canceling loud late-night plans just to stay in somewhere cozy with great company.',
      beat2VipReply: 'Wait, a younger man who appreciates cozy evenings? Pinch me.',
      beat3Incoming: 'Honest vibe check: because I own wellness studios in Brentwood, guys either pitch me supplement startups or try to mansplain fitness. Promise you’re just normal and fun?',
      beat3ChoiceA: 'Zero startup decks and I respect that your plank crushes mine by three minutes.',
      beat3ReplyA: 'Haha secure AND self-aware, dream answer.',
      beat3ChoiceB: 'Strictly off-the-clock fun, wine and real laughs only.',
      beat3ReplyB: 'Yes! Off-duty Summer loves bread baskets and Pinot.',
      beat3Vip: '💎 Zero gym-bro ego here, Summer. You run studios all week, Friday night is strictly about spoiling you.',
      beat3VipReply: 'Okay, my cheeks actually warmed up reading that ✨',
      beat4Incoming: 'Sneakers finally swapped for sandals in the studio courtyard.',
      beat4PhotoNote: 'Last reformer springs reset for the afternoon.',
      beat4ChoiceA: 'California sunshine clearly picked a favorite in Brentwood.',
      beat4ReplyA: 'Smooth talker, I’ll allow it.',
      beat4ChoiceB: 'Looking effortless after teaching four classes.',
      beat4ReplyB: 'Matcha + sunshine works wonders!',
      beat4Vip: '💎 Unfair courtyard glow, Summer. Friday night can’t arrive fast enough.',
      beat4VipReply: 'Counting down right there with you.',
      beat5Incoming: 'I wrap my last private client at five Friday. Just promise your plan doesn’t start at 10:30 PM when half of me is ready for silk pajamas!',
      beat5ChoiceA: '7:30 coastal bistro reservation locked in, golden hour to candlelight.',
      beat5ReplyA: '7:30 coastal dinner is absolute perfection.',
      beat5ChoiceB: 'Early 7:30 table near the beach so the whole night feels unhurried.',
      beat5ReplyB: 'You read my mind completely.',
      beat5Vip: '💎 7:30 oceanfront booth booked, warm sourdough on deck, and zero late-night chaos.',
      beat5VipReply: 'Gold star before we even clink glasses ✨',
      imsg1Incoming: 'Officially off Prowl ✨ Saved your number, much easier texting here.',
      imsg1ReplyA: 'Punctual and zero rambling, green flag already 🍷',
      imsg1ReplyB: 'Stretching on the living room rug with acoustic Fleetwood Mac playing.',
      imsg2Incoming: 'Honest check before Friday: ten minutes early at the bar, or sprinting through parking at 7:34?',
      imsg2ChoiceA: 'Ten minutes early holding the warm booth away from the breeze.',
      imsg2ReplyA: 'Gentleman points climbing fast.',
      imsg3Incoming: 'Drove down Sunset toward the ocean today and the sky turned pure peach, hope tomorrow puts on a repeat.',
      imsg3ReplyA: 'Ordered us the exact same sunset for 7:30 tomorrow.',
      imsg4Incoming: 'White backless linen dress or espresso silk midi for tomorrow night?',
      imsg4PhotoNote: 'Trading Pilates leggings for real Friday attire ✨',
      imsg5Incoming: 'Hey! Just confirming we’re all set for tonight. Can’t wait to see you.',
      imsg6Incoming: 'Just got here and grabbed our coastal table! Text me when you pull up ✨',
      spicy: [
        'Espresso silk midi is going to ruin my train of thought.',
        'If chemistry hits like this in person, silk-pajama curfew might slip an hour.',
        'Bet I still make you laugh mid-plank if I ever take your class.',
      ],
    },
    celeste: {
      beat1ChoiceA: 'Pleasure is mine, Celeste. Do former prima ballerinas still out-posture every room?',
      beat1ReplyA: 'Forty years after Lincoln Center and my spine still refuses to slouch.',
      beat1ChoiceB: 'What inspired you to join an app full of mortals in Los Angeles?',
      beat1ReplyB: 'Curiosity and a refusal to spend Friday nights listening to men my age recite medical charts.',
      beat1Vip: '💎 Most men wouldn’t know what to do with genuine elegance, Celeste. Glad I caught your eye.',
      beat1VipReply: 'Directness without trembling. Very promising opening movement.',
      beat2ChoiceA: 'Ten minutes early every time, blaming traffic is for amateurs.',
      beat2ReplyA: 'Thank goodness. Curtain time never waited at the Met and neither do I.',
      beat2ChoiceB: 'Early at the bar with a chilled dry Gibson ready to order.',
      beat2ReplyB: 'A younger man who knows what a dry Gibson is? Intriguing.',
      beat2Vip: '💎 Five minutes early, standing when you arrive, and coat handled before you sit.',
      beat2VipReply: 'Old-world manners never go out of style.',
      beat3Incoming: 'Let us be candid: I have outlasted three artistic directors and two marriages. Youth alone does not dazzle me, curiosity, backbone, and wit do.',
      beat3ChoiceA: 'Good, because coasting on birth years is lazy. Judge me on conversation.',
      beat3ReplyA: 'Spoken with real spine. I like that.',
      beat3ChoiceB: 'Curiosity and wit are way more interesting than trying to impress you with buzzwords.',
      beat3ReplyB: 'Wise instinct. Pretension bores me in three minutes.',
      beat3Vip: '💎 I wouldn’t dare coast with you, Celeste. Matching wits with an icon is the entire appeal.',
      beat3VipReply: 'Careful, keep talking like that and you will earn a second act.',
      beat4Incoming: 'Brief intermission on the conservatory terrace after coaching young soloists.',
      beat4PhotoNote: 'Rehearsal piano finally quiet for the afternoon.',
      beat4ChoiceA: 'Pure grace even between rehearsals, Celeste.',
      beat4ReplyA: 'Kind of you to say, darling.',
      beat4ChoiceB: 'That conservatory terrace looks wonderfully peaceful.',
      beat4ReplyB: 'Lovely breeze once the violinists pack up.',
      beat4Vip: '💎 Timeless magnetism, Celeste. Friday evening is going to be unforgettable.',
      beat4VipReply: 'Bring that exact energy to the table and we shall see.',
      beat5Incoming: 'My Friday evening is open at 7:45. Tell me you prefer a civilized supper club over noisy trendy chaos.',
      beat5ChoiceA: 'Booked a quiet velvet banquette at a classic supper lounge for 7:45.',
      beat5ReplyA: 'Impeccable choice. Real tablecloths still matter.',
      beat5ChoiceB: 'Jazz quartet playing low and proper martinis at 7:45, already held.',
      beat5ReplyB: 'Now that is how an evening is staged.',
      beat5Vip: '💎 Corner banquette reserved for 7:45, phone silenced, and zero rushing between courses.',
      beat5VipReply: 'Bravo. Friday is yours.',
      imsg1Incoming: 'Much better off the app. You have my actual line now, use it wisely.',
      imsg1ReplyA: 'Punctual and concise. Keep it up.',
      imsg1ReplyB: 'Dry Gibson on the terrace and Debussy on low. Peaceful.',
      imsg2Incoming: 'One logistical question: do you arrive five minutes early, or make excuses about Sunset Boulevard?',
      imsg2ChoiceA: 'Early by the mahogany bar so you never enter an empty booth.',
      imsg2ReplyA: 'Sounds good. Exact right answer.',
      imsg3Incoming: 'Passed a quiet courtyard with white tablecloths and Bill Evans playing earlier. Good omen for tomorrow.',
      imsg3ReplyA: 'Save that exact atmosphere for 7:45 tomorrow.',
      imsg4Incoming: 'Brief preview before 7:45 tomorrow evening.',
      imsg4PhotoNote: 'Black velvet collar or ivory silk shawl for supper?',
      imsg5Incoming: 'Friday confirmation: we are set for 7:45 tonight. See you shortly.',
      imsg6Incoming: 'I’m at a quiet table near the bar with a cold martini. Come say hello.',
      spicy: [
        'Black velvet collar is unmistakable perfection for tomorrow.',
        'Save room for a quiet cognac nightcap after the quartet wraps.',
        'Tell me what makes a man unforgettable in your eyes, Celeste.',
      ],
    },
    astrid: {
      beat1ChoiceA: 'Clean delivery is easy when your profile actually has dry humor in it, Astrid.',
      beat1ReplyA: 'Stockholm dryness confuses half of California, glad you caught the wavelength.',
      beat1ChoiceB: 'How long did it take you to adjust from Nordic winters to Pacific sun?',
      beat1ReplyB: 'Roughly twelve minutes! Though I still miss real thunderstorms.',
      beat1Vip: '💎 Direct Nordic founders are rare in LA, Astrid. What Silicon Beach habit makes you roll your eyes hardest?',
      beat1VipReply: 'Men bringing sleep-tracker scores and cold-plunge speeches to first dates. Just drink the wine!',
      beat2ChoiceA: 'Easily, watching waves roll in without checking notifications is the best reset.',
      beat2ReplyA: 'Rare calm in a city addicted to refreshing screens.',
      beat2ChoiceB: 'Ten quiet minutes is easy when the company feels natural.',
      beat2ReplyB: 'True, comfortable silence tells you everything about chemistry.',
      beat2Vip: '💎 Phone stays in the glovebox from sunset on, Astrid.',
      beat2VipReply: 'Strong answer. Very strong.',
      beat3Incoming: 'Candid Nordic note: I don’t drop coy hints. When I enjoy someone I show up warmly, and if someone plays hot-and-cold games I vanish cleanly.',
      beat3ChoiceA: 'Zero coy hints needed here, straightforward communication is pure relief.',
      beat3ReplyA: 'Good. Life is way too short for guessing games.',
      beat3ChoiceB: 'Refreshing clarity, I’m wired the exact same way.',
      beat3ReplyB: 'Then Friday is going to feel very easy.',
      beat3Vip: '💎 Direct warmth met with direct follow-through. Zero guessing where I stand, Astrid.',
      beat3VipReply: 'Okay, I like your style a lot.',
      beat4Incoming: 'Pulled off PCH near Malibu for five minutes of salt air between founder calls.',
      beat4PhotoNote: 'Laptop closed in the trunk where it belongs.',
      beat4ChoiceA: 'PCH salt air and Nordic poise, tough combination to beat.',
      beat4ReplyA: 'Highway 1 cures every investor call.',
      beat4ChoiceB: 'Best office view in California right there.',
      beat4ReplyB: 'Beats Zoom grids ten times out of ten.',
      beat4Vip: '💎 Striking photo, Astrid. Friday dinner just became the highlight of my week.',
      beat4VipReply: 'Feeling is mutual from this side of the coast.',
      beat5Incoming: 'Friday evening is clear. Pick somewhere clean and coastal without a two-hour valet bottleneck and I am in.',
      beat5ChoiceA: 'Ocean-view wine bar in Santa Monica at 7:45, easy lot right behind.',
      beat5ReplyA: 'Clean, coastal, smart parking. Approved.',
      beat5ChoiceB: '7:45 fireplace patio near Venice canals, quiet and unpretentious.',
      beat5ReplyB: 'Love that spot, zero scene-chasing.',
      beat5Vip: '💎 7:45 coastal booth locked in, zero biohacker talk, crisp white wine waiting.',
      beat5VipReply: 'Sold. Looking forward to Friday.',
      imsg1Incoming: 'Much cleaner off the app. You have my direct line now.',
      imsg1ReplyA: 'Sounds good. Scandinavian efficiency respected.',
      imsg1ReplyB: 'Sauna session done, herbal tea on the deck.',
      imsg2Incoming: 'Quick check before Friday: ten minutes early at the bar, or blaming Pacific Coast Highway?',
      imsg2ChoiceA: 'Ten minutes early so two glasses are waiting when you arrive.',
      imsg2ReplyA: 'Exact right instinct.',
      imsg3Incoming: 'Clear sky all the way out to Catalina this afternoon, tonight’s coastal air will be crisp.',
      imsg3ReplyA: 'Saved us the table right beside the outdoor hearth.',
      imsg4Incoming: 'Ivory cashmere turtleneck or sleek black blazer for coastal wind tomorrow?',
      imsg4PhotoNote: 'Quick tie-breaker before Friday dinner.',
      imsg5Incoming: 'Hey! Just confirming we’re all set for 7:45 tonight. Looking forward to it.',
      imsg6Incoming: 'Just sat down at our table near the coastal glass. No rush parking.',
      spicy: [
        'Sleek black blazer over silk is unbeatable tomorrow.',
        'If conversation flows like this, Highway 1 drive for Date #2.',
        'Tell me one bold question you love asking across a dinner table.',
      ],
    },
    camila: {
      beat1ChoiceA: 'Late glass of red sounds well earned, Camila, busy night on the floor?',
      beat1ReplyA: 'Full dining room and one table tried ordering ice cubes in aged Barolo, survived with a smile!',
      beat1ChoiceB: 'Wait, is picking a wine bar for a sommelier terrifying or flattering?',
      beat1ReplyB: 'Flattering! Off the clock I’m just as happy splitting cold cervezas and tacos.',
      beat1Vip: '💎 Sommelier confession time, Camila: what’s the funniest fake wine flex a date ever tried on you?',
      beat1VipReply: 'Swirling tap water by accident while lecturing me about "legs." Nearly bit right through my lip!',
      beat2ChoiceA: 'Adventurous every time, order four plates for the middle and share everything.',
      beat2ReplyA: 'Yes! People who guard one entrée like prison rations break my heart.',
      beat2ChoiceB: 'Tell me your two favorite dishes on the menu and let’s dive straight in.',
      beat2ReplyB: 'Sharing plates + trusting the house specialty always wins.',
      beat2Vip: '💎 Family-style sharing plates, and zero insecurity handing you the wine list.',
      beat2VipReply: 'Wait, a man who actually enjoys letting me pick the bottle? Marry me.',
      beat3Incoming: 'Funny sommelier occupational hazard: half the men my age get weirdly competitive when the server hands me the leather wine book. Tell me your ego survives good Burgundy?',
      beat3ChoiceA: 'Survives and celebrates! Watching someone in her element is magnetic.',
      beat3ReplyA: 'Music to my ears, I promise to pick something unforgettable.',
      beat3ChoiceB: 'I handle the reservation and tab, you curate the bottle, dream team.',
      beat3ReplyB: 'Best division of labor ever invented.',
      beat3Vip: '💎 Nothing hotter than a woman who knows her palate, Camila. Wine list is 100% yours.',
      beat3VipReply: 'Okay, I am already pulling mental bottles for Friday ✨',
      beat4Incoming: 'Checking afternoon deliveries on the patio before unlocking the cellar.',
      beat4PhotoNote: 'Sunlight before five hours of candlelight.',
      beat4ChoiceA: 'Patio sunlight suits you even better than cellar candlelight.',
      beat4ReplyA: 'Sweet talker, making me blush next to crates of Rioja.',
      beat4ChoiceB: 'Hope tonight’s service runs like clockwork.',
      beat4ReplyB: 'Smooth crew tonight, off early tomorrow for Friday!',
      beat4Vip: '💎 Gorgeous photo, Camila. Friday’s table won’t know what hit it.',
      beat4VipReply: 'Save a toast like that for our first pour.',
      beat5Incoming: 'Miracle of miracles: I gave myself Friday night completely off the floor. Where are you taking a sommelier off duty?',
      beat5ChoiceA: 'Cozy neighborhood osteria at 7:45 where nobody knows your work email.',
      beat5ReplyA: 'Handmade pasta off my own turf sounds heavenly.',
      beat5ChoiceB: 'Intimate mezcal & small-plates courtyard at 7:45 for a total change of pace.',
      beat5ReplyB: 'Ooh switching from wine to smoky mezcal is genius!',
      beat5Vip: '💎 7:45 candlelit corner table far from your own restaurant so you actually get taken care of.',
      beat5VipReply: 'Being the guest instead of the host feels downright luxurious ✨',
      imsg1Incoming: 'Officially off Prowl ✨ Saved your number, much easier texting here.',
      imsg1ReplyA: 'Punctual and zero rambling, green flag already 🍷',
      imsg1ReplyB: 'Midnight grilled cheese in silk pajamas after closing out the cellar.',
      imsg2Incoming: 'Quick check before Friday: ten minutes early at the bar, or sliding into the booth out of breath?',
      imsg2ChoiceA: 'Ten minutes early so your chair is ready when you walk in.',
      imsg2ReplyA: 'Hospitality pro move, love that.',
      imsg3Incoming: 'Walked past the flower market downtown and the jasmine smelled like summer in Madrid.',
      imsg3ReplyA: 'Bringing Madrid patio energy straight into tomorrow night.',
      imsg4Incoming: 'Off-the-shoulder wine-red knit or black satin camisole for tomorrow?',
      imsg4PhotoNote: 'Off-the-clock Friday fit check ✨',
      imsg5Incoming: 'Hey! Just confirming we’re all set for 7:45 tonight. Can’t wait to see you.',
      imsg6Incoming: 'Just got here and grabbed our corner table! Text me when you pull up ✨',
      spicy: [
        'Off-the-shoulder wine-red knit is pure trouble tomorrow.',
        'Save a mystery nightcap bottle for back home if sparks fly.',
        'What’s one flavor note you associate with great chemistry?',
      ],
    },
    vivienne: {
      beat1ChoiceA: 'Happy to spare you "how was your weekend," busy week at the auction house?',
      beat1ReplyA: 'Appraising a mid-century estate in Holmby Hills. Spectacular art, absurd heirs.',
      beat1ChoiceB: 'Do auction directors spot a counterfeit personality as fast as a fake Rothko?',
      beat1ReplyB: 'Faster. Fake Rothkos at least took effort with a brush.',
      beat1Vip: '💎 Concise and unintimidated is my baseline, Vivienne. What earned your right swipe?',
      beat1VipReply: 'Clear eyes and zero frat-boy posturing in your prompts. Rare combination.',
      beat2ChoiceA: 'Deal. Backhanded age qualifiers belong in the trash bin.',
      beat2ReplyA: 'Smart man. Compliment a woman straight or stay home.',
      beat2ChoiceB: 'Agreed 100%, "you’re stunning" requires zero extra words at the end.',
      beat2ReplyB: 'Exactly. Three words, clean period.',
      beat2Vip: '💎 Never crossed my mind, Vivienne. You outclass ninety-nine percent of any room regardless of decade.',
      beat2VipReply: 'Composed and articulate. You may proceed to question three.',
      beat3Incoming: 'Fair warning before Friday: I enjoy men in their twenties and thirties because they still laugh easily, provided they aren’t secretly hunting a patroness.',
      beat3ChoiceA: 'My rent and career are squared away, strictly here for razor-sharp company.',
      beat3ReplyA: 'Good. Self-respect is non-negotiable at my table.',
      beat3ChoiceB: 'Zero patroness applications here, I plan and cover the dates I ask for.',
      beat3ReplyB: 'Refreshing clarity. You’d be amazed how many try.',
      beat3Vip: '💎 Independent lane on my side, Vivienne. I want chemistry across the table, never sponsorship.',
      beat3VipReply: 'Exact right answer.',
      beat4Incoming: 'Five minutes on the sculpture garden terrace before the evening preview opens.',
      beat4PhotoNote: 'Gavel stays locked in my desk until Monday.',
      beat4ChoiceA: 'Effortless gallery poise, Vivienne.',
      beat4ReplyA: 'Kind of you. Fresh air beats auction spotlights.',
      beat4ChoiceB: 'Hope tonight’s bidding breaks house records.',
      beat4ReplyB: 'Two collectors are already glaring at each other, promising signs.',
      beat4Vip: '💎 Half the collectors tonight won’t even be looking at the paintings, Vivienne.',
      beat4VipReply: 'Flattery delivered with poise. Approved.',
      beat5Incoming: 'My Friday calendar clears at seven. Tell me you booked an actual table with quiet acoustics rather than improvising on the sidewalk.',
      beat5ChoiceA: '7:45 corner banquette at the hotel bar in Beverly Hills, quiet and classic.',
      beat5ReplyA: 'Proper choice. Their martinis are ice-cold.',
      beat5ChoiceB: 'Reserved a candlelit supper table at 7:45 with real linen and zero shouting.',
      beat5ReplyB: 'Civilized planning. I approve.',
      beat5Vip: '💎 7:45 corner banquette confirmed, valet handled, and phone off the table all evening.',
      beat5VipReply: 'Impeccable execution.',
      imsg1Incoming: 'Much better off the app. You have my actual line now, use it wisely.',
      imsg1ReplyA: 'Punctual and concise. Keep it up.',
      imsg1ReplyB: 'Chilled Sancerre on the terrace reviewing Paris catalog proofs.',
      imsg2Incoming: 'One logistical question: do you arrive five minutes early, or make excuses about Wilshire traffic?',
      imsg2ChoiceA: 'Ten minutes early by the bar so you walk straight to a ready table.',
      imsg2ReplyA: 'Sounds good. Exact right answer.',
      imsg3Incoming: 'Acquired a stunning 1962 French jazz pressing from an estate today. Good mood heading into Friday.',
      imsg3ReplyA: 'Sounds like Date #2 soundtrack material if I pass inspection tomorrow.',
      imsg4Incoming: 'Brief preview before 7:45 tomorrow.',
      imsg4PhotoNote: 'Tailored ivory silk blazer or classic black Saint Laurent cut?',
      imsg5Incoming: 'Friday confirmation: we are set for 7:45 tonight. 👍',
      imsg6Incoming: 'I’m at a quiet table near the bar with a cold martini. Come say hello.',
      spicy: [
        'Black Saint Laurent cut is devastatingly sharp.',
        'If dinner sparks properly, tell me about that 1962 French pressing over a nightcap.',
        'What is the boldest bid someone ever placed for your attention?',
      ],
    },
  };

  const pPack = GENUINE_PERSONA_PACKS[profile.id];

  // Clean bespoke 6-beat arc for every Genuine Main Lead & Cameo
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
            text:
              pPack?.beat1ChoiceA ||
              (isHimMatch
                ? `Your profile actually sounded written by a human, what’s the story behind Slide 2?`
                : `Happy to raise the curve, what’s the funniest opener someone tried on you this week?`),
            reply:
              pPack?.beat1ReplyA ||
              (isHimMatch
                ? `Haha caught right in my element, friend snapped that mid-laugh when I didn’t know the camera was up.`
                : `Someone sent seventeen fire emojis and zero words. You’re winning by a landslide.`),
            delta: 16,
          },
          {
            text:
              pPack?.beat1ChoiceB ||
              (isHimMatch
                ? `Quick vibe check: dry banter or polite small talk?`
                : `Slide 2 caught my eye, what’s your go-to way to unwind after a long day?`),
            reply:
              pPack?.beat1ReplyB ||
              (isHimMatch
                ? `Dry banter every single time, polite small talk puts me straight to sleep.`
                : `Phone on silent, something great in a glass, and zero work talk.`),
            delta: 14,
          },
          {
            text:
              pPack?.beat1Vip ||
              (isHimMatch
                ? `💎 Skip the rehearsed dating-app script, ${profile.name}, tell me one thing about you nobody guesses right away.`
                : `💎 No generic small talk here, give me one unpopular opinion you stand by 100%.`),
            reply:
              pPack?.beat1VipReply ||
              (isHimMatch
                ? `People expect nonstop extrovert energy, when really I’m happiest cooking late-night pasta for one person.`
                : `Dessert menus beat networking events ten times out of ten, glad you skipped the script.`),
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
            text:
              pPack?.beat2ChoiceA ||
              (isHimMatch
                ? `People who brag nonstop or rush straight to scheduling before we’ve even laughed once.`
                : `Zero panic here. I stay busy with my own craft and catch up warmly when you’re off.`),
            reply:
              pPack?.beat2ReplyA ||
              (isHimMatch
                ? `Couldn’t agree more, if the banter isn’t effortless here, dinner would feel like homework.`
                : `Thank heaven, self-assured patience is rarer than gold.`),
            delta: 16,
          },
          {
            text:
              pPack?.beat2ChoiceB ||
              (isHimMatch
                ? `Secretly super competitive, though I’m graceful when I win.`
                : `Candlelit vinyl bar every time, shouting over bass is an instant pass.`),
            reply:
              pPack?.beat2ReplyB ||
              (isHimMatch
                ? `Haha noted, now I definitely know not to go easy on you.`
                : `Impeccable taste. My ears thank you already.`),
            delta: 15,
          },
          {
            text:
              pPack?.beat2Vip ||
              (isHimMatch
                ? `💎 Boring texters, thankfully you’re passing round two with flying colors.`
                : `💎 Zero fragile ego here, take all the space your day needs and bring your wit at six.`),
            reply:
              pPack?.beat2VipReply ||
              (isHimMatch
                ? `High praise, now I’m determined to keep that streak alive.`
                : `Consider me officially intrigued.`),
            delta: 24,
            cost: 1,
            badge: 'High-EQ Banter',
          },
        ],
      },
      {
        beatNumber: 3,
        incomingMessages: [
          pPack?.beat3Incoming ||
            (isHimMatch
              ? `Honest moment: sometimes people assume a ${profile.age}-year-old isn’t looking for something real, when that’s the whole reason I’m here.`
              : `Fair warning up front: I’ve built a very peaceful life on my own, so I pace things intentionally.`),
        ],
        choices: [
          {
            text:
              pPack?.beat3ChoiceA ||
              (isHimMatch
                ? `Actions prove way more than birth years, keep showing up consistently and you’ll stand out fast.`
                : `I love that you guard your peace, no rushing from my side, just good company.`),
            reply:
              pPack?.beat3ReplyA ||
              (isHimMatch
                ? `Consistent is my baseline. You won’t have to guess where I stand.`
                : `Best possible answer you could have given.`),
            delta: 18,
          },
          {
            text:
              pPack?.beat3ChoiceB ||
              `Let’s see how our chemistry feels across a real table before writing the memoir.`,
            reply: pPack?.beat3ReplyB || `Haha fair call, one great dinner at a time.`,
            delta: 14,
          },
          {
            text:
              pPack?.beat3Vip ||
              (isHimMatch
                ? `💎 Good to hear. I’m way past casual games, so honesty goes a long way with me.`
                : `💎 Unhurried pace respected, earning your trust slowly is half the fun.`),
            reply:
              pPack?.beat3VipReply ||
              (isHimMatch
                ? `Loud and clear, wouldn’t want it any other way.`
                : `Okay, you definitely know what you’re doing.`),
            delta: 24,
            cost: 1,
            badge: 'Real Talk',
          },
        ],
      },
      {
        beatNumber: 4,
        incomingMessages: [
          pPack?.beat4Incoming ||
            `Stepped outside for five minutes of fresh air before my afternoon wraps.`,
        ],
        photoDrop: {
          id: `photo-${profile.id}-candid`,
          previewCaption: `Photo from ${profile.name}`,
          imageUrl: photos[5],
          unlockCost: 1,
          exifClue: `📍 Live Photo · Taken 6 min ago · Natural camera roll, zero filters.`,
          secretNote:
            pPack?.beat4PhotoNote ||
            (isHimMatch
              ? `Quick coffee breather before my last call. Counting down to Friday.`
              : `Finally off work calls for five minutes. How is your afternoon going?`),
        },
        choices: [
          {
            text:
              pPack?.beat4ChoiceA ||
              `Okay, that golden-hour lighting is doing very persuasive work.`,
            reply: pPack?.beat4ReplyA || `Wait until Friday night, even better in person.`,
            delta: 16,
          },
          {
            text: pPack?.beat4ChoiceB || `Looking sharp, hope your afternoon wraps smoothly.`,
            reply:
              pPack?.beat4ReplyB || `Just wrapped the hardest part, smooth sailing toward Friday.`,
            delta: 13,
          },
          {
            text:
              pPack?.beat4Vip ||
              `💎 Unfair distraction mid-afternoon, ${profile.name}, save that smile for across the table.`,
            reply: pPack?.beat4VipReply || `Saved exclusively for Friday at eight.`,
            delta: 23,
            cost: 1,
            badge: 'Spark Boost',
          },
        ],
      },
      {
        beatNumber: 5,
        incomingMessages: [
          pPack?.beat5Incoming ||
            (isHimMatch
              ? `Reservation is locked in under ${profile.name}. Anything I should know so Friday feels completely effortless for you?`
              : `Friday is looking clear on my calendar, do you actually keep your phone off the table at dinner?`),
        ],
        choices: [
          {
            text:
              pPack?.beat5ChoiceA ||
              (isHimMatch
                ? `Just show up on time, smell great, and don’t check sports scores mid-sentence.`
                : `Silent mode from the moment you sit down until I walk you to your car.`),
            reply:
              pPack?.beat5ReplyA ||
              (isHimMatch
                ? `Phone stays on Do Not Disturb in my jacket pocket all night.`
                : `Rare breed. Now I’m genuinely looking forward to Friday.`),
            delta: 17,
          },
          {
            text:
              pPack?.beat5ChoiceB ||
              (isHimMatch
                ? `Quiet booth away from the kitchen door and we’re set.`
                : `Always, real conversation beats scrolling every time.`),
            reply:
              pPack?.beat5ReplyB ||
              (isHimMatch
                ? `Already requested the corner banquette when I called.`
                : `Good instinct.`),
            delta: 15,
          },
          {
            text:
              pPack?.beat5Vip ||
              (isHimMatch
                ? `💎 Just bring steady eye contact and zero rehearsed lines. I spot fake bravado in ten seconds.`
                : `💎 Phone stays buried, car door handled, and zero rushing the evening.`),
            reply:
              pPack?.beat5VipReply ||
              (isHimMatch
                ? `Real conversation only, wouldn’t insult your intelligence with a script.`
                : `Smooth from start to finish.`),
            delta: 24,
            cost: 1,
            badge: '5-Star Chemistry',
          },
        ],
      },
      {
        beatNumber: 6,
        incomingMessages: [
          profile.id === 'rory'
            ? `Friday is sorted on my end x Only if you fancy getting off this app, let me text you from my proper number.`
            : isHimMatch
              ? profile.age >= 30
                ? `Friday at 7:45 is handled. Share your number when you are ready and I will send the confirmation directly.`
                : `Everything is set for Friday night. Whenever you’re ready to get off Prowl, I’d love to text you directly.`
              : profile.age >= 55
                ? `You passed my filter cleanly. Take my personal number, and do not waste it on small talk.`
                : profile.age >= 40
                  ? `You survived my app filter. Take my cell so we can lock Friday cleanly on iMessage.`
                  : `Okay, zero notes so far. Take my real number so we can coordinate Friday off Prowl ✨`,
        ],
        choices: [
          {
            text: isHimMatch
              ? `You kept my interest, here’s my real number for Friday.`
              : `Saved, texting you on iMessage right now so you have mine.`,
            reply:
              profile.id === 'rory'
                ? `Saved with a star x Check your iMessage, love.`
                : isHimMatch
                  ? profile.age <= 26
                    ? `Saved properly. Moving over to iMessage now.`
                    : `Saved. Texting you from my personal line right now.`
                  : profile.age >= 55
                    ? `Received. Watch your messages.`
                    : profile.age >= 40
                      ? `Sounds good. Moving off this app now.`
                      : `Got it! Switching over to blue bubbles now ✨`,
            delta: 20,
          },
          {
            text: isHimMatch
              ? `Sending my cell, text me Friday afternoon to confirm.`
              : `Thank you, sending a quick hello on iMessage now.`,
            reply:
              profile.id === 'rory'
                ? `Friday noon confirmation is locked in x`
                : !isHimMatch && profile.age >= 40
                  ? `Sounds good. Speak soon.`
                  : `Message sent, see you on real texts.`,
            delta: 18,
          },
          {
            text: isHimMatch
              ? `💎 You earned my personal number, ${profile.name}, don’t make me regret moving off Prowl.`
              : `💎 Personal number saved. I’ll text you the exact pin on iMessage right now.`,
            reply:
              profile.id === 'rory'
                ? `Properly honoured xx Check your phone right now.`
                : !isHimMatch && profile.age >= 55
                  ? `Punctual already. Check your phone.`
                  : !isHimMatch && profile.age >= 40
                    ? `Good instinct. Watch your iMessage.`
                    : `Best upgrade of my week, check your iMessage.`,
            delta: 26,
            cost: 1,
            badge: 'Number Graduated',
          },
        ],
      },
    ],
    imessage: buildImessageFollowup(profile, photos[5], pPack),
    spicySuggestions:
      pPack?.spicy ||
      (isHimMatch
        ? [
            `Wear that dark linen shirt with rolled sleeves Friday. I’m not subtle when I like a view.`,
            `Keep making Friday this effortless and dessert might move back to Sunset Hills.`,
            `Tell me one thing you’ve been wanting to do since we matched.`,
          ]
        : [
            `Fair warning: if you wear silk on Friday it’s going to test my composure.`,
            `Save the last glass of Pinot for a quiet nightcap after the restaurant closes.`,
            `What’s one thing most men are too timid to say across a candlelit table?`,
          ]),
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

interface ImessageCustomSubset {
  imsg1Incoming?: string;
  imsg1ReplyA?: string;
  imsg1ReplyB?: string;
  imsg2Incoming?: string;
  imsg2ChoiceA?: string;
  imsg2ReplyA?: string;
  imsg3Incoming?: string;
  imsg3ReplyA?: string;
  imsg4Incoming?: string;
  imsg4PhotoNote?: string;
  imsg5Incoming?: string;
  imsg6Incoming?: string;
}

function buildImessageFollowup(
  profile: V35CastProfile,
  candidUrl: string,
  custom?: ImessageCustomSubset,
): ChatBeat[] {
  const name = profile.name;
  const isHimMatch = profile.role === 'him';
  const isUkCub = profile.id === 'julian' || profile.id === 'rory';
  const isGenZTrap = profile.id === 'connor' || profile.id === 'devon';
  const isUnderstatedMid20sCub = profile.id === 'jin' || profile.id === 'soren';
  const isComposed30sZaddy = isHimMatch && profile.age >= 30;
  const isIconHer = !isHimMatch && profile.age >= 55;
  const isGenXHer = !isHimMatch && profile.age >= 40 && profile.age < 55;

  const julianCustom: ImessageCustomSubset | undefined =
    profile.id === 'julian'
      ? {
          imsg1Incoming:
            'Properly off that noisy app now x Saved your number with a star next to my rare-books notes.',
          imsg1ReplyA: 'Promise zero fellowship essays in your texts before noon x',
          imsg1ReplyB: 'Pouring a glass of claret and cataloguing a 1924 Colette edition x',
          imsg2Incoming:
            'Quick check before tomorrow night: fancy meeting right inside by the mahogany bar at half seven, or shall I collect you? x',
          imsg2ChoiceA: 'Meet me by the mahogany bar five minutes early, classic London standard.',
          imsg2ReplyA: 'Proper standard. Two Sancerres will be breathing at 7:25 sharp x',
          imsg3Incoming:
            'My flatmate saw me ironing two white linen shirts on a Wednesday and asked if I was meeting royalty. Didn’t say no x',
          imsg3ReplyA: 'Smart flatmate, make sure those cuffs are crisp.',
          imsg4Incoming: 'Tweed blazer over rolled linen or classic dark navy jacket for tomorrow? x',
          imsg4PhotoNote: 'Hampstead vs. Los Angeles tie-breaker before dinner x',
          imsg5Incoming:
            'Afternoon check-in: table is all confirmed for tonight, weather looks lovely, genuinely excited to see you xx',
          imsg6Incoming:
            'Just arrived and claimed our quiet alcove table away from the bar crowd, take your time walking in x',
        }
      : undefined;

  const pack = custom ?? julianCustom;

  const beat1Incoming =
    pack?.imsg1Incoming ||
    (isGenZTrap
      ? `yo blue bubbles unlocked 👀 saved ur contact, what are u up to rn`
      : profile.id === 'graham'
        ? `Saved under my Tokyo Equities contact card! Keep texts strictly between 9 AM and 6:30 PM so notifications stay tidy.`
        : isUkCub
          ? `Properly off that noisy app now x Saved your number with a star.`
          : isUnderstatedMid20sCub
            ? `Off the app at last. Saved your contact properly.`
            : isComposed30sZaddy
              ? `Good to have your direct line. Friday at 7:45 is confirmed on my calendar.`
              : isHimMatch
                ? `Got your number saved! Way easier texting you here than on Prowl.`
                : isIconHer
                  ? `Much better off the app. You have my actual line now, use it wisely.`
                  : isGenXHer
                    ? `Much cleaner off the app. You have my direct line now.`
                    : `Officially off Prowl ✨ Saved your number, much easier texting here.`);

  const beat1ReplyA =
    pack?.imsg1ReplyA ||
    (isGenZTrap
      ? `haha chill i text whenever vibes hit lol`
      : isUkCub
        ? `Promise not to blow up your phone during meetings x`
        : isHimMatch
          ? `Deal, I won’t blow up your phone while you’re working.`
          : isIconHer
            ? `Punctual and concise. Keep it up.`
            : isGenXHer
              ? `Sounds good. Punctuality goes a long way with me.`
              : `Punctual and zero rambling, green flag already 🍷`);

  const beat2Incoming =
    pack?.imsg2Incoming ||
    (isGenZTrap
      ? `quick q before friday tho... u cool driving or splitting the uber lol`
      : isUkCub
        ? `Quick check before Friday: want to meet me right inside at 7:40, or shall I pick you up? x`
        : isHimMatch
          ? `Quick check before Friday: want to meet there around 7:40, or would you rather I pick you up?`
          : isIconHer
            ? `One logistical question: do you arrive five minutes early, or make excuses about traffic?`
            : isGenXHer
              ? `Quick litmus test: are you an "arrive ten minutes early" adult or a last-second sprinter?`
              : `Honest check before Friday: ten minutes early at the bar, or sprinting through parking at 7:46?`);

  const beat5Incoming =
    pack?.imsg5Incoming ||
    (isGenZTrap
      ? `hey so friday is lowkey getting hectic on my end... still figuring tonight out lol`
      : isUkCub
        ? `Friday check-in: table is all set for 7:45 tonight, weather’s lovely, looking forward to seeing you xx`
        : isIconHer
          ? `Friday confirmation: we are set for 7:45 tonight. 👍`
          : isGenXHer
            ? `Sounds good for 7:45 tonight. Looking forward to it.`
            : `Hey! Just confirming we’re all set for 7:45 tonight. Can’t wait to see you.`);

  const beat6Incoming =
    pack?.imsg6Incoming ||
    (isGenZTrap
      ? `wait just pulled up outside where r u sitting 👀`
      : isUkCub
        ? `Just got here and grabbed us a great table near the back, take your time walking in x`
        : isIconHer
          ? `I’m at a quiet table near the bar with a cold martini. Come say hello.`
          : isGenXHer
            ? `Just sat down at our table near the patio. No rush parking.`
            : isUnderstatedMid20sCub || isComposed30sZaddy
              ? `Just got here and grabbed our table. Let me know what you want to drink if you’re two minutes out.`
              : `Just got here and grabbed our table! Text me when you pull up ✨`);

  return [
    {
      beatNumber: 1,
      incomingMessages: [beat1Incoming],
      choices: [
        {
          text: isHimMatch
            ? `Much cleaner in here, don’t abuse direct access during business hours 😉`
            : `Honored to make the real contact list, confirming Friday at 7:45 sharp.`,
          reply: beat1ReplyA,
          delta: 16,
        },
        {
          text: `So much easier off the app, how’s your night winding down?`,
          reply:
            pack?.imsg1ReplyB ||
            (isGenZTrap
              ? `just chillin on the couch scrolling tiktok lol wbu`
              : isUkCub
                ? `Pouring a proper glass of red with vinyl on low x Wish you were picking the next record.`
                : isIconHer
                  ? `Dry Gibson on the terrace and zero emails. Peaceful.`
                  : `Glass of red and vinyl spinning on low, wish you were here to pick the next record.`),
          delta: 15,
        },
        {
          text: `💎 Direct line looks good on you, ${name}, save your best banter for Friday’s first toast.`,
          reply: isGenZTrap
            ? `bet say less haha`
            : isUkCub
              ? `First toast is already sorted in my head xx`
              : isIconHer
                ? `Count on it. Bring your sharpest wit.`
                : `First toast is already rehearsed in my head.`,
          delta: 24,
          cost: 1,
          badge: 'Blue-Bubble Spark',
        },
      ],
    },
    {
      beatNumber: 2,
      incomingMessages: [beat2Incoming],
      choices: [
        {
          text:
            pack?.imsg2ChoiceA ||
            (isHimMatch
              ? `Meet me at the bar five minutes early with a drink already ordered, classic first-date rule.`
              : `Ten minutes early at the bar so you never walk into an empty table.`),
          reply:
            pack?.imsg2ReplyA ||
            (isGenZTrap
              ? `ok wait ordering ahead is kinda fancy i got u lol`
              : isUkCub
                ? `Proper rule. I’ll be by the mahogany bar at 7:40 sharp x`
                : isHimMatch
                  ? `Smart rule. I’ll be waiting by the mahogany bar at 7:40.`
                  : isIconHer || isGenXHer
                    ? `Sounds good. Exact right answer.`
                    : `Exact right answer.`),
          delta: 18,
        },
        {
          text: isHimMatch
            ? `Sending a car for Date #2 once you pass Date #1 inspection.`
            : `Early every time, evening traffic is never an excuse.`,
          reply: isGenZTrap
            ? `haha tough crowd ok bet`
            : isUkCub
              ? `Haha fair play, I’ll earn Date #2 car privileges tomorrow night x`
              : isHimMatch
                ? `Haha fair. I’ll earn Date #2 car privileges Friday.`
                : `Spoken like a grown adult.`,
          delta: 16,
        },
        {
          text: `💎 Be at the bar five minutes early, and stand up when I walk in.`,
          reply: isGenZTrap
            ? `noted lol standing up on cue`
            : isUkCub
              ? `Every single time, love. Non-negotiable xx`
              : `Every single time, without fail.`,
          delta: 24,
          cost: 1,
          badge: 'Classic Standard',
        },
      ],
    },
    {
      beatNumber: 3,
      incomingMessages: [
        pack?.imsg3Incoming ||
          (isGenZTrap
            ? `ngl walked past that lounge patio earlier and the lighting looked kinda fire`
            : isIconHer
              ? `Passed a quiet courtyard with proper candlelight and Chet Baker playing. Good omen for tomorrow.`
              : `Just passed a candlelit patio with string lights and good vinyl playing, made me think of Friday.`),
      ],
      choices: [
        {
          text: `Save that mood for us tomorrow night.`,
          reply:
            pack?.imsg3ReplyA ||
            (isGenZTrap
              ? `locked in fr`
              : isIconHer || isGenXHer
                ? `Already reserved.`
                : `Already counting down.`),
          delta: 15,
        },
        {
          text: `Okay, now tomorrow night officially has high expectations.`,
          reply: isGenZTrap
            ? `wait somebody in a silk blazer def gave me the side eye lol`
            : isIconHer
              ? `High standards are the only ones worth keeping.`
              : `Good, high expectations keep dinner interesting.`,
          delta: 16,
        },
        {
          text: `💎 Good scouting, make sure we get a quiet booth where we can actually hear each other.`,
          reply: isUkCub
            ? `Quiet alcove booth is sorted with the maitre d’ x`
            : `Quiet alcove corner is locked in with the host.`,
          delta: 23,
          cost: 1,
          badge: 'Insider Wink',
        },
      ],
    },
    {
      beatNumber: 4,
      incomingMessages: [
        pack?.imsg4Incoming ||
          (isGenZTrap
            ? `fit check before tmrw night 👀 lmk`
            : isIconHer
              ? `Brief preview before 7:45 tomorrow.`
              : `Quick wardrobe check before tomorrow night.`),
      ],
      photoDrop: {
        id: `photo-${name.toLowerCase()}-imessage`,
        previewCaption: `Photo from ${name}`,
        imageUrl: candidUrl,
        unlockCost: 1,
        exifClue: `📍 Live Photo · Sent just now on iMessage · Getting ready for dinner.`,
        secretNote:
          pack?.imsg4PhotoNote ||
          (isGenZTrap
            ? `honest fit check before tmrw lol thoughts?`
            : isUkCub
              ? `Quick check before tomorrow night, too dressed up or about right? x`
              : isHimMatch
                ? `Trying to decide between this jacket or keeping it more casual tomorrow night. Honest thoughts?`
                : `Thinking of wearing this tomorrow night. What do you think?`),
      },
      choices: [
        {
          text: `Approved, zero notes, don’t change a thing.`,
          reply: isGenZTrap
            ? `lets gooo appreciate u`
            : isIconHer
              ? `Naturally.`
              : `High praise coming from you.`,
          delta: 18,
        },
        {
          text: `Okay, now I actually have to put thought into what I’m wearing.`,
          reply: isUkCub
            ? `Impossible for you to miss, love x`
            : `Impossible for you to miss, I’m certain.`,
          delta: 16,
        },
        {
          text: `💎 Dangerous preview after 9 PM, you’re officially trouble.`,
          reply: isGenZTrap
            ? `haha u have no idea 👀`
            : `The very best kind of trouble.`,
          delta: 24,
          cost: 1,
          badge: 'After-Dark Spark',
        },
      ],
    },
    {
      beatNumber: 5,
      incomingMessages: [beat5Incoming],
      choices: [
        {
          text: isHimMatch
            ? `Love a man who confirms early without prompting, see you tonight!`
            : `Love a woman who locks in Friday with zero ambiguity, see you tonight!`,
          reply: isGenZTrap
            ? `yeah totally see u soon haha`
            : isUkCub
              ? `Wouldn’t dream of leaving Friday up in the air xx`
              : isIconHer || isGenXHer
                ? `See you at 7:45 sharp.`
                : `Wouldn’t dream of leaving Friday up in the air.`,
          delta: 18,
        },
        {
          text: `Confirmed on my end, wrapping my last call at five.`,
          reply: isUkCub
            ? `Smash your afternoon, first round’s waiting at 7:45 x`
            : isIconHer
              ? `Take your time. First round is at 7:45.`
              : `Smooth afternoon ahead, first round is waiting at 7:45.`,
          delta: 16,
        },
        {
          text: `💎 Afternoon confirmation sealed it, bring your best smile tonight.`,
          reply: isIconHer
            ? `Always. 7:45 sharp.`
            : `Counting the hours until 7:45.`,
          delta: 24,
          cost: 1,
          badge: 'Date Locked',
        },
      ],
    },
    {
      beatNumber: 6,
      incomingMessages: [beat6Incoming],
      choices: [
        {
          text: `Walking through the lounge curtains right now, stand up so I spot you.`,
          reply: isGenZTrap
            ? `yo waving from the booth rn`
            : isUkCub
              ? `Already standing, bloody hell you look stunning xx`
              : isIconHer
                ? `Right on time. Come sit beside me.`
                : `Already standing, wow, you look breathtaking.`,
          delta: 20,
        },
        {
          text: `Pulling up curbside now, two minutes out!`,
          reply: isIconHer || isGenXHer
            ? `Drinks just touched the coasters. Perfect timing.`
            : `Drinks are hitting the coasters right on cue.`,
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
      imessage: buildImessageFollowup(profile, photos[5]),
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
      m1: 'Yo!! Okay funny story before we meet. The app locked my birth year at 27 from an old account lol, I’m actually 21 turning 22 next spring.',
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
  const isGenZTrap = profile.id === 'connor' || profile.id === 'devon';
  const isBelAirTrap = profile.id === 'vanessa';
  return {
    tinder: [
      {
        beatNumber: 1,
        incomingMessages: [spec.m1],
        trapClueHint: 'Red Flag #1 surfaced right out of the gate.',
        choices: [
          {
            text: 'Hold on, repeat that part again slowly.',
            reply: isGenZTrap
              ? 'ngl i knew u would appreciate me keeping it 100 lol'
              : isBelAirTrap
                ? 'Darling, half of Bel Air has the exact same tax arrangement.'
                : 'Haha trust me, sitting right across from Table 9 is half the thrill!!',
            delta: 10,
          },
          {
            text: 'That sounds like a giant red banner waving in the wind.',
            reply: isGenZTrap
              ? 'nooo chill everyone on hinge does it haha'
              : isBelAirTrap
                ? 'Hardly a banner, sweetheart. Think of it as European discretion.'
                : 'Not a red flag at all, just high-drama Friday entertainment!!',
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
            reply: isGenZTrap
              ? 'ur lowkey overthinking the logistics lol just go w the flow'
              : isBelAirTrap
                ? 'Afternoon hotel lounges are civilized and quiet. Nothing wild about it.'
                : 'You are overthinking it! A great navy blazer solves everything!',
            delta: 10,
          },
          {
            text: 'Interesting strategy, what happens on Friday night?',
            reply: isGenZTrap
              ? 'uh yeah abt friday night...'
              : isBelAirTrap
                ? 'Friday evenings are strictly reserved for family charity dinners, darling.'
                : 'Friday at eight is when Richard’s golf foursome orders appetizers!',
            delta: 10,
          },
          {
            text: '💎 Let’s hear excuse number three before I call my bestie.',
            reply: isGenZTrap
              ? 'zero excuses bro wait i mean just vibes lol'
              : 'Zero excuses, strictly logistics.',
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
            reply: isGenZTrap
              ? 'cmon live a little haha'
              : isBelAirTrap
                ? 'A little cover story keeps everyone comfortable, darling.'
                : 'Think of the complimentary champagne once Table 9 sees us!!',
            delta: 10,
          },
          {
            text: 'My intuition meter is flashing bright crimson right now.',
            reply: isGenZTrap
              ? 'crimson is lowkey romantic tho 👀'
              : 'Crimson happens to flatter everyone in candlelight.',
            delta: 10,
          },
          {
            text: '💎 Screenshotting this masterclass in red flags for research.',
            reply: isGenZTrap
              ? 'wait dont screenshot lol chill'
              : 'Please do not put my business in a group chat.',
            delta: 14,
            cost: 1,
            badge: 'Receipt Saved',
          },
        ],
      },
      {
        beatNumber: 4,
        incomingMessages: [
          isGenZTrap
            ? 'anyway peep this pic so u stop grilling me lol'
            : 'Anyway, a quick snapshot before we overcomplicate a perfectly good week.',
        ],
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
            reply: isGenZTrap ? '1 out of 2 still counts lol' : 'One out of two isn’t bad.',
            delta: 10,
          },
          {
            text: 'Pretty photos don’t fix a chaotic Friday setup.',
            reply: isGenZTrap ? 'give it one drink trust' : 'Give it one drink and judge for yourself.',
            delta: 10,
          },
          {
            text: '💎 Almost distracting, almost.',
            reply: isGenZTrap ? 'almost is a win haha' : 'Almost counts in my book.',
            delta: 12,
            cost: 1,
            badge: 'Unfazed',
          },
        ],
      },
      {
        beatNumber: 5,
        incomingMessages: [
          isGenZTrap
            ? 'so r we still down or r u hitting block lol'
            : 'So are we still on, or are you reaching for that block button?',
        ],
        choices: [
          {
            text: 'Still deciding whether to cut you loose right here.',
            reply: isGenZTrap ? 'roll the dice on friday lol' : 'Take a gamble on Friday.',
            delta: 8,
          },
          {
            text: 'Testing what happens if we keep talking.',
            reply: isGenZTrap ? 'bold move i respect it' : 'Bold choice.',
            delta: 8,
          },
          {
            text: '💎 One last beat before the verdict drops.',
            reply: isGenZTrap ? 'fingers crossed ngl' : 'Fingers crossed.',
            delta: 10,
            cost: 1,
            badge: 'Final Beat',
          },
        ],
      },
      {
        beatNumber: 6,
        incomingMessages: [
          isGenZTrap
            ? 'last call lol moving this to imessage or ghosting me'
            : 'Last call: moving this to iMessage or cutting loose back to the deck?',
        ],
        choices: [
          {
            text: 'Fine, let’s watch this Friday trainwreck unfold.',
            reply: isGenZTrap ? 'bet texted u rn haha' : 'Locked in, don’t say I didn’t warn you.',
            delta: 8,
          },
          {
            text: 'Proceeding strictly for science.',
            reply: isGenZTrap ? 'for science lets gooo' : 'Science wins.',
            delta: 8,
          },
          {
            text: '💎 Walking in eyes wide open just to turn the tables.',
            reply: isGenZTrap ? 'see u friday 👀' : 'See you Friday.',
            delta: 12,
            cost: 1,
            badge: 'Chaos Route',
          },
        ],
      },
    ],
    imessage: buildImessageFollowup(profile, photos[4]),
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
      'Under the courtyard string lights, Rafael catches your hand with an easy grin as the brass band starts up: "Come on, dance one song with me before our wine gets here. Don’t worry, I’ve got you."',
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
          dialogue: `Outside under warm evening streetlights, ${profile.name}'s hand brushes yours. Rush straight home tonight, or let the slow burn build toward Date #2?`,
          choices: [
            {
              label: 'Savor a lingering goodnight kiss by the car and lock in Date #2 so the slow burn builds properly.',
              response: `${profile.name} exhales breathless against your cheek: "Smart move, now I’m going to think about you all week."`,
              nextExpression: 'blush',
              chemistryDelta: 25,
            },
            {
              label: 'Push hard to rush straight home on Night 1 before real trust is built.',
              response: `Hot spark in the moment, though rushing past ${profile.name}'s guard caps your chemistry below 5-Star!`,
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
                : `"Ten out of ten manners," ${profile.name} grins.`,
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
          `${profile.name}: Just deleted Prowl off my phone for good.`,
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
                label: '💎 Turn the Tables: Clink glasses with the ambushed ex/bartender, expose the Table 9 alibi, and walk out laughing!',
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

  // Cameo joyful 2-beat bespoke whirlwind romance
  const cameoScenesById: Record<
    string,
    {
      title: string;
      backdrop: string;
      beat1Dialogue: string;
      beat1Good: string;
      beat1GoodReply: string;
      beat1Bad: string;
      beat1BadReply: string;
      beat2Dialogue: string;
      beat2Good: string;
      beat2GoodReply: string;
      beat2Vip: string;
      beat2VipReply: string;
      leakLine: string;
    }
  > = {
    celeste: {
      title: 'Powder-Blue Convertible & Desert Gibsons with Celeste',
      backdrop: './images/scenes/palm-springs-resort.jpg',
      beat1Dialogue:
        'Outside the sculpture garden, a twenty-two-year-old valet assumes you are Celeste’s gallery assistant. Celeste doesn’t miss a beat, tossing you the keys to her vintage convertible: "Drive us to dinner, darling. Let him stare."',
      beat1Good: 'Catch the keys cleanly, open her passenger door first, and grin at the stunned valet.',
      beat1GoodReply: 'Celeste slides on her sunglasses with a delighted laugh as you pull onto Palm Canyon.',
      beat1Bad: 'Fumble the keys and over-explain to the valet that this is an actual date.',
      beat1BadReply: 'Celeste pats your knee lightly: "Never explain yourself to the parking stand, darling."',
      beat2Dialogue:
        'Over icy Gibsons with cocktail onions under the bougainvillea, Celeste leans closer: "Most men my age narrate their golf handicap for two hours. Tell me what actually makes you lose track of time."',
      beat2Good: 'Share a real obsession without trying to sound impressive, then ask what piece she’d never sell.',
      beat2GoodReply: '"Curious, unhurried, and zero ego," Celeste murmurs, clinking your glass.',
      beat2Vip: '💎 Hold her gaze: "Right now? Watching a desert icon break every rule in the room."',
      beat2VipReply: 'Celeste’s silver-screen composure melts into a slow, dangerous smile.',
      leakLine: 'Celeste: Drove the convertible like a natural and knew a proper Gibson. Keeping him.',
    },
    astrid: {
      title: 'Cold Pacific Plunge & Cedar Sauna Test with Astrid',
      backdrop: './images/scenes/hotel-pool-sauna.jpg',
      beat1Dialogue:
        'Waves crash below Astrid’s Malibu deck at dusk as she hands you a linen towel: "Three minutes in fifty-six-degree surf before the cedar sauna, and zero dramatic speeches. Ready?"',
      beat1Good: 'Walk straight into the Pacific up to your shoulders, breathe steady, and smile at her stopwatch.',
      beat1GoodReply: '"Not a single complaint," Astrid beams, ice-blue eyes sparkling. "You just beat half of Stockholm."',
      beat1Bad: 'Dip one toe in, yelp loudly, and give a ten-minute monologue about hypothermia.',
      beat1BadReply: 'Astrid laughs into her towel and turns up the sauna stove for mercy.',
      beat2Dialogue:
        'Inside the warm cedar sauna, Astrid leans back comfortably: "People think Nordic quiet means coldness. Really I just save my energy for things that matter."',
      beat2Good: 'Let ten seconds of warm, unhurried eye contact speak before pouring water on the stones.',
      beat2GoodReply: 'Astrid exhales happily, resting her hand over yours on the cedar bench.',
      beat2Vip: '💎 Brush a drop of ocean salt from her jaw: "Zero small talk needed. Dinner at my place next."',
      beat2VipReply: '"Best sentence I have heard all month," Astrid whispers.',
      leakLine: 'Astrid: Survived the Pacific plunge without whining once. My nervous system approves.',
    },
    camila: {
      title: 'Monday Night Off & Kitchen Cumbia with Camila',
      backdrop: './images/scenes/sunday-kitchen-sanctuary.jpg',
      beat1Dialogue:
        'Camila kicks off her clogs at your kitchen island on her rare Monday off, eyeing your cutting board: "Do not panic, I solemnly swear not to critique your knife grip unless a finger is in danger."',
      beat1Good: 'Pour her a generous Rioja on the guest side of the counter and slide warm garlic bread across.',
      beat1GoodReply: 'Camila closes her eyes over the first bite: "Heaven. Nobody ever lets the chef just sit and be fed."',
      beat1Bad: 'Apologize twelve times for the plating and ask her to salt the pan for you.',
      beat1BadReply: 'Camila gently confiscates the wooden spoon with an affectionate eye-roll.',
      beat2Dialogue:
        'When an old cumbia track comes through the speaker, Camila sets down her glass with a mischievous glint: "Dishes can wait ten minutes. Show me if your kitchen footwork matches the pasta."',
      beat2Good: 'Spin her barefoot between the island and the stove until you’re both laughing.',
      beat2GoodReply: 'Camila’s arms loop around your neck: "Best Monday off in two years."',
      beat2Vip: '💎 Pull her close by the waist: "Chef is officially off the clock until Tuesday noon."',
      beat2VipReply: 'Camila blushes warm under the pendant light: "Don’t threaten me with peace and good company."',
      leakLine: 'Camila: Cooked for ME on a Monday and spun me around the kitchen. Send help.',
    },
    vivienne: {
      title: 'Midnight 35mm Revival & Steak Frites with Vivienne',
      backdrop: './images/scenes/velvet-room-bar.jpg',
      beat1Dialogue:
        'Credits roll on a 1960s French thriller in row three as Vivienne slips on her silk scarf: "Alright, critic. Give me your honest verdict in one sentence before the Burgundy arrives."',
      beat1Good: 'Skip pretentious film-school jargon and defend why the heroine should have stolen the car earlier.',
      beat1GoodReply: 'Vivienne lets out a delighted French laugh, slipping her arm effortlessly through yours.',
      beat1Bad: 'Say it was "pretty cool for an old black-and-white movie from your era."',
      beat1BadReply: 'Vivienne stops on the sidewalk: "Careful, chéri, that taxi stand is ten feet away."',
      beat2Dialogue:
        'Across a midnight bistro banquette over steak frites, Vivienne studies you warmly: "Men my age bring résumés to dinner. You actually brought curiosity."',
      beat2Good: 'Toast her in crisp English, keep your phone buried, and ask about her favorite wild Cannes night.',
      beat2GoodReply: '"Magnifique," Vivienne smiles, leaning in across the candle.',
      beat2Vip: '💎 Clink coupes softly: "Paris or Beverly Hills next Friday, producer’s choice, my treat."',
      beat2VipReply: 'Vivienne’s eyes dance: "Boldness suits you remarkably well."',
      leakLine: 'Vivienne: Zero "for your age" slips and genuine wit past midnight. Très dangereux.',
    },
    rory: {
      title: 'After-Hours Botanical Terrace & Warm Crumble with Rory',
      backdrop: './images/scenes/canyon-sunrise-trail.jpg',
      beat1Dialogue:
        'Park ranger Rory unlocks the coastal overlook gate at dusk carrying a plaid blanket and a warm tin: "Full confession, I practiced not blushing in the truck mirror for ten minutes and failed inside four seconds."',
      beat1Good: 'Tease his pink ears warmly and open the thermos tin of homemade berry crumble together.',
      beat1GoodReply: 'Rory’s dimples appear in full force as night-blooming jasmine drifts up the bluff.',
      beat1Bad: 'Check Slack messages while he lays out the picnic blanket.',
      beat1BadReply: 'Rory waits patiently holding two spoons until you lock your screen.',
      beat2Dialogue:
        'As city lights flicker on below the ridge, Rory turns earnest: "Some blokes act cool by caring less. Truth is, taking a brilliant woman like you out makes me want to bring my best."',
      beat2Good: 'Reach for his hand across the blanket and tell him sincerity beats fake cool every night.',
      beat2GoodReply: '"Best night on this ridge by a country mile," Rory grins.',
      beat2Vip: '💎 Kiss his cheek so the British blush returns: "Save next Friday for dinner at my place, ranger."',
      beat2VipReply: 'Rory looks ready to float off the cliff in pure delight.',
      leakLine: 'Rory: Baked berry crumble from scratch and she actually laughed at my terrible nerves!',
    },
    jin: {
      title: 'Twelve-Seat Little Tokyo Vinyl Bar with Jin',
      backdrop: V35_SCENE_BACKDROPS['left-bank-books'],
      beat1Dialogue:
        'Inside a hidden twelve-seat listening bar, Jin zips both his phone and 35mm Leica into his canvas bag before sitting: "I look through viewfinders all week. Tonight I want zero screens between us."',
      beat1Good: 'Drop your phone into your clutch on silent and let him order the smoked uni toast and whisky highballs.',
      beat1GoodReply: 'Jin’s quiet grin says everything as warm analog horns fill the booth.',
      beat1Bad: 'Turn on your camera flash to film a 360-degree video of the tiny silent bar.',
      beat1BadReply: 'The bartender and Jin both wince softly at the stadium glare.',
      beat2Dialogue:
        'Over the second vinyl side, Jin traces the rim of his glass: "Most dates rush to fill every two-second pause. Being able to breathe beside you feels rare."',
      beat2Good: 'Match his unhurried cadence and trade favorite late-night neighborhoods.',
      beat2GoodReply: 'Jin’s knee brushes yours under the hinoki counter with unmistakable warmth.',
      beat2Vip: '💎 Whisper low under the record: "Shoot one roll of film tomorrow morning if you earn coffee."',
      beat2VipReply: 'Jin’s dark eyes catch the amber bar light: "Count on it."',
      leakLine: 'Jin: Phones stayed buried for three straight hours. Pure Wong Kar-wai chemistry.',
    },
    liam: {
      title: 'Ojai Olive-Grove Firepit & Peach Cobbler with Liam',
      backdrop: './images/scenes/sunday-kitchen-sanctuary.jpg',
      beat1Dialogue:
        'Liam steps down from his pickup in a clean wool coat, opens your door before you touch the handle, and laughs softly: "Raised three timber roof beams today, and somehow this had my pulse higher."',
      beat1Good: 'Brush a tiny fleck of cedar sawdust off his lapel and tell him the wool coat wins.',
      beat1GoodReply: 'Liam’s whole face warms into a steady, unhurried smile.',
      beat1Bad: 'Complain that Ojai doesn’t have valet parking ropes.',
      beat1BadReply: 'Liam chuckles good-naturedly and offers his arm down the gravel path.',
      beat2Dialogue:
        'By the oak firepit with cast-iron peach cobbler cooling beside two bourbons, Liam looks straight at you: "I build things meant to last fifty winters. I date the exact same way."',
      beat2Good: 'Clink glasses by the firelight and welcome steady, drama-free grown-man follow-through.',
      beat2GoodReply: 'Liam wraps a warm wool blanket around your shoulders and kisses your temple.',
      beat2Vip: '💎 Lean against his shoulder under the stars: "Good. Show me that sunrise cedar canoe tomorrow."',
      beat2VipReply: '"Paddles are already in the truck," Liam murmurs against your hair.',
      leakLine: 'Liam: She didn’t mind a speck of cedar sawdust on my cuff. Done shopping around.',
    },
  };

  const cameoPack = cameoScenesById[profile.id];
  return [
    {
      dateNumber: 1,
      title: cameoPack ? cameoPack.title : `Golden-Hour Date with ${profile.name}`,
      venueBackdrop: cameoPack
        ? cameoPack.backdrop
        : V35_SCENE_BACKDROPS[profile.primaryWildVenueId || 'cougarmarket'] ||
          V35_SCENE_BACKDROPS['velvet-room'],
      beats: cameoPack
        ? [
            {
              speakerExpression: 'smirk',
              dialogue: cameoPack.beat1Dialogue,
              choices: [
                {
                  label: cameoPack.beat1Good,
                  response: cameoPack.beat1GoodReply,
                  nextExpression: 'laugh',
                  chemistryDelta: 22,
                },
                {
                  label: cameoPack.beat1Bad,
                  response: cameoPack.beat1BadReply,
                  nextExpression: 'icked',
                  chemistryDelta: -8,
                },
              ],
            },
            {
              speakerExpression: 'blush',
              dialogue: cameoPack.beat2Dialogue,
              choices: [
                {
                  label: cameoPack.beat2Good,
                  response: cameoPack.beat2GoodReply,
                  nextExpression: 'laugh',
                  chemistryDelta: 24,
                },
                {
                  label: cameoPack.beat2Vip,
                  response: cameoPack.beat2VipReply,
                  nextExpression: 'blush',
                  chemistryDelta: 30,
                  cost: 1,
                },
              ],
            },
          ]
        : [
            {
              speakerExpression: 'laugh',
              dialogue: `${profile.name} raises a glass across the candlelit corner: "Zero small talk tonight. Tell me the best trouble you got into this week."`,
              choices: [
                {
                  label: 'Lean all the way into the banter and toast to unexpected chemistry.',
                  response: `${profile.name}'s smile lights up the whole terrace: "Best spontaneous Friday all year."`,
                  nextExpression: 'blush',
                  chemistryDelta: 26,
                },
                {
                  label: '💎 Extend the night with a moonlight walk and trade favorite records.',
                  response: `A 5-Star cameo memory sealed into your Cougars & Cubs Dateodex!`,
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
          cameoPack
            ? cameoPack.leakLine
            : `${profile.name}: Still smiling from tonight, tell Sunset Hills they have competition.`,
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
