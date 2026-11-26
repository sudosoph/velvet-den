export interface PopCultureTriviaQuestion {
  id: string;
  badge: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  funFact: string;
  imageUrl: string;
  imageCredit: string;
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
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/a/a6/Miley_Cyrus_Grammy_Awards_2024_%28cropped%29.png',
    imageCredit: 'Photo: TNT Brasil • CC BY 3.0 via Wikimedia Commons',
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
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/81/Jessica_Alba_-_Los_Angeles_Comic_Con_2025.jpg/500px-Jessica_Alba_-_Los_Angeles_Comic_Con_2025.jpg',
    imageCredit: 'Photo: Kevin Paul • CC BY 4.0 via Wikimedia Commons',
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
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/06/Sienna_Miller_Berlinale_2017.jpg/500px-Sienna_Miller_Berlinale_2017.jpg',
    imageCredit: 'Photo: Martin Kraft • CC BY-SA 3.0 via Wikimedia Commons',
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
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/b/b2/%D0%A3%D1%87%D0%B0%D1%81%D1%82%D1%8C_%D0%9F%D1%80%D0%B5%D0%B7%D0%B8%D0%B4%D0%B5%D0%BD%D1%82%D0%B0_%D0%A3%D0%BA%D1%80%D0%B0%D1%97%D0%BD%D0%B8_%D1%83_%D0%B4%D1%80%D1%83%D0%B3%D0%BE%D0%BC%D1%83_%D0%A1%D0%B0%D0%BC%D1%96%D1%82%D1%96_%D0%BF%D0%B5%D1%80%D1%88%D0%B8%D1%85_%D0%BB%D0%B5%D0%B4%D1%96_%D1%82%D0%B0_%D0%B4%D0%B6%D0%B5%D0%BD%D1%82%D0%BB%D1%8C%D0%BC%D0%B5%D0%BD%D1%96%D0%B2_95_%28cropped%29_%28cropped%29.jpg',
    imageCredit: 'Photo: Office of the President of Ukraine • CC BY 4.0 via Wikimedia Commons',
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
      '"Mom, I AM a rich man" is practically engraved over the front door of Cougars & Cubs Club: financial independence means dating purely for chemistry & joy!',
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bb/Cher_in_2019_cropped.jpg/500px-Cher_in_2019_cropped.jpg',
    imageCredit: 'Photo: Raph_PH • CC BY-SA 4.0 via Wikimedia Commons',
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
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/02/Heidi_Klum_Colleen_Sturtevant_Photography-3.jpg/500px-Heidi_Klum_Colleen_Sturtevant_Photography-3.jpg',
    imageCredit: 'Photo: Colleen Sturtevant • CC BY-SA 4.0 via Wikimedia Commons',
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
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/4/45/Priyanka_Chopra_at_Bulgary_launch%2C_2024_%28cropped%29.jpg',
    imageCredit: 'Photo: Bollywood Hungama • CC BY 3.0 via Wikimedia Commons',
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Sam_Taylor-Johnson_2023.jpg',
    imageCredit: 'Photo: Raph_PH • CC BY 2.0 via Wikimedia Commons',
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/KristinCavallariSept10.jpg',
    imageCredit: 'Photo: Nick Stepowyj • CC BY 2.0 via Wikimedia Commons',
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
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/83/Courteney_Cox_%2710_PaleyFest.jpg/500px-Courteney_Cox_%2710_PaleyFest.jpg',
    imageCredit: 'Photo: Albert Domasin • CC BY-SA 2.0 via Wikimedia Commons',
  },
  {
    id: 'babygirl-glass-of-milk-meme',
    badge: 'A24 Hotel-Bar Cinema Moment',
    question:
      'In Nicole Kidman & Harris Dickinson’s hit film "Babygirl" (inspired by director Halina Reijn’s real life!), what unexpected drink does the younger man send across the hotel bar?',
    options: ['A Dirty Martini', 'A Tall Glass of Milk', 'An Espresso Shot', 'Dom Pérignon'],
    correctIndex: 1,
    funFact:
      'Director Halina Reijn revealed a younger Belgian actor actually sent her a glass of milk in a bar, sparking thousands of hotel-bar tributes and Nicole Kidman’s iconic milk toast!',
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/MKr384262_Nicole_Kidman_%28Women_In_Motion%2C_Cannes_2025%29.jpg/500px-MKr384262_Nicole_Kidman_%28Women_In_Motion%2C_Cannes_2025%29.jpg',
    imageCredit: 'Photo: Martin Kraft • CC BY-SA 4.0 via Wikimedia Commons',
  },
  {
    id: 'idea-of-you-coachella',
    badge: 'Streaming Romance Smash',
    question:
      'In "The Idea of You," where does Anne Hathaway’s 40-year-old single mom Solène accidentally walk into 24-year-old Nicholas Galitzine’s VIP trailer?',
    options: ['Glastonbury', 'The Met Gala', 'Coachella', 'Sundance'],
    correctIndex: 2,
    funFact:
      '"The Idea of You" broke Prime Video rom-com records, igniting a massive wave of modern older-woman / younger-man cinema alongside "Bridget Jones: Mad About the Boy" and "Lonely Planet"!',
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/AnneHathaway-byPhilipRomano-Crop.jpg/500px-AnneHathaway-byPhilipRomano-Crop.jpg',
    imageCredit: 'Photo: PhilipRomano • CC BY-SA 4.0 via Wikimedia Commons',
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
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a6/Leo_Woodall_2024_Emmys_05_%28cropped%29.png/500px-Leo_Woodall_2024_Emmys_05_%28cropped%29.png',
    imageCredit: 'Photo: HBO • CC BY 3.0 via Wikimedia Commons',
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
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/81/Gabrielle_Union_at_the_2024_Toronto_International_Film_Festival_3_%28cropped%29.jpg/500px-Gabrielle_Union_at_the_2024_Toronto_International_Film_Festival_3_%28cropped%29.jpg',
    imageCredit: 'Photo: Adam Chitayat • CC BY-SA 4.0 via Wikimedia Commons',
  },
  {
    id: 'stella-groove-jamaica',
    badge: '🌴 1998 Cinema Watershed',
    question:
      'In the iconic 1998 film "How Stella Got Her Groove Back" (inspired by author Terry McMillan’s real vacation!), where does Angela Bassett’s 40-year-old executive fall for Taye Diggs’ 20-something Winston Shakespeare?',
    options: ['Jamaica', 'Amalfi Coast', 'Maui', 'St. Barts'],
    correctIndex: 0,
    funFact:
      'Angela Bassett & Taye Diggs in "How Stella Got Her Groove Back" permanently rewired pop culture around accomplished women choosing joy, chemistry, and unforgettable romance!',
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/48/Angela_Basset_at_the_2025_Cannes_Film_Festival_04_%28cropped%29.jpg/500px-Angela_Basset_at_the_2025_Cannes_Film_Festival_04_%28cropped%29.jpg',
    imageCredit: 'Photo: Gabriel Hutchinson • CC BY-SA 4.0 via Wikimedia Commons',
  },
  {
    id: 'tina-turner-erwin-bach',
    badge: '👑 38-Year Devotion Standard',
    question:
      'Rock legend Tina Turner shared a 38-year Lake Zurich love story with German music executive Erwin Bach (16 years her junior). What extraordinary act of devotion did Erwin do for Tina in 2017?',
    options: [
      'Bought a vineyard in Bordeaux',
      'Donated one of his own kidneys to save her life',
      'Produced a Broadway jukebox musical',
      'Learned bass guitar for her farewell tour',
    ],
    correctIndex: 1,
    funFact:
      'Tina Turner met Erwin Bach at 46, married him on Lake Zurich, and Erwin donated his kidney to save her life in 2017, making them the eternal gold standard of age-gap devotion.',
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0b/Tina_Turner_Breaks_All_the_Rules.png/500px-Tina_Turner_Breaks_All_the_Rules.png',
    imageCredit: 'Photo: HBO • Public Domain via Wikimedia Commons',
  },
  {
    id: 'demi-moore-ashton-watershed',
    badge: '📸 2003 Red-Carpet Watershed',
    question:
      'Before dating apps even had age sliders, which A-list actress stepped onto the 2003 "Charlie’s Angels: Full Throttle" carpet with 25-year-old Ashton Kutcher and put "Cougar & Cub" on every magazine cover?',
    options: ['Sharon Stone', 'Demi Moore', 'Halle Berry', 'Sandra Bullock'],
    correctIndex: 1,
    funFact:
      'Demi Moore (40) & Ashton Kutcher (25) shattered early-2000s Hollywood double standards overnight and proved leading ladies in their 40s own every flashbulb.',
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/82/Demi_Moore_at_the_2026_Cannes_Film_Festival_%28cropped%29.jpg/500px-Demi_Moore_at_the_2026_Cannes_Film_Festival_%28cropped%29.jpg',
    imageCredit: 'Photo: Gabriel Hutchinson • CC BY-SA 4.0 via Wikimedia Commons',
  },
  {
    id: 'meghan-harry-micro-gap',
    badge: '👑 Royal Woman-Older Micro-Gap',
    question:
      'Which divorced 36-year-old American actress broke centuries of Windsor royal expectations by marrying a 33-year-old British prince three years her junior?',
    options: ['Meghan Markle', 'Grace Kelly', 'Wallis Simpson', 'Claire Foy'],
    correctIndex: 0,
    funFact:
      'Even a 3-year woman-older micro-gap rewrote Windsor history when Meghan Markle (36) charmed Prince Harry (33), joining Goldie Hawn & Kurt Russell (5.5-yr gap, 40+ yrs together) in proving every gap size counts!',
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9d/SXSW-2024-OB7A9986-alih-Meghan%2C_Duchess_of_Sussex_%28cropped%29.jpg/500px-SXSW-2024-OB7A9986-alih-Meghan%2C_Duchess_of_Sussex_%28cropped%29.jpg',
    imageCredit: 'Photo: Fuzheado • CC BY 4.0 via Wikimedia Commons',
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
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/08/Catherine_Zeta-Jones_2025.png/500px-Catherine_Zeta-Jones_2025.png',
    imageCredit: 'Photo: Margaret Gardiner • CC BY 3.0 via Wikimedia Commons',
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
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f9/NataliePortman.jpg/500px-NataliePortman.jpg',
    imageCredit: 'Photo: Colleen Sturtevant • CC BY 4.0 via Wikimedia Commons',
  },
];
