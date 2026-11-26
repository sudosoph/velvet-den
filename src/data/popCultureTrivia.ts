export interface PopCultureTriviaQuestion {
  id: string;
  badge: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  funFact: string;
}

export const POP_CULTURE_TRIVIA: PopCultureTriviaQuestion[] = [
  {
    id: 'miley-maxx-junior-cougar',
    badge: '6-Yr Junior Cougar Newlyweds',
    question:
      'Which pop rockstar officially became the patron saint of the 6-year "Junior Cougar" gap when she married 27-year-old drummer Maxx Morando in Palm Springs?',
    options: ['Miley Cyrus', 'Dua Lipa', 'Selena Gomez', 'Billie Eilish'],
    correctIndex: 0,
    funFact:
      'Miley Cyrus (33) & Maxx Morando (27) tied the knot in an intimate Palm Springs ceremony, proving the sub-10-year Junior Cougar sweet spot is pure rockstar magic!',
  },
  {
    id: 'jessica-alba-danny',
    badge: '40s Mogul × Top Gun Cub',
    question:
      'After her divorce, Jessica Alba sparked a full internet Cougar celebration stepping out with which "Top Gun: Maverick" & "Captain America" star (~12 years her junior)?',
    options: ['Glen Powell', 'Danny Ramirez', 'Miles Teller', 'Charles Melton'],
    correctIndex: 1,
    funFact:
      'Jessica Alba & Danny Ramirez became the poster couple for effortless post-divorce 40s Cougar × early-30s Cub vacation glow!',
  },
  {
    id: 'sienna-miller-oli',
    badge: '15-Yr Gap • Red-Carpet Babies',
    question:
      'Which fashion icon silenced every tabloid timeline critic by welcoming TWO babies in her 40s with her devoted 15-years-younger actor partner Oli Green?',
    options: ['Kate Moss', 'Keira Knightley', 'Sienna Miller', 'Rosamund Pike'],
    correctIndex: 2,
    funFact:
      'Sienna Miller & Oli Green owned the Met Gala and London red carpets while welcoming two children together, shattering Hollywood’s double standard.',
  },
  {
    id: 'ellie-goulding-beau',
    badge: '11-Yr Gap • 2026 Baby Joy',
    question:
      'Which British pop powerhouse welcomed a baby girl in 2026 with her 11-years-younger actor Cub Beau Minniear?',
    options: ['Adele', 'Charli XCX', 'Florence Welch', 'Ellie Goulding'],
    correctIndex: 3,
    funFact:
      'Ellie Goulding & Beau Minniear welcomed their daughter in spring 2026, living proof that late-30s/40s women write their own family timelines.',
  },
  {
    id: 'cher-rich-man-icon',
    badge: 'Eternal Panther Hall of Fame',
    question:
      'When Cher’s mother told her "Someday you should settle down and marry a rich man," what was Cher’s legendary Panther-era reply (decades before dating 40-years-younger AE)?',
    options: [
      '"Rich men bore me to tears."',
      '"Mom, I AM a rich man."',
      '"Only if he’s under 30."',
      '"Check my Malibu deed first."',
    ],
    correctIndex: 1,
    funFact:
      '"Mom, I AM a rich man" is practically engraved over the front door of Cougars & Cubs Club, financial independence means dating purely for chemistry & joy!',
  },
  {
    id: 'heidi-klum-tom',
    badge: '16-Yr Gap • Capri Yacht Goals',
    question:
      'Supermodel Heidi Klum has been happily married since 2019 to which 16-years-younger Tokio Hotel guitarist?',
    options: ['Tom Kaulitz', 'Damiano David', 'Harry Styles', 'Zayn Malik'],
    correctIndex: 0,
    funFact:
      'Heidi Klum & Tom Kaulitz (16-year gap) have outlasted half of Hollywood’s same-age marriages while radiating pure Italian-vacation bliss.',
  },
  {
    id: 'priyanka-nick-cutoff',
    badge: 'Exact 10-Year Cougar Law',
    question:
      'Under strict Cougars & Cubs Club law (10+ year gap), which celebrity power couple clears the official 10-year Cougar-Cub cutoff right on the nose?',
    options: [
      'Zendaya & Tom Holland',
      'Priyanka Chopra & Nick Jonas',
      'Rihanna & A$AP Rocky',
      'Emily Blunt & John Krasinski',
    ],
    correctIndex: 1,
    funFact:
      'Born 10 years apart (1982 & 1992), Priyanka Chopra & Nick Jonas turned a DM slide into global Cougar-Cub marriage royalty.',
  },
  {
    id: 'atj-cougar-den-rule',
    badge: 'The "Cub Grooming" Double Entendre',
    question:
      'Whenever TikTok debates Sam & Aaron Taylor-Johnson’s 23-year gap, what is The Cougar Den’s official "Cub Grooming" rule?',
    options: [
      'Ask for his Snapchat streak score',
      '25+ baked prefrontal cortexes ONLY, and "groom" his beard oil, SPF 50 & linen collars!',
      'Buy him a leased BMW',
      'Let him keep his 5-in-1 neon-blue shower gel',
    ],
    correctIndex: 1,
    funFact:
      'Zero creepy teen power gaps, only consenting grown Cubs getting upgraded from 5-in-1 body wash to sandalwood beard oil and Santal cologne!',
  },
  {
    id: 'kristin-cavallari-montana-boyz',
    badge: '13-Yr Gap • Lowering the Age Slider',
    question:
      'Which "Laguna Beach" & Uncommon James mogul inspired thousands of women to lower their dating-app age filters after matching with 24-year-old Montana Boyz cowboy Mark Estes?',
    options: ['Lauren Conrad', 'Kristin Cavallari', 'Audrina Patridge', 'Whitney Port'],
    correctIndex: 1,
    funFact:
      'Mark Estes accidentally DMed Kristin Cavallari "I love you" from the shared Montana Boyz TikTok account before sliding in from his personal profile, sparking an iconic Cabo & Nashville Cougar-Cub whirlwind!',
  },
  {
    id: 'cougar-town-big-carl',
    badge: 'Cougar Town Sitcom Lore',
    question:
      'In Courteney Cox’s hit sitcom "Cougar Town," what affectionate name did 40-something divorcée Jules Cobb give her comically gigantic oversized red-wine glass?',
    options: ['Old Faithful', 'Big Carl', 'The Chalice', 'Sir Merlot'],
    correctIndex: 1,
    funFact:
      'Jules Cobb’s legendary giant wine glass "Big Carl" (succeeded by "Big Joe" and "Big Lou") + Cul-de-Sac Crew Penny Can turned "Cougar Town" into comfort-watch royalty!',
  },
  {
    id: 'babygirl-glass-of-milk-meme',
    badge: 'Viral A24 TikTok Meme',
    question:
      'In Nicole Kidman & Harris Dickinson’s hit film "Babygirl" (inspired by director Halina Reijn’s real life!), what unexpected drink does the younger man send across the hotel bar?',
    options: ['A Dirty Martini', 'A Tall Glass of Milk', 'An Espresso Shot', 'Dom Pérignon'],
    correctIndex: 1,
    funFact:
      'Director Halina Reijn revealed a younger Belgian actor actually sent her a glass of milk in a bar, sparking thousands of TikTok parodies and Nicole Kidman’s iconic milk toast!',
  },
  {
    id: 'idea-of-you-coachella',
    badge: 'Streaming Romance Smash',
    question:
      'In "The Idea of You," where does Anne Hathaway’s 40-year-old single mom Solène accidentally walk into 24-year-old Nicholas Galitzine’s VIP trailer?',
    options: ['Glastonbury', 'The Met Gala', 'Coachella', 'Sundance'],
    correctIndex: 2,
    funFact:
      '"The Idea of You" broke Prime Video rom-com records, igniting a massive wave of 2024–2026 older-woman / younger-man cinema alongside "Bridget Jones: Mad About the Boy" and "Lonely Planet"!',
  },
  {
    id: 'bridget-jones-roxster',
    badge: 'Second-Act Tinder Joy',
    question:
      'In "Bridget Jones: Mad About the Boy," what is the day job of Leo Woodall’s charming 29-year-old Cub "Roxster" after matching with Bridget on Tinder?',
    options: ['Park Ranger', 'Sous Chef', 'Firefighter', 'Art Dealer'],
    correctIndex: 0,
    funFact:
      'Roxster rescues Bridget and her kids from a tree in Hampstead Heath, celebrating widowed & divorced women rediscovering playful romance with high-EQ younger men!',
  },
  {
    id: 'black-cat-golden-retriever-trope',
    badge: '🐈‍⬛ Black Cat × 🐕 Golden Retriever Lore',
    question:
      'In modern romance & Cougars & Cubs Club slang, what happens when a sunny "Golden Retriever" Cub meets a cool, unhurried "Black Cat" older woman who pushes back a little at first?',
    options: [
      'He sulks and asks why she is playing hard to get',
      'He becomes 10x more smitten, respecting her slow-burn pace until he earns her real smile!',
      'He sends 14 consecutive question marks at 2 AM',
      'He asks to split the edamame on Venmo',
    ],
    correctIndex: 1,
    funFact:
      'Black Cat Older Woman × Golden Retriever Younger Man is the #1 chemistry pairing in The Cougar Den: her unhurried boundaries filter out fragile egos, while his sunny, unbothered devotion melts her walls!',
  },
  {
    id: 'mommy-domme-vs-cubsplaining',
    badge: '🧘‍♀️ Wellness Mommy-Domme & Cubsplaining',
    question:
      'In Cougars & Cubs Club lore, what separates playful "Wellness Mommy / Mommy-Domme" polarity from "Sugar Mama" freeloading or "Cubsplaining"?',
    options: [
      'They mean the exact same thing, hand over the platinum AmEx',
      'Mommy-Domme is consensual romantic command, Qigong calm & "good boy" praise between self-supporting adults, while Sugar-Mama mooching & Cubsplaining get instant blocks!',
      'Cubs are supposed to lecture her for 20 minutes on Huberman podcasts',
      'Only men over 45 are allowed into dawn Tai Chi',
    ],
    correctIndex: 1,
    funFact:
      'A Qigong or Pilates Wellness Mommy-Domme loves melting an attentive Cub with serene command ("Drop your shoulders and breathe with Mommy"), zero ATM freeloading and zero Cubsplaining allowed!',
  },
  {
    id: 'health-nut-mommy-bernedoodle',
    badge: '🥑🐶 Seed-Oil-Free & Mini Bernedoodle Lore',
    question:
      'When courting a 100% Gluten-Free & Seed-Oil-Free Health-Nut Wellness Mommy who just hit #2 on the Tricolor Mini Bernedoodle waitlist, what is the top-1% Cub move?',
    options: [
      'Order wheat mozzarella sticks deep-fried in soybean oil',
      'Call the chef at 4 PM to confirm grass-fed butter/olive-oil & GF prep, stock grass-fed ghee at home, and puppy-proof your baseboards for her incoming Bernedoodle!',
      'Cubsplain that canola oil is actually a vegetable',
      'Ask her to split the gluten-free bread surcharge on Venmo',
    ],
    correctIndex: 1,
    funFact:
      'Taking the ingredient-check mental load off a gluten-free, seed-oil-free Wellness Mommy, and hyping up her incoming tricolor Mini Bernedoodle, earns instant #1 Co-Pilot status!',
  },
  {
    id: 'zeta-jones-the-rebound',
    badge: '🎬 2009 Rom-Com Blueprint',
    question:
      'In the beloved 2009 Cougar-Cub romantic comedy "The Rebound," Catherine Zeta-Jones plays a newly single 40-year-old NYC mom who falls for her 25-year-old coffee-shop neighbor played by whom?',
    options: ['Justin Bartha', 'Penn Badgley', 'Adam Brody', 'Zac Efron'],
    correctIndex: 0,
    funFact:
      'Catherine Zeta-Jones (Sandy, 40) & Justin Bartha (Aram, 25) wrote the modern Golden-Retriever Cub playbook in "The Rebound", from coffee-shop meet-cutes to owning the 15-year gap in Manhattan!',
  },
  {
    id: 'natalie-portman-good-sex',
    badge: '🍿 Upcoming Netflix Event',
    question:
      'In Lena Dunham’s upcoming Netflix rom-com "Good Sex," Natalie Portman plays a 40-year-old NYC couples therapist caught between Mark Ruffalo and a 20-something Brooklyn hipster played by whom?',
    options: [
      'Tucker Pillsbury (Role Model)',
      'Paul Mescal',
      'Drew Starkey',
      'Josh O’Connor',
    ],
    correctIndex: 0,
    funFact:
      'Netflix snapped up Lena Dunham & Natalie Portman’s "Good Sex" in a massive $55M deal, proving the older-woman / younger-man cinema wave is only getting hotter!',
  },
];
