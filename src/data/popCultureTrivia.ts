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
      'Miley Cyrus (33) & Maxx Morando (27) tied the knot in an intimate Palm Springs ceremony—proving the sub-10-year Junior Cougar sweet spot is pure rockstar magic!',
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
      'Sienna Miller & Oli Green owned the Met Gala and London red carpets while welcoming two children together—shattering Hollywood’s double standard.',
  },
  {
    id: 'ellie-goulding-beau',
    badge: '11-Yr Gap • 2026 Baby Joy',
    question:
      'Which British pop powerhouse welcomed a baby girl in 2026 with her 11-years-younger actor Cub Beau Minniear?',
    options: ['Adele', 'Charli XCX', 'Florence Welch', 'Ellie Goulding'],
    correctIndex: 3,
    funFact:
      'Ellie Goulding & Beau Minniear welcomed their daughter in spring 2026—living proof that late-30s/40s women write their own family timelines.',
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
      '"Mom, I AM a rich man" is practically engraved over the front door of Cougars & Cubs Club—financial independence means dating purely for chemistry & joy!',
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
      'Under strict r/CougarsAndCubs law (10+ year gap), which celebrity power couple clears the official 10-year Cougar-Cub cutoff right on the nose?',
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
    id: 'atj-velvet-den-rule',
    badge: 'The "Cub Grooming" Double Entendre',
    question:
      'Whenever TikTok debates Sam & Aaron Taylor-Johnson’s 23-year gap, what is The Velvet Den’s official "Cub Grooming" rule?',
    options: [
      'Ask for his Snapchat streak score',
      '25+ baked prefrontal cortexes ONLY—and "groom" his beard oil, SPF 50 & linen collars!',
      'Buy him a leased BMW',
      'Let him keep his 5-in-1 neon-blue shower gel',
    ],
    correctIndex: 1,
    funFact:
      'Zero creepy teen power gaps—only consenting grown Cubs getting upgraded from 5-in-1 body wash to sandalwood beard oil and Santal cologne!',
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
      'Director Halina Reijn revealed a younger Belgian actor actually sent her a glass of milk in a bar—sparking thousands of TikTok parodies and Nicole Kidman’s iconic milk toast!',
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
      'Roxster rescues Bridget and her kids from a tree in Hampstead Heath—celebrating widowed & divorced women rediscovering playful romance with high-EQ younger men!',
  },
];
