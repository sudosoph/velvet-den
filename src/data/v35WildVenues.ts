import { V35_SCENE_BACKDROPS } from './v35AssetManifest';

export interface WildChoiceOption {
  label: string;
  moveTag?: string;
  outcomeText: string;
  unlocksChatWithId?: string;
  chemistryBonus: number;
  isMemeFail?: boolean;
  conspiracyClueId?: string;
}

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
  spokenCueHer?: string;
  spokenCueHim?: string;
  choicesHer: WildChoiceOption[];
  choicesHim: WildChoiceOption[];
  cameoBeat: {
    speakerId: string;
    line: string;
    boostText: string;
  };
}

export interface WildMeetCuteSeed {
  venueLabel: string;
  aiMeetContext: string;
  incomingMessages: string[];
  choices: [
    { text: string; reply: string; delta: number },
    { text: string; reply: string; delta: number },
    { text: string; reply: string; delta: number; cost: 1; badge: string },
  ];
}

export const V35_WILD_VENUES: WildVenueSpot[] = [
  {
    id: 'velvet-room',
    number: 1,
    name: 'The Marlow Lounge',
    subtitle: 'Downtown Hotel Mahogany Martini & Piano Bar • 6:15 PM',
    emoji: '🍸',
    backdropUrl: V35_SCENE_BACKDROPS['velvet-room'],
    primaryHerLeadId: 'graham',
    primaryHimLeadId: 'claire',
    secondaryCameoLeadId: 'miles',
    sceneSetupHer:
      'Golden dusk hits the mahogany bar. Two stools over, blonde finance VP Graham raises his coupe with practiced poise, though a pale tan line circles his left ring finger and he checks his watch twice before 6:45 PM.',
    spokenCueHer:
      '"Nothing beats a quiet 6:15 drink before my... Tokyo client call at 6:45. Let me buy that glass."',
    sceneSetupHim:
      'At the corner of the mahogany bar, M&A partner Claire sets her phone face-down beside a three-olive Gibson after closing a coastal deal, visibly savoring twenty minutes where nobody asks her to approve a slide deck.',
    spokenCueHim:
      'Claire catches your eye in the backbar mirror as the pianist drifts into Sade’s "Smooth Operator," giving you a three-second window to be normal.',
    choicesHer: [
      {
        moveTag: 'Play Along & Investigate',
        label:
          'Trade dry banter with Graham and pocket his card so you can test that suspicious 6:45 PM curfew over text.',
        outcomeText:
          'Graham flashes a million-dollar grin, hands you his card, and bolts at 6:44 PM muttering about "Table 9 client calls." Direct text unlocked, watch his evening excuses!',
        unlocksChatWithId: 'graham',
        chemistryBonus: 10,
        conspiracyClueId: 'clue-velvet-ring',
      },
      {
        moveTag: 'Sharp Eye • Clue Grab',
        label:
          'Clock the ring-tan line immediately, toast the bartender instead, and pocket a Table 9 matchbook clue.',
        outcomeText:
          'The bartender slides you a fresh olive with a grin: "Good eye. Three guys in Patagonia vests run that 6:45 Table 9 alibi every Thursday." +Discernment clue logged!',
        chemistryBonus: 15,
        conspiracyClueId: 'clue-velvet-ring',
      },
      {
        moveTag: 'Rookie Fumble',
        label:
          'Fall for the "6:45 PM Tokyo market opener" line even though Tokyo opened at 5:00 PM Pacific.',
        outcomeText:
          'Jade texts from two booths away: "Girl, check world time zones before trusting a man with a pale ring finger!"',
        chemistryBonus: -8,
        isMemeFail: true,
      },
    ],
    choicesHim: [
      {
        moveTag: 'High-EQ Napkin Drop',
        label:
          'Respect her quiet beat, make one dry remark on the pianist’s Sade cover, and leave your number on a cocktail napkin with zero hovering.',
        outcomeText:
          'Claire arches one eyebrow over her Gibson rim and texts you before you reach the elevator: "Bold handwriting. Don’t waste it."',
        unlocksChatWithId: 'claire',
        chemistryBonus: 18,
      },
      {
        moveTag: 'Cheeky Olive Send',
        label:
          'Have the bartender send over one fresh cocktail olive with a note: "Blink twice if you also survived a three-hour Zoom today."',
        outcomeText:
          'Claire lets out a genuine laugh, waves you over for sixty seconds, and taps her personal cell into your phone.',
        unlocksChatWithId: 'claire',
        chemistryBonus: 20,
      },
      {
        moveTag: 'Cubsplaining Disaster',
        label:
          'Pull up a stool uninvited, call her "such a boss lady," and explain bond yields from a morning commute show.',
        outcomeText:
          'Claire takes one unhurried sip: "Adorable. My team structured that fund." Scene fumbled, ditch the LinkedIn routine!',
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
    subtitle: 'Public Lecture Hall & Post-Grades Faculty Gallery • 5:05 PM',
    emoji: '🎓',
    backdropUrl: V35_SCENE_BACKDROPS['hawthorne-campus'],
    primaryHerLeadId: 'julian',
    primaryHimLeadId: 'elena',
    secondaryCameoLeadId: 'julian',
    sceneSetupHer:
      'Visiting Hampstead fellow Julian wraps his public lecture on Mediterranean villas and steps off the lectern in rolled linen sleeves carrying two espressos.',
    spokenCueHer:
      '"Be honest, did my Amalfi courtyard slide convince anyone, or was everyone just staying out of the rain?"',
    sceneSetupHim:
      'After Friday’s public humanities forum, Literature Chair Elena stacks her notes beside the espresso urn. Campus code is ironclad: zero social drinks until final grades post at 5:00 PM.',
    spokenCueHim:
      'Elena’s phone chimes at 5:04 PM as the registrar seals final grades. She caps her red pen with a tiny, victorious sigh.',
    choicesHer: [
      {
        moveTag: 'Razor-Sharp Banter',
        label:
          'Dismantle Julian’s Amalfi courtyard thesis with a dry smile by the reception espresso table.',
        outcomeText:
          'Julian lights up immediately: "Properly ruthless critique. Fancy continuing this argument over Barolo at half seven?"',
        unlocksChatWithId: 'julian',
        chemistryBonus: 16,
      },
      {
        moveTag: 'Smooth Rescue',
        label:
          'Rescue him from a dean droning about parking budgets by claiming he promised to inspect your vintage map.',
        outcomeText:
          'Julian exhales in pure gratitude once you clear the hallway: "I owe you my life and a very good bottle of red."',
        unlocksChatWithId: 'julian',
        chemistryBonus: 18,
      },
      {
        moveTag: 'Auntie Zone Fumble',
        label:
          'Pat his forearm and say, "You speak so well for twenty-seven, just like my nephew!"',
        outcomeText:
          'Julian blinks politely into his paper cup as every trace of romantic tension evaporates into thin air.',
        chemistryBonus: -8,
        isMemeFail: true,
      },
    ],
    choicesHim: [
      {
        moveTag: 'Post-Grades Precision',
        label:
          'Honor the Post-Grades Rule: wait until 5:15 PM after grades are sealed, then invite Elena for espresso at the faculty gallery.',
        outcomeText:
          'Elena’s eyes crinkle warmly: "Patience, timing, and complete sentences. Put my personal cell in your phone."',
        unlocksChatWithId: 'elena',
        chemistryBonus: 20,
      },
      {
        moveTag: 'Playful Literary Bet',
        label:
          'Wait until 5:10 PM, hold up the Colette paperback she roasted in Q&A, and wager a glass of Sancerre you can defend chapter three.',
        outcomeText:
          'Elena laughs out loud: "Bold thesis, zero extra credit. Meet me off campus and prove it."',
        unlocksChatWithId: 'elena',
        chemistryBonus: 18,
      },
      {
        moveTag: 'Cliché Overload',
        label:
          'Try slipping your number into her folder BEFORE grades post while whispering, "Age is just a number, Professor."',
        outcomeText:
          'Elena slides it straight back across the walnut lectern: "Two clichés and twenty minutes early. Hard pass."',
        chemistryBonus: -12,
        isMemeFail: true,
      },
    ],
    cameoBeat: {
      speakerId: 'julian',
      line: 'Julian spots you beneath the autumn quad elms holding two rare Penguin paperbacks: "Saved you the annotated Colette copy, don’t tell Elena I raided the stacks."',
      boostText: '+15% Chemistry Cameo with Julian!',
    },
  },
  {
    id: 'terminal-b-airport',
    number: 3,
    name: 'Terminal B Arrivals & Lounge',
    subtitle: 'Golden-Hour Curbside Pickup & Departure Lounge Terrace',
    emoji: '✈️',
    backdropUrl: V35_SCENE_BACKDROPS['terminal-b-airport'],
    primaryHerLeadId: 'miles',
    primaryHimLeadId: 'celeste',
    secondaryCameoLeadId: 'claire',
    sceneSetupHer:
      'You walk out of Terminal B after a delayed flight. Dirty-blonde engineer Miles, whom Jade introduced briefly last month, tracked your tail number, stands curbside in a charcoal coat holding your exact hot cortado, effortlessly takes both of your heavy bags in one hand, and nods toward the waiting black car with an 8:15 corner booth already confirmed.',
    spokenCueHer:
      '"Flight 418 looked brutal on radar. Drink the cortado while it’s hot, I already handled the bags and the 8:15 table."',
    sceneSetupHim:
      'Up on the departure lounge terrace, Palm Springs gallery owner Celeste glances up from a desert sculpture catalog with dry amusement as gate agents announce a forty-minute delay.',
    spokenCueHim:
      '"Forty minutes for maintenance. Tell me the bar still stocks cocktail onions for a proper Gibson."',
    choicesHer: [
      {
        moveTag: 'Let Him Lead Cleanly',
        label:
          'Hand over both bags with a slow smile: "You tracked the flight AND booked the 8:15 table? Dangerous precedent, Miles."',
        outcomeText:
          'Miles opens the passenger door smoothly: "Turn your brain off, you’ve been running point all week. I’ve got tonight." Direct iMessage unlocked!',
        unlocksChatWithId: 'miles',
        chemistryBonus: 22,
      },
      {
        moveTag: 'Playful Audition Test',
        label:
          'Take the hot cortado, arch a brow, and ask if Jade leaked your coffee order or if he actually remembered from last month.',
        outcomeText:
          'Miles taps his temple with a quiet grin: "Remembered word for word. Hop in before LAX traffic wakes up."',
        unlocksChatWithId: 'miles',
        chemistryBonus: 20,
      },
      {
        moveTag: 'Hyper-Independent Fumble',
        label:
          'Refuse the black car out of reflex and drag two rolling suitcases onto the packed shuttle bus in the drizzle.',
        outcomeText:
          'Jade texts two minutes later: "WHY DID YOU WAVE OFF CURBSIDE ZADDY LOGISTICS?!"',
        chemistryBonus: -6,
        isMemeFail: true,
      },
    ],
    choicesHim: [
      {
        moveTag: 'Old-School Poise',
        label:
          'Flag the lounge server for two icy Gibsons with cocktail onions and ask Celeste which desert sculptor made her catalog cover.',
        outcomeText:
          'Celeste smiles radiantly: "An observant man who knows a Gibson from a martini. Save my number for Palm Springs."',
        unlocksChatWithId: 'celeste',
        chemistryBonus: 18,
      },
      {
        moveTag: 'Unhurried Charm',
        label:
          'Offer her the last working terrace outlet without launching into a twenty-minute pitch about your startup.',
        outcomeText:
          'Celeste closes her catalog with a pleased look: "Good manners and zero tech jargon? Sit down and keep me company."',
        unlocksChatWithId: 'celeste',
        chemistryBonus: 16,
      },
      {
        moveTag: 'Backhanded Compliment',
        label:
          'Open with, "Whoa, you look amazing for your fifties, my mom loves Palm Springs too!"',
        outcomeText:
          'Celeste lowers her sunglasses half an inch: "Two strikes in one breath, darling. Enjoy Boarding Group 9."',
        chemistryBonus: -12,
        isMemeFail: true,
      },
    ],
    cameoBeat: {
      speakerId: 'claire',
      line: 'Claire breezes out of PreCheck in a silk trench, smiling as she spots you: "Upgrade cleared, sit next to me before someone dull takes 2B."',
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
      'String lights sway above terracotta tile as partners rotate on the three-minute bell. Clean-shaven furniture maker Rafael steps in front of you in rolled black silk sleeves, offering a warm, steady hand.',
    spokenCueHer:
      '"Relax your shoulders, follow my frame on the one, and ignore everyone counting out loud."',
    sceneSetupHim:
      'At the adjoining courtyard kitchen island, interior designer Sienna laughs as her station partner mangles fresh basil while salsa horns drift in from the patio.',
    spokenCueHim:
      '"Please tell me the next person rotating to this cutting board actually owns a chef’s knife."',
    choicesHer: [
      {
        moveTag: 'Match His Frame',
        label:
          'Match Rafael’s frame on the cross-body turn and tease him for making a double spin feel suspiciously practiced.',
        outcomeText:
          'Rafael grins, warm hand steady at your waist: "Stay for one espresso after class. I want to hear that laugh without the brass section."',
        unlocksChatWithId: 'rafael',
        chemistryBonus: 20,
      },
      {
        moveTag: 'Playful Culinary Dare',
        label:
          'Steal a taste of his charred plantain glaze at the hearth break and bet you can guess the secret spice.',
        outcomeText:
          'Rafael laughs, handing you the tasting spoon: "Smoked paprika and brown butter. Give me your number so I can cook the full dinner."',
        unlocksChatWithId: 'rafael',
        chemistryBonus: 18,
      },
      {
        moveTag: 'Age-Gap Self-Sabotage',
        label:
          'Apologize twelve times for your footwork and ask if twenty-six-year-olds even listen to real instruments anymore.',
        outcomeText:
          'The rotation bell dings right on your generational lecture. Step in and dance next time!',
        chemistryBonus: -6,
        isMemeFail: true,
      },
    ],
    choicesHim: [
      {
        moveTag: 'Knife Skills & Spin',
        label:
          'Slide into the station rotation, julienne the shallots cleanly in thirty seconds, and spin Sienna once when the chorus hits.',
        outcomeText:
          'Sienna laughs breathless against your shoulder: "Knife skills AND rhythm? Put your number in my phone right now."',
        unlocksChatWithId: 'sienna',
        chemistryBonus: 18,
      },
      {
        moveTag: 'Shared Roast',
        label:
          'Pour two splashes of chilled Albariño and quietly rate the instructor’s dramatic pepper-mill monologue out of ten.',
        outcomeText:
          'Sienna nearly chokes laughing into her wine glass: "Solid 4.2 for theatrics. Walk me to the patio bar after this."',
        unlocksChatWithId: 'sienna',
        chemistryBonus: 18,
      },
      {
        moveTag: 'Safari Tourist Line',
        label:
          'Lean against the counter and whisper, "So is Thursday night when the cougars come out here?"',
        outcomeText:
          'Sienna hands you a stack of dirty prep bowls: "Wrong channel, National Geographic. Dish pit is that way."',
        chemistryBonus: -12,
        isMemeFail: true,
      },
    ],
    cameoBeat: {
      speakerId: 'sienna',
      line: 'Sienna waves from the courtyard bar holding two lime aguas frescas: "Jade told me you might drop in, save me the next bachata!"',
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
      'Court 3 needs a fourth for mixed doubles at sunset. Platinum-blonde Copenhagen architect Søren spins his racquet on the baseline, ice-blue eyes glinting with calm amusement.',
    spokenCueHer:
      '"Fair warning before you take my side of the net: if we win the tiebreak, you owe me dinner thoughts."',
    sceneSetupHim:
      'Golden-blonde gala chair Brooke waves you onto Court 1, though she checks Court 4 three times in sixty seconds where her silver-haired ex-husband Richard is serving.',
    spokenCueHim:
      '"Stand right by the cabana rail where the light hits your jawline, wait, laugh loud right now!"',
    choicesHer: [
      {
        moveTag: 'Fearless Net Play',
        label:
          'Step in fearless at the net, put away a clean cross-court volley, and accept Søren’s post-match tonic.',
        outcomeText:
          'Søren’s cool Nordic composure cracks into a boyish grin: "Lethal backhand. Thursday dinner, my treat, zero excuses."',
        unlocksChatWithId: 'soren',
        chemistryBonus: 20,
      },
      {
        moveTag: 'Double-or-Nothing Bet',
        label:
          'Accept his tiebreak wager on one condition: loser picks up raw-bar oysters at eight.',
        outcomeText:
          'Søren taps racquet strings with yours: "Best terms I have heard all month. Sending you my number now."',
        unlocksChatWithId: 'soren',
        chemistryBonus: 20,
      },
      {
        moveTag: 'Sideline Excuse',
        label:
          'Fake a sudden hamstring cramp from the shaded cabana lounger to avoid rallying.',
        outcomeText:
          'Søren nods politely and recruits another fourth. Fortune favors stepping onto the clay!',
        chemistryBonus: -4,
        isMemeFail: true,
      },
    ],
    choicesHim: [
      {
        moveTag: 'Play & Clock the Tell',
        label:
          'Play the set with Brooke and accept her cabana spritz, while clocking why she seated you directly in Richard’s sightline.',
        outcomeText:
          'Brooke drops her number into your phone while whispering about "sitting right across from Table 9 Friday." Thread unlocked, watch for revenge-prop tells!',
        unlocksChatWithId: 'brooke',
        chemistryBonus: 12,
        conspiracyClueId: 'clue-brooke-table9',
      },
      {
        moveTag: 'Cabana Recon • Clue Grab',
        label:
          'Skip the staged photo shoot and ask the court pro why Brooke books the exact Table 9 patio slot every Friday.',
        outcomeText:
          'The club pro chuckles under his breath: "Richard dines at Table 9 every Friday at eight. Draw your own conclusions." +Discernment clue logged!',
        chemistryBonus: 15,
        conspiracyClueId: 'clue-brooke-table9',
      },
      {
        moveTag: 'Unpaid Stunt Double',
        label:
          'Pose obediently for fourteen ring-light stories aimed at Court 4 while holding her purse.',
        outcomeText:
          'Congratulations, you just starred as Prop Boyfriend #4 in Palisades divorce theater without getting a real conversation.',
        chemistryBonus: -10,
        isMemeFail: true,
      },
    ],
    cameoBeat: {
      speakerId: 'soren',
      line: 'Søren tosses you a chilled towel courtside: "Brooke’s ex just double-faulted twice watching her, don’t get drafted into the Table 9 circus."',
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
      'Sunrise warms the brick courtyard as 6\'1" firefighter-paramedic Marcus comes off shift, quietly covering the nurse’s espresso tab ahead of him before spotting you by the pastry glass.',
    spokenCueHer:
      '"Tell me honestly, is claiming the last warm almond croissant after a twelve-hour shift a felony or self-care?"',
    sceneSetupHim:
      'Charge trauma RN Priya steps into the 6:45 AM sunlight in navy scrubs and a leather jacket, eyeing your cup sleeve and intentionally butchering your name just to test your reflexes.',
    spokenCueHim:
      '"Rough spelling on that oat latte. Don’t tell me you’re fragile before seven in the morning."',
    choicesHer: [
      {
        moveTag: 'Warm Banter',
        label:
          'Propose splitting the last almond croissant fifty-fifty on the sunlit courtyard bench before he heads home.',
        outcomeText:
          'Marcus flashes an unhurried, dimpled smile: "Best end to a night shift all month. Let me take you to real dinner once I’ve slept."',
        unlocksChatWithId: 'marcus',
        chemistryBonus: 18,
      },
      {
        moveTag: 'Pitmaster Callback',
        label:
          'Cover his espresso right back and ask where a guy who works night rescues actually goes for real food.',
        outcomeText:
          'Marcus lights up talking oak-smoked brisket and hands you his phone: "Let me cook for you Sunday or book Thursday drinks first."',
        unlocksChatWithId: 'marcus',
        chemistryBonus: 20,
      },
      {
        moveTag: 'Cheesy Pickup Fumble',
        label:
          'Hit him with, "Thank goodness a paramedic is here because my heart just stopped," at 6:46 AM.',
        outcomeText:
          'Marcus rubs his eyes with a gentle laugh: "Ma’am, I’ve heard that one four times since midnight." Try human banter!',
        chemistryBonus: -8,
        isMemeFail: true,
      },
    ],
    choicesHim: [
      {
        moveTag: 'Zero Mental Load',
        label:
          'Volley Priya’s tease right back without flinching and offer post-shift street tacos Friday morning so she makes zero decisions.',
        outcomeText:
          'Priya grins over her iced cardamom brew: "Quick reflexes AND zero off-duty decision fatigue? Text me before noon."',
        unlocksChatWithId: 'priya',
        chemistryBonus: 20,
      },
      {
        moveTag: 'Playful Alias',
        label:
          'Tell the barista her cup name is "Boss of Bay 4" and quietly add a warm cardamom bun to her order.',
        outcomeText:
          'Priya laughs, bumping your shoulder with hers: "Okay, smooth recovery. Give me your number before my blackout curtains call."',
        unlocksChatWithId: 'priya',
        chemistryBonus: 18,
      },
      {
        moveTag: 'Free Triage Crime',
        label:
          'Roll up your sleeve next to the croissants and ask her to diagnose a weird gym rash off the clock.',
        outcomeText:
          'Priya’s soul visibly leaves her body: "Emergency room entrance is around the corner, rookie."',
        chemistryBonus: -10,
        isMemeFail: true,
      },
    ],
    cameoBeat: {
      speakerId: 'marcus',
      line: 'Marcus walks past with two cortados: "Priya only roasts people she actually likes, trust me, I’ve run trauma bay handoffs with her for three years."',
      boostText: '+15% Chemistry Cameo with Marcus!',
    },
  },
  {
    id: 'left-bank-books',
    number: 7,
    name: 'Left Bank Books & Gallery',
    subtitle: 'First-Friday Prosecco & French Fiction Stacks',
    emoji: '📚',
    backdropUrl: V35_SCENE_BACKDROPS['left-bank-books'],
    primaryHerLeadId: 'julian',
    primaryHimLeadId: 'celeste',
    secondaryCameoLeadId: 'elena',
    sceneSetupHer:
      'Cello quartet notes drift through the bookshop courtyard as Julian reaches for the exact paperback of Colette’s Chéri at eye level beside you.',
    spokenCueHer:
      '"Well, that is deeply awkward. Only one copy left on the shelf, and you clearly spotted it first."',
    sceneSetupHim:
      'In the adjoining contemporary gallery room, silver-haired collector Celeste studies an unframed desert canvas with a flute of dry prosecco while younger guys recite press-release buzzwords.',
    spokenCueHim:
      '"Everyone in this room keeps saying juxtaposition. Tell me one honest thing you actually see in it."',
    choicesHer: [
      {
        moveTag: 'Bookshop Wager',
        label:
          'Let Julian claim the copy on one condition: he owes you his verdict over a glass of Rioja by Sunday.',
        outcomeText:
          'Julian’s hazel eyes warm immediately: "Dangerous wager. I read remarkably fast when the prize is dinner with you."',
        unlocksChatWithId: 'julian',
        chemistryBonus: 18,
      },
      {
        moveTag: 'Courtyard Escape',
        label:
          'Whisper that Colette pairs terribly with lukewarm gallery prosecco and suggest the wine bar next door.',
        outcomeText:
          'Julian sets his plastic flute down in two seconds flat: "Thank God. Lead the way, darling."',
        unlocksChatWithId: 'julian',
        chemistryBonus: 20,
      },
      {
        moveTag: 'Spoiler Felony',
        label:
          'Summarize the entire ending of Chéri out loud and ask if he’s writing a term paper on it.',
        outcomeText:
          'Julian clutches the paperback to his chest in mock horror. Spoilers kill chemistry!',
        chemistryBonus: -8,
        isMemeFail: true,
      },
    ],
    choicesHim: [
      {
        moveTag: 'Look Before Lecturing',
        label:
          'Skip the art-school jargon completely and point out how the ochre brushstroke catches dusk light like Palm Springs rock.',
        outcomeText:
          'Celeste turns with a luminous smile: "Finally, someone with eyes instead of a thesaurus. Walk me to the courtyard bar."',
        unlocksChatWithId: 'celeste',
        chemistryBonus: 18,
      },
      {
        moveTag: 'Dry Humor Rescue',
        label:
          'Whisper that half the crowd is staring intensely at the fire-alarm panel thinking it’s minimalist sculpture.',
        outcomeText:
          'Celeste hides a delighted laugh behind her glass: "Wicked and observant. Put your number in my phone."',
        unlocksChatWithId: 'celeste',
        chemistryBonus: 20,
      },
      {
        moveTag: 'Fake Insider Bluff',
        label:
          'Brag that you "hang out with the artist all the time" while the eighty-two-year-old sculptor stands right behind you.',
        outcomeText:
          'Busted in Dolby Surround. Celeste clinks glasses with the sculptor as you retreat.',
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
      'Steam rises off Lane 4 at 6:30 AM. Marcus finishes his 1,500-meter swim, pushes his goggles up, and grins as an exasperated park ranger at the gate tells a jogger: "Ma’am, for the last time, there aren’t wild cougars in New Jersey!"',
    spokenCueHer:
      '"Glad California wildlife has much better taste in heated lap pools. Good pace in Lane 3."',
    sceneSetupHim:
      'Malibu dermatologist Summer finishes her reformer cooldown on the terrace deck with white AirPods firmly in, silently grading who respects the Sacred Gym Earbuds Law.',
    spokenCueHim:
      'Three minutes later at the smoothie bar, Summer pops both earbuds into their case and reaches for the mineral SPF 50 pump.',
    choicesHer: [
      {
        moveTag: 'Wildlife Callback',
        label:
          'Toast the ranger’s "cougars in New Jersey" PSA with your green smoothies and swap numbers by the towel rack.',
        outcomeText:
          'Marcus laughs deep in his chest: "Best morning set all week. Let me take you out somewhere dry on Friday."',
        unlocksChatWithId: 'marcus',
        chemistryBonus: 20,
      },
      {
        moveTag: 'Lane Pace Challenge',
        label:
          'Bet him post-swim espressos you can beat his 100-meter split on Tuesday morning.',
        outcomeText:
          'Marcus grins wide: "Deal, though I’m taking you to dinner Thursday regardless of the stopwatch."',
        unlocksChatWithId: 'marcus',
        chemistryBonus: 18,
      },
      {
        moveTag: 'Mid-Lap Ambush',
        label:
          'Tap his foot mid-flip-turn in the deep end just to ask his zodiac sign.',
        outcomeText:
          'Sharp lifeguard whistle echoes across all eight lanes. Wait for dry land!',
        chemistryBonus: -10,
        isMemeFail: true,
      },
    ],
    choicesHim: [
      {
        moveTag: 'Sacred Earbuds Mastery',
        label:
          'Leave her completely in peace during cooldown, trade a warm nod, and say hello only once her AirPods are in the case.',
        outcomeText:
          'Summer beams: "You passed the gym headphone test that ninety percent of men fail. Put your number in my phone."',
        unlocksChatWithId: 'summer',
        chemistryBonus: 20,
      },
      {
        moveTag: 'SPF Banter',
        label:
          'Once her earbuds are out at the counter, ask her clinical verdict on whether reapplying SPF 50 counts as flirting.',
        outcomeText:
          'Summer laughs brightly: "On my scorecard it’s practically a marriage proposal. Text me for Malibu tacos."',
        unlocksChatWithId: 'summer',
        chemistryBonus: 18,
      },
      {
        moveTag: 'Gym Hover Crime',
        label:
          'Wave both hands six inches from her face mid-plank so she has to yank an AirPod out.',
        outcomeText:
          'Instant gym ick. Never mime through someone’s cooldown playlist!',
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
    subtitle: '6 PM Artisanal Cheese, Black Figs & Rioja Aisle',
    emoji: '🛒',
    backdropUrl: V35_SCENE_BACKDROPS['cougarmarket'],
    primaryHerLeadId: 'rory',
    primaryHimLeadId: 'camila',
    secondaryCameoLeadId: 'rafael',
    sceneSetupHer:
      'Golden-blonde park ranger Rory mistakes you from behind in the fig-and-olive aisle for his friend’s sister, taps your shoulder brightly, turns scarlet when you face him, and scrambles into the most disarming British apology all week.',
    spokenCueHer:
      '"Oh bloody hell, you are decidedly not Hannah, and now I am blushing in front of the Manchego."',
    sceneSetupHim:
      'Osteria chef-owner Camila inspects black mission figs beside the Rioja rack, rolling her eyes at a guy down Aisle 4 who has been "shopping" for forty minutes holding one single lime.',
    spokenCueHim:
      '"Swear on my kitchen knives, if one more man circles the olive bar with an empty basket I’m charging admission."',
    choicesHer: [
      {
        moveTag: 'Save His Blush',
        label:
          'Laugh at Rory’s mortified British blush and let him recommend his favorite trail-picnic cheese to redeem himself.',
        outcomeText:
          'Rory’s dimples deepen instantly: "Best accidental shoulder-tap of my life. Let me make it up to you at the botanical terrace."',
        unlocksChatWithId: 'rory',
        chemistryBonus: 18,
      },
      {
        moveTag: 'Deadpan Tease',
        label:
          'Keep a straight face for two beats and tell him the fine for false identification in Aisle 4 is one glass of wine.',
        outcomeText:
          'Rory grins ear to ear: "Happily paying that fine tonight or Friday, your call!"',
        unlocksChatWithId: 'rory',
        chemistryBonus: 20,
      },
      {
        moveTag: 'Kiddo Pat-Down',
        label:
          'Pinch his cheek and say, "Aw, don’t worry kiddo, happens to everyone!"',
        outcomeText:
          'Rory polite-smiles while quietly perishing behind the sourdough display.',
        chemistryBonus: -8,
        isMemeFail: true,
      },
    ],
    choicesHim: [
      {
        moveTag: 'Real Home Cook',
        label:
          'Show an actual dinner basket with shallots and sea bass, and ask Camila which peppery olive oil finishes best off the grill.',
        outcomeText:
          'Camila lights up: "A man who actually cooks instead of prowling with a prop lime! Take my number and tell me how dinner turns out."',
        unlocksChatWithId: 'camila',
        chemistryBonus: 18,
      },
      {
        moveTag: 'Roast Empty-Basket Guy',
        label:
          'Deadpan that Empty-Basket Lime Guy is on lap seven and bet Camila a glass of Albariño he asks where the oat milk is next.',
        outcomeText:
          'Camila bursts out laughing right on cue when he does: "Okay, psychic and funny. Come sit at my chef’s counter Friday."',
        unlocksChatWithId: 'camila',
        chemistryBonus: 20,
      },
      {
        moveTag: 'Whole-Foods Prowler Meme',
        label:
          'Carry one unripe banana up and down Aisle 4 for forty minutes squinting obviously at left hands.',
        outcomeText:
          'Both Camila and the cheese-counter guy clock the TikTok prowler routine from thirty feet away!',
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
    name: 'Palisades Cul-de-Sac BBQ',
    subtitle: 'String-Light Backyard Grill & Neighbor Bestie Cookout',
    emoji: '🏡',
    backdropUrl: V35_SCENE_BACKDROPS['velvet-palms-bbq'],
    primaryHerLeadId: 'rafael',
    primaryHimLeadId: 'sienna',
    secondaryCameoLeadId: 'priya',
    sceneSetupHer:
      'Your neighbor bestie Jade hosts Sunday ribs under backyard string lights. Rafael arrives carrying a custom walnut floating shelf he built for Jade’s den and effortlessly takes command of the smoky cedar grill.',
    spokenCueHer:
      '"Jade warned me her favorite neighbor had dangerous taste in wine. Come judge these grilled peaches before I plate them."',
    sceneSetupHim:
      'Your buddy Sam hosts a Sunday cookout when his effortlessly magnetic 39-year-old aunt Sienna steps onto the patio in ivory linen carrying two bottles of chilled rosé.',
    spokenCueHim:
      '"Thank goodness, someone at this party who isn’t arguing about fantasy football trades."',
    choicesHer: [
      {
        moveTag: 'Grillside Spark',
        label:
          'Step up beside Rafael at the cedar grill with two cold drinks and claim official taste-tester rights on the peaches.',
        outcomeText:
          'Jade mouths "YES" from the kitchen window as Rafael slides his personal number into your phone over smoky bourbon glaze.',
        unlocksChatWithId: 'rafael',
        chemistryBonus: 20,
      },
      {
        moveTag: 'Woodshop Curiosity',
        label:
          'Inspect the walnut shelf he built without nails and ask to see his Silver Lake studio sometime.',
        outcomeText:
          'Rafael’s eyes warm instantly: "Thursday evening, studio tour first, courtyard dinner right after."',
        unlocksChatWithId: 'rafael',
        chemistryBonus: 18,
      },
      {
        moveTag: 'Bedtime Joke Gone Wrong',
        label:
          'Ask him twice if 9:30 PM on a Sunday is "way too boring for a twenty-six-year-old."',
        outcomeText:
          'Never pre-reject yourself on behalf of a man standing right at your grill!',
        chemistryBonus: -6,
        isMemeFail: true,
      },
    ],
    choicesHim: [
      {
        moveTag: 'Unbothered Confidence',
        label:
          'Hold steady eye contact by the firepit, pour Sienna chilled rosé without fanfare, and stay completely composed when Sam’s crew wanders over.',
        outcomeText:
          'Sienna’s hazel-green eyes sparkle: "Zero flinching right in front of my nephew’s friends. Text me when you head home."',
        unlocksChatWithId: 'sienna',
        chemistryBonus: 20,
      },
      {
        moveTag: 'Smooth Party Rescue',
        label:
          'Rescue Sienna from a neighbor’s twenty-minute HOA hedge dispute by recruiting her to pick the next vinyl record inside.',
        outcomeText:
          'Sienna slips Al Green onto the turntable and taps her number into your phone: "Heroic save. Friday night is yours."',
        unlocksChatWithId: 'sienna',
        chemistryBonus: 18,
      },
      {
        moveTag: 'Psychic Damage',
        label:
          'Panic the instant Sam walks over, stand like a cadet, and call Sienna "Ma’am" twice.',
        outcomeText:
          'Sam chokes on his seltzer. Calling a 39-year-old smoke show "Ma’am" at a backyard party deals 50 psychic damage!',
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

const WILD_MEET_SEEDS: Record<string, WildMeetCuteSeed> = {
  'claire:velvet-room': {
    venueLabel: 'Met at The Marlow Lounge',
    aiMeetContext:
      'HOW YOU MET: Offline in person at The Marlow Lounge hotel bar over a Gibson martini while the pianist played Sade. He respected your quiet space and slipped you his number without hovering. You NEVER matched on Hinge or any app!',
    incomingMessages: [
      'Bold handwriting on that cocktail napkin, and ten points for not hovering over my Gibson. Let’s hear your Thursday dinner pitch.',
    ],
    choices: [
      {
        text: '7:45 quiet corner booth, phones face-down, and your Gibson is waiting before you sit.',
        reply: 'Decisive and zero logistics homework for me. Strong start.',
        delta: 18,
      },
      {
        text: 'Only fair after that pianist turned Sade into elevator jazz. Free Thursday at eight?',
        reply: 'Haha brutal and accurate. Thursday at eight works.',
        delta: 17,
      },
      {
        text: '💎 Consider my ninety-second Marlow audition officially live, Counselor. Friday at 8 is held for us.',
        reply: 'Audition passed with time to spare. Keep that reservation.',
        delta: 24,
        cost: 1,
        badge: 'Napkin Callback',
      },
    ],
  },
  'graham:velvet-room': {
    venueLabel: 'Met at The Marlow Lounge',
    aiMeetContext:
      'HOW YOU MET: Offline at The Marlow Lounge bar at 6:15 PM where you rushed out at 6:44 PM claiming a "Tokyo client call" despite a pale tan line on your left ring finger.',
    incomingMessages: [
      'Great running into you at The Marlow bar earlier. Sorry I had to sprint at 6:44 for Tokyo, let’s grab a 5:15 drink tomorrow before my evening calls?',
    ],
    choices: [
      {
        text: 'Funny how Tokyo markets open at 5 PM Pacific, yet your call always hits at 6:45 sharp.',
        reply: 'Haha international private equity hours are crazy, trust me! 5:15 tomorrow?',
        delta: 16,
      },
      {
        text: '5:15 works for one drink, unless your left ring finger has a 6:45 curfew too.',
        reply: 'Whoa, tough crowd! Just an old rowing callous, swear.',
        delta: 18,
      },
      {
        text: '💎 Make it 8:00 PM Friday right past Table 9 and prove your evenings actually exist, Graham.',
        reply: 'Oof Friday nights are brutal with quarterly closings, let’s stick to 5:15!',
        delta: 22,
        cost: 1,
        badge: 'Curfew Trap Check',
      },
    ],
  },
  'elena:hawthorne-campus': {
    venueLabel: 'Met at Hawthorne University',
    aiMeetContext:
      'HOW YOU MET: Offline at Hawthorne University right after final grades posted on Friday afternoon. He waited respectfully until grades were sealed before inviting you out. You NEVER matched on an app!',
    incomingMessages: [
      'Final grades are officially sealed with the registrar and my red pen is retired for the weekend. Still brave enough to defend that thesis over Sancerre?',
    ],
    choices: [
      {
        text: 'Chilled Sancerre is practically poured. Corner table at 7:45 Friday, zero seminar talk allowed.',
        reply: 'An embargo on faculty talk? You already have an A.',
        delta: 18,
      },
      {
        text: 'Waited all week for 5:01 PM just to ask you properly. Let me take you out tomorrow night.',
        reply: 'Good ethics look very good on you.',
        delta: 18,
      },
      {
        text: '💎 Thesis defense moved to an 8 PM candlelit banquette, Professor. First bottle is on me.',
        reply: 'Careful, I grade curve-free after five o’clock. See you at eight.',
        delta: 24,
        cost: 1,
        badge: 'Off-Campus Spark',
      },
    ],
  },
  'julian:hawthorne-campus': {
    venueLabel: 'Met at Hawthorne Lecture Hall',
    aiMeetContext:
      'HOW YOU MET: Offline at Hawthorne University after your Mediterranean villas guest lecture, where she dismantled your Amalfi courtyard thesis over espresso. You NEVER matched on Hinge!',
    incomingMessages: [
      'Still recovering from how effortlessly you dismantled my Amalfi lecture in two sentences. Fancy continuing round two over Barolo at half seven? x',
    ],
    choices: [
      {
        text: 'Only if you leave the lecture slides at home and pick a proper quiet wine bar.',
        reply: 'Slides banished, corner booth sorted for half seven x',
        delta: 18,
      },
      {
        text: 'You held up well under cross-examination, professor. Thursday at 7:30 works.',
        reply: 'Best peer review of my fellowship so far xx',
        delta: 17,
      },
      {
        text: '💎 Half seven is a deal, Julian, bring your sharpest story and zero academic footnotes.',
        reply: 'Phones in my coat pocket from the moment you sit down xx',
        delta: 24,
        cost: 1,
        badge: 'Half-Seven Lock',
      },
    ],
  },
  'julian:left-bank-books': {
    venueLabel: 'Met at Left Bank Books',
    aiMeetContext:
      'HOW YOU MET: Offline in the French fiction stacks at Left Bank Books reaching for the same copy of Colette’s Chéri. You NEVER matched on an app!',
    incomingMessages: [
      'Already forty pages into Chéri and completely blaming you for ruining my evening productivity. Still on for that Rioja wager? x',
    ],
    choices: [
      {
        text: 'Reading ahead before Friday is practically cheating, save chapter four for the wine bar.',
        reply: 'Bookmarking page forty-one under protest, see you at half seven x',
        delta: 18,
      },
      {
        text: 'Pick a candlelit courtyard spot for Thursday and bring my future paperback.',
        reply: 'Left Bank’s courtyard corner is already held for us xx',
        delta: 18,
      },
      {
        text: '💎 Winner picks dessert, loser buys the Rioja, meet me Friday at half seven.',
        reply: 'Best literary contract in California. Counting the hours xx',
        delta: 24,
        cost: 1,
        badge: 'Colette Wager',
      },
    ],
  },
  'miles:terminal-b-airport': {
    venueLabel: 'Met Curbside at Terminal B',
    aiMeetContext:
      'HOW YOU MET: Offline curbside at Terminal B where you tracked her delayed flight, brought a hot cortado, took both heavy bags in one hand, and had a car + 8:15 booth ready.',
    incomingMessages: [
      'Hope you finally exhaled after Terminal B. Kept Friday’s 8:15 corner table on hold so you don’t have to make a single decision all week.',
    ],
    choices: [
      {
        text: 'Curbside cortado AND Friday already handled? You’re setting a dangerous bar, Miles.',
        reply: 'Good. Get comfortable leaving the logistics to me.',
        delta: 19,
      },
      {
        text: 'Still amazed you remembered my exact coffee order from Jade’s party.',
        reply: 'Easy to remember when I’ve been wanting to take you out for a month.',
        delta: 18,
      },
      {
        text: '💎 8:15 Friday is locked in, pick me up at eight and keep that streak alive.',
        reply: 'I’ll be curbside at 7:55 sharp.',
        delta: 25,
        cost: 1,
        badge: 'Curbside Standard',
      },
    ],
  },
  'celeste:terminal-b-airport': {
    venueLabel: 'Met at Terminal B Lounge',
    aiMeetContext:
      'HOW YOU MET: Offline on the Terminal B departure lounge terrace over icy Gibsons with cocktail onions during a forty-minute gate delay. You NEVER matched on an app!',
    incomingMessages: [
      'Wheels down in Palm Springs, and those two lounge Gibsons completely redeemed Flight 209. Tell me you travel lighter than Speakerphone Guy.',
    ],
    choices: [
      {
        text: 'One leather carry-on, headphones on, and I already know your Gibson takes an onion.',
        reply: 'Civilized travel still lives. Come see the gallery Thursday.',
        delta: 18,
      },
      {
        text: 'Best forty-minute gate delay on record. When are you back on the Westside for dinner?',
        reply: 'Back in town Thursday afternoon with an appetite for martinis.',
        delta: 18,
      },
      {
        text: '💎 Let me book us an 8 PM courtyard table Friday before your next desert opening.',
        reply: 'Top down on the convertible if the evening stays warm. Friday is yours.',
        delta: 24,
        cost: 1,
        badge: 'First-Class Poise',
      },
    ],
  },
  'celeste:left-bank-books': {
    venueLabel: 'Met at Left Bank Gallery',
    aiMeetContext:
      'HOW YOU MET: Offline at Left Bank Gallery’s First-Friday opening looking at an unframed desert monochrome without pretentious art-school jargon.',
    incomingMessages: [
      'Half that gallery crowd recited press releases at me all night, and you actually looked at the canvas first. What does your Thursday evening look like?',
    ],
    choices: [
      {
        text: 'Wide open for two icy Gibsons and hearing which piece you actually bought.',
        reply: 'You have an eye for dangerous habits. Thursday at eight.',
        delta: 18,
      },
      {
        text: 'Zero art-school buzzwords promised all night. Let me book us a quiet corner booth.',
        reply: 'Music to my ears, darling.',
        delta: 18,
      },
      {
        text: '💎 Car door opened, phones off, and dry Gibsons at 7:45 Thursday. Say when.',
        reply: 'Old-school manners never miss. Send me the address.',
        delta: 24,
        cost: 1,
        badge: 'Collector’s Choice',
      },
    ],
  },
  'rafael:havana-salsa': {
    venueLabel: 'Met at Havana & Vine Salsa',
    aiMeetContext:
      'HOW YOU MET: Offline on the terracotta courtyard dance floor at Havana & Vine during three-minute salsa partner rotations.',
    incomingMessages: [
      'Still thinking about how effortlessly you caught that cross-body spin on the brass break. Let me take you out without a three-minute rotation bell.',
    ],
    choices: [
      {
        text: 'Only if there is zero whistle cutting our conversation off every three minutes.',
        reply: 'Whole evening is yours, zero bells allowed.',
        delta: 18,
      },
      {
        text: 'You lead well on the dance floor, let’s see how you pick a Friday dinner spot.',
        reply: 'Challenge gladly accepted. 8 PM under the courtyard lanterns.',
        delta: 18,
      },
      {
        text: '💎 Save me Friday night, Rafael, dinner first and one proper slow song after.',
        reply: 'Already counting down to Friday.',
        delta: 24,
        cost: 1,
        badge: 'Slow-Spin Spark',
      },
    ],
  },
  'rafael:velvet-palms-bbq': {
    venueLabel: 'Met at Palisades BBQ',
    aiMeetContext:
      'HOW YOU MET: Offline at your neighbor bestie Jade’s Sunday string-light backyard BBQ over cedar-grilled peaches.',
    incomingMessages: [
      'Jade texted me ten minutes after you walked home just to say "TREAT HER RIGHT OR I CONFISCATE YOUR GRILL." Free this Friday?',
    ],
    choices: [
      {
        text: 'Jade takes neighbor vetting very seriously. Impress us both with your Friday plan.',
        reply: '8 PM coastal table is already locked in, zero grill confiscation risk.',
        delta: 18,
      },
      {
        text: 'Those bourbon-glazed peaches earned you at least one real dinner date.',
        reply: 'Wait until you taste what I cook when it’s just the two of us.',
        delta: 18,
      },
      {
        text: '💎 Pick me up Friday at eight, woodworker, and don’t keep Jade waiting for a good report.',
        reply: 'Yes ma’am, wait, scratch that, see you at eight sharp with bells on.',
        delta: 24,
        cost: 1,
        badge: 'Jade-Approved',
      },
    ],
  },
  'sienna:havana-salsa': {
    venueLabel: 'Met at Havana & Vine',
    aiMeetContext:
      'HOW YOU MET: Offline at Havana & Vine’s culinary-and-salsa night where he julienned shallots cleanly and spun you on the chorus.',
    incomingMessages: [
      'Actual knife skills AND a clean salsa lead in the same hour is suspiciously rare in LA. Tell me that wasn’t a fluke.',
    ],
    choices: [
      {
        text: 'Happy to prove both again: let me book us Friday dinner and claim the next dance.',
        reply: 'Confident and direct. Friday at eight is yours.',
        delta: 18,
      },
      {
        text: 'Wait until you see my risotto stir. Free Thursday night?',
        reply: 'Big talk! Expecting full proof very soon.',
        delta: 17,
      },
      {
        text: '💎 Zero flukes: 8 PM courtyard table is held for Friday, and I’m holding your hand walking in.',
        reply: 'Okay, that line just jumped you to the top of my week.',
        delta: 24,
        cost: 1,
        badge: 'Courtyard Lead',
      },
    ],
  },
  'sienna:velvet-palms-bbq': {
    venueLabel: 'Met at Sam’s Backyard BBQ',
    aiMeetContext:
      'HOW YOU MET: Offline at your nephew Sam’s Sunday backyard BBQ by the firepit over chilled rosé, where he stayed cool and confident right in front of Sam’s friends.',
    incomingMessages: [
      'My nephew Sam just sent me three eyeball emojis asking why you poured my rosé all night without flinching. Bold move at a family cookout.',
    ],
    choices: [
      {
        text: 'Sam will survive, I was much more interested in talking to his aunt. Dinner Friday?',
        reply: 'Haha fearless answer. Friday night works.',
        delta: 19,
      },
      {
        text: 'Zero reason to hide good taste. Let me take you somewhere proper away from fantasy-football talk.',
        reply: 'Music to my ears. Pick the spot and send the time.',
        delta: 18,
      },
      {
        text: '💎 Tell Sam I’m taking you out Friday at eight and walking in proud.',
        reply: 'Love a man who doesn’t act shy in daylight. Friday at eight.',
        delta: 25,
        cost: 1,
        badge: 'Zero Secrecy',
      },
    ],
  },
  'soren:palisades-racquet': {
    venueLabel: 'Met at Palisades Clay Courts',
    aiMeetContext:
      'HOW YOU MET: Offline subbing into twilight mixed doubles on Court 3 at Palisades Racquet Club.',
    incomingMessages: [
      'That cross-court volley at 5-all is still replaying in my head. Held us a quiet raw-bar table for Thursday at eight.',
    ],
    choices: [
      {
        text: 'Clean net play deserves chilled oysters. Thursday at eight works.',
        reply: 'Agreed. I’ll be waiting out front five minutes early.',
        delta: 18,
      },
      {
        text: 'Careful, architect, I’m just as competitive over wine lists as tiebreaks.',
        reply: 'Counting on it.',
        delta: 18,
      },
      {
        text: '💎 Thursday at eight is a yes, Søren, and rematch on clay Saturday morning.',
        reply: 'Court 3 is already booked for Saturday. See you Thursday night.',
        delta: 24,
        cost: 1,
        badge: 'Match Point',
      },
    ],
  },
  'brooke:palisades-racquet': {
    venueLabel: 'Met at Palisades Racquet Club',
    aiMeetContext:
      'HOW YOU MET: Offline on Court 1 at Palisades Racquet Club while your ex-husband Richard played on Court 4.',
    incomingMessages: [
      'Loved our mixed-doubles energy! Quick thing for Friday: wear a crisp navy blazer and sit facing Table 9 at 8:00 sharp when my ex Richard walks in, deal? ✨',
    ],
    choices: [
      {
        text: 'Wait, am I your actual Friday date or an unpaid stunt double for Richard?',
        reply: 'Omg don’t be dramatic, two things can be true at once!',
        delta: 16,
      },
      {
        text: 'Let’s ditch Richard’s steakhouse completely and grab drinks on the coast instead.',
        reply: 'Ugh nooo the whole point is the patio lighting near Table 9!',
        delta: 16,
      },
      {
        text: '💎 Spill the truth first: why does half the club whisper about Table 9 every Friday?',
        reply: 'Okay fine, Richard and his Wharton finance bros hold court there every week!',
        delta: 22,
        cost: 1,
        badge: 'Table 9 Probe',
      },
    ],
  },
  'marcus:st-jude-coffee': {
    venueLabel: 'Met at St. Jude Coffee Cart',
    aiMeetContext:
      'HOW YOU MET: Offline at 6:45 AM at the St. Jude hospital courtyard espresso cart splitting the last warm almond croissant after your night shift.',
    incomingMessages: [
      'Eight hours of sleep worked miracles, and I still owe you a whole almond croissant of your own. Let me take you to dinner Thursday.',
    ],
    choices: [
      {
        text: 'Glad you got real sleep. Pick your favorite cozy spot for Thursday at 7:30.',
        reply: 'Corner booth is locked in. Zero hospital pagers allowed.',
        delta: 18,
      },
      {
        text: 'Does a pitmaster actually let restaurants cook for him, or are you grading their smoke ring?',
        reply: 'Haha promise to behave until I smoke brisket for you on Date Two.',
        delta: 18,
      },
      {
        text: '💎 Thursday at 7:30 is a date, Marcus, bring that off-shift smile.',
        reply: 'Wouldn’t miss it for anything.',
        delta: 24,
        cost: 1,
        badge: 'Off-Shift Spark',
      },
    ],
  },
  'marcus:dawn-lap-pool': {
    venueLabel: 'Met at Dawn Lap Pool',
    aiMeetContext:
      'HOW YOU MET: Offline at 6:30 AM at the heated 50-meter Dawn Lap Pool laughing over the park ranger’s "wild cougars in New Jersey" announcement.',
    incomingMessages: [
      'Still laughing about that ranger yelling "no wild cougars in New Jersey" at 6:30 AM. Let me take you out properly Friday night, dry hair optional.',
    ],
    choices: [
      {
        text: 'Best wildlife PSA of the year. Friday at eight sounds great, swimmer.',
        reply: 'Table is booked, and zero chlorine within five miles.',
        delta: 18,
      },
      {
        text: 'Only if you promise not to time my courses with a lap watch.',
        reply: 'Stopwatch stays in the locker. Unhurried wine all night.',
        delta: 18,
      },
      {
        text: '💎 Friday at eight is yours, Marcus, pick a spot with real firelight.',
        reply: 'Done. Oak-fired patio corner is reserved.',
        delta: 24,
        cost: 1,
        badge: 'Lane-Four Spark',
      },
    ],
  },
  'priya:st-jude-coffee': {
    venueLabel: 'Met at St. Jude Courtyard',
    aiMeetContext:
      'HOW YOU MET: Offline at the 6:45 AM St. Jude espresso cart as she came off trauma night shift in navy scrubs and a leather jacket, teasing the spelling on your coffee sleeve.',
    incomingMessages: [
      'Just emerged from blackout-curtain hibernation and remembered you handled my 6:45 AM coffee-cup roast without folding. Those Friday tacos still real?',
    ],
    choices: [
      {
        text: '100% real. 7:30 Friday, spot is already picked so your off-duty brain can rest.',
        reply: 'Zero decision fatigue might actually be my love language.',
        delta: 19,
      },
      {
        text: 'Still recovering from you butchering my name before sunrise, redeem yourself over margaritas.',
        reply: 'Haha fair penalty. I’ll spell it right on the second round.',
        delta: 18,
      },
      {
        text: '💎 Tacos, spicy mezcal, and zero hospital talk all Friday night. Just show up.',
        reply: 'Sold. Best prescription I’ve read all week.',
        delta: 25,
        cost: 1,
        badge: 'Off-Duty Care',
      },
    ],
  },
  'summer:dawn-lap-pool': {
    venueLabel: 'Met at Dawn Smoothie Bar',
    aiMeetContext:
      'HOW YOU MET: Offline at Dawn Lap Pool & Smoothie Bar because he passed your Sacred Gym Earbuds Law, waiting until your AirPods were in the case before saying hello.',
    incomingMessages: [
      'Still impressed you passed the Sacred Gym Earbuds Test on try one. Did you remember neck SPF today or do I need to supervise over Friday drinks? ☀️',
    ],
    choices: [
      {
        text: 'Mineral SPF 50 applied at 7 AM sharp, Doctor. Let me book us Malibu drinks Friday at 7:30.',
        reply: 'Gold star and a yes to 7:30 in Malibu!',
        delta: 19,
      },
      {
        text: 'Better supervise in person over fish tacos and ocean air just to be clinically thorough.',
        reply: 'Haha strictly for clinical thoroughness, obviously. Friday works!',
        delta: 18,
      },
      {
        text: '💎 Oceanfront table is held for 7:45 Friday, Summer, earbuds strictly off the table.',
        reply: 'Deal. Full attention on you all evening ✨',
        delta: 24,
        cost: 1,
        badge: 'Earbuds Law Passed',
      },
    ],
  },
  'rory:cougarmarket': {
    venueLabel: 'Met in Aisle 4 • Cougarmarket',
    aiMeetContext:
      'HOW YOU MET: Offline in the fig-and-olive aisle at The Cougarmarket when you tapped her shoulder thinking she was your friend’s sister, blushed scarlet, and charmed your way out.',
    incomingMessages: [
      'Happy to report my ears have finally returned to a normal human color after Aisle 4. Still owe you that coastal trail walk or a proper glass of red!',
    ],
    choices: [
      {
        text: 'Start with a proper wine bar Thursday so I know you won’t mistake me for Hannah again.',
        reply: 'Never in a million years, could pick your smile out anywhere now.',
        delta: 18,
      },
      {
        text: 'Did that Manchego you swore by actually live up to the ranger hype?',
        reply: 'Top tier, saving the fig jam pairing for our picnic!',
        delta: 17,
      },
      {
        text: '💎 Book us a cozy patio for Friday at eight, ranger, British blush welcome.',
        reply: 'Friday at eight is locked in, muddy boots staying home, promise!',
        delta: 24,
        cost: 1,
        badge: 'Aisle-Four Charm',
      },
    ],
  },
  'camila:cougarmarket': {
    venueLabel: 'Met at The Cougarmarket',
    aiMeetContext:
      'HOW YOU MET: Offline by the figs and Rioja in Aisle 4 at The Cougarmarket while roasting the prowler carrying a single lime in an empty basket. You are an Executive Chef & Osteria Owner.',
    incomingMessages: [
      'Still celebrating meeting an actual cook in Aisle 4 instead of Empty-Basket Lime Guy on lap eight. Tell me honestly, did you sear that sea bass crispy?',
    ],
    choices: [
      {
        text: 'Crispy skin, peppery olive oil finish, and Monday night I’m cooking for the chef so you sit down.',
        reply: 'Careful, offering to cook on my Monday off is dangerously persuasive.',
        delta: 19,
      },
      {
        text: 'Came out great, though I’d rather taste the wood-fired menu at your osteria this week.',
        reply: 'Two seats at my kitchen pass are yours Thursday at 8:30.',
        delta: 18,
      },
      {
        text: '💎 Monday night off: chilled Albariño poured, sourdough warm, and zero pans for you, Chef.',
        reply: 'Sold. Nobody ever lets me sit on the guest side of the island.',
        delta: 25,
        cost: 1,
        badge: 'Chef Off-Duty',
      },
    ],
  },
};

export function getWildMeetCuteSeed(leadId: string, venueId?: string): WildMeetCuteSeed | undefined {
  if (venueId && WILD_MEET_SEEDS[`${leadId}:${venueId}`]) {
    return WILD_MEET_SEEDS[`${leadId}:${venueId}`];
  }
  const fallbackKey = Object.keys(WILD_MEET_SEEDS).find((k) => k.startsWith(`${leadId}:`));
  return fallbackKey ? WILD_MEET_SEEDS[fallbackKey] : undefined;
}
