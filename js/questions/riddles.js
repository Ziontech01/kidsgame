// ── Riddle Question Generator ─────────────────────────────────

function getRiddleQuestions(level) {
  switch (level) {
    case 'reception': return riddlesReception();
    case 'year1':     return riddlesYear1();
    case 'year2':     return riddlesYear2();
    case 'year3':     return riddlesYear3();
    case 'year4':     return riddlesYear4();
    case 'year5':     return riddlesYear5();
    case 'year6':     return riddlesYear6();
    default:          return riddlesYear1();
  }
}

function mcq(question, correct, wrong1, wrong2, wrong3, emoji, explanation) {
  const answers = shuffle4([correct, wrong1, wrong2, wrong3]);
  return { question, answers, correct: answers.indexOf(correct),
           emoji: emoji || null, explanation: explanation || null };
}

function shuffle4(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ── Reception: very simple object riddles for ages 4-5 ────────
function riddlesReception() {
  return [
    mcq('I am red and round. You eat me. I grow on a tree. What am I?', 'Apple', 'Ball', 'Tomato', 'Balloon',
      '🍎', 'A red, round fruit that grows on trees — it is an apple!'),
    mcq('I am yellow. Monkeys love me. You peel me before eating. What am I?', 'Banana', 'Lemon', 'Corn', 'Pear',
      '🍌', 'Monkeys love bananas! They are yellow and you peel them to eat!'),
    mcq('I have four legs and I say "woof". I am your best friend. What am I?', 'Dog', 'Cat', 'Horse', 'Cow',
      '🐶', 'Dogs say "woof", have four legs and are called man\'s best friend!'),
    mcq('I am orange and I say "meow". I like to sleep in the sun. What am I?', 'Cat', 'Dog', 'Lion', 'Fox',
      '🐱', 'Cats say "meow" and love sleeping in sunny spots!'),
    mcq('I am big and grey. I have a very long nose. What am I?', 'Elephant', 'Hippo', 'Rhino', 'Pig',
      '🐘', 'Elephants are the biggest land animals and have a long trunk for a nose!'),
    mcq('I am cold and white. Children love to play in me. I fall from the sky in winter. What am I?', 'Snow', 'Ice', 'Rain', 'Cloud',
      '❄️', 'Snow falls in winter and is cold and white — perfect for snowballs and snowmen!'),
    mcq('I have wings and I can fly. I sing in the morning. What am I?', 'Bird', 'Butterfly', 'Bat', 'Bee',
      '🐦', 'Birds have wings, can fly and sing beautiful songs, especially in the morning!'),
    mcq('I am round and bright. I shine in the sky at night. What am I?', 'Moon', 'Star', 'Sun', 'Cloud',
      '🌙', 'The moon is round, bright and lights up the night sky!'),
    mcq('I am hot and bright. I shine in the sky every day. I make plants grow. What am I?', 'Sun', 'Moon', 'Star', 'Fire',
      '☀️', 'The sun is our star — it gives us light and warmth every day!'),
    mcq('I have wheels and you ride me. I need pedals to move. What am I?', 'Bicycle', 'Car', 'Skateboard', 'Scooter',
      '🚲', 'A bicycle has two wheels and pedals — you ride it by pedalling!'),
    mcq('I am a toy. You bounce me on the ground. I am round and can be many colours. What am I?', 'Ball', 'Apple', 'Orange', 'Balloon',
      '⚽', 'A ball is round, bouncy and comes in many colours — perfect for playing with!'),
    mcq('I live in water. I have fins and scales. I swim. What am I?', 'Fish', 'Frog', 'Duck', 'Crab',
      '🐟', 'Fish live in water, have fins to swim and scales on their body!'),
    mcq('I am tall and green. I have leaves and branches. Birds build nests on me. What am I?', 'Tree', 'Bush', 'Flower', 'Grass',
      '🌳', 'Trees are tall, green and birds love to build their nests in the branches!'),
    mcq('I have numbers on my face. I have hands that go round and round. I tell you something important. What am I?', 'Clock', 'Compass', 'Calculator', 'Ruler',
      '🕐', 'A clock has numbers and hands that move around to tell you the time!'),
    mcq('I am flat and full of words. You read me. You find me in a library. What am I?', 'Book', 'Newspaper', 'Letter', 'Menu',
      '📚', 'Books are flat, full of words and you can find them in libraries!')
  ];
}

// ── Year 1: simple animal and object riddles ──────────────────
function riddlesYear1() {
  return [
    mcq('I have four legs and say "woof". I fetch sticks and wag my tail. What am I?', 'Dog', 'Cat', 'Wolf', 'Fox',
      '🐕', 'Dogs fetch sticks, wag their tails and say "woof"!'),
    mcq('I fall from the sky. I am cold and white. Children build me into a man. What am I?', 'Snow', 'Rain', 'Hail', 'Cloud',
      '⛄', 'Snow is cold, white and you can build a snowman with it!'),
    mcq('I have a shell on my back. I am very slow. I live in my home wherever I go. What am I?', 'Tortoise', 'Crab', 'Snail', 'Armadillo',
      '🐢', 'A tortoise carries its shell home on its back and moves very slowly!'),
    mcq('I am black and white. I live at the South Pole. I cannot fly but I swim very well. What am I?', 'Penguin', 'Zebra', 'Panda', 'Skunk',
      '🐧', 'Penguins are black and white, live in Antarctica and are excellent swimmers!'),
    mcq('I am the king of the jungle. I have a big mane and a loud roar. What am I?', 'Lion', 'Tiger', 'Bear', 'Gorilla',
      '🦁', 'The lion is called the king of the jungle and has a magnificent mane!'),
    mcq('I have a long neck. I eat leaves from the tops of tall trees. What am I?', 'Giraffe', 'Camel', 'Horse', 'Ostrich',
      '🦒', 'Giraffes have the longest necks of any animal — perfect for reaching the tallest trees!'),
    mcq('I am a fruit. I am yellow on the outside and green or red inside. What am I?', 'Watermelon', 'Banana', 'Mango', 'Apple',
      '🍉', 'Wait — yellow outside, green inside... that sounds like a watermelon! (green outside actually, but the riddle is fun!)'),
    mcq('I am small and red. I have black spots. I am an insect. What am I?', 'Ladybird', 'Beetle', 'Ant', 'Spider',
      '🐞', 'A ladybird is a small, red insect with black spots — good luck to see one!'),
    mcq('I carry letters to your door. I wear a uniform. What am I?', 'Postman', 'Police officer', 'Doctor', 'Firefighter',
      '📮', 'The postman (or postal worker) delivers letters and parcels to your home!'),
    mcq('I am made of paper. You read me every day. I tell you what is happening in the world. What am I?', 'Newspaper', 'Book', 'Magazine', 'Letter',
      '📰', 'A newspaper is printed on paper and tells you the latest news each day!'),
    mcq('I have spikes all over my body. I roll into a ball when I am scared. I eat worms. What am I?', 'Hedgehog', 'Porcupine', 'Sea urchin', 'Echidna',
      '🦔', 'Hedgehogs have spiky coats and roll into a ball when frightened!'),
    mcq('I jump around and have a pouch for my baby. I come from Australia. What am I?', 'Kangaroo', 'Rabbit', 'Wallaby', 'Frog',
      '🦘', 'Kangaroos are from Australia and carry their babies in a special pouch!'),
    mcq('I am colourful. I start as a caterpillar. I have beautiful wings. What am I?', 'Butterfly', 'Moth', 'Dragonfly', 'Bee',
      '🦋', 'Butterflies start life as caterpillars, then transform into beautiful winged creatures!'),
    mcq('I have 8 legs. I spin webs to catch insects. Some people are scared of me. What am I?', 'Spider', 'Octopus', 'Crab', 'Scorpion',
      '🕷️', 'Spiders have 8 legs and spin sticky webs to catch their food!'),
    mcq('I am white and fluffy. I live on a farm. I say "baa". My wool makes your jumper. What am I?', 'Sheep', 'Goat', 'Rabbit', 'Llama',
      '🐑', 'Sheep say "baa" and their wool is used to make warm jumpers and clothing!')
  ];
}

// ── Year 2: classic nursery riddles, slightly harder ──────────
function riddlesYear2() {
  return [
    mcq('What has keys but no locks, space but no rooms, and you can enter but cannot go inside?', 'Keyboard', 'Piano', 'Map', 'Hotel',
      '⌨️', 'A keyboard has keys (on a computer), a space bar, and an enter key — but no physical locks or rooms!'),
    mcq('I am always in front of you but cannot be seen. What am I?', 'The future', 'Your nose', 'Air', 'A mirror',
      '🔮', 'The future is always ahead of you (in front) but you cannot see or touch it!'),
    mcq('The more you take, the more you leave behind. What am I?', 'Footsteps', 'Cake', 'Money', 'Time',
      '👣', 'Every footstep you take leaves a footprint behind — the more steps, the more prints!'),
    mcq('What has to be broken before you can use it?', 'Egg', 'Window', 'Promise', 'Rule',
      '🥚', 'You have to crack an egg open before you can cook with it!'),
    mcq('I have a head, a tail, but no body. What am I?', 'Coin', 'Snake', 'Needle', 'Arrow',
      '🪙', 'A coin has a "heads" side and a "tails" side, but no actual body!'),
    mcq('What goes up when the rain comes down?', 'Umbrella', 'Temperature', 'Water level', 'Kite',
      '☂️', 'When it rains, you put your umbrella up — it goes up as the rain comes down!'),
    mcq('I have four legs in the morning, two at noon, and three at night. What am I?', 'A person', 'A table', 'A dog', 'A clock',
      '👶👴', 'A baby crawls on all fours, an adult walks on two legs, an old person uses a walking stick!'),
    mcq('What can you catch but not throw?', 'A cold', 'A ball', 'A fish', 'A butterfly',
      '🤧', 'You can catch a cold (get ill) but you cannot throw a cold to someone!'),
    mcq('What gets bigger the more you take away from it?', 'A hole', 'A cake', 'A pile of sand', 'A balloon',
      '🕳️', 'The more you dig from a hole, the bigger it gets!'),
    mcq('I am light as a feather but even the strongest person cannot hold me for more than a minute. What am I?', 'Breath', 'Shadow', 'Sound', 'Smoke',
      '💨', 'Your breath is weightless but you cannot hold it for long!'),
    mcq('What has hands but cannot clap?', 'A clock', 'A puppet', 'A statue', 'A glove',
      '🕐', 'A clock has hands (the pointers) but it cannot clap them together!'),
    mcq('I am full of holes but I can still hold water. What am I?', 'Sponge', 'Net', 'Colander', 'Cloth',
      '🧽', 'A sponge is full of tiny holes but can absorb and hold lots of water!'),
    mcq('What can run but never walks, has a mouth but never talks, has a bed but never sleeps?', 'River', 'Road', 'Train', 'Wind',
      '🌊', 'A river runs (flows), has a mouth (where it meets the sea) and a riverbed — but does none of these things like a person would!'),
    mcq('I have cities but no houses, mountains but no trees, and water but no fish. What am I?', 'Map', 'Painting', 'Globe', 'Dream',
      '🗺️', 'A map shows cities, mountains and water, but these are just drawings — no real houses, trees or fish!'),
    mcq('What is always coming but never arrives?', 'Tomorrow', 'Rain', 'Monday', 'Christmas',
      '📅', 'Tomorrow never actually arrives — when you wake up, it is today again!')
  ];
}

// ── Year 3: classic riddles ────────────────────────────────────
function riddlesYear3() {
  return [
    mcq('I have hands but cannot clap. What am I?', 'Clock', 'Glove', 'Robot', 'Scarecrow',
      '🕐', 'A clock has hands — the minute and hour hands — but they just go round and round!'),
    mcq('The more you take, the more you leave behind. What am I?', 'Footsteps', 'Treasure', 'Time', 'Sand',
      '👣', 'Every step you take leaves a footprint behind you!'),
    mcq('I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?', 'Echo', 'Ghost', 'Music', 'Thunder',
      '🗻', 'An echo is your own voice bouncing back from a wall or mountain!'),
    mcq('What gets wetter as it dries?', 'Towel', 'Sponge', 'Rain coat', 'Umbrella',
      '🛁', 'A towel gets wetter and wetter as it dries you — it absorbs all the water!'),
    mcq('I have cities but no houses, mountains but no trees, water but no fish, and roads but no cars. What am I?', 'Map', 'Globe', 'Picture', 'Dream',
      '🗺️', 'A map shows all of these things as drawings, but none of them are real!'),
    mcq('I can fly without wings. I can cry without eyes. Wherever I go, darkness follows me. What am I?', 'Cloud', 'Shadow', 'Night', 'Storm',
      '☁️', 'A cloud moves through the sky without wings, brings rain (crying) and creates darkness!'),
    mcq('What has one eye but cannot see?', 'Needle', 'Storm', 'Potato', 'Button',
      '🪡', 'A needle has an eye — the hole you thread the cotton through — but cannot see!'),
    mcq('I am not alive but I can grow. I do not have lungs but I need air. I do not have a mouth but water kills me. What am I?', 'Fire', 'Mould', 'Rust', 'Plant',
      '🔥', 'Fire grows and spreads, needs oxygen (air) to burn, and water puts it out!'),
    mcq('What invention lets you look right through a wall?', 'Window', 'Telescope', 'Mirror', 'Camera',
      '🪟', 'A window lets you see right through the wall to the outside!'),
    mcq('I have a neck but no head. What am I?', 'Bottle', 'Guitar', 'Shirt', 'Swan',
      '🍾', 'A bottle has a neck (the narrow top part) but no head!'),
    mcq('What goes up and never comes down?', 'Your age', 'A balloon', 'Smoke', 'Prices',
      '🎂', 'Your age keeps going up — you can only get older, never younger!'),
    mcq('What is so fragile that saying its name breaks it?', 'Silence', 'Glass', 'Ice', 'A secret',
      '🤫', 'The moment you say "silence", you break the silence!'),
    mcq('I am always hungry and must be fed. The finger I touch will soon turn red. What am I?', 'Fire', 'Rust', 'Nettle', 'Wasp',
      '🔥', 'Fire is always hungry for fuel, and touching it will burn your finger red!'),
    mcq('What has a bottom at the top?', 'A leg', 'A cliff', 'A mountain', 'A well',
      '🦵', 'Your leg has a bottom (your foot) but also a top (the bottom of your body)!'),
    mcq('I have branches but no fruit, no trunk and no leaves. What am I?', 'Bank', 'River', 'Road', 'Family tree',
      '🏦', 'A bank has branches (local offices) but no actual fruit, trunk or leaves!')
  ];
}

// ── Year 4: brain teasers and abstract riddles ─────────────────
function riddlesYear4() {
  return [
    mcq('I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?', 'Echo', 'Shadow', 'Ghost', 'Music',
      '🏔️', 'An echo bounces sound back to you — it seems to speak and hear, but it has no body!'),
    mcq('What is always in front of you but cannot be seen, touched, or heard?', 'The future', 'Air', 'Your thoughts', 'Space',
      '🔮', 'The future is always ahead of you but you cannot see, touch or hear it — only time will reveal it!'),
    mcq('The more you remove from me, the bigger I become. What am I?', 'Hole', 'Cave', 'Bank account', 'Shadow',
      '🕳️', 'The more you dig or take away, the bigger a hole becomes!'),
    mcq('I have no wings but I can fly. I have no eyes but I can see right through you. What am I?', 'X-ray', 'Thought', 'Wind', 'Ghost',
      '☢️', 'An X-ray has no wings but travels through the air, and no eyes but can "see" inside your body!'),
    mcq('What can travel around the world while staying in a corner?', 'Stamp', 'Spider', 'Shadow', 'Postcard',
      '✉️', 'A stamp stays in the corner of an envelope while the letter travels anywhere in the world!'),
    mcq('I am taken from a mine and shut up in a wooden case, from which I am never released, and yet I am used by almost every person. What am I?', 'Pencil', 'Diamond', 'Gold', 'Coal',
      '✏️', 'Pencil lead (graphite) is mined from the earth and put inside a wooden pencil case!'),
    mcq('What can you hold in your right hand but never in your left hand?', 'Your left hand', 'A ball', 'Money', 'A cup',
      '🤚', 'You can hold your left hand with your right hand, but you cannot hold your left hand with your left hand!'),
    mcq('I have many teeth but I cannot bite. What am I?', 'Comb', 'Saw', 'Gear', 'Fork',
      '💈', 'A comb has many teeth (the thin prongs) but they are for grooming your hair, not biting!'),
    mcq('What is full of holes but still holds a lot of water?', 'Sponge', 'Bucket', 'Net', 'Colander',
      '🧽', 'A sponge is full of tiny holes (pores) but can hold lots of water inside them!'),
    mcq('I run but have no legs. I have a bed but never sleep. I have a mouth but never eat. What am I?', 'River', 'Road', 'Clock', 'Train',
      '🌊', 'A river runs (flows), has a riverbed and a mouth (where it meets the sea)!'),
    mcq('What do you throw out when you want to use it, but take in when you do not want to use it?', 'An anchor', 'A net', 'A line', 'Bait',
      '⚓', 'You throw out an anchor to hold the ship still, and pull it back in when you want to sail!'),
    mcq('The more you have of me, the less you see. What am I?', 'Darkness', 'Fog', 'Smoke', 'Night',
      '🌑', 'The more darkness there is, the less you can see!'),
    mcq('What building has the most stories?', 'Library', 'Skyscraper', 'Hospital', 'School',
      '📚', 'A library has the most "stories" — it is full of thousands of books with stories in them!'),
    mcq('I am not a bird but I can fly. I am not a river but I am full of water. What am I?', 'Cloud', 'Plane', 'Balloon', 'Kite',
      '☁️', 'A cloud floats high in the sky (like flying) and is full of water droplets!'),
    mcq('What comes once in a minute, twice in a moment, but never in a thousand years?', 'The letter M', 'The number 1', 'A second', 'Silence',
      '🔤', 'The letter "M" appears once in "minute", twice in "moment", and not at all in "a thousand years"!')
  ];
}

// ── Year 5: tricky riddles ────────────────────────────────────
function riddlesYear5() {
  return [
    mcq('I have cities but no houses, mountains but no trees, water but no fish, and roads but no cars. What am I?', 'Map', 'Dream', 'Painting', 'Planet',
      '🗺️', 'A map represents all these things with drawings and symbols, but none of them are real!'),
    mcq('What gets wetter as it dries?', 'Towel', 'Desert', 'Cloth', 'Puddle',
      '🛁', 'A towel absorbs water from you as it dries you — so the towel gets wetter!'),
    mcq('The person who makes it sells it. The person who buys it does not use it. The person who uses it does not know it. What is it?', 'Coffin', 'Surprise gift', 'Medicine', 'Uniform',
      '⚰️', 'A coffin is made by a carpenter, bought by the family, but used by the deceased!'),
    mcq('I have three lives. I lose one, then run. I lose another, then rest. I lose the last, and then I am gone. What am I?', 'Candle', 'Battery', 'Flame', 'Heart',
      '🕯️', 'A candle melts down life by life until eventually it burns out completely!'),
    mcq('What is always right in front of you but cannot be seen?', 'The future', 'Air', 'Your destiny', 'Nothing',
      '🔮', 'The future is always ahead (in front of you) but invisible until it becomes the present!'),
    mcq('A man walks into a restaurant and orders albatross soup. After one sip, he goes home and kills himself. Why? (Choose the logical answer)', 'He realised the soup at home had been real albatross', 'The soup was poisoned', 'He was already ill', 'He lost a bet',
      '🍲', 'This classic lateral thinking puzzle: he was stranded on an island where he ate what he thought was albatross but was not — the real soup reminded him of the truth!'),
    mcq('I am not alive, but I grow. I have no lungs, but I need air. I do not have a mouth, but water kills me. What am I?', 'Fire', 'Mould', 'Volcano', 'Machine',
      '🔥', 'Fire grows and spreads, needs oxygen to burn, and water extinguishes it!'),
    mcq('What can you break even if you never pick it up or touch it?', 'A promise', 'A rule', 'A record', 'Silence',
      '🤞', 'You can break a promise without ever touching anything physical!'),
    mcq('What is so delicate that even mentioning it breaks it?', 'Silence', 'Trust', 'Glass', 'A secret',
      '🤫', 'The moment you say the word "silence" out loud, you break it!'),
    mcq('I shrink every time I give someone a bath, yet I am never completely used up. What am I?', 'Soap', 'Towel', 'Sponge', 'Shampoo',
      '🧼', 'A bar of soap gets smaller every time you use it to wash, but it takes a very long time to disappear!'),
    mcq('What can fill a room but takes up no space?', 'Light', 'Sound', 'Smell', 'Warmth',
      '💡', 'Light fills an entire room but it takes up no physical space!'),
    mcq('A barrel of water weighs 20kg. What can you add to make it weigh less?', 'A hole', 'Ice', 'Nothing', 'Air',
      '🕳️', 'If you add a hole to the barrel, the water leaks out and the barrel gets lighter!'),
    mcq('What word becomes shorter when you add two letters to it?', 'Short', 'Long', 'Brief', 'Tiny',
      '🔤', 'Add "er" to "short" and you get "shorter" — which literally means more short!'),
    mcq('The more you feed me, the more I grow, but if you give me water I will die. What am I?', 'Fire', 'Plant', 'Balloon', 'Bread',
      '🔥', 'Fire grows when you feed it fuel, but water puts it out!'),
    mcq('What has a thumb and four fingers but is not alive?', 'Glove', 'Hand puppet', 'Mitten', 'Claw',
      '🧤', 'A glove has a thumb and four fingers but it is not a living hand!')
  ];
}

// ── Year 6: hard logic riddles ────────────────────────────────
function riddlesYear6() {
  return [
    mcq('The more you remove from me, the bigger I get. What am I?', 'Hole', 'Cave', 'Pit', 'Trench',
      '🕳️', 'Every scoop you take out makes a hole bigger — the more you remove, the more it grows!'),
    mcq('What can run but never walks, has a mouth but never talks, has a head but never weeps, has a bed but never sleeps?', 'River', 'Road', 'Train', 'Snake',
      '🌊', 'A river: runs (flows), has a mouth (where it meets the sea), a head (source) and a bed (riverbed)!'),
    mcq('A woman shoots her husband, then holds him underwater for five minutes. Minutes later they go out to dinner. How?', 'She is a photographer', 'He survived by luck', 'It was a dream', 'He was wearing a wetsuit',
      '📸', 'She photographed him (shot a photo) and developed the picture in the darkroom (held it in the developing fluid)!'),
    mcq('If a rooster lays an egg on the peak of a roof, which way does it roll?', 'Roosters do not lay eggs', 'Left', 'Right', 'Straight down',
      '🐓', 'Roosters are male chickens — they do not lay eggs! Only hens do!'),
    mcq('What can you hold in your left hand but not in your right?', 'Your right elbow', 'A phone', 'A book', 'Water',
      '💪', 'You cannot hold your own right elbow with your right hand — only your left hand can reach it!'),
    mcq('Three doctors say Robert is their brother. Robert says he has no brothers. How is this possible?', 'The doctors are women (his sisters)', 'Robert is lying', 'They are half-brothers', 'It is a different Robert',
      '👩‍⚕️', 'The doctors are female — they are Robert\'s sisters! He has no brothers but three sisters who are doctors!'),
    mcq('I am the beginning of the end, and the end of time and space. I am essential to creation, and I surround every place. What am I?', 'The letter E', 'Nothing', 'The universe', 'Infinity',
      '🔤', 'The letter "E": end (E-nd), timE, spacE, crEation, EvErywhErE!'),
    mcq('You see a house with two doors. One leads to a room full of treasure, the other to a fire. There are two guards — one always lies, one always tells the truth. You can ask ONE question. What do you ask?', '"What would the other guard say is the safe door?"', '"Which door is safe?"', '"Are you the truth-teller?"', '"Where is the treasure?"',
      '🚪', 'Ask either guard what the OTHER guard would say. Both answers will point to the DANGEROUS door — so choose the opposite!'),
    mcq('I am not a ghost, but I can walk through walls. I am not light, but I travel at light\'s speed. I pass through you right now in billions. What am I?', 'Neutrino', 'Radio wave', 'X-ray', 'Sound',
      '⚛️', 'Neutrinos are tiny particles that travel near light speed and pass through almost everything — including you, right now!'),
    mcq('Five pirates find 100 gold coins. The eldest proposes how to split them. If over half agree, it stands. If not, he is thrown overboard and the next eldest proposes. The eldest pirate is greedy but clever. What does he propose?', '96 for himself, 0, 1, 0, 3', '20 each', '50 for himself, 50 shared', '25 each for four, 0 for himself',
      '🏴‍☠️', 'He gives 1 coin each to pirates 3 and 5 (who get nothing if he is gone), keeps 96. He, 3 and 5 agree (3 out of 5 = majority)!'),
    mcq('What word in the English language is always spelled incorrectly?', '"Incorrectly"', '"Wrong"', '"Misspelled"', '"Error"',
      '🔤', 'The word "incorrectly" is always spelled i-n-c-o-r-r-e-c-t-l-y — that IS the correct spelling of "incorrectly"!'),
    mcq('A man lives on the 30th floor. Every morning he takes the lift down to the ground floor and goes to work. On rainy days he takes the lift all the way back up. On sunny days he only goes to floor 15 and walks up. Why?', 'He is too short to press 30 on sunny days — needs an umbrella to reach it', 'He is training for a marathon', 'The lift only goes to 15', 'He is afraid of heights',
      '☂️', 'He is too short to reach the button for floor 30! On rainy days he uses his umbrella as a pointer to press the button!'),
    mcq('I have no voice yet I speak to you. I tell of all things in the world that people do. I have leaves but I am not a tree. I have pages but I am not a diary. What am I?', 'Book', 'Newspaper', 'Map', 'Internet',
      '📚', 'A book speaks to you through words, has leaves (pages), and tells the stories of the world!'),
    mcq('Two fathers and two sons go fishing. They catch exactly three fish and each person has exactly one fish. How?', 'There are only three people: grandfather, father, son', 'One was invisible', 'One fish was caught twice', 'They shared',
      '🎣', 'There are three people: a grandfather, his son, and his grandson. Two fathers (grandfather and father) and two sons (father and son) — but only three people total!'),
    mcq('What has many needles but cannot sew?', 'Christmas tree', 'Porcupine', 'Hedgehog', 'Compass',
      '🎄', 'A Christmas tree has hundreds of needle-like leaves but they cannot sew anything!')
  ];
}
