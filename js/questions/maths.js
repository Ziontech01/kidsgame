// ── Maths Question Generator ──────────────────────────────────

function getMathsQuestions(level) {
  switch (level) {
    case 'reception': return genReception();
    case 'year1':     return genYear1();
    case 'year2':     return genYear2();
    case 'year3':     return genYear3();
    case 'year4':     return genYear4();
    case 'year5':     return genYear5();
    case 'year6':     return genYear6();
    default:          return genYear1();
  }
}

function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

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

// Reception: counting, simple addition up to 10
function genReception() {
  const qs = [];
  // Counting
  const emojis = ['🍎','⭐','🌸','🐱','🎈','🦋','🍭','🌈','🐸','🐶'];
  for (let i = 0; i < 5; i++) {
    const n = rnd(1,8);
    const e = emojis[i % emojis.length].repeat(n);
    qs.push(mcq(`How many? ${e}`, String(n), String(n+1), String(n>1?n-1:n+2), String(n+2),
      null, `Count each one carefully — there are ${n} in total!`));
  }
  // Simple addition
  for (let i = 0; i < 5; i++) {
    const a = rnd(1,5), b = rnd(1,5);
    qs.push(mcq(`${a} + ${b} = ?`, String(a+b), String(a+b+1), String(a+b-1<0?a+b+2:a+b-1), String(a+b+2),
      null, `Start at ${a}, then count on ${b} more — that makes ${a+b}!`));
  }
  // Simple subtraction
  for (let i = 0; i < 5; i++) {
    const a = rnd(3,9), b = rnd(1,a);
    qs.push(mcq(`${a} − ${b} = ?`, String(a-b), String(a-b+1), String(a-b+2), String(a-b>0?a-b-1:a-b+3),
      null, `Start at ${a} and take away ${b} — ${a-b} are left!`));
  }
  // Number recognition
  qs.push(mcq('Which number comes after 5?', '6', '4', '7', '8',
    null, 'Count: 1, 2, 3, 4, 5, 6 — the number after 5 is 6!'));
  qs.push(mcq('Which number comes before 3?', '2', '1', '4', '5',
    null, 'Count: 1, 2, 3 — the number before 3 is 2!'));
  qs.push(mcq('What is 2 + 2?', '4', '3', '5', '6', '🍎🍎+🍎🍎',
    'Think of 2 fingers on each hand — 2+2=4 fingers total!'));
  qs.push(mcq('What is 5 + 0?', '5', '0', '4', '6',
    null, 'Adding zero means nothing changes — 5+0 is still 5!'));
  qs.push(mcq('What is 10 − 5?', '5', '4', '6', '3', '🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈',
    'Hold up 10 fingers, fold 5 down — 5 fingers are left!'));
  return qs;
}

// Year 1: addition/subtraction up to 20
function genYear1() {
  const qs = [];
  for (let i = 0; i < 8; i++) {
    const a = rnd(1,10), b = rnd(1,10);
    qs.push(mcq(`${a} + ${b} = ?`, String(a+b), String(a+b+1), String(a+b+2), String(a+b-1<0?a+b+3:a+b-1),
      null, `Start at ${a} and count on ${b} more steps — you reach ${a+b}!`));
  }
  for (let i = 0; i < 5; i++) {
    const a = rnd(5,20), b = rnd(1,a);
    qs.push(mcq(`${a} − ${b} = ?`, String(a-b), String(a-b+1), String(a-b+2), String(a-b+3),
      null, `Start at ${a} and count back ${b} steps — you land on ${a-b}!`));
  }
  // Doubles
  qs.push(mcq('Double 4 is?',  '8',  '6',  '10', '9',
    null, 'Double means ×2. 4×2=8 — think of 4+4=8!'));
  qs.push(mcq('Double 7 is?',  '14', '12', '16', '13',
    null, 'Double means ×2. 7×2=14 — think of 7+7=14!'));
  qs.push(mcq('Half of 10 is?','5',  '4',  '6',  '8',
    null, 'Half means ÷2. 10÷2=5 — split 10 equally into 2 groups!'));
  qs.push(mcq('What is 3 + 7?','10', '9',  '11', '8',
    null, 'Count on 7 from 3: 4,5,6,7,8,9,10 — that\'s 10!'));
  qs.push(mcq('What is 15 − 6?','9', '8', '10', '7',
    null, 'Count back 6 from 15: 14,13,12,11,10,9 — you reach 9!'));
  return qs;
}

// Year 2: up to 100, ×2 ×5 ×10
function genYear2() {
  const qs = [];
  for (let i = 0; i < 6; i++) {
    const a = rnd(10,50), b = rnd(1,30);
    qs.push(mcq(`${a} + ${b} = ?`, String(a+b), String(a+b+1), String(a+b+10), String(a+b-1),
      null, `Add the ones first, then the tens — ${a}+${b}=${a+b}!`));
  }
  for (let i = 0; i < 4; i++) {
    const a = rnd(20,80), b = rnd(1,20);
    qs.push(mcq(`${a} − ${b} = ?`, String(a-b), String(a-b+1), String(a-b+2), String(a-b-1<0?a-b+3:a-b-1),
      null, `Subtract the ones, then the tens — ${a}−${b}=${a-b}!`));
  }
  // × 2, 5, 10
  [2,5,10].forEach(t => {
    const n = rnd(1,10);
    qs.push(mcq(`${n} × ${t} = ?`, String(n*t), String(n*t+t), String(n*t-t<0?n*t+2*t:n*t-t), String(n*t+2*t),
      null, `Skip-count in ${t}s, ${n} times — the answer is ${n*t}!`));
  });
  qs.push(mcq('What is 50 + 36?','86','85','87','96',
    null, '50+36: 50+30=80, then 80+6=86!'));
  qs.push(mcq('What is 70 − 24?','46','44','48','47',
    null, '70−24: 70−20=50, then 50−4=46!'));
  qs.push(mcq('What is 4 × 5?','20','15','25','10',
    null, '4 groups of 5 — count: 5,10,15,20!'));
  qs.push(mcq('What is 30 ÷ 5?','6','5','7','4',
    null, 'How many 5s fit in 30? 5,10,15,20,25,30 — that\'s 6!'));
  return qs;
}

// Year 3: times tables, division
function genYear3() {
  const qs = [];
  const tables = [2,3,4,5,6,8,10];
  for (let i = 0; i < 8; i++) {
    const t = tables[rnd(0,tables.length-1)];
    const n = rnd(1,12);
    qs.push(mcq(`${n} × ${t} = ?`, String(n*t), String(n*t+t), String(n*t-t<0?n*t+2:n*t-t), String(n*t+2*t),
      null, `${n} groups of ${t} — add ${t} together ${n} times: ${n}×${t}=${n*t}!`));
  }
  for (let i = 0; i < 4; i++) {
    const t = tables[rnd(0,tables.length-1)];
    const n = rnd(1,10);
    qs.push(mcq(`${n*t} ÷ ${t} = ?`, String(n), String(n+1), String(n-1<0?n+2:n-1), String(n+2),
      null, `${n*t}÷${t}: how many groups of ${t} make ${n*t}? That's ${n}!`));
  }
  qs.push(mcq('What is 7 × 8?',  '56','54','58','63',
    null, 'Remember: "5,6,7,8 — 56=7×8"! A handy memory trick!'));
  qs.push(mcq('What is 9 × 6?',  '54','48','56','63',
    null, 'Try: 10×6=60, then take away one 6 → 60−6=54!'));
  qs.push(mcq('What is 72 ÷ 8?', '9', '8', '10', '7',
    null, '8×9=72, so 72÷8=9 — division is the reverse of multiplication!'));
  qs.push(mcq('What is 45 ÷ 9?', '5', '4', '6',  '7',
    null, '9×5=45, so 45÷9=5 — check your 9 times table!'));
  return qs;
}

// Year 4: all tables up to 12, fractions
function genYear4() {
  const qs = [];
  for (let i = 0; i < 6; i++) {
    const t = rnd(2,12), n = rnd(1,12);
    qs.push(mcq(`${n} × ${t} = ?`, String(n*t), String(n*t+t), String(n*t-t<0?n*t+n:n*t-t), String(n*t+2*t),
      null, `Recall your times table — ${n}×${t}=${n*t}!`));
  }
  // Fractions
  qs.push(mcq('What is ½ of 48?',  '24','20','28','22',
    null, '½ of 48 means 48÷2=24 — split 48 equally into two halves!'));
  qs.push(mcq('What is ¼ of 100?', '25','20','30','50',
    null, '¼ of 100 means 100÷4=25 — split into 4 equal groups!'));
  qs.push(mcq('What is ⅓ of 30?',  '10','9', '12','15',
    null, '⅓ of 30 means 30÷3=10 — split into 3 equal groups!'));
  qs.push(mcq('What is ¾ of 20?',  '15','10','12','18',
    null, '¾ of 20: first find ¼ → 20÷4=5, then ×3=15!'));
  qs.push(mcq('What is 11 × 11?',  '121','110','122','111',
    null, '11×11=121 — the digits form a pattern: 1, 2, 1!'));
  qs.push(mcq('What is 12 × 8?',   '96','88','104','90',
    null, '12×8: 10×8=80, then 2×8=16, and 80+16=96!'));
  qs.push(mcq('What is 144 ÷ 12?', '12','11','13','10',
    null, '144÷12=12 because 12×12=144 — a square number!'));
  qs.push(mcq('Round 346 to the nearest 100?','300','350','400','200',
    null, '346: the tens digit is 4 (less than 5), so round DOWN to 300!'));
  qs.push(mcq('What is 500 − 247?','253','243','263','247',
    null, '500−247: 500−200=300, then 300−47=253!'));
  return qs;
}

// Year 5: percentages, decimals, larger numbers
function genYear5() {
  return [
    mcq('What is 10% of 80?',   '8',   '10',  '18',  '16',  null, '10% means ÷10 — 80÷10=8!'),
    mcq('What is 25% of 200?',  '50',  '25',  '75',  '100', null, '25% = ¼ — 200÷4=50!'),
    mcq('What is 50% of 350?',  '175', '150', '200', '250', null, '50% = ½ — 350÷2=175!'),
    mcq('What is 15% of 60?',   '9',   '6',   '12',  '15',  null, '15% = 10%+5%: 10% of 60=6, 5% of 60=3, total=9!'),
    mcq('What is 0.5 + 0.7?',   '1.2', '1.0', '0.12','1.3', null, 'Think: 5p+7p=12p, so 0.5+0.7=1.2!'),
    mcq('What is 3.4 − 1.8?',   '1.6', '1.4', '2.2', '1.8', null, '3.4−1.8: count up from 1.8 → 1.8+1.6=3.4!'),
    mcq('What is 2.5 × 4?',     '10',  '8',   '12',  '9',   null, '2×4=8, then 0.5×4=2, so 8+2=10!'),
    mcq('What is 6.0 ÷ 4?',     '1.5', '1.4', '2.0', '1.2', null, '6÷4: 4 goes into 6 once r.2, then 20÷4=5 → 1.5!'),
    mcq('What is 1234 + 567?',  '1801','1791','1811','1701', null, 'Column addition: 4+7=11, 3+6+1=10, 2+5+1=8, 1 → 1801!'),
    mcq('What is 2000 − 768?',  '1232','1242','1222','1332', null, 'Count up: 768+232=1000, then +1000=2000, total gap=1232!'),
    mcq('What is 34 × 5?',      '170', '160', '180', '150', null, '30×5=150, 4×5=20, 150+20=170!'),
    mcq('What is 360 ÷ 8?',     '45',  '40',  '50',  '36',  null, '320÷8=40, 40÷8=5, so 40+5=45!'),
    mcq('Which is biggest: ½, ¾, ⅓?','¾','½','⅓','all equal', null, '¾=0.75, ½=0.50, ⅓=0.33 — ¾ is the largest!'),
    mcq('What is 15²?',         '225', '215', '235', '125', null, '15²=15×15: 15×10=150, 15×5=75, 150+75=225!'),
    mcq('What is √64?',         '8',   '6',   '9',   '7',   null, '√64=8 because 8×8=64!'),
  ];
}

// Year 6: mixed, BIDMAS, harder
function genYear6() {
  return [
    mcq('What is 15% of 120?',      '18','15','21','12',      null, '15%=10%+5%: 10% of 120=12, 5%=6, total=18!'),
    mcq('What is 3² + 4²?',         '25','13','14','12', '(BIDMAS)', 'BIDMAS: powers first! 3²=9, 4²=16, then 9+16=25!'),
    mcq('What is (4 + 6) × 3?',     '30','24','36','18',      null, 'Brackets first! 4+6=10, then 10×3=30!'),
    mcq('What is 2³?',              '8', '6', '9', '16',      null, '2³=2×2×2=8 — multiply 2 by itself 3 times!'),
    mcq('What is 4⁴?',              '256','64','128','512',   null, '4⁴=4×4×4×4: 4²=16, then 16×16=256!'),
    mcq('What is the LCM of 4 and 6?','12','8','24','10',     null, 'List multiples: 4,8,12 and 6,12 — first match is 12!'),
    mcq('What is the HCF of 12 and 18?','6','3','9','12',     null, 'Factors of 12={1,2,3,4,6,12}, of 18={1,2,3,6,9,18} — biggest shared is 6!'),
    mcq('What is 12.6 × 5?',        '63','60','65','62',      null, '12×5=60, 0.6×5=3, total=63!'),
    mcq('What is 4.5²?',            '20.25','18','22.5','16', null, '4.5×4.5: 4×4.5=18, 0.5×4.5=2.25, total=20.25!'),
    mcq('What is 1000 ÷ 25?',       '40','25','50','30',      null, '25×4=100, so 25×40=1000 — answer is 40!'),
    mcq('What is 0.1 × 0.1?',       '0.01','0.1','1','0.001', null, 'One tenth of a tenth = one hundredth: 0.1×0.1=0.01!'),
    mcq('What is −3 + 8?',          '5','−5','11','-11',      null, 'Start at −3 on the number line, move right 8 — you reach 5!'),
    mcq('What is 3/5 as a decimal?','0.6','0.3','0.5','0.35', null, '3÷5=0.6 — 5 goes into 30 six times!'),
    mcq('What is 7/10 as a percentage?','70%','7%','17%','0.7', null, '7÷10=0.7, and 0.7×100=70%!'),
    mcq('What is the area of a rectangle 8cm × 6cm?','48cm²','42cm²','56cm²','28cm²', null, 'Area = length × width = 8×6=48 cm²!'),
  ];
}
