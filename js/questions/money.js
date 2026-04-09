// ── Money Question Generator ──────────────────────────────────

function getMoneyQuestions(level) {
  switch (level) {
    case 'reception': return moneyReception();
    case 'year1':     return moneyYear1();
    case 'year2':     return moneyYear2();
    case 'year3':     return moneyYear3();
    case 'year4':     return moneyYear4();
    case 'year5':     return moneyYear5();
    case 'year6':     return moneyYear6();
    default:          return moneyYear1();
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

// ── Reception: coin recognition, simple yes/no ─────────────────
function moneyReception() {
  return [
    mcq('Which coin is worth MORE: 1p or 2p?', '2p', '1p', 'They are the same', 'Neither',
      '🪙', 'The 2p coin is worth two pennies, and 1p is only worth one penny, so 2p is more!'),
    mcq('Which coin is worth MORE: 5p or 2p?', '5p', '2p', 'They are the same', 'Neither',
      '🪙', 'The 5p coin is worth five pennies, which is more than 2p!'),
    mcq('Which coin is worth MORE: 10p or 5p?', '10p', '5p', 'They are the same', 'Neither',
      '🪙', 'The 10p coin is worth ten pennies — that is double the 5p coin!'),
    mcq('You have 5p. A sweet costs 3p. Can you buy it?', 'Yes', 'No', 'Maybe', 'I need more money',
      '🍬', 'You have 5p and the sweet only costs 3p, so you have enough money!'),
    mcq('You have 2p. A sticker costs 5p. Can you buy it?', 'No', 'Yes', 'Maybe', 'You have exactly enough',
      '🌟', 'You only have 2p but the sticker costs 5p — you need 3p more!'),
    mcq('How many 1p coins make 5p?', '5', '3', '4', '6',
      '🪙🪙🪙🪙🪙', 'Count five 1p coins: 1p + 1p + 1p + 1p + 1p = 5p!'),
    mcq('How many 1p coins make 2p?', '2', '1', '3', '4',
      '🪙🪙', 'You need two 1p coins to make 2p!'),
    mcq('Which coin has a number 1 on it?', '1p', '2p', '5p', '10p',
      '🪙', 'The 1p coin — the smallest UK coin — has the number 1 on it!'),
    mcq('You have 10p. A pencil costs 10p. Can you buy it?', 'Yes', 'No', 'You need more', 'Maybe',
      '✏️', 'You have exactly 10p and the pencil costs exactly 10p — perfect!'),
    mcq('Which coin is worth LESS: 1p or 5p?', '1p', '5p', 'They are the same', 'Neither',
      '🪙', 'The 1p coin is worth the least of all UK coins!'),
    mcq('How many 2p coins make 4p?', '2', '4', '1', '3',
      '🪙🪙', 'Two 2p coins: 2p + 2p = 4p!'),
    mcq('You have 1p. A lolly costs 4p. Can you buy it?', 'No', 'Yes', 'Maybe', 'Just about',
      '🍭', 'You only have 1p but the lolly costs 4p — you need 3p more!'),
    mcq('How many 1p coins make 10p?', '10', '5', '8', '12',
      '🪙', 'Count ten 1p coins: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 — they make 10p!'),
    mcq('Which coin is worth MORE: 2p or 5p?', '5p', '2p', 'They are the same', 'Neither',
      '🪙', 'The 5p coin is worth five pennies, which is more than 2p!'),
    mcq('You find 2p on the floor and 2p in your pocket. How much do you have?', '4p', '2p', '3p', '5p',
      '🪙', '2p + 2p = 4p. Count the coins together!')
  ];
}

// ── Year 1: simple totals up to 20p ────────────────────────────
function moneyYear1() {
  return [
    mcq('An apple costs 5p and a banana costs 3p. How much altogether?', '8p', '7p', '9p', '10p',
      '🍎🍌', '5p + 3p = 8p. Add the prices together!'),
    mcq('You have 10p. You spend 4p. How much is left?', '6p', '5p', '7p', '4p',
      '🪙', '10p − 4p = 6p. Subtract what you spent!'),
    mcq('A sweet costs 6p and a sticker costs 5p. How much altogether?', '11p', '10p', '12p', '9p',
      '🍬🌟', '6p + 5p = 11p. Add the two prices!'),
    mcq('You have 20p. You spend 8p. How much is left?', '12p', '11p', '13p', '10p',
      '🛍️', '20p − 8p = 12p. Take away what you spent!'),
    mcq('A pencil costs 7p. You pay 10p. What is your change?', '3p', '2p', '4p', '7p',
      '✏️', '10p − 7p = 3p. Your change is the difference!'),
    mcq('You have two 5p coins. How much do you have?', '10p', '5p', '15p', '20p',
      '🪙🪙', '5p + 5p = 10p. Count both coins!'),
    mcq('A biscuit costs 9p. You pay 10p. What is your change?', '1p', '2p', '9p', '0p',
      '🍪', '10p − 9p = 1p change. You almost had exactly enough!'),
    mcq('You have a 10p coin and a 5p coin. How much is that?', '15p', '10p', '5p', '20p',
      '🪙', '10p + 5p = 15p. Count both coins together!'),
    mcq('Three sweets cost 2p each. How much do they cost altogether?', '6p', '4p', '5p', '8p',
      '🍬🍬🍬', '2p + 2p + 2p = 6p. You can count up in 2s!'),
    mcq('You have 15p. You spend 7p. How much is left?', '8p', '7p', '9p', '6p',
      '🛒', '15p − 7p = 8p. Take away what you spent!'),
    mcq('A rubber costs 4p and a ruler costs 6p. How much altogether?', '10p', '9p', '11p', '8p',
      '✏️📏', '4p + 6p = 10p. These two items cost exactly 10p!'),
    mcq('You have 20p. You give away 10p. How much do you have left?', '10p', '5p', '15p', '20p',
      '🪙', '20p − 10p = 10p. Half of 20 is 10!'),
    mcq('A pen costs 8p. You have 20p. How much change do you get?', '12p', '10p', '8p', '11p',
      '🖊️', '20p − 8p = 12p change. Subtract the cost from what you paid!'),
    mcq('You have two 2p coins and one 5p coin. How much altogether?', '9p', '7p', '8p', '10p',
      '🪙', '2p + 2p + 5p = 9p. Add them all up!'),
    mcq('A toy car costs 12p. You pay 20p. What is your change?', '8p', '6p', '10p', '7p',
      '🚗', '20p − 12p = 8p. Take the cost away from what you gave!')
  ];
}

// ── Year 2: totals up to £1, change from 50p/£1 ─────────────────
function moneyYear2() {
  return [
    mcq('A toy costs 35p. You pay 50p. What is your change?', '15p', '20p', '10p', '25p',
      '🧸', '50p − 35p = 15p. Count up from 35p to 50p!'),
    mcq('A sandwich costs 65p. You pay £1. What is your change?', '35p', '30p', '40p', '25p',
      '🥪', '100p − 65p = 35p. A pound is 100 pennies!'),
    mcq('Crisps cost 28p and a drink costs 45p. How much altogether?', '73p', '70p', '75p', '63p',
      '🍟', '28p + 45p = 73p. Add the tens and units separately!'),
    mcq('You have 50p. You spend 22p. How much is left?', '28p', '30p', '27p', '32p',
      '🛒', '50p − 22p = 28p. Take away what you spent!'),
    mcq('How many 10p coins make £1?', '10', '100', '5', '20',
      '🪙', 'There are 100 pence in a pound. 100 ÷ 10 = 10 coins!'),
    mcq('A book costs 75p. You pay £1. What is your change?', '25p', '30p', '20p', '35p',
      '📚', '100p − 75p = 25p. That is a quarter of a pound change!'),
    mcq('A sticker pack costs 48p and a pen costs 35p. How much altogether?', '83p', '80p', '85p', '78p',
      '🌟', '48p + 35p = 83p. Add carefully!'),
    mcq('How many 50p coins make £1?', '2', '5', '10', '4',
      '🪙', '50p + 50p = 100p = £1. Two 50p coins make one pound!'),
    mcq('You have £1. You buy a comic for 60p. What is your change?', '40p', '30p', '45p', '50p',
      '📖', '100p − 60p = 40p change!'),
    mcq('How many 20p coins make £1?', '5', '4', '10', '3',
      '🪙', '5 × 20p = 100p = £1. Five 20p coins make one pound!'),
    mcq('A fruit salad costs 55p. You pay £1. What is your change?', '45p', '40p', '50p', '55p',
      '🍓', '100p − 55p = 45p. Count up from 55p to 100p!'),
    mcq('You have 50p. How much more do you need to make £1?', '50p', '25p', '75p', '40p',
      '💰', '50p + 50p = £1. You need another 50p!'),
    mcq('Three lollies cost 15p each. How much altogether?', '45p', '30p', '40p', '50p',
      '🍭🍭🍭', '15p × 3 = 45p. Or add: 15 + 15 + 15!'),
    mcq('A pencil case costs 89p. You pay £1. What is your change?', '11p', '9p', '21p', '1p',
      '🎒', '100p − 89p = 11p. Only 11p change from a pound!'),
    mcq('You buy two things for 30p each. How much do you spend?', '60p', '30p', '50p', '70p',
      '🛍️', '30p + 30p = 60p. Double 30 is 60!')
  ];
}

// ── Year 3: pounds and pence, change from £2/£5 ─────────────────
function moneyYear3() {
  return [
    mcq('A book costs £1.50 and a pen costs 80p. How much altogether?', '£2.30', '£2.10', '£2.50', '£1.80',
      '📚✏️', '£1.50 + £0.80 = £2.30. Remember to line up the pence!'),
    mcq('You buy a toy for £1.75. You pay £2. What is your change?', '25p', '30p', '20p', '15p',
      '🧸', '£2.00 − £1.75 = 25p. Count up from £1.75 to £2.00!'),
    mcq('A magazine costs £2.40. You pay £5. What is your change?', '£2.60', '£2.40', '£3.00', '£2.50',
      '📰', '£5.00 − £2.40 = £2.60. Subtract the cost!'),
    mcq('Three items cost £1.20, £0.85 and £0.95. How much altogether?', '£3.00', '£2.90', '£3.10', '£2.80',
      '🛒', '£1.20 + £0.85 + £0.95 = £3.00. Add all three together!'),
    mcq('A comic costs £1.99. You pay £2. What is your change?', '1p', '10p', '99p', '11p',
      '📖', '£2.00 − £1.99 = 1p. Just one penny change!'),
    mcq('You have £5. You spend £3.60. How much is left?', '£1.40', '£1.60', '£2.40', '£1.30',
      '💰', '£5.00 − £3.60 = £1.40. Subtract carefully!'),
    mcq('A sandwich is £2.50 and juice is £1.20. How much altogether?', '£3.70', '£3.50', '£3.80', '£3.60',
      '🥪🧃', '£2.50 + £1.20 = £3.70. Add the pounds and pence!'),
    mcq('You pay £5 for a toy costing £3.45. What is your change?', '£1.55', '£1.45', '£2.55', '£1.65',
      '🧸', '£5.00 − £3.45 = £1.55. Subtract the cost!'),
    mcq('How much is £1.50 + £1.50?', '£3.00', '£2.50', '£3.50', '£2.00',
      '💰', '£1.50 + £1.50 = £3.00. Double £1.50!'),
    mcq('A game costs £4.99. Rounded to the nearest pound, this is about...', '£5', '£4', '£3', '£6',
      '🎮', '£4.99 is just 1p under £5, so it rounds up to £5!'),
    mcq('You have £2 and find 75p. How much do you have now?', '£2.75', '£2.50', '£2.25', '£3.00',
      '🪙', '£2.00 + £0.75 = £2.75. Add the pence to your pounds!'),
    mcq('A lunchbox costs £3.80. You pay £5. What is your change?', '£1.20', '£1.10', '£1.30', '£1.40',
      '🍱', '£5.00 − £3.80 = £1.20. Count up from £3.80 to £5.00!'),
    mcq('Two friends each pay £1.25 for a gift. How much do they spend altogether?', '£2.50', '£2.25', '£2.75', '£2.00',
      '🎁', '£1.25 × 2 = £2.50. Double £1.25!'),
    mcq('You have £3.00. A snack costs £1.85. How much do you have left?', '£1.15', '£1.25', '£1.05', '£1.35',
      '🍟', '£3.00 − £1.85 = £1.15. Subtract carefully!'),
    mcq('A sticker book costs £2.60 and crayons cost £1.40. How much altogether?', '£4.00', '£3.80', '£4.20', '£3.60',
      '🎨', '£2.60 + £1.40 = £4.00. These add up to exactly £4!')
  ];
}

// ── Year 4: change from £5/£10, multiple items ───────────────────
function moneyYear4() {
  return [
    mcq('You buy 3 items at £1.20 each. How much altogether?', '£3.60', '£3.20', '£3.80', '£4.00',
      '🛒', '£1.20 × 3 = £3.60. Multiply the price by 3!'),
    mcq('You buy 3 items at £1.20 each and pay £5. What is your change?', '£1.40', '£1.20', '£1.60', '£1.80',
      '🛍️', '£5.00 − £3.60 = £1.40. First find the total, then the change!'),
    mcq('Four identical mugs cost £10. How much is one mug?', '£2.50', '£2.00', '£3.00', '£2.25',
      '☕', '£10 ÷ 4 = £2.50. Divide the total by 4!'),
    mcq('You spend £6.75 from a £10 note. What is your change?', '£3.25', '£3.50', '£3.00', '£3.75',
      '💵', '£10.00 − £6.75 = £3.25. Subtract!'),
    mcq('A burger costs £4.50 and chips cost £2.20. What is the total?', '£6.70', '£6.50', '£7.00', '£6.80',
      '🍔🍟', '£4.50 + £2.20 = £6.70. Add the pounds and pence!'),
    mcq('You buy 5 pencils at 60p each. How much altogether?', '£3.00', '£2.50', '£3.50', '£2.00',
      '✏️', '60p × 5 = 300p = £3.00. Five lots of 60p!'),
    mcq('A book costs £5.99 and a bookmark costs £1.50. Total cost?', '£7.49', '£7.00', '£7.99', '£8.49',
      '📚', '£5.99 + £1.50 = £7.49. Add carefully!'),
    mcq('You pay £10 for items totalling £7.85. What is your change?', '£2.15', '£2.25', '£1.85', '£2.05',
      '🛒', '£10.00 − £7.85 = £2.15. Subtract!'),
    mcq('Three friends split a £9.00 pizza equally. How much each?', '£3.00', '£2.50', '£3.50', '£2.00',
      '🍕', '£9.00 ÷ 3 = £3.00. Divide the total equally!'),
    mcq('A cinema ticket costs £8.50. How much for two tickets?', '£17.00', '£16.00', '£16.50', '£18.00',
      '🎬', '£8.50 × 2 = £17.00. Double the ticket price!'),
    mcq('You have £10. You spend £4.30 and £3.50. How much is left?', '£2.20', '£2.00', '£2.40', '£1.80',
      '💰', '£4.30 + £3.50 = £7.80. £10.00 − £7.80 = £2.20!'),
    mcq('Six identical pens cost £4.20. What does one pen cost?', '70p', '60p', '80p', '75p',
      '🖊️', '£4.20 ÷ 6 = £0.70 = 70p. Divide the total by 6!'),
    mcq('A toy costs £7.40. You pay with a £5 and a £5 note. What is your change?', '£2.60', '£2.40', '£3.00', '£2.80',
      '🧸', '£10.00 − £7.40 = £2.60. Two fivers make £10!'),
    mcq('A snack bar is 85p. How much for four snack bars?', '£3.40', '£3.20', '£3.60', '£3.00',
      '🍫', '85p × 4 = 340p = £3.40. Multiply carefully!'),
    mcq('You want to buy items costing £3.60, £2.40 and £1.00. What is the total?', '£7.00', '£6.80', '£7.20', '£6.60',
      '🛍️', '£3.60 + £2.40 + £1.00 = £7.00. Add all three!')
  ];
}

// ── Year 5: percentages, discounts ───────────────────────────────
function moneyYear5() {
  return [
    mcq('A game costs £20. It is 25% off. What do you pay?', '£15', '£16', '£14', '£18',
      '🎮', '25% of £20 = £5. £20 − £5 = £15. A quarter off!'),
    mcq('You save £3 from £12. What percentage did you save?', '25%', '20%', '30%', '33%',
      '💰', '£3 ÷ £12 = 0.25 = 25%. You saved a quarter!'),
    mcq('A jacket costs £40. There is a 10% discount. What is the new price?', '£36', '£34', '£38', '£32',
      '🧥', '10% of £40 = £4. £40 − £4 = £36!'),
    mcq('A toy is £25. There is a 20% sale. How much do you save?', '£5', '£4', '£6', '£7',
      '🏷️', '20% of £25 = £5. You save one fifth of the price!'),
    mcq('What is 50% of £30?', '£15', '£10', '£20', '£25',
      '💰', '50% means half. Half of £30 = £15!'),
    mcq('A book costs £8. It goes up by 50%. What is the new price?', '£12', '£10', '£14', '£16',
      '📚', '50% of £8 = £4. £8 + £4 = £12!'),
    mcq('You earn £60 and spend 40% on food. How much do you spend on food?', '£24', '£20', '£28', '£22',
      '🥗', '40% of £60 = £24. Multiply 60 by 0.4!'),
    mcq('A phone costs £80 with a 15% discount. How much do you pay?', '£68', '£65', '£70', '£72',
      '📱', '15% of £80 = £12. £80 − £12 = £68!'),
    mcq('An item was £50 and is now £35. What is the percentage discount?', '30%', '25%', '35%', '20%',
      '🏷️', '£50 − £35 = £15 saving. £15 ÷ £50 = 0.30 = 30%!'),
    mcq('What is 75% of £200?', '£150', '£100', '£125', '£175',
      '💰', '75% = three quarters. 3/4 of £200 = £150!'),
    mcq('You have £100. After spending 35%, how much is left?', '£65', '£35', '£70', '£60',
      '💵', '35% of £100 = £35. £100 − £35 = £65!'),
    mcq('A coat is £120. There is a 5% discount. What do you pay?', '£114', '£115', '£116', '£110',
      '🧥', '5% of £120 = £6. £120 − £6 = £114!'),
    mcq('Which is more: 20% of £50, or 25% of £40?', 'They are equal', '20% of £50', '25% of £40', 'Cannot tell',
      '💡', '20% of £50 = £10. 25% of £40 = £10. They are equal!'),
    mcq('A TV costs £300 with a 30% discount. What do you pay?', '£210', '£200', '£220', '£240',
      '📺', '30% of £300 = £90. £300 − £90 = £210!'),
    mcq('A meal costs £25 and you leave a 10% tip. How much is the tip?', '£2.50', '£2.00', '£3.00', '£1.50',
      '🍽️', '10% of £25 = £2.50. Move the decimal point one place left!')
  ];
}

// ── Year 6: budgeting, VAT, best value ────────────────────────────
function moneyYear6() {
  return [
    mcq('Which is better value: 3 for £2.40 or 5 for £4.25?', '3 for £2.40', '5 for £4.25', 'They are the same', 'Cannot tell',
      '🛒', '3 for £2.40 = 80p each. 5 for £4.25 = 85p each. So 3 for £2.40 is better value!'),
    mcq('A jacket costs £45 plus 20% VAT. What is the total?', '£54', '£49', '£56', '£50',
      '🧥', '20% of £45 = £9. £45 + £9 = £54. VAT adds to the price!'),
    mcq('You earn £800 per month and pay 20% tax. What is your take-home pay?', '£640', '£600', '£680', '£620',
      '💵', '20% of £800 = £160 tax. £800 − £160 = £640 take-home pay!'),
    mcq('A 2L bottle costs £1.80 and a 3L bottle costs £2.55. Which is better value?', '3L bottle', '2L bottle', 'They are equal', 'Cannot tell',
      '🧴', '2L: 90p per litre. 3L: 85p per litre. The 3L bottle is cheaper per litre!'),
    mcq('You have a budget of £50. After spending £18.75 and £24.30, how much is left?', '£6.95', '£7.05', '£6.05', '£7.95',
      '📊', '£18.75 + £24.30 = £43.05. £50.00 − £43.05 = £6.95!'),
    mcq('A shop adds 20% VAT to a price of £120. What is the price including VAT?', '£144', '£140', '£148', '£136',
      '🏷️', '20% of £120 = £24. £120 + £24 = £144!'),
    mcq('Which gives more discount: 30% off £60, or 25% off £80?', '25% off £80', '30% off £60', 'They are equal', 'Cannot tell',
      '💡', '30% of £60 = £18. 25% of £80 = £20. 25% off £80 saves more!'),
    mcq('An item costs £200 excluding VAT. VAT is 20%. What is the total price?', '£240', '£220', '£250', '£260',
      '🧾', '20% of £200 = £40. £200 + £40 = £240!'),
    mcq('You invest £500 and earn 4% interest per year. How much interest do you earn?', '£20', '£25', '£40', '£50',
      '🏦', '4% of £500 = £20. That is your interest for the year!'),
    mcq('A holiday costs £1,200. You have saved £750. What percentage have you saved?', '62.5%', '60%', '65%', '75%',
      '✈️', '£750 ÷ £1200 = 0.625 = 62.5%!'),
    mcq('Three friends earn £120, £95 and £85. What is their total earnings?', '£300', '£290', '£310', '£280',
      '💼', '£120 + £95 + £85 = £300!'),
    mcq('A shop offers "buy 2 get 1 free" on items costing £15 each. What do you pay for 3 items?', '£30', '£45', '£15', '£22.50',
      '🛍️', 'You pay for 2 and get 1 free: 2 × £15 = £30!'),
    mcq('Price before VAT: £85. VAT rate: 20%. How much is the VAT?', '£17', '£15', '£20', '£18',
      '🧾', '20% of £85 = £17. The VAT amount is £17!'),
    mcq('You spend £240 on food per month. As a percentage of your £800 income, how much is this?', '30%', '25%', '35%', '20%',
      '🥗', '£240 ÷ £800 = 0.30 = 30% of your income!'),
    mcq('A 500g pack costs £1.50 and a 750g pack costs £2.10. Which is better value per gram?', '750g pack', '500g pack', 'They are equal', 'Cannot tell',
      '⚖️', '500g: 0.3p per gram. 750g: 0.28p per gram. The bigger pack is better value!')
  ];
}
