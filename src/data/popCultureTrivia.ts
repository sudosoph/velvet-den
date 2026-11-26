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
      "To win a surfing bet",
      "To earn a Buick Regal so she can work rideshare shifts and save her house",
      "To get back at her ex-boyfriend",
      "To research a magazine column"
    ],
    "correctIndex": 1,
    "funFact": "Jennifer Lawrence & Broadway star Andrew Barth Feldman turned \"No Hard Feelings\" into a global box-office hit—highlighted by Percy’s unexpectedly soulful piano-bar rendition of \"Maneater.\"",
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
      "\"Rich men bore me.\"",
      "\"Only if he sings.\"",
      "\"Check my Oscar shelf.\""
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
      "Flies her to Paris",
      "Buys her a loft in SoHo",
      "Quits acting forever",
      "Shaves his own golden blond hair right alongside her"
    ],
    "correctIndex": 3,
    "funFact": "Smith Jerrod shaving his trademark hair without hesitation—and flying home mid-shoot just to tell Samantha he loves her—cemented him as TV’s #1 Golden-Retriever partner.",
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
      "An Espresso Shot",
      "Champagne"
    ],
    "correctIndex": 1,
    "funFact": "Director Halina Reijn borrowed the moment from real life after a younger Belgian actor sent her a glass of milk in a bar—winning Nicole Kidman the Venice Best Actress Volpi Cup!",
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
      "Float-plane pilot",
      "Game warden",
      "Carpenter & B&B innkeeper (and secret mayor)",
      "Brewmaster"
    ],
    "correctIndex": 2,
    "funFact": "Daniel Grant cooking from scratch, fixing doors, and gently dismantling Alexis’s family snobbery made him BookTok’s gold-standard younger hero.",
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
      "Only 6 years older",
      "22 years older",
      "14 years older"
    ],
    "correctIndex": 1,
    "funFact": "Anne Bancroft was just 35 during filming while Dustin Hoffman was already 29—Hollywood makeup and framing created a 20-year illusion out of a 6-year gap!",
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
      "Built her a recording studio in Geneva",
      "Wrote her memoir",
      "Conducted her London orchestra"
    ],
    "correctIndex": 0,
    "funFact": "Tina met Erwin at 46 when he picked her up at Düsseldorf Airport—and his 2017 kidney donation remains the ultimate real-world devotion story.",
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
      "blindspot",
      "Bantr"
    ],
    "correctIndex": 3,
    "funFact": "Rebecca & Sam’s witty photo-free chemistry on Bantr inspired our own #blind-velvet-dm mystery lounge!",
    "imageUrl": "./images/products/mocktail-card-deck.jpg",
    "imageCredit": ""
  },
  {
    "id": "yung-gravy-betty-vmas",
    "badge": "🕺 Viral Red-Carpet Move",
    "question": "Rapper Yung Gravy sampled Rick Astley’s \"Never Gonna Give You Up\" for his platinum anthem \"Betty (Get Money)\"—and famously brought whose mom, Sheri Easterling, as his date to the 2022 MTV VMAs?",
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
      "Her favorite strawberry jam (which Piqué never ate)",
      "Oat milk",
      "Imported Manchego",
      "Sparkling water"
    ],
    "correctIndex": 0,
    "funFact": "Never underestimate a woman’s kitchen intuition—missing strawberry jam became pop culture’s most famous detective clue (rivaling Olivia Wilde’s salad dressing lore!).",
    "imageUrl": "./images/products/aprons-kitchen.jpg",
    "imageCredit": ""
  },
  {
    "id": "idea-of-you-coachella",
    "badge": "🎨 Prime Video Record Breaker",
    "question": "In \"The Idea of You\" (2024), where does Anne Hathaway’s 40-year-old Silver Lake gallery owner Solène accidentally step into 24-year-old Nicholas Galitzine’s VIP trailer?",
    "options": [
      "Glastonbury",
      "The Met Gala",
      "SXSW",
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
    "question": "Which trailblazing French novelist published \"Chéri\" in 1920—chronicling the unforgettable Belle Époque love affair between poised 49-year-old Léa de Lonval and 25-year-old Fred (\"Chéri\")?",
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
      "Greg Hirsch",
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
      "Roland-Garros finals",
      "A Louvre heist",
      "Charles de Gaulle baggage claim",
      "A fashion shoot & champagne soirée"
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
      "Vinyl shop",
      "Ceramic loft",
      "Espresso roastery",
      "Williamsburg tattoo studio"
    ],
    "correctIndex": 3,
    "funFact": "Josh clocking Liza’s real heart—and standing by her long after learning her real age—drove #TeamJosh mania for seven seasons.",
    "imageUrl": "./images/products/cinema-books.jpg",
    "imageCredit": ""
  },
  {
    "id": "mariah-carey-touch-my-body-set",
    "badge": "🎥 Music-Video Meet-Cute",
    "question": "On the set of which playful 2008 #1 music video—directed by Brett Ratner—did Mariah Carey spark her whirlwind marriage with Nick Cannon (11 years her junior)?",
    "options": [
      "\"Obsessed\"",
      "\"Touch My Body\"",
      "\"Bye Bye\"",
      "\"We Belong Together\""
    ],
    "correctIndex": 2,
    "funFact": "After \"Touch My Body\" hit #1, Mariah cast Nick Cannon as her love interest in the \"Bye Bye\" island video—and they wed in the Bahamas weeks later!",
    "imageUrl": "./images/products/silk-robe-pillowcase.jpg",
    "imageCredit": ""
  },
  {
    "id": "no-hard-feelings-piano-song",
    "badge": "🎹 No Hard Feelings Scene Stealer",
    "question": "In \"No Hard Feelings,\" which classic 1982 pop hit does Andrew Barth Feldman’s Percy sing live at the restaurant piano, stunning Jennifer Lawrence’s Maddie?",
    "options": [
      "\"Maggie May\"",
      "\"Maneater\" by Hall & Oates",
      "\"Jessie’s Girl\"",
      "\"Africa\""
    ],
    "correctIndex": 1,
    "funFact": "Andrew Barth Feldman actually performed \"Maneater\" live on set—turning a comedy setup into the warmest emotional turning point of the film.",
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
      "cheyenne Jackson",
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
      "Fiji",
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
    "funFact": "Sitka, Alaska—plus Betty White’s scene-stealing Grandma Annie—helped make \"The Proposal\" one of the highest-grossing romantic comedies of the century.",
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
      "A Brooklyn ferry",
      "30 Rockefeller lobby",
      "Yankee Stadium",
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
      "Henley Regatta",
      "A village tennis club",
      "A parish book fair",
      "Brighton Pier"
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
      "Best Country Duo",
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
      "High Court Judge",
      "Retired Religious Education Teacher",
      "Concert Cellist",
      "Botanical Illustrator"
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
      "Added a hopeful 5-year flash-forward reunion at Solène’s gallery",
      "Moved the finale to Tokyo",
      "Had Solène join the band on keyboards",
      "Cut Coachella completely"
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
    "question": "Mike White’s Emmy juggernaut \"The White Lotus\" set its first two lush resort seasons—packed with cross-generational entanglement—in which two glamorous locations?",
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
    "question": "In the 2005 rom-com \"Prime,\" Uma Thurman plays 37-year-old Rafi dating 23-year-old painter David—until her therapist (Meryl Streep) realizes mid-session that David is whom?",
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
    "question": "Julia May Jonas’s razor-sharp 2022 debut novel (adapted into a limited series starring Rachel Weisz & Leo Woodall) is titled after the magnetic younger novelist joining a liberal-arts English department—what is his first name?",
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
      "An island in Greece",
      "A vineyard in Tuscany",
      "A ski chalet in Chamonix",
      "A sun-drenched writers’ retreat in Morocco"
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
      " Biarritz"
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
      "Wedding DJ",
      "Country-club tennis pro",
      "Valet captain"
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
      "Cat Stevens (Yusuf)",
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
    "question": "Daryl Hall & John Oates’s four-week #1 smash \"Maneater\" (1982)—later covered on piano in \"No Hard Feelings\"—features an iconic solo on which instrument?",
    "options": [
      "Fender Stratocaster",
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
    "question": "In \"Home Again\" (2017), Reese Witherspoon plays newly separated 40-year-old Alice Kinney, who lets three aspiring 20-something filmmakers—led by Pico Alexander’s Harry—stay in her LA guesthouse. Who wrote and directed the film?",
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
      "\"G.I. Jane\"",
      "\"Ocean’s Twelve\"",
      "\"Mr. & Mrs. Smith\""
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
  }
];
