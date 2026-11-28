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

export type WildFollowUpChoice =
  | {
      label: string;
      replyCue: string;
      bonus: number;
      isPoliteBrushOff?: false;
      isMemeFail?: false;
    }
  | {
      label: string;
      brushOffText: string;
      isPoliteBrushOff: true;
      isMemeFail?: false;
    }
  | {
      label: string;
      failText: string;
      isMemeFail: true;
      isPoliteBrushOff?: false;
    };

export interface WildFollowUpStep {
  stageLabel: string;
  prompt: string;
  spokenCue: string;
  choices: [WildFollowUpChoice, WildFollowUpChoice, WildFollowUpChoice];
}

export interface WildFollowUpSequence {
  beat2: WildFollowUpStep;
  beat3: WildFollowUpStep;
}

export interface WildRoomClue {
  icon: string;
  label: string;
  detail: string;
}

const WILD_ROOM_CLUES: Record<string, [WildRoomClue, WildRoomClue, WildRoomClue]> = {
  'velvet-room:her': [
    {
      icon: '👁️',
      label: 'Eye Contact',
      detail: 'Practiced 100-watt smile, angling his barstool toward yours a beat too smoothly.',
    },
    {
      icon: '💍',
      label: 'Left Hand',
      detail: 'Bare finger right now, except a pale tan line circles the base of his left ring finger.',
    },
    {
      icon: '⌚',
      label: 'Watch Check',
      detail: 'Checked his watch twice at 6:38 PM claiming "Tokyo markets just opened" (Tokyo opened at 5 PM).',
    },
  ],
  'velvet-room:him': [
    {
      icon: '👁️',
      label: 'Poker Face',
      detail: 'Classic executive poker face to deter creeps, until she catches your eye twice in the backbar mirror.',
    },
    {
      icon: '💍',
      label: 'Left Hand & Phone',
      detail: 'Statement emerald on her RIGHT hand only; phone placed face-down beside a three-olive Gibson.',
    },
    {
      icon: '🎧',
      label: 'Room Rule',
      detail: 'Savoring twenty quiet minutes off-duty: give a low-pressure note and an easy out, zero hovering.',
    },
  ],
  'hawthorne-campus:her': [
    {
      icon: '👁️',
      label: 'Body Angle',
      detail: 'Steps away from the faculty crowd holding two espressos, scanning specifically for your reaction.',
    },
    {
      icon: '💍',
      label: 'Left Hand',
      detail: 'Ink smudge on his cuff, zero ring, rolled linen sleeves despite the autumn drizzle.',
    },
    {
      icon: '🎧',
      label: 'Vibe Check',
      detail: 'Craves sharp intellectual pushback, whereas any "you speak so well for your age" pat kills the spark.',
    },
  ],
  'hawthorne-campus:him': [
    {
      icon: '⌚',
      label: 'Clock Rule',
      detail: ' Campus boundary is ironclad: never flirt before 5:00 PM when final grades seal with the registrar.',
    },
    {
      icon: '👁️',
      label: 'Posture Shift',
      detail: 'At 5:04 PM she caps her red pen, exhales, and lingers by the espresso urn instead of rushing to her car.',
    },
    {
      icon: '💍',
      label: 'Left Hand',
      detail: 'No wedding band; annotated Colette paperback tucked atop her leather folio.',
    },
  ],
  'terminal-b-airport:her': [
    {
      icon: '👁️',
      label: 'Effort Signal',
      detail: 'Tracked Flight 418 tail radar himself rather than waiting for you to text from baggage claim.',
    },
    {
      icon: '☕',
      label: 'Memory Tell',
      detail: 'Holding your exact hot oat cortado remembered from one brief chat at Jade’s party a month ago.',
    },
    {
      icon: '🧳',
      label: 'Intent Check',
      detail: 'Took both heavy bags in one hand, now test whether Jade drafted him or he is asking you out.',
    },
  ],
  'terminal-b-airport:him': [
    {
      icon: '👁️',
      label: 'Open Cue',
      detail: 'Closed her sculpture catalog during the 40-minute gate delay and tossed out an open-ended remark.',
    },
    {
      icon: '💍',
      label: 'Left Hand',
      detail: 'Silver desert cuff on her wrist, bare left ring finger, zero rush to FaceTime anyone.',
    },
    {
      icon: '🍸',
      label: 'Taste Tell',
      detail: 'Asked specifically about cocktail onions for a proper Gibson, never mention your mom or her age.',
    },
  ],
  'havana-salsa:her': [
    {
      icon: '👁️',
      label: 'Partner Hold',
      detail: 'Steady, unhurried lead on the cross-body turn while holding warm eye contact past the three-minute bell.',
    },
    {
      icon: '💍',
      label: 'Left Hand',
      detail: 'Calloused woodworker hands from his Silver Lake shop, completely bare left ring finger.',
    },
    {
      icon: '🎧',
      label: 'Self-Sabotage Trap',
      detail: 'He stepped into your rotation line on purpose, don’t pre-reject yourself with age-gap self-deprecation.',
    },
  ],
  'havana-salsa:him': [
    {
      icon: '👁️',
      label: 'Bounce-Back Cue',
      detail: 'Laughing openly across the prep island and looking to share the joke with someone competent.',
    },
    {
      icon: '💍',
      label: 'Left Hand & Knife',
      detail: 'No ring; watching closely to see who actually knows how to hold a chef’s knife vs. posing.',
    },
    {
      icon: '🚩',
      label: 'Instant Ick',
      detail: 'Any "cougar night" safari line gets you exiled straight to the dish pit.',
    },
  ],
  'palisades-racquet:her': [
    {
      icon: '👁️',
      label: 'Court Signal',
      detail: 'Passed up two younger guys by the bench to wave you onto his side of the net for mixed doubles.',
    },
    {
      icon: '💍',
      label: 'Left Hand',
      detail: 'Clean white wrist tape, bare left hand, relaxed Nordic dry humor.',
    },
    {
      icon: '🎾',
      label: 'Play Style',
      detail: 'Respects fearless net play and direct banter over timid sideline excuses.',
    },
  ],
  'palisades-racquet:him': [
    {
      icon: '👁️',
      label: 'Sightline Tell',
      detail: 'Glanced over your shoulder at Court 4 three times in sixty seconds where her ex Richard is serving.',
    },
    {
      icon: '📱',
      label: 'Phone Angle',
      detail: 'Framing her phone camera toward the cabana rail whenever Court 4 switches sides.',
    },
    {
      icon: '🕵️',
      label: 'Table 9 Link',
      detail: 'Keep your eyes open: is she into you, or recruiting a Friday patio prop across from Table 9?',
    },
  ],
  'st-jude-coffee:her': [
    {
      icon: '👁️',
      label: 'Character Tell',
      detail: 'Quietly paid for the exhausted triage nurse’s espresso ahead of him without making a show of it.',
    },
    {
      icon: '💍',
      label: 'Left Hand',
      detail: 'No ring; station jacket slung over one shoulder coming off a twelve-hour rescue shift.',
    },
    {
      icon: '🥐',
      label: 'Opening',
      detail: 'Asked you a playful either/or question about the last almond croissant, clear green light.',
    },
  ],
  'st-jude-coffee:him': [
    {
      icon: '👁️',
      label: 'Roast Reflex',
      detail: 'Trauma RN humor: playfully butchered your cup name at 6:45 AM to see if you have a sense of humor.',
    },
    {
      icon: '💍',
      label: 'Left Hand',
      detail: 'Bare left hand around an iced cardamom cold brew; leather jacket over navy scrubs.',
    },
    {
      icon: '🎧',
      label: 'Off-Duty Rule',
      detail: 'After twelve hours running trauma triage, she wants zero medical questions and zero decision fatigue.',
    },
  ],
  'left-bank-books:her': [
    {
      icon: '👁️',
      label: 'Stack Linger',
      detail: 'Stayed in the French fiction aisle instead of grabbing the book and walking to the register.',
    },
    {
      icon: '📖',
      label: 'Book Choice',
      detail: 'Reaching for Colette’s 1920 older-woman × younger-man classic Chéri with a knowing half-smile.',
    },
    {
      icon: '🍷',
      label: 'Easy Pivot',
      detail: 'Gallery prosecco is lukewarm; suggesting the quiet wine bar next door tests his spontaneity.',
    },
  ],
  'left-bank-books:him': [
    {
      icon: '👁️',
      label: 'Crowd Fatigue',
      detail: 'Polite glazed smile whenever guys in scarves recite press-release art jargon at her.',
    },
    {
      icon: '💍',
      label: 'Left Hand',
      detail: 'Sculptural silver ring on her index finger only; sipping dry prosecco solo.',
    },
    {
      icon: '🎨',
      label: 'Direct Prompt',
      detail: 'Explicitly asked you for one honest unpretentious observation, don’t bluff or name-drop.',
    },
  ],
  'dawn-lap-pool:her': [
    {
      icon: '👁️',
      label: 'Shared Laugh',
      detail: 'Caught your eye immediately when the park ranger yelled about "wild cougars in New Jersey."',
    },
    {
      icon: '💍',
      label: 'Left Hand',
      detail: 'Bare left hand pushing up swim goggles after a clean 1,500-meter set.',
    },
    {
      icon: '🏊',
      label: 'Timing Rule',
      detail: 'Wait until he is resting at the wall or smoothie counter, never grab a swimmer mid-flip-turn.',
    },
  ],
  'dawn-lap-pool:him': [
    {
      icon: '🎧',
      label: 'Sacred Earbuds',
      detail: 'Both white AirPods are firmly IN during cooldown: approaching mid-stretch is an automatic 99% gym fail.',
    },
    {
      icon: '👁️',
      label: 'Green Window',
      detail: 'Three minutes later at the smoothie bar she clicks both AirPods into the case and glances over.',
    },
    {
      icon: '💍',
      label: 'Left Hand',
      detail: 'No ring; mineral SPF 50 bottle in hand.',
    },
  ],
  'cougarmarket:her': [
    {
      icon: '👁️',
      label: 'Blush Tell',
      detail: 'Turned bright crimson to his ears after mistaking you from behind for his friend’s sister Hannah.',
    },
    {
      icon: '💍',
      label: 'Left Hand & Basket',
      detail: 'No ring; basket holds trail sourdough, Manchego, and black figs (real groceries, not a prowler prop).',
    },
    {
      icon: '🧀',
      label: 'Recovery Cue',
      detail: 'Stayed to banter instead of bolting down Aisle 5, tease him lightly without "kiddo" patting.',
    },
  ],
  'cougarmarket:him': [
    {
      icon: '👁️',
      label: 'Linger vs. Chore',
      detail: 'Paused past the Rioja rack and made a dry side-comment to you instead of pushing her cart away.',
    },
    {
      icon: '🛒',
      label: 'Prowler Contrast',
      detail: 'Just roasted the guy circling Aisle 4 for 40 minutes with one single lime in an empty basket.',
    },
    {
      icon: '💍',
      label: 'Left Hand',
      detail: 'Bare left hand; off-duty chef who respects men who actually cook dinner.',
    },
  ],
  'velvet-palms-bbq:her': [
    {
      icon: '👁️',
      label: 'Hostess Co-Sign',
      detail: 'Neighbor bestie Jade pre-vetted him and is practically cheering from the kitchen window.',
    },
    {
      icon: '💍',
      label: 'Left Hand & Craft',
      detail: 'No ring; brought a hand-joined walnut shelf he built himself and took over the grill calmly.',
    },
    {
      icon: '🍑',
      label: 'Direct Invite',
      detail: 'Waved you specifically to the cedar grill to taste-test the bourbon peaches before anyone else.',
    },
  ],
  'velvet-palms-bbq:him': [
    {
      icon: '👁️',
      label: 'Social Test',
      detail: 'Watching whether you stay cool and unbothered when her nephew Sam’s twenty-something friends walk by.',
    },
    {
      icon: '💍',
      label: 'Left Hand',
      detail: 'Divorced, thriving, bare left hand, fiercely protective of her peaceful Pasadena house.',
    },
    {
      icon: '🍷',
      label: 'Bounce-Back Cue',
      detail: 'Stepped away from fantasy-football noise to stand beside you by the firepit.',
    },
  ],
};

export function getWildRoomClues(
  venueId: string,
  role: 'her' | 'him',
): [WildRoomClue, WildRoomClue, WildRoomClue] {
  return (
    WILD_ROOM_CLUES[`${venueId}:${role}`] ?? [
      {
        icon: '👁️',
        label: 'Eye Contact',
        detail: 'Held eye contact twice and angled open instead of turning back to their phone.',
      },
      {
        icon: '💍',
        label: 'Left Hand',
        detail: 'Check for a ring or a 6:45 watch-check curfew before committing.',
      },
      {
        icon: '🎧',
        label: 'Exit Rule',
        detail: 'Keep the opener situational and leave a low-pressure out.',
      },
    ]
  );
}

const BESPOKE_WILD_FOLLOWUPS: Record<string, WildFollowUpSequence> = {
  'velvet-room:her': {
    beat2: {
      stageLabel: 'Beat 2 of 3 • Test the 6:45 Curfew Tell',
      prompt:
        'Graham slides closer with a velvet-smooth smile, yet that pale ring-tan line and 6:44 PM rush scream disguised weekday alibi. Read his story without tipping your hand.',
      spokenCue:
        '"Honestly I hate dating apps, Thursday early drinks at 5:30 are so much more civilized before my... late Tokyo calls."',
      choices: [
        {
          label:
            'Keep your poker face silk-smooth: "5:30 is fun, though I usually prefer Friday at 8:00 right here past Table 9."',
          replyCue:
            'Graham blinks once before recovering with a fast laugh: "Haha Fridays are tricky with deal closings, text me and we’ll figure it out!"',
          bonus: 10,
        },
        {
          label:
            'Smile dryly over your coupe: "Funny, most M&A guys take Tokyo calls at 5 PM Pacific, not 6:45."',
          replyCue:
            'Graham’s collar tightens half an inch as he chuckles: "Sharp memory! Let me give you my cell before I run."',
          bonus: 10,
        },
        {
          label:
            'Gush that an unavailable mystery man with a strict 6:44 PM bedtime sounds super romantic.',
          failText:
            'Buying a "6:45 PM Tokyo call" hook, line, and sinker walks you straight into married-finance-bro purgatory!',
          isMemeFail: true,
        },
      ],
    },
    beat3: {
      stageLabel: 'Beat 3 of 3 • Pocket the Number & Receipt',
      prompt:
        'It is 6:43 PM and Graham is already reaching for his coat. Lock his real cell number cleanly so you can expose or block his alibi in iMessage.',
      spokenCue:
        '"Driver’s outside, put your number in my phone quick so I can text you tomorrow!"',
      choices: [
        {
          label:
            'Have him text your phone right at the bar so you capture his real number and Table 9 receipt.',
          replyCue:
            'Your screen lights up as Graham sprints out at 6:44 PM sharp. Direct thread + clue unlocked!',
          bonus: 10,
        },
        {
          label:
            'Take his card and tap a quick one-word hello from your cell while clocking which exit car he climbs into.',
          replyCue:
            'Card pocketed, number verified, and zero illusions. Time to grill him in iMessage!',
          bonus: 10,
        },
        {
          label:
            'Offer to hop into his car right now to "keep him company during his Tokyo call."',
          failText:
            'Graham practically knocks over a barstool fleeing toward the valet stand before you even get his number!',
          isMemeFail: true,
        },
      ],
    },
  },
  'hawthorne-campus:her': {
    beat2: {
      stageLabel: 'Beat 2 of 3 • Mentor Zone vs. Real Spark',
      prompt:
        'Julian is beaming over his espresso, yet smart 27-year-old fellows get polite academic small talk from senior women constantly. He tests whether you actually see him as a man.',
      spokenCue:
        '"Most people at faculty receptions ask about my grant footnotes. Please tell me you’re rescuing me from campus talk tonight."',
      choices: [
        {
          label:
            'Make your intent unmistakable: "Zero footnotes after five o’clock. I was much more interested in the man giving the lecture."',
          replyCue:
            'Julian’s ears flush slightly under a delighted grin: "Thank God. Was hoping I wasn’t misreading that smile."',
          bonus: 10,
        },
        {
          label:
            'Hold playful eye contact: "Only if you promise not to treat dinner like an architectural symposium."',
          replyCue:
            'Julian sets his espresso cup down immediately: "Symposium officially adjourned."',
          bonus: 10,
        },
        {
          label:
            'Pivot nervously into offering to proofread his fellowship CV like an academic advisor.',
          failText:
            'Julian thanks you politely like a department chair and heads out in the rain. Never advisor-zone your own crush!',
          isMemeFail: true,
        },
      ],
    },
    beat3: {
      stageLabel: 'Beat 3 of 3 • The Low-Pressure Close',
      prompt:
        'Faculty stragglers are drifting toward the espresso table. Close the number cleanly in thirty seconds before a dean interrupts.',
      spokenCue:
        '"The department chair is heading straight toward us with budget binders. Quick, how do I find you off campus?"',
      choices: [
        {
          label:
            'Type your cell into Julian’s phone with a slow smile: "Text me tonight and pick a proper quiet Barolo spot for half seven."',
          replyCue:
            'Julian fires off an instant text to lock your screen in: "Half seven Thursday is officially ours."',
          bonus: 12,
        },
        {
          label:
            'Slip him your card and step cleanly toward the courtyard arch: "Message me once you escape the budget binders."',
          replyCue:
            'Your phone buzzes before you reach the quad steps: "Escaped in record time. Save Thursday for me."',
          bonus: 12,
        },
        {
          label:
            'Tell him to email your university office inbox next semester if he’s still around.',
          failText:
            'Routing a rainy-evening romance through an outlook calendar invite kills 100% of the tension!',
          isMemeFail: true,
        },
      ],
    },
  },
  'hawthorne-campus:him': {
    beat2: {
      stageLabel: 'Beat 2 of 3 • Read the Executive Poker Face',
      prompt:
        'Elena listens with composed, dry-humored poise. On Reddit, older women note they keep a calm poker face in public to filter out nervous validation-seekers.',
      spokenCue:
        '"Bold wager. Half the men under thirty who walk up after lectures either want a letter of recommendation or freeze up mid-sentence."',
      choices: [
        {
          label:
            'Stay completely unhurried: "Zero recommendations needed, Elena. I waited all week for 5:01 PM just to ask you out properly."',
          replyCue:
            'The faculty poker face melts into a warm, genuine smile: "First name, clean timing, and steady nerves. Impressive."',
          bonus: 10,
        },
        {
          label:
            'Match her dry wit: "Good thing my degree is long finished, I’m strictly auditing your taste in Sancerre."',
          replyCue:
            'Elena laughs softly, tilting her head: "Fair warning, my Sancerre standards are unforgiving."',
          bonus: 10,
        },
        {
          label:
            'Get rattled by her calm expression and apologize three times for "bothering a busy professor."',
          failText:
            'Over-apologizing when she was actively talking to you talks her right out of saying yes! Hold your frame calmly.',
          isMemeFail: true,
        },
      ],
    },
    beat3: {
      stageLabel: 'Beat 3 of 3 • Give Her the Clean Out',
      prompt:
        'Rain taps the gallery glass as Elena gathers her leather folio. Nail the adult low-pressure close: decisive plan, zero cornering.',
      spokenCue:
        '"I have a 6:00 PM dinner across town, though my Friday evening is mercifully unscheduled."',
      choices: [
        {
          label:
            'Offer your number on a clean slip with an easy exit: "Let me book an 8 PM corner table off campus Friday. Text me if you’re in, and enjoy dinner tonight."',
          replyCue:
            'Elena texts your phone right before stepping under her umbrella: "Decisive and zero hovering. Friday at eight."',
          bonus: 12,
        },
        {
          label:
            'Hand her your unlocked Contacts screen for ten seconds: "Put your personal cell in, I’ll send a quiet Westside wine bar by noon tomorrow."',
          replyCue:
            'Elena types her digits cleanly: "Noon confirmations are my favorite language."',
          bonus: 12,
        },
        {
          label:
            'Insist on walking all the way to her tonight’s restaurant in the rain while quizzing her on grading rubrics.',
          failText:
            'Shadowing someone into their existing 6 PM plans turns a smooth approach into an awkward hostage walk!',
          isMemeFail: true,
        },
      ],
    },
  },
  'terminal-b-airport:her': {
    beat2: {
      stageLabel: 'Beat 2 of 3 • Read His Real Intent',
      prompt:
        'Inside the quiet car, Miles hands you sparkling water. Off an app, you still do not know if he is just doing neighbor Jade a polite favor or actually pursuing you.',
      spokenCue:
        '"Jade swore you never let anyone handle logistics. Am I dropping you straight at your door, or are you actually free Friday?"',
      choices: [
        {
          label:
            'Test his intent directly: "Wait, did Jade draft you for airport rescue, or are you asking me out?"',
          replyCue:
            'Miles holds your gaze in the mirror: "Strictly asking you out. I volunteered the second Jade mentioned Flight 418."',
          bonus: 10,
        },
        {
          label:
            'Arch a brow over your espresso: "Depends. Do you track tail numbers for all of Jade’s friends?"',
          replyCue:
            'Miles laughs low in his chest: "Only the one I have been wanting to take to dinner all month."',
          bonus: 10,
        },
        {
          label:
            'Assume he is just doing neighborly charity, thank him like a rideshare driver, and pop your earbuds in.',
          failText:
            'Miles respects the boundary immediately, drops your bags at the gate with a polite wave, and drives off. Never friend-zone your own meet-cute!',
          isMemeFail: true,
        },
      ],
    },
    beat3: {
      stageLabel: 'Beat 3 of 3 • Smooth Number Close',
      prompt:
        'The car glides up to your curb. You have thirty seconds to lock his personal number cleanly before travel fatigue steals the spark.',
      spokenCue:
        '"Get real sleep tonight. Tell me how I reach you for Friday at 8:15."',
      choices: [
        {
          label:
            'Type your personal cell into his phone before stepping out: "Lock 8:15 for Friday. Text me when you get home."',
          replyCue:
            'Miles pockets his phone with a warm grin: "8:15 corner banquette is officially yours. Check your iMessage."',
          bonus: 12,
        },
        {
          label:
            'Keep the exit cinematic: "Put your number in mine, hold Friday at eight, and let me go shower off Terminal B."',
          replyCue:
            'Miles opens your door smoothly: "Best thirty-second close at LAX. Texting you in five."',
          bonus: 12,
        },
        {
          label:
            'Linger in the passenger seat for twenty-five minutes recounting every gate delay since Denver.',
          failText:
            'Traffic enforcement flashes lights behind the bumper as the romantic tension fizzles into travel complaints. Always exit on the high note!',
          isMemeFail: true,
        },
      ],
    },
  },
  'terminal-b-airport:him': {
    beat2: {
      stageLabel: 'Beat 2 of 3 • Polite Gate Chat vs. Real Intrigue',
      prompt:
        'Airport lounges breed friendly 20-minute travel chats that vanish at boarding. Watch Celeste’s bounce-back question to see if the door is genuinely open.',
      spokenCue:
        '"Most twenty-somethings in lounges put headphones on and stare at crypto charts. Are you heading to Palm Springs for business or trouble?"',
      choices: [
        {
          label:
            'Lean into the playful bounce-back: "Strictly good trouble, especially if Palm Springs comes with a gallery tour from the best-dressed woman in Terminal B."',
          replyCue:
            'Celeste’s eyes glint over her Gibson rim: "Flattery with good posture. Dangerous combination."',
          bonus: 10,
        },
        {
          label:
            'Keep it grounded and direct: "Weekend break, zero meetings, and hoping our conversation doesn’t end at Gate 24."',
          replyCue:
            'Celeste sets her glass down with a slow, pleased smile: "No reason it has to."',
          bonus: 10,
        },
        {
          label:
            'Take her crypto joke literally and spend twelve minutes explaining layer-two tokenomics.',
          failText:
            'Celeste politely checks her boarding pass and discovers an urgent phone call by the window. Read the cue!',
          isMemeFail: true,
        },
      ],
    },
    beat3: {
      stageLabel: 'Beat 3 of 3 • First-Class Boarding Call',
      prompt:
        'Group 1 boarding chimes over the terrace speaker. Close her number in fifteen seconds without rushing her down the jetway.',
      spokenCue:
        '"That’s my boarding group calling. Impress me before I pick up my carry-on."',
      choices: [
        {
          label:
            'Hand her your card with your cell written on back: "Text me when we land so I can take you to dinner properly on the Westside."',
          replyCue:
            'Your phone buzzes before she reaches the gate scanner: "Seat 2A approves. Thursday night is open."',
          bonus: 12,
        },
        {
          label:
            'Offer your unlocked phone cleanly: "Ten seconds for your number, and I’ll carry that catalog bag to the gate door."',
          replyCue:
            'Celeste taps her personal cell in smoothly: "Chivalry lives in Terminal B."',
          bonus: 12,
        },
        {
          label:
            'Ask the gate agent loudly to swap your middle economy seat into her row uninvited.',
          failText:
            'Hijacking someone’s peaceful flight seat before Date #1 violates every rule of grown-adult space!',
          isMemeFail: true,
        },
      ],
    },
  },
  'velvet-room:him': {
    beat2: {
      stageLabel: 'Beat 2 of 3 • Ring Check & Intent Pivot',
      prompt:
        'Claire glances up from her three-olive Gibson with dry amusement. In a hotel bar, half the crowd is married or killing time before a client dinner.',
      spokenCue:
        '"Bold note. Are you waiting on a corporate group at Table 9, or drinking solo on purpose?"',
      choices: [
        {
          label:
            'Signal clear single intent: "Solo on purpose, zero ring, and much more interested in the woman by the piano."',
          replyCue:
            'Claire’s mouth curves: "Direct, single, and observant. Already beating ninety percent of downtown."',
          bonus: 10,
        },
        {
          label:
            'Keep it playful: "Zero client dinner, zero curfew. Just checking if your wit matches that Gibson order."',
          replyCue:
            'Claire sets her glass down cleanly: "Good answer. I despise men with 6:45 curfews."',
          bonus: 10,
        },
        {
          label:
            'Play it way too safe and mumble, "Oh haha just networking before my buddies show up, ma’am!"',
          failText:
            'Claire nods once, turns back to the pianist, and closes her tab. "Networking + ma’am" is an instant IRL brush-off!',
          isMemeFail: true,
        },
      ],
    },
    beat3: {
      stageLabel: 'Beat 3 of 3 • Leave on the High Note',
      prompt:
        'Her car service texts that her driver is out front. If you hover too long you spoil the poise; if you hesitate she vanishes into Manhattan Beach.',
      spokenCue:
        '"My car is downstairs. You have fifteen seconds to pitch Thursday properly."',
      choices: [
        {
          label:
            'Hand her your phone unlocked to Contacts: "Quiet leather banquette Thursday at 7:45. I will handle the spot."',
          replyCue:
            'Claire types her personal cell in ten seconds flat: "Bold handwriting and decisive plans. Text me tomorrow."',
          bonus: 12,
        },
        {
          label:
            'Stand up as she gathers her clutch: "Take my card, Counselor, or better yet let me text you the Thursday pin right now."',
          replyCue:
            'Claire taps her number into your screen with a slow smile: "Don’t be late."',
          bonus: 12,
        },
        {
          label:
            'Ask to split an Uber home together right now so you can keep talking about mergers.',
          failText:
            'Claire laughs dryly at the elevator doors: "Never rush a good first act, rookie." Rewind and close cleanly!',
          isMemeFail: true,
        },
      ],
    },
  },
  'havana-salsa:her': {
    beat2: {
      stageLabel: 'Beat 2 of 3 • Dance-Class Friendly vs. Real Pursuit',
      prompt:
        'Salsa socials are full of friendly dancers who spin everyone warmly and go home solo. Watch how Rafael lingers when the rotation bell rings.',
      spokenCue:
        '"Technically the bell says rotate one partner left... unless you’re conspiring to skip the rotation with me at the courtyard bar."',
      choices: [
        {
          label:
            'Meet his eyes with zero hesitation: "Definitely conspiring. Buy me an agua fresca on the patio."',
          replyCue:
            'Rafael’s grin lights up the terracotta courtyard as he guides you smoothly off the floor.',
          bonus: 10,
        },
        {
          label:
            'Tease him lightly: "Bold mutiny against the instructor, Rafael. Prove your conversation matches your lead."',
          replyCue:
            'Rafael laughs, pulling two patio stools into the lantern light: "Happily."',
          bonus: 10,
        },
        {
          label:
            'Assume he says that to every partner in class and wave him briskly down the line.',
          failText:
            'You rotated away from a man literally asking to ditch class with you! Read the linger signal!',
          isMemeFail: true,
        },
      ],
    },
    beat3: {
      stageLabel: 'Beat 3 of 3 • Lock Friday Without Rushing',
      prompt:
        'The band wraps its final set at 9:45 PM. Close the real date plan cleanly while keeping your Thursday night peace.',
      spokenCue:
        '"I have a 7 AM walnut slab delivery tomorrow, otherwise I’d keep talking all night. Can I take you to dinner Friday?"',
      choices: [
        {
          label:
            'Swap numbers cleanly: "Love a man with real morning work. Put your cell in and text me Friday’s spot by noon."',
          replyCue:
            'Rafael texts you on the spot with a warm squeeze of your hand: "Noon Friday confirmation, promise."',
          bonus: 12,
        },
        {
          label:
            'Tap your number into his phone: "8 PM Friday works, zero three-minute bells allowed."',
          replyCue:
            'Rafael’s smile stays with you all the way to your car: "Whole evening is yours."',
          bonus: 12,
        },
        {
          label:
            'Test him with passive-aggressive games by refusing to swap numbers and saying "find me next month if you mean it."',
          failText:
            'Grown romance dies on cryptic guessing games. When a high-EQ man asks clearly, lock the digits!',
          isMemeFail: true,
        },
      ],
    },
  },
  'havana-salsa:him': {
    beat2: {
      stageLabel: 'Beat 2 of 3 • Group Banter vs. One-on-One Spark',
      prompt:
        'Cooking classes are easy for group laughs, harder for pivoting cleanly into one-on-one romantic intent without making the station awkward.',
      spokenCue:
        '"Okay, best knife work at this island by a mile. Did a girlfriend teach you that julienne, or do you actually cook for yourself?"',
      choices: [
        {
          label:
            'Catch her subtle availability check cleanly: "Very single, cook four nights a week, and happy to prove it properly on Friday."',
          replyCue:
            'Sienna’s hazel-green eyes warm immediately: "Caught my subtle question AND answered it cleanly. Ten points."',
          bonus: 10,
        },
        {
          label:
            'Smile straight at her: "Strictly solo kitchen right now, though I’m much better cooking for someone who appreciates good olive oil."',
          replyCue:
            'Sienna clinks her Albariño glass lightly against yours: "Smooth answer."',
          bonus: 10,
        },
        {
          label:
            'Miss her single-check completely and brag for five minutes about your ex-girlfriend’s culinary school.',
          failText:
            'Bringing up an ex the exact second a gorgeous woman checks if you are single is tragic clock management!',
          isMemeFail: true,
        },
      ],
    },
    beat3: {
      stageLabel: 'Beat 3 of 3 • Patio Close Before the Crowd',
      prompt:
        'Class lets out onto the string-lit courtyard. Step up decisively before six classmates crowd around with Instagram handles.',
      spokenCue:
        '"Everyone’s trading group-chat links, though I barely check Instagram DMs."',
      choices: [
        {
          label:
            'Skip social media completely and offer your phone: "Real phone numbers only. Let me book us an 8 PM Friday table."',
          replyCue:
            'Sienna types her personal cell in with a grin: "Thank goodness, an adult who uses actual text messages."',
          bonus: 12,
        },
        {
          label:
            'Hand her your number on a tasting card with zero pressure: "Text me tomorrow if Friday wine sounds better than group chats."',
          replyCue:
            'Your phone chimes before you hit the sidewalk: "Much better. Friday at eight."',
          bonus: 12,
        },
        {
          label:
            'Ask for her Snapchat username so you can "start a streak."',
          failText:
            'Asking an accomplished 38-year-old designer for a Snapchat streak deals instant, irreversible psychic damage!',
          isMemeFail: true,
        },
      ],
    },
  },
  'palisades-racquet:her': {
    beat2: {
      stageLabel: 'Beat 2 of 3 • Nordic Dry Wit vs. Flirtation',
      prompt:
        'Courtside on the terrace, Søren towels off calmly. Scandinavian understatement can read cool until you test the subtext directly.',
      spokenCue:
        '"Most partners in Palisades play safe lob shots all evening. You went straight down the line on match point."',
      choices: [
        {
          label:
            'Hold his ice-blue gaze: "I don’t play safe shots on or off the court, Søren. Still brave enough for dinner?"',
          replyCue:
            'A slow, unmistakable smirk breaks across Søren’s face: "Counted on it."',
          bonus: 10,
        },
        {
          label:
            'Clink tonic glasses lightly: "Only when my partner actually covers his half of the net."',
          replyCue:
            'Søren leans closer against the cabana rail: "Wait until you see how I handle Thursday reservations."',
          bonus: 10,
        },
        {
          label:
            'Misread his calm Nordic cadence as boredom and abruptly excuse yourself to the parking lot.',
          failText:
            'Calm eye contact without frantic chatter is confidence, not boredom! Stay in the pocket.',
          isMemeFail: true,
        },
      ],
    },
    beat3: {
      stageLabel: 'Beat 3 of 3 • Lock the Raw-Bar Wager',
      prompt:
        'Twilight settles over the clay courts. Seal the date cleanly in twenty seconds.',
      spokenCue:
        '"Eight o’clock Thursday by the water. Give me your number so I send the pin instead of guessing."',
      choices: [
        {
          label:
            'Type your cell into his phone cleanly: "Thursday at eight. Send the pin by noon so I dress accordingly."',
          replyCue:
            'Søren sends a crisp confirmation text on the spot: "Pin incoming. Looking forward to Thursday."',
          bonus: 12,
        },
        {
          label:
            'Let him text you right there by the cabana: "Deal, architect, and Saturday morning rematch on Court 3."',
          replyCue:
            'Your phone buzzes immediately: "Court 3 reserved. Thursday dinner first."',
          bonus: 12,
        },
        {
          label:
            'Insist on splitting a post-match protein shake audit of the entire club roster for forty minutes.',
          failText:
            'Overstaying after clinching the Thursday date drains the mystery. Take the win and glide out!',
          isMemeFail: true,
        },
      ],
    },
  },
  'palisades-racquet:him': {
    beat2: {
      stageLabel: 'Beat 2 of 3 • Decipher the Ex-Husband Sightline',
      prompt:
        'Brooke hands you an Aperol spritz, yet her eyes flick toward Court 4 again as her ex Richard walks toward the clubhouse. Test what game you are actually in.',
      spokenCue:
        '"Ugh, Palisades is such a fishbowl. Tell me you’re free Friday at 8:00 for patio steaks right by Table 9?"',
      choices: [
        {
          label:
            'Call the play with amused poise: "Happy to grab a drink, Brooke, as long as I’m your date and not a billboard for Court 4."',
          replyCue:
            'Brooke blinks, then lets out a startled real laugh: "Okay, sharp eyes! Give me your number anyway, trouble."',
          bonus: 8,
        },
        {
          label:
            'Play cool recon: "Table 9 sounds famous around here. Put your number in and tell me why everyone whispers about it."',
          replyCue:
            'Brooke leans in conspiratorially: "Text me tonight and I might spill the whole club tea."',
          bonus: 8,
        },
        {
          label:
            'Volunteer to walk over to Court 4 right now and challenge her silver-haired ex-husband to singles.',
          failText:
            'Starting country-club turf wars for a woman using you as divorce theater gets you banned by security!',
          isMemeFail: true,
        },
      ],
    },
    beat3: {
      stageLabel: 'Beat 3 of 3 • Grab the Number & Table 9 Clue',
      prompt:
        'Richard heads into the locker room and Brooke’s performance energy instantly drops two notches. Lock her digits cleanly so you keep all the leverage.',
      spokenCue:
        '"Anyway, dash time before traffic! Put your number in quick, handsome."',
      choices: [
        {
          label:
            'Have her text your cell on the spot so you verify her real number and log the Table 9 clue.',
          replyCue:
            'Screen buzzes with Brooke’s sparkle emoji text. Direct thread unlocked, stay sharp in iMessage!',
          bonus: 10,
        },
        {
          label:
            'Swap numbers in ten seconds without promising to wear her requested "revenge blazer" yet.',
          replyCue:
            'Digits locked in with your dignity 100% intact. Watch her Friday staging demands in chat!',
          bonus: 10,
        },
        {
          label:
            'Offer to carry her racquet bag around the parking lot filming TikTok transitions.',
          failText:
            'Never audition as unpaid social-media crew on Court 1! Keep your self-respect.',
          isMemeFail: true,
        },
      ],
    },
  },
  'st-jude-coffee:her': {
    beat2: {
      stageLabel: 'Beat 2 of 3 • Polite First-Responder Manners vs. Spark',
      prompt:
        'Marcus is naturally warm to everyone in a two-block radius. Read whether he’s just being a Southern gentleman or genuinely lingered for you.',
      spokenCue:
        '"Normally I’m asleep in my truck, uh, parked at home, by 7:15 AM, yet somehow I’m still sitting on this bench."',
      choices: [
        {
          label:
            'Catch that cue warmly: "Glad you stayed five extra minutes, Marcus. When is your next night off shift?"',
          replyCue:
            'Marcus’s shoulders drop into an easy, unmistakable grin: "Off Thursday and Friday both, and hoping you’d ask."',
          bonus: 10,
        },
        {
          label:
            'Smile over your coffee: "Sounds like we owe this almond croissant a proper sequel when you’re rested."',
          replyCue:
            'Marcus nods immediately: "Count on it. Dinner with actual plates."',
          bonus: 10,
        },
        {
          label:
            'Say "Well don’t let an old lady keep you from your nap!" and shoo him off the bench.',
          failText:
            'Calling yourself "an old lady" to a 30-year-old man actively flirting with you at sunrise is tragic self-sabotage!',
          isMemeFail: true,
        },
      ],
    },
    beat3: {
      stageLabel: 'Beat 3 of 3 • Post-Shift Clean Close',
      prompt:
        'His shift relief waves from across the courtyard. Close his number cleanly so he gets real sleep and wakes up excited to text you.',
      spokenCue:
        '"Before my brain turns into pumpkin foam, let me get your number properly."',
      choices: [
        {
          label:
            'Type your cell into his phone: "Go get eight hours of sleep, firefighter, and text me tonight for Thursday dinner."',
          replyCue:
            'Marcus taps a quick heart-eyed hello text to your screen: "Best shift handoff all year."',
          bonus: 12,
        },
        {
          label:
            'Take his number with a warm smile: "Sleep first, I’ll text you this evening so Thursday is easy."',
          replyCue:
            'Marcus grins all the way across the brick courtyard as your iMessage thread unlocks.',
          bonus: 12,
        },
        {
          label:
            'Keep him talking on the bench for ninety more minutes while he’s running on zero sleep.',
          failText:
            'Holding a night-shift paramedic hostage after a 12-hour tour drains the battery! Let him rest and text tonight.',
          isMemeFail: true,
        },
      ],
    },
  },
  'st-jude-coffee:him': {
    beat2: {
      stageLabel: 'Beat 2 of 3 • Survive the Shit-Test Without Folding',
      prompt:
        'Priya sips her iced cardamom coffee, testing whether your confidence holds up when she isn’t coddling your ego.',
      spokenCue:
        '"Bold offering Friday tacos before seven AM. Most younger guys talk big in line and then text \'so what do u wanna do\' four days later."',
      choices: [
        {
          label:
            'Back it up with zero fluff: "No \'wyd\' texts from me. 7:30 Friday, quiet corner booth, mezcal and street tacos handled."',
          replyCue:
            'Priya’s eyebrows lift in genuine approval: "Okay, actual follow-through is dangerously attractive."',
          bonus: 10,
        },
        {
          label:
            'Grin calmly: "Your job is making hundred-mile-an-hour decisions all night. Friday night your only job is showing up."',
          replyCue:
            'Priya lets out a soft exhale and smiles for real: "You have no idea how rare that sentence is."',
          bonus: 10,
        },
        {
          label:
            'Backpedal nervously: "Totally no pressure, whatever restaurant you research and book works for me!"',
          failText:
            'Dumping restaurant homework right back onto an exhausted charge nurse kills the whole pitch!',
          isMemeFail: true,
        },
      ],
    },
    beat3: {
      stageLabel: 'Beat 3 of 3 • Respect Her Sleep Window',
      prompt:
        'Priya’s ride pulls up to the hospital loop. Lock the number in ten seconds and respect her daytime blackout-curtain sleep.',
      spokenCue:
        '"Blackout curtains are calling my name until 4 PM. Don’t blow up my phone while I’m asleep."',
      choices: [
        {
          label:
            'Hand her your unlocked phone: "Put your number in, sleep great, and I’ll send one clean Friday confirmation at 5 PM."',
          replyCue:
            'Priya types her personal cell in ten seconds flat: "5 PM sharp. Don’t forget."',
          bonus: 12,
        },
        {
          label:
            'Give her your number with an easy smile: "Zero double-texts while you sleep. Ping me when you’re up."',
          replyCue:
            'Priya texts you one word ("Locked.") before climbing into her car with a grin.',
          bonus: 12,
        },
        {
          label:
            'Promise not to text, then immediately send four memes and a question mark at 9:15 AM.',
          failText:
            'Waking up a night-shift trauma nurse with anxious double-texts is an instant block!',
          isMemeFail: true,
        },
      ],
    },
  },
  'left-bank-books:her': {
    beat2: {
      stageLabel: 'Beat 2 of 3 • Literary Banter vs. Real Date Intent',
      prompt:
        'Next door at the courtyard bar, Julian turns the paperback of Chéri in his hands, watching your eyes to make sure the flirtation is mutual.',
      spokenCue:
        '"Confession: I spotted you by the cello quartet ten minutes before you reached the French fiction shelf."',
      choices: [
        {
          label:
            'Reward his honesty with a slow smile: "Then it’s a very good thing we reached for the same book, Julian."',
          replyCue:
            'Julian’s grin is pure London charm: "Best stroke of luck I’ve had in California."',
          bonus: 10,
        },
        {
          label:
            'Raise your glass playfully: "Ten minutes of recon? Glad you finally made your move."',
          replyCue:
            'Julian clinks his glass gently against yours: "Worth every second of working up the nerve."',
          bonus: 10,
        },
        {
          label:
            'Laugh it off awkwardly and say "Oh stop, you’re just being polite to a neighborhood regular!"',
          failText:
            'Brushing off a direct, vulnerable confession as "just being polite" slams the door shut on his courage!',
          isMemeFail: true,
        },
      ],
    },
    beat3: {
      stageLabel: 'Beat 3 of 3 • Seal the Chapter-Four Wager',
      prompt:
        'First-Friday crowds start spilling into the wine bar. Close the real dinner date while the moment is intimate.',
      spokenCue:
        '"Let me take you to a proper quiet table this week so we aren’t shouting over gallery cellos."',
      choices: [
        {
          label:
            'Swap numbers smoothly: "Half seven Thursday. Text me the spot and bring your verdict on chapter four."',
          replyCue:
            'Julian texts you immediately with a warm smile: "Bookmarking chapter four for Thursday night."',
          bonus: 12,
        },
        {
          label:
            'Put your cell in his phone: "Friday night works, pick somewhere with real candles and good Rioja."',
          replyCue:
            'Your phone buzzes with Julian’s message before you slip your coat on. Number pulled!',
          bonus: 12,
        },
        {
          label:
            'Suggest just "running into each other at next month’s First-Friday reading" without trading numbers.',
          failText:
            'Waiting thirty days for fate when chemistry is right across the table is a felony against romance!',
          isMemeFail: true,
        },
      ],
    },
  },
  'left-bank-books:him': {
    beat2: {
      stageLabel: 'Beat 2 of 3 • Hold Frame Past the Age-Gap Test',
      prompt:
        'Out by the courtyard fountain, Celeste appraises you with amused silver-fox poise to see if you get weird about the age difference.',
      spokenCue:
        '"You have a good eye and good manners. Tell me honestly, do you realize I opened my first Palm Springs gallery the year you were in grade school?"',
      choices: [
        {
          label:
            'Smile without a trace of flinching: "Which explains why you’re effortlessly the most interesting woman in the courtyard."',
          replyCue:
            'Celeste laughs warmly, eyes shining: "Zero hesitation and zero weirdness. Very well played."',
          bonus: 10,
        },
        {
          label:
            'Keep it light and confident: "Good thing we’re both grown adults drinking prosecco in 2026 then."',
          replyCue:
            'Celeste tilts her glass toward you: "Cleanest answer in Los Angeles."',
          bonus: 10,
        },
        {
          label:
            'Get flustered and blurt out, "Yeah crazy right, I’ve never talked to an older lady before, bucket list!!"',
          failText:
            '"Older lady + bucket list" is the fastest way on earth to get left standing alone by a fountain!',
          isMemeFail: true,
        },
      ],
    },
    beat3: {
      stageLabel: 'Beat 3 of 3 • Respect Her Sanctuary & Close',
      prompt:
        'Celeste’s town car pulls up by the gallery curb. Close Thursday drinks cleanly without invading her space.',
      spokenCue:
        '"I’m heading back up to my quiet house in the hills now. How bold is your Thursday calendar?"',
      choices: [
        {
          label:
            'Offer your unlocked phone cleanly: "Thursday at 7:45 for two icy Gibsons. Put your number in and I’ll book the corner booth."',
          replyCue:
            'Celeste taps her personal cell into your phone with a radiant smile: "See you Thursday, darling."',
          bonus: 12,
        },
        {
          label:
            'Hand her your card and open her car door smoothly: "Text me tomorrow if Thursday evening works, get home safe."',
          replyCue:
            'Your screen lights up thirty seconds later from the backseat: "Classy exit. Thursday at eight."',
          bonus: 12,
        },
        {
          label:
            'Invite yourself up to her hills sanctuary tonight at 10:30 PM on zero notice.',
          failText:
            'Rule #1 of r/datingoverforty: an accomplished woman’s peaceful house is a fortress, never self-invite on Night Zero!',
          isMemeFail: true,
        },
      ],
    },
  },
  'dawn-lap-pool:her': {
    beat2: {
      stageLabel: 'Beat 2 of 3 • Gym Buddy Nod vs. Real Chemistry',
      prompt:
        'At the towel rack, Marcus hands you a cold electrolyte water. Morning lap pools are full of friendly regulars, so check if he means real dinner.',
      spokenCue:
        '"I swim Lane 4 every Tuesday and Friday, though I was hoping I wouldn’t have to wait until Tuesday to talk to you again."',
      choices: [
        {
          label:
            'Match his directness warmly: "You definitely don’t have to wait until Tuesday. Take me somewhere dry this weekend."',
          replyCue:
            'Marcus’s dimpled smile widens instantly: "Friday at eight, zero goggles required."',
          bonus: 10,
        },
        {
          label:
            'Tease him lightly: "Good thing, because my hair looks significantly better at a wine bar than Lane 3."',
          replyCue:
            'Marcus laughs softly: "Hard to imagine improving on right now, though I’d love to see for myself."',
          bonus: 10,
        },
        {
          label:
            'Fist-bump his shoulder and say "See ya around the pool deck, champ!" before walking into the locker room.',
          failText:
            'Fist-bumping a 6\'1" firefighter calling him "champ" puts both of you straight into the buddy zone!',
          isMemeFail: true,
        },
      ],
    },
    beat3: {
      stageLabel: 'Beat 3 of 3 • Quick Locker-Room Exit Close',
      prompt:
        'Morning work commuters are heading for the showers. Swap numbers in twenty seconds before routine takes over.',
      spokenCue:
        '"Grabbing my keys from Locker 12, put your number in so I can lock Friday down today."',
      choices: [
        {
          label:
            'Type your cell into his phone cleanly: "Text me by lunchtime with your favorite Friday spot, Marcus."',
          replyCue:
            'Marcus sends an instant wave emoji so you have his cell: "Lunchtime confirmation incoming."',
          bonus: 12,
        },
        {
          label:
            'Have him text your line right by the smoothie counter: "Friday at eight is a date."',
          replyCue:
            'Screen lights up cleanly. Personal iMessage unlocked!',
          bonus: 12,
        },
        {
          label:
            'Tell him you never give out your number before six weeks of lap-lane small talk.',
          failText:
            'Six weeks of 6:30 AM chlorine small talk is how somebody else snaps him up by Saturday!',
          isMemeFail: true,
        },
      ],
    },
  },
  'dawn-lap-pool:him': {
    beat2: {
      stageLabel: 'Beat 2 of 3 • Keep It Ultra-Low Pressure at the Gym',
      prompt:
        'Because you waited until Summer took her AirPods out at the smoothie counter, she is actually smiling. Keep it breezy so she never feels cornered at her own gym.',
      spokenCue:
        '"Seriously, gold star for waiting until the earbuds came out. Do you live out toward Malibu or just swim here?"',
      choices: [
        {
          label:
            'Answer warmly and keep it light: "Ten minutes down the coast, and happy to meet you in Malibu for sunset tacos if you’re free Friday."',
          replyCue:
            'Summer’s smile turns unmistakably flirty: "Smooth, local, and decisive. Love that."',
          bonus: 10,
        },
        {
          label:
            'Match her sunny energy: "Close enough that a Friday oceanfront drink requires zero 405 freeway heroics."',
          replyCue:
            'Summer laughs: "Zero 405 traffic might be the hottest pickup line in Southern California."',
          bonus: 10,
        },
        {
          label:
            'Launch into an intense critique of her reformer Pilates form to sound athletic.',
          failText:
            'Unsolicited form-coaching at the smoothie bar evaporates your earbud goodwill in three seconds flat!',
          isMemeFail: true,
        },
      ],
    },
    beat3: {
      stageLabel: 'Beat 3 of 3 • The Zero-Awkwardness Gym Close',
      prompt:
        'Rule #1 of approaching at a gym or pool: give an effortless out so even if schedules clash, Lane 3 stays zero-awkwardness.',
      spokenCue:
        '"My first dermatology consult starts at 8:30, so I have sixty seconds before I sprint."',
      choices: [
        {
          label:
            'Hand her your number with zero pressure: "Take mine so you aren’t late for clinic, text me if Friday Malibu drinks sound fun."',
          replyCue:
            'Summer texts you ten seconds later walking to her car: "Already texting so you have mine too ☀️"',
          bonus: 12,
        },
        {
          label:
            'Offer your Contacts screen for ten seconds: "Drop your cell in and go crush your 8:30, I’ll text a Malibu spot tonight."',
          replyCue:
            'Summer taps her number in with a bright grin: "Talk tonight!"',
          bonus: 12,
        },
        {
          label:
            'Follow her all the way to her car door talking while she’s visibly rushing for clinic.',
          failText:
            'Never walk someone down to their car uninvited at a gym when they just said they have 60 seconds!',
          isMemeFail: true,
        },
      ],
    },
  },
  'cougarmarket:her': {
    beat2: {
      stageLabel: 'Beat 2 of 3 • Disarm the Cute Panic',
      prompt:
        'Rory is still pink-eared beside the fig display, clearly smitten now that you turned around, yet terrified of overstepping in a grocery aisle.',
      spokenCue:
        '"Right, full honesty since I’ve already embarrassed myself: I’m Rory, very single, and relieved you weren’t Hannah’s sister."',
      choices: [
        {
          label:
            'Give him an unmistakable green light: "Very single too, Rory, and your recovery is charming enough to earn a glass of wine."',
          replyCue:
            'Rory lights up like golden hour on Hampstead Heath: "Best grocery run of my entire life."',
          bonus: 10,
        },
        {
          label:
            'Smile warmly into his eyes: "Good honesty. Tell me you’re free Thursday evening when neither of us is pushing a cart."',
          replyCue:
            'Rory’s shoulders relax into an easy grin: "Wide open Thursday."',
          bonus: 10,
        },
        {
          label:
            'Give a tight, one-word polite "Thanks" and push your cart briskly toward frozen foods.',
          failText:
            'In grocery-store code, a closed one-word reply + moving cart tells a respectful guy to leave you alone immediately!',
          isMemeFail: true,
        },
      ],
    },
    beat3: {
      stageLabel: 'Beat 3 of 3 • Checkout Line Number Swap',
      prompt:
        'Register 3 opens up ahead of you. Close the number cleanly before bagging groceries breaks the spell.',
      spokenCue:
        '"Before Register 3 steals you away, let me put my number in your phone properly."',
      choices: [
        {
          label:
            'Hand Rory your phone with a playful smile: "Put your number in and text me your favorite coastal wine bar tonight."',
          replyCue:
            'Rory types his cell in and beams as your screen chimes: "Counting down to Thursday!"',
          bonus: 12,
        },
        {
          label:
            'Tap your digits into his screen: "Text me once those figs make it home safely, ranger."',
          replyCue:
            'Your phone buzzes before the cashier scans your olive oil. Direct iMessage unlocked!',
          bonus: 12,
        },
        {
          label:
            'Panic when a neighbor walks down Aisle 4 and pretend Rory works at the cheese counter.',
          failText:
            'Treating a sweet 24-year-old park ranger like secret contraband in Aisle 4 crushes the vibe!',
          isMemeFail: true,
        },
      ],
    },
  },
  'cougarmarket:him': {
    beat2: {
      stageLabel: 'Beat 2 of 3 • Friendly Shopper vs. Open Door',
      prompt:
        'In grocery aisles, women make polite food remarks all the time without wanting to be hit on. Watch Camila’s follow-up to see if she extends the beat.',
      spokenCue:
        '"Good pick on the Spanish arbequina oil. Wait, are you cooking sea bass for two tonight, or flying solo?"',
      choices: [
        {
          label:
            'Catch her open-ended availability check smoothly: "Solo tonight, Chef, unless I convince you to let me cook for you on your Monday off."',
          replyCue:
            'Camila’s dark eyes flash with genuine delight: "Bold offer! Nobody ever cooks for the chef."',
          bonus: 10,
        },
        {
          label:
            'Hold warm eye contact: "Strictly solo right now, though I’d love to take you for a glass of Rioja when your kitchen closes."',
          replyCue:
            'Camila leans an elbow on her cart handle, smiling: "Now that is how you talk in Aisle 4."',
          bonus: 10,
        },
        {
          label:
            'Miss her cue completely, say "Yep just meal prepping macros, bye!" and sprint to self-checkout.',
          failText:
            'She literally asked if you were cooking for two or solo! Don’t sprint away from an open door!',
          isMemeFail: true,
        },
      ],
    },
    beat3: {
      stageLabel: 'Beat 3 of 3 • Low-Pressure Aisle 4 Close',
      prompt:
        'Frozen gelato in Camila’s basket is starting to soften. Close in twenty seconds with zero aisle-blocking.',
      spokenCue:
        '"My pistachio gelato is melting, handsome. Make your move."',
      choices: [
        {
          label:
            'Offer your unlocked phone cleanly: "Ten seconds for your number so your gelato survives, and Monday dinner is on me."',
          replyCue:
            'Camila taps her personal cell in with a wicked grin: "Text me tomorrow, sous-chef."',
          bonus: 12,
        },
        {
          label:
            'Slip her your number with an easy grin: "Save the gelato, text me tonight, and I’ll book Thursday drinks."',
          replyCue:
            'Your phone buzzes before you reach your car: "Gelato saved, number saved."',
          bonus: 12,
        },
        {
          label:
            'Block the entire olive bar for fifteen minutes asking for free restaurant recipes.',
          failText:
            'Turning a hot grocery meet-cute into unpaid culinary consulting melts the gelato and the spark!',
          isMemeFail: true,
        },
      ],
    },
  },
  'velvet-palms-bbq:her': {
    beat2: {
      stageLabel: 'Beat 2 of 3 • Confirm It Isn’t Just Hostess Courtesy',
      prompt:
        'Backyard cookouts are warm and social. Make sure Rafael isn’t just being polite to Jade’s best friend while working the grill.',
      spokenCue:
        '"Full disclosure: when Jade said you might come over tonight, I volunteered to bring the grill wood in about four seconds flat."',
      choices: [
        {
          label:
            'Reward that confession with a slow, unmistakable smile: "Best thing Jade has arranged all year, Rafael."',
          replyCue:
            'Rafael’s eyes crinkle warmly in the string light: "Wait until you see what I plan without a crowd around."',
          bonus: 10,
        },
        {
          label:
            'Clink your glass softly against his: "Four seconds? Sounds like you owe me a real one-on-one dinner this week."',
          replyCue:
            'Rafael grins: "Friday at eight, already had a courtyard spot in mind."',
          bonus: 10,
        },
        {
          label:
            'Turn bright red and loudly announce to the whole patio that you’re "retiring to bed at 8:15 with magnesium tea."',
          failText:
            'Protecting your bedtime is sacred, ejecting mid-flirt out of sheer nerves is optional! Stay for two more minutes.',
          isMemeFail: true,
        },
      ],
    },
    beat3: {
      stageLabel: 'Beat 3 of 3 • Lock the Friday Date & Protect Your Peace',
      prompt:
        'It’s 9:30 PM on Sunday and your peaceful king bed next door is calling. Pull his number cleanly and exit like a queen.',
      spokenCue:
        '"Walk you across the cul-de-sac before the party gets loud?"',
      choices: [
        {
          label:
            'Let him walk you to your gate, swap numbers cleanly, and lock Friday at 8:00 before heading inside solo.',
          replyCue:
            'Rafael kisses the back of your hand at the gate as your phone buzzes with his text: "Sleep well. Friday is ours."',
          bonus: 12,
        },
        {
          label:
            'Put your cell in his phone by the firepit: "Text me tomorrow with Friday’s plan, woodworker."',
          replyCue:
            'Jade beams from the porch as Rafael locks your number in with a grin.',
          bonus: 12,
        },
        {
          label:
            'Ghost out the side hedge without saying goodbye so you don’t seem "too eager."',
          failText:
            'Irish-exiting a man who built shelves and grilled peaches to meet you leaves him thinking you hated him!',
          isMemeFail: true,
        },
      ],
    },
  },
  'velvet-palms-bbq:him': {
    beat2: {
      stageLabel: 'Beat 2 of 3 • Public Poise Around Peer Friends',
      prompt:
        'Sam and two buddies walk past the firepit tossing sidelong grins. Sienna watches quietly: nothing kills age-gap attraction faster than a younger guy acting sheepish around his peers.',
      spokenCue:
        '"Careful, Sam’s friends are staring like you just stole the family rosé."',
      choices: [
        {
          label:
            'Don’t flinch an inch, top off her glass calmly: "Let them stare. Best conversation at this party isn’t even close."',
          replyCue:
            'Sienna’s smile turns electric: "Unbothered in broad daylight. You have no idea how rare that is."',
          bonus: 10,
        },
        {
          label:
            'Nod easily to Sam and turn your full attention right back to Sienna: "Sam knows I have good taste."',
          replyCue:
            'Sienna laughs softly into her glass: "Smooth and zero juvenile weirdness."',
          bonus: 10,
        },
        {
          label:
            'Take three giant steps backward when your friends look over and pretend you were inspecting the rain gutters.',
          failText:
            'Acting like you got caught stealing cookies the second your buddies walk by is an instant Dump!',
          isMemeFail: true,
        },
      ],
    },
    beat3: {
      stageLabel: 'Beat 3 of 3 • Respect Her Sunday Sanctuary',
      prompt:
        'Sienna sets her empty glass down at 9:45 PM. Classic Living-Apart-Together boundary: she loves great company and loves going home to her own quiet bed.',
      spokenCue:
        '"Alright, Sunday social battery officially spent. I’m escaping before someone starts karaoke."',
      choices: [
        {
          label:
            'Walk her out to her car and offer your phone cleanly: "Let me take you to a real 8 PM Friday dinner, zero backyard crowds."',
          replyCue:
            'Sienna taps her personal number into your screen with a warm look: "Friday at eight. Text me tomorrow."',
          bonus: 12,
        },
        {
          label:
            'Give her your number with a calm smile: "Enjoy your quiet Sunday night, Sienna. Let me plan Friday if you’re free."',
          replyCue:
            'Your phone buzzes as her taillights pull away: "Love a man who respects a 9:45 exit. Friday works."',
          bonus: 12,
        },
        {
          label:
            'Beg her to stay until 1 AM drinking warm seltzers with Sam’s roommates.',
          failText:
            'Trying to drag a 39-year-old woman into a 1 AM roommate hang after she called time is rookie self-destruction!',
          isMemeFail: true,
        },
      ],
    },
  },
};

const WILD_APPROACHABILITY_READS: Record<
  string,
  { status: 'green' | 'caution'; headline: string; rule: string }
> = {
  'velvet-room:her': {
    status: 'caution',
    headline: 'TRAP SIGNAL: Pale Ring-Tan Line + Fake 6:45 Tokyo Alibi',
    rule: 'He IS approachable, because he is hunting a weekday secret! Stay cool, pocket his real cell for receipts, and never buy his curfew excuse.',
  },
  'velvet-room:him': {
    status: 'green',
    headline: 'OPEN WINDOW (Narrow): Bare Ring Finger + Backbar Mirror Glance',
    rule: 'She is decompressing solo and open to a sharp younger man, provided you never hover, ask her to reassure your age, or overstay her car call.',
  },
  'hawthorne-campus:her': {
    status: 'green',
    headline: 'GREEN LIGHT: Two Espressos + Singled You Out Off-Lectern',
    rule: 'Julian wants romantic banter, not academic mentoring. Signal unmistakable woman-to-man spark and swap personal numbers.',
  },
  'hawthorne-campus:him': {
    status: 'green',
    headline: 'GREEN LIGHT (Post-5:00 PM Only): Grades Sealed + Lingering by Urn',
    rule: 'Elena is approachable now that grades posted. Hold confident adult frame without asking if she "ever dates younger men" or pushing past her 6 PM dinner.',
  },
  'terminal-b-airport:her': {
    status: 'green',
    headline: 'HIGH-INTENT PURSUIT: Tracked Tail Radar + Remembered Cortado',
    rule: 'Miles volunteered specifically to ask you out. Verify his intent directly without brushing him off as Jade’s errand boy.',
  },
  'terminal-b-airport:him': {
    status: 'green',
    headline: 'GREEN LIGHT: Catalog Closed + Open-Ended Gibson Remark',
    rule: 'Celeste tossed you a conversational handkerchief during the delay. Match her dry wit and offer your card before Group 1 boards.',
  },
  'havana-salsa:her': {
    status: 'green',
    headline: 'GREEN LIGHT: Held Frame Past the Three-Minute Rotation Bell',
    rule: 'Friendly dancers rotate on the bell; Rafael lingered to ditch class with you. Accept warmly and swap real digits.',
  },
  'havana-salsa:him': {
    status: 'green',
    headline: 'GREEN LIGHT: Subtle Single-Check ("Did a Girlfriend Teach You?")',
    rule: 'When an older woman asks if a girlfriend taught you to cook, she is checking if you are single! Answer clearly and skip Instagram.',
  },
  'palisades-racquet:her': {
    status: 'green',
    headline: 'GREEN LIGHT: Waved You Onto His Side Over Two Younger Players',
    rule: 'Søren’s dry Nordic calm is pure confidence, not disinterest. Match his bold baseline energy and lock Thursday dinner.',
  },
  'palisades-racquet:him': {
    status: 'caution',
    headline: 'AGENDA WARNING: Three Court-4 Glances Toward Ex-Husband Richard',
    rule: 'Brooke wants you in Richard’s sightline for Table 9 divorce theater. Call the play with amused poise so you keep your dignity.',
  },
  'st-jude-coffee:her': {
    status: 'green',
    headline: 'GREEN LIGHT: Lingering Past Post-Shift Nap Time for You',
    rule: 'A tired night-shift paramedic only stays on a bench at 7 AM when he is smitten. Ask his off-shift night and let him go sleep.',
  },
  'st-jude-coffee:him': {
    status: 'green',
    headline: 'GREEN LIGHT: Playful Cup-Name Roast = Trauma-RN Flirting',
    rule: 'Priya teases to test your spine. Propose a zero-decision Friday taco plan and respect her daytime blackout-curtain sleep.',
  },
  'left-bank-books:her': {
    status: 'green',
    headline: 'GREEN LIGHT: Ten-Minute Recon + Colette’s Chéri Callback',
    rule: 'He lingered in French fiction specifically to meet you. Reward his nerve warmly and lock a candlelit Thursday table.',
  },
  'left-bank-books:him': {
    status: 'green',
    headline: 'GREEN LIGHT: Testing Whether Her Age Gap Rattles You',
    rule: 'When Celeste mentions opening her gallery while you were in grade school, smile unbothered and never ask for reassurance.',
  },
  'dawn-lap-pool:her': {
    status: 'green',
    headline: 'GREEN LIGHT: Explicitly Said He Didn’t Want to Wait Until Tuesday',
    rule: 'That is a textbook off-app ask-out cue. Confirm weekend drinks warmly and swap numbers before commuters crowd the deck.',
  },
  'dawn-lap-pool:him': {
    status: 'green',
    headline: 'GREEN LIGHT (Smoothie Counter Only): AirPods Clicked Into Case',
    rule: 'Never approach mid-set; at the counter keep it breezy and hand HER your number so Lane 3 stays zero-pressure.',
  },
  'cougarmarket:her': {
    status: 'green',
    headline: 'GREEN LIGHT: Stayed Blushing to Confess He Is Single',
    rule: 'A guy who only made a mistake bolts down Aisle 5; Rory stayed to flirt. Give him a clear green light before checkout.',
  },
  'cougarmarket:him': {
    status: 'green',
    headline: 'GREEN LIGHT: "Cooking for Two or Solo?" Availability Check',
    rule: 'Polite shoppers talk olive oil and walk away; Camila checked if you are single. Offer to cook on her Monday off!',
  },
  'velvet-palms-bbq:her': {
    status: 'green',
    headline: 'GREEN LIGHT: Hostess Pre-Vetted + Volunteered in Four Seconds',
    rule: 'Jade set the alley-oop and Rafael stepped right in. Lock Friday one-on-one dinner before heading to your quiet bed.',
  },
  'velvet-palms-bbq:him': {
    status: 'green',
    headline: 'DAYLIGHT POISE TEST: Watching How You Act Around Twenty-Somethings',
    rule: 'Show zero sheepishness when Sam’s friends look over, and respect her 9:45 PM Sunday exit boundary.',
  },
};

export function getWildApproachabilityRead(
  venueId: string,
  role: 'her' | 'him',
): { status: 'green' | 'caution'; headline: string; rule: string } {
  return (
    WILD_APPROACHABILITY_READS[`${venueId}:${role}`] ?? {
      status: 'green',
      headline: 'GREEN LIGHT: Open Posture + Second Glance Confirmed',
      rule: 'Signal calm romantic intent and offer a low-pressure phone number swap.',
    }
  );
}

const WILD_SUBTLE_MISREADS: Record<
  string,
  {
    beat2Label: string;
    beat2BrushOff: string;
    beat3Label: string;
    beat3BrushOff: string;
  }
> = {
  'velvet-room:her': {
    beat2Label:
      'Confront him heatedly about the pale ring-tan line before getting his last name or phone number.',
    beat2BrushOff:
      'Tipping your hand too early lets Graham toss cash on the bar and vanish before you log his real digits or Table 9 receipt!',
    beat3Label:
      'Let him promise to "message you on Instagram tomorrow" without capturing his real phone number.',
    beat3BrushOff:
      'A burner handle gives you zero Table 9 leverage. Make him text your phone directly at the bar!',
  },
  'velvet-room:him': {
    beat2Label:
      'Ask hesitantly: "Wait, be honest, would an M&A partner like you actually go out with a younger guy?"',
    beat2BrushOff:
      'Claire sighs softly over her Gibson: asking her to validate your age insecurity flips you from intriguing man to nervous audition.',
    beat3Label:
      'Ask for her Instagram handle while hovering beside her stool as her car waits downstairs.',
    beat3BrushOff:
      'Claire slips her phone into her clutch: "I don’t do Instagram roster games." Offer a real phone number and a decisive 7:45 plan!',
  },
  'hawthorne-campus:her': {
    beat2Label:
      'Keep your tone strictly collegial and ask which academic journal is publishing his paper.',
    beat2BrushOff:
      'Julian reads your polite faculty tone as "zero romantic interest" and steps back respectfully. Drop a clear flirtatious cue!',
    beat3Label:
      'Suggest connecting on academic LinkedIn first before trading personal phone numbers.',
    beat3BrushOff:
      'LinkedIn networking drains 100% of the rainy-afternoon chemistry before the dean arrives!',
  },
  'hawthorne-campus:him': {
    beat2Label:
      'Ask self-consciously: "Do you ever date younger men, or am I way out of bounds asking?"',
    beat2BrushOff:
      'Elena’s warm smile cools into polite professor distance: never make her defend liking younger men before Date #1!',
    beat3Label:
      'Press her to cancel her 6:00 PM dinner across town so you can grab drinks right this second.',
    beat3BrushOff:
      'Pushing past an accomplished woman’s stated 6 PM commitment reads impatient. Pitch Friday cleanly and give her an easy exit!',
  },
  'terminal-b-airport:her': {
    beat2Label:
      'Keep the ride strictly about LAX traffic and weather so you don’t risk misreading Jade’s favor.',
    beat2BrushOff:
      'Playing ultra-neutral convinces Miles you only wanted a polite ride home! Test his romantic intent directly.',
    beat3Label:
      'Say "Tell Jade to set up a group dinner for all of us sometime next month!" at the curb.',
    beat3BrushOff:
      'Routing a one-on-one spark back through a group hang stalls the momentum cold. Lock Friday at 8:15 directly!',
  },
  'terminal-b-airport:him': {
    beat2Label:
      'Ask curiously: "So do women in Palm Springs actually date guys in their twenties?"',
    beat2BrushOff:
      'Celeste arches a silver brow: turning a natural connection into an age-gap survey breaks the spell immediately.',
    beat3Label:
      'Ask if you can follow her gallery’s public Instagram page to stay in touch.',
    beat3BrushOff:
      'Following a business account puts you in customer limbo with 14,000 strangers. Hand her your personal number cleanly!',
  },
  'havana-salsa:her': {
    beat2Label:
      'Say "Let’s finish three more partner rotations first so the instructor doesn’t notice!"',
    beat2BrushOff:
      'By the fourth bell the courtyard crowd swallows the moment. When a great man invites a patio mutiny, take it!',
    beat3Label:
      'Tell him to "just drop into Thursday salsa again next week" instead of trading numbers.',
    beat3BrushOff:
      'Leaving Friday dinner up to next week’s class attendance lets a ten-out-of-ten spark cool off!',
  },
  'havana-salsa:him': {
    beat2Label:
      'Play coy when she asks about a girlfriend: "Haha a gentleman never tells, gotta keep some mystery!"',
    beat2BrushOff:
      'Sienna reads "mystery" as "has a girlfriend at home" and turns back to the prep island. Confirm you are single clearly!',
    beat3Label:
      'Join the six classmates crowding around to drop your Instagram @ in the class group chat.',
    beat3BrushOff:
      'She literally just told you she barely checks Instagram DMs! Step up with real phone numbers.',
  },
  'palisades-racquet:her': {
    beat2Label:
      'Laugh nervously and ask if twenty-six-year-old guys only invite older partners for mixed-doubles strategy.',
    beat2BrushOff:
      'Putting age doubt in his mouth stalls a man who already picked you over the whole patio. Own the baseline!',
    beat3Label:
      'Tell Søren to message you through the club’s pickleball booking app ladder.',
    beat3BrushOff:
      'Club ladder notifications are for 7 AM court fees, not oyster dates. Swap real iMessage digits!',
  },
  'palisades-racquet:him': {
    beat2Label:
      'Pretend you didn’t notice Court 4 at all and gush that Table 9 sounds super romantic.',
    beat2BrushOff:
      'Walking blind into Brooke’s ex-husband crossfire turns you into an unpaid prop! Clock the Court 4 tell with dry humor.',
    beat3Label:
      'Promise right now to wear whatever outfit she texts you for Friday’s patio parade.',
    beat3BrushOff:
      'Agreeing to wardrobe staging hands away all your leverage before the first text!',
  },
  'st-jude-coffee:her': {
    beat2Label:
      'Keep it polite and brief: "Have a good sleep after your shift!" and turn back to your phone.',
    beat2BrushOff:
      'Marcus takes your phone turn as a polite brush-off and heads to his truck. Catch his bench linger cue!',
    beat3Label:
      'Insist on hammering out exact Thursday restaurant menus right now while he is exhausted off a 12-hour shift.',
    beat3BrushOff:
      'Making a sleep-deprived paramedic plan logistics at 7:15 AM drains the magic. Grab his cell and let him rest!',
  },
  'st-jude-coffee:him': {
    beat2Label:
      'Get defensive about your cup spelling and ask if she’s always this intimidating to younger guys.',
    beat2BrushOff:
      'Priya smirks into her cold brew: taking playful trauma-RN banter personally fails her reflex check!',
    beat3Label:
      'Tell her you will call around noon just to check if she woke up early.',
    beat3BrushOff:
      'She explicitly said blackout curtains until 4 PM! Honor her sleep window and confirm at 5 PM sharp.',
  },
  'left-bank-books:her': {
    beat2Label:
      'Ask teasingly if Colette’s Chéri is required reading for "young guys looking for a cougar."',
    beat2BrushOff:
      'Labeling a sincere 27-year-old romantic with internet tropes makes Julian worry you aren’t taking him seriously.',
    beat3Label:
      'Give him your email address instead of your phone number to "keep things old-fashioned."',
    beat3BrushOff:
      'Email threads feel like university admin! Trade personal cell numbers while the wine bar glow is hot.',
  },
  'left-bank-books:him': {
    beat2Label:
      'Try too hard to sound older by claiming you actually hate everyone in your own generation.',
    beat2BrushOff:
      'Celeste sees right through the "I’m so mature I hate my peers" routine. Quiet unbothered confidence wins!',
    beat3Label:
      'Ask if you can walk her up to her car and keep chatting for twenty more minutes at the curb.',
    beat3BrushOff:
      'When her town car is already idling at the curb, lingering stalls a graceful close. Lock Thursday in ten seconds!',
  },
  'dawn-lap-pool:her': {
    beat2Label:
      'Assume "talk to you before Tuesday" just means swapping swim workouts and reply with a thumbs-up.',
    beat2BrushOff:
      'Minimalist gym replies read like "please don’t hit on me here" to a respectful man. Match his directness!',
    beat3Label:
      'Ask him to hold your phone while you search through damp swim gear for three minutes.',
    beat3BrushOff:
      'Locker-room rush swallows slow fumbles. Type your digits cleanly in fifteen seconds!',
  },
  'dawn-lap-pool:him': {
    beat2Label:
      'Ask her right at the smoothie counter what year she graduated college to figure out the age gap.',
    beat2BrushOff:
      'Summer raises one eyebrow: quizzing a woman’s graduation year at 7 AM kills breezy Malibu chemistry!',
    beat3Label:
      'Insist she type her number into your phone and text you back before leaving so you know it’s real.',
    beat3BrushOff:
      'With 60 seconds before her 8:30 clinic, demanding an on-the-spot verification text feels pushy. Hand her YOUR number cleanly!',
  },
  'cougarmarket:her': {
    beat2Label:
      'Joke that you are "way outside his usual age bracket" to test if he pushes harder.',
    beat2BrushOff:
      'In a grocery aisle, respectful guys treat "outside your bracket" as a polite no and back off! Give a real green light.',
    beat3Label:
      'Tell him you shop here most Sundays at six if he wants to try bumping into you again.',
    beat3BrushOff:
      'Grocery-aisle roulette fails nine times out of ten. Put his number in your phone before Register 3!',
  },
  'cougarmarket:him': {
    beat2Label:
      'Try to impress the chef by lecturing her for four minutes on smoke points of Sicilian olive oils.',
    beat2BrushOff:
      'Camila smiles tightly: Cubsplaining olive oil to a woman who owns an osteria turns spark into comedy!',
    beat3Label:
      'Ask if you can drop by her restaurant kitchen unannounced Friday night during dinner rush.',
    beat3BrushOff:
      'Ambushing a chef during Friday dinner service is chaos! Swap personal digits while respecting her melting gelato.',
  },
  'velvet-palms-bbq:her': {
    beat2Label:
      'Downplay it in front of the patio: "Oh, Jade exaggerates, go mingle with the rest of the party!"',
    beat2BrushOff:
      'Sending him away when he just confessed volunteering in four seconds reads like rejection!',
    beat3Label:
      'Invite him straight inside for a midnight nightcap even though your 9:30 Sunday sanctuary battery is spent.',
    beat3BrushOff:
      'Overriding your own peaceful Sunday boundary creates Monday regret. Pull his number at the gate and keep him excited for Friday!',
  },
  'velvet-palms-bbq:him': {
    beat2Label:
      'Call Sam’s twenty-something friends over to the firepit to get their approval of the vibe.',
    beat2BrushOff:
      'Turning private firepit chemistry into a buddy-group huddle evaporates Sienna’s intrigue immediately!',
    beat3Label:
      'Ask to follow her home tonight at 9:45 PM right after she said her social battery is spent.',
    beat3BrushOff:
      'Ignoring a clear "social battery spent" cue fails Rule #1 of grown-up dating. Walk her to her car and book Friday!',
  },
};

export function getWildFollowUpSequence(
  venueId: string,
  role: 'her' | 'him',
  leadName: string,
  isTrapLead = false,
): WildFollowUpSequence {
  const key = `${venueId}:${role}`;
  if (BESPOKE_WILD_FOLLOWUPS[key]) {
    const base = BESPOKE_WILD_FOLLOWUPS[key];
    const misread = WILD_SUBTLE_MISREADS[key];
    if (!misread) return base;
    return {
      beat2: {
        ...base.beat2,
        choices: [
          base.beat2.choices[0],
          {
            label: misread.beat2Label,
            brushOffText: misread.beat2BrushOff,
            isPoliteBrushOff: true,
          },
          base.beat2.choices[2],
        ],
      },
      beat3: {
        ...base.beat3,
        choices: [
          base.beat3.choices[0],
          {
            label: misread.beat3Label,
            brushOffText: misread.beat3BrushOff,
            isPoliteBrushOff: true,
          },
          base.beat3.choices[2],
        ],
      },
    };
  }

  if (isTrapLead) {
    return {
      beat2: {
        stageLabel: 'Beat 2 of 3 • Probe the Off-App Story',
        prompt: `You opened smoothly, yet off an app nobody wears a relationship-status label. ${leadName} glances subtly toward the exit clock while smiling at you.`,
        spokenCue: `"Honestly I barely use apps anymore, spontaneous weekday escapes are much more exciting, don’t you think?"`,
        choices: [
          {
            label: `Smile warmly while testing the tell: "Spontaneous is great, as long as nobody is hiding a 6:45 curfew."`,
            replyCue: `${leadName} laughs a half-beat too fast: "Haha zero curfews, just crazy schedule math! Let’s grab a drink."`,
            bonus: 8,
          },
          {
            label: `Keep your poker face calm: "Weekday drinks work if you actually stay past one glass."`,
            replyCue: `${leadName} leans in eagerly: "Deal, let me give you my direct line so we can lock it in."`,
            bonus: 8,
          },
          {
            label: `Interrogate ${leadName} loudly in front of three strangers before getting a single clue.`,
            failText: `${leadName} excuses themselves immediately to "take a call" and slips out the side door before you get the receipt!`,
            isMemeFail: true,
          },
        ],
      },
      beat3: {
        stageLabel: 'Beat 3 of 3 • Pocket the Number & Receipt',
        prompt: `${leadName} is ready to swap numbers before rushing off. Lock the thread cleanly so you can investigate their story over text.`,
        spokenCue: `"Here, put your number in before I have to dash, let’s do this week!"`,
        choices: [
          {
            label: `Swap numbers smoothly in ten seconds and clock every detail as ${leadName} heads out.`,
            replyCue: `Number locked into your phone with zero suspicion. Time to test those excuses in iMessage!`,
            bonus: 10,
          },
          {
            label: `Let ${leadName} text your line right there so you verify it isn’t a fake digits brush-off.`,
            replyCue: `Your screen lights up immediately. Direct thread unlocked!`,
            bonus: 10,
          },
          {
            label: `Fumble your phone on silent mode and tell them to "just find me on LinkedIn later."`,
            failText: `Nobody follows up via LinkedIn after a cocktail bar meet-cute! Rewind and grab the real digits.`,
            isMemeFail: true,
          },
        ],
      },
    };
  }

  if (role === 'her') {
    return {
      beat2: {
        stageLabel: 'Beat 2 of 3 • Friendly Chat or Real Flirt?',
        prompt: `${leadName} is smiling warmly, yet in real life younger men often hold back out of respect unless they know you are single and open to flirting.`,
        spokenCue: `"Not going to lie, I was hoping you would say something. Are you just killing five minutes, or can I steal your attention properly?"`,
        choices: [
          {
            label: `Drop the green handkerchief clearly: "Very single, not rushing anywhere, and enjoying your company."`,
            replyCue: `You can practically see ${leadName}’s shoulders relax into a confident grin: "Best news I have heard all week."`,
            bonus: 10,
          },
          {
            label: `Hold playful eye contact: "Depends whether you are being polite or working up the nerve to ask me out."`,
            replyCue: `${leadName} laughs without looking away: "Definitely working up the nerve, and glad you caught it."`,
            bonus: 10,
          },
          {
            label: `Panic mid-flirt and pivot into talking like his career mentor about five-year resumes.`,
            failText: `The electric tension turns instantly into a polite informational interview. Keep it romantic, not corporate!`,
            isMemeFail: true,
          },
        ],
      },
      beat3: {
        stageLabel: 'Beat 3 of 3 • Exit High & Pull the Number',
        prompt: `Chemistry is unmistakable. Close the number cleanly inside ninety seconds before the moment drags into awkward small talk.`,
        spokenCue: `"I don’t want to hold up your whole day, though I would hate to walk out of here without your number."`,
        choices: [
          {
            label: `Tap your cell into ${leadName}’s phone with a warm smile: "Text me tonight and pitch a proper Thursday spot."`,
            replyCue: `${leadName} sends a quick hello text on the spot so you have his line: "Thursday is already mine."`,
            bonus: 12,
          },
          {
            label: `Let him take the lead cleanly: "Take my number, pick somewhere quiet with good wine, and impress me."`,
            replyCue: `${leadName} grins ear to ear as your phone buzzes with his contact card.`,
            bonus: 12,
          },
          {
            label: `Wave vaguely and say "Maybe we will bump into each other here again sometime!" without swapping info.`,
            failText: `Leaving a real-world spark up to fate in Los Angeles traffic has a 2% survival rate! Grab the number!`,
            isMemeFail: true,
          },
        ],
      },
    };
  }

  return {
    beat2: {
      stageLabel: 'Beat 2 of 3 • Check Availability & Signal Poise',
      prompt: `${leadName} laughed at your opener, yet accomplished women get friendly small talk all day. You need to read if she is available and signal calm romantic intent.`,
      spokenCue: `"Most guys around here either stare from thirty feet away or launch a rehearsed speech. Which one are you?"`,
      choices: [
        {
          label: `Hold unhurried eye contact: "Neither. Just a grown man hoping you aren’t spoken for."`,
          replyCue: `${leadName}’s eyes warm with genuine surprise: "Happily unspoken for, and good recovery."`,
          bonus: 10,
        },
        {
          label: `Match her dry wit: "Zero speeches promised. Just wanted two minutes to see if you were free this week."`,
          replyCue: `${leadName} tilts her head with a pleased smile: "Direct and normal. Rare combination."`,
          bonus: 10,
        },
        {
          label: `Lose your nerve and blurt out, "Oh no speech, you just remind me of my favorite aunt!"`,
          failText: `Calling an attractive woman your "favorite aunt" in the wild is an automatic ejection seat!`,
          isMemeFail: true,
        },
      ],
    },
    beat3: {
      stageLabel: 'Beat 3 of 3 • 60-Second Number Close',
      prompt: `You passed her availability and vibe check. Propose a decisive next move and step away smoothly before overstaying her personal time.`,
      spokenCue: `"Alright, you have thirty seconds before I head out. What are you proposing?"`,
      choices: [
        {
          label: `Offer your phone cleanly: "Let me take you for a proper 7:45 drink Thursday. Put your number in and I will handle the table."`,
          replyCue: `${leadName} types her personal cell in smoothly: "Text me the address tomorrow, and don’t be late."`,
          bonus: 12,
        },
        {
          label: `Give her zero-pressure control: "Take my number so I stop interrupting your afternoon, and let me plan Friday if you’re free."`,
          replyCue: `Your phone buzzes ten seconds later with a text from ${leadName}: "Good manners. Friday looks promising."`,
          bonus: 12,
        },
        {
          label: `Ask "So idk what do u usually like to do, wanna hang out whenever?" while hovering in her path.`,
          failText: `Vague "wanna hang whenever" energy kills a strong cold approach at the one-yard line. Be decisive!`,
          isMemeFail: true,
        },
      ],
    },
  };
}

export function getWildMeetCuteSeed(leadId: string, venueId?: string): WildMeetCuteSeed | undefined {
  if (venueId && WILD_MEET_SEEDS[`${leadId}:${venueId}`]) {
    return WILD_MEET_SEEDS[`${leadId}:${venueId}`];
  }
  const fallbackKey = Object.keys(WILD_MEET_SEEDS).find((k) => k.startsWith(`${leadId}:`));
  return fallbackKey ? WILD_MEET_SEEDS[fallbackKey] : undefined;
}
