// ── Spelling Quiz Question Bank ───────────────────────────────
// Uses QuizEngine. Mix of multiple-choice and typed questions.
// Format: { question, answers[], correct (index), explanation }
// Typed questions: { question, type:'typed', answers:['correct'], acceptedAnswers:[], explanation }

function getSpellingQuestions(level) {
  switch (level) {
    case 'reception': return splReception();
    case 'year1':     return splYear1();
    case 'year2':     return splYear2();
    case 'year3':     return splYear3();
    case 'year4':     return splYear4();
    case 'year5':     return splYear5();
    case 'year6':     return splYear6();
    default:          return splYear1();
  }
}

function splMCQ(question, answers, correct, explanation, emoji) {
  return { question, answers, correct, explanation, emoji: emoji || null };
}

function splTyped(question, answer, hint, explanation) {
  return { question, type: 'typed', answers: [answer], acceptedAnswers: [answer.toLowerCase()], explanation, emoji: hint || null };
}

// ── Reception (Age 4–5) ─────────────────────────────────────
function splReception() {
  return [
    // --- existing questions ---
    splMCQ('Which spells the sound a dog makes?', ['wuf', 'woof', 'wuf', 'wouf'], 1, 'Woof! Dogs say "woof" — w-o-o-f! 🐶', '🐶'),
    splMCQ('Which word rhymes with "cat"?', ['car', 'cup', 'hat', 'can'], 2, '"Hat" rhymes with "cat" — they both end in "-at"! 🎩', '🐱'),
    splMCQ('Which word spells a colour?', ['rede', 'red', 'reed', 'redd'], 1, 'Red is a colour — r-e-d! 🔴', '🎨'),
    splMCQ('Which correctly spells a number?', ['won', 'wun', 'one', 'oan'], 2, '"One" — it is a tricky word! O-N-E. 1️⃣', '1️⃣'),
    splMCQ('Which word spells something you sit on?', ['char', 'chare', 'chair', 'chiar'], 2, 'Chair — c-h-a-i-r! You sit on a chair. 🪑', '🪑'),
    splMCQ('Which is the correct spelling?', ['sun', 'son', 'sune', 'sunn'], 0, 'Sun — s-u-n. The sun shines in the sky! ☀️', '☀️'),
    splMCQ('Which word names an animal?', ['frog', 'forg', 'forog', 'froge'], 0, 'Frog — f-r-o-g. Frogs jump and say ribbit! 🐸', '🐸'),
    splMCQ('Find the correctly spelt word:', ['buk', 'book', 'bouk', 'boke'], 1, 'Book — b-o-o-k. You read a book! 📚', '📚'),
    splMCQ('Which spells something you eat?', ['kake', 'caek', 'cake', 'cak'], 2, 'Cake — c-a-k-e. Delicious! 🎂', '🎂'),
    splMCQ('Which word spells a number?', ['to', 'two', 'tow', 'tue'], 1, 'Two — t-w-o. It is a tricky spelling! ✌️', '2️⃣'),
    splMCQ('Which word names something in the sky?', ['star', 'ster', 'stare', 'starr'], 0, 'Star — s-t-a-r. Stars twinkle at night! ⭐', '⭐'),
    splMCQ('Which correctly spells an action?', ['runn', 'run', 'rune', 'rn'], 1, 'Run — r-u-n. You run fast! 🏃', '🏃'),
    splMCQ('Which spells something you drink?', ['milk', 'milck', 'milke', 'mylk'], 0, 'Milk — m-i-l-k. Good for your bones! 🥛', '🥛'),
    splMCQ('Which word names a colour?', ['bloo', 'blew', 'blue', 'blou'], 2, 'Blue — b-l-u-e. The sky is blue! 💙', '💙'),
    splMCQ('Which spells a number?', ['thre', 'three', 'tree', 'threa'], 1, 'Three — t-h-r-e-e! 3️⃣', '3️⃣'),
    // --- new questions ---
    splMCQ('Which word names a farm animal?', ['pig', 'pige', 'pigg', 'pog'], 0, 'Pig — p-i-g. Pigs live on farms and say oink! 🐷', '🐷'),
    splMCQ('Which spells something you sleep in?', ['bed', 'bedd', 'bead', 'bede'], 0, 'Bed — b-e-d. You sleep in a bed at night! 🛏️', '🛏️'),
    splMCQ('Which word names a colour?', ['gren', 'grene', 'green', 'grien'], 2, 'Green — g-r-e-e-n. Grass is green! 💚', '💚'),
    splMCQ('Which spells something you write with?', ['pen', 'peen', 'penne', 'phen'], 0, 'Pen — p-e-n. You write with a pen! ✏️', '✏️'),
    splMCQ('Which word names a body part?', ['nos', 'noze', 'nose', 'knose'], 2, 'Nose — n-o-s-e. Your nose smells things! 👃', '👃'),
    splMCQ('Which word names an animal?', ['cat', 'catt', 'kat', 'cate'], 0, 'Cat — c-a-t. Cats say meow! 🐱', '🐱'),
    splMCQ('Which spells a number?', ['for', 'fore', 'four', 'foor'], 2, 'Four — f-o-u-r. Four has a tricky spelling! 4️⃣', '4️⃣'),
    splMCQ('Which word names a colour?', ['yelo', 'yelloe', 'yellow', 'yallow'], 2, 'Yellow — y-e-l-l-o-w. The sun is yellow! 💛', '💛'),
    splMCQ('Which word names something you wear?', ['hat', 'hatt', 'hayt', 'het'], 0, 'Hat — h-a-t. You wear a hat on your head! 🎩', '🎩'),
    splMCQ('Which spells an animal that barks?', ['dog', 'dogg', 'doge', 'dawg'], 0, 'Dog — d-o-g. Dogs bark and wag their tails! 🐶', '🐶'),
    splMCQ('Which word names something in a garden?', ['flowr', 'flower', 'flawer', 'flowre'], 1, 'Flower — f-l-o-w-e-r. Flowers are beautiful! 🌸', '🌸'),
    splMCQ('Which word names a shape?', ['circel', 'circle', 'circal', 'sircle'], 1, 'Circle — c-i-r-c-l-e. A circle is perfectly round! ⭕', '⭕'),
    splMCQ('Which spells something you kick?', ['bal', 'ball', 'bawl', 'baul'], 1, 'Ball — b-a-l-l. Double l at the end! ⚽', '⚽'),
    splMCQ('Which word names a number?', ['fiv', 'five', 'fife', 'fyve'], 1, 'Five — f-i-v-e. Five has a silent e at the end! 5️⃣', '5️⃣'),
    splTyped('Type the colour of a banana:', 'yellow', '🍌', 'Yellow — y-e-l-l-o-w. Double l in the middle! 🍌'),
    splTyped('Type the name of this animal: 🐱', 'cat', '🐱', 'Cat — c-a-t. A short, simple CVC word! 🐱'),
    splMCQ('Which word names something cold you eat?', ['icecrem', 'ice cream', 'icecream', 'icecreame'], 1, 'Ice cream — two separate words! I-c-e c-r-e-a-m. Yummy! 🍦', '🍦'),
    splMCQ('Which word names an animal that hops?', ['rabit', 'rabbit', 'rabitt', 'rabbet'], 1, 'Rabbit — r-a-b-b-i-t. Double b in the middle! 🐰', '🐰'),
    splMCQ('Which spells something you see with?', ['eye', 'ey', 'ie', 'aie'], 0, 'Eye — e-y-e. A very tricky spelling for such a short word! 👁️', '👁️'),
    splMCQ('Which word names the sound a cow makes?', ['moo', 'mooo', 'mu', 'mou'], 0, 'Moo — m-o-o. Cows say moo! 🐄', '🐄'),
    splMCQ('Which word names something you use to eat soup?', ['spoon', 'spune', 'spown', 'spuun'], 0, 'Spoon — s-p-o-o-n. Double o in spoon! 🥄', '🥄'),
    splMCQ('Which spells a fruit?', ['aple', 'appel', 'apple', 'aplle'], 2, 'Apple — a-p-p-l-e. Double p! 🍎', '🍎'),
    splMCQ('Find the correctly spelt colour:', ['pink', 'pynk', 'pinck', 'pinkk'], 0, 'Pink — p-i-n-k. Short and simple! 🩷', '🩷'),
    splMCQ('Which word names something you bounce?', ['bal', 'ball', 'balle', 'bawl'], 1, 'Ball — b-a-l-l. You bounce a ball! ⚽', '⚽'),
    splMCQ('Which word names a farm animal?', ['kow', 'couw', 'cowe', 'cow'], 3, 'Cow — c-o-w. Cows live on farms and give milk! 🐄', '🐄'),
    splMCQ('Which word names a number?', ['sixx', 'six', 'sics', 'syx'], 1, 'Six — s-i-x. Six is a short word! 6️⃣', '6️⃣'),
    splTyped('Type the name of this animal: 🐸', 'frog', '🐸', 'Frog — f-r-o-g. Four letters, four legs! 🐸'),
    splMCQ('Which word names something you wear on your feet?', ['soks', 'socks', 'sockz', 'socs'], 1, 'Socks — s-o-c-k-s. You wear socks inside your shoes! 🧦', '🧦'),
    splMCQ('Which correctly spells something you draw with?', ['pensil', 'pencil', 'pensile', 'pencile'], 1, 'Pencil — p-e-n-c-i-l. Six letters — don\'t forget the C! ✏️', '✏️'),
    splMCQ('Which spells the opposite of "day"?', ['nigt', 'niht', 'night', 'nighht'], 2, 'Night — n-i-g-h-t. The "gh" is silent! 🌙', '🌙'),
  ];
}

// ── Year 1 (Age 5–6) ────────────────────────────────────────
function splYear1() {
  return [
    // --- existing questions ---
    splMCQ('Which is the correct spelling?', ['becaus', 'because', 'becuase', 'becouse'], 1, '"Because" — b-e-c-a-u-s-e. A tricky one! Try saying: "Big Elephants Can Always Understand Small Elephants"! 🐘'),
    splMCQ('Which spells a day of the week?', ['Munday', 'Mownday', 'Monday', 'Mondey'], 2, 'Monday — M-o-n-d-a-y. Days of the week always have a capital letter! 📅'),
    splMCQ('Which is correct?', ['thay', 'thei', 'they', 'thaye'], 2, '"They" — t-h-e-y. A common sight word to learn! 👫'),
    splMCQ('Choose the correct spelling:', ['hav', 'haev', 'have', 'hafe'], 2, '"Have" — h-a-v-e. The "e" at the end is silent! 🤫'),
    splMCQ('Which is correct?', ['liek', 'like', 'lyke', 'leke'], 1, '"Like" — l-i-k-e. I like lots of things! 😊'),
    splMCQ('Which correctly spells a common word?', ['sed', 'sayd', 'said', 'sead'], 2, '"Said" — s-a-i-d. It sounds like "sed" but is spelled differently! ✍️'),
    splMCQ('Find the correct spelling:', ['yor', 'your', 'yore', 'youre'], 1, '"Your" — y-o-u-r. "Is this YOUR bag?" 🎒'),
    splMCQ('Which is correct?', ['wen', 'whan', 'when', 'ween'], 2, '"When" — w-h-e-n. The "wh" makes a /w/ sound! ⏰'),
    splMCQ('Choose the correct spelling:', ['whent', 'went', 'wennt', 'wenet'], 1, '"Went" — w-e-n-t. Past tense of "go"! 🚶'),
    splMCQ('Which is correct?', ['thier', 'ther', 'thare', 'there'], 3, '"There" — t-h-e-r-e. "It is over THERE." 👉'),
    splMCQ('Find the correct spelling:', ['cum', 'come', 'comb', 'coome'], 1, '"Come" — c-o-m-e. "Come here!" The e is silent! 👋'),
    splMCQ('Which is correct?', ['sum', 'some', 'soum', 'soom'], 1, '"Some" — s-o-m-e. "Can I have SOME cake?" 🎂'),
    splMCQ('Choose the correct spelling:', ['littel', 'litl', 'little', 'litlle'], 2, '"Little" — l-i-t-t-l-e. Double "t" in the middle! 🐭'),
    splMCQ('Which is correct?', ['wota', 'warter', 'water', 'watter'], 2, '"Water" — w-a-t-e-r. We all need water! 💧'),
    splMCQ('Find the correct spelling:', ['luv', 'luve', 'love', 'lov'], 2, '"Love" — l-o-v-e. The "o" makes an /u/ sound! ❤️'),
    // --- new questions ---
    splMCQ('Which is correct?', ['wuz', 'wos', 'was', 'waz'], 2, '"Was" — w-a-s. It sounds like "woz" but is spelled w-a-s! ✍️'),
    splMCQ('Choose the correct spelling:', ['doo', 'due', 'do', 'dew'], 2, '"Do" — d-o. Short but tricky — just two letters! ✅'),
    splMCQ('Which is correct?', ['ar', 'arr', 'are', 'aer'], 2, '"Are" — a-r-e. The "e" at the end is silent! 👥'),
    splMCQ('Find the correct spelling:', ['az', 'azz', 'as', 'aas'], 2, '"As" — a-s. Short and simple! 📖'),
    splMCQ('Which is correct?', ['fer', 'far', 'for', 'fore'], 2, '"For" — f-o-r. "This gift is FOR you!" 🎁'),
    splMCQ('Choose the correct spelling:', ['iz', 'iss', 'is', 'ise'], 2, '"Is" — i-s. "She IS happy." Short and important! 😊'),
    splMCQ('Which is correct?', ['hee', 'hei', 'hay', 'he'], 3, '"He" — h-e. "HE is my friend." 🧑'),
    splMCQ('Find the correct spelling:', ['shee', 'shi', 'she', 'shea'], 2, '"She" — s-h-e. "SHE is kind." 👩'),
    splMCQ('Which is correct?', ['aye', 'ai', 'ie', 'I'], 3, '"I" — just the capital letter I! Always capitalise it! ✏️'),
    splMCQ('Choose the correct spelling:', ['wee', 'wi', 'we', 'wea'], 2, '"We" — w-e. "WE love school!" 🏫'),
    splMCQ('Which is correct?', ['myy', 'miy', 'my', 'mye'], 2, '"My" — m-y. "This is MY book." 📚'),
    splMCQ('Find the correct spelling:', ['ther', 'thier', 'their', 'thear'], 2, '"Their" — t-h-e-i-r. "That is THEIR house." 🏠'),
    splMCQ('Which is correct?', ['see', 'se', 'sea', 'sey'], 0, '"See" — s-e-e. Double e! "I can SEE the stars." ⭐'),
    splMCQ('Choose the correct spelling:', ['luk', 'looke', 'look', 'lokk'], 2, '"Look" — l-o-o-k. Double o! "LOOK at that!" 👀'),
    splMCQ('Which is correct?', ['teh', 'the', 'thee', 'theh'], 1, '"The" — t-h-e. The most common word in English! 📖'),
    splMCQ('Find the correct spelling:', ['an', 'ann', 'ane', 'aen'], 0, '"An" — a-n. Use "an" before a vowel sound! 🔤'),
    splMCQ('Which is correct?', ['goe', 'goo', 'go', 'gow'], 2, '"Go" — g-o. Short but important! 🏃'),
    splMCQ('Choose the correct spelling:', ['noe', 'kno', 'know', 'nowe'], 2, '"Know" — k-n-o-w. The "kn" — the k is silent! 🤫'),
    splMCQ('Which is correct?', ['day', 'daye', 'dai', 'dey'], 0, '"Day" — d-a-y. "Have a great DAY!" ☀️'),
    splMCQ('Find the correct spelling:', ['bee', 'be', 'bea', 'bei'], 1, '"Be" — b-e. "Be kind to others!" 💛'),
    splMCQ('Which is correct?', ['old', 'olde', 'owld', 'ohld'], 0, '"Old" — o-l-d. "That castle is very OLD." 🏰'),
    splMCQ('Choose the correct spelling:', ['noo', 'new', 'nuw', 'nwe'], 1, '"New" — n-e-w. "I have a NEW book!" 📗'),
    splTyped('Type the correct spelling of this common word: opposite of "no"', 'yes', '✅', '"Yes" — y-e-s. Simple and important! ✅'),
    splTyped('Type the word that means "not now" or "in the past":', 'was', '⏰', '"Was" — w-a-s. It sounds like "woz" but is spelled w-a-s! 🕐'),
    splMCQ('Which is the odd one out (misspelled)?', ['cat', 'dog', 'brd', 'pig'], 2, '"Brd" is misspelled — it should be "bird" b-i-r-d! 🐦'),
    splMCQ('Which is the odd one out (misspelled)?', ['red', 'bloo', 'green', 'pink'], 1, '"Bloo" is wrong — it should be "blue" b-l-u-e! 💙'),
    splMCQ('Which is correct?', ['yelo', 'yellow', 'yellowe', 'yallow'], 1, '"Yellow" — y-e-l-l-o-w. Double l in the middle! 💛'),
    splMCQ('Choose the correct spelling:', ['pley', 'plai', 'play', 'playe'], 2, '"Play" — p-l-a-y. "Let\'s PLAY outside!" 🛝'),
  ];
}

// ── Year 2 (Age 6–7) ────────────────────────────────────────
function splYear2() {
  return [
    // --- existing questions ---
    splMCQ('Which is correct?', ['cood', 'coud', 'could', 'cuold'], 2, '"Could" — c-o-u-l-d. The "l" is silent! "Could, would, should" all have a silent l. 🤫'),
    splMCQ('Choose the correct spelling:', ['shood', 'should', 'shoold', 'shoud'], 1, '"Should" — s-h-o-u-l-d. Silent l again! Just like could and would. 🤫'),
    splMCQ('Which is correct?', ['agen', 'agian', 'agaen', 'again'], 3, '"Again" — a-g-a-i-n. "Let\'s play again!" 🔄'),
    splMCQ('Find the correct spelling:', ['difer', 'differant', 'different', 'difrent'], 2, '"Different" — d-i-f-f-e-r-e-n-t. Double "f"! 🔤'),
    splMCQ('Which is correct?', ['frend', 'freind', 'friend', 'friand'], 2, '"Friend" — f-r-i-e-n-d. "i before e" here! 👫'),
    splMCQ('Choose the correct spelling:', ['grate', 'graet', 'greet', 'great'], 3, '"Great" — g-r-e-a-t. "You did a GREAT job!" ⭐'),
    splMCQ('Which is correct?', ['peeple', 'peaple', 'people', 'peopel'], 2, '"People" — p-e-o-p-l-e. Tricky! The "eo" together is unusual. 👥'),
    splMCQ('Find the correct spelling:', ['scool', 'skoool', 'scholl', 'school'], 3, '"School" — s-c-h-o-o-l. "sch" makes a /sk/ sound! 🏫'),
    splMCQ('Which is correct?', ['evry', 'every', 'evrey', 'everi'], 1, '"Every" — e-v-e-r-y. There\'s no "a" — just "every"! 📖'),
    splMCQ('Choose the correct spelling:', ['herd', 'heard', 'heird', 'heaerd'], 1, '"Heard" — h-e-a-r-d. "I HEARD a noise." It contains "ear"! 👂'),
    splMCQ('Which is correct?', ['dont', "don't", 'dont\'', 'd\'ont'], 1, '"Don\'t" — the apostrophe replaces the "o" in "not": do not = don\'t! 📝'),
    splMCQ('Find the correct spelling:', ['breack', 'braek', 'break', 'breake'], 2, '"Break" — b-r-e-a-k. "Let\'s take a BREAK." ☕'),
    splMCQ('Which is correct?', ['becaus', 'because', 'becuase', 'becose'], 1, '"Because" — b-e-c-a-u-s-e. "Big Elephants Can Always Understand Small Elephants"! 🐘'),
    splMCQ('Choose the correct spelling:', ['woud', 'wood', 'would', 'wold'], 2, '"Would" — w-o-u-l-d. Silent l! Would, could, should all work the same way. 🤫'),
    splMCQ('Which is correct?', ['nite', 'knight', 'night', 'nigt'], 2, '"Night" — n-i-g-h-t. The "gh" is silent — it\'s a tricky spelling! 🌙'),
    // --- new questions ---
    splMCQ('Which is correct?', ['mor', 'mour', 'more', 'moer'], 2, '"More" — m-o-r-e. Silent e at the end! "I want MORE!" 😄'),
    splMCQ('Choose the correct spelling:', ['thier', 'there', 'theare', 'theer'], 1, '"There" — t-h-e-r-e. "It is over THERE." Don\'t confuse with "their"! 👉'),
    splMCQ('Which is correct?', ['wher', 'whear', 'where', 'whare'], 2, '"Where" — w-h-e-r-e. "WHERE are you going?" 🗺️'),
    splMCQ('Find the correct spelling:', ['meny', 'manie', 'many', 'maeny'], 2, '"Many" — m-a-n-y. "I have MANY friends!" 👥'),
    splMCQ('Which is correct?', ['clase', 'clas', 'class', 'classs'], 2, '"Class" — c-l-a-s-s. Double s at the end! 🏫'),
    splMCQ('Choose the correct spelling:', ['werk', 'wark', 'work', 'worck'], 2, '"Work" — w-o-r-k. "I WORK hard at school!" 💪'),
    splMCQ('Which is correct?', ['thort', 'thought', 'thougt', 'thowt'], 1, '"Thought" — t-h-o-u-g-h-t. The "ough" is a tricky pattern! 💭'),
    splMCQ('Find the correct spelling:', ['siad', 'saied', 'said', 'sade'], 2, '"Said" — s-a-i-d. Sounds like "sed" but spelled differently! 💬'),
    splMCQ('Which is correct?', ['wich', 'which', 'whitch', 'wich'], 1, '"Which" — w-h-i-c-h. Don\'t forget the "wh" at the start! 🤔'),
    splMCQ('Choose the correct spelling:', ['too', 'to', 'two', 'tow'], 1, '"To" — just t-o. "I\'m going TO school." Don\'t mix up to/too/two! 🏫'),
    splMCQ('Which is correct?', ['abuot', 'abbout', 'about', 'aboot'], 2, '"About" — a-b-o-u-t. "What is this book ABOUT?" 📖'),
    splMCQ('Find the correct spelling:', ['frm', 'from', 'froom', 'frome'], 1, '"From" — f-r-o-m. "This letter is FROM my teacher." 📨'),
    splMCQ('Which is correct?', ['ofer', 'offer', 'offar', 'offor'], 1, '"Offer" — o-f-f-e-r. Double f! "Can I OFFER you a snack?" 🍎'),
    splMCQ('Choose the correct spelling:', ['keping', 'keepping', 'keeping', 'keaping'], 2, '"Keeping" — k-e-e-p-i-n-g. Double e! "I\'m KEEPING this!" 🔒'),
    splMCQ('Which is correct?', ["can't", 'cant', 'can\'t', "ca'nt"], 0, '"Can\'t" — the apostrophe replaces the "no" in "cannot": can not = can\'t! ✋'),
    splMCQ('Find the correct spelling:', ['thay', 'thei', 'they', 'thaye'], 2, '"They" — t-h-e-y. "THEY are my friends!" 👫'),
    splMCQ('Which is correct?', ['owt', 'owut', 'ouut', 'out'], 3, '"Out" — o-u-t. "Let\'s go OUT to play!" 🌳'),
    splMCQ('Choose the correct spelling:', ['bigg', 'bige', 'big', 'biig'], 2, '"Big" — b-i-g. "What a BIG elephant!" 🐘'),
    splMCQ('Which is odd one out (misspelled)?', ['would', 'could', 'shuold', 'should'], 2, '"Shuold" is wrong — it should be "should" s-h-o-u-l-d! 🤫'),
    splMCQ('Find the correct spelling:', ['theem', 'them', 'theim', 'thum'], 1, '"Them" — t-h-e-m. "I like THEM!" 👥'),
    splMCQ('Which is correct?', ['maid', 'made', 'maed', 'meyd'], 1, '"Made" — m-a-d-e. Silent e! "I MADE a cake." 🎂'),
    splTyped('Type the correct spelling: opposite of "can"', 'cannot', '🚫', '"Cannot" — c-a-n-n-o-t. Double n in the middle! Or use can\'t with an apostrophe. 🚫'),
    splTyped('Type the word that means you were told or read something:', 'heard', '👂', '"Heard" — h-e-a-r-d. It contains the word "ear"! Can you HEAR it? 👂'),
    splMCQ('Which is correct?', ['wile', 'while', 'whyle', 'whille'], 1, '"While" — w-h-i-l-e. "I waited a WHILE." 🕐'),
    splMCQ('Choose the correct spelling:', ['chidren', 'children', 'childern', 'chioldren'], 1, '"Children" — c-h-i-l-d-r-e-n. Plural of "child"! 👧👦'),
    splMCQ('Which is correct?', ['usd', 'usedd', 'used', 'usde'], 2, '"Used" — u-s-e-d. "I USED my pencil today." ✏️'),
    splMCQ('Find the correct spelling:', ['naem', 'name', 'nayme', 'naam'], 1, '"Name" — n-a-m-e. Silent e! "What is your NAME?" 🏷️'),
    splMCQ('Which is the odd one out (misspelled)?', ['great', 'brake', 'break', 'steak'], 1, '"Brake" (to slow down) is different — "break" b-r-e-a-k means to snap or take a rest! 🚗'),
  ];
}

// ── Year 3 (Age 7–8) ────────────────────────────────────────
function splYear3() {
  return [
    // --- existing questions ---
    splMCQ('Which is correct?', ['acsident', 'aksidant', 'accident', 'acident'], 2, '"Accident" — a-c-c-i-d-e-n-t. Double "c"! An accident happens by mistake. 🚨'),
    splMCQ('Choose the correct spelling:', ['Februar', 'Febuary', 'February', 'Feburary'], 2, '"February" — F-e-b-r-u-a-r-y. There are two "r"s — the first one is often missed! 📅'),
    splMCQ('Which is correct?', ['beleve', 'beleive', 'believe', 'beleave'], 2, '"Believe" — b-e-l-i-e-v-e. "i before e except after c" helps here! 🌟'),
    splMCQ('Find the correct spelling:', ['gramer', 'grammer', 'grammar', 'gramear'], 2, '"Grammar" — g-r-a-m-m-a-r. Double "m" and ends in "ar" not "er"! ✏️'),
    splMCQ('Which is correct?', ['separete', 'seperate', 'separate', 'separrate'], 2, '"Separate" — s-e-p-a-r-a-t-e. There\'s a RAT in "sepaRAte"! 🐀'),
    splMCQ('Choose the correct spelling:', ['nessesary', 'necessary', 'neccesary', 'necesary'], 1, '"Necessary" — one Collar, two Socks: n-e-c-e-s-s-a-r-y. One c, two s! 🧦'),
    splMCQ('Which is correct?', ['adress', 'addres', 'address', 'adresse'], 2, '"Address" — a-d-d-r-e-s-s. Double d AND double s! 📮'),
    splMCQ('Find the correct spelling:', ['calender', 'calendar', 'calander', 'calendur'], 1, '"Calendar" — c-a-l-e-n-d-a-r. Ends in "ar" not "er"! 📅'),
    splMCQ('Which is correct?', ['knowlege', 'knowledge', 'knolwedge', 'knowlegde'], 1, '"Knowledge" — k-n-o-w-l-e-d-g-e. The "k" is silent before "n"! 🧠'),
    splMCQ('Choose the correct spelling:', ['libary', 'libarry', 'library', 'librery'], 2, '"Library" — l-i-b-r-a-r-y. Two r\'s! People often forget the first "r". 📚'),
    splMCQ('Which is correct?', ['exersise', 'exircise', 'exercise', 'excersize'], 2, '"Exercise" — e-x-e-r-c-i-s-e. Remember: exERCIse! 🏃'),
    splMCQ('Find the correct spelling:', ['possable', 'posible', 'possible', 'possibal'], 2, '"Possible" — p-o-s-s-i-b-l-e. Double s! 💡'),
    splMCQ('Which is correct?', ['intrest', 'interest', 'intarest', 'enterest'], 1, '"Interest" — i-n-t-e-r-e-s-t. Don\'t drop the middle "e"! 🎯'),
    splMCQ('Choose the correct spelling:', ['bisycul', 'bicycle', 'bycycle', 'bicyle'], 1, '"Bicycle" — b-i-c-y-c-l-e. Think: two cycles (bi = two)! 🚲'),
    splMCQ('Which is correct?', ['gurad', 'gaurd', 'guard', 'guerd'], 2, '"Guard" — g-u-a-r-d. The "ua" together is unusual! 💂'),
    // --- new questions ---
    splMCQ('Which is correct?', ['nite', 'knite', 'knight', 'nighkt'], 2, '"Knight" — k-n-i-g-h-t. The "kn" has a silent k, and "gh" is also silent! ⚔️'),
    splMCQ('Choose the correct spelling:', ['rap', 'warp', 'wrap', 'wraap'], 2, '"Wrap" — w-r-a-p. The "wr" has a silent w! 🎁'),
    splMCQ('Which is correct?', ['nome', 'gnome', 'nome', 'gnoem'], 1, '"Gnome" — g-n-o-m-e. The "gn" has a silent g! 🍄'),
    splMCQ('Find the correct spelling:', ['rite', 'write', 'wrigt', 'riet'], 1, '"Write" — w-r-i-t-e. Silent w before the r! 📝'),
    splMCQ('Which is correct?', ['neel', 'kneall', 'kneel', 'nele'], 2, '"Kneel" — k-n-e-e-l. Silent k and double e! 🙏'),
    splMCQ('Choose the correct spelling:', ['desribe', 'describe', 'discribe', 'descrieb'], 1, '"Describe" — d-e-s-c-r-i-b-e. Think: de-SCRIBE (a scribe writes)! ✍️'),
    splMCQ('Which is correct?', ['untidy', 'untiedy', 'untidey', 'untiddy'], 0, '"Untidy" — un-tidy. The prefix "un-" means NOT. Not tidy = untidy! 🧹'),
    splMCQ('Find the correct spelling:', ['rewrite', 'rewriet', 're-write', 'reewrite'], 0, '"Rewrite" — re-write. The prefix "re-" means AGAIN. Write again = rewrite! 📝'),
    splMCQ('Which is correct?', ['dislike', 'disslike', 'disliek', 'dis-like'], 0, '"Dislike" — dis-like. The prefix "dis-" means NOT or the opposite! 👎'),
    splMCQ('Choose the correct spelling:', ['misplace', 'mis-place', 'missplace', 'misplase'], 0, '"Misplace" — mis-place. The prefix "mis-" means wrongly. To place wrongly! 🔍'),
    splMCQ('Which is correct?', ['injoyment', 'enjoyment', 'enjoiment', 'enjoymant'], 1, '"Enjoyment" — en-joy-ment. Add "-ment" to "enjoy"! 😄'),
    splMCQ('Find the correct spelling:', ['beautyfull', 'beutiful', 'beautiful', 'beautifull'], 2, '"Beautiful" — b-e-a-u-t-i-f-u-l. "eau" is the tricky part — from French! 🌸'),
    splMCQ('Which is correct?', ['posibly', 'possibley', 'possiblee', 'possibly'], 3, '"Possibly" — pos-si-bly. Based on "possible" — drop the e and add y! 💡'),
    splMCQ('Choose the correct spelling:', ['naturaly', 'naturelly', 'naturally', 'naturelley'], 2, '"Naturally" — nat-ur-al-ly. Double l at the end! 🌿'),
    splMCQ('Which is the odd one out (misspelled)?', ['wrap', 'write', 'kneel', 'nite'], 3, '"Nite" is wrong — the correct spelling is "night" n-i-g-h-t with a silent gh! 🌙'),
    splMCQ('Find the correct spelling:', ['reeply', 'repley', 'replie', 'reply'], 3, '"Reply" — r-e-p-l-y. Ends in "y" not "ey"! 📩'),
    splMCQ('Which is correct?', ['happyness', 'happiness', 'hapiness', 'happieness'], 1, '"Happiness" — h-a-p-p-i-n-e-s-s. Change the "y" in "happy" to "i" then add "-ness"! 😊'),
    splMCQ('Choose the correct spelling:', ['sadness', 'sadnes', 'sadniss', 'saddness'], 0, '"Sadness" — s-a-d-n-e-s-s. Double s at the end! 😢'),
    splMCQ('Which is correct?', ['disapper', 'disappear', 'disapear', 'dissapear'], 1, '"Disappear" — d-i-s-a-p-p-e-a-r. Prefix "dis-" + double p in "appear"! 👻'),
    splMCQ('Find the correct spelling:', ['fameous', 'famious', 'famous', 'faymous'], 2, '"Famous" — f-a-m-o-u-s. Based on "fame" — drop the e and add "ous"! 🌟'),
    splMCQ('Which is correct?', ['dangerus', 'dangerous', 'dangereous', 'dangrous'], 1, '"Dangerous" — d-a-n-g-e-r-o-u-s. Keep the "e" in "danger" before "-ous"! ⚠️'),
    splTyped('Type the correct spelling: a medieval fighter on horseback who wore armour:', 'knight', '⚔️', '"Knight" — k-n-i-g-h-t. Two silent letters: the k and the gh! ⚔️'),
    splTyped('Type the correct spelling: to cover something in paper for a gift:', 'wrap', '🎁', '"Wrap" — w-r-a-p. The w is silent! 🎁'),
    splMCQ('Which is correct?', ['unhapy', 'unhappy', 'un-happy', 'unnhappy'], 1, '"Unhappy" — un-happy. The prefix "un-" + "happy" (keep the double p)! 😔'),
    splMCQ('Choose the correct spelling:', ['miscount', 'mis-count', 'misscount', 'miscownt'], 0, '"Miscount" — mis-count. The prefix "mis-" means wrongly. To count wrongly! 🔢'),
    splMCQ('Which is correct?', ['acheive', 'acheeve', 'achieve', 'acheve'], 2, '"Achieve" — a-c-h-i-e-v-e. "i before e" — ach-I-E-ve! Never give up! 🏆'),
    splMCQ('Choose the correct spelling:', ['briljant', 'brillant', 'brilliant', 'brillient'], 2, '"Brilliant" — b-r-i-l-l-i-a-n-t. Double L! A brilliant student studies this! 💡'),
    splTyped('Type the correct spelling: the opposite of "dangerous":','safe',['safe'],null,
      '"Safe" — s-a-f-e. Just four letters! Safety first! 🛡️'),
  ];
}

// ── Year 4 (Age 8–9) ────────────────────────────────────────
function splYear4() {
  return [
    // --- existing questions ---
    splMCQ('Which is correct?', ['ocasion', 'occassion', 'occation', 'occasion'], 3, '"Occasion" — o-c-c-a-s-i-o-n. Double c, single s! 🎉'),
    splMCQ('Choose the correct spelling:', ['posession', 'possesion', 'possession', 'posesion'], 2, '"Possession" — p-o-s-s-e-s-s-i-o-n. Double s TWICE! 📦'),
    splMCQ('Which is correct?', ['measurment', 'measurament', 'measurement', 'meassurement'], 2, '"Measurement" — m-e-a-s-u-r-e-m-e-n-t. Keep the "e" after "measur"! 📏'),
    splMCQ('Find the correct spelling:', ['dissapear', 'dissappear', 'disapear', 'disappear'], 3, '"Disappear" — d-i-s-a-p-p-e-a-r. One s, double p! 👻'),
    splMCQ('Which is correct?', ['soverign', 'sovereign', 'sovreign', 'soveregn'], 1, '"Sovereign" — s-o-v-e-r-e-i-g-n. The silent "g" before "n" trips people up! 👑'),
    splMCQ('Choose the correct spelling:', ['immagine', 'imaggine', 'imagine', 'imageine'], 2, '"Imagine" — i-m-a-g-i-n-e. Single m and single g! 💭'),
    splMCQ('Which is correct?', ['suprise', 'surpise', 'surprise', 'surpirse'], 2, '"Surprise" — s-u-r-p-r-i-s-e. The first "r" is often missed in speech! 🎁'),
    splMCQ('Find the correct spelling:', ['stratagey', 'strategy', 'stratergy', 'startegy'], 1, '"Strategy" — s-t-r-a-t-e-g-y. No extra "r" before the "g"! ♟️'),
    splMCQ('Which is correct?', ['recieve', 'receve', 'receive', 'recieave'], 2, '"Receive" — r-e-c-e-i-v-e. "i before e EXCEPT after c" — re-C-eive! 📬'),
    splMCQ('Choose the correct spelling:', ['consciance', 'conscience', 'conshence', 'conscence'], 1, '"Conscience" — c-o-n-s-c-i-e-n-c-e. The "sc" makes an /sh/ sound! 💚'),
    splMCQ('Which is correct?', ['privalege', 'privilidge', 'privilige', 'privilege'], 3, '"Privilege" — p-r-i-v-i-l-e-g-e. Not "privelege"! 🌟'),
    splMCQ('Find the correct spelling:', ['freequent', 'frequent', 'frequant', 'frquent'], 1, '"Frequent" — f-r-e-q-u-e-n-t. Remember: "q" is almost always followed by "u"! ⏰'),
    splMCQ('Which is correct?', ['acheive', 'achieve', 'achive', 'acheeve'], 1, '"Achieve" — a-c-h-i-e-v-e. "i before e" — ach-I-E-ve! 🏆'),
    splMCQ('Choose the correct spelling:', ['corageous', 'couragous', 'courageous', 'couraegous'], 2, '"Courageous" — c-o-u-r-a-g-e-o-u-s. Keep the "e" before "ous"! 🦁'),
    splTyped('Type the correct spelling of the month after January:', 'february', '📅', '"February" has two r\'s — F-e-b-r-u-a-r-y. The first r is often forgotten! ❄️'),
    // --- new questions ---
    splMCQ('Which word correctly completes: "It was __ they lived" (meaning belonging to them)?', ['there', 'they\'re', 'their', 'thier'], 2, '"Their" — t-h-e-i-r. It shows belonging: THEIR house. "there" is a place, "they\'re" = they are! 🏠'),
    splMCQ('Which word correctly completes: "__ going to win!" (meaning they are)?', ['Their', 'There', "They're", 'Thier'], 2, '"They\'re" = they are. The apostrophe shows letters are missing! "They\'re going to win!" 🏆'),
    splMCQ('Which word correctly completes: "Put it over __" (meaning a place)?', ['their', "they're", 'thear', 'there'], 3, '"There" — a place or location. Remember: HERE and THERE both have "here" in them! 👉'),
    splMCQ('Which is correct in: "The rain did not __ her mood"?', ['affect', 'effect', 'afect', 'efect'], 0, '"Affect" is a verb (action word). "Effect" is usually a noun. The rain AFFECTS mood. 🌧️'),
    splMCQ('Which word completes: "What was the __ of the medicine?"', ['affect', 'effect', 'afect', 'efect'], 1, '"Effect" is a noun (a thing). "Affect" is a verb (an action). The EFFECT of medicine! 💊'),
    splMCQ('Which is correct?', ['passt', 'past', 'pased', 'paast'], 1, '"Past" — p-a-s-t. "In the PAST" or "She walked PAST." 🕰️'),
    splMCQ('Choose the correct spelling:', ['passd', 'past', 'passed', 'passeed'], 2, '"Passed" — p-a-s-s-e-d. "She PASSED her test." It is the past tense of "pass"! ✅'),
    splMCQ('Which is correct?', ['stashun', 'station', 'stacion', 'stasion'], 1, '"Station" — s-t-a-t-i-o-n. The "-tion" ending sounds like "shun"! 🚂'),
    splMCQ('Find the correct spelling:', ['nayshun', 'nasion', 'nation', 'nashun'], 2, '"Nation" — n-a-t-i-o-n. The "-tion" suffix sounds like "shun"! 🌍'),
    splMCQ('Which is correct?', ['tensun', 'tenshun', 'tension', 'tenseon'], 2, '"Tension" — t-e-n-s-i-o-n. The "-sion" suffix sounds like "shun"! 😬'),
    splMCQ('Choose the correct spelling:', ['poisonus', 'poisonous', 'poisenous', 'poisonouss'], 1, '"Poisonous" — p-o-i-s-o-n-o-u-s. Add "-ous" to "poison"! ☠️'),
    splMCQ('Which is correct?', ['joyus', 'joyeous', 'joyous', 'joious'], 2, '"Joyous" — j-o-y-o-u-s. Add "-ous" to "joy"! 😄'),
    splMCQ('Find the correct spelling:', ['nervus', 'nerveous', 'nervous', 'nervious'], 2, '"Nervous" — n-e-r-v-o-u-s. Add "-ous" to "nerve" and drop the e! 😰'),
    splMCQ('Which is correct?', ['fasshun', 'fashun', 'fashion', 'fashoin'], 2, '"Fashion" — f-a-s-h-i-o-n. The "-ion" after "sh" sounds like "shun"! 👗'),
    splMCQ('Choose the correct spelling:', ['adition', 'additon', 'addition', 'addiion'], 2, '"Addition" — a-d-d-i-t-i-o-n. Double d! In maths you do addition. ➕'),
    splMCQ('Which is the odd one out (misspelled)?', ['station', 'nation', 'tensoin', 'fashion'], 2, '"Tensoin" is wrong — it should be "tension" t-e-n-s-i-o-n! 😬'),
    splMCQ('Which is correct?', ['profesion', 'profession', 'proffession', 'profeshon'], 1, '"Profession" — p-r-o-f-e-s-s-i-o-n. Double s before "-ion"! 💼'),
    splMCQ('Find the correct spelling:', ['opreshun', 'oppresion', 'oppression', 'opression'], 2, '"Oppression" — o-p-p-r-e-s-s-i-o-n. Double p AND double s! 💪'),
    splMCQ('Which is correct?', ['expresion', 'expression', 'expreshon', 'exspression'], 1, '"Expression" — e-x-p-r-e-s-s-i-o-n. Double s before "-ion"! 😊'),
    splMCQ('Choose the correct spelling:', ['reel', 'real', 'reall', 'reeal'], 1, '"Real" — r-e-a-l. "Is this REAL?" Don\'t confuse with "reel" (a spool)! 🎞️'),
    splMCQ('Which is correct?', ['wholes', 'hole', 'whole', 'hoal'], 2, '"Whole" — w-h-o-l-e. Silent w! "The WHOLE class came." 📚'),
    splTyped('Type the correct spelling: a day that comes once a year to celebrate you!', 'birthday', '🎂', '"Birthday" — b-i-r-t-h-d-a-y. Birth + day joined together! 🎂'),
    splTyped('Type the correct spelling: things that belong to them (their/there/they\'re):', 'their', '🏠', '"Their" — t-h-e-i-r. It shows possession: THEIR bag. Has "heir" in it (someone who inherits)! 👑'),
    splMCQ('Which is correct?', ['intresting', 'interesting', 'intersting', 'intaresting'], 1, '"Interesting" — i-n-t-e-r-e-s-t-i-n-g. Don\'t drop the middle "e"! 🎯'),
    splMCQ('Choose the correct spelling:', ['diferent', 'different', 'differant', 'diffrent'], 1, '"Different" — d-i-f-f-e-r-e-n-t. Double f! 🔤'),
    splMCQ('Which is correct?', ['nessecary', 'necessary', 'necesary', 'neccesary'], 1, '"Necessary" — one c, two s: n-e-c-e-s-s-a-r-y. One Collar, two Socks! 🧦'),
    splMCQ('Find the correct spelling:', ['definately', 'definitly', 'definitely', 'defenitely'], 2, '"Definitely" — d-e-f-i-n-i-t-e-l-y. Contains "finite"! De-finite-ly. ✅'),
    splMCQ('Which is the odd one out (misspelled)?', ['possession', 'occasion', 'occurance', 'expression'], 2, '"Occurance" is wrong — it should be "occurrence" o-c-c-u-r-r-e-n-c-e, with double c and double r! 🔄'),
  ];
}

// ── Year 5 (Age 9–10) ───────────────────────────────────────
function splYear5() {
  return [
    // --- existing questions ---
    splMCQ('Which is correct?', ['accomodate', 'accommodate', 'acommodate', 'accommadate'], 1, '"Accommodate" — two c\'s AND two m\'s! Think: "ACCOMModate" = Double C, Double M! 🏨'),
    splMCQ('Choose the correct spelling:', ['enbarass', 'embarras', 'embarrass', 'embarass'], 2, '"Embarrass" — e-m-b-a-r-r-a-s-s. Double r AND double s! How embarrassing to spell it wrong! 😳'),
    splMCQ('Which is correct?', ['definately', 'definitely', 'definetly', 'defiantly'], 1, '"Definitely" — d-e-f-i-n-i-t-e-l-y. Contains "finite"! De-finite-ly. ✅'),
    splMCQ('Find the correct spelling:', ['rythm', 'rhthym', 'rhythm', 'rhytem'], 2, '"Rhythm" — r-h-y-t-h-m. No vowels except "y"! Try: Rhythm Helps Your Two Hips Move! 🎵'),
    splMCQ('Which is correct?', ['conscous', 'conshious', 'conscious', 'consious'], 2, '"Conscious" — c-o-n-s-c-i-o-u-s. The "sci" makes a /sh/ sound! 🧠'),
    splMCQ('Choose the correct spelling:', ['reccommend', 'recomend', 'recommend', 'recommand'], 2, '"Recommend" — one c, double m: r-e-c-o-m-m-e-n-d! 👍'),
    splMCQ('Which is correct?', ['enviroment', 'envirionment', 'environment', 'enviroment'], 2, '"Environment" — e-n-v-i-r-o-n-m-e-n-t. The "n" before "m" is often missed! 🌍'),
    splMCQ('Find the correct spelling:', ['goverment', 'government', 'governement', 'goverament'], 1, '"Government" — g-o-v-e-r-n-m-e-n-t. There\'s a silent "n" before the "m"! 🏛️'),
    splMCQ('Which is correct?', ['occurance', 'occurrence', 'occurence', 'ocurrence'], 1, '"Occurrence" — o-c-c-u-r-r-e-n-c-e. Double c AND double r! 🔄'),
    splMCQ('Choose the correct spelling:', ['mischievous', 'mischieous', 'mischevious', 'mischeivous'], 0, '"Mischievous" — m-i-s-c-h-i-e-v-o-u-s. Three syllables: mis-chie-vous! 😈'),
    splMCQ('Which is correct?', ['persuation', 'persuation', 'persuasion', 'perswasion'], 2, '"Persuasion" — p-e-r-s-u-a-s-i-o-n. The "sua" → "sion" is a tricky ending! 💬'),
    splMCQ('Find the correct spelling:', ['prononciaton', 'pronounciation', 'pronunciation', 'pronunsiation'], 2, '"Pronunciation" — no second "o"! pro-NUN-ci-a-tion, not pro-NOUN-ciation! 🗣️'),
    splMCQ('Which is correct?', ['exagerate', 'exaggerate', 'exaggerrate', 'exaggarate'], 1, '"Exaggerate" — e-x-a-g-g-e-r-a-t-e. Double "g"! 📢'),
    splMCQ('Choose the correct spelling:', ['noticeable', 'noticable', 'notcieable', 'noticeable'], 0, '"Noticeable" — keep the "e" from "notice" before adding "able"! 👁️'),
    splTyped('Type the correct spelling of: a 12-month period', 'calendar', '📅', '"Calendar" — c-a-l-e-n-d-a-r. Ends in "ar" not "er"! 📅'),
    // --- new questions ---
    splMCQ('Which is correct?', ['silouette', 'silhouette', 'silouhette', 'silhuette'], 1, '"Silhouette" — s-i-l-h-o-u-e-t-t-e. The "lh" and double t make this tricky! 🖼️'),
    splMCQ('Find the correct spelling:', ['aquire', 'aquire', 'acquire', 'acuire'], 2, '"Acquire" — a-c-q-u-i-r-e. The "cqu" combination is unusual! 🎯'),
    splMCQ('Which is correct?', ['buisness', 'business', 'bizness', 'bussiness'], 1, '"Business" — b-u-s-i-n-e-s-s. Contains "bus" and "iness"! Think: the BUS is busy! 🚌'),
    splMCQ('Choose the correct spelling:', ['goverment', 'government', 'governmant', 'govermnent'], 1, '"Government" — g-o-v-e-r-n-m-e-n-t. The silent n before m is key! 🏛️'),
    splMCQ('Which is correct?', ['litenment', 'enlightenment', 'inlightenment', 'enlightnment'], 1, '"Enlightenment" — en-lighten-ment. Contains "lighten"! 💡'),
    splMCQ('Find the correct spelling:', ['dissatisfied', 'dissatisifed', 'disatisfied', 'dissatisfyed'], 0, '"Dissatisfied" — d-i-s-s-a-t-i-s-f-i-e-d. Double s after "di"! 😤'),
    splMCQ('Which is correct?', ['independant', 'independant', 'independent', 'independant'], 2, '"Independent" — i-n-d-e-p-e-n-d-e-n-t. Ends in "-ent" not "-ant"! 🗽'),
    splMCQ('Choose the correct spelling:', ['excellant', 'excellent', 'excelent', 'excellant'], 1, '"Excellent" — e-x-c-e-l-l-e-n-t. Double l AND ends in "-ent"! ⭐'),
    splMCQ('Which is correct?', ['relevent', 'rellevant', 'relevant', 'relevint'], 2, '"Relevant" — r-e-l-e-v-a-n-t. Ends in "-ant" not "-ent"! 🎯'),
    splMCQ('Find the correct spelling:', ['intresting', 'interesting', 'interresting', 'interessting'], 1, '"Interesting" — i-n-t-e-r-e-s-t-i-n-g. Don\'t drop the middle "e"! 🧐'),
    splMCQ('Which is correct?', ['apparant', 'apperently', 'apparently', 'apparentley'], 2, '"Apparently" — a-p-p-a-r-e-n-t-l-y. Double p! 🤔'),
    splMCQ('Choose the correct spelling:', ['ocassional', 'occasional', 'occassional', 'ocasional'], 1, '"Occasional" — o-c-c-a-s-i-o-n-a-l. Double c, single s! 🔄'),
    splMCQ('Which is correct?', ['suceed', 'succeed', 'succede', 'sucede'], 1, '"Succeed" — s-u-c-c-e-e-d. Double c AND double e! 🏆'),
    splMCQ('Find the correct spelling:', ['proffesor', 'proffessor', 'professor', 'professer'], 2, '"Professor" — p-r-o-f-e-s-s-o-r. One f, double s! 👨‍🎓'),
    splMCQ('Which is correct?', ['necesity', 'neccesity', 'necessity', 'nessecity'], 2, '"Necessity" — n-e-c-e-s-s-i-t-y. One c, two s! Like "necessary"! 🔑'),
    splMCQ('Choose the correct spelling:', ['abreviation', 'abbreveation', 'abbreviation', 'abbreviasion'], 2, '"Abbreviation" — a-b-b-r-e-v-i-a-t-i-o-n. Double b! 📝'),
    splMCQ('Which is the odd one out (misspelled)?', ['rhythm', 'conscious', 'embarass', 'mischievous'], 2, '"Embarass" is wrong — it should be "embarrass" with double r AND double s! 😳'),
    splMCQ('Find the correct spelling:', ['experiance', 'experiense', 'experience', 'experince'], 2, '"Experience" — e-x-p-e-r-i-e-n-c-e. Ends in "-ence" not "-ance"! 🌟'),
    splMCQ('Which is correct?', ['sincearly', 'sincerely', 'sinserley', 'sincerley'], 1, '"Sincerely" — s-i-n-c-e-r-e-l-y. "sincere" + "ly" keeping the e! 💌'),
    splMCQ('Choose the correct spelling:', ['immedietly', 'imediately', 'immediately', 'immediatley'], 2, '"Immediately" — i-m-m-e-d-i-a-t-e-l-y. Double m! 🏃'),
    splMCQ('Which is correct?', ['acheivment', 'achievment', 'achievement', 'achivement'], 2, '"Achievement" — a-c-h-i-e-v-e-m-e-n-t. "achieve" + "ment" keeping the e! 🏅'),
    splTyped('Type the correct spelling: a feeling of great shame or self-consciousness:', 'embarrassment', '😳', '"Embarrassment" — double r AND double s! Embarrass + ment. How embarrassing to forget! 😳'),
    splTyped('Type the correct spelling: to take in or make room for:', 'accommodate', '🏨', '"Accommodate" — a-c-c-o-m-m-o-d-a-t-e. Double c AND double m! 🏨'),
    splMCQ('Which is the odd one out (misspelled)?', ['government', 'environment', 'accomodate', 'occurrence'], 2, '"Accomodate" is wrong — it needs double c AND double m: accommodate! 🏨'),
    splMCQ('Which is correct?', ['conficent', 'confident', 'confidant', 'confiddent'], 1, '"Confident" — c-o-n-f-i-d-e-n-t. Ends in "-ent"! 💪'),
    splMCQ('Find the correct spelling:', ['persaverance', 'perserverance', 'perseverance', 'perseverence'], 2, '"Perseverance" — p-e-r-s-e-v-e-r-a-n-c-e. Ends in "-ance"! Keep going! 💪'),
    splMCQ('Which is correct?', ['truely', 'truly', 'trely', 'truley'], 1, '"Truly" — t-r-u-l-y. Drop the "e" from "true" before adding "ly"! ✔️'),
    splMCQ('Choose the correct spelling:', ['arguement', 'argument', 'arguemant', 'argumant'], 1, '"Argument" — a-r-g-u-m-e-n-t. Drop the "e" from "argue" before adding "-ment"! 🗣️'),
    splMCQ('Which is the odd one out (misspelled)?', ['definitely', 'recommend', 'occurance', 'accommodate'], 2, '"Occurance" is wrong — "occurrence" needs double c and double r! 🔄'),
  ];
}

// ── Year 6 (Age 10–11) ──────────────────────────────────────
function splYear6() {
  return [
    // --- existing questions ---
    splMCQ('Which is correct?', ['dissastrous', 'disatstrous', 'disastrous', 'disasterous'], 2, '"Disastrous" — d-i-s-a-s-t-r-o-u-s. No "e"! Disaster → disastrous (drop the e)! 🌪️'),
    splMCQ('Choose the correct spelling:', ['burocracy', 'beaurocracy', 'bureaucracy', 'bureaucrasy'], 2, '"Bureaucracy" — b-u-r-e-a-u-c-r-a-c-y. "bur-eau" — French-origin word! 🏛️'),
    splMCQ('Which is correct?', ['conscientious', 'consciencious', 'consceintious', 'consientious'], 0, '"Conscientious" — c-o-n-s-c-i-e-n-t-i-o-u-s. Contains "science"! 🧪'),
    splMCQ('Find the correct spelling:', ['supercede', 'supersede', 'suparcede', 'superseed'], 1, '"Supersede" — s-u-p-e-r-s-e-d-e. Not "supercede"! From Latin "sedere" (to sit)! 👑'),
    splMCQ('Which is correct?', ['existance', 'existense', 'existence', 'existanse'], 2, '"Existence" — e-x-i-s-t-e-n-c-e. Ends in "-ence" not "-ance"! 🌌'),
    splMCQ('Choose the correct spelling:', ['heirarchy', 'hierachy', 'hierarchy', 'hierarhy'], 2, '"Hierarchy" — h-i-e-r-a-r-c-h-y. "hier" = holy (Latin). Two "r"s! 🏆'),
    splMCQ('Which is correct?', ['liaision', 'liasion', 'laison', 'liaison'], 3, '"Liaison" — l-i-a-i-s-o-n. Two "i"s! A liaison connects people. 🔗'),
    splMCQ('Find the correct spelling:', ['millenium', 'millennium', 'milennium', 'millennuim'], 1, '"Millennium" — m-i-l-l-e-n-n-i-u-m. Double l AND double n! 🎆'),
    splMCQ('Which is correct?', ['ocassionally', 'occasionally', 'ocassionaly', 'occassionally'], 1, '"Occasionally" — o-c-c-a-s-i-o-n-a-l-l-y. Double c, single s, double l at end! 🔄'),
    splMCQ('Choose the correct spelling:', ['paradox', 'parradox', 'paradocs', 'para-dox'], 0, '"Paradox" — p-a-r-a-d-o-x. A paradox seems contradictory but may be true! 🤔'),
    splMCQ('Which is correct?', ['mnemonic', 'neumonic', 'nnemonic', 'mnemonick'], 0, '"Mnemonic" — m-n-e-m-o-n-i-c. The "mn" at the start is silent! 🧠'),
    splMCQ('Find the correct spelling:', ['psycology', 'psychology', 'psychollogy', 'psycologie'], 1, '"Psychology" — p-s-y-c-h-o-l-o-g-y. The "ps" at the start is silent! 🧠'),
    splMCQ('Which is correct?', ['questionnaire', 'questionnare', 'questionnarie', 'quessionnaire'], 0, '"Questionnaire" — q-u-e-s-t-i-o-n-n-a-i-r-e. Double "n" and ends in "aire"! 📋'),
    splMCQ('Choose the correct spelling:', ['charachteristic', 'characteristic', 'charicteristic', 'characterristic'], 1, '"Characteristic" — c-h-a-r-a-c-t-e-r-i-s-t-i-c. Contains "character"! 🎭'),
    splTyped('Type the correct spelling: the quality of being very skilled or experienced', 'expertise', '🏆', '"Expertise" — e-x-p-e-r-t-i-s-e. From "expert" + ise! 🎯'),
    // --- new questions ---
    splMCQ('Which is correct?', ['conciencious', 'conscientious', 'conscientous', 'conscentious'], 1, '"Conscientious" — c-o-n-s-c-i-e-n-t-i-o-u-s. Remember it contains the word "science"! 🔬'),
    splMCQ('Find the correct spelling:', ['colloseum', 'colosseum', 'colosseum', 'coliseum'], 2, '"Colosseum" — c-o-l-o-s-s-e-u-m. Double s! The famous Roman amphitheatre! 🏟️'),
    splMCQ('Which is correct?', ['ephemoral', 'ephemerral', 'ephemeral', 'ephemeraal'], 2, '"Ephemeral" — e-p-h-e-m-e-r-a-l. From Greek: lasting only a short time! 🌸'),
    splMCQ('Choose the correct spelling:', ['eloquint', 'eloguent', 'eloquent', 'eloquint'], 2, '"Eloquent" — e-l-o-q-u-e-n-t. Ends in "-ent"! Eloquent speakers use language beautifully! 🎤'),
    splMCQ('Which is correct?', ['ambigueous', 'ambiguous', 'ambiguious', 'ambigious'], 1, '"Ambiguous" — a-m-b-i-g-u-o-u-s. Ends in "-uous"! Something ambiguous has two meanings! 🔀'),
    splMCQ('Find the correct spelling:', ['contemporery', 'contemporary', 'contemporaty', 'contemporairy'], 1, '"Contemporary" — c-o-n-t-e-m-p-o-r-a-r-y. Ends in "-ary"! 🕰️'),
    splMCQ('Which is correct?', ['benevolant', 'benevelant', 'benevolent', 'bennevolent'], 2, '"Benevolent" — b-e-n-e-v-o-l-e-n-t. Ends in "-ent"! Benevolent means kind and generous! 💛'),
    splMCQ('Choose the correct spelling:', ['nonchalent', 'nonchalant', 'nonchalannt', 'nonchallant'], 1, '"Nonchalant" — n-o-n-c-h-a-l-a-n-t. French origin, ends in "-ant"! 😎'),
    splMCQ('Which is correct?', ['irrelevent', 'irelevent', 'irrelevant', 'irrelavent'], 2, '"Irrelevant" — i-r-r-e-l-e-v-a-n-t. Double r and ends in "-ant"! 🙅'),
    splMCQ('Find the correct spelling:', ['indesisive', 'indecisive', 'indecissive', 'indeciseve'], 1, '"Indecisive" — i-n-d-e-c-i-s-i-v-e. In + decisive. Can\'t make up their mind! 🤷'),
    splMCQ('Which is correct?', ['unprecedented', 'unprecidented', 'unpreccedented', 'unpresidented'], 0, '"Unprecedented" — u-n-p-r-e-c-e-d-e-n-t-e-d. Un + preceded + ent. Never happened before! 🌟'),
    splMCQ('Choose the correct spelling:', ['mantainance', 'maintanance', 'maintenance', 'maintainence'], 2, '"Maintenance" — m-a-i-n-t-e-n-a-n-c-e. Maintain → maintenance. Ends in "-ance"! 🔧'),
    splMCQ('Which is correct?', ['rennaisance', 'renaissance', 'renaisance', 'rennaisance'], 1, '"Renaissance" — r-e-n-a-i-s-s-a-n-c-e. French word meaning rebirth. Double s! 🎨'),
    splMCQ('Find the correct spelling:', ['garentee', 'guarentee', 'guarantee', 'guaranttee'], 2, '"Guarantee" — g-u-a-r-a-n-t-e-e. "guar" like guard, then "-antee"! ✅'),
    splMCQ('Which is correct?', ['equivelant', 'equivalant', 'equivalent', 'equivallent'], 2, '"Equivalent" — e-q-u-i-v-a-l-e-n-t. Ends in "-ent" not "-ant"! ⚖️'),
    splMCQ('Choose the correct spelling:', ['omnisciant', 'omniscient', 'omnniscient', 'omnisient'], 1, '"Omniscient" — o-m-n-i-s-c-i-e-n-t. Omni (all) + scient (knowing). Contains "science"! 🔭'),
    splMCQ('Which is the odd one out (misspelled)?', ['bureaucracy', 'millennium', 'questionnaire', 'psycology'], 3, '"Psycology" is wrong — "psychology" starts with the silent "ps": p-s-y-c-h-o-l-o-g-y! 🧠'),
    splMCQ('Find the correct spelling:', ['philantropic', 'philanthropic', 'philantrophic', 'philantroppic'], 1, '"Philanthropic" — p-h-i-l-a-n-t-h-r-o-p-i-c. "phil" (love) + "anthrop" (human)! 💝'),
    splMCQ('Which is correct?', ['sophistocated', 'sofisticated', 'sophisticated', 'sophistcated'], 2, '"Sophisticated" — s-o-p-h-i-s-t-i-c-a-t-e-d. "soph" means wise in Greek! 🎩'),
    splMCQ('Choose the correct spelling:', ['priviledge', 'privilege', 'privelege', 'privledge'], 1, '"Privilege" — p-r-i-v-i-l-e-g-e. Not "privelege" — the order is priv-i-l-e-g-e! 🌟'),
    splMCQ('Which is correct?', ['assasination', 'assassination', 'assassignation', 'asassination'], 1, '"Assassination" — a-s-s-a-s-s-i-n-a-t-i-o-n. Double s TWICE! An "ass" sits in the middle! 🤫'),
    splMCQ('Find the correct spelling:', ['retorical', 'rhetoricle', 'rhetorical', 'rethorical'], 2, '"Rhetorical" — r-h-e-t-o-r-i-c-a-l. The "rh" at the start (as in rhyme, rhythm)! 🗣️'),
    splMCQ('Which is the odd one out (misspelled)?', ['liaison', 'hierarchy', 'milennium', 'mnemonic'], 2, '"Milennium" is wrong — "millennium" has double l AND double n: m-i-l-l-e-n-n-i-u-m! 🎆'),
    splMCQ('Choose the correct spelling:', ['catastrophie', 'catastrofy', 'catastrophe', 'catrastophe'], 2, '"Catastrophe" — c-a-t-a-s-t-r-o-p-h-e. Ends in "-phe" from Greek! 💥'),
    splMCQ('Which is correct?', ['paralelism', 'parallelism', 'parallelizm', 'paralellism'], 1, '"Parallelism" — p-a-r-a-l-l-e-l-i-s-m. Double l twice! Parallel lines never meet! 📐'),
    splTyped('Type the correct spelling: the study of the mind and behaviour:', 'psychology', '🧠', '"Psychology" — p-s-y-c-h-o-l-o-g-y. The "ps" at the start is completely silent! 🧠'),
    splTyped('Type the correct spelling: a device or trick to help you remember something:', 'mnemonic', '🧠', '"Mnemonic" — m-n-e-m-o-n-i-c. The "mn" at the start is silent — ironically a tricky word to spell! 🧠'),
    splMCQ('Which is correct?', ['intelectual', 'intellectual', 'intelectuall', 'intellecual'], 1, '"Intellectual" — i-n-t-e-l-l-e-c-t-u-a-l. Double l! 🧠'),
    splMCQ('Find the correct spelling:', ['metaphoricle', 'metaphoricel', 'metaphorical', 'metaphorcial'], 2, '"Metaphorical" — m-e-t-a-p-h-o-r-i-c-a-l. Contains "metaphor" + "-ical"! 📖'),
  ];
}
