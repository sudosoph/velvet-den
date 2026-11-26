import { V35_SCENE_BACKDROPS } from './v35AssetManifest';

export interface WildVenueSpot {
  id: string;
  number: number;
  name: string;
  subtitle: string;
  emoji: string;
  backdropUrl: string;
  primaryHerLeadId: string;
  primaryHimLeadId: string;
  secondaryCameoLeadId: string;
  sceneSetupHer: string;
  sceneSetupHim: string;
  choicesHer: {
    label: string;
    outcomeText: string;
    unlocksChatWithId?: string;
    chemistryBonus: number;
    isMemeFail?: boolean;
    conspiracyClueId?: string;
  }[];
  choicesHim: {
    label: string;
    outcomeText: string;
    unlocksChatWithId?: string;
    chemistryBonus: number;
    isMemeFail?: boolean;
    conspiracyClueId?: string;
  }[];
  cameoBeat: {
    speakerId: string;
    line: string;
    boostText: string;
  };
}

export const V35_WILD_VENUES: WildVenueSpot[] = [
  {
    id: 'velvet-room',
    number: 1,
    name: 'The Velvet Room',
    subtitle: 'Downtown Hotel Mahogany Martini & Piano Bar • 6:15 PM',
    emoji: '🍸',
    backdropUrl: V35_SCENE_BACKDROPS['velvet-room'],
    primaryHerLeadId: 'graham',
    primaryHimLeadId: 'claire',
    secondaryCameoLeadId: 'miles',
    sceneSetupHer:
      'Golden dusk filters across the mahogany bar. Two stools down, sun-kissed blonde finance VP Graham raises his coupe—though a faint pale tan line circles his left ring finger and he keeps checking the clock before 6:45 PM.',
    sceneSetupHim:
      'At the corner of the mahogany bar, M&A partner Claire sets her phone face-down beside a chilled Gibson martini, savoring twenty quiet minutes after closing a coastal acquisition.',
    choicesHer: [
      {
        label:
          'Trade dry banter with Graham and grab his card so you can investigate that 6:45 PM curfew in text.',
        outcomeText:
          'Graham beams, slides you his card, and rushes out at 6:44 PM muttering about "Table 9 client calls." Thread unlocked—keep your eyes open!',
        unlocksChatWithId: 'graham',
        chemistryBonus: 10,
        conspiracyClueId: 'clue-velvet-ring',
      },
      {
        label:
          'Clock the pale ring-tan line immediately, toast the bartender instead, and pocket a Table 9 matchbook clue.',
        outcomeText:
          'The bartender grins: "Smart eye—three regulars use the 6:45 Table 9 alibi every Thursday." +Discernment clue logged!',
        chemistryBonus: 15,
        conspiracyClueId: 'clue-velvet-ring',
      },
    ],
    choicesHim: [
      {
        label:
          'Respect her quiet beat, make one dry observation about the pianist’s Sade cover, and slide your number on a cocktail napkin with zero hovering.',
        outcomeText:
          'Claire arches one eyebrow, smiles over her martini rim, and texts you "Bold handwriting. Don’t waste it." before you reach the lobby.',
        unlocksChatWithId: 'claire',
        chemistryBonus: 18,
      },
      {
        label:
          'Interrupt her immediately to explain bond yields you heard on a morning commute show.',
        outcomeText:
          'Claire takes one slow sip: "Adorable—I structured that fund." Scene fumbled, try a calmer opener!',
        chemistryBonus: -10,
        isMemeFail: true,
      },
    ],
    cameoBeat: {
      speakerId: 'miles',
      line: 'Miles steps off the patio terrace he renovated last spring, clinking his rocks glass gently against yours: "Saved you the best booth light in downtown."',
      boostText: '+15% Chemistry Cameo with Miles!',
    },
  },
  {
    id: 'hawthorne-campus',
    number: 2,
    name: 'Hawthorne University',
    subtitle: 'Comparative Literature Seminar & Post-Grades Faculty Reception',
    emoji: '🎓',
    backdropUrl: V35_SCENE_BACKDROPS['hawthorne-campus'],
    primaryHerLeadId: 'julian',
    primaryHimLeadId: 'elena',
    secondaryCameoLeadId: 'julian',
    sceneSetupHer:
      'Visiting Hampstead fellow Julian finishes his public guest lecture on Mediterranean villas, stepping off the lectern in rolled linen sleeves with two coffees in hand.',
    sceneSetupHim:
      'Visiting public auditor series: honey-blonde Chair Prof. Elena collects the final seminar papers. Campus policy is crystal clear—zero social drinks until final grades post Friday at 5 PM.',
    choicesHer: [
      {
        label:
          'Challenge Julian’s thesis on Amalfi courtyards with a razor-sharp smile at the reception table.',
        outcomeText:
          'Julian lights up: "Properly ruthless critique—fancy continuing this over a drink at half seven? xx"',
        unlocksChatWithId: 'julian',
        chemistryBonus: 16,
      },
      {
        label:
          'Ask him if he knows where the undergrad parking office is and wander off.',
        outcomeText:
          'Polite directions given, zero romantic spark.',
        chemistryBonus: 0,
        isMemeFail: true,
      },
    ],
    choicesHim: [
      {
        label:
          'Honor the Post-Grades Rule: wait until Friday 5:15 PM after grades officially post, then invite Elena for celebratory espresso at the faculty gallery.',
        outcomeText:
          'Elena’s eyes crinkle warmly: "Patience AND ethics. My calendar just opened up—here is my personal cell."',
        unlocksChatWithId: 'elena',
        chemistryBonus: 20,
      },
      {
        label:
          'Try to slip your number inside your seminar notebook on Wednesday BEFORE final grades post.',
        outcomeText:
          'Elena slides it right back across the walnut desk: "Flattering, truly—come find me ONLY once grades are sealed."',
        chemistryBonus: -12,
        isMemeFail: true,
      },
    ],
    cameoBeat: {
      speakerId: 'julian',
      line: 'Julian spots you beneath the autumn quad elms holding two rare Penguin paperbacks: "Saved you the annotated Colette copy—don’t tell Elena I raided the stacks x"',
      boostText: '+15% Chemistry Cameo with Julian!',
    },
  },
  {
    id: 'terminal-b-airport',
    number: 3,
    name: 'Terminal B Arrivals & Lounge',
    subtitle: 'Golden-Hour Curbside Pickup & Executive Lounge Terrace',
    emoji: '✈️',
    backdropUrl: V35_SCENE_BACKDROPS['terminal-b-airport'],
    primaryHerLeadId: 'miles',
    primaryHimLeadId: 'celeste',
    secondaryCameoLeadId: 'claire',
    sceneSetupHer:
      'You walk out of Terminal B after a delayed flight. Dirty-blonde architect Miles—whom Jade introduced briefly last month—tracked your tail number, stands curbside in a charcoal coat holding your exact hot cortado, effortlessly takes both of your heavy bags in one hand, and nods toward the waiting black car with an 8:15 corner booth already confirmed.',
    sceneSetupHim:
      'Inside the departure lounge terrace, silver-haired Palm Springs gallery icon Celeste looks up from an exhibition catalog as gate agents announce a forty-minute delay.',
    choicesHer: [
      {
        label:
          'Hand over both bags with a slow smile: "You tracked the flight AND booked the 8:15 table? Dangerous precedent, Miles."',
        outcomeText:
          'Miles opens the passenger door smoothly: "Turn your brain off—you’ve been running point all week. I’ve got tonight." Direct iMessage unlocked!',
        unlocksChatWithId: 'miles',
        chemistryBonus: 22,
      },
      {
        label:
          'Insist on wrestling your own suitcase onto the crowded shuttle bus in the rain.',
        outcomeText:
          'Jade texts two minutes later: "WHY DID YOU TURN DOWN CURBSIDE ZADDY SERVICE?!"',
        chemistryBonus: -5,
        isMemeFail: true,
      },
    ],
    choicesHim: [
      {
        label:
          'Flag the lounge server for two chilled Gibsons and ask Celeste which desert sculptor made the cover of her catalog.',
        outcomeText:
          'Celeste smiles radiantly: "An observant traveler who doesn’t stare at his laptop. Save my number for Palm Springs."',
        unlocksChatWithId: 'celeste',
        chemistryBonus: 18,
      },
      {
        label:
          'Take a loud speakerphone call right next to her lounge chair.',
        outcomeText:
          'Celeste lowers her sunglasses with devastating silver-screen poise and moves to the quiet terrace.',
        chemistryBonus: -12,
        isMemeFail: true,
      },
    ],
    cameoBeat: {
      speakerId: 'claire',
      line: 'Claire breezes out of PreCheck in a silk trench, smiling as she spots you: "Upgrade cleared—sit next to me before someone dull takes 2B."',
      boostText: '+15% Chemistry Cameo with Claire!',
    },
  },
  {
    id: 'havana-salsa',
    number: 4,
    name: 'Havana & Vine Studio',
    subtitle: 'Open-Air Salsa Rotation & Wood-Fired Culinary Night',
    emoji: '💃',
    backdropUrl: V35_SCENE_BACKDROPS['havana-salsa'],
    primaryHerLeadId: 'rafael',
    primaryHimLeadId: 'sienna',
    secondaryCameoLeadId: 'sienna',
    sceneSetupHer:
      'String lights sway above terracotta tile as partners rotate on the three-minute bell. Clean-shaven Brazilian furniture maker Rafael steps in front of you in rolled black silk sleeves, offering a warm, steady hand.',
    sceneSetupHim:
      'At the adjoining culinary island, sunlit designer Sienna laughs as her partner struggles to julienne basil while salsa brass drifts in from the courtyard.',
    choicesHer: [
      {
        label:
          'Match Rafael’s frame on the cross-body turn and tease him for making a complex spin feel effortless.',
        outcomeText:
          'Rafael grins, steady hand warm at your waist: "Stay for one espresso after class—I want to hear your laugh without the trumpet section." Direct iMessage unlocked!',
        unlocksChatWithId: 'rafael',
        chemistryBonus: 20,
      },
      {
        label:
          'Spend the whole song staring down at your shoes apologizing twenty times.',
        outcomeText:
          'The rotation bell rings just as you look up—try stepping in with confidence!',
        chemistryBonus: 2,
      },
    ],
    choicesHim: [
      {
        label:
          'Slide smoothly into the station rotation, dice the shallots cleanly in thirty seconds, and spin Sienna once when the chorus hits.',
        outcomeText:
          'Sienna laughs breathless against your shoulder: "Knife skills AND rhythm? Put your number in my phone right now."',
        unlocksChatWithId: 'sienna',
        chemistryBonus: 18,
      },
      {
        label:
          'Hover awkwardly by the wall drinking punch without joining a single rotation.',
        outcomeText:
          'Wallflower night—you came to a social class, jump in!',
        chemistryBonus: -6,
        isMemeFail: true,
      },
    ],
    cameoBeat: {
      speakerId: 'sienna',
      line: 'Sienna waves from the courtyard bar holding two lime aguas frescas: "Jade told me you might drop in—save me the next bachata!"',
      boostText: '+15% Chemistry Cameo with Sienna!',
    },
  },
  {
    id: 'palisades-racquet',
    number: 5,
    name: 'Palisades Racquet & Pickleball',
    subtitle: 'Golden-Hour Clay Courts & Cabana Spritz Terrace',
    emoji: '🎾',
    backdropUrl: V35_SCENE_BACKDROPS['palisades-racquet'],
    primaryHerLeadId: 'soren',
    primaryHimLeadId: 'brooke',
    secondaryCameoLeadId: 'soren',
    sceneSetupHer:
      'Court 3 needs a fourth for mixed doubles at sunset. Platinum-blonde Scandinavian architect Søren twirls his racquet on the baseline, ice-blue eyes glinting with quiet amusement.',
    sceneSetupHim:
      'Golden-blonde socialite Brooke waves you over to sub in on Court 1—though you notice her glancing repeatedly toward Court 4 where her silver-haired ex-husband is playing.',
    choicesHer: [
      {
        label:
          'Sub in fearless at the net, put away a clean cross-court volley, and accept Søren’s post-match tonic.',
        outcomeText:
          'Søren’s cool Nordic composure cracks into a delighted grin: "Deadly backhand. Thursday dinner—my treat, no excuses."',
        unlocksChatWithId: 'soren',
        chemistryBonus: 20,
      },
      {
        label:
          'Pretend you pulled a hamstring watching from the cabana.',
        outcomeText:
          'Søren nods politely and finishes the set—fortune favors stepping onto the court!',
        chemistryBonus: 0,
      },
    ],
    choicesHim: [
      {
        label:
          'Play the set with Brooke and accept her cabana spritz—while clocking why she seated you directly in her ex’s line of sight.',
        outcomeText:
          'Brooke drops her number into your phone and whispers about "booking Table 9 Friday." Thread unlocked—watch for ex-baiting tells!',
        unlocksChatWithId: 'brooke',
        chemistryBonus: 12,
        conspiracyClueId: 'clue-brooke-table9',
      },
      {
        label:
          'Smash an overhead lob straight into the champagne cart.',
        outcomeText:
          'Spectacular chaos on the terrace—club pro blows the whistle!',
        chemistryBonus: -8,
        isMemeFail: true,
      },
    ],
    cameoBeat: {
      speakerId: 'soren',
      line: 'Søren tosses you a chilled towel courtside: "Brooke’s ex just double-faulted twice watching her—don’t get drafted into the Table 9 circus."',
      boostText: '+15% Chemistry Cameo with Søren!',
    },
  },
  {
    id: 'st-jude-coffee',
    number: 6,
    name: 'St. Jude 6:45 AM Coffee Bay',
    subtitle: 'Sunrise Hospital Courtyard Espresso Cart',
    emoji: '🏥',
    backdropUrl: V35_SCENE_BACKDROPS['st-jude-coffee'],
    primaryHerLeadId: 'marcus',
    primaryHimLeadId: 'priya',
    secondaryCameoLeadId: 'marcus',
    sceneSetupHer:
      'Morning light warms the courtyard bricks as 6\'1" paramedic Marcus steps off shift, rolling his shoulders and paying quietly for the nurse behind him before spotting you at the espresso window.',
    sceneSetupHim:
      '5\'3" trauma RN Priya steps into the 6:45 AM sunshine in navy scrubs and a leather jacket, deliberately mispronouncing your name on your coffee cup sleeve just to see your comeback.',
    choicesHer: [
      {
        label:
          'Tease Marcus about hoarding the last almond croissant and split it with him on the sunlit bench.',
        outcomeText:
          'Marcus flashes a warm, unhurried smile: "Best end to a twelve-hour shift all month. Let me take you out properly once I’ve slept."',
        unlocksChatWithId: 'marcus',
        chemistryBonus: 18,
      },
      {
        label:
          'Ask him to diagnose a weird rash right next to the pastry case.',
        outcomeText:
          'Marcus winces gently: "Off the clock, I promise." Keep medical triage out of meet-cutes!',
        chemistryBonus: -8,
        isMemeFail: true,
      },
    ],
    choicesHim: [
      {
        label:
          'Match Priya’s dry tease without missing a beat and offer to bring post-shift street tacos Friday morning so she makes zero decisions.',
        outcomeText:
          'Priya grins over her iced latte: "Quick wit AND zero off-duty mental load? Text me before noon."',
        unlocksChatWithId: 'priya',
        chemistryBonus: 20,
      },
      {
        label:
          'Correct the pronunciation stiffly three times.',
        outcomeText:
          'Priya pats your arm: "Relax, rookie, I was flirting."',
        chemistryBonus: -6,
        isMemeFail: true,
      },
    ],
    cameoBeat: {
      speakerId: 'marcus',
      line: 'Marcus walks past with two cortados: "Priya only teases people she actually likes—trust me, I’ve worked trauma bay with her for three years."',
      boostText: '+15% Chemistry Cameo with Marcus!',
    },
  },
  {
    id: 'left-bank-books',
    number: 7,
    name: 'Left Bank Books & Gallery',
    subtitle: 'First-Friday Prosecco & Fiction Stacks',
    emoji: '📚',
    backdropUrl: V35_SCENE_BACKDROPS['left-bank-books'],
    primaryHerLeadId: 'julian',
    primaryHimLeadId: 'celeste',
    secondaryCameoLeadId: 'elena',
    sceneSetupHer:
      'String quartet notes float through the independent bookshop as Julian reaches for the exact hardcover of Colette’s Chéri at eye level beside you.',
    sceneSetupHim:
      'In the adjoining contemporary art alcove, silver-haired collector Celeste studies an unframed desert monochrome with a flute of prosecco.',
    choicesHer: [
      {
        label:
          'Let him hand you the copy and wager a glass of Rioja on who finishes it by Sunday.',
        outcomeText:
          'Julian’s hazel eyes warm instantly: "Dangerous wager—I read fast when the prize is dinner with you xx"',
        unlocksChatWithId: 'julian',
        chemistryBonus: 18,
      },
      {
        label:
          'Spoil the ending of the novel out loud and walk to the self-help shelf.',
        outcomeText:
          'Literary felony committed in broad daylight.',
        chemistryBonus: -6,
        isMemeFail: true,
      },
    ],
    choicesHim: [
      {
        label:
          'Ask Celeste what detail in the brushwork held her attention instead of reciting art-school buzzwords.',
        outcomeText:
          'Celeste turns with a luminous smile: "Finally, someone who looks before lecturing. Walk me to the courtyard bar."',
        unlocksChatWithId: 'celeste',
        chemistryBonus: 18,
      },
      {
        label:
          'Pretend you personally know the artist when the artist is a ninety-year-old woman standing behind you.',
        outcomeText:
          'Busted in stereo—Celeste hides a laugh behind her champagne glass.',
        chemistryBonus: -10,
        isMemeFail: true,
      },
    ],
    cameoBeat: {
      speakerId: 'elena',
      line: 'Prof. Elena slips a signed bookplate into your hand between stacks: "Meet me by the courtyard fountain once the dean stops making speeches."',
      boostText: '+15% Chemistry Cameo with Prof. Elena!',
    },
  },
  {
    id: 'dawn-lap-pool',
    number: 8,
    name: 'Dawn Lap Pool & Smoothie Bar',
    subtitle: '50-Meter Heated Outdoor Lanes • Sacred Earbuds Law',
    emoji: '🏊',
    backdropUrl: V35_SCENE_BACKDROPS['dawn-lap-pool'],
    primaryHerLeadId: 'marcus',
    primaryHimLeadId: 'summer',
    secondaryCameoLeadId: 'summer',
    sceneSetupHer:
      'Steam rises off Lane 4 at 6:30 AM. Marcus finishes his 1,500-meter set, pushes his goggles up, and laughs as a confused park wildlife officer at the gate tells a jogger: "Ma’am, for the last time, there aren’t wild cougars in New Jersey!"',
    sceneSetupHim:
      'Sun-kissed blonde dermatologist Summer finishes reformer cooldown on the terrace with white earbuds still in—testing whether you know the Sacred Gym Earbuds Law.',
    choicesHer: [
      {
        label:
          'Share a laugh over the "cougars in New Jersey" ranger announcement at the smoothie counter and swap numbers.',
        outcomeText:
          'Marcus grins wide: "Glad our coast has better wildlife. Let me buy your post-swim espresso."',
        unlocksChatWithId: 'marcus',
        chemistryBonus: 20,
      },
      {
        label:
          'Grab his ankle mid-flip-turn in Lane 4 to introduce yourself.',
        outcomeText:
          'Lifeguard whistle! Never ambush a swimmer mid-lap!',
        chemistryBonus: -10,
        isMemeFail: true,
      },
    ],
    choicesHim: [
      {
        label:
          'Respect the earbuds completely, trade a warm nod, and wait until Summer takes them out at the smoothie counter to say hello.',
        outcomeText:
          'Summer beams: "You passed the three-week headphone test on the first try. Put your number in my phone."',
        unlocksChatWithId: 'summer',
        chemistryBonus: 20,
      },
      {
        label:
          'Wave both hands six inches from her face mid-plank so she pulls an earbud out.',
        outcomeText:
          'Instant gym ick—Sacred Earbuds Law violated!',
        chemistryBonus: -12,
        isMemeFail: true,
      },
    ],
    cameoBeat: {
      speakerId: 'summer',
      line: 'Summer hands you a travel SPF 50 tube at the terrace counter: "Consider this free clinical supervision before your bluff hike."',
      boostText: '+15% Chemistry Cameo with Summer!',
    },
  },
  {
    id: 'cougarmarket',
    number: 9,
    name: '"The Cougarmarket" Wine & Olive Bar',
    subtitle: '6 PM Artisanal Cheese, Figs & Imported Rioja Aisle',
    emoji: '🛒',
    backdropUrl: V35_SCENE_BACKDROPS['cougarmarket'],
    primaryHerLeadId: 'rory',
    primaryHimLeadId: 'camila',
    secondaryCameoLeadId: 'rafael',
    sceneSetupHer:
      'Golden-blonde park ranger Rory mistakes you from behind in the fig-and-olive aisle for his friend’s sister, taps your shoulder cheerfully, freezes pink-cheeked when you turn around—and turns the mix-up into the most disarming dimpled recovery all week.',
    sceneSetupHim:
      'Chef-owner Camila squeezes heirloom figs beside the Rioja display, rolling her eyes at a guy down the aisle visibly "prowling" with a completely empty hand basket for forty minutes.',
    choicesHer: [
      {
        label:
          'Laugh at Rory’s mortified British blush and let him recommend his favorite picnic cheese to redeem himself.',
        outcomeText:
          'Rory’s dimples deepen: "Best accidental shoulder-tap of my life—let me make it up to you with a proper botanical-garden walk."',
        unlocksChatWithId: 'rory',
        chemistryBonus: 18,
      },
      {
        label:
          'Stare silently until he backs into a pyramid of sparkling water cans.',
        outcomeText:
          'Pure slapstick comedy in Aisle 4, though Rory escapes empty-handed!',
        chemistryBonus: 2,
        isMemeFail: true,
      },
    ],
    choicesHim: [
      {
        label:
          'Actually shop for real dinner ingredients and ask Camila which peppery olive oil pairs best with wood-grilled sea bass.',
        outcomeText:
          'Camila lights up: "An actual cook instead of an empty-basket tourist! Come taste the new menu at my osteria."',
        unlocksChatWithId: 'camila',
        chemistryBonus: 18,
      },
      {
        label:
          'Carry one unripe banana around Aisle 4 for forty-five minutes squinting at wedding rings.',
        outcomeText:
          'Security and Camila both clock the Whole-Foods prowler meme immediately!',
        chemistryBonus: -10,
        isMemeFail: true,
      },
    ],
    cameoBeat: {
      speakerId: 'rafael',
      line: 'Rafael loads walnut cutting boards he hand-finished for the cheese counter, winking as he hands you a warm baguette end.',
      boostText: '+15% Chemistry Cameo with Rafael!',
    },
  },
  {
    id: 'velvet-palms-bbq',
    number: 10,
    name: 'Velvet Palms Cul-de-Sac BBQ',
    subtitle: 'String-Light Backyard Grill & Neighbor Bestie Hangout',
    emoji: '🏡',
    backdropUrl: V35_SCENE_BACKDROPS['velvet-palms-bbq'],
    primaryHerLeadId: 'rafael',
    primaryHimLeadId: 'sienna',
    secondaryCameoLeadId: 'priya',
    sceneSetupHer:
      'Your neighbor bestie Jade hosts Sunday string-light ribs on the cul-de-sac. Rafael arrives carrying a custom walnutfloating shelf he built for Jade’s den—clean-shaven, sun-bronzed, and immediately taking over the smoky grill.',
    sceneSetupHim:
      'Your buddy Sam hosts a backyard cookout when his effortlessly magnetic 39-year-old aunt Sienna walks onto the patio in an ivory linen jumpsuit carrying chilled rosé.',
    choicesHer: [
      {
        label:
          'Step up beside Rafael at the cedar grill with two cold drinks and ask how he learned fine joinery.',
        outcomeText:
          'Jade mouths "YES" from the kitchen window as Rafael slides his personal number into your phone over grilled peaches.',
        unlocksChatWithId: 'rafael',
        chemistryBonus: 20,
      },
      {
        label:
          'Hide inside reorganizing Jade’s spice rack until everyone goes home.',
        outcomeText:
          'Jade’s alphabetized paprika looks great, zero romance unlocked.',
        chemistryBonus: 0,
      },
    ],
    choicesHim: [
      {
        label:
          'Hold steady eye contact across the firepit, pour Sienna a chilled glass without fanfare, and own the conversation when Sam’s friends wander over.',
        outcomeText:
          'Sienna’s hazel-green eyes sparkle: "Bold right in front of my nephew’s crew. Text me when the party winds down."',
        unlocksChatWithId: 'sienna',
        chemistryBonus: 20,
      },
      {
        label:
          'Panic when Sam walks over and call Sienna "Ma’am" twice.',
        outcomeText:
          'Sam chokes on his seltzer; "Ma’am" at a backyard party deals 50 psychic damage!',
        chemistryBonus: -12,
        isMemeFail: true,
      },
    ],
    cameoBeat: {
      speakerId: 'priya',
      line: 'Priya drops by Jade’s patio with warm cardamom brownies before her night shift, clinking her iced coffee against your glass.',
      boostText: '+15% Chemistry Cameo with Priya!',
    },
  },
];
