// ── General Knowledge Question Bank ──────────────────────────

function getGeneralQuestions(level) {
  const banks = { reception: gkReception, year1: gkYear1, year2: gkYear2,
    year3: gkYear3, year4: gkYear4, year5: gkYear5, year6: gkYear6 };
  return (banks[level] || banks.year1)();
}

// mcq(question, correct, wrong1, wrong2, wrong3, emoji, explanation)
function mcq(q, correct, w1, w2, w3, emoji, explanation) {
  const a = sh([correct, w1, w2, w3]);
  return { question: q, answers: a, correct: a.indexOf(correct),
           emoji: emoji||null, explanation: explanation||null };
}
function sh(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

/* ── Reception (Age 4–5) ───────────────────────────────────── */
function gkReception() { return [
  mcq('What colour is the sky?',
    'blue','red','green','yellow','☁️',
    'The sky looks blue because sunlight bounces off tiny particles in the air — blue light scatters the most!'),

  mcq('What colour is grass?',
    'green','blue','red','orange','🌿',
    'Grass is green because it contains chlorophyll — a special chemical that soaks up sunlight to make food.'),

  mcq('What does a dog say?',
    'woof','meow','moo','baa','🐶',
    'Dogs bark to communicate with us and other animals. \'Woof\' is the word we use for the sound a dog makes!'),

  mcq('What does a cat say?',
    'meow','woof','moo','quack','🐱',
    'Cats mostly meow to talk to humans — they rarely meow at other cats. They also purr when they feel happy!'),

  mcq('What does a cow say?',
    'moo','neigh','oink','roar','🐮',
    'Cows moo to talk to each other, call their calves, and let farmers know when they want food or water.'),

  mcq('Which animal has a long neck?',
    'giraffe','elephant','lion','zebra','🦒',
    'Giraffes have the longest necks of any animal — up to 1.8 metres! They use them to reach leaves high up in trees.'),

  mcq('Which animal is the king of the jungle?',
    'lion','tiger','elephant','bear','🦁',
    'Lions are called the king of the jungle, but they actually live on the African savanna! They are Africa\'s biggest wild cats.'),

  mcq('How many seasons are there?',
    '4','3','5','6',null,
    'The four seasons are Spring, Summer, Autumn and Winter. Each one brings different weather and daylight hours.'),

  mcq('What season is it when it snows?',
    'winter','summer','spring','autumn','❄️',
    'Winter is the coldest season. In many places it snows because the temperature drops below 0°C and water freezes!'),

  mcq('How many days in a week?',
    '7','5','6','8',null,
    'The 7 days are: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday and Sunday. Counting them on your fingers is a great trick!'),

  mcq('What shape is a pizza?',
    'circle','square','triangle','star','🍕',
    'Most pizzas are round — the dough is stretched into a circular shape before being topped with sauce, cheese and toppings.'),

  mcq('Which is a fruit?',
    'banana','carrot','potato','onion','🍌',
    'A banana is a fruit because it grows from a flower and contains seeds. Carrots, potatoes and onions are vegetables!'),

  mcq('How many fingers on one hand?',
    '5','4','6','10',null,
    'We have 5 fingers on each hand — that\'s 10 fingers altogether. We often use our fingers to help us count!'),

  mcq('What do we use to brush our teeth?',
    'toothbrush','spoon','fork','comb','🦷',
    'We use a toothbrush with toothpaste to keep our teeth clean and healthy. We should brush twice a day for 2 minutes!'),

  mcq('What colour is a fire engine?',
    'red','blue','green','yellow','🚒',
    'Fire engines are bright red so other drivers can spot them quickly and move out of the way in an emergency!'),

  mcq('What colour is the sun?',
    'yellow','purple','black','pink','☀️',
    'We see the sun as yellow, but it is actually white! The atmosphere makes it look yellow or orange, especially at sunrise and sunset.'),

  mcq('Which animal gives us milk?',
    'cow','dog','fish','bird','🐄',
    'Cows produce milk for their calves, but farmers collect it for us to drink too. Milk helps our bones grow strong because it contains calcium!'),

  mcq('How many legs does a dog have?',
    '4','2','6','8','🐕',
    'Dogs have 4 legs. Animals with 4 legs are called quadrupeds. Humans have 2 legs — we are called bipeds!'),

  mcq('What colour is a carrot?',
    'orange','blue','purple','white','🥕',
    'Carrots are orange, but they can also be purple, yellow or red! Carrots are great for your eyesight because they contain vitamin A.'),

  mcq('Which animal hops and lives in a pouch?',
    'kangaroo','rabbit','frog','cat','🦘',
    'Kangaroos are marsupials — baby kangaroos (called joeys) are tiny when born and live in their mum\'s pouch until they are big enough!'),

  mcq('What shape is a book?',
    'rectangle','circle','triangle','star','📚',
    'Most books are rectangular — they have four sides with two longer sides and two shorter sides. Squares also have four sides but all sides are equal!'),

  mcq('What do we wear on our feet?',
    'shoes','hat','gloves','scarf','👟',
    'We wear shoes on our feet to protect them and keep them warm. Different shoes are used for different things — like boots for rain or trainers for sport!'),

  mcq('How many eyes do humans have?',
    '2','1','3','4','👀',
    'Humans have 2 eyes, which work together to help us see in 3D. Having two eyes also helps us judge how far away things are!'),

  mcq('What animal has a trunk?',
    'elephant','lion','monkey','bear','🐘',
    'An elephant\'s trunk is actually a very long nose! Elephants use it to breathe, drink water, pick up food and even hug each other.'),

  mcq('Which colour is NOT in a rainbow?',
    'pink','red','blue','green','🌈',
    'A rainbow has 7 colours: Red, Orange, Yellow, Green, Blue, Indigo and Violet. Pink is not one of them! You can remember them with "ROY G BIV".'),

  mcq('What do we use to cut paper?',
    'scissors','hammer','pencil','brush','✂️',
    'Scissors have two sharp blades joined together. We use them carefully to cut paper, fabric and card. Always be careful with sharp scissors!'),

  mcq('How many toes do humans have altogether?',
    '10','8','12','6','🦶',
    'We have 5 toes on each foot, so 10 altogether! Our toes help us balance when we walk and run.'),

  mcq('What falls from the sky when it rains?',
    'water','snow','leaves','sand','🌧️',
    'Rain is water that falls from clouds. Water from rivers and seas evaporates into the air, forms clouds, and then falls back down as rain. This is called the water cycle!'),

  mcq('What colour is a strawberry?',
    'red','blue','orange','purple','🍓',
    'Strawberries are red when ripe and green when they are not ready yet. They are sweet and full of vitamin C, which keeps us healthy!'),

  mcq('Which animal can fly?',
    'eagle','shark','lion','frog','🦅',
    'Eagles are birds with huge wings that let them soar high in the sky. Not all birds can fly — penguins and ostriches are birds but cannot fly!'),

  mcq('What do we call the meal we eat in the morning?',
    'breakfast','lunch','dinner','supper','🥣',
    'Breakfast is the first meal of the day and it is very important! Eating breakfast gives us energy for the whole morning.'),

  mcq('What shape has 4 equal sides?',
    'square','circle','triangle','oval',null,
    'A square has 4 sides and all of them are the same length. A rectangle also has 4 sides but two sides are longer than the other two!'),

  mcq('What sound does a duck make?',
    'quack','moo','woof','oink','🦆',
    'Ducks say quack! They also waddle when they walk because their legs are set far back on their bodies — it makes them great swimmers but funny walkers!'),

  mcq('Which is a vegetable?',
    'broccoli','apple','grape','mango','🥦',
    'Broccoli is a vegetable and is very good for us! It contains vitamins that help keep our bodies healthy and strong.'),

  mcq('What is frozen water called?',
    'ice','steam','cloud','mud','🧊',
    'When water gets cold enough (below 0°C), it freezes and becomes ice! Steam is water that has become very hot and turned into a gas.'),

  mcq('How many colours are in a traffic light?',
    '3','2','4','5','🚦',
    'Traffic lights have 3 colours: red means stop, amber (orange) means get ready, and green means go! They help keep roads safe.'),

  mcq('What noise does a sheep make?',
    'baa','moo','quack','hiss','🐑',
    'Sheep say baa! A female sheep is called a ewe, a male is a ram, and a baby sheep is a lamb. Sheep give us wool for warm jumpers!'),

  mcq('What part of the body do we use to smell?',
    'nose','ears','eyes','hands','👃',
    'We use our nose to smell. Our sense of smell helps us enjoy food, detect danger like smoke, and remember special moments!'),

  mcq('Which animal is black and white and lives in cold places?',
    'penguin','zebra','cow','panda','🐧',
    'Penguins are black and white birds that live in cold places like Antarctica. They cannot fly but they are brilliant swimmers!'),

  mcq('What do bees make?',
    'honey','milk','butter','jam','🍯',
    'Bees collect nectar from flowers and turn it into honey inside the hive. Honey is sweet and can last for thousands of years without going off!'),

  mcq('How many wheels does a bicycle have?',
    '2','3','4','1','🚲',
    'A bicycle has 2 wheels — "bi" means two! A tricycle has 3 wheels and a unicycle has just 1. Riding a bicycle is great exercise!'),

  mcq('What is the biggest number — 5, 9, 3 or 7?',
    '9','5','3','7',null,
    '9 is the biggest! When we count, 9 comes after 8 which comes after 7. We can also count these on our fingers to check!'),

  mcq('Which animal lives in a shell?',
    'snail','cat','horse','parrot','🐌',
    'Snails carry their shell on their back — it is their home! If danger comes, they tuck inside it to stay safe. The shell grows with the snail.'),
];}

/* ── Year 1 (Age 5–6) ──────────────────────────────────────── */
function gkYear1() { return [
  mcq('What is the capital city of England?',
    'London','Paris','Madrid','Rome','🏙️',
    'London has been England\'s capital for over 1,000 years. It\'s home to Buckingham Palace, Big Ben and the Tower of London!'),

  mcq('How many months in a year?',
    '12','10','11','13',null,
    'The 12 months are January through to December. Some have 30 days, some 31, and February has just 28 (or 29 in a leap year)!'),

  mcq('Which animal lives in the sea?',
    'dolphin','lion','elephant','giraffe','🐬',
    'Dolphins live in the sea but breathe air through a blowhole on their head — they\'re mammals, not fish!'),

  mcq('What do plants need to grow?',
    'sunlight and water','milk and juice','sand','sugar','🌱',
    'Plants use sunlight, water and carbon dioxide from the air to make their own food — a process called photosynthesis.'),

  mcq('Which planet do we live on?',
    'Earth','Mars','Venus','Jupiter','🌍',
    'Earth is the third planet from the Sun and the only known planet in the universe with life on it!'),

  mcq('What is the biggest ocean?',
    'Pacific','Atlantic','Indian','Arctic','🌊',
    'The Pacific Ocean is the largest and deepest ocean — it covers more than 30% of Earth\'s entire surface!'),

  mcq('What colour are bananas?',
    'yellow','red','green','purple','🍌',
    'Bananas turn yellow as they ripen. Unripe bananas start out green, and overripe ones go brown and spotty.'),

  mcq('How many legs does a spider have?',
    '8','6','4','10',null,
    'Spiders are arachnids, not insects! Insects have 6 legs. Spiders have 8 legs and often 8 eyes too.'),

  mcq('Which is the coldest continent?',
    'Antarctica','Africa','Europe','Asia','🧊',
    'Antarctica is the coldest, driest and windiest continent. The lowest temperature ever recorded on Earth was −89.2°C there!'),

  mcq('What do caterpillars become?',
    'butterflies','bees','flies','moths','🦋',
    'A caterpillar wraps itself in a chrysalis and completely transforms into a butterfly. This amazing change is called metamorphosis!'),

  mcq('What is a 2D shape with 3 sides?',
    'triangle','square','circle','rectangle',null,
    'A triangle has 3 sides and 3 corners (angles). "Tri" means three. If all three sides are equal, it\'s called equilateral!'),

  mcq('Which animal is famous for its stripes?',
    'zebra','lion','giraffe','hippo','🦓',
    'Every zebra\'s stripe pattern is completely unique — like a fingerprint! The stripes may help confuse predators.'),

  mcq('What gas do humans breathe in?',
    'oxygen','carbon dioxide','nitrogen','hydrogen','💨',
    'We breathe in oxygen and breathe out carbon dioxide. Oxygen is used by every cell in our body to produce energy.'),

  mcq('Which season comes after winter?',
    'spring','autumn','summer','winter',null,
    'The seasons go: Spring → Summer → Autumn → Winter → Spring again. Spring brings warmer weather and flowers bloom!'),

  mcq('Who wrote the Harry Potter books?',
    'J.K. Rowling','Roald Dahl','C.S. Lewis','J.R.R. Tolkien','📚',
    'J.K. Rowling wrote all 7 Harry Potter books. She came up with the idea on a delayed train and first wrote notes on napkins!'),

  mcq('Which country is England part of?',
    'United Kingdom','France','Germany','Ireland','🇬🇧',
    'England is one of four countries in the United Kingdom — the others are Scotland, Wales and Northern Ireland. The UK shares one government in London.'),

  mcq('What do we call a baby cat?',
    'kitten','puppy','cub','foal','🐱',
    'A baby cat is called a kitten. A baby dog is a puppy, a baby horse is a foal, and a baby bear is a cub!'),

  mcq('Which is the tallest animal?',
    'giraffe','elephant','hippo','rhino','🦒',
    'Giraffes are the world\'s tallest living animals — up to 5.5 metres tall! Their long legs alone are taller than most adult humans.'),

  mcq('What type of weather brings rainbows?',
    'sun and rain together','snow','fog','hail','🌈',
    'Rainbows appear when sunlight shines through rain droplets. The droplets act like tiny prisms, splitting white light into all its colours!'),

  mcq('Where do fish live?',
    'water','trees','underground','in the sky','🐟',
    'Fish live in water — either salt water like seas and oceans, or fresh water like rivers and lakes. They breathe through gills, not lungs.'),

  mcq('How many wheels does a car have?',
    '4','2','6','3','🚗',
    'Most cars have 4 wheels. The wheels help the car move along roads. The engine makes the wheels turn, and the steering wheel makes them turn left or right!'),

  mcq('Which animal lives in a burrow underground?',
    'rabbit','eagle','whale','frog','🐰',
    'Rabbits dig underground tunnels called burrows or warrens where they sleep and raise their babies. Up to 30 rabbits can share one warren!'),

  mcq('What do we call the hot liquid rock inside a volcano?',
    'lava','water','sand','mud','🌋',
    'When molten rock erupts from a volcano it is called lava. Underground it is called magma. Lava can reach temperatures of over 1,000°C!'),

  mcq('How many sides does a square have?',
    '4','3','5','6',null,
    'A square has 4 equal sides and 4 right angles. "Quad" means four — that\'s why shapes with 4 sides are also called quadrilaterals!'),

  mcq('What colour is a banana when it is NOT ripe?',
    'green','blue','red','purple','🍌',
    'Unripe bananas are green! As they ripen they turn yellow, then brown. The greener they are, the harder and less sweet they taste.'),

  mcq('Which season has the most sunshine in the UK?',
    'summer','winter','spring','autumn','☀️',
    'Summer is the warmest and sunniest season in the UK. The days are longer because the Earth is tilted toward the Sun, giving us more hours of daylight!'),

  mcq('What is the name of the city where Big Ben is?',
    'London','Manchester','Edinburgh','Birmingham','🕐',
    'Big Ben is the nickname for the great bell inside the clock tower in London. The tower is officially called the Elizabeth Tower, named after Queen Elizabeth II.'),

  mcq('Which animal is famous for changing colour?',
    'chameleon','dog','eagle','cow','🦎',
    'Chameleons can change the colour of their skin! They do this to communicate with other chameleons and to blend into their surroundings to hide from predators.'),

  mcq('What do we call water that falls as frozen flakes?',
    'snow','rain','hail','fog','❄️',
    'Snow forms when water vapour in clouds freezes into ice crystals. Every snowflake has a unique pattern — no two are exactly alike!'),

  mcq('Which part of a plant is usually underground?',
    'roots','leaves','flowers','stem','🌱',
    'Roots grow underground and absorb water and nutrients from the soil. They also anchor the plant so it doesn\'t fall over in the wind!'),

  mcq('How many hours are in a day?',
    '24','12','20','30',null,
    'There are 24 hours in a day — the time it takes for Earth to spin once. That is why we have day and night: one side faces the Sun while the other is in darkness.'),

  mcq('Which animal is covered in spines?',
    'hedgehog','horse','sheep','pig','🦔',
    'Hedgehogs have thousands of sharp spines on their back for protection. When scared, they roll into a ball — the spines point outward to protect them!'),

  mcq('What shape is an egg?',
    'oval','circle','square','triangle','🥚',
    'Eggs are oval — like a stretched circle. This rounded shape makes them very strong — it\'s hard to crack an egg just by squeezing it from the ends!'),

  mcq('Which one is NOT a sense?',
    'thinking','sight','smell','touch',null,
    'Humans have 5 senses: sight, hearing, smell, taste and touch. We use these to learn about the world around us. Thinking is done by our brain but is not one of the 5 senses!'),

  mcq('What is the name of the flag of the United Kingdom?',
    'Union Jack','Stars and Stripes','Tricolour','Maple Leaf','🇬🇧',
    'The UK flag is called the Union Jack. It combines the crosses of St George (England), St Andrew (Scotland) and St Patrick (Ireland). Wales has its own flag with a red dragon!'),

  mcq('What do we call animals that eat both plants and meat?',
    'omnivores','herbivores','carnivores','predators',null,
    'Omnivores eat both plants and animals. Humans are omnivores! Bears are also omnivores — they eat fish, berries, honey and much more.'),

  mcq('Which planet is closest to the Sun?',
    'Mercury','Venus','Earth','Mars','🌑',
    'Mercury is the closest planet to the Sun and also the smallest. It has no atmosphere, so temperatures swing wildly between −180°C at night and 430°C in the day!'),

  mcq('What do we call a group of fish swimming together?',
    'a shoal','a flock','a herd','a pack','🐟',
    'A group of fish is called a shoal (or school). Fish swim together for safety — it confuses predators! Birds fly in a flock, sheep move in a herd.'),

  mcq('Which type of cloud brings rain?',
    'nimbus','cirrus','cumulus','stratus','🌧️',
    'Nimbus clouds (like cumulonimbus and nimbostratus) are the rain-bringers! Cirrus clouds are thin and wispy high up; cumulus are fluffy white clouds on sunny days.'),

  mcq('How many legs does an insect have?',
    '6','4','8','10','🐛',
    'All insects have exactly 6 legs — this is one of the key things that makes an insect an insect! Spiders have 8 legs, which is why they are NOT insects.'),

  mcq('What is the tallest building called?',
    'skyscraper','bungalow','cottage','shed',null,
    'Very tall buildings are called skyscrapers because they seem to scrape the sky! The tallest building in the world is the Burj Khalifa in Dubai at 828 metres.'),

  mcq('Which liquid do we drink when we are thirsty?',
    'water','petrol','juice only','lemonade only','💧',
    'Water is the best drink for keeping our bodies healthy! Our bodies are about 60% water. We should drink about 6–8 glasses of water every day.'),

  mcq('What is the name for a baby sheep?',
    'lamb','cub','foal','kitten','🐑',
    'A baby sheep is called a lamb. You often see newborn lambs in spring fields in the UK. Lambs grow very quickly and can stand up just minutes after being born!'),
];}

/* ── Year 2 (Age 6–7) ──────────────────────────────────────── */
function gkYear2() { return [
  mcq('What is the largest continent?',
    'Asia','Africa','Europe','America','🌏',
    'Asia is the largest continent — it covers about 30% of Earth\'s land and is home to over 4.5 billion people!'),

  mcq('How many continents are there?',
    '7','5','6','8',null,
    'The 7 continents are: Africa, Antarctica, Asia, Australia (Oceania), Europe, North America and South America.'),

  mcq('What is the largest mammal on Earth?',
    'blue whale','elephant','giraffe','polar bear','🐋',
    'The blue whale is the largest animal EVER to have lived on Earth — up to 30 metres long and 200 tonnes! That\'s heavier than 30 elephants.'),

  mcq('Which planet is known as the Red Planet?',
    'Mars','Jupiter','Saturn','Venus','🔴',
    'Mars looks red because its surface is covered in iron oxide — basically rust! It also has the largest volcano in the solar system.'),

  mcq('What is H₂O the chemical formula for?',
    'water','oxygen','hydrogen','salt','💧',
    'H₂O means 2 hydrogen atoms joined to 1 oxygen atom. About 70% of Earth\'s surface and 60% of the human body is water!'),

  mcq('What do we call a baby dog?',
    'puppy','cub','kitten','lamb','🐶',
    'A baby dog is a puppy. A baby cat is a kitten, a baby sheep is a lamb, a baby bear is a cub and a baby swan is a cygnet!'),

  mcq('Which country has the Eiffel Tower?',
    'France','Spain','Italy','Germany','🗼',
    'The Eiffel Tower in Paris was built in 1889 for a world fair. It was meant to be temporary but is now France\'s most famous landmark!'),

  mcq('What type of animal is a whale?',
    'mammal','fish','reptile','amphibian','🐋',
    'Even though whales live in the sea, they\'re mammals — they breathe air, are warm-blooded and feed milk to their young.'),

  mcq('Which sense do we use our nose for?',
    'smell','sight','hearing','taste','👃',
    'The nose is our organ for smell. Humans can detect over 1 trillion different smells — and smell is closely linked to memory!'),

  mcq('What is the closest star to Earth?',
    'the Sun','Sirius','Polaris','Venus','☀️',
    'The Sun IS a star — a giant ball of hot gas. It\'s 150 million km away but much closer than any other star!'),

  mcq('How many sides does a hexagon have?',
    '6','5','7','8',null,
    'A hexagon has 6 sides and 6 angles. Honeybees build honeycombs in hexagon shapes — it\'s the most efficient shape for storing honey!'),

  mcq('What is the opposite of north?',
    'south','east','west','up','🧭',
    'On a compass, North is opposite South, and East is opposite West. A compass needle always points toward magnetic north.'),

  mcq('Which animal is known for its memory?',
    'elephant','goldfish','dog','cat','🐘',
    'Elephants can remember other elephants and humans for decades. They even mourn their dead — one of the very few animals to do so.'),

  mcq('What language is spoken in Brazil?',
    'Portuguese','Spanish','English','French','🇧🇷',
    'Brazil was colonised by Portugal in the 1500s, which is why it\'s the only country in South America that speaks Portuguese.'),

  mcq('What is the tallest mountain in the world?',
    'Mount Everest','K2','Mont Blanc','Kilimanjaro','⛰️',
    'Mount Everest in the Himalayas stands at 8,849 metres above sea level. It was first climbed by Hillary and Tenzing Norgay in 1953.'),

  mcq('What is the capital of Scotland?',
    'Edinburgh','Glasgow','Aberdeen','Dundee','🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    'Edinburgh has been Scotland\'s capital since the 15th century. It is famous for its castle on a rocky hill, the annual Fringe Festival and Hogmanay New Year celebrations!'),

  mcq('Which is the largest ocean in the world?',
    'Pacific','Atlantic','Indian','Arctic','🌊',
    'The Pacific Ocean is so vast that all the continents could fit inside it! It stretches from the Arctic in the north to Antarctica in the south.'),

  mcq('What do we call animals that carry their young in a pouch?',
    'marsupials','reptiles','amphibians','rodents','🦘',
    'Marsupials include kangaroos, wallabies and koalas. Their babies are born very tiny and undeveloped, finishing their growth inside mum\'s pouch!'),

  mcq('Which country is famous for the Great Wall?',
    'China','India','Japan','Egypt','🧱',
    'The Great Wall of China stretches over 21,000 kilometres! It was built over many centuries to protect Chinese states from invaders from the north.'),

  mcq('What is the capital of Wales?',
    'Cardiff','Swansea','Newport','Bangor','🏴󠁧󠁢󠁷󠁬󠁳󠁿',
    'Cardiff has been the capital of Wales since 1955. It is home to the Millennium Stadium and Cardiff Castle. The Welsh flag features a famous red dragon!'),

  mcq('Which planet is the biggest in our solar system?',
    'Jupiter','Saturn','Uranus','Neptune','🪐',
    'Jupiter is so enormous that more than 1,300 Earths could fit inside it! It has at least 95 moons and a storm called the Great Red Spot that has lasted over 300 years.'),

  mcq('What is ice cream made from?',
    'milk and cream','water and sugar only','flour and eggs','fruit only','🍦',
    'Ice cream is made from milk, cream, sugar and flavourings. It is churned while freezing to make it smooth and creamy. The first ice creams were made in China over 1,000 years ago!'),

  mcq('Which instrument has keys, strings and pedals?',
    'piano','guitar','drums','violin','🎹',
    'A piano has 88 keys and over 200 strings inside! Pressing a key causes a small hammer to hit a string, which vibrates and makes a musical note.'),

  mcq('What do we call countries that share a border?',
    'neighbours','rivals','colonies','allies',null,
    'Countries that share a land border are called neighbouring countries. The UK is an island, so it has no land neighbours — but France is just 33km away across the English Channel!'),

  mcq('Which animal is the fastest on land?',
    'cheetah','lion','horse','ostrich','🐆',
    'Cheetahs can run up to 120 km/h in short bursts! Their flexible spine acts like a spring, letting them take huge strides. They need just seconds to reach top speed.'),

  mcq('What is the name of the sea between England and France?',
    'English Channel','North Sea','Irish Sea','Atlantic Ocean','🌊',
    'The English Channel separates England from France. It is only about 33 km wide at its narrowest point. A Channel Tunnel runs underneath it, connecting the UK to Europe by train!'),

  mcq('Which is NOT a mammal?',
    'salmon','dolphin','bat','elephant','🐟',
    'A salmon is a fish, not a mammal. Fish breathe through gills, are usually cold-blooded and lay eggs. Dolphins, bats and elephants are all warm-blooded mammals that breathe air!'),

  mcq('How many oceans are there on Earth?',
    '5','3','4','6',null,
    'Earth has 5 oceans: the Pacific, Atlantic, Indian, Southern and Arctic. Some older books say 4 because the Southern Ocean was officially named only in 2000!'),

  mcq('What is the capital of Northern Ireland?',
    'Belfast','Derry','Armagh','Lisburn','🏙️',
    'Belfast is Northern Ireland\'s capital and largest city. It is famous for building the Titanic — the world\'s most famous ship, which sadly sank in 1912.'),

  mcq('Which country is the Statue of Liberty in?',
    'USA','France','Canada','UK','🗽',
    'The Statue of Liberty stands in New York Harbour. It was a gift from France to the USA in 1886 as a symbol of freedom. The torch she holds represents enlightenment!'),

  mcq('What material are windows made from?',
    'glass','wood','plastic','metal','🪟',
    'Windows are made from glass because it lets light through but keeps out wind and rain. Glass is made by melting sand — mainly silica — at very high temperatures!'),

  mcq('Which bird cannot fly and lives in a cold climate?',
    'penguin','parrot','eagle','sparrow','🐧',
    'Penguins have wings but cannot fly — their wings have evolved into flippers for swimming underwater! They live in the Southern Hemisphere, mainly in Antarctica.'),

  mcq('What do we call a scientist who studies fossils?',
    'palaeontologist','astronomer','geologist','biologist',null,
    'Palaeontologists study fossils — the preserved remains of plants and animals that lived millions of years ago. Fossils can tell us a huge amount about Earth\'s history!'),

  mcq('Which country is the Amazon Rainforest mainly in?',
    'Brazil','Argentina','Peru','Colombia','🌳',
    'About 60% of the Amazon Rainforest is in Brazil. It is the world\'s largest tropical rainforest and produces around 20% of the world\'s oxygen — it is sometimes called the \'lungs of the Earth\'!'),

  mcq('What is the main language spoken in Spain?',
    'Spanish','French','Italian','Portuguese','🇪🇸',
    'Spanish is spoken in Spain and by about 500 million people worldwide — it is the second most spoken native language after Mandarin Chinese!'),

  mcq('Which is the smallest planet in our solar system?',
    'Mercury','Mars','Venus','Earth','🌑',
    'Mercury is the smallest of the 8 planets. It is also the closest to the Sun but NOT the hottest — Venus is hotter because it has a thick atmosphere that traps heat.'),

  mcq('What is the River Thames?',
    'A river that flows through London','A mountain in Scotland','A lake in Wales','A sea in England','🌊',
    'The River Thames flows through London and into the North Sea. It is 346 km long and has been vital to London\'s history for thousands of years.'),

  mcq('What do we call the top layer of the Earth we walk on?',
    'crust','mantle','core','lava',null,
    'Earth is made of layers like an onion: the crust (outer layer we stand on), the mantle (hot rock), the outer core (liquid metal) and the inner core (solid metal at the centre).'),

  mcq('Which animal has the most legs?',
    'millipede','spider','centipede','crab','🐛',
    'Millipedes can have over 1,000 legs — more than any other animal! Despite the name "millipede" meaning 1,000 feet, most species have between 40 and 400 legs.'),

  mcq('What do we call the place where a river meets the sea?',
    'estuary','delta','harbour','bay','🌊',
    'An estuary is where fresh river water mixes with salty sea water. Many of Britain\'s biggest cities including London, Bristol and Cardiff are built on estuaries!'),

  mcq('Which season do leaves fall from trees?',
    'autumn','spring','summer','winter','🍂',
    'In autumn, deciduous trees shed their leaves to save energy through winter. Before falling, the leaves turn beautiful shades of red, orange and yellow!'),

  mcq('How many minutes are in an hour?',
    '60','30','100','45',null,
    'There are 60 minutes in an hour and 60 seconds in a minute. There are 24 hours in a day, making 1,440 minutes in a full day!'),

  mcq('What is the name of the imaginary line around the middle of the Earth?',
    'equator','North Pole','South Pole','Tropic',null,
    'The equator is an imaginary line that divides Earth into the Northern and Southern Hemispheres. Countries on the equator are always hot because the Sun shines most directly there!'),
];}

/* ── Year 3 (Age 7–8) ──────────────────────────────────────── */
function gkYear3() { return [
  mcq('What is the capital of France?',
    'Paris','Lyon','Marseille','Nice','🇫🇷',
    'Paris has been France\'s capital for over 1,000 years. It\'s known as the "City of Light" and attracts 30 million visitors a year!'),

  mcq('What is the capital of Australia?',
    'Canberra','Sydney','Melbourne','Brisbane','🇦🇺',
    'Many people think Sydney is the capital — but it\'s Canberra! It was purpose-built in 1913 as a compromise between Sydney and Melbourne.'),

  mcq('How many bones are in the human body?',
    '206','196','216','186',null,
    'Adults have 206 bones, but babies are born with about 270 — some fuse together as we grow. The smallest bone is in your ear!'),

  mcq('What is the currency of the USA?',
    'Dollar','Pound','Euro','Yen','💵',
    'The US Dollar has been the world\'s main reserve currency since World War II. The $ symbol may come from the Spanish word "peso".'),

  mcq('Which is the longest river in the world?',
    'Nile','Amazon','Mississippi','Yangtze','🌊',
    'The Nile flows through 11 countries for about 6,650 km. Ancient Egyptian civilisation grew up along its banks over 5,000 years ago.'),

  mcq('What does a herbivore eat?',
    'plants','meat','both','fish','🌿',
    'Herbivores only eat plants. Examples: cows, horses, rabbits and elephants. Their flat teeth are perfect for grinding plants.'),

  mcq('Which gas do plants absorb?',
    'carbon dioxide','oxygen','nitrogen','hydrogen',null,
    'Plants absorb CO₂ during photosynthesis and release oxygen. This is why plants are so vital — they produce the air we breathe!'),

  mcq('What is the boiling point of water (°C)?',
    '100','90','110','80','♨️',
    'Water boils at 100°C (212°F) at sea level. Higher up a mountain, air pressure drops, so water actually boils at a lower temperature!'),

  mcq('How many planets in our solar system?',
    '8','9','7','10','🪐',
    'In 2006 Pluto was reclassified as a dwarf planet, leaving us with 8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.'),

  mcq('What is the largest country by area?',
    'Russia','China','USA','Canada','🗺️',
    'Russia covers 17.1 million km² — it\'s so enormous it spans 11 time zones! That\'s roughly twice the size of the next largest country.'),

  mcq('What is the hardest natural substance?',
    'diamond','gold','iron','platinum','💎',
    'Diamond scores 10 — the maximum — on the Mohs hardness scale. It\'s a form of pure carbon arranged in an incredibly strong crystal structure.'),

  mcq('Who invented the telephone?',
    'Alexander Graham Bell','Thomas Edison','Nikola Tesla','Einstein',null,
    'Alexander Graham Bell made the first telephone call in 1876. His very first words were: "Mr Watson, come here — I want to see you!"'),

  mcq('Which is the smallest ocean?',
    'Arctic','Indian','Atlantic','Pacific','🧊',
    'The Arctic Ocean is the world\'s smallest and shallowest ocean. Most of it is covered in sea ice — though that ice is shrinking due to climate change.'),

  mcq('What do we call animals active at night?',
    'nocturnal','diurnal','dormant','migratory',null,
    'Nocturnal animals (owls, bats, foxes) sleep during the day and are active at night. They often have large eyes and excellent hearing.'),

  mcq('Which planet has rings?',
    'Saturn','Jupiter','Mars','Uranus','🪐',
    'Saturn\'s rings are made of billions of chunks of ice and rock. They\'re up to 282,000 km wide but only about 10–100 metres thick!'),

  mcq('Which organ pumps blood around the body?',
    'heart','lungs','kidneys','brain','❤️',
    'The heart is a powerful muscle that beats about 100,000 times a day — pumping blood through nearly 100,000 km of blood vessels in your body!'),

  mcq('What is the freezing point of water in °C?',
    '0','−10','10','100',null,
    'Water freezes at 0°C (32°F) — this is why roads get icy at 0°C. Salt is spread on icy roads because it lowers the freezing point of water so ice melts!'),

  mcq('What type of rock is formed from cooled lava?',
    'igneous','sedimentary','metamorphic','granite',null,
    'Igneous rock forms when lava or magma cools and hardens. "Igneous" comes from the Latin word for fire. Granite and basalt are common igneous rocks!'),

  mcq('Which continent is the Sahara Desert on?',
    'Africa','Asia','Australia','South America','🌵',
    'The Sahara Desert covers most of northern Africa — it\'s about the same size as the USA! Despite being a hot desert, it does snow there occasionally on higher ground.'),

  mcq('What is the capital of Germany?',
    'Berlin','Munich','Hamburg','Frankfurt','🇩🇪',
    'Berlin became Germany\'s capital again in 1990 after German reunification. The Berlin Wall, which had divided the city since 1961, was famously torn down in 1989.'),

  mcq('What force pulls objects towards Earth?',
    'gravity','friction','magnetism','electricity',null,
    'Gravity is the invisible force that pulls everything toward Earth\'s centre. It keeps us on the ground, the Moon in orbit, and Earth orbiting the Sun. Isaac Newton described it in 1687.'),

  mcq('What is the longest bone in the human body?',
    'femur (thigh bone)','spine','skull','humerus','🦴',
    'The femur (thigh bone) is the longest, strongest bone in your body — running from your hip to your knee. It can support up to 30 times the weight of your body!'),

  mcq('What is the main gas in Earth\'s atmosphere?',
    'nitrogen','oxygen','carbon dioxide','hydrogen',null,
    'Earth\'s atmosphere is about 78% nitrogen, 21% oxygen and 1% other gases including argon and CO₂. We breathe the oxygen but nitrogen is just as essential for life!'),

  mcq('Which bird is the largest in the world?',
    'ostrich','eagle','albatross','pelican','🦅',
    'The ostrich is the world\'s largest bird — up to 2.7 metres tall and 160 kg. It cannot fly but can run up to 70 km/h, making it the fastest running bird!'),

  mcq('What does a carnivore eat?',
    'meat','plants','both plants and meat','only fruit',null,
    'Carnivores eat only meat. Examples include lions, sharks and eagles. Their sharp teeth and claws are designed for catching and eating prey.'),

  mcq('Which planet is closest to Earth in size?',
    'Venus','Mars','Mercury','Saturn','🌍',
    'Venus is almost exactly the same size as Earth — often called Earth\'s twin. However it is very different: its atmosphere is mostly CO₂ making it the hottest planet!'),

  mcq('What is the name given to the study of living things?',
    'biology','chemistry','physics','geology',null,
    'Biology is the science of life! It covers everything from tiny bacteria to giant whales. The word comes from the Greek "bios" (life) and "logos" (study).'),

  mcq('Which famous ancient structure is in Egypt?',
    'Pyramids of Giza','Eiffel Tower','Colosseum','Taj Mahal','🏛️',
    'The Great Pyramid of Giza was built around 2560 BC for Pharaoh Khufu. It was the tallest man-made structure in the world for over 3,800 years!'),

  mcq('What is the capital of Italy?',
    'Rome','Milan','Venice','Naples','🇮🇹',
    'Rome has been one of the world\'s most important cities for over 2,500 years. It was the centre of the vast Roman Empire and is home to the Vatican, the world\'s smallest country!'),

  mcq('What is the term for an animal that sleeps through winter?',
    'hibernation','migration','dormancy','camouflage',null,
    'Hibernating animals (like bears and hedgehogs) slow their heartbeat and breathing to save energy during the cold months when food is scarce. They can lose up to half their body weight!'),

  mcq('Which sea creature has 8 arms?',
    'octopus','starfish','crab','squid','🐙',
    'Octopuses have 8 flexible arms covered in suckers. They are incredibly intelligent — they can open jars, use tools and even change their skin colour and texture to camouflage!'),

  mcq('What is the currency of the United Kingdom?',
    'pound sterling','euro','dollar','franc','💷',
    'The pound sterling (£) is one of the world\'s oldest currencies still in use — it has been around since the 8th century! Notes are printed with the reigning monarch\'s face.'),

  mcq('Which part of the plant makes seeds?',
    'flower','root','stem','leaf','🌸',
    'Flowers attract insects with their colour and scent. Pollen is transferred between flowers (pollination), and seeds form as a result. Seeds grow into new plants!'),

  mcq('What causes day and night?',
    'Earth rotating on its axis','Earth moving around the Sun','The Moon blocking the Sun','Clouds covering the Sun',null,
    'Earth spins on its axis once every 24 hours. The side facing the Sun has daytime; the side facing away has night. This is completely different from the seasons, which are caused by Earth\'s tilt!'),

  mcq('Which country is home to the kangaroo?',
    'Australia','India','Brazil','South Africa','🦘',
    'Kangaroos are native to Australia. They are marsupials and can hop at up to 70 km/h. A group of kangaroos is called a mob — or sometimes a troop!'),

  mcq('What is the name of the process where water evaporates and falls as rain?',
    'water cycle','food chain','carbon cycle','nitrogen cycle','💧',
    'The water cycle has four stages: evaporation (water rises as vapour), condensation (forms clouds), precipitation (falls as rain/snow) and collection (gathers in rivers and seas).'),

  mcq('What organ in the human body filters the blood?',
    'kidneys','heart','liver','lungs',null,
    'The two kidneys filter all the blood in your body about 300 times per day — removing waste and making urine. You can live with just one kidney!'),

  mcq('Which ancient wonder was located in Alexandria, Egypt?',
    'Lighthouse of Alexandria','Great Wall of China','Colosseum','Stonehenge',null,
    'The Lighthouse of Alexandria was one of the Seven Wonders of the Ancient World — standing about 100 metres tall, it guided sailors for over 1,500 years before collapsing in earthquakes.'),

  mcq('What is 1,000 multiplied by 1,000?',
    '1,000,000 (one million)','10,000','100,000','1,000,000,000',null,
    '1,000 × 1,000 = 1,000,000 — one million! A million seconds is about 11.5 days. A billion seconds is about 31.7 years. Numbers get big very fast!'),

  mcq('Which type of energy is stored in food?',
    'chemical energy','kinetic energy','electrical energy','nuclear energy',null,
    'Food stores chemical energy. When we digest food, our bodies release this energy and convert it to other forms — movement (kinetic), heat, and electrical signals in nerves!'),

  mcq('What is the largest country in Africa?',
    'Algeria','Nigeria','South Africa','Egypt','🌍',
    'Algeria is the largest country in Africa by area — bigger than Western Europe combined! The Democratic Republic of Congo is close behind and Nigeria is Africa\'s most populous country.'),

  mcq('Which planet has the most moons?',
    'Saturn','Jupiter','Uranus','Neptune','🪐',
    'As of recent counts, Saturn leads with 146 confirmed moons! Jupiter has around 95. Saturn\'s largest moon, Titan, is bigger than the planet Mercury and has a thick atmosphere.'),

  mcq('What is the name of the force that slows things down when they rub together?',
    'friction','gravity','magnetism','inertia',null,
    'Friction occurs when two surfaces rub together — it converts kinetic energy into heat. Friction is useful (brakes, tyres gripping the road) but can also waste energy in machines.'),
];}

/* ── Year 4 (Age 8–9) ──────────────────────────────────────── */
function gkYear4() { return [
  mcq('In what year did World War II end?',
    '1945','1939','1918','1944','⚔️',
    'WWII ended in Europe on 8 May 1945 (VE Day) and in the Pacific on 15 August 1945 when Japan surrendered after atomic bombs were dropped on Hiroshima and Nagasaki.'),

  mcq('What is the chemical symbol for gold?',
    'Au','Ag','Gd','Gl','🥇',
    '"Au" comes from the Latin word "aurum" meaning gold. Gold has been used as money and jewellery for thousands of years and never rusts!'),

  mcq('What is the chemical symbol for iron?',
    'Fe','Ir','In','Io',null,
    '"Fe" comes from the Latin "ferrum" meaning iron. Iron is one of the most common elements on Earth and is the main ingredient in steel.'),

  mcq('What country has the most population?',
    'India','China','USA','Brazil','🌏',
    'India overtook China as the world\'s most populous country in 2023 with over 1.4 billion people — nearly 1 in 6 people on Earth!'),

  mcq('What type of energy does the Sun give?',
    'light & heat','chemical','electrical','kinetic','☀️',
    'The Sun produces energy through nuclear fusion — hydrogen atoms fuse into helium, releasing enormous amounts of light and heat energy.'),

  mcq('What is photosynthesis?',
    'How plants make food using sunlight','How animals breathe','A type of weather','A kind of exercise',null,
    'Plants convert sunlight, water (from roots) and CO₂ (from air) into glucose and oxygen. The green pigment chlorophyll makes this possible.'),

  mcq('What is the capital of Japan?',
    'Tokyo','Beijing','Seoul','Bangkok','🇯🇵',
    'Tokyo is one of the world\'s most populous cities with over 13 million people. It became Japan\'s capital in 1869 when the Emperor moved there.'),

  mcq('What is the name of the galaxy we live in?',
    'Milky Way','Andromeda','Orion','Triangulum','🌌',
    'The Milky Way is a spiral galaxy containing over 200 billion stars. Our Sun is just one of them, located about halfway from the centre.'),

  mcq('What is the speed of light (approx km/s)?',
    '300,000','150,000','450,000','200,000',null,
    'Light travels at 299,792 km per second — so fast it could travel around the Earth 7.5 times in just one second! Sunlight takes 8 minutes to reach us.'),

  mcq('What part of the body produces insulin?',
    'pancreas','liver','kidney','heart',null,
    'The pancreas produces insulin, which helps your body\'s cells absorb glucose for energy. Without enough insulin, blood sugar rises — this is called diabetes.'),

  mcq('Who painted the Mona Lisa?',
    'Leonardo da Vinci','Michelangelo','Raphael','Picasso','🎨',
    'Leonardo da Vinci painted the Mona Lisa around 1503–1519. It hangs in the Louvre in Paris and is the most visited painting in the world!'),

  mcq('What is the largest desert in the world?',
    'Sahara','Gobi','Arabian','Antarctic',null,
    'The Sahara is the world\'s largest HOT desert at 9.2 million km². But technically Antarctica is the largest desert of all — deserts are defined by low rainfall, not heat!'),

  mcq('What is Newton\'s first law about?',
    'inertia','gravity','energy','momentum',null,
    'Newton\'s first law says an object stays still or keeps moving at the same speed unless a force acts on it. This tendency to resist change is called inertia.'),

  mcq('What is the currency of Japan?',
    'Yen','Won','Yuan','Ringgit','💴',
    'Japan\'s currency is the Yen (¥). Japan is one of the world\'s largest economies and a major exporter of cars, electronics and video games!'),

  mcq('Which country invented paper?',
    'China','Egypt','India','Greece',null,
    'Paper was invented in China around 105 AD by an official named Cai Lun. Before paper, people wrote on bamboo, silk, bone and clay tablets.'),

  mcq('What is the chemical symbol for water?',
    'H₂O','CO₂','NaCl','O₂',null,
    'H₂O means two hydrogen atoms bonded to one oxygen atom. Water is the only substance naturally found in all three states — solid (ice), liquid (water) and gas (steam) — on Earth.'),

  mcq('In what year did the First World War begin?',
    '1914','1918','1939','1900','⚔️',
    'World War I began in 1914 following the assassination of Archduke Franz Ferdinand. It lasted until 1918 and involved countries from across the world — one of the deadliest conflicts in history.'),

  mcq('What is the chemical symbol for oxygen?',
    'O','Ox','On','Om',null,
    'Oxygen\'s symbol is simply O. It is the third most abundant element in the universe and makes up about 21% of Earth\'s atmosphere. All animals need oxygen to survive.'),

  mcq('Which ancient civilisation built the pyramids?',
    'Egyptians','Romans','Greeks','Persians','🏛️',
    'The ancient Egyptians built the pyramids as tombs for their pharaohs. The Great Pyramid of Giza was built with about 2.3 million stone blocks, some weighing up to 80 tonnes!'),

  mcq('What is the name for the molten rock beneath Earth\'s crust?',
    'magma','lava','granite','basalt','🌋',
    'Magma is molten rock underground. When it erupts through a volcano and reaches the surface, it is called lava. Lava can flow at up to 60 km/h!'),

  mcq('What instrument measures temperature?',
    'thermometer','barometer','compass','anemometer','🌡️',
    'A thermometer measures temperature. A barometer measures air pressure, a compass measures direction, and an anemometer measures wind speed!'),

  mcq('Who is famous for discovering gravity when an apple fell?',
    'Isaac Newton','Albert Einstein','Galileo Galilei','Charles Darwin','🍎',
    'The story goes that seeing an apple fall inspired Newton to think about gravity in 1666. Whether the apple actually hit him on the head is probably a myth — but his laws of gravity were very real!'),

  mcq('What is the capital of Brazil?',
    'Brasília','São Paulo','Rio de Janeiro','Salvador','🇧🇷',
    'Many people think Rio de Janeiro is the capital — but it\'s Brasília! It was purpose-built and became the capital in 1960. São Paulo is Brazil\'s biggest city.'),

  mcq('What does DNA stand for?',
    'Deoxyribonucleic acid','Deoxyribose nuclear acid','Double nuclear acid','Digital nucleic acid',null,
    'DNA is the molecule that carries genetic instructions for all living things. Your DNA is so long that if uncoiled it would stretch from the Sun to Pluto and back — several times!'),

  mcq('Which element is a liquid at room temperature?',
    'mercury','iron','gold','silver','⚗️',
    'Mercury (Hg) is the only metal that is liquid at room temperature. It was once used in thermometers but is now avoided because it is highly toxic.'),

  mcq('What is the study of the stars and planets called?',
    'astronomy','astrology','geology','cosmology','🔭',
    'Astronomy is the scientific study of stars, planets, galaxies and the universe. Astrology (using stars to predict human events) is different and not considered a science.'),

  mcq('Who was William Shakespeare?',
    'An English playwright and poet','A scientist','A king of England','A painter','📜',
    'Shakespeare (1564–1616) is considered the greatest writer in the English language. He wrote about 37 plays and 154 sonnets. Many phrases we use today were invented by him!'),

  mcq('Which gas makes fizzy drinks bubbly?',
    'carbon dioxide','oxygen','nitrogen','helium','🥤',
    'Carbon dioxide (CO₂) is dissolved in fizzy drinks under pressure. When you open the bottle, the pressure drops and CO₂ escapes as bubbles — that\'s the fizz!'),

  mcq('What do we call energy from the Sun?',
    'solar energy','wind energy','nuclear energy','tidal energy','☀️',
    'Solar energy comes from the Sun\'s light and heat. Solar panels on rooftops convert sunlight directly into electricity. The Sun provides more energy in one hour than all humans use in a year!'),

  mcq('Which century did the Vikings live in?',
    '8th–11th century AD','4th–6th century AD','15th–17th century AD','2nd–4th century AD','⚔️',
    'The Viking Age lasted roughly from the late 700s to 1100 AD. Vikings were seafarers from Scandinavia who raided, traded and explored across Europe, reaching North America around 1000 AD!'),

  mcq('What is the chemical symbol for carbon?',
    'C','Ca','Cr','Co',null,
    'Carbon (C) is one of the most important elements in the universe — it is the basis of all life on Earth! Every living thing contains carbon, from bacteria to blue whales.'),

  mcq('How many chambers does the human heart have?',
    '4','2','3','6',null,
    'The heart has 4 chambers: left and right atria (upper) and left and right ventricles (lower). The right side pumps blood to the lungs; the left side pumps it to the rest of the body.'),

  mcq('What is the name of the world\'s longest wall?',
    'Great Wall of China','Hadrian\'s Wall','Berlin Wall','Walls of Babylon','🧱',
    'The Great Wall of China stretches over 21,000 km including all its branches. Hadrian\'s Wall, built by Romans across northern England, is an impressive 117 km long!'),

  mcq('What does a geologist study?',
    'rocks and Earth\'s structure','weather','stars','animals','🪨',
    'Geologists study rocks, minerals, and the processes that shape Earth. They help us find oil, gas, water and minerals, and warn communities about volcanic eruptions and earthquakes.'),

  mcq('Which country is Mount Fuji in?',
    'Japan','China','Nepal','South Korea','🗻',
    'Mount Fuji is Japan\'s highest mountain at 3,776 metres. It is an active volcano and one of Japan\'s most iconic symbols — it last erupted in 1707!'),

  mcq('What is Newton\'s second law (in simple terms)?',
    'Force = mass × acceleration','Energy cannot be created or destroyed','Every action has an equal reaction','Objects fall at the same rate',null,
    'F = ma means a bigger force causes greater acceleration. A heavier object needs more force to accelerate at the same rate as a lighter one — this is why trucks need bigger engines than cars!'),

  mcq('What is the name for animals with cold blood?',
    'ectotherms (cold-blooded)','endotherms','mammals','invertebrates',null,
    'Reptiles, fish and amphibians are ectotherms — they cannot generate their own body heat and rely on their environment. This is why lizards bask in the sun to warm up!'),

  mcq('Which famous nurse improved hospitals during the Crimean War?',
    'Florence Nightingale','Marie Curie','Ada Lovelace','Queen Victoria','🏥',
    'Florence Nightingale (1820–1910) revolutionised nursing. During the Crimean War she reduced death rates dramatically by improving cleanliness in hospitals. She is known as the founder of modern nursing.'),

  mcq('What is the full name of the UK?',
    'United Kingdom of Great Britain and Northern Ireland','United States of Great Britain','United Kingdoms of England','Great British Republic',null,
    'The full name is the United Kingdom of Great Britain and Northern Ireland! Great Britain is the island containing England, Scotland and Wales. Northern Ireland is on a separate island.'),

  mcq('Which planet spins on its side?',
    'Uranus','Neptune','Saturn','Venus','🌀',
    'Uranus is tilted at 98° — so it essentially rolls around the Sun on its side! Scientists think a huge collision billions of years ago knocked it over. Its moons orbit vertically!'),

  mcq('What is the capital of Russia?',
    'Moscow','St Petersburg','Kiev','Vladivostok','🇷🇺',
    'Moscow is Russia\'s capital and largest city. The Kremlin (a fortified complex) has been the seat of Russian power for centuries. Red Square in Moscow is one of the world\'s most famous public spaces.'),

  mcq('What are the three states of matter?',
    'solid, liquid, gas','hard, soft, wet','heavy, light, medium','metal, wood, plastic',null,
    'Matter exists as solid (fixed shape), liquid (takes shape of container) or gas (fills all available space). Temperature and pressure determine which state something is in. There is also a fourth state called plasma found in stars!'),

  mcq('Which explorer sailed around the world first?',
    'Ferdinand Magellan\'s expedition','Christopher Columbus','Vasco da Gama','Francis Drake','⛵',
    'Magellan led the first circumnavigation in 1519–1522, though he died in the Philippines. His crew of 18 completed the voyage. It proved once and for all that Earth is round and much larger than expected!'),
];}

/* ── Year 5 (Age 9–10) ─────────────────────────────────────── */
function gkYear5() { return [
  mcq('What is the powerhouse of the cell?',
    'mitochondria','nucleus','ribosome','vacuole',null,
    'Mitochondria produce ATP (energy) through cellular respiration. Fascinatingly, they have their own DNA — suggesting they were once separate bacteria billions of years ago!'),

  mcq('What is DNA?',
    'Genetic material in cells','A type of protein','A cell membrane','A type of sugar',null,
    'DNA (deoxyribonucleic acid) is found in every cell and carries your genetic instructions. Your entire DNA, uncoiled, would be about 2 metres long!'),

  mcq('In what year did man first land on the Moon?',
    '1969','1959','1979','1989','🌕',
    'Apollo 11 landed on the Moon on 20 July 1969. Neil Armstrong was first to walk on it, saying: "One small step for man, one giant leap for mankind."'),

  mcq('What is the Magna Carta (1215)?',
    'A document limiting the king\'s power','A battle','A type of castle','A royal wedding',null,
    'King John signed the Magna Carta under pressure from rebellious barons. It established that even kings must follow the law — a foundation of modern democracy.'),

  mcq('What is the capital of Canada?',
    'Ottawa','Toronto','Vancouver','Montreal','🇨🇦',
    'Many people guess Toronto or Vancouver — but Ottawa is Canada\'s capital! It was chosen as a compromise because both Toronto and Montreal wanted the honour.'),

  mcq('Which element has atomic number 1?',
    'Hydrogen','Helium','Lithium','Carbon',null,
    'Hydrogen is the lightest and most abundant element in the universe — making up about 75% of all normal matter. Stars are mostly hydrogen!'),

  mcq('What is the process of a solid turning into a gas called?',
    'sublimation','condensation','evaporation','melting',null,
    'Sublimation is when a solid turns directly into a gas without becoming liquid first. Dry ice (solid CO₂) sublimates at room temperature — that\'s the spooky fog you see at parties!'),

  mcq('What is the largest organ in the human body?',
    'skin','liver','brain','heart',null,
    'The skin is the body\'s largest organ — covering about 2 square metres in an adult! It protects us from infection, regulates temperature and lets us feel touch.'),

  mcq('Who was the first woman to win a Nobel Prize?',
    'Marie Curie','Florence Nightingale','Amelia Earhart','Rosalind Franklin',null,
    'Marie Curie won the Nobel Prize in Physics (1903) and Chemistry (1911) — the first person EVER to win two Nobel Prizes! She discovered the elements polonium and radium.'),

  mcq('What is the term for animals with a backbone?',
    'vertebrates','invertebrates','mammals','reptiles',null,
    'Vertebrates include fish, amphibians, reptiles, birds and mammals. About 97% of all animal species are actually invertebrates (without backbones) — like insects and worms!'),

  mcq('What is the capital of Egypt?',
    'Cairo','Alexandria','Luxor','Giza','🇪🇬',
    'Cairo is Africa\'s largest city with over 20 million people. It sits beside the River Nile, close to the famous ancient pyramids of Giza.'),

  mcq('What is a prime number?',
    'A number divisible only by 1 and itself','An even number','A square number','A multiple of 10',null,
    'Prime numbers have exactly two factors: 1 and themselves. Examples: 2, 3, 5, 7, 11, 13... The number 2 is special — it\'s the only EVEN prime number!'),

  mcq('Is Pluto a planet?',
    'No — it\'s a dwarf planet','Yes','Sometimes','Only at night',null,
    'In 2006, the International Astronomical Union reclassified Pluto as a "dwarf planet" because it hasn\'t cleared other objects from its orbital path — unlike the 8 true planets.'),

  mcq('What is the study of earthquakes called?',
    'seismology','geology','meteorology','vulcanology',null,
    'Seismologists use instruments called seismographs to detect and measure earthquake waves. The Richter scale measures how powerful an earthquake is.'),

  mcq('Who developed the theory of relativity?',
    'Einstein','Newton','Darwin','Galileo','🧠',
    'Einstein\'s special (1905) and general (1915) theories of relativity transformed our understanding of space, time and gravity. His equation E=mc² shows mass can be converted into huge amounts of energy.'),

  mcq('What is Charles Darwin famous for?',
    'Theory of evolution by natural selection','Inventing the telephone','Discovering penicillin','Laws of motion','🦎',
    'Darwin\'s 1859 book "On the Origin of Species" proposed that species change over time through natural selection — traits that help survival are passed on. It revolutionised biology!'),

  mcq('What is the human genome?',
    'The complete set of DNA in a human','A type of cell','A protein structure','A brain region',null,
    'The human genome contains about 3 billion base pairs of DNA encoding around 20,000–25,000 genes. The Human Genome Project completed mapping it in 2003 — a landmark achievement in science.'),

  mcq('Which planet takes the longest to orbit the Sun?',
    'Neptune','Saturn','Uranus','Jupiter','🌌',
    'Neptune takes about 165 Earth years to complete one orbit of the Sun! It was discovered in 1846 and has only completed slightly more than one orbit since its discovery.'),

  mcq('What is the process by which rocks are broken down by weather?',
    'weathering','erosion','sedimentation','metamorphism',null,
    'Weathering breaks rocks into smaller pieces through water, ice, wind and chemical reactions. Erosion then carries those pieces away. Together they shape mountains, valleys and coastlines over millions of years.'),

  mcq('What does "renewable energy" mean?',
    'Energy from sources that naturally replenish','Energy from burning coal','Nuclear power','Energy from oil',null,
    'Renewable energy comes from sources that won\'t run out — sun, wind, water, geothermal heat and tides. Fossil fuels (coal, oil, gas) are non-renewable because they take millions of years to form.'),

  mcq('Who wrote "Oliver Twist"?',
    'Charles Dickens','William Shakespeare','Jane Austen','Thomas Hardy','📖',
    'Charles Dickens (1812–1870) wrote Oliver Twist in 1837–1839. His novels highlighted the terrible poverty in Victorian England. Many of his stories were first published in magazines as serial episodes!'),

  mcq('What is the name for a change that cannot be reversed?',
    'irreversible change','reversible change','physical change','thermal change',null,
    'Irreversible changes permanently alter materials — burning wood, cooking an egg, rusting iron. Reversible changes can be undone — melting ice, dissolving salt. This is a key concept in Year 5 science!'),

  mcq('What is the capital of India?',
    'New Delhi','Mumbai','Kolkata','Bangalore','🇮🇳',
    'New Delhi became India\'s capital in 1911 when the British moved the capital from Calcutta (Kolkata). India is the world\'s most populous democracy with over 1.4 billion people!'),

  mcq('What does the word "democracy" mean?',
    'Rule by the people','Rule by a king','Rule by the army','Rule by priests',null,
    'Democracy comes from the Greek "demos" (people) and "kratos" (rule). Ancient Athens had the world\'s first democracy around 500 BC. In a democracy, citizens vote for their representatives.'),

  mcq('What is the function of the lungs?',
    'Exchange oxygen and carbon dioxide','Filter blood','Digest food','Pump blood',null,
    'The lungs are where gas exchange happens: oxygen from the air passes into the blood, and carbon dioxide (a waste product) passes out. Each lung contains about 300 million tiny air sacs called alveoli!'),

  mcq('Which war ended with the Treaty of Versailles in 1919?',
    'World War I','World War II','Crimean War','Boer War',null,
    'The Treaty of Versailles officially ended WWI in 1919. It imposed harsh penalties on Germany, including war reparations and loss of territory. Many historians argue it helped cause World War II!'),

  mcq('What is the chemical formula for carbon dioxide?',
    'CO₂','CO','C₂O','CO₃',null,
    'CO₂ has one carbon atom bonded to two oxygen atoms. It is produced when we breathe out and when fossil fuels burn. Increasing CO₂ in the atmosphere is the main driver of climate change.'),

  mcq('Who was Queen Victoria?',
    'British queen who reigned 1837–1901','First Queen of England','Queen during World War II','First female Prime Minister',null,
    'Queen Victoria reigned for 63 years — the longest British reign until Queen Elizabeth II surpassed it. The "Victorian era" saw the Industrial Revolution, massive expansion of the British Empire and huge changes in society.'),

  mcq('What does a circuit need to work?',
    'A complete loop with a power source','Just a battery','Only wire','A magnet',null,
    'An electrical circuit needs a complete, unbroken loop from the power source, through the components and back. If there is a gap (like an open switch), no current flows and the circuit is broken!'),

  mcq('What is the Trojan War from Greek mythology?',
    'A war fought over the city of Troy','A battle between gods','A Roman invasion','A sea battle',null,
    'According to legend, the Trojan War began when Paris of Troy took Helen from King Menelaus of Sparta. The Greeks used the famous "Trojan Horse" — a hollow wooden horse hiding soldiers — to win.'),

  mcq('What is the largest rainforest in the world?',
    'Amazon','Congo','Borneo','Daintree','🌳',
    'The Amazon Rainforest covers about 5.5 million km² across South America. It contains about 10% of all species on Earth and plays a crucial role in regulating the global climate.'),

  mcq('Which gas do we exhale more of than we inhale?',
    'carbon dioxide','oxygen','nitrogen','argon',null,
    'We breathe in 21% oxygen and breathe out about 16% oxygen. But we exhale about 4% CO₂ compared to just 0.04% inhaled. Our bodies generate CO₂ as a waste product of making energy.'),

  mcq('What event in 1066 changed England forever?',
    'Norman Conquest (Battle of Hastings)','Viking invasion','Roman departure','Magna Carta',null,
    'In 1066, William the Conqueror of Normandy defeated King Harold at the Battle of Hastings and became King of England. This brought French language, culture and feudalism to England — forever changing the country!'),

  mcq('What is the difference between an asteroid and a comet?',
    'Asteroids are rock; comets have ice and grow a tail near the Sun','Asteroids are bigger','Comets are found between planets','They are the same thing',null,
    'Asteroids are rocky objects, mostly in the asteroid belt between Mars and Jupiter. Comets are icy bodies from the outer solar system — when they approach the Sun, the ice vaporises creating a glowing tail!'),

  mcq('What is adaptation in biology?',
    'A feature that helps an organism survive in its environment','When animals change their diet','Migration to a warmer country','The process of reproduction',null,
    'Adaptations are inherited features shaped by natural selection over thousands of years. A polar bear\'s thick white fur, a cactus\'s water-storing stem, and a duck\'s webbed feet are all adaptations!'),

  mcq('Which empire was the largest in history?',
    'British Empire','Roman Empire','Mongol Empire','Ottoman Empire','🗺️',
    'At its peak in 1920, the British Empire covered about 24% of Earth\'s land and contained about 23% of the world population — the largest empire in history. The Mongol Empire was the largest contiguous land empire.'),

  mcq('What are tectonic plates?',
    'Huge sections of Earth\'s crust that move slowly','Layers of rock in mountains','Types of earthquakes','Ancient rock formations',null,
    'Earth\'s crust is broken into about 15 major tectonic plates that float on the hot mantle below. Their movement (just a few centimetres per year) causes earthquakes, volcanoes and builds mountain ranges!'),

  mcq('What does "fossil fuel" mean?',
    'Fuel formed from ancient living organisms','Fuel dug up near fossils','Nuclear fuel','Solar fuel',null,
    'Coal, oil and natural gas are fossil fuels — formed from the remains of plants and animals that died hundreds of millions of years ago. Burning them releases CO₂ that was stored long ago.'),

  mcq('Who was Nelson Mandela?',
    'South African leader who fought against apartheid','First President of USA','British Prime Minister','UN Secretary General','✊',
    'Nelson Mandela spent 27 years in prison for resisting apartheid (racial segregation) in South Africa. After his release, he became South Africa\'s first democratically elected president in 1994 and won the Nobel Peace Prize.'),

  mcq('What is an ecosystem?',
    'A community of living things and their environment','A type of habitat','A food chain','A classification system',null,
    'An ecosystem includes all the living organisms in an area plus the non-living elements (soil, water, air, sunlight) they interact with. Rainforests, coral reefs and ponds are all ecosystems.'),

  mcq('What does the heart rate measure?',
    'How many times the heart beats per minute','Blood pressure','The size of the heart','How much blood flows',null,
    'A normal resting heart rate for children is 70–100 beats per minute. Exercise makes your heart beat faster to deliver more oxygen to muscles. Athletes often have lower resting heart rates because their hearts are stronger!'),

  mcq('What is the significance of the year 1776 in history?',
    'USA declared independence from Britain','French Revolution began','Magna Carta signed','World War I began',null,
    'On 4 July 1776, the thirteen American colonies declared independence from Britain, forming the United States of America. The Declaration of Independence was largely written by Thomas Jefferson. 4th July is still celebrated as Independence Day!'),

  mcq('What does photosynthesis produce besides glucose?',
    'oxygen','carbon dioxide','water vapour','nitrogen',null,
    'Photosynthesis uses CO₂ + water + light energy to make glucose + OXYGEN. The oxygen is released as a by-product — which is the oxygen we breathe! This is why protecting forests is so vital.'),

  mcq('What is the difference between weathering and erosion?',
    'Weathering breaks rocks down; erosion moves the pieces away','They are the same process','Erosion happens faster','Weathering only happens at the coast',null,
    'Weathering is the breakdown of rock in place (by rain, ice, chemicals). Erosion is the transport of those broken pieces by rivers, glaciers or wind. Together they sculpt Earth\'s dramatic landscapes over millions of years.'),
];}

/* ── Year 6 (Age 10–11) ────────────────────────────────────── */
function gkYear6() { return [
  mcq('What is the UN?',
    'United Nations — an international peace organisation','A sports league','An American school','A type of government',null,
    'The United Nations was founded in 1945 after WWII to promote international peace, security and cooperation. It has 193 member states and its headquarters is in New York.'),

  mcq('Who wrote "Romeo and Juliet"?',
    'William Shakespeare','Charles Dickens','Jane Austen','Geoffrey Chaucer','📜',
    'Shakespeare wrote about 37 plays including Hamlet, Macbeth and A Midsummer Night\'s Dream. Romeo and Juliet was written around 1594–1596.'),

  mcq('What was the Cold War?',
    'Political tension between USA and USSR (1947–1991)','A war fought in Arctic','A climate period','A trade dispute',null,
    'The Cold War lasted from 1947–1991 between the USA and Soviet Union. It was "cold" because the two superpowers never directly fought each other — instead competing in arms, space and politics.'),

  mcq('What is GDP?',
    'Gross Domestic Product — total value of a country\'s output','Government Debt Policy','Global Defence Plan','General Data Protocol',null,
    'GDP measures all goods and services produced by a country in a year. It\'s the most widely used way to compare how big and productive different economies are.'),

  mcq('What is the pH of pure water?',
    '7','0','14','5',null,
    'The pH scale runs 0–14. Pure water is neutral at pH 7. Below 7 is acidic (lemon juice = 2), above 7 is alkaline (bleach = 13). Understanding pH is crucial in chemistry and biology.'),

  mcq('What is Newton\'s third law?',
    'Every action has an equal and opposite reaction','Objects in motion stay in motion','Force = mass × acceleration','Gravity is universal',null,
    'If you push against a wall, the wall pushes back with equal force. This is why rockets work — exhaust gases are pushed downward, so the rocket is pushed upward!'),

  mcq('Who was the first President of the USA?',
    'George Washington','Abraham Lincoln','Thomas Jefferson','John Adams',null,
    'George Washington was unanimously elected the first US President in 1789 and served two terms until 1797. He is often called the "Father of His Country".'),

  mcq('What is the Pythagorean theorem?',
    'a² + b² = c²','a + b = c','a × b = c²','a² − b² = c',null,
    'In any right-angled triangle, the square of the longest side (hypotenuse, c) equals the sum of the squares of the other two sides. Pythagoras proved this around 570 BC!'),

  mcq('What is the capital of South Africa?',
    'Pretoria (executive)','Cape Town','Johannesburg','Durban','🇿🇦',
    'South Africa uniquely has THREE capitals: Pretoria (where the President works), Cape Town (Parliament) and Bloemfontein (the courts). Pretoria is the executive capital.'),

  mcq('What causes the seasons on Earth?',
    'Earth\'s axial tilt','Distance from the Sun','The Moon\'s pull','Solar flares',null,
    'Earth is tilted at 23.5°. When the Northern Hemisphere tilts toward the Sun, it receives more direct sunlight — summer! The Earth\'s distance from the Sun barely changes throughout the year.'),

  mcq('What is osmosis?',
    'Movement of water through a semi-permeable membrane','A type of cell division','Breaking down food','A kind of energy transfer',null,
    'Osmosis is how water moves from a less concentrated solution to a more concentrated one through a membrane. It\'s how plant roots absorb water from soil!'),

  mcq('Who discovered penicillin?',
    'Alexander Fleming','Louis Pasteur','Marie Curie','Edward Jenner',null,
    'In 1928, Fleming noticed that mould on a petri dish was killing bacteria. This accidental discovery led to penicillin — the first antibiotic, which has saved hundreds of millions of lives.'),

  mcq('What is the International Space Station?',
    'A habitable satellite orbiting Earth','A space telescope','A rocket launch site','A type of satellite',null,
    'The ISS has been continuously inhabited since November 2000. It orbits Earth at about 400 km up, travelling at 28,000 km/h — completing a full orbit every 90 minutes!'),

  mcq('What is the greenhouse effect?',
    'Trapping of heat by atmospheric gases','A gardening method','Cooling of the planet','A cloud formation',null,
    'Greenhouse gases (CO₂, methane, water vapour) absorb heat and stop it escaping to space. Without ANY greenhouse effect, Earth would be −18°C and uninhabitable — but too much causes global warming.'),

  mcq('What language has the most native speakers?',
    'Mandarin Chinese','English','Spanish','Hindi',null,
    'Over 900 million people speak Mandarin as their first language. English has more TOTAL speakers when you include people who speak it as a second language.'),

  mcq('What is inflation in economics?',
    'The rate at which prices rise over time','When prices fall','When a country grows economically','When a currency loses its value suddenly',null,
    'Inflation measures how much more expensive goods and services become over time. Central banks (like the Bank of England) try to keep inflation around 2% per year — too high causes problems, but deflation (falling prices) can also be harmful!'),

  mcq('What was apartheid?',
    'Racial segregation in South Africa','A type of government','A form of trade','A religious belief',null,
    'Apartheid ("separateness" in Afrikaans) was the system of racial segregation in South Africa from 1948–1994. Non-white citizens were denied basic rights. International pressure and the work of Nelson Mandela helped end it.'),

  mcq('What is the law of conservation of energy?',
    'Energy cannot be created or destroyed — only transformed','Energy is always lost as heat','The Sun creates new energy','Energy decreases over time',null,
    'Energy can change form — chemical to kinetic, electrical to light — but the total always stays the same. This fundamental law underlies all of physics and chemistry. It was formalised in the mid-19th century.'),

  mcq('Who was Winston Churchill?',
    'British Prime Minister during World War II','US President during WWII','Founder of the UN','First man on the Moon',null,
    'Churchill was Prime Minister 1940–1945 and 1951–1955. His inspirational speeches and defiant leadership helped Britain and its allies defeat Nazi Germany. He also won the Nobel Prize for Literature in 1953!'),

  mcq('What is the difference between an acid and an alkali?',
    'Acids have pH below 7; alkalis have pH above 7','Acids are harmless; alkalis are dangerous','Acids are liquids; alkalis are solids','They are the same thing',null,
    'Acids (lemon juice, vinegar) are pH 0–6; alkalis (baking soda, bleach) are pH 8–14; neutral is 7. They react together in a neutralisation reaction to form a salt and water — this is used in everything from antacid tablets to making soap!'),

  mcq('What is natural selection?',
    'Organisms best adapted to their environment are more likely to survive and reproduce','Animals choose their habitat','Plants selecting their nutrients','Random changes in species',null,
    'Darwin\'s theory: if a random mutation makes an organism better suited to its environment, it survives longer and passes on that trait. Over millions of years this drives the evolution of new species — the foundation of modern biology.'),

  mcq('What caused the French Revolution (1789)?',
    'Inequality, poverty and weak royal government','Foreign invasion','A plague','A religious dispute',null,
    'The French Revolution overthrew the monarchy amid widespread poverty and inequality. The people were starving while the nobility lived in luxury. The revolution introduced ideals of liberty, equality and brotherhood that influenced democracies worldwide.'),

  mcq('What is the cerebrum?',
    'The largest part of the brain, responsible for thought and decision-making','The brain stem','The spinal cord','The cerebellum',null,
    'The cerebrum makes up about 85% of total brain weight. It handles thinking, language, memory, creativity and voluntary movement. It is divided into two hemispheres connected by a bundle of nerve fibres.'),

  mcq('What does biodiversity mean?',
    'The variety of life in an ecosystem or on Earth','The total number of animals','The study of plants only','How fast species evolve',null,
    'High biodiversity (many different species) makes ecosystems more resilient and stable. Human activity is currently causing the fastest mass extinction since the dinosaurs — scientists call it the "biodiversity crisis".'),

  mcq('What is supply and demand?',
    'When supply is high and demand low, prices fall — and vice versa','Government control of prices','The stock market','Inflation',null,
    'Supply and demand is the core principle of economics. If something becomes scarce (low supply) but people still want it (high demand), its price rises. If there\'s plenty of it but few want it, prices fall.'),

  mcq('What is the structure of an atom?',
    'A nucleus of protons and neutrons surrounded by electrons','A nucleus of electrons surrounded by protons','Protons only','Neutrons in a cloud',null,
    'Atoms are mostly empty space! The tiny nucleus contains protons (positive) and neutrons (neutral). Electrons (negative) orbit in shells far from the nucleus. The number of protons determines which element an atom is.'),

  mcq('Who was Mahatma Gandhi?',
    'Indian leader who used non-violent protest against British rule','First Prime Minister of India','A religious leader only','An Indian scientist','✊',
    'Gandhi (1869–1948) led India\'s independence movement using peaceful civil disobedience — boycotts, marches and strikes. His methods inspired civil rights leaders worldwide, including Martin Luther King Jr. India gained independence in 1947.'),

  mcq('What is a black hole?',
    'A region of space with gravity so strong not even light can escape','A hole in space','An exploded star','A type of nebula','🌌',
    'Black holes form when massive stars collapse at the end of their lives. Their gravity is so intense that nothing — not even light — can escape beyond the event horizon. The first image of a black hole was captured in 2019!'),

  mcq('What was the Industrial Revolution?',
    'The shift from hand production to machine manufacturing (1760s–1840s)','A political revolution','A war','A scientific movement',null,
    'Britain led the Industrial Revolution — powered by steam engines, factories replaced cottage industries. This created cities, railways, and modern capitalism. It also caused terrible working conditions that led to labour reforms and trade unions.'),

  mcq('What does "per capita" mean?',
    'Per person','Per country','Per year','Per household',null,
    '"Per capita" is Latin for "per head". It is used to compare countries of different sizes fairly — for example GDP per capita divides a country\'s total output by its population to show average wealth.'),

  mcq('What is a hypothesis in science?',
    'A testable prediction or explanation for an observation','A proven fact','The conclusion of an experiment','A research paper',null,
    'The scientific method follows: observe, form a hypothesis, design experiment, collect data, analyse results, conclude. A good hypothesis must be TESTABLE and FALSIFIABLE — you must be able to prove it wrong if it is wrong.'),

  mcq('What is globalisation?',
    'The increasing interconnection of the world\'s economies and cultures','A political system','A type of trade','When countries share borders',null,
    'Globalisation means goods, ideas, money and people move more easily across the world. It has raised living standards in many countries but has also been criticised for harming local industries and increasing inequality.'),

  mcq('What is the role of the UK Parliament?',
    'To make laws and scrutinise the government','To run the army','To manage the economy','To control the courts',null,
    'The UK Parliament has two chambers: the elected House of Commons and the appointed House of Lords. Parliament makes laws, approves taxes and holds the Government to account. The monarch formally opens Parliament but has a ceremonial role.'),

  mcq('What is the difference between climate and weather?',
    'Weather is day-to-day; climate is long-term patterns','They are the same thing','Climate changes daily','Weather is measured over centuries',null,
    '"Climate is what you expect; weather is what you get." Weather is the current conditions (today\'s rain). Climate is the average over decades. Climate change refers to long-term shifts in these patterns caused by human activity.'),

  mcq('Who wrote "1984" and what is it about?',
    'George Orwell — a dystopian novel about a totalitarian surveillance state','Charles Dickens — Victorian poverty','Jane Austen — society and marriage','H.G. Wells — time travel','📖',
    'George Orwell wrote "1984" in 1949. It depicts a terrifying future where "Big Brother" watches everyone constantly. The novel coined phrases like "doublethink" and "Newspeak" and remains a powerful warning about government overreach.'),

  mcq('What is the role of enzymes in digestion?',
    'They are biological catalysts that break down food molecules','They produce energy','They fight bacteria','They carry oxygen',null,
    'Enzymes are proteins that speed up chemical reactions. Digestive enzymes break large food molecules into small ones: amylase breaks starch, protease breaks protein, and lipase breaks fat. Each enzyme works best at a specific temperature and pH.'),

  mcq('What is the significance of the Human Rights Act (1998) in the UK?',
    'It makes European Convention on Human Rights enforceable in UK courts','It created the NHS','It gave women the vote','It abolished slavery',null,
    'The Human Rights Act incorporated the European Convention on Human Rights into UK law. It protects rights like the right to life, freedom from torture, right to a fair trial and freedom of expression. UK courts can now rule on human rights cases directly.'),

  mcq('What is meant by the term "carbon footprint"?',
    'The total greenhouse gas emissions caused by an individual or organisation','The size of a country\'s carbon output','The amount of CO₂ in the atmosphere','A measure of deforestation',null,
    'Your carbon footprint includes emissions from energy use, travel, food and shopping. Reducing carbon footprints is key to addressing climate change. Individuals, companies and governments all have roles to play in this global challenge.'),

  mcq('What was the significance of the Suffragette movement?',
    'Women campaigning for the right to vote in the early 20th century','Women fighting for better wages','A movement for women\'s education','A religious movement',null,
    'Suffragettes (like Emmeline Pankhurst and her daughters) campaigned vigorously — hunger strikes, chaining to railings, marches — for women\'s voting rights. In 1918, British women over 30 got the vote; by 1928 all women over 21 could vote.'),

  mcq('What is the difference between renewable and non-renewable resources?',
    'Renewable resources replenish naturally; non-renewable ones take millions of years to form','Renewables are more expensive','Non-renewables are better for environment','They are both unlimited',null,
    'Renewable resources (solar, wind, water) will not run out on human timescales. Non-renewables (coal, oil, gas) formed over millions of years and once used are gone. The transition to renewables is central to tackling climate change.'),

  mcq('What is a democracy and how does the UK practice it?',
    'Government by the people, through elected representatives','Government by a king','Government by experts','A religious government',null,
    'The UK is a representative democracy — citizens vote for MPs who represent them in Parliament. The party with the most MPs forms the government. The Prime Minister is the head of government. The UK also has a constitutional monarchy.'),

  mcq('What is genetics?',
    'The study of genes and heredity','The study of behaviour','The study of cells','The study of evolution only',null,
    'Genetics explains why children resemble their parents. Genes (sections of DNA) are passed from parents to children. Gregor Mendel\'s 19th-century pea plant experiments laid the foundation for genetics long before DNA was even discovered.'),

  mcq('What is the significance of the Big Bang theory?',
    'It describes the origin of the universe about 13.8 billion years ago','It explains volcanic eruptions','It describes the formation of planets','It explains the expansion of oceans',null,
    'The Big Bang theory is the scientific explanation for the origin and evolution of the universe. About 13.8 billion years ago, all matter, energy, space and time emerged from an incredibly hot, dense point and has been expanding ever since.'),
];}
