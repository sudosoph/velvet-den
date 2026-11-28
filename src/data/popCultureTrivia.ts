export type TriviaCategory =
  | 'movies'
  | 'tv'
  | 'books'
  | 'music_celebs'
  | 'sports'
  | 'royals_history'
  | 'era_culture';
export type TriviaDifficulty = 'easy' | 'medium' | 'hard';
export type TriviaLevel = 1 | 2 | 3;

export interface PopCultureTriviaQuestion {
  id: string;
  badge: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  funFact: string;
  imageUrl: string;
  imageCredit: string;
  youtubeEmbedUrl?: string;
  affiliateId?: string;
  category?: TriviaCategory;
  difficulty?: TriviaDifficulty;
  level?: TriviaLevel;
}

/**
 * 56-Question Interleaved Cinema, Celebrity, TV, Music & Book Blitz.
 * Round-robin ordered so players never hit consecutive questions on the same movie, song, or star,
 * with balanced A/B/C/D answer slots and 100% local cached imagery.
 */
export const POP_CULTURE_TRIVIA: PopCultureTriviaQuestion[] = [
  {
    "id": "no-hard-feelings-jlaw-buick",
    "badge": "🎬 2023 Montauk Comedy Smash",
    "question": "In the 2023 comedy \"No Hard Feelings,\" why does Jennifer Lawrence’s 32-year-old Montauk local Maddie answer a Craigslist ad to \"date\" 19-year-old Princeton-bound Percy before fall semester?",
    "options": [
      "To win a $10,000 Montauk surfing bet before Labor Day weekend",
      "To earn a Buick Regal so she can drive rideshare and save her house",
      "To make her newly engaged real-estate ex jealous at the yacht club",
      "To research an undercover dating column for a Manhattan magazine"
    ],
    "correctIndex": 1,
    "funFact": "Jennifer Lawrence & Broadway star Andrew Barth Feldman turned \"No Hard Feelings\" into a global box-office hit, highlighted by Percy’s unexpectedly soulful piano-bar rendition of \"Maneater.\"",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": "",
    "youtubeEmbedUrl": "https://www.youtube-nocookie.com/embed/kIcLb0KAJAs",
    "affiliateId": "no-hard-feelings-jlaw-prime"
  },
  {
    "id": "cher-rich-man-icon",
    "badge": "👑 40-Year Gap Icon",
    "question": "Decades before stepping out happily with music executive Alexander \"AE\" Edwards (40 years her junior), what was Cher’s legendary reply when her mom told her to \"settle down and marry a rich man\"?",
    "options": [
      "\"Mom, I AM a rich man.\"",
      "\"Mom, rich men bore me to tears.\"",
      "\"Mom, I already own the mansion.\"",
      "\"Mom, check my Oscar shelf first.\""
    ],
    "correctIndex": 0,
    "funFact": "\"Mom, I AM a rich man\" is the founding motto of independent women dating strictly for joy and chemistry.",
    "imageUrl": "./images/icons/pop_cher_icons.jpg",
    "imageCredit": ""
  },
  {
    "id": "satc-samantha-smith-jerrod",
    "badge": "🍸 Sex and the City Devotion",
    "question": "On \"Sex and the City,\" when Samantha Jones undergoes chemotherapy and shaves her hair, what unforgettable gesture does her 20-something actor boyfriend Smith Jerrod (Jason Lewis) immediately do?",
    "options": [
      "Charters a private flight to Paris for the weekend",
      "Rents a quiet penthouse loft for her in SoHo",
      "Turns down his studio film role to stay in Manhattan",
      "Shaves his own golden blond hair right alongside her"
    ],
    "correctIndex": 3,
    "funFact": "Smith Jerrod shaving his trademark hair without hesitation, and flying home mid-shoot just to tell Samantha he loves her, cemented him as TV’s #1 Golden-Retriever partner.",
    "imageUrl": "./images/products/martini-barware-goblet.jpg",
    "imageCredit": ""
  },
  {
    "id": "stacys-mom-music-video",
    "badge": "🎸 2003 Power-Pop Anthem",
    "question": "Which supermodel starred in the unforgettable 2003 music video for Fountains of Wayne’s Grammy-nominated smash \"Stacy’s Mom\"?",
    "options": [
      "Claudia Schiffer",
      "Cindy Crawford",
      "Rachel Hunter",
      "Christie Brinkley"
    ],
    "correctIndex": 2,
    "funFact": "Written by Adam Schlesinger & Chris Collingwood, \"Stacy’s Mom\" featuring Rachel Hunter remains an instant karaoke crowd-roarer.",
    "imageUrl": "./images/products/martini-barware-goblet.jpg",
    "imageCredit": "",
    "youtubeEmbedUrl": "https://www.youtube-nocookie.com/embed/dZLfasMPOU4"
  },
  {
    "id": "babygirl-glass-of-milk-meme",
    "badge": "🥛 A24 Hotel-Bar Power Play",
    "question": "In Halina Reijn’s A24 thriller \"Babygirl,\" what unexpected drink does Harris Dickinson’s Samuel send across the hotel bar to Nicole Kidman’s CEO Romy?",
    "options": [
      "A Dirty Martini",
      "A Tall Glass of Milk",
      "A Double Espresso",
      "A Flute of Champagne"
    ],
    "correctIndex": 1,
    "funFact": "Director Halina Reijn borrowed the moment from real life after a younger Belgian actor sent her a glass of milk in a bar, winning Nicole Kidman the Venice Best Actress Volpi Cup!",
    "imageUrl": "./images/products/babygirl-movie-prime.jpg",
    "imageCredit": "",
    "youtubeEmbedUrl": "https://www.youtube-nocookie.com/embed/-8Sx6U6Ou0Q",
    "affiliateId": "babygirl-movie-prime"
  },
  {
    "id": "priyanka-nick-cutoff",
    "badge": "💍 Exact 10-Year Cougar Law",
    "question": "Which married power couple hits the exact 10-year woman-older milestone (born 1982 & 1992) after he famously slid into her Twitter DMs?",
    "options": [
      "Priyanka Chopra & Nick Jonas",
      "Zendaya & Tom Holland",
      "Rihanna & A$AP Rocky",
      "Blake Lively & Ryan Reynolds"
    ],
    "correctIndex": 0,
    "funFact": "Other iconic 10–14 year couples include Kim Cattrall & Russell Thomas (14 yrs), Kristin Cavallari & Mark Estes (13 yrs), Deborra-Lee Furness & Hugh Jackman (13 yrs), Lisa Bonet & Jason Momoa (12 yrs), and Ellie Goulding & Beau Minniear (11 yrs)!",
    "imageUrl": "./images/icons/pop_priyanka_nick.jpg",
    "imageCredit": ""
  },
  {
    "id": "cougar-town-big-carl",
    "badge": "🍷 Sitcom Comfort Royalty",
    "question": "In Courteney Cox’s hit sitcom \"Cougar Town,\" what affectionate name did 40-something divorcée Jules Cobb give her comically oversized red-wine goblet?",
    "options": [
      "Old Faithful",
      "Sir Merlot",
      "The Chalice",
      "Big Carl"
    ],
    "correctIndex": 3,
    "funFact": "Jules Cobb’s beloved giant goblet \"Big Carl\" (succeeded by \"Big Joe\" and \"Big Lou\") turned Cul-de-Sac wine nights into sitcom canon.",
    "imageUrl": "./images/icons/pop_cougar_town.jpg",
    "imageCredit": "",
    "affiliateId": "big-carl-giant-wine-glass"
  },
  {
    "id": "abby-jimenez-part-of-your-world",
    "badge": "📚 #1 NYT Romance Bestseller",
    "question": "In Abby Jimenez’s beloved bestseller \"Part of Your World,\" 37-year-old big-city ER doctor Alexis Montgomery gets her car stuck in a ditch and meets 28-year-old Daniel Grant, who works as a small-town what?",
    "options": [
      "Float-plane charter pilot & mechanic",
      "State-park ranger & volunteer firefighter",
      "Custom carpenter & historic B&B innkeeper",
      "Small-batch brewmaster & orchard owner"
    ],
    "correctIndex": 2,
    "funFact": "Daniel Grant (who is also the town’s secret mayor!) cooking from scratch, fixing doors, and gently dismantling Alexis’s family snobbery made him BookTok’s gold-standard younger hero.",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": "",
    "affiliateId": "part-of-your-world-book"
  },
  {
    "id": "the-graduate-real-age-gap",
    "badge": "🎓 1967 Cinema Trivia Twist",
    "question": "While \"The Graduate\" (1967) immortalized Mrs. Robinson seducing recent college grad Benjamin Braddock, how many years older was Anne Bancroft than Dustin Hoffman in real life?",
    "options": [
      "18 years older",
      "6 years older",
      "22 years older",
      "14 years older"
    ],
    "correctIndex": 1,
    "funFact": "Anne Bancroft was just 35 during filming while Dustin Hoffman was already 29. Hollywood makeup and framing created a 20-year illusion out of a 6-year gap!",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": "",
    "youtubeEmbedUrl": "https://www.youtube-nocookie.com/embed/KVNFaxJspMQ"
  },
  {
    "id": "tina-turner-erwin-bach",
    "badge": "💚 38-Year Lake Zurich Love Story",
    "question": "Rock queen Tina Turner shared 38 devoted years with German music executive Erwin Bach (16 years younger). What life-saving act of love did Erwin do for Tina in 2017?",
    "options": [
      "Donated one of his own kidneys to save her life",
      "Built a private lakeside recording studio in Zurich",
      "Bought back every master tape from her 1960s catalog",
      "Conducted the symphony orchestra on her farewell tour"
    ],
    "correctIndex": 0,
    "funFact": "Tina met Erwin at 46 when he picked her up at Düsseldorf Airport, and his 2017 kidney donation remains the ultimate real-world devotion story.",
    "imageUrl": "./images/icons/pop_tina_erwin.jpg",
    "imageCredit": ""
  },
  {
    "id": "ted-lasso-rebecca-sam-bantr",
    "badge": "⚽ Ted Lasso Anonymous Spark",
    "question": "On \"Ted Lasso,\" AFC Richmond owner Rebecca Welton (Hannah Waddingham) and charismatic 21-year-old player Sam Obisanya (Toheeb Jimoh) fall for each other’s minds blindly on which photo-free dating app?",
    "options": [
      "Whispr",
      "Sparkr",
      "Fluttr",
      "Bantr"
    ],
    "correctIndex": 3,
    "funFact": "Rebecca & Sam’s witty photo-free chemistry on Bantr inspired our own #blind-spark-dm mystery lounge!",
    "imageUrl": "./images/products/mocktail-card-deck.jpg",
    "imageCredit": ""
  },
  {
    "id": "yung-gravy-betty-vmas",
    "badge": "🕺 Viral Red-Carpet Move",
    "question": "Rapper Yung Gravy sampled Rick Astley’s \"Never Gonna Give You Up\" for his platinum anthem \"Betty (Get Money)\" and famously brought whose mom, Sheri Easterling, as his date to the 2022 MTV VMAs?",
    "options": [
      "Alix Earle’s mom",
      "Charli D’Amelio’s mom",
      "Addison Rae’s mom",
      "Emma Chamberlain’s mom"
    ],
    "correctIndex": 2,
    "funFact": "Yung Gravy’s unapologetic appreciation for moms turned the 2022 VMAs red carpet into viral comedy gold.",
    "imageUrl": "./images/products/mugs-love-coupons.jpg",
    "imageCredit": "",
    "youtubeEmbedUrl": "https://www.youtube-nocookie.com/embed/8oE5Z2GLhNc"
  },
  {
    "id": "bridget-jones-roxster",
    "badge": "🌳 Hampstead Heath Rescue",
    "question": "In \"Bridget Jones: Mad About the Boy\" (2025), what is the day job of Leo Woodall’s charming 29-year-old match Roxster when he rescues Bridget and her kids from a tree?",
    "options": [
      "Sous-Chef",
      "Park Ranger",
      "Bookshop Owner",
      "Rowing Coach"
    ],
    "correctIndex": 1,
    "funFact": "Leo Woodall’s golden-hearted Hampstead Heath park ranger became an instant fan favorite for widowed and divorced Chapter-Two romantics.",
    "imageUrl": "./images/products/bridget-jones-cougar-town-watch.jpg",
    "imageCredit": "",
    "youtubeEmbedUrl": "https://www.youtube-nocookie.com/embed/DhAcAgULwYY",
    "affiliateId": "bridget-jones-cougar-town-watch"
  },
  {
    "id": "shakira-strawberry-jam-clue",
    "badge": "🍓 Famous Refrigerator Detective Clue",
    "question": "Before releasing her record-smashing diss track over her 10-year-younger ex Gerard Piqué, rumor has it Shakira first clocked someone else had been in their house after noticing what missing from the fridge?",
    "options": [
      "A jar of strawberry jam",
      "A carton of vanilla oat milk",
      "A wedge of aged Manchego",
      "A bottle of sparkling water"
    ],
    "correctIndex": 0,
    "funFact": "Never underestimate kitchen intuition: missing strawberry jam (which Piqué famously never ate) became pop culture’s sharpest detective clue, rivaling Olivia Wilde’s salad dressing lore!",
    "imageUrl": "./images/products/aprons-kitchen.jpg",
    "imageCredit": ""
  },
  {
    "id": "idea-of-you-coachella",
    "badge": "🎨 Prime Video Record Breaker",
    "question": "In \"The Idea of You\" (2024), where does Anne Hathaway’s 40-year-old Silver Lake gallery owner Solène accidentally step into 24-year-old Nicholas Galitzine’s VIP trailer?",
    "options": [
      "Glastonbury",
      "Lollapalooza",
      "Bonnaroo",
      "Coachella"
    ],
    "correctIndex": 3,
    "funFact": "Mistaking Hayes Campbell’s trailer for the VIP restroom sparked nearly 50 million global streams in its opening weeks on Prime Video.",
    "imageUrl": "./images/products/idea-of-you-movie-book.jpg",
    "imageCredit": "",
    "youtubeEmbedUrl": "https://www.youtube-nocookie.com/embed/V8i6PB0gGOA",
    "affiliateId": "idea-of-you-movie-book"
  },
  {
    "id": "colette-cheri-1920",
    "badge": "📖 1920 French Literary Classic",
    "question": "Which trailblazing French novelist published \"Chéri\" in 1920, chronicling the unforgettable Belle Époque love affair between poised 49-year-old Léa de Lonval and 25-year-old Fred (\"Chéri\")?",
    "options": [
      "Marguerite Duras",
      "Simone de Beauvoir",
      "Colette",
      "Françoise Sagan"
    ],
    "correctIndex": 2,
    "funFact": "Over a century old, Colette’s \"Chéri\" remains one of literature’s sharpest, most empathetic portraits of an older woman and younger man.",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": ""
  },
  {
    "id": "stella-groove-jamaica",
    "badge": "🌴 1998 Cultural Watershed",
    "question": "In \"How Stella Got Her Groove Back\" (1998), inspired by author Terry McMillan’s real trip, where does Angela Bassett’s 40-year-old stockbroker fall for Taye Diggs’s 20-year-old Winston?",
    "options": [
      "Barbados",
      "Jamaica",
      "Capri",
      "Tulum"
    ],
    "correctIndex": 1,
    "funFact": "Angela Bassett & Taye Diggs permanently rewrote mainstream cinema around accomplished women claiming joy and romance without apology.",
    "imageUrl": "./images/icons/pop_stella_cinema.jpg",
    "imageCredit": "",
    "youtubeEmbedUrl": "https://www.youtube-nocookie.com/embed/r3wbXFzPqcs"
  },
  {
    "id": "heidi-klum-tom-kaulitz",
    "badge": "⛵ 16-Year Gap • Capri Wedding",
    "question": "Supermodel Heidi Klum wed 16-years-younger musician Tom Kaulitz aboard the historic yacht Christina O off Capri in 2019. Which band did Tom rise to fame playing guitar in?",
    "options": [
      "Tokio Hotel",
      "Måneskin",
      "Rammstein",
      "Phoenix"
    ],
    "correctIndex": 0,
    "funFact": "Heidi Klum & Tom Kaulitz join Kris Jenner & Corey Gamble (25-yr gap) and Brigitte & Emmanuel Macron (24-yr gap) among long-running 15+ year couples.",
    "imageUrl": "./images/icons/pop_heidi_tom.jpg",
    "imageCredit": ""
  },
  {
    "id": "succession-gerri-roman",
    "badge": "🏢 Succession Fan Phenomenon",
    "question": "On HBO’s \"Succession,\" improvised off-camera banter between J. Smith-Cameron and Kieran Culkin convinced writers to build the razor-sharp dynamic between General Counsel Gerri Kellman and which Roy sibling?",
    "options": [
      "Shiv Roy",
      "Kendall Roy",
      "Connor Roy",
      "Roman Roy"
    ],
    "correctIndex": 3,
    "funFact": "\"Rockstar and the Mole Woman\" became one of prestige television’s most electric unplanned storylines.",
    "imageUrl": "./images/products/martini-barware-goblet.jpg",
    "imageCredit": ""
  },
  {
    "id": "rod-stewart-maggie-may",
    "badge": "🎸 1971 Rock Milestone",
    "question": "Which 1971 Rod Stewart #1 classic (\"Wake up Maggie, I think I got something to say to you\") was inspired by his own formative romance with an older woman?",
    "options": [
      "\"Young Turks\"",
      "\"Tonight’s the Night\"",
      "\"Maggie May\"",
      "\"Da Ya Think I’m Sexy?\""
    ],
    "correctIndex": 2,
    "funFact": "Originally released as a B-side, radio DJs flipped the single over and turned \"Maggie May\" into Rod Stewart’s signature song.",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": ""
  },
  {
    "id": "bull-durham-sarandon-robbins",
    "badge": "⚾ 1988 Diamond Classic",
    "question": "In \"Bull Durham\" (1988), Susan Sarandon’s baseball muse Annie Savoy mentors minor-league fireballer \"Nuke\" LaLoosh (Tim Robbins), sparking a real-life partnership between Sarandon and Robbins (12 years younger) that lasted how long?",
    "options": [
      "3 years",
      "21 years",
      "8 years",
      "11 years"
    ],
    "correctIndex": 1,
    "funFact": "Susan Sarandon & Tim Robbins were together from 1988 to 2009 and raised two sons while winning Academy Awards.",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": "",
    "youtubeEmbedUrl": "https://www.youtube-nocookie.com/embed/qnWSvSrb1-I"
  },
  {
    "id": "sienna-miller-oli-green",
    "badge": "✨ 15-Year Gap • London Glow",
    "question": "Actress and style icon Sienna Miller silenced tabloid timeline critics in her 40s alongside which 15-years-younger British actor & Burberry model?",
    "options": [
      "Oli Green",
      "Callum Turner",
      "Harris Dickinson",
      "Kit Connor"
    ],
    "correctIndex": 0,
    "funFact": "Alongside Demi Moore & Ashton Kutcher (15 yrs), Sandra Bullock & Ryan Gosling (16 yrs), and Kate Beckinsale & Pete Davidson (20 yrs), London’s Sienna & Oli own every carpet.",
    "imageUrl": "./images/icons/pop_sienna_oli.jpg",
    "imageCredit": ""
  },
  {
    "id": "emily-in-paris-sylvie-erik",
    "badge": "🥐 Parisian Chic Effortlessness",
    "question": "On \"Emily in Paris,\" effortlessly cool agency boss Sylvie Grateau (Philippine Leroy-Beaulieu) romances handsome younger photographer Erik (Søren Bregendal) after meeting him at which event?",
    "options": [
      "A Roland-Garros courtside match",
      "A private Louvre gala preview",
      "A Saint-Germain jazz club opening",
      "A Savoir fashion shoot & champagne soirée"
    ],
    "correctIndex": 3,
    "funFact": "Philippine Leroy-Beaulieu’s Sylvie became the breakout fashion and romance icon of the entire series.",
    "imageUrl": "./images/products/silk-robe-pillowcase.jpg",
    "imageCredit": ""
  },
  {
    "id": "caroline-stanbury-sergio-carrallo",
    "badge": "🥂 18-Year Gap • RHODubai Royalty",
    "question": "\"Ladies of London\" and \"The Real Housewives of Dubai\" star Caroline Stanbury married 18-years-younger Spanish husband Sergio Carrallo in 2021 after his athletic career with which famed football club’s system?",
    "options": [
      "FC Barcelona",
      "Real Madrid",
      "AC Milan",
      "Paris Saint-Germain"
    ],
    "correctIndex": 1,
    "funFact": "Former Real Madrid C & New York Cosmos player Sergio Carrallo and dry-witted Brit Caroline Stanbury are Bravo’s textbook \"Black Cat Cougar × Golden Retriever Husband\" duo.",
    "imageUrl": "./images/icons/pop_caroline_sergio.jpg",
    "imageCredit": ""
  },
  {
    "id": "miranda-july-all-fours",
    "badge": "✨ 2024 Literary Sensation",
    "question": "In Miranda July’s runaway 2024 bestseller \"All Fours,\" a 45-year-old artist sets out to drive from LA to New York, exits the freeway 30 minutes away in Monrovia, redecorates a motel room, and sparks with a younger rental-car worker named whom?",
    "options": [
      "Leo",
      "Julian",
      "Davey",
      "Caleb"
    ],
    "correctIndex": 2,
    "funFact": "\"All Fours\" became the most talked-about book in every 40-something group chat of 2024.",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": ""
  },
  {
    "id": "american-pie-stiflers-mom",
    "badge": "🥃 1999 Slang Origin",
    "question": "In \"American Pie\" (1999), Jennifer Coolidge’s iconic turn as Stifler’s Mom opposite Eddie Kaye Thomas’s Finch over single-malt Scotch catapulted which four-letter acronym into global slang?",
    "options": [
      "GOAT",
      "MILF",
      "FOMO",
      "YOLO"
    ],
    "correctIndex": 1,
    "funFact": "Before winning two Emmys for \"The White Lotus,\" Jennifer Coolidge became pop-culture royalty in just a few unforgettable scenes in \"American Pie.\"",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": "",
    "youtubeEmbedUrl": "https://www.youtube-nocookie.com/embed/lp9Z4gc-9UA"
  },
  {
    "id": "gabrielle-union-julianne-moore-SweetSpot",
    "badge": "🏀 9-Year Marriage Royalty",
    "question": "Both Gabrielle Union & NBA legend Dwyane Wade AND Oscar winner Julianne Moore & director Bart Freundlich have thrived for decades with which exact woman-older age gap?",
    "options": [
      "9 years",
      "17 years",
      "2 years",
      "21 years"
    ],
    "correctIndex": 0,
    "funFact": "Close behind them in the 6–8 year sweet spot: Vanessa Hudgens & MLB player Cole Tucker (8 yrs), Eva Mendes & Ryan Gosling (7 yrs), Cameron Diaz & Benji Madden (7 yrs), Elsa Pataky & Chris Hemsworth (7 yrs), and Miley Cyrus & Maxx Morando (6 yrs)!",
    "imageUrl": "./images/icons/pop_gabrielle_dwyane.jpg",
    "imageCredit": ""
  },
  {
    "id": "younger-liza-josh-tattoo",
    "badge": "🗽 7-Season TV Hit",
    "question": "Across seven seasons of Darren Star’s \"Younger,\" Sutton Foster’s 40-year-old Liza Miller sparks on Night 1 in a Brooklyn bar with 26-year-old Nico Tortorella, whose character Josh runs what kind of studio?",
    "options": [
      "Williamsburg vinyl record shop",
      "Williamsburg ceramics studio",
      "Williamsburg espresso roastery",
      "Williamsburg tattoo studio"
    ],
    "correctIndex": 3,
    "funFact": "Josh clocking Liza’s real heart, and standing by her long after learning her real age, drove #TeamJosh mania for seven seasons.",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": ""
  },
  {
    "id": "mariah-carey-touch-my-body-set",
    "badge": "🎥 Music-Video Meet-Cute",
    "question": "On the set of which playful 2008 #1 music video, directed by Brett Ratner, did Mariah Carey spark her whirlwind marriage with Nick Cannon (11 years her junior)?",
    "options": [
      "\"Obsessed\"",
      "\"Touch My Body\"",
      "\"Bye Bye\"",
      "\"We Belong Together\""
    ],
    "correctIndex": 2,
    "funFact": "After \"Touch My Body\" hit #1, Mariah cast Nick Cannon as her love interest in the \"Bye Bye\" island video, and they wed in the Bahamas weeks later!",
    "imageUrl": "./images/products/silk-robe-pillowcase.jpg",
    "imageCredit": ""
  },
  {
    "id": "no-hard-feelings-piano-song",
    "badge": "🎹 No Hard Feelings Scene Stealer",
    "question": "In \"No Hard Feelings,\" which classic 1982 pop hit does Andrew Barth Feldman’s Percy sing live at the restaurant piano, stunning Jennifer Lawrence’s Maddie?",
    "options": [
      "\"Maggie May\" by Rod Stewart",
      "\"Maneater\" by Hall & Oates",
      "\"Jessie’s Girl\" by Rick Springfield",
      "\"Africa\" by Toto"
    ],
    "correctIndex": 1,
    "funFact": "Andrew Barth Feldman actually performed \"Maneater\" live on set, turning a comedy setup into the warmest emotional turning point of the film.",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": "",
    "youtubeEmbedUrl": "https://www.youtube-nocookie.com/embed/P15S6ND8kbQ",
    "affiliateId": "no-hard-feelings-jlaw-prime"
  },
  {
    "id": "somethings-gotta-give-keanu",
    "badge": "🩺 Nancy Meyers Rom-Com Gold",
    "question": "In Nancy Meyers’s \"Something’s Gotta Give\" (2003), which actor plays charming 36-year-old ER doctor Julian Mercer, who falls head-over-heels for Diane Keaton’s playwright Erica Barry?",
    "options": [
      "Keanu Reeves",
      "Jude Law",
      "Patrick Dempsey",
      "Josh Lucas"
    ],
    "correctIndex": 0,
    "funFact": "Generations of viewers still argue Erica Barry should have chosen Keanu Reeves’s devoted, emotionally mature Dr. Julian Mercer in Paris!",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": "",
    "youtubeEmbedUrl": "https://www.youtube-nocookie.com/embed/3d9UYuqXz0I"
  },
  {
    "id": "hacks-deborah-vance",
    "badge": "🎤 Emmy-Winning Vegas Legend",
    "question": "On HBO’s Emmy-winning comedy \"Hacks,\" Jean Smart’s legendary Vegas headliner Deborah Vance famously enjoys an unapologetic one-night desert fling with a handsome younger man played by whom in Season 2 (\"The Click\")?",
    "options": [
      "Matt McGorry",
      "Boyd Holbrook",
      "Cheyenne Jackson",
      "Devon Sawa"
    ],
    "correctIndex": 3,
    "funFact": "Devon Sawa’s guest turn opposite Jean Smart on the tour stop delivered one of Season 2’s funniest episodes.",
    "imageUrl": "./images/products/silk-robe-pillowcase.jpg",
    "imageCredit": ""
  },
  {
    "id": "on-the-island-graves",
    "badge": "🏝️ Survival Romance Smash",
    "question": "In Tracey Garvis Graves’s self-published-turned-NYT-bestseller \"On the Island,\" 30-year-old English tutor Anna Emerson and T.J. Callahan end up stranded together in which ocean chain after their seaplane crashes?",
    "options": [
      "The Bahamas",
      "The Azores",
      "The Maldives",
      "The Seychelles"
    ],
    "correctIndex": 2,
    "funFact": "\"On the Island\" sold over a million copies by blending castaway survival with the real-world shock of returning home years later.",
    "imageUrl": "./images/products/weekender-picnic.jpg",
    "imageCredit": ""
  },
  {
    "id": "the-proposal-bullock-reynolds",
    "badge": "💍 Blockbuster 12-Year Gap",
    "question": "In the $317M rom-com smash \"The Proposal\" (2009), Sandra Bullock plays Manhattan book editor-in-chief Margaret Tate alongside Ryan Reynolds (12 years her junior IRL) visiting his family in which state?",
    "options": [
      "Montana",
      "Alaska",
      "Maine",
      "Vermont"
    ],
    "correctIndex": 1,
    "funFact": "Sitka, Alaska, plus Betty White’s scene-stealing Grandma Annie, helped make \"The Proposal\" one of the highest-grossing romantic comedies of the century.",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": "",
    "youtubeEmbedUrl": "https://www.youtube-nocookie.com/embed/Wbhhokv84K4"
  },
  {
    "id": "goldie-kurt-halle-meghan-microgaps",
    "badge": "💛 3-to-6 Year Enduring Icons",
    "question": "Which beloved Hollywood couple (she is 5.5 years older) first worked together in 1968 and has chosen a joyful, devoted partnership since Valentine’s Day 1983 without ever needing a marriage license?",
    "options": [
      "Goldie Hawn & Kurt Russell",
      "Meryl Streep & Don Gummer",
      "Kyra Sedgwick & Kevin Bacon",
      "Sarah Jessica Parker & Matthew Broderick"
    ],
    "correctIndex": 0,
    "funFact": "Joining Goldie & Kurt (5.5 yrs) in proving micro-gaps shine too: Yvonne McGuinness & Cillian Murphy (4 yrs), Halle Berry & Van Hunt (3 yrs), and Meghan Markle & Prince Harry (3 yrs)!",
    "imageUrl": "./images/icons/pop_goldie_kurt.jpg",
    "imageCredit": ""
  },
  {
    "id": "30-rock-liz-lemon-criss",
    "badge": "🌭 30 Rock Endgame",
    "question": "On \"30 Rock,\" Tina Fey’s head writer Liz Lemon finds her true endgame marriage with sweet, supportive younger entrepreneur Criss Chros (James Marsden), who sells gourmet organic hot dogs out of what?",
    "options": [
      "A Staten Island ferry kiosk",
      "A Central Park pushcart",
      "A Times Square neon trailer",
      "A Manhattan food truck"
    ],
    "correctIndex": 3,
    "funFact": "James Marsden’s sunny, ego-free Criss Chros proved that emotional teamwork beats status posturing for a busy boss.",
    "imageUrl": "./images/products/aprons-kitchen.jpg",
    "imageCredit": ""
  },
  {
    "id": "a-family-affair-2024",
    "badge": "🍿 2024 Boss-Mom Collision",
    "question": "In Netflix’s \"A Family Affair\" (2024), Joey King discovers her widowed writer mom Brooke (Nicole Kidman) is secretly dating her movie-star boss played by whom?",
    "options": [
      "Channing Tatum",
      "Glen Powell",
      "Zac Efron",
      "Austin Butler"
    ],
    "correctIndex": 2,
    "funFact": "Zac Efron & Nicole Kidman reunited twelve years after \"The Paperboy\" for a lighthearted romantic comedy twist.",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": "",
    "youtubeEmbedUrl": "https://www.youtube-nocookie.com/embed/Ytc2eifpiuQ"
  },
  {
    "id": "julian-barnes-the-only-story",
    "badge": "🎾 British Literary Novel",
    "question": "In Booker-winner Julian Barnes’s 2018 novel \"The Only Story,\" 19-year-old Paul Roberts meets 48-year-old Susan MacLeod during a summer mixed-doubles draw at which suburban English setting?",
    "options": [
      "A Thames rowing club",
      "A village tennis club",
      "A parish cricket club",
      "A seaside sailing club"
    ],
    "correctIndex": 1,
    "funFact": "Mixed-doubles tennis draws have been sparking age-gap romances from 1960s Surrey straight to our Palisades Racquet Club.",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": ""
  },
  {
    "id": "zeta-jones-the-rebound",
    "badge": "☕ 2009 NYC Blueprint",
    "question": "In the 2009 rom-com \"The Rebound,\" Catherine Zeta-Jones plays newly divorced 40-year-old Sandy, who moves above a Manhattan coffee shop and falls for 25-year-old Aram played by whom?",
    "options": [
      "Justin Bartha",
      "Adam Brody",
      "Penn Badgley",
      "Chris Pine"
    ],
    "correctIndex": 0,
    "funFact": "Catherine Zeta-Jones & Justin Bartha nailed both the comedic highs and honest five-year reunion arc of an NYC 15-year gap.",
    "imageUrl": "./images/products/the-rebound-zeta-jones-prime.jpg",
    "imageCredit": "",
    "youtubeEmbedUrl": "https://www.youtube-nocookie.com/embed/PlCsLXcmxaA",
    "affiliateId": "the-rebound-zeta-jones-prime"
  },
  {
    "id": "mrs-robinson-grammy-record",
    "badge": "🎶 Record of the Year History",
    "question": "Simon & Garfunkel’s \"Mrs. Robinson\" (1968), written for \"The Graduate,\" became the first rock/pop song in Grammy history to win which top award?",
    "options": [
      "Song of the Year",
      "Best New Artist",
      "Album of the Year",
      "Record of the Year"
    ],
    "correctIndex": 3,
    "funFact": "Paul Simon originally drafted the melody as \"Mrs. Roosevelt\" before director Mike Nichols asked if they had anything for \"The Graduate\"!",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": "",
    "youtubeEmbedUrl": "https://www.youtube-nocookie.com/embed/WTxS7RrjqqY"
  },
  {
    "id": "mrs-fletcher-kathryn-hahn",
    "badge": "📚 HBO Empty-Nest Awakening",
    "question": "In HBO’s limited series \"Mrs. Fletcher\" (based on Tom Perrotta’s novel), which actress stars as divorced empty-nester Eve Fletcher rediscovering her desires after dropping her son off at college?",
    "options": [
      "Toni Collette",
      "Laura Linney",
      "Kathryn Hahn",
      "Jean Smart"
    ],
    "correctIndex": 2,
    "funFact": "Kathryn Hahn earned critical acclaim for her warm, fearless performance in Eve Fletcher’s post-divorce chapter.",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": ""
  },
  {
    "id": "leo-grande-emma-thompson",
    "badge": "🎭 BAFTA-Nominated Two-Hander",
    "question": "In \"Good Luck to You, Leo Grande\" (2022), what was Emma Thompson’s character Nancy Stokes’s former profession before booking a hotel suite with Daryl McCormack’s Leo?",
    "options": [
      "Retired High Court Magistrate",
      "Retired Religious Education Teacher",
      "Retired Symphony Cellist",
      "Retired Botanical Illustrator"
    ],
    "correctIndex": 1,
    "funFact": "Emma Thompson & Daryl McCormack earned rave reviews and four BAFTA nominations for their candid, funny celebration of 60+ desire and self-acceptance.",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": "",
    "youtubeEmbedUrl": "https://www.youtube-nocookie.com/embed/TJcbZoJFLTU"
  },
  {
    "id": "robinne-lee-idea-of-you-ending",
    "badge": "📕 Book vs. Movie Debate",
    "question": "How did the 2024 Prime Video film adaptation of \"The Idea of You\" famously change author Robinne Lee’s original 2017 novel ending?",
    "options": [
      "Added a hopeful five-year flash-forward reunion at Solène’s gallery",
      "Ended with Hayes proposing onstage during his London finale",
      "Moved Solène’s art gallery permanently from Silver Lake to Paris",
      "Kept them together seamlessly without any paparazzi breakup"
    ],
    "correctIndex": 0,
    "funFact": "Robinne Lee’s bittersweet French-style novel ending still sparks passionate book-club debates alongside the movie’s 5-year gallery reunion.",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": "",
    "affiliateId": "idea-of-you-movie-book"
  },
  {
    "id": "magic-mike-last-dance-london",
    "badge": "💃 2023 London Stage Takeover",
    "question": "In Steven Soderbergh’s \"Magic Mike’s Last Dance\" (2023), which powerhouse actress plays wealthy socialite Maxandra Mendoza, who whisks Channing Tatum’s Mike to London to direct a West End show?",
    "options": [
      "Monica Bellucci",
      "Penélope Cruz",
      "Sofia Vergara",
      "Salma Hayek Pinault"
    ],
    "correctIndex": 3,
    "funFact": "Salma Hayek Pinault & Channing Tatum bring electric chemistry from Miami bartending straight to London’s West End.",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": "",
    "youtubeEmbedUrl": "https://www.youtube-nocookie.com/embed/pBIGdw-BRxw"
  },
  {
    "id": "white-lotus-resort-canon",
    "badge": "🌺 Prestige Resort Satire",
    "question": "Mike White’s Emmy juggernaut \"The White Lotus\" set its first two lush resort seasons, packed with cross-generational entanglement, in which two glamorous locations?",
    "options": [
      "Bali and Cannes",
      "Fiji and Capri",
      "Hawaii and Sicily",
      "Cabo and Mykonos"
    ],
    "correctIndex": 2,
    "funFact": "Maui and Taormina set the gold standard for sun-drenched resort intrigue before Season 3 headed to Thailand.",
    "imageUrl": "./images/products/weekender-picnic.jpg",
    "imageCredit": ""
  },
  {
    "id": "prime-meryl-streep-twist",
    "badge": "🛋️ 2005 Manhattan Therapy Twist",
    "question": "In the 2005 rom-com \"Prime,\" Uma Thurman plays 37-year-old Rafi dating 23-year-old painter David, until her therapist (Meryl Streep) realizes mid-session that David is whom?",
    "options": [
      "Her ex-husband’s nephew",
      "Her own son",
      "Her upstairs landlord",
      "Her grad-school TA"
    ],
    "correctIndex": 1,
    "funFact": "Meryl Streep’s facial expressions upon realizing her patient’s glowing new 23-year-old lover is her own son make \"Prime\" an undefeated comedy rewatch.",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": ""
  },
  {
    "id": "vladimir-julia-may-jonas",
    "badge": "🖋️ Campus Satire Page-Turner",
    "question": "Julia May Jonas’s razor-sharp 2022 debut novel (adapted into a limited series starring Rachel Weisz & Leo Woodall) is titled after the magnetic younger novelist joining a liberal-arts English department, what is his first name?",
    "options": [
      "Vladimir",
      "Nikolai",
      "Dmitri",
      "Sasha"
    ],
    "correctIndex": 0,
    "funFact": "Casting Rachel Weisz opposite Leo Woodall turned \"Vladimir\" into prestige campus-lit heaven.",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": ""
  },
  {
    "id": "lonely-planet-morocco",
    "badge": "🇲🇦 2024 Writers Retreat",
    "question": "In Susannah Grant’s \"Lonely Planet\" (2024), where do novelist Katherine (Laura Dern) and younger finance exec Owen (Liam Hemsworth) spark away from home?",
    "options": [
      "A coastal villa in Greece",
      "A hilltop vineyard in Tuscany",
      "A mountain chalet in Chamonix",
      "A writers’ retreat in Morocco"
    ],
    "correctIndex": 3,
    "funFact": "Filmed across Chefchaouen and Marrakech, \"Lonely Planet\" pairs Laura Dern’s dry literary wit with Liam Hemsworth escaping a mismatched relationship.",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": "",
    "youtubeEmbedUrl": "https://www.youtube-nocookie.com/embed/lTu7j2GOGwQ"
  },
  {
    "id": "white-palace-sarandon-spader",
    "badge": "🍔 1990 St. Louis Electric Spark",
    "question": "In the steamy 1990 drama \"White Palace,\" Susan Sarandon plays 43-year-old St. Louis diner waitress Nora Baker opposite which actor as 27-year-old widower ad executive Max Baron?",
    "options": [
      "Rob Lowe",
      "Robert Downey Jr.",
      "James Spader",
      "John Cusack"
    ],
    "correctIndex": 2,
    "funFact": "Susan Sarandon & James Spader’s cross-class, 16-year-gap chemistry earned Golden Globe nominations and cult status.",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": ""
  },
  {
    "id": "flirting-with-forty-jane-porter",
    "badge": "🌺 40th-Birthday Escapism",
    "question": "In Jane Porter’s 2006 novel \"Flirting with Forty\" (later filmed starring Heather Locklear), divorced Seattle mom Jackie celebrates her 40th birthday solo and falls for a younger surf instructor where?",
    "options": [
      "Costa Rica",
      "Hawaii",
      "Byron Bay",
      "Biarritz"
    ],
    "correctIndex": 1,
    "funFact": "Solo milestone-birthday trips remain one of romance fiction’s favorite Chapter-Two openers.",
    "imageUrl": "./images/products/weekender-picnic.jpg",
    "imageCredit": ""
  },
  {
    "id": "cha-cha-real-smooth-sundance",
    "badge": "🎉 Sundance Audience Winner",
    "question": "In \"Cha Cha Real Smooth\" (2022), Cooper Raiff plays 22-year-old college grad Andrew working which weekend gig when he bonds deeply with Dakota Johnson’s Domino?",
    "options": [
      "Bar Mitzvah party starter",
      "Reception wedding DJ",
      "Country-club tennis pro",
      "Boutique hotel valet"
    ],
    "correctIndex": 0,
    "funFact": "\"Cha Cha Real Smooth\" won the Sundance U.S. Dramatic Audience Award for its tender, realistic look at timing and life stages.",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": "",
    "youtubeEmbedUrl": "https://www.youtube-nocookie.com/embed/QRyyagJ9GPo"
  },
  {
    "id": "the-good-girl-aniston-gyllenhaal",
    "badge": "🛒 Indie Sundance Gem",
    "question": "In Miguel Arteta’s acclaimed 2002 indie \"The Good Girl,\" Jennifer Aniston’s restless discount-store clerk Justine begins an affair with a 22-year-old cashier nicknamed Holden (after Holden Caulfield) played by whom?",
    "options": [
      "Joseph Gordon-Levitt",
      "Ryan Gosling",
      "Emile Hirsch",
      "Jake Gyllenhaal"
    ],
    "correctIndex": 3,
    "funFact": "Jennifer Aniston earned an Independent Spirit Award nomination opposite 21-year-old Jake Gyllenhaal.",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": "",
    "youtubeEmbedUrl": "https://www.youtube-nocookie.com/embed/dLRRX2iK7tQ"
  },
  {
    "id": "harold-and-maude-cat-stevens",
    "badge": "🌻 1971 Cult Masterpiece",
    "question": "Hal Ashby’s beloved 1971 rebel romance \"Harold and Maude\" (starring Ruth Gordon as 79-year-old free spirit Maude and Bud Cort as 20-year-old Harold) features an iconic acoustic soundtrack by which musician?",
    "options": [
      "Nick Drake",
      "Paul Simon",
      "Cat Stevens",
      "Leonard Cohen"
    ],
    "correctIndex": 2,
    "funFact": "Selected for the Library of Congress National Film Registry, \"Harold and Maude\" pairs fearless joie de vivre with Cat Stevens’s \"If You Want to Sing Out, Sing Out.\"",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": "",
    "youtubeEmbedUrl": "https://www.youtube-nocookie.com/embed/_ckWTn-y5Rw"
  },
  {
    "id": "hall-and-oates-maneater",
    "badge": "🎷 1982 #1 Billboard Classic",
    "question": "Daryl Hall & John Oates’s four-week #1 smash \"Maneater\" (1982), later covered on piano in \"No Hard Feelings\" features an iconic solo on which instrument?",
    "options": [
      "Electric guitar",
      "Saxophone",
      "Trumpet",
      "Harmonica"
    ],
    "correctIndex": 1,
    "funFact": "Charles DeChant’s smoky saxophone solo made \"Maneater\" Hall & Oates’s biggest hit of the 1980s.",
    "imageUrl": "./images/products/martini-barware-goblet.jpg",
    "imageCredit": "",
    "youtubeEmbedUrl": "https://www.youtube-nocookie.com/embed/yRYFKcMa_Ek"
  },
  {
    "id": "home-again-reese-witherspoon",
    "badge": "🏡 2017 LA Guesthouse Spark",
    "question": "In \"Home Again\" (2017), Reese Witherspoon plays newly separated 40-year-old Alice Kinney, who lets three aspiring 20-something filmmakers, led by Pico Alexander’s Harry, stay in her LA guesthouse. Who wrote and directed the film?",
    "options": [
      "Hallie Meyers-Shyer",
      "Greta Gerwig",
      "Olivia Wilde",
      "Nora Ephron"
    ],
    "correctIndex": 0,
    "funFact": "Hallie Meyers-Shyer (daughter of rom-com royalty Nancy Meyers & Charles Shyer) brought classic warm-kitchen Los Angeles charm to \"Home Again.\"",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": "",
    "youtubeEmbedUrl": "https://www.youtube-nocookie.com/embed/TOyit5_mEQA"
  },
  {
    "id": "sunset-boulevard-norma-desmond",
    "badge": "🎞️ 1950 Noir Legend",
    "question": "In Billy Wilder’s 1950 masterpiece \"Sunset Boulevard,\" silent-screen legend Norma Desmond (Gloria Swanson) hires down-on-his-luck younger screenwriter Joe Gillis, played by whom?",
    "options": [
      "Gregory Peck",
      "Montgomery Clift",
      "Kirk Douglas",
      "William Holden"
    ],
    "correctIndex": 3,
    "funFact": "\"I am big. It’s the pictures that got small!\" remains one of the most quoted lines in Hollywood history.",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": ""
  },
  {
    "id": "demi-moore-ashton-kutcher-watershed",
    "badge": "📸 15-Year Gap • 2003 Watershed",
    "question": "At which blockbuster June 2003 premiere did Demi Moore (then 40) and Ashton Kutcher (then 25) make their jaw-dropping red-carpet debut alongside Demi’s daughters and ex-husband Bruce Willis?",
    "options": [
      "\"Charlie’s Angels: Full Throttle\"",
      "\"Terminator 3: Rise of the Machines\"",
      "\"Legally Blonde 2: Red, White & Blonde\"",
      "\"Tomb Raider: The Cradle of Life\""
    ],
    "correctIndex": 0,
    "funFact": "Even though their eight-year marriage (2005–2013) eventually ended, Demi & Ashton’s fearless 2003 debut permanently shattered Hollywood’s double standard around women over 40 dating younger men.",
    "imageUrl": "./images/icons/pop_demi_ashton.jpg",
    "imageCredit": ""
  },
  {
    "id": "happiness-for-beginners-trail",
    "badge": "🥾 2023 Appalachian Trail Rom-Com",
    "question": "In \"Happiness for Beginners\" (2023, adapted from Katherine Center’s novel), Ellie Kemper’s newly divorced Helen signs up for an Appalachian Trail survival hike alongside her younger brother’s best friend Jake, played by whom?",
    "options": [
      "Theo James",
      "Sam Heughan",
      "Luke Grimes",
      "Garrett Hedlund"
    ],
    "correctIndex": 2,
    "funFact": "\"Yellowstone\" star Luke Grimes plays the quietly devoted doctor-in-training who knew Helen’s favorite snacks before Mile 1.",
    "imageUrl": "./images/products/trail-fitness.jpg",
    "imageCredit": ""
  },
  {
    "id": "kim-kardashian-lewis-hamilton-2026",
    "badge": "🏎️ 2026 Super Bowl LX Power Pair",
    "question": "In February 2026, reality mogul Kim Kardashian (45) sparked global headlines after stepping out at Super Bowl LX and a romantic Cotswolds getaway with which 7-time Formula 1 World Champion (41)?",
    "options": [
      "Charles Leclerc",
      "Lewis Hamilton",
      "Max Verstappen",
      "Lando Norris"
    ],
    "correctIndex": 1,
    "funFact": "Longtime friends since the mid-2010s, Kim Kardashian and Sir Lewis Hamilton turned heads from Estelle Manor in Oxfordshire to Paris and Super Bowl LX in early 2026.",
    "imageUrl": "./images/icons/pop_kris_corey.jpg",
    "imageCredit": "",
    "category": "music_celebs",
    "difficulty": "easy"
  },
  {
    "id": "nicole-scherzinger-athlete-streak",
    "badge": "🎤 Pussycat Doll Athlete Streak",
    "question": "Before getting engaged to Scottish rugby player Thom Evans (7 years younger), and years after her high-profile romance with younger F1 champion Lewis Hamilton, Nicole Scherzinger also dated which 13-years-younger tennis star?",
    "options": [
      "Grigor Dimitrov",
      "Matteo Berrettini",
      "Taylor Fritz",
      "Stefanos Tsitsipas"
    ],
    "correctIndex": 0,
    "funFact": "Born in 1978, Nicole Scherzinger famously dated both Lewis Hamilton (born January 1985) and rugby-star partner Thom Evans (born April 1985), plus Bulgarian tennis ace Grigor Dimitrov (born 1991)!",
    "imageUrl": "./images/icons/pop_olivia_harry.jpg",
    "imageCredit": "",
    "category": "music_celebs",
    "difficulty": "easy"
  },
  {
    "id": "nicole-scherzinger-sunset-blvd-tony",
    "badge": "🎭 Tony & Olivier Triumph",
    "question": "Winning both the Laurence Olivier Award and the 2025 Tony Award for Best Actress in a Musical, Nicole Scherzinger brought powerhouse vocals to which iconic older-woman role on the West End and Broadway?",
    "options": [
      "Mrs. Robinson in \"The Graduate\"",
      "Mame Dennis in \"Mame\"",
      "Norma Desmond in \"Sunset Blvd.\"",
      "Desirée Armfeldt in \"A Little Night Music\""
    ],
    "correctIndex": 2,
    "funFact": "Jamie Lloyd’s stripped-back revival of Andrew Lloyd Webber’s \"Sunset Blvd.\" turned Nicole Scherzinger’s Norma Desmond opposite Tom Francis’s younger Joe Gillis into Broadway’s hottest ticket.",
    "imageUrl": "./images/icons/pop_stella_cinema.jpg",
    "imageCredit": "",
    "category": "music_celebs",
    "difficulty": "hard"
  },
  {
    "id": "desperate-housewives-gaby-gardener",
    "badge": "🌹 Wisteria Lane Classic",
    "question": "In Season 1 of ABC’s megahit \"Desperate Housewives,\" Eva Longoria’s glamorous Gabrielle Solis sparks scandalous suburban gossip on Wisteria Lane with her handsome young landscaper played by whom?",
    "options": [
      "Jesse Metcalfe",
      "Chad Michael Murray",
      "Chace Crawford",
      "Taylor Kitsch"
    ],
    "correctIndex": 0,
    "funFact": "Eva Longoria and Jesse Metcalfe turned \"the hot gardener on Wisteria Lane\" into one of 2000s network television’s most parodied tropes.",
    "imageUrl": "./images/products/martini-barware-goblet.jpg",
    "imageCredit": "",
    "category": "tv",
    "difficulty": "easy"
  },
  {
    "id": "fleabag-belinda-hotel-bar-speech",
    "badge": "🍸 Emmy-Nominated Bar Scene",
    "question": "In Season 2 of Phoebe Waller-Bridge’s \"Fleabag,\" which legendary actress plays poised businesswoman Belinda, who delivers a viral hotel-bar martini monologue on why women grow freer past fifty?",
    "options": [
      "Gillian Anderson",
      "Helen McCrory",
      "Olivia Colman",
      "Kristin Scott Thomas"
    ],
    "correctIndex": 3,
    "funFact": "Kristin Scott Thomas earned an Emmy nomination for a single electrifying cocktail-bar scene celebrating women’s post-50 liberation.",
    "imageUrl": "./images/products/martini-barware-goblet.jpg",
    "imageCredit": "",
    "category": "tv",
    "difficulty": "hard"
  },
  {
    "id": "curtis-sittenfeld-romantic-comedy",
    "badge": "📚 2023 NYT Bestseller",
    "question": "In Curtis Sittenfeld’s runaway bestseller \"Romantic Comedy\" (2023), late-night sketch comedy writer Sally Milz writes a skit mocking male celebrities who only date young models, right before falling for which younger pop-music host?",
    "options": [
      "Hayes Campbell",
      "Noah Brewster",
      "Lukas Moy",
      "Reid Sutherland"
    ],
    "correctIndex": 1,
    "funFact": "Curtis Sittenfeld flipped the classic late-night comedy double standard into one of BookTok’s sharpest witty romances.",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": "",
    "category": "books",
    "difficulty": "easy"
  },
  {
    "id": "terry-mcmillan-stella-novel-1996",
    "badge": "📖 1996 Publishing Phenomenon",
    "question": "Two years before the hit film arrived in theaters, which bestselling novelist wrote the 1996 phenomenon \"How Stella Got Her Groove Back,\" inspired by her own real-life Jamaican romance with Jonathan Plummer?",
    "options": [
      "Toni Morrison",
      "Terry McMillan",
      "Alice Walker",
      "Zadie Smith"
    ],
    "correctIndex": 1,
    "funFact": "Terry McMillan’s fearless 1996 novel sold millions of copies in hardcover and launched an entire era of Chapter-Two fiction.",
    "imageUrl": "./images/icons/pop_stella_cinema.jpg",
    "imageCredit": "",
    "category": "books",
    "difficulty": "easy"
  },
  {
    "id": "agatha-christie-max-mallowan-memoir",
    "badge": "🏺 46-Year Literary Marriage",
    "question": "Mystery queen Agatha Christie shared a joyful 46-year second marriage with archaeologist Sir Max Mallowan (14 years her junior), chronicling their Middle Eastern digs in which witty 1946 memoir?",
    "options": [
      "\"A Room of One’s Own\"",
      "\"Out of Africa\"",
      "\"West with the Night\"",
      "\"Come, Tell Me How You Live\""
    ],
    "correctIndex": 3,
    "funFact": "Married from 1930 until her passing in 1976, Agatha Christie proved a 14-year age-gap partnership could thrive across four decades of global adventure.",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": "",
    "category": "books",
    "difficulty": "hard",
    "level": 3
  },
  {
    "id": "the-office-jan-hunter-cd",
    "badge": "💿 Sitcom Cringe Masterpiece",
    "question": "In \"The Office\" Season 4 classic \"Dinner Party,\" Jan Levinson closes her eyes and sways blissfully to an indie acoustic track (\"You took me by the hand, made me a man\") recorded by her former teenage assistant named whom?",
    "options": [
      "Hunter",
      "Ryan",
      "Gabe",
      "Plop"
    ],
    "correctIndex": 0,
    "funFact": "Written by Lee Eisenberg and Gene Stupnitsky, Hunter’s \"That One Night\" remains television’s funniest unspoken older-boss / young-assistant musical confession.",
    "imageUrl": "./images/products/martini-barware-goblet.jpg",
    "imageCredit": "",
    "category": "tv",
    "difficulty": "easy",
    "level": 1
  },
  {
    "id": "challengers-tashi-duncan-2024",
    "badge": "🎾 2024 Tennis Power Triangle",
    "question": "In Luca Guadagnino’s electric 2024 hit \"Challengers,\" Zendaya plays injury-sidelined tennis phenomenon Tashi Duncan, whose hotel-room dare locks which two lifelong friends into over a decade of romantic obsession?",
    "options": [
      "Nick & Shane",
      "Art & Patrick",
      "Julian & Miles",
      "Lukas & Liam"
    ],
    "correctIndex": 1,
    "funFact": "Josh O’Connor and Mike Faist orbiting Zendaya’s razor-sharp Tashi Duncan made \"Challengers\" the ultimate movie-night debate on ambition and desire.",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": "",
    "category": "movies",
    "difficulty": "easy",
    "level": 1
  },
  {
    "id": "tlc-milf-manor-plot-twist",
    "badge": "🏖️ Unhinged Reality-TV Twist",
    "question": "In Episode 1 of TLC’s viral 2023 dating series \"MILF Manor,\" eight single women in their 40s and 50s step onto a Mexican beach expecting twenty-something suitors, only for the doors to open and reveal the young men are all whom?",
    "options": [
      "Their ex-husbands’ tennis coaches",
      "Undercover soap-opera actors",
      "Each other’s actual adult sons",
      "Local surf instructors from Tulum"
    ],
    "correctIndex": 2,
    "funFact": "Even seasoned reality-TV viewers gasped out loud when Episode 1 dropped the twist, inspiring legendary late-night comedy parodies.",
    "imageUrl": "./images/products/weekender-picnic.jpg",
    "imageCredit": "",
    "category": "tv",
    "difficulty": "easy",
    "level": 1
  },
  {
    "id": "madonna-akeem-morris-soccer",
    "badge": "👑 37-Year Gap • Portofino to Paris",
    "question": "From her Italian birthday getaway in Portofino through 2025 and 2026 Paris Fashion Week, Queen of Pop Madonna stepped out alongside 37-years-younger Jamaican partner Akeem Morris, who played collegiate and semi-pro what in New York?",
    "options": [
      "Track & Field",
      "Soccer",
      "Basketball",
      "Fencing"
    ],
    "correctIndex": 1,
    "funFact": "Former Stony Brook University forward Akeem Morris first met Madonna during a 2022 Paper Magazine shoot before their globe-trotting romance.",
    "imageUrl": "./images/icons/pop_madonna_mariahc_sarandon.jpg",
    "imageCredit": "",
    "category": "music_celebs",
    "difficulty": "easy",
    "level": 1
  },
  {
    "id": "friends-monica-young-ethan",
    "badge": "☕ 1995 Central Perk Shock",
    "question": "Long before dating older ophthalmologist Dr. Richard Burke, 26-year-old Monica Geller gets blindsided in \"Friends\" Season 1 (\"The One with the Ick Factor\") when \"college senior\" Young Ethan confesses in bed that he is actually a what?",
    "options": [
      "Freshman dorm RA",
      "High school senior",
      "Gap-year backpacker",
      "Twenty-year-old intern"
    ],
    "correctIndex": 1,
    "funFact": "Monica’s horrified \"That’s icky!\" set the sitcom gold standard for checking IDs before catching feelings.",
    "imageUrl": "./images/products/mugs-love-coupons.jpg",
    "imageCredit": "",
    "category": "tv",
    "difficulty": "easy",
    "level": 1
  },
  {
    "id": "kate-beckinsale-msg-pete-davidson",
    "badge": "🏒 Viral Rinkside Reaction Meme",
    "question": "Actress Kate Beckinsale (20 years older) sparked one of the internet’s funniest three-person memes in 2019 while passionately kissing \"SNL\" star Pete Davidson rinkside at a Rangers game right next to which visibly third-wheeling \"Queer Eye\" host?",
    "options": [
      "Tan France",
      "Jonathan Van Ness",
      "Karamo Brown",
      "Antoni Porowski"
    ],
    "correctIndex": 3,
    "funFact": "Antoni Porowski staring straight ahead into space next to Kate and Pete became an instant hall-of-fame reaction image.",
    "imageUrl": "./images/icons/pop_demi_ashton.jpg",
    "imageCredit": "",
    "category": "music_celebs",
    "difficulty": "easy",
    "level": 1
  },
  {
    "id": "nora-goes-off-script-monaghan",
    "badge": "☕ BookTok Porch-Coffee Smash",
    "question": "In Annabel Monaghan’s beloved bestseller \"Nora Goes Off Script\" (2022), divorced romance screenwriter Nora Hamilton rents her backyard tea house for a film shoot, and younger superstar Leo Vance offers $1,000 a day just to do what after wrap?",
    "options": [
      "Stay an extra week drinking morning coffee on her porch",
      "Turn her garage into a private recording studio",
      "Adopt her children’s golden retriever puppy",
      "Buy the neighboring Hudson Valley farmhouse"
    ],
    "correctIndex": 0,
    "funFact": "Leo Vance slipping seamlessly into school drop-off, grocery runs, and quiet morning coffee made \"Nora Goes Off Script\" pure Chapter-Two wish fulfillment.",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": "",
    "category": "books",
    "difficulty": "easy",
    "level": 1
  },
  {
    "id": "idea-of-you-august-moon-band",
    "badge": "🎤 Boy-Band Lore • Book & Film",
    "question": "In both Robinne Lee’s hit novel \"The Idea of You\" and its blockbuster adaptation, 24-year-old British heartthrob Hayes Campbell fronts which fictional chart-topping boy band?",
    "options": [
      "Midnight Sun",
      "Silver Tide",
      "August Moon",
      "Velvet West"
    ],
    "correctIndex": 2,
    "funFact": "Prime Video even recorded a full real-world EP under the name August Moon, complete with tour merch and earworm pop singles!",
    "imageUrl": "./images/products/idea-of-you-movie-book.jpg",
    "imageCredit": "",
    "affiliateId": "idea-of-you-movie-book",
    "category": "books",
    "difficulty": "easy",
    "level": 1
  },
  {
    "id": "kristin-cavallari-montana-boyz",
    "badge": "🤠 2024 TikTok Age-Gap Frenzy",
    "question": "In 2024, \"Laguna Beach\" founder Kristin Cavallari sparked months of viral TikTok chatter with her 13-year age-gap romance alongside 24-year-old Mark Estes, a member of which country lip-sync group?",
    "options": [
      "Montana Boyz",
      "Bozeman Crew",
      "Nashville Cowboys",
      "Big Sky Trio"
    ],
    "correctIndex": 0,
    "funFact": "Kristin’s candid podcast reflections, first defending the chemistry and then lovingly parting ways so a 24-year-old could live his twenties, resonated across every age-gap forum.",
    "imageUrl": "./images/icons/pop_kristin_montana.jpg",
    "imageCredit": "",
    "category": "music_celebs",
    "difficulty": "medium",
    "level": 2
  },
  {
    "id": "shakira-lucien-laviscount-punteria",
    "badge": "🏹 Post-Breakup Glow-Up Era",
    "question": "Following her post-Piqué comeback, Shakira sparked 15-year-gap NYC dinner headlines in 2024 with British \"Emily in Paris\" star Lucien Laviscount right after casting him as a pink-haired centaur in which music video?",
    "options": [
      "\"Monotonía\"",
      "\"Copa Vacía\"",
      "\"Puntería\"",
      "\"Te Felicito\""
    ],
    "correctIndex": 2,
    "funFact": "Shakira & Cardi B’s \"Puntería\" video featuring Lucien Laviscount proved there is no rebound quite like casting a British heartthrob in mythological armor.",
    "imageUrl": "./images/icons/pop_sienna_oli.jpg",
    "imageCredit": "",
    "category": "music_celebs",
    "difficulty": "medium",
    "level": 2
  },
  {
    "id": "olivia-wilde-harry-styles-booksmart",
    "badge": "🎬 Director’s Chair Spark",
    "question": "Before her globe-spanning 10-year-gap romance with pop superstar Harry Styles on 2022’s \"Don’t Worry Darling,\" actress-filmmaker Olivia Wilde earned rave reviews directing which beloved 2019 comedy?",
    "options": [
      "\"Lady Bird\"",
      "\"Booksmart\"",
      "\"Bottoms\"",
      "\"Bodies Bodies Bodies\""
    ],
    "correctIndex": 1,
    "funFact": "Between Wembley Stadium front-row dancing and viral \"special salad dressing\" lore, Olivia & Harry owned two straight years of pop-culture headlines.",
    "imageUrl": "./images/icons/pop_olivia_harry.jpg",
    "imageCredit": "",
    "category": "music_celebs",
    "difficulty": "medium",
    "level": 2
  },
  {
    "id": "love-is-blind-jessica-age-math",
    "badge": "🍷 Reality-TV Wine Math",
    "question": "In Netflix’s \"Love Is Blind\" Season 1, 34-year-old Jessica Batten turned date-math anxiety into viral television history while fretting over 24-year-old fitness trainer Mark Cuevas: \"When he’s 40, I’m gonna be...\" what?",
    "options": [
      "44",
      "48",
      "54",
      "50"
    ],
    "correctIndex": 3,
    "funFact": "Jessica recalculating a 10-year gap across every decade over Italian red wine became Netflix’s most quoted math lesson.",
    "imageUrl": "./images/products/big-carl-giant-wine-glass.jpg",
    "imageCredit": "",
    "category": "tv",
    "difficulty": "medium",
    "level": 2
  },
  {
    "id": "satc-carrie-twentysomething-sam",
    "badge": "🧻 SATC Apartment Wake-Up Call",
    "question": "In \"Sex and the City\" Season 1 (\"Valley of the Twenty-Something Guys\"), which future \"Justified\" and \"The White Lotus\" star played Carrie Bradshaw’s charming 20-something fling Sam, whose chaotic roommate apartment had zero toilet paper?",
    "options": [
      "Timothy Olyphant",
      "Bradley Cooper",
      "Justin Theroux",
      "Gabriel Macht"
    ],
    "correctIndex": 0,
    "funFact": "Before Bradley Cooper, David Duchovny, and Jon Bon Jovi guest-starred on \"SATC,\" 30-year-old Timothy Olyphant immortalized why bathroom prep matters!",
    "imageUrl": "./images/products/hosting-lidded-bin-soap.jpg",
    "imageCredit": "",
    "category": "tv",
    "difficulty": "medium",
    "level": 2
  },
  {
    "id": "unfaithful-diane-lane-soho",
    "badge": "🌬️ 2002 Oscar-Nominated Heat",
    "question": "In Adrian Lyne’s 2002 drama \"Unfaithful,\" Diane Lane earned an Academy Award nomination as suburban wife Connie Sumner after literally colliding in a SoHo windstorm with younger French rare-book dealer Paul Martel, played by whom?",
    "options": [
      "Vincent Cassel",
      "Gilles Marini",
      "Olivier Martinez",
      "Jean Dujardin"
    ],
    "correctIndex": 2,
    "funFact": "A stack of spilled art books during a New York windstorm remains cinema’s steamiest excuse to come upstairs for band-aids and espresso.",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": "",
    "category": "movies",
    "difficulty": "medium",
    "level": 2
  },
  {
    "id": "may-december-julianne-charles",
    "badge": "🦋 2023 Cannes & Oscar Buzz",
    "question": "In Todd Haynes’s razor-sharp 2023 film \"May December,\" Natalie Portman plays an actress shadowing Julianne Moore’s Gracie and her 23-years-younger husband Joe, earning universal acclaim for which breakout actor?",
    "options": [
      "Charles Melton",
      "Jacob Elordi",
      "Paul Mescal",
      "Barry Keoghan"
    ],
    "correctIndex": 0,
    "funFact": "Charles Melton swept critics’ awards opposite Oscar winners Julianne Moore and Natalie Portman in Savannah.",
    "imageUrl": "./images/icons/pop_julianne_bart.jpg",
    "imageCredit": "",
    "category": "movies",
    "difficulty": "medium",
    "level": 2
  },
  {
    "id": "evie-drake-starts-over-holmes",
    "badge": "⚾ Maine Guesthouse Slow-Burn",
    "question": "In NPR critic Linda Holmes’s NYT bestseller \"Evie Drake Starts Over,\" a young Maine widow rents her apartment wing to Dean Tenney, a charming former pro athlete battling a sudden mental block in which sport?",
    "options": [
      "NHL goaltending",
      "PGA golf putting",
      "MLB baseball pitching",
      "ATP tennis serving"
    ],
    "correctIndex": 2,
    "funFact": "Rule #1 of their guesthouse lease (Evie never asks about baseball, Dean never asks about her late husband) sets up peak slow-burn banter.",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": "",
    "category": "books",
    "difficulty": "medium",
    "level": 2
  },
  {
    "id": "30-rock-liz-frank-mom-coffee-guy",
    "badge": "☕ 30 Rock \"Cougars\" Episode",
    "question": "In \"30 Rock\" Season 2 (\"Cougars\"), Liz Lemon steels her nerves to go out with adorable 20-year-old coffee delivery guy Jamie, until meeting Jamie’s mom and discovering she once had a scandalous past with which \"TGS\" writer?",
    "options": [
      "Toofer Spurlock",
      "Lutz",
      "Frank Rossitano",
      "Pete Hornberger"
    ],
    "correctIndex": 2,
    "funFact": "Tina Fey turning her baseball cap sideways to \"blend in\" with twenty-somethings before realizing Frank loves Jamie’s mom is peak 2000s comedy.",
    "imageUrl": "./images/products/mugs-love-coupons.jpg",
    "imageCredit": "",
    "category": "tv",
    "difficulty": "hard",
    "level": 3
  },
  {
    "id": "y-tu-mama-tambien-cuaron",
    "badge": "🌊 2001 Road-Trip Masterpiece",
    "question": "In Alfonso Cuarón’s Oscar-nominated 2001 classic \"Y Tu Mamá También,\" Spanish star Maribel Verdú plays 28-year-old Luisa, who spontaneously joins two teenage best friends on a road trip to which invented beach name?",
    "options": [
      "Playa Escondida",
      "Costa Dorada",
      "Puerto Sol",
      "Boca del Cielo"
    ],
    "correctIndex": 3,
    "funFact": "Gael García Bernal, Diego Luna, and Maribel Verdú turned a made-up Oaxacan beach bluff into one of the 21st century’s greatest coming-of-age films.",
    "imageUrl": "./images/products/weekender-picnic.jpg",
    "imageCredit": "",
    "category": "movies",
    "difficulty": "hard",
    "level": 3
  },
  {
    "id": "tea-and-sympathy-be-kind",
    "badge": "🎭 1953 Broadway & MGM Classic",
    "question": "Which landmark 1953 play by Robert Anderson (later filmed with Deborah Kerr) ends with a compassionate boarding-school wife whispering the famous line: \"Years from now, when you talk about this, and you will, be kind\"?",
    "options": [
      "\"Separate Tables\"",
      "\"The Chalk Garden\"",
      "\"Summer and Smoke\"",
      "\"Tea and Sympathy\""
    ],
    "correctIndex": 3,
    "funFact": "Deborah Kerr originated Laura Reynolds on Broadway before reprising the role on screen in Vincente Minnelli’s 1956 adaptation.",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": "",
    "category": "books",
    "difficulty": "hard",
    "level": 3
  },
  {
    "id": "francoise-sagan-aimez-vous-brahms",
    "badge": "🥐 1959 Parisian Romance Novel",
    "question": "In Françoise Sagan’s celebrated 1959 French novel \"Aimez-vous Brahms...\" (adapted into \"Goodbye Again\" with Ingrid Bergman and 29-year-old Anthony Perkins), 39-year-old Parisian decorator Paula is courted passionately by a 25-year-old law clerk named whom?",
    "options": [
      "Laurent",
      "Simon",
      "Julien",
      "Henri"
    ],
    "correctIndex": 1,
    "funFact": "Anthony Perkins won Best Actor at the 1961 Cannes Film Festival for playing love-struck younger suitor Philip (Simon in Sagan’s novel) opposite Ingrid Bergman.",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": "",
    "category": "books",
    "difficulty": "hard",
    "level": 3
  },
  // === CATEGORY 5: SPORTS & PRO ATHLETES (Lv.1, Lv.2, Lv.3) ===
  {
    "id": "gabrielle-union-dwyane-wade-met",
    "badge": "🏀 NBA & Met Gala Royalty",
    "question": "NBA Hall-of-Famer Dwyane Wade married actress Gabrielle Union (9 years his senior) at a Miami castle in 2014; which franchise retired Wade’s iconic #3 jersey?",
    "options": [
      "Miami Heat",
      "Chicago Bulls",
      "Los Angeles Lakers",
      "Boston Celtics"
    ],
    "correctIndex": 0,
    "funFact": "Gabrielle Union and Dwyane Wade have been red-carpet goals for over a decade, cheering court-side from Miami to Paris.",
    "imageUrl": "./images/icons/pop_gabrielle_dwyane.jpg",
    "imageCredit": "",
    "category": "sports",
    "difficulty": "easy",
    "level": 1
  },
  {
    "id": "shakira-pique-world-cup-anthem",
    "badge": "⚽ 2010 World Cup Spark",
    "question": "Colombian superstar Shakira first met Spanish defender Gerard Piqué (born on the exact same February 2 birthday, 10 years apart) while filming the video for which 2010 World Cup anthem?",
    "options": [
      "\"Hips Don't Lie\"",
      "\"Waka Waka\"",
      "\"La Tortura\"",
      "\"She Wolf\""
    ],
    "correctIndex": 1,
    "funFact": "Piqué appeared in the \"Waka Waka (This Time for Africa)\" music video in spring 2010 and promised Shakira he would win the World Cup final just to see her again at the closing ceremony.",
    "imageUrl": "./images/icons/pop_olivia_harry.jpg",
    "imageCredit": "",
    "category": "sports",
    "difficulty": "easy",
    "level": 1
  },
  {
    "id": "victoria-david-beckham-lounge",
    "badge": "⚽ Posh & Becks Origin",
    "question": "Fashion mogul Victoria Adams (one year older than husband David Beckham) famously wrote her phone number on what item for a 21-year-old Beckham inside the Manchester United players’ lounge in 1997?",
    "options": [
      "A silk cocktail napkin",
      "Her London plane ticket",
      "A backstage Spice Girls pass",
      "A matchday program cover"
    ],
    "correctIndex": 1,
    "funFact": "David Beckham kept Victoria’s London-to-Manchester plane ticket stub in his wallet for years after that 1997 charity match.",
    "imageUrl": "./images/scenes/velvet-room-bar.jpg",
    "imageCredit": "",
    "category": "sports",
    "difficulty": "easy",
    "level": 1
  },
  {
    "id": "larsa-pippen-marcus-jordan-reality",
    "badge": "🏰 Reality Castle Duo",
    "question": "\"Real Housewives of Miami\" star Larsa Pippen and former college basketball guard Marcus Jordan (16 years her junior) competed side-by-side inside a Scottish castle on Season 2 of which hit show?",
    "options": [
      "The Traitors",
      "House of Villains",
      "Special Forces",
      "Deal or No Deal Island"
    ],
    "correctIndex": 0,
    "funFact": "Hosted by Alan Cumming in the Scottish Highlands, Season 2 of \"The Traitors\" turned their 16-year gap alliance into round-table appointment television.",
    "imageUrl": "./images/scenes/candlelit-cocktails.jpg",
    "imageCredit": "",
    "category": "sports",
    "difficulty": "easy",
    "level": 1
  },
  {
    "id": "maria-sharapova-grigor-dimitrov-slam",
    "badge": "🎾 Grand Slam Power Pair",
    "question": "Before dating Nicole Scherzinger, Bulgarian tennis star Grigor Dimitrov spent two years on tour dating which five-time Grand Slam champion four years his senior?",
    "options": [
      "Venus Williams",
      "Victoria Azarenka",
      "Maria Sharapova",
      "Caroline Wozniacki"
    ],
    "correctIndex": 2,
    "funFact": "Sharapova confirmed their romance after the 2013 Madrid Open, making the pair tennis’s most photographed duo from Wimbledon to Melbourne.",
    "imageUrl": "./images/scenes/palm-springs-resort.jpg",
    "imageCredit": "",
    "category": "sports",
    "difficulty": "medium",
    "level": 2
  },
  {
    "id": "shakira-bzrp-rolex-casio",
    "badge": "⌚ Record-Breaking Diss",
    "question": "In Shakira’s chart-topping 2023 track \"BZRP Music Sessions, Vol. 53\" aimed at 10-years-younger ex-footballer Gerard Piqué, she sang that he traded a Ferrari for a Twingo and what luxury watch for a Casio?",
    "options": [
      "A Cartier",
      "A Patek",
      "A Rolex",
      "An Omega"
    ],
    "correctIndex": 2,
    "funFact": "The track shattered 14 Guinness World Records and turned \"You traded a Rolex for a Casio\" into an instant global breakup proverb.",
    "imageUrl": "./images/icons/pop_madonna_mariahc_sarandon.jpg",
    "imageCredit": "",
    "category": "sports",
    "difficulty": "medium",
    "level": 2
  },
  {
    "id": "ciara-russell-wilson-wisconsin",
    "badge": "🏈 Courtside First Spark",
    "question": "Grammy winner Ciara (three years older than Super Bowl-winning quarterback Russell Wilson) first hit it off with Wilson in March 2015 after sitting together at what sporting event?",
    "options": [
      "A Seattle Mariners opening night",
      "A Wisconsin Badgers basketball game",
      "The Kentucky Derby millionaire row",
      "A Wimbledon quarterfinal match"
    ],
    "correctIndex": 1,
    "funFact": "Months after meeting at a University of Wisconsin basketball game and attending a White House State Dinner together, Wilson proposed on a secluded Seychelles beach.",
    "imageUrl": "./images/scenes/wedding-gala-cheers.jpg",
    "imageCredit": "",
    "category": "sports",
    "difficulty": "medium",
    "level": 2
  },
  {
    "id": "danica-patrick-stenhouse-cup",
    "badge": "🏁 200-MPH Romance",
    "question": "Trailblazing racer Danica Patrick dated fellow driver Ricky Stenhouse Jr. (six years her junior) for five seasons while both competed full-time in which motorsport series?",
    "options": [
      "Formula One World Championship",
      "IndyCar Oval Championship",
      "NASCAR Cup Series",
      "World Endurance Series"
    ],
    "correctIndex": 2,
    "funFact": "Patrick won the 2013 Daytona 500 pole position the very same rookie Cup season she and two-time Xfinity champion Stenhouse went public.",
    "imageUrl": "./images/scenes/coastal-convertible.jpg",
    "imageCredit": "",
    "category": "sports",
    "difficulty": "medium",
    "level": 2
  },
  {
    "id": "wanda-nara-mauro-icardi-agent",
    "badge": "⚽ Serie A Power Broker",
    "question": "Argentine TV star Wanda Nara famously served as the hard-nosed contract agent for her 7-years-younger striker husband Mauro Icardi while he captained which Italian Serie A club?",
    "options": [
      "Juventus FC",
      "AC Milan",
      "AS Roma",
      "Inter Milan"
    ],
    "correctIndex": 3,
    "funFact": "Italian sports papers dubbed Wanda Nara the toughest negotiator in Milan when she hammered out Icardi’s San Siro contract extensions herself.",
    "imageUrl": "./images/icons/pop_caroline_sergio.jpg",
    "imageCredit": "",
    "category": "sports",
    "difficulty": "hard",
    "level": 3
  },
  {
    "id": "pamela-anderson-adil-rami-france",
    "badge": "🏆 2018 World Cup Romance",
    "question": "\"Baywatch\" icon Pamela Anderson relocated to the French Riviera in 2017 while dating which 18-years-younger defender on France’s 2018 FIFA World Cup championship squad?",
    "options": [
      "Olivier Giroud",
      "Adil Rami",
      "Benjamin Pavard",
      "Raphaël Varane"
    ],
    "correctIndex": 1,
    "funFact": "Anderson cheered from the VIP box in Russia as Olympique de Marseille center-back Adil Rami and France lifted the 2018 World Cup trophy.",
    "imageUrl": "./images/scenes/hotel-pool-sauna.jpg",
    "imageCredit": "",
    "category": "sports",
    "difficulty": "hard",
    "level": 3
  },
  {
    "id": "vanessa-hudgens-cole-tucker-zoom",
    "badge": "⚾ Slide-Into-DMs Win",
    "question": "Actress Vanessa Hudgens married MLB shortstop Cole Tucker (eight years her junior) in Tulum in 2023 after sliding into his DMs following what 2020 group call?",
    "options": [
      "A charity poker livestream",
      "A Zoom meditation group",
      "A cast table-read webinar",
      "A Peloton team ride"
    ],
    "correctIndex": 1,
    "funFact": "Hudgens unapologetically DMed Tucker right after Joe Jonas’s group Zoom meditation session: \"If I want something or someone, I’m going after them.\"",
    "imageUrl": "./images/scenes/canyon-sunrise-trail.jpg",
    "imageCredit": "",
    "category": "sports",
    "difficulty": "hard",
    "level": 3
  },
  {
    "id": "sue-bird-megan-rapinoe-olympics",
    "badge": "🏅 Olympic Gold Couple",
    "question": "WNBA legend Sue Bird (five years older than USWNT soccer icon Megan Rapinoe) first connected with Rapinoe at a sponsor shoot ahead of which Summer Olympics?",
    "options": [
      "2012 London Olympics",
      "2016 Rio Olympics",
      "2020 Tokyo Olympics",
      "2008 Beijing Olympics"
    ],
    "correctIndex": 1,
    "funFact": "Between them, Sue Bird and Megan Rapinoe hold six Olympic gold medals, four WNBA titles, and two FIFA Women’s World Cups.",
    "imageUrl": "./images/scenes/terminal-b-arrivals.jpg",
    "imageCredit": "",
    "category": "sports",
    "difficulty": "hard",
    "level": 3
  },
  // === CATEGORY 6: ROYALS, WORLD LEADERS & HISTORY (Lv.1, Lv.2, Lv.3) ===
  {
    "id": "shakespeare-anne-hathaway-bed",
    "badge": "📜 1582 Literary Marriage",
    "question": "At age 18 in 1582 Stratford-upon-Avon, William Shakespeare married 26-year-old Anne Hathaway (eight years his senior); what famously specific item did he leave her in his will?",
    "options": [
      "His gilded feather quill",
      "His Globe Theatre shares",
      "His second-best bed",
      "His signet gold ring"
    ],
    "correctIndex": 2,
    "funFact": "In Tudor households the \"best bed\" was reserved for prestigious houseguests, meaning the \"second-best bed\" was actually William and Anne’s own marital bed.",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": "",
    "category": "royals_history",
    "difficulty": "easy",
    "level": 1
  },
  {
    "id": "napoleon-josephine-paris-certificate",
    "badge": "👑 1796 Parisian Romance",
    "question": "Parisian socialite Joséphine de Beauharnais was six years older than 26-year-old General Napoleon Bonaparte when they wed in 1796; how did both fudge their civil marriage certificate?",
    "options": [
      "They left both birthdates blank",
      "Napoleon added 18 months and she cut 4 years",
      "They signed under royal pseudonyms",
      "They backdated the wedding by two years"
    ],
    "correctIndex": 1,
    "funFact": "To narrow their six-year gap on paper, a smitten young Napoleon gallantly made himself older while 32-year-old Joséphine shaved four years off her birth year.",
    "imageUrl": "./images/icons/pop_macrons.jpg",
    "imageCredit": "",
    "category": "royals_history",
    "difficulty": "easy",
    "level": 1
  },
  {
    "id": "meghan-markle-prince-harry-camping",
    "badge": "🇬🇧 Royal Date #3 Escape",
    "question": "Meghan Markle is three years older than Prince Harry; after just two back-to-back London dates in July 2016, where did Harry invite her to camp for five days under the stars?",
    "options": [
      "Scottish Highlands",
      "Botswana",
      "New Zealand",
      "Costa Rica"
    ],
    "correctIndex": 1,
    "funFact": "Harry later included a center diamond sourced from Botswana in Meghan’s custom engagement ring as a tribute to their third-date camping trip.",
    "imageUrl": "./images/icons/pop_meghan_harry.jpg",
    "imageCredit": "",
    "category": "royals_history",
    "difficulty": "easy",
    "level": 1
  },
  {
    "id": "brigitte-emmanuel-macron-workshop",
    "badge": "🇫🇷 Élysée Palace Duo",
    "question": "French First Lady Brigitte Macron (24 years older than President Emmanuel Macron) first collaborated with him in Amiens while directing which school extracurricular?",
    "options": [
      "The varsity fencing team",
      "The theater and drama club",
      "The national debate squad",
      "The classical orchestra"
    ],
    "correctIndex": 1,
    "funFact": "Years later they married in Le Touquet in 2007, ten years before Emmanuel won the French presidency.",
    "imageUrl": "./images/icons/pop_macrons.jpg",
    "imageCredit": "",
    "category": "royals_history",
    "difficulty": "easy",
    "level": 1
  },
  {
    "id": "eleanor-of-aquitaine-henry-ii",
    "badge": "🏰 Medieval Power Queen",
    "question": "In 1152, 30-year-old Duchess Eleanor of Aquitaine had her marriage to the King of France annulled and eight weeks later wed which 19-year-old future monarch, 11 years her junior?",
    "options": [
      "Richard the Lionheart",
      "Henry II of England",
      "Philip II of France",
      "Frederick Barbarossa"
    ],
    "correctIndex": 1,
    "funFact": "Together Eleanor of Aquitaine and young Henry Plantagenet ruled an empire stretching from the Scottish border to the Pyrenees.",
    "imageUrl": "./images/scenes/wine-bar-booth.jpg",
    "imageCredit": "",
    "category": "royals_history",
    "difficulty": "medium",
    "level": 2
  },
  {
    "id": "catherine-the-great-potemkin-facade",
    "badge": "💎 Imperial Court Legend",
    "question": "Russian Empress Catherine the Great ruled and romanced alongside 10-years-younger statesman Grigory Potemkin, whose Crimean river tour inspired what phrase for a showy fake facade?",
    "options": [
      "A Potemkin village",
      "A Romanov curtain",
      "A Winter Palace mirage",
      "A Cossack decoy"
    ],
    "correctIndex": 0,
    "funFact": "Catherine’s surviving love letters call younger partner Potemkin \"my golden pheasant\" and her indispensable co-architect of imperial policy.",
    "imageUrl": "./images/scenes/luxury-bedroom-sanctuary.jpg",
    "imageCredit": "",
    "category": "royals_history",
    "difficulty": "medium",
    "level": 2
  },
  {
    "id": "duchess-of-alba-seville-flamenco",
    "badge": "💃 Spanish Aristocrat Icon",
    "question": "In 2011, 85-year-old Cayetana, 18th Duchess of Alba (the world’s most titled aristocrat), married 24-years-younger Alfonso Díez and celebrated outside her Seville palace by doing what?",
    "options": [
      "Driving off on a red Vespa",
      "Dancing flamenco barefoot",
      "Releasing a hundred white doves",
      "Pouring champagne from the balcony"
    ],
    "correctIndex": 1,
    "funFact": "To quiet skeptical heirs, the Duchess distributed her palaces and Goya masterpieces ahead of time, kicked off her heels on the red carpet, and danced flamenco in the sun.",
    "imageUrl": "./images/scenes/havana-salsa-studio.jpg",
    "imageCredit": "",
    "category": "royals_history",
    "difficulty": "medium",
    "level": 2
  },
  {
    "id": "martha-george-washington-first-lady",
    "badge": "🏛️ Founding Era Couple",
    "question": "Wealthy Virginia estate widow Martha Dandridge Custis was eight months older than 26-year-old Colonel George Washington when they wed in 1759, becoming the original holder of what role?",
    "options": [
      "Governor of Mount Vernon",
      "Keeper of the Great Seal",
      "American First Lady",
      "Speaker of the Salon"
    ],
    "correctIndex": 2,
    "funFact": "At 27, self-assured widow Martha managed one of Virginia’s largest plantations and chose young Colonel Washington over far older colonial suitors.",
    "imageUrl": "./images/scenes/sunday-kitchen-sanctuary.jpg",
    "imageCredit": "",
    "category": "royals_history",
    "difficulty": "medium",
    "level": 2
  },
  {
    "id": "edith-piaf-theo-sarapo-stage-name",
    "badge": "🎶 1962 Paris Chanson",
    "question": "In 1962 Paris, 46-year-old French icon Édith Piaf married 26-year-old singer Théo Lamboukas and gave him the stage surname \"Sarapo,\" pronounced like the Greek phrase meaning what?",
    "options": [
      "My golden sun",
      "I love you",
      "Sing forever",
      "Nightingale"
    ],
    "correctIndex": 1,
    "funFact": "Piaf and 20-years-younger Théo Sarapo sang their duet \"À quoi ça sert l’amour?\" from the Olympia stage in Paris to unforgettable ovations.",
    "imageUrl": "./images/scenes/candlelit-cocktails.jpg",
    "imageCredit": "",
    "category": "royals_history",
    "difficulty": "hard",
    "level": 3
  },
  {
    "id": "queen-elizabeth-i-earl-of-essex",
    "badge": "👑 Tudor Court Sparks",
    "question": "At age 53, Queen Elizabeth I electrified Tudor court gossip through her tempestuous favoritism toward which dashing 21-year-old courtier, 32 years her junior?",
    "options": [
      "Sir Walter Raleigh of Devon",
      "Sir Francis Drake of Plymouth",
      "Robert Devereux, Earl of Essex",
      "Thomas Howard, Duke of Norfolk"
    ],
    "correctIndex": 2,
    "funFact": "Young Essex and Elizabeth famously stayed up until dawn playing cards, trading wit, and sparring at Whitehall Palace.",
    "imageUrl": "./images/icons/pop_cher_icons.jpg",
    "imageCredit": "",
    "category": "royals_history",
    "difficulty": "hard",
    "level": 3
  },
  {
    "id": "george-eliot-john-cross-honeymoon",
    "badge": "📚 Victorian Literary Scandal",
    "question": "At age 60 in 1880, acclaimed \"Middlemarch\" novelist George Eliot (Mary Ann Evans) stunned Victorian London by marrying 40-year-old banker John Walter Cross and honeymooning where?",
    "options": [
      "Lake Como",
      "Venice",
      "Monte Carlo",
      "Vienna"
    ],
    "correctIndex": 1,
    "funFact": "Cross had admired Eliot’s intellect for years before they wed at St George’s Hanover Square and set off for the Grand Canal in Venice.",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": "",
    "category": "royals_history",
    "difficulty": "hard",
    "level": 3
  },
  {
    "id": "georgia-okeeffe-juan-hamilton-gap",
    "badge": "🎨 Ghost Ranch Muse",
    "question": "Modernist painter Georgia O’Keeffe spent her vibrant 80s and 90s in Abiquiu, New Mexico working and traveling closely with potter and sculptor Juan Hamilton, how many years her junior?",
    "options": [
      "28 years younger",
      "39 years younger",
      "46 years younger",
      "58 years younger"
    ],
    "correctIndex": 3,
    "funFact": "Hamilton arrived at Ghost Ranch at age 27 looking for ranch work and became O’Keeffe’s closest creative confidant for the final 13 years of her life.",
    "imageUrl": "./images/scenes/canyon-sunrise-trail.jpg",
    "imageCredit": "",
    "category": "royals_history",
    "difficulty": "hard",
    "level": 3
  },
  // === CATEGORY 7: 90s/00s NOSTALGIA VS. GEN-Z DECODER (Lv.1, Lv.2, Lv.3) ===
  {
    "id": "genx-texting-period-tone",
    "badge": "📱 Texting Translation Gap",
    "question": "In cross-generational texting linguistics, what routine punctuation mark at the end of a one-word reply like \"Sure.\" or \"Okay.\" makes Gen-Z daters assume an older partner is furious?",
    "options": [
      "An exclamation point",
      "A standard period",
      "A semicolon",
      "Three ellipsis dots"
    ],
    "correctIndex": 1,
    "funFact": "Linguists like Gretchen McCulloch documented that while Gen-X treats a period as polite grammar, younger texters read a trailing period on a short text as icy anger.",
    "imageUrl": "./images/scenes/wine-bar-booth.jpg",
    "imageCredit": "",
    "category": "era_culture",
    "difficulty": "easy",
    "level": 1
  },
  {
    "id": "blockbuster-vhs-rewind-rule",
    "badge": "📼 Friday Video Night",
    "question": "Before streaming queues existed, what four-word golden rule was stamped onto VHS rental cases at Blockbuster Video so customers wouldn’t get dinged with an extra fee?",
    "options": [
      "Play Twice, Return Nice",
      "Be Kind, Please Rewind",
      "Drop Before Midnight Sharp",
      "Keep Tape Inside Sleeve"
    ],
    "correctIndex": 1,
    "funFact": "Explaining dedicated car-shaped VHS rewinders to a 24-year-old date remains a rite of passage on cozy movie nights.",
    "imageUrl": "./images/scenes/cozy-rain-suite.jpg",
    "imageCredit": "",
    "category": "era_culture",
    "difficulty": "easy",
    "level": 1
  },
  {
    "id": "feline-chart-puma-cougar-jaguar",
    "badge": "🐆 Club Feline Scale",
    "question": "On the classic tongue-in-cheek feline age scale, a woman in her 30s dating younger is a \"Puma\" and her 40s is a \"Cougar\"; which sleek apex cat crowns her 50s?",
    "options": [
      "Snow Leopard",
      "Cheetah",
      "Jaguar",
      "Ocelot"
    ],
    "correctIndex": 2,
    "funFact": "In club slang the ladder runs 30s Puma, 40s Cougar, 50s Jaguar, and 60s+ Silver Panther.",
    "imageUrl": "./images/icons/pop_cougar_town.jpg",
    "imageCredit": "",
    "category": "era_culture",
    "difficulty": "easy",
    "level": 1
  },
  {
    "id": "motorola-razr-t9-keypad",
    "badge": "📟 2005 Flip-Phone Skill",
    "question": "Before touchscreen smartphones arrived in 2007, 2000s daters typed fast no-look texts under the dinner table on Motorola RAZR flip phones using what predictive number-pad tech?",
    "options": [
      "T9 predictive keypad",
      "Palm Graffiti script",
      "Morse key shortcuts",
      "BlackBerry trackball"
    ],
    "correctIndex": 0,
    "funFact": "Peak 2005 romance meant snapping shut a hot-pink Motorola RAZR V3 with one hand after firing off a flawless T9 reply.",
    "imageUrl": "./images/scenes/neon-bowling-lounge.jpg",
    "imageCredit": "",
    "category": "era_culture",
    "difficulty": "easy",
    "level": 1
  },
  {
    "id": "fleetwood-mac-dreams-cranberry-2020",
    "badge": "🛹 Generational Song Bridge",
    "question": "Millions of Gen-Z listeners discovered Fleetwood Mac’s 1977 classic \"Dreams\" in 2020 when TikToker Nathan Apodaca filmed himself skateboarding to work drinking straight from a bottle of what?",
    "options": [
      "Martinelli's Sparkling Cider",
      "Ocean Spray Cran-Raspberry",
      "Arizona Iced Green Tea",
      "Snapple Peach Iced Tea"
    ],
    "correctIndex": 1,
    "funFact": "The viral clip propelled \"Dreams\" back into the Billboard Top 10 after 43 years, with Mick Fleetwood recreating the skateboard toast himself.",
    "imageUrl": "./images/scenes/coastal-convertible.jpg",
    "imageCredit": "",
    "category": "era_culture",
    "difficulty": "medium",
    "level": 2
  },
  {
    "id": "mapquest-printed-roadtrip-sheets",
    "badge": "🗺️ Pre-GPS Road Trips",
    "question": "Before turn-by-turn phone GPS existed, how did late-1990s and early-2000s couples navigate highway exits on a weekend getaway?",
    "options": [
      "Calling AAA from highway payphones",
      "Printing step-by-step MapQuest pages",
      "Tuning into AM traffic beacons",
      "Renting dashboard CD-ROM atlases"
    ],
    "correctIndex": 1,
    "funFact": "True relationship compatibility in 2002 was surviving a missed exit when the passenger only printed the outbound MapQuest directions and forgot the return trip.",
    "imageUrl": "./images/scenes/terminal-b-arrivals.jpg",
    "imageCredit": "",
    "category": "era_culture",
    "difficulty": "medium",
    "level": 2
  },
  {
    "id": "half-your-age-plus-seven-1901",
    "badge": "📖 Dating Rule Mythbuster",
    "question": "Where did the oft-quoted \"half-your-age-plus-seven\" dating formula actually originate in Max O’Rell’s 1901 book \"Her Royal Highness Woman\"?",
    "options": [
      "As a minimum bride age for older grooms",
      "As a Parisian salon rule for older widows",
      "As a Viennese waltz partner pairing code",
      "As a British royal marriage statute"
    ],
    "correctIndex": 0,
    "funFact": "In 1901 it was prescribed strictly for Victorian men choosing younger brides, never intended to police grown women dating consenting younger men.",
    "imageUrl": "./images/scenes/cougarmarket-wine.jpg",
    "imageCredit": "",
    "category": "era_culture",
    "difficulty": "medium",
    "level": 2
  },
  {
    "id": "limewire-mix-cd-roulette",
    "badge": "💿 2004 Mix-CD Romance",
    "question": "Millennials burning a romantic 2004 mix CD on a blank CD-R routinely risked giving the family desktop twenty pop-up viruses by downloading MP3s on which lime-logo app?",
    "options": [
      "Winamp Pro",
      "SoundCloud",
      "LimeWire",
      "RealPlayer"
    ],
    "correctIndex": 2,
    "funFact": "Hand-lettering a Sharpie tracklist onto a Verbatim CD-R survived through pure LimeWire bravery was the 2004 equivalent of a custom Spotify playlist.",
    "imageUrl": "./images/scenes/campus-autumn-sushi.jpg",
    "imageCredit": "",
    "category": "era_culture",
    "difficulty": "medium",
    "level": 2
  },
  {
    "id": "nirvana-in-utero-tour-shirt",
    "badge": "🎸 Vintage Tour-Tee Test",
    "question": "When a 23-year-old shows up to brunch in a thrifted winged-anatomy tour shirt thinking it’s a skate brand, which band’s 1993 final studio album \"In Utero\" is actually on his chest?",
    "options": [
      "Soundgarden",
      "Alice in Chains",
      "Pearl Jam",
      "Nirvana"
    ],
    "correctIndex": 3,
    "funFact": "Nothing sparks faster brunch banter than a woman who saw the 90s live quizzing her date to name three songs on his vintage tour tee.",
    "imageUrl": "./images/icons/pop_cub_grooming_joke.jpg",
    "imageCredit": "",
    "category": "era_culture",
    "difficulty": "hard",
    "level": 3
  },
  {
    "id": "aim-away-message-lyrics",
    "badge": "💬 2003 Subtweet Art",
    "question": "Years before Instagram Close Friends stories existed, early-2000s crushes broadcast cryptic song lyrics whenever they stepped away from the desktop using what status feature?",
    "options": [
      "A MySpace Top-8 Bulletin",
      "An AIM Away Message",
      "A LiveJournal Mood Pin",
      "A Yahoo Pager Beep"
    ],
    "correctIndex": 1,
    "funFact": "Crafting a poetic yellow-on-black AOL Instant Messenger Away Message just so one specific crush would notice the creaking-door sign-on sound was high art.",
    "imageUrl": "./images/scenes/velvet-room-bar.jpg",
    "imageCredit": "",
    "category": "era_culture",
    "difficulty": "hard",
    "level": 3
  },
  {
    "id": "nhl-hockey-2001-cougar-slang",
    "badge": "🏒 Origin of the Word",
    "question": "Pop-culture lexicographers trace the modern dating term \"cougar\" to a 2001 Toronto Sun column and Canadian book about confident older women socializing with young rookies in which pro sport?",
    "options": [
      "ATP pro tennis",
      "NHL ice hockey",
      "Formula One racing",
      "PGA championship golf"
    ],
    "correctIndex": 1,
    "funFact": "Coined in Western Canadian hockey lounges before Valerie Gibson’s 2001 book popularized it, the word flipped overnight from locker-room slang into a badge of confidence.",
    "imageUrl": "./images/icons/pop_cougar_town.jpg",
    "imageCredit": "",
    "category": "era_culture",
    "difficulty": "hard",
    "level": 3
  },
  {
    "id": "dial-up-56k-landline-cutoff",
    "badge": "☎️ 56k Modem Era",
    "question": "In a late-1990s home before broadband Wi-Fi, what everyday household event instantly knocked you offline right in the middle of a late-night 56k dial-up chat?",
    "options": [
      "Turning on the kitchen microwave",
      "Someone picking up the landline phone",
      "Switching the TV to channel 3",
      "Unplugging the VCR clock"
    ],
    "correctIndex": 1,
    "funFact": "Every Gen-X and elder Millennial still remembers the screeching dial-up handshake tone and yelling \"Hang up the phone, I’m online!\" down the hallway.",
    "imageUrl": "./images/scenes/sunday-kitchen-sanctuary.jpg",
    "imageCredit": "",
    "category": "era_culture",
    "difficulty": "hard",
    "level": 3
  },
  {
    "id": "jessica-alba-danny-ramirez-cabo",
    "badge": "🌴 11-Year Gap • Post-Divorce Glow-Up",
    "question": "Following her 2025 chapter-two reset, actress and Honest Company founder Jessica Alba sparked viral Cabo and LA date-night headlines alongside which 11-years-younger \"Top Gun: Maverick\" and Marvel star?",
    "options": [
      "Danny Ramirez",
      "Glen Powell",
      "Manny Jacinto",
      "Lewis Pullman"
    ],
    "correctIndex": 0,
    "funFact": "Jessica Alba (44) and \"Top Gun: Maverick\" / \"Captain America\" actor Danny Ramirez (33) became one of 2025’s most cheered chapter-two romances.",
    "imageUrl": "./images/scenes/palm-springs-resort.jpg",
    "imageCredit": "",
    "category": "music_celebs",
    "difficulty": "easy",
    "level": 1
  },
  {
    "id": "sam-aaron-taylor-johnson-nowhere-boy",
    "badge": "🎬 23-Year Gap • British Cinema Pair",
    "question": "Filmmaker Sam Taylor-Johnson and actor Aaron Taylor-Johnson (married since 2012 with a 23-year age gap) first met on the 2009 set of \"Nowhere Boy,\" a biopic about the teenage years of which music icon?",
    "options": [
      "David Bowie",
      "Mick Jagger",
      "John Lennon",
      "Freddie Mercury"
    ],
    "correctIndex": 2,
    "funFact": "Sam directed Aaron as young John Lennon in \"Nowhere Boy\" (2009), and over a decade of marriage later they remain Hollywood’s most debated 23-year gap.",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": "",
    "category": "movies",
    "difficulty": "medium",
    "level": 2
  },
  {
    "id": "kris-jenner-corey-gamble-decade",
    "badge": "🥂 25-Year Gap • 10+ Years Unbothered",
    "question": "Momager powerhouse Kris Jenner and talent executive Corey Gamble (25 years her junior) first met in August 2014 at fashion designer Riccardo Tisci’s 40th birthday party on which Mediterranean island?",
    "options": [
      "Capri",
      "Mykonos",
      "Ibiza",
      "Mallorca"
    ],
    "correctIndex": 2,
    "funFact": "Over a decade after meeting in Ibiza, Kris Jenner and Corey Gamble have outlasted almost every tabloid skeptic with silk pajamas and front-row Paris poise.",
    "imageUrl": "./images/icons/pop_kris_corey.jpg",
    "imageCredit": "",
    "category": "music_celebs",
    "difficulty": "medium",
    "level": 2
  },
  {
    "id": "natalie-portman-good-sex-romcom",
    "badge": "🗽 Lena Dunham NYC Rom-Com",
    "question": "In Lena Dunham’s Manhattan romantic comedy \"Good Sex,\" which Oscar-winning actress stars as 40-year-old couples therapist Ally caught between a magnetic 20-something Brooklyn hipster and a 50-something tech mogul?",
    "options": [
      "Natalie Portman",
      "Anne Hathaway",
      "Rachel Weisz",
      "Emma Stone"
    ],
    "correctIndex": 0,
    "funFact": "Starring Natalie Portman alongside Tucker Pillsbury (Role Model) and Mark Ruffalo, \"Good Sex\" puts the 20s-excitement vs. 50s-comfort dilemma front and center.",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": "",
    "category": "movies",
    "difficulty": "medium",
    "level": 2
  },
  {
    "id": "miley-cyrus-maxx-morando-grammy",
    "badge": "🎸 6-Year Junior Cougar Spark",
    "question": "Winning Record of the Year for \"Flowers,\" Miley Cyrus thanked her 6-years-younger boyfriend Maxx Morando (\"my love\"), who plays drums for the rock band Liily after starting out with which LA punk band?",
    "options": [
      "The Regrettes",
      "Wallows",
      "Turnstile",
      "Bleachers"
    ],
    "correctIndex": 0,
    "funFact": "Set up on a blind date in 2021, Miley Cyrus and producer-drummer Maxx Morando even collaborated on tracks for \"Endless Summer Vacation\" and \"Something Beautiful.\"",
    "imageUrl": "./images/icons/pop_olivia_harry.jpg",
    "imageCredit": "",
    "category": "music_celebs",
    "difficulty": "hard",
    "level": 3
  },
  {
    "id": "boomer-vinyl-rotary-phone-patience",
    "badge": "☎️ Silver Panther Era • Pre-Caller-ID Courage",
    "question": "Before Caller ID or smartphones existed, how did Boomer & Silver Panther daters know who was on the line when the kitchen wall phone rang on Friday afternoon?",
    "options": [
      "You answered blind with a warm hello and zero screen preview",
      "You dialed star-sixty-nine first to print a paper caller slip",
      "You checked the scrolling amber LED strip on the receiver",
      "You waited for the local operator to announce their full name"
    ],
    "correctIndex": 0,
    "funFact": "Calling someone’s landline took real nerve, especially when a parent, roommate, or grown kid could pick up on the second ring!",
    "imageUrl": "./images/scenes/velvet-room-bar.jpg",
    "imageCredit": "",
    "category": "era_culture",
    "difficulty": "easy",
    "level": 1
  },
  {
    "id": "genx-cassette-pencil-rewind-ritual",
    "badge": "📼 Gen-X Mixtape Engineering (1965–1980)",
    "question": "Every Gen-X Jaguar immediately recognizes the sacred bond between a handmade 90-minute cassette mixtape and a wooden No. 2 pencil. What was the pencil used for?",
    "options": [
      "Cleaning static dust off the stereo volume dial",
      "Winding loose magnetic ribbon neatly back onto the spool",
      "Etching track names onto the clear plastic spine",
      "Popping a jammed tape out of a dashboard deck"
    ],
    "correctIndex": 1,
    "funFact": "Recording songs off the radio without catching the DJ’s voice and rescuing eaten tape with a No. 2 pencil was peak Gen-X courtship.",
    "imageUrl": "./images/scenes/neon-bowling-lounge.jpg",
    "imageCredit": "",
    "category": "era_culture",
    "difficulty": "easy",
    "level": 1
  },
  {
    "id": "boomer-cher-battleship-turn-back-time",
    "badge": "⚓ 1989 Boomer Rock-Goddess Anthem",
    "question": "In 1989, 43-year-old icon Cher filmed her unforgettable \"If I Could Turn Back Time\" video surrounded by hundreds of cheering Navy sailors aboard which real battleship?",
    "options": [
      "USS Missouri",
      "USS Enterprise",
      "USS Constitution",
      "USS Lexington"
    ],
    "correctIndex": 0,
    "funFact": "Filmed overnight in Long Beach with her 12-year-old son Elijah Blue Allman playing guitar in the band, Cher’s USS Missouri video remains untouchable.",
    "imageUrl": "./images/icons/pop_cher_icons.jpg",
    "imageCredit": "",
    "category": "era_culture",
    "difficulty": "easy",
    "level": 1
  },
  {
    "id": "genx-mtv-unplugged-1990s-date-night",
    "badge": "🕯️ 1990s Gen-X Apartment Soundtrack",
    "question": "Ask a Gen-X woman about peak 1990s candlelit date-night music (from Nirvana and Eric Clapton to Mariah Carey and Lauryn Hill) and she will name which iconic acoustic TV series?",
    "options": [
      "MTV Unplugged",
      "VH1 Pop-Up Video",
      "Total Request Live",
      "Midnight Special"
    ],
    "correctIndex": 0,
    "funFact": "MTV Unplugged albums owned 1990s vinyl and CD shelves, setting the mood long before algorithmic streaming playlists existed.",
    "imageUrl": "./images/scenes/wine-bar-booth.jpg",
    "imageCredit": "",
    "category": "era_culture",
    "difficulty": "medium",
    "level": 2
  },
  {
    "id": "boomer-book-club-diane-keaton-fonda",
    "badge": "🍷 Silver Panther Cinema Hit",
    "question": "Celebrating vibrant 60s and 70s romance over generous pours of Pinot Noir, 2018’s box-office smash \"Book Club\" starred Diane Keaton, Jane Fonda, Candice Bergen, and which fourth Oscar winner?",
    "options": [
      "Sally Field",
      "Sigourney Weaver",
      "Mary Steenburgen",
      "Jessica Lange"
    ],
    "correctIndex": 2,
    "funFact": "\"Book Club\" grossed over $104 million worldwide, proving audiences love witty, glamorous Silver Panther leads owning their love lives.",
    "imageUrl": "./images/icons/pop_goldie_kurt.jpg",
    "imageCredit": "",
    "category": "era_culture",
    "difficulty": "medium",
    "level": 2
  },
  {
    "id": "genx-before-sunrise-vienna-benchmark",
    "badge": "🚆 1995 Gen-X Romance Gold Standard",
    "question": "Which 1995 Richard Linklater film starring Ethan Hawke and Julie Delpy walking through Vienna until dawn became Gen-X’s ultimate benchmark for phone-free conversation chemistry?",
    "options": [
      "Singles",
      "Before Sunrise",
      "Reality Bites",
      "Say Anything"
    ],
    "correctIndex": 1,
    "funFact": "Meeting on a European train with zero smartphones and talking for fourteen straight hours remains every Gen-X romantic’s north star.",
    "imageUrl": "./images/scenes/coastal-convertible.jpg",
    "imageCredit": "",
    "category": "era_culture",
    "difficulty": "medium",
    "level": 2
  },
  {
    "id": "boomer-studio-54-halston-glamour",
    "badge": "🪩 Late-1970s Silver Panther Lore",
    "question": "When a stylish Silver Panther references late-1970s Manhattan disco glamour, Halston silk halters, and Bianca Jagger’s birthday entrance, which legendary West 54th Street club is she invoking?",
    "options": [
      "Paradise Garage",
      "The Limelight",
      "Studio 54",
      "Max’s Kansas City"
    ],
    "correctIndex": 2,
    "funFact": "Opened in 1977 in a former Broadway theater, Studio 54 defined an unforgettable era of fearless Boomer nightlife and fashion.",
    "imageUrl": "./images/icons/pop_tina_erwin.jpg",
    "imageCredit": "",
    "category": "era_culture",
    "difficulty": "hard",
    "level": 3
  },
  {
    "id": "boomer-helen-mirren-taylor-hackford",
    "badge": "👑 70+ Silver Panther Royalty",
    "question": "Dame Helen Mirren, the undisputed icon of unapologetic Silver Panther confidence, has been happily married since New Year’s Eve 1997 to which \"An Officer and a Gentleman\" and \"Ray\" director?",
    "options": [
      "Lawrence Kasdan",
      "Adrian Lyne",
      "Sydney Pollack",
      "Taylor Hackford"
    ],
    "correctIndex": 3,
    "funFact": "Helen Mirren and Taylor Hackford waited eleven years together before marrying on December 31, 1997, proving grown-up romance runs on its own clock.",
    "imageUrl": "./images/icons/pop_madonna_mariahc_sarandon.jpg",
    "imageCredit": "",
    "category": "era_culture",
    "difficulty": "hard",
    "level": 3
  },
  {
    "id": "madonna-1984-boy-toy-belt-buckle",
    "badge": "🎤 1984 VMAs Pop History",
    "question": "At the inaugural 1984 MTV Video Music Awards, Madonna performed \"Like a Virgin\" atop a giant wedding cake wearing a belt buckle stamped with which iconic two-word phrase, later flipped affectionately onto younger male partners?",
    "options": [
      "BOY TOY",
      "MATERIAL GIRL",
      "WILD HEART",
      "LUCKY STAR"
    ],
    "correctIndex": 0,
    "funFact": "Madonna’s 1984 \"BOY TOY\" belt buckle entered the Rock & Roll Hall of Fame lexicon before tabloids spent decades flipping the exact phrase onto her own twenty-something partners.",
    "imageUrl": "./images/icons/pop_madonna_mariahc_sarandon.jpg",
    "imageCredit": "",
    "category": "music_celebs",
    "difficulty": "easy",
    "level": 1
  },
  {
    "id": "katie-holmes-bobby-wooten-emilio-vitolo",
    "badge": "🗽 Manhattan Toyboy Renaissance",
    "question": "After high-profile marriages and romances with older A-listers (Tom Cruise and Jamie Foxx), Katie Holmes pivoted to creative younger men in NYC, dating SoHo pasta chef Emilio Vitolo Jr. (8 years younger) and making a 2022 red-carpet debut with which Grammy-nominated Broadway bassist (10 years younger)?",
    "options": [
      "Jon Batiste",
      "Bobby Wooten III",
      "Jack Antonoff",
      "Leon Bridges"
    ],
    "correctIndex": 1,
    "funFact": "Katie Holmes (43 at the time) and David Byrne’s \"American Utopia\" bassist Bobby Wooten III (33) beamed across The Moth Ball red carpet in Manhattan, cementing her post-divorce creative younger-man era.",
    "imageUrl": "./images/icons/pop_sienna_oli.jpg",
    "imageCredit": "",
    "category": "music_celebs",
    "difficulty": "easy",
    "level": 1
  },
  {
    "id": "elizabeth-holmes-billy-evans-mit-ring",
    "badge": "🕵️ Silicon Valley Cougar Plot Twist",
    "question": "Theranos founder Elizabeth Holmes (born 1984) pivoted from 19-years-older Sunny Balwani to marrying San Diego Evans Hotels heir Billy Evans (8 years younger). Why did Billy famously propose with his MIT class signet ring instead of a diamond?",
    "options": [
      "They got engaged impulsively on the playa at Burning Man",
      "A luxury diamond risked federal asset forfeiture amid civil fraud lawsuits",
      "Holmes was allergic to platinum and white gold",
      "It held a hidden micro-engraving of Palo Alto coordinates"
    ],
    "correctIndex": 1,
    "funFact": "Billy Evans (an MIT economics grad and heir to San Diego’s Lodge at Torrey Pines & Bahia Resort) met Holmes in 2017 as Theranos collapsed, gave her his asset-forfeiture-proof MIT ring, and stood by her through two kids and federal prison in Texas.",
    "imageUrl": "./images/products/mocktail-card-deck.jpg",
    "imageCredit": "",
    "category": "era_culture",
    "difficulty": "easy",
    "level": 1
  },
  {
    "id": "the-dropout-hulu-sunny-to-billy-pivot",
    "badge": "📺 True-Crime Age-Gap Whiplash",
    "question": "After Hulu’s Emmy-winning series \"The Dropout\" dramatized Elizabeth Holmes’s secret relationship with much-older COO Sunny Balwani, where did real-life Holmes and 8-years-younger fiancé Billy Evans make their eyebrow-raising 2018 public debut while awaiting federal indictment?",
    "options": [
      "The Met Gala steps",
      "Sun Valley Billionaires Camp",
      "Burning Man in Nevada",
      "Monaco Grand Prix Yacht Club"
    ],
    "correctIndex": 2,
    "funFact": "Spotted in dusty futuristic goggles at Burning Man 2018 just weeks after her federal indictment, Elizabeth Holmes and Billy Evans delivered Silicon Valley’s wildest Cougar-and-Cub plot twist.",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": "",
    "category": "tv",
    "difficulty": "medium",
    "level": 2
  },
  {
    "id": "joan-collins-percy-gibson-quote",
    "badge": "👑 32-Year Gap • Married Since 2002",
    "question": "When interviewers pressed \"Dynasty\" legend Dame Joan Collins about the 32-year age difference with her fifth husband, theatrical producer Percy Gibson (married happily since 2002), what iconic deadpan reply did she give?",
    "options": [
      "\"Darling, math is for accountants.\"",
      "\"If he dies, he dies!\"",
      "\"I only check passports, never birth certificates.\"",
      "\"Husbands age faster than diamonds anyway.\""
    ],
    "correctIndex": 1,
    "funFact": "More than two decades into her fifth and happiest marriage, Dame Joan Collins’s razor-sharp \"If he dies, he dies!\" remains the undisputed mic-drop of age-gap interviews.",
    "imageUrl": "./images/icons/pop_cher_icons.jpg",
    "imageCredit": "",
    "category": "music_celebs",
    "difficulty": "easy",
    "level": 1
  },
  {
    "id": "sandra-bullock-ryan-gosling-murder-by-numbers",
    "badge": "🎬 Secret 16-Year Hollywood Romance",
    "question": "Sandra Bullock (37) and a 21-year-old Ryan Gosling quietly dated for nearly two years after meeting on the set of which 2002 thriller, leading Gosling years later to call her one of the \"greatest girlfriends of all time\"?",
    "options": [
      "Murder by Numbers",
      "Practical Magic",
      "The Net",
      "Miss Congeniality"
    ],
    "correctIndex": 0,
    "funFact": "Bullock affectionately nicknamed young Gosling her \"little Buddha\" for reminding her to slow down outside Hollywood chaos, and Gosling still praises her decades later.",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": "",
    "category": "movies",
    "difficulty": "easy",
    "level": 1
  },
  {
    "id": "jennifer-lopez-casper-smart-dance",
    "badge": "💃 18-Year World-Tour Spark",
    "question": "At 42, Jennifer Lopez began a high-profile five-year relationship with which 24-year-old backup dancer (18 years her junior), eventually naming him creative choreographer for her Las Vegas residency?",
    "options": [
      "Derek Hough",
      "Val Chmerkovskiy",
      "Beau \"Casper\" Smart",
      "Kevin Federline"
    ],
    "correctIndex": 2,
    "funFact": "J.Lo and Casper Smart turned backup-dancer romance into five years of red carpets before remaining friendly collaborators.",
    "imageUrl": "./images/icons/pop_madonna_mariahc_sarandon.jpg",
    "imageCredit": "",
    "category": "music_celebs",
    "difficulty": "easy",
    "level": 1
  },
  {
    "id": "britney-spears-sam-asghari-slumber-party",
    "badge": "🎵 Music-Video Casting Spark",
    "question": "Pop icon Britney Spears hand-picked 22-year-old Sam Asghari (12 years her junior) from casting headshots on the set of which 2016 music video, kicking off a six-year romance and 2022 wedding?",
    "options": [
      "\"Toxic\"",
      "\"Womanizer\"",
      "\"Work B**ch\"",
      "\"Slumber Party\""
    ],
    "correctIndex": 3,
    "funFact": "Britney found Sam’s phone number tucked inside her bag months after wrapping the \"Slumber Party\" shoot and called him out for sushi.",
    "imageUrl": "./images/icons/pop_miley_maxx.jpg",
    "imageCredit": "",
    "category": "music_celebs",
    "difficulty": "easy",
    "level": 1
  },
  {
    "id": "kim-kardashian-pete-davidson-aladdin-snl",
    "badge": "🧞 SNL Magic-Carpet Spark",
    "question": "Before Pete Davidson’s 20-year gap with Kate Beckinsale became a hockey-arena meme, he sparked a viral 13-year-gap romance with 41-year-old Kim Kardashian during which October 2021 \"Saturday Night Live\" sketch?",
    "options": [
      "Princess Jasmine & Aladdin on a magic carpet",
      "Romeo & Juliet on a Staten Island ferry",
      "Barbie & Ken in Malibu traffic court",
      "Cleopatra & Marc Antony at Caesar’s Palace"
    ],
    "correctIndex": 0,
    "funFact": "Kim admitted on \"The Kardashians\" that feeling a real spark during their Aladdin carpet kiss made her ask SNL producers for Pete’s number.",
    "imageUrl": "./images/icons/pop_olivia_harry.jpg",
    "imageCredit": "",
    "category": "tv",
    "difficulty": "easy",
    "level": 1
  },
  {
    "id": "courteney-cox-johnny-mcdaid-ed-sheeran",
    "badge": "🎸 Life Imitating Cougar Town",
    "question": "Right as \"Cougar Town\" wrapped its run, Courteney Cox fell in love in real life with Snow Patrol musician Johnny McDaid (12 years younger) after being set up at a house party by which mutual singer-songwriter friend?",
    "options": [
      "Chris Martin",
      "Ed Sheeran",
      "Harry Styles",
      "Niall Horan"
    ],
    "correctIndex": 1,
    "funFact": "Ed Sheeran was living as Courteney’s Malibu houseguest while recording with McDaid and played matchmaker, sparking a 10+ year relationship.",
    "imageUrl": "./images/icons/pop_cougar_town.jpg",
    "imageCredit": "",
    "category": "music_celebs",
    "difficulty": "medium",
    "level": 2
  },
  {
    "id": "deborra-lee-furness-hugh-jackman-correlli",
    "badge": "🇦🇺 13-Year Gap Before Wolverine",
    "question": "When established Australian star Deborra-Lee Furness met unknown 26-year-old drama-school graduate Hugh Jackman (13 years younger), she was the headliner on which 1995 Australian prison drama series?",
    "options": [
      "Wentworth",
      "Neighbours",
      "Correlli",
      "Blue Heelers"
    ],
    "correctIndex": 2,
    "funFact": "Jackman confessed to having a massive crush on his famous leading lady during hair-and-makeup on \"Correlli,\" leading to a 27-year marriage that guided his entire rise to global stardom.",
    "imageUrl": "./images/icons/pop_julianne_bart.jpg",
    "imageCredit": "",
    "category": "tv",
    "difficulty": "medium",
    "level": 2
  },
  {
    "id": "lisa-bonet-jason-momoa-jazz-club-guinness",
    "badge": "🍺 12-Year Gap • Sunrise Diner Lore",
    "question": "Jason Momoa had a childhood TV crush on Lisa Bonet (12 years his senior) long before meeting her at a 2005 Los Angeles jazz club, where she won him over instantly by ordering what drink before sunrise grits?",
    "options": [
      "A neat smoky mezcal",
      "A pint of Guinness",
      "An ice-cold dirty martini",
      "A double espresso tonic"
    ],
    "correctIndex": 1,
    "funFact": "Momoa recalled fireworks going off in his head when Lisa turned around at the bar and ordered his exact favorite stout, followed by cornmeal grits at Café 101.",
    "imageUrl": "./images/icons/pop_gabrielle_dwyane.jpg",
    "imageCredit": "",
    "category": "music_celebs",
    "difficulty": "medium",
    "level": 2
  },
  {
    "id": "cher-tom-cruise-top-5-lovers",
    "badge": "🕶️ 1985 Pre-Top-Gun Secret Romance",
    "question": "Long before AE Edwards, a 39-year-old Cher quietly dated a 23-year-old pre-\"Top Gun\" Tom Cruise in 1985 after bonding at a White House dyslexia event. Where did Cher later tell Andy Cohen that young Cruise ranked?",
    "options": [
      "\"Sweetest gentleman in Malibu\"",
      "\"Best dancer in Hollywood\"",
      "\"In my Top 5 Lovers of All Time\"",
      "\"Only actor who cooked me breakfast\""
    ],
    "correctIndex": 2,
    "funFact": "Cher dated both 23-year-old Tom Cruise (16-year gap) and 20s Val Kilmer (13-year gap) in the 1980s, openly praising younger men for never acting intimidated by her icon status.",
    "imageUrl": "./images/icons/pop_cher_icons.jpg",
    "imageCredit": "",
    "category": "music_celebs",
    "difficulty": "medium",
    "level": 2
  },
  {
    "id": "robin-wright-clement-giraudet-cannes",
    "badge": "🇫🇷 18-Year Cannes Fashion Spark",
    "question": "\"House of Cards\" powerhouse Robin Wright wed French fashion executive Clément Giraudet (roughly 18 years her junior) in bohemian Provence after meeting at the Cannes Film Festival while he ran VIP relations for which luxury house?",
    "options": [
      "Saint Laurent",
      "Louis Vuitton",
      "Bottega Veneta",
      "Maison Margiela"
    ],
    "correctIndex": 0,
    "funFact": "Before meeting Saint Laurent’s Clément Giraudet at Cannes, Robin Wright was also engaged to actor Ben Foster (14 years younger).",
    "imageUrl": "./images/icons/pop_macrons.jpg",
    "imageCredit": "",
    "category": "movies",
    "difficulty": "hard",
    "level": 3
  },
  {
    "id": "vivienne-westwood-andreas-kronthaler-vienna",
    "badge": "🧷 25-Year Gap • 30-Year Creative Reign",
    "question": "British punk-fashion empress Dame Vivienne Westwood met 22-year-old Austrian designer Andreas Kronthaler (25 years younger) while teaching fashion in which city in 1988, remaining married creative partners for 30 years?",
    "options": [
      "Antwerp",
      "Milan",
      "Berlin",
      "Vienna"
    ],
    "correctIndex": 3,
    "funFact": "Westwood and Kronthaler shared a tiny London flat before building a global couture empire together for three decades until her passing in 2022.",
    "imageUrl": "./images/icons/pop_heidi_tom.jpg",
    "imageCredit": "",
    "category": "royals_history",
    "difficulty": "hard",
    "level": 3
  }
];

const TV_QUESTION_IDS = new Set([
  'satc-samantha-smith-jerrod',
  'cougar-town-big-carl',
  'ted-lasso-rebecca-sam-bantr',
  'succession-gerri-roman',
  'emily-in-paris-sylvie-erik',
  'younger-liza-josh-tattoo',
  'hacks-deborah-vance',
  '30-rock-liz-lemon-criss',
  'mrs-fletcher-kathryn-hahn',
  'white-lotus-resort-canon',
  'desperate-housewives-gaby-gardener',
  'fleabag-belinda-hotel-bar-speech',
  'the-office-jan-hunter-cd',
  'tlc-milf-manor-plot-twist',
  'friends-monica-young-ethan',
  'love-is-blind-jessica-age-math',
  'satc-carrie-twentysomething-sam',
  '30-rock-liz-frank-mom-coffee-guy',
]);

const BOOK_QUESTION_IDS = new Set([
  'abby-jimenez-part-of-your-world',
  'colette-cheri-1920',
  'miranda-july-all-fours',
  'on-the-island-graves',
  'julian-barnes-the-only-story',
  'robinne-lee-idea-of-you-ending',
  'vladimir-julia-may-jonas',
  'flirting-with-forty-jane-porter',
  'curtis-sittenfeld-romantic-comedy',
  'terry-mcmillan-stella-novel-1996',
  'agatha-christie-max-mallowan-memoir',
  'nora-goes-off-script-monaghan',
  'idea-of-you-august-moon-band',
  'evie-drake-starts-over-holmes',
  'tea-and-sympathy-be-kind',
  'francoise-sagan-aimez-vous-brahms',
]);

const MUSIC_CELEB_QUESTION_IDS = new Set([
  'cher-rich-man-icon',
  'stacys-mom-music-video',
  'priyanka-nick-cutoff',
  'tina-turner-erwin-bach',
  'yung-gravy-betty-vmas',
  'shakira-strawberry-jam-clue',
  'heidi-klum-tom-kaulitz',
  'rod-stewart-maggie-may',
  'sienna-miller-oli-green',
  'caroline-stanbury-sergio-carrallo',
  'gabrielle-union-julianne-moore-SweetSpot',
  'mariah-carey-touch-my-body-set',
  'goldie-kurt-halle-meghan-microgaps',
  'mrs-robinson-grammy-record',
  'hall-and-oates-maneater',
  'demi-moore-ashton-kutcher-watershed',
  'kim-kardashian-lewis-hamilton-2026',
  'nicole-scherzinger-athlete-streak',
  'nicole-scherzinger-sunset-blvd-tony',
  'madonna-akeem-morris-soccer',
  'kate-beckinsale-msg-pete-davidson',
  'kristin-cavallari-montana-boyz',
  'shakira-lucien-laviscount-punteria',
  'olivia-wilde-harry-styles-booksmart',
]);

const LEVEL_2_INSIDER_IDS = new Set([
  'yung-gravy-betty-vmas',
  'shakira-strawberry-jam-clue',
  'heidi-klum-tom-kaulitz',
  'succession-gerri-roman',
  'sienna-miller-oli-green',
  'emily-in-paris-sylvie-erik',
  'caroline-stanbury-sergio-carrallo',
  'miranda-july-all-fours',
  'younger-liza-josh-tattoo',
  'no-hard-feelings-piano-song',
  'on-the-island-graves',
  '30-rock-liz-lemon-criss',
  'a-family-affair-2024',
  'zeta-jones-the-rebound',
  'robinne-lee-idea-of-you-ending',
  'magic-mike-last-dance-london',
  'white-lotus-resort-canon',
  'lonely-planet-morocco',
  'happiness-for-beginners-trail',
  'kristin-cavallari-montana-boyz',
  'shakira-lucien-laviscount-punteria',
  'olivia-wilde-harry-styles-booksmart',
  'love-is-blind-jessica-age-math',
  'satc-carrie-twentysomething-sam',
  'unfaithful-diane-lane-soho',
  'may-december-julianne-charles',
  'evie-drake-starts-over-holmes',
]);

const LEVEL_3_DEEP_CUT_IDS = new Set([
  'the-graduate-real-age-gap',
  'colette-cheri-1920',
  'rod-stewart-maggie-may',
  'mariah-carey-touch-my-body-set',
  'demi-moore-ashton-kutcher-watershed',
  'bull-durham-sarandon-robbins',
  'hacks-deborah-vance',
  'julian-barnes-the-only-story',
  'mrs-robinson-grammy-record',
  'mrs-fletcher-kathryn-hahn',
  'leo-grande-emma-thompson',
  'prime-meryl-streep-twist',
  'vladimir-julia-may-jonas',
  'white-palace-sarandon-spader',
  'flirting-with-forty-jane-porter',
  'cha-cha-real-smooth-sundance',
  'the-good-girl-aniston-gyllenhaal',
  'harold-and-maude-cat-stevens',
  'home-again-reese-witherspoon',
  'sunset-boulevard-norma-desmond',
  'nicole-scherzinger-sunset-blvd-tony',
  'fleabag-belinda-hotel-bar-speech',
  'agatha-christie-max-mallowan-memoir',
  '30-rock-liz-frank-mom-coffee-guy',
  'y-tu-mama-tambien-cuaron',
  'tea-and-sympathy-be-kind',
  'francoise-sagan-aimez-vous-brahms',
]);

export function resolveTriviaCategory(q: PopCultureTriviaQuestion): TriviaCategory {
  if (q.category) return q.category;
  if (TV_QUESTION_IDS.has(q.id)) return 'tv';
  if (BOOK_QUESTION_IDS.has(q.id)) return 'books';
  if (MUSIC_CELEB_QUESTION_IDS.has(q.id)) return 'music_celebs';
  return 'movies';
}

export function resolveTriviaLevel(q: PopCultureTriviaQuestion): TriviaLevel {
  if (q.level) return q.level;
  if (LEVEL_3_DEEP_CUT_IDS.has(q.id)) return 3;
  if (LEVEL_2_INSIDER_IDS.has(q.id)) return 2;
  return 1;
}

export function resolveTriviaDifficulty(q: PopCultureTriviaQuestion): TriviaDifficulty {
  const lvl = resolveTriviaLevel(q);
  if (lvl === 3) return 'hard';
  if (lvl === 2) return 'medium';
  return 'easy';
}
