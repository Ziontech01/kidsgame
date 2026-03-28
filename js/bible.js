// Happy Games – Bible Quiz Engine
// Topic-based: Old Testament / New Testament / Parables / Life of Jesus / Bible Facts / Mix All
'use strict';

const BibleQuiz = (() => {

  /* ── Question bank ─────────────────────────────────────────── */
  const ALL_QUESTIONS = [
    // ── OLD TESTAMENT ──────────────────────────────────────────
    { topic:'old', q:"Who did God ask to build a giant boat to save animals from a flood?",
      answers:["Noah","Moses","Abraham","David"], correct:0,
      why:"God asked Noah to build the Ark. Noah trusted and obeyed God, and saved his family and two of every animal. It shows that faith and obedience matter even when things seem impossible.",
      verse:"Genesis 6–9" },

    { topic:'old', q:"Joseph was sold by his brothers, but God used this to make him what?",
      answers:["A ruler in Egypt","A king in Canaan","A priest in Jerusalem","A shepherd in Babylon"], correct:0,
      why:"Joseph's brothers were jealous and sold him as a slave, but God had a plan! Joseph interpreted Pharaoh's dreams and became second-in-command of Egypt — and later saved his whole family. God can turn bad things into something good!",
      verse:"Genesis 37–50" },

    { topic:'old', q:"Baby Moses was placed in a basket on which river to save his life?",
      answers:["The River Nile","The River Jordan","The River Euphrates","The River Tigris"], correct:0,
      why:"Moses's mother hid him in a basket among the reeds of the Nile to save him from Pharaoh's soldiers. Pharaoh's daughter found him and raised him as her own. God protected Moses for a very special purpose — to lead God's people to freedom!",
      verse:"Exodus 2" },

    { topic:'old', q:"What did God use to speak to Moses at Mount Horeb?",
      answers:["A burning bush that didn't burn up","A rainbow in the sky","Thunder and lightning only","A talking animal"], correct:0,
      why:"God appeared to Moses in a miraculous burning bush — on fire, but not destroyed! Moses took off his sandals because the ground was holy. God then gave Moses the mission to set the Israelites free from slavery in Egypt.",
      verse:"Exodus 3" },

    { topic:'old', q:"Young David defeated the giant warrior Goliath using which weapon?",
      answers:["A sling and one stone","A sword","A spear","A bow and arrow"], correct:0,
      why:"David was just a shepherd boy with no armour, but he trusted God completely. He chose 5 smooth stones and used his sling to defeat the giant Goliath. This teaches us: with God, we can face our biggest fears and challenges.",
      verse:"1 Samuel 17" },

    { topic:'old', q:"Jonah tried to run away from God and ended up where?",
      answers:["Inside a large fish for 3 days","On top of a mountain","In a desert for 40 days","In prison in Babylon"], correct:0,
      why:"Jonah boarded a ship to escape God's mission, but God sent a storm and Jonah was thrown overboard — then swallowed by a large fish! He prayed and was released. Jonah then went to Nineveh and the whole city repented. We cannot hide from God's plans!",
      verse:"Jonah 1–4" },

    { topic:'old', q:"Which food did God send from heaven to feed the Israelites in the desert?",
      answers:["Manna — a bread-like food that appeared each morning","Roasted chicken fell from clouds","Fruit rained down from trees","Fish jumped out of the desert sand"], correct:0,
      why:"God fed the Israelites with manna (a small, white, bread-like food) and quail every day in the desert for 40 years! It appeared fresh each morning and showed that God provides for His people's needs day by day. Jesus later called Himself the 'bread of life'.",
      verse:"Exodus 16" },

    { topic:'old', q:"Which wise king built the first Temple in Jerusalem?",
      answers:["Solomon","David","Saul","Josiah"], correct:0,
      why:"King Solomon — David's son — was given extraordinary wisdom by God and built the magnificent Temple in Jerusalem. When God offered Solomon anything he wanted, Solomon asked for wisdom to lead well. What a great prayer!",
      verse:"1 Kings 6–8" },

    { topic:'old', q:"What did Daniel do three times a day that got him thrown into a lions' den?",
      answers:["Prayed to God by his open window","Read from the scrolls","Sang praises out loud","Refused to eat the king's food"], correct:0,
      why:"Daniel's enemies tricked King Darius into making prayer to anyone except the king illegal. Daniel kept praying to God anyway — three times a day as always. He was thrown into a den of lions, but God shut the lions' mouths and Daniel was completely unharmed!",
      verse:"Daniel 6" },

    { topic:'old', q:"Ruth said to Naomi: 'Where you go, I will go.' What is special about Ruth?",
      answers:["She was loyal to family even after her husband died, and became an ancestor of Jesus","She was the first female judge of Israel","She was the mother of Samuel","She defeated an enemy army by herself"], correct:0,
      why:"Ruth's loyalty to her mother-in-law Naomi is a beautiful example of faithful, selfless love. She left her own country and people to care for Naomi. God blessed her greatly — she married Boaz and became the great-grandmother of King David, and an ancestor of Jesus!",
      verse:"Book of Ruth" },

    // ── NEW TESTAMENT ──────────────────────────────────────────
    { topic:'new', q:"Where was Jesus born?",
      answers:["In a manger in Bethlehem","In a palace in Jerusalem","In a house in Nazareth","In a synagogue in Capernaum"], correct:0,
      why:"Jesus — the King of Kings — was born not in a palace but in a humble stable, in a manger (an animal feeding box). This was because there was no room at the inn. Prophets had predicted Bethlehem hundreds of years before! Great things often come from humble beginnings.",
      verse:"Luke 2:1–7" },

    { topic:'new', q:"What gifts did the Wise Men bring to baby Jesus?",
      answers:["Gold, frankincense and myrrh","Silver, spices and silk","Food, water and clothing","A lamb, oil and incense"], correct:0,
      why:"Each gift had deep meaning: Gold (for a King), Frankincense (for God — used in worship), Myrrh (used in burial — pointing to Jesus's future sacrifice). The Wise Men's gifts showed who Jesus truly was: King, God, and Saviour.",
      verse:"Matthew 2:1–12" },

    { topic:'new', q:"How many disciples did Jesus choose to be his closest followers?",
      answers:["12","7","3","40"], correct:0,
      why:"Jesus chose 12 disciples — matching the 12 tribes of Israel. They were ordinary people: fishermen, a tax collector, a zealot. Jesus showed that God can use ANYONE to do extraordinary things. The 12 later spread the good news to the whole world!",
      verse:"Matthew 10:1–4" },

    { topic:'new', q:"What was the first miracle Jesus performed?",
      answers:["Turning water into wine at a wedding in Cana","Walking on water in the Sea of Galilee","Feeding 5,000 people with 5 loaves and 2 fish","Raising Lazarus from the dead"], correct:0,
      why:"At a wedding, the wine ran out — embarrassing for the host! Mary told Jesus, and He turned 6 huge jars of water into the finest wine. This was His first miracle. It shows Jesus cares about everyday situations, and that nothing is impossible for Him.",
      verse:"John 2:1–11" },

    { topic:'new', q:"How many people did Jesus feed with only 5 loaves and 2 fish?",
      answers:["About 5,000 men (plus women and children)","500 people","50 people","Exactly 12 people"], correct:0,
      why:"A boy gave Jesus his small lunch of 5 loaves and 2 fish. Jesus blessed it, broke it, and it fed around 5,000 men — plus women and children, so perhaps 15,000–20,000 people total. With 12 baskets of leftovers! Nothing is too small in God's hands.",
      verse:"John 6:1–14" },

    { topic:'new', q:"On which day did Jesus rise from the dead?",
      answers:["The third day (Sunday)","The next day (Saturday)","Seven days later","Forty days later"], correct:0,
      why:"Jesus died on Good Friday, was buried, and rose on the THIRD day — Easter Sunday! This is the most important event in the Christian faith. Because Jesus defeated death, all who follow Him can have eternal life. That's why Christians celebrate Easter with such joy!",
      verse:"Luke 24:1–6" },

    { topic:'new', q:"What event happened at Pentecost, 50 days after Easter?",
      answers:["The Holy Spirit came on the disciples like tongues of fire","Jesus appeared to 500 people at once","The Temple in Jerusalem was rebuilt","The disciples were let out of prison by an angel"], correct:0,
      why:"At Pentecost, the disciples were together praying when the Holy Spirit came like a rushing wind and flames of fire. They were filled with power and could speak in languages they'd never learned! About 3,000 people believed that day. This is called the 'birthday of the Church'.",
      verse:"Acts 2" },

    // ── PARABLES ───────────────────────────────────────────────
    { topic:'parable', q:"In the Parable of the Prodigal Son, what did the father do when his lost son came home?",
      answers:["Ran to meet him, hugged him and threw a huge celebration","Told him off and made him sleep outside","Asked him to work as a servant first","Said 'I told you so' and turned him away"], correct:0,
      why:"The father RUNS — doesn't even wait for the son to arrive — hugs him, puts a ring on his finger and throws a party! This parable shows how much God loves us. No matter what we've done, God is always ready to welcome us home with open arms and enormous joy.",
      verse:"Luke 15:11–32" },

    { topic:'parable', q:"In the Parable of the Good Samaritan, who helped the injured man on the road?",
      answers:["A Samaritan (a foreigner despised by Jews)","A Jewish priest","A temple worker (Levite)","A Roman soldier"], correct:0,
      why:"A Jewish man was robbed, beaten and left. A priest walked past. A temple worker walked past. But a Samaritan — someone Jews considered an enemy — stopped, helped, paid for his care. Jesus's point: being a good neighbour means helping ANYONE in need, not just people like you.",
      verse:"Luke 10:25–37" },

    { topic:'parable', q:"In the Parable of the Lost Sheep, a shepherd leaves 99 sheep to find how many?",
      answers:["Just 1 lost sheep","10 lost sheep","5 lost sheep","Half the flock"], correct:0,
      why:"The shepherd leaves all 99 safe sheep and searches until he finds the ONE that was lost. When he finds it, he celebrates! Jesus explains: heaven celebrates just as much when even ONE person who was lost turns back to God. Every single person matters to God!",
      verse:"Luke 15:1–7" },

    { topic:'parable', q:"In the Parable of the Sower, what does the 'good soil' represent?",
      answers:["People who hear God's word, understand it and let it grow in their lives","The most fertile farming land in Israel","People who read the Bible but don't believe it","Christians who only go to church on special occasions"], correct:0,
      why:"Jesus told this parable to explain why some people receive His message and some don't. The 'good soil' represents people who truly hear and understand God's word, hold on to it, and it produces fruit (a changed, growing life) in their lives. What kind of soil are you?",
      verse:"Matthew 13:1–23" },

    // ── LIFE OF JESUS ──────────────────────────────────────────
    { topic:'jesus', q:"John the Baptist baptised Jesus in which river?",
      answers:["The River Jordan","The River Nile","The Sea of Galilee","The Dead Sea"], correct:0,
      why:"When Jesus was baptised in the Jordan, God's voice was heard saying 'This is my Son, whom I love; with him I am well pleased' and the Holy Spirit descended like a dove. This confirmed publicly who Jesus was — the Son of God — at the start of His ministry.",
      verse:"Matthew 3:13–17" },

    { topic:'jesus', q:"Jesus fasted and was tempted by the devil for how long in the wilderness?",
      answers:["40 days and 40 nights","7 days","1 year","3 days"], correct:0,
      why:"Immediately after His baptism, Jesus was led into the desert where He fasted and faced three powerful temptations from Satan. He defeated every temptation by quoting Scripture. The number 40 appears many times in the Bible as a time of testing and preparation.",
      verse:"Matthew 4:1–11" },

    { topic:'jesus', q:"Jesus said 'I am the way, the truth and the life.' What book of the Bible is this in?",
      answers:["John","Matthew","Luke","Acts"], correct:0,
      why:"In John 14:6, Jesus makes one of His most powerful statements. He says He — not a method or religion — is personally THE way to know God, THE truth about who God is, and the source of eternal LIFE. It's a direct claim to be God's Son.",
      verse:"John 14:6" },

    { topic:'jesus', q:"In which garden did Jesus pray the night He was arrested?",
      answers:["The Garden of Gethsemane","The Garden of Eden","A garden near Bethlehem","The Garden Tomb garden"], correct:0,
      why:"In Gethsemane, Jesus prayed 'Father, not my will but yours be done' — the most important prayer of surrender ever prayed. He was in anguish knowing what was coming, yet chose to obey God completely. His disciples fell asleep. Then Judas arrived with soldiers to arrest Him.",
      verse:"Luke 22:39–53" },

    // ── BIBLE FACTS ────────────────────────────────────────────
    { topic:'facts', q:"What is the shortest verse in the entire Bible?",
      answers:["'Jesus wept' — John 11:35","'God is love' — 1 John 4:8","'In the beginning' — Genesis 1:1","'Amen' — found throughout the Bible"], correct:0,
      why:"Just two words: 'Jesus wept'. Jesus was at the tomb of His friend Lazarus and wept before raising him back to life. This tiny verse reveals something huge: Jesus — fully God — was also fully human. He feels sadness, grief and compassion just as we do. He understands our tears.",
      verse:"John 11:35" },

    { topic:'facts', q:"What are the two greatest commandments according to Jesus?",
      answers:["Love God with everything you have AND love your neighbour as yourself","Go to church every week AND read the Bible daily","Never tell lies AND always keep your promises","Respect your parents AND share with others"], correct:0,
      why:"A teacher of the law asked Jesus to name the greatest commandment. Jesus gave TWO: love God completely (heart, soul, mind, strength) AND love your neighbour as yourself. He then said: ALL the other laws and commandments flow from these two. Love is the foundation of everything.",
      verse:"Matthew 22:36–40" },

    { topic:'facts', q:"The name 'Emmanuel' (given to Jesus) means what?",
      answers:["God with us","Son of David","Prince of Peace","Saviour of the World"], correct:0,
      why:"Emmanuel — 'God with us' — was prophesied by Isaiah about 700 years before Jesus was born (Isaiah 7:14). The most astonishing truth of Christmas: the God who created the entire universe chose to come and be WITH us, as one of us, in the person of Jesus.",
      verse:"Isaiah 7:14 / Matthew 1:23" },

    { topic:'facts', q:"The Bible is made up of how many books?",
      answers:["66 books (39 Old Testament + 27 New Testament)","100 books","52 books","33 books"], correct:0,
      why:"The Bible contains 66 books written by about 40 different authors over roughly 1,500 years! Yet it tells one connected story — God's plan to rescue and restore humanity. The Old Testament (39 books) points TOWARD Jesus; the New Testament (27 books) reveals Him.",
      verse:"The whole Bible!" }
  ];

  /* ── State ─────────────────────────────────────────────────── */
  let state = {};

  const TOPICS = [
    { id:'old',     name:'Old Testament', emoji:'🌍', color:'#d97706' },
    { id:'new',     name:'New Testament', emoji:'✝️',  color:'#2563eb' },
    { id:'parable', name:'Parables',      emoji:'📖', color:'#16a34a' },
    { id:'jesus',   name:'Life of Jesus', emoji:'⭐', color:'#7c3aed' },
    { id:'facts',   name:'Bible Facts',   emoji:'💡', color:'#db2777' },
    { id:'mix',     name:'Mix All Topics',emoji:'🎲', color:'#0ea5e9' }
  ];
  const QUESTIONS_PER_ROUND = 8;

  /* ── Public init ───────────────────────────────────────────── */
  function init() {
    state = { step:'topic', topic:null, questions:[], idx:0, score:0, startTime:null, answered:false };
    renderTopicScreen();
  }

  /* ── Topic selection ───────────────────────────────────────── */
  function renderTopicScreen() {
    getContainer().innerHTML = `
      <div style="max-width:680px;margin:0 auto;padding:0 16px 48px">

        <!-- Header -->
        <div style="text-align:center;padding:36px 20px 28px">
          <div style="font-size:4rem;margin-bottom:12px">📖</div>
          <div style="font-family:'Fredoka One',cursive;font-size:2.4rem;color:#1a1a2e;margin-bottom:8px">
            Bible Quiz
          </div>
          <div style="color:#6b7280;font-size:1rem;font-weight:600">
            Choose a topic to explore!
          </div>
        </div>

        <!-- Topic grid -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));
                    gap:16px;justify-items:stretch">
          ${TOPICS.map(t => {
            const count = t.id==='mix' ? ALL_QUESTIONS.length
                                       : ALL_QUESTIONS.filter(q=>q.topic===t.id).length;
            return `
            <button onclick="BibleQuiz._selectTopic('${t.id}')"
              style="background:${t.color};color:#fff;border:none;border-radius:18px;
                     padding:24px 14px;text-align:center;cursor:pointer;
                     box-shadow:0 6px 20px rgba(0,0,0,.2);
                     transition:transform .2s,box-shadow .2s;
                     font-family:'Nunito',sans-serif;width:100%"
              onmouseover="this.style.transform='translateY(-5px)';this.style.boxShadow='0 10px 28px rgba(0,0,0,.3)'"
              onmouseout="this.style.transform='';this.style.boxShadow='0 6px 20px rgba(0,0,0,.2)'">
              <div style="font-size:2.6rem;margin-bottom:10px">${t.emoji}</div>
              <div style="font-size:1.05rem;font-weight:800;margin-bottom:6px">${t.name}</div>
              <div style="font-size:.82rem;opacity:.85;background:rgba(0,0,0,.15);
                          border-radius:20px;padding:3px 10px;display:inline-block">
                ${count} question${count!==1?'s':''}
              </div>
            </button>`;
          }).join('')}
        </div>
      </div>`;
    hideLoading();
  }

  /* ── Start quiz ────────────────────────────────────────────── */
  function _selectTopic(id) {
    window.SFX?.play('click');
    const pool = id === 'mix' ? ALL_QUESTIONS :
                 ALL_QUESTIONS.filter(q => q.topic === id);
    state.topic = id;
    state.questions = shuffle(pool).slice(0, QUESTIONS_PER_ROUND);
    state.idx = 0;
    state.score = 0;
    state.startTime = Date.now();
    state.answered = false;
    renderQuestion();
  }

  /* ── Question screen ───────────────────────────────────────── */
  function renderQuestion() {
    state.answered = false;
    const q = state.questions[state.idx];
    const topicObj = TOPICS.find(t => t.id === state.topic) || TOPICS[5];
    const pct = (state.idx / state.questions.length) * 100;
    getContainer().innerHTML = `
      <div style="max-width:660px;margin:0 auto;padding-bottom:40px">

        <!-- Coloured topic header -->
        <div style="background:${topicObj.color};color:#fff;display:flex;align-items:center;
                    gap:14px;padding:16px 20px;flex-wrap:wrap">
          <span style="font-size:2rem;flex-shrink:0">${topicObj.emoji}</span>
          <div style="flex:1;min-width:140px">
            <div style="font-family:'Fredoka One',cursive;font-size:1.2rem">${topicObj.name}</div>
            <div style="font-size:.8rem;opacity:.9">
              Question ${state.idx + 1} / ${state.questions.length} &nbsp;·&nbsp; ⭐ ${state.score} pts
            </div>
          </div>
          <!-- Progress bar -->
          <div style="width:100%;background:rgba(255,255,255,.3);border-radius:99px;height:7px;margin-top:4px">
            <div style="background:#fff;border-radius:99px;height:7px;width:${pct}%;transition:width .4s"></div>
          </div>
        </div>

        <!-- Question card -->
        <div style="background:#fff;border-radius:0 0 18px 18px;box-shadow:0 6px 24px rgba(0,0,0,.1);
                    padding:24px 20px 20px;margin-bottom:16px">
          <div style="display:inline-block;background:#f3f4f6;border-radius:8px;padding:3px 10px;
                      font-size:.78rem;color:#6b7280;font-style:italic;margin-bottom:14px">
            📜 ${q.verse}
          </div>
          <div style="font-size:1.2rem;font-weight:800;color:#1a1a2e;line-height:1.5">
            ${q.q}
          </div>
        </div>

        <!-- Answer buttons -->
        <div style="display:flex;flex-direction:column;gap:10px;padding:0 16px">
          ${q.answers.map((a,i) => `
            <button id="ans-${i}" onclick="BibleQuiz._answer(${i})"
              style="display:flex;align-items:center;gap:14px;padding:14px 16px;
                     border-radius:14px;border:2px solid #e5e7eb;background:#fff;
                     cursor:pointer;text-align:left;font-family:'Nunito',sans-serif;
                     font-size:.97rem;font-weight:700;color:#1a1a2e;
                     box-shadow:0 2px 8px rgba(0,0,0,.05);transition:all .18s;width:100%"
              onmouseover="this.style.borderColor='${topicObj.color}';this.style.transform='translateX(4px)'"
              onmouseout="if(!this.disabled){this.style.borderColor='#e5e7eb';this.style.transform=''}">
              <span style="width:32px;height:32px;border-radius:50%;background:${topicObj.color};
                           color:#fff;font-size:.85rem;font-weight:800;display:flex;
                           align-items:center;justify-content:center;flex-shrink:0">
                ${'ABCD'[i]}
              </span>
              <span style="flex:1">${a}</span>
            </button>`).join('')}
        </div>

        <div id="feedback-box" style="display:none;padding:0 16px;margin-top:14px"></div>
      </div>`;
  }

  /* ── Answer handling ───────────────────────────────────────── */
  function _answer(chosen) {
    if (state.answered) return;
    state.answered = true;
    const q = state.questions[state.idx];
    const correct = chosen === q.correct;
    if (correct) { state.score++; window.SFX?.play('quiz_correct'); }
    else { window.SFX?.play('quiz_wrong'); }

    // Colour buttons inline (no CSS class dependency)
    q.answers.forEach((_, i) => {
      const btn = document.getElementById(`ans-${i}`);
      if (!btn) return;
      btn.disabled = true;
      btn.onmouseover = null; btn.onmouseout = null;
      if (i === q.correct) {
        btn.style.borderColor = '#22c55e';
        btn.style.background = '#f0fdf4';
      } else if (i === chosen && !correct) {
        btn.style.borderColor = '#ef4444';
        btn.style.background = '#fff1f2';
      }
    });

    // Show explanation
    const topicObj = TOPICS.find(t => t.id === state.topic) || TOPICS[5];
    const fb = document.getElementById('feedback-box');
    fb.style.display = 'block';
    fb.innerHTML = `
      <div style="display:flex;gap:14px;padding:16px;border-radius:14px;
                  background:${correct?'#f0fdf4':'#fff1f2'};
                  border:2px solid ${correct?'#bbf7d0':'#fecdd3'}">
        <div style="font-size:2rem;flex-shrink:0">${correct ? '🙌' : '📖'}</div>
        <div>
          <div style="font-weight:800;font-size:.95rem;margin-bottom:6px;color:#1a1a2e">
            ${correct ? '✅ Brilliant!' : '❌ The answer was: <em>' + q.answers[q.correct] + '</em>'}
          </div>
          <div style="font-size:.88rem;color:#374151;line-height:1.6">${q.why}</div>
        </div>
      </div>
      <div style="text-align:center;margin-top:16px">
        <button onclick="BibleQuiz._next()"
          style="background:linear-gradient(135deg,${topicObj.color},${topicObj.color}dd);
                 color:#fff;border:none;border-radius:50px;padding:12px 28px;
                 font-family:'Nunito',sans-serif;font-size:1rem;font-weight:800;cursor:pointer;
                 box-shadow:0 4px 14px rgba(0,0,0,.2)">
          ${state.idx + 1 < state.questions.length ? 'Next Question →' : 'See Results 🏆'}
        </button>
      </div>`;
  }

  /* ── Next / finish ─────────────────────────────────────────── */
  function _next() {
    window.SFX?.play('click');
    state.idx++;
    if (state.idx < state.questions.length) {
      renderQuestion();
    } else {
      endGame();
    }
  }

  async function endGame() {
    const elapsed = Math.round((Date.now() - state.startTime) / 1000);
    const mm = Math.floor(elapsed/60), ss = String(elapsed%60).padStart(2,'0');
    const timeStr = `${mm}:${ss}`;
    const pct = Math.round((state.score / state.questions.length) * 100);
    const topicObj = TOPICS.find(t => t.id === state.topic) || TOPICS[5];

    const grade = pct >= 90 ? '🏆 Bible Champion!' :
                  pct >= 70 ? '⭐ Well done!' :
                  pct >= 50 ? '📖 Keep reading!' : '🙏 Keep practising!';
    const msg   = pct >= 70 ? 'Great knowledge of the Bible!' :
                  pct >= 50 ? 'Good effort — each story has such a rich meaning!' :
                  'The Bible is full of amazing stories — have another go!';

    window.SFX?.play(pct >= 70 ? 'win' : pct >= 50 ? 'draw' : 'lose');

    const btnStyle = `background:${topicObj.color};color:#fff;border:none;border-radius:50px;
      padding:12px 24px;font-family:'Nunito',sans-serif;font-size:1rem;font-weight:800;
      cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.2)`;

    getContainer().innerHTML = `
      <div style="max-width:540px;margin:0 auto;padding:32px 20px 48px;text-align:center">

        <!-- Topic colour banner -->
        <div style="background:${topicObj.color};border-radius:18px 18px 0 0;padding:24px;
                    color:#fff;margin-bottom:0">
          <div style="font-size:3.5rem;margin-bottom:8px">${topicObj.emoji}</div>
          <div style="font-family:'Fredoka One',cursive;font-size:2rem">${grade}</div>
        </div>

        <!-- Score card -->
        <div style="background:#fff;border-radius:0 0 18px 18px;box-shadow:0 8px 24px rgba(0,0,0,.12);
                    padding:24px;margin-bottom:20px">
          <div style="font-family:'Fredoka One',cursive;font-size:3.5rem;color:${topicObj.color}">
            ${state.score}<span style="font-size:1.6rem;color:#aaa"> / ${state.questions.length}</span>
          </div>
          <div style="font-size:1.2rem;font-weight:800;color:#6b7280;margin-bottom:8px">${pct}% correct</div>
          <div style="color:#6b7280;font-size:.92rem;margin-bottom:20px">${msg}</div>

          <!-- Stats row -->
          <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
            ${[
              ['✅', state.score, 'Correct'],
              ['❌', state.questions.length - state.score, 'Missed'],
              ['⏱️', timeStr, 'Time']
            ].map(([icon,val,lab]) => `
              <div style="background:#f9fafb;border-radius:12px;padding:12px 16px;min-width:80px">
                <div style="font-size:1.3rem">${icon}</div>
                <div style="font-size:1.3rem;font-weight:800;color:#1a1a2e">${val}</div>
                <div style="font-size:.75rem;color:#9ca3af;font-weight:600">${lab}</div>
              </div>`).join('')}
          </div>
        </div>

        <!-- Action buttons -->
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <button style="${btnStyle}" onclick="BibleQuiz._selectTopic('${state.topic}')">🔄 Play Again</button>
          <button style="background:#4ecdc4;color:#fff;border:none;border-radius:50px;
            padding:12px 24px;font-family:'Nunito',sans-serif;font-size:1rem;font-weight:800;
            cursor:pointer;box-shadow:0 4px 14px rgba(78,205,196,.4)"
            onclick="BibleQuiz.init()">📖 Choose Topic</button>
          <a href="history.html" style="background:#f3f4f6;color:#374151;border:none;
            border-radius:50px;padding:12px 24px;font-family:'Nunito',sans-serif;
            font-size:1rem;font-weight:800;text-decoration:none;display:inline-block">
            📊 My Results
          </a>
        </div>
      </div>`;

    await saveResult({
      gameType: 'bible',
      outcome:  'quiz',
      topic:    state.topic,
      level:    state.topic,
      score:    state.score,
      total:    state.questions.length,
      percent:  pct,
      duration: elapsed,
      timeStr
    });
  }

  /* ── Helpers ───────────────────────────────────────────────── */
  function getContainer() { return document.getElementById('bible-container'); }
  function hideLoading() {
    const ol = document.getElementById('loading-overlay');
    if (ol) ol.classList.add('hidden');
  }
  function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

  return { init, _selectTopic, _answer, _next };
})();
