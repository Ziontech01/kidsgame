// ── Time Question Generator ───────────────────────────────────

function getTimeQuestions(level) {
  switch (level) {
    case 'reception': return timeReception();
    case 'year1':     return timeYear1();
    case 'year2':     return timeYear2();
    case 'year3':     return timeYear3();
    case 'year4':     return timeYear4();
    case 'year5':     return timeYear5();
    case 'year6':     return timeYear6();
    default:          return timeYear1();
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

// ── Reception: o'clock, morning/afternoon/night ───────────────
function timeReception() {
  return [
    mcq('What time is shown on the clock?', '3 o\'clock', '2 o\'clock', '4 o\'clock', '6 o\'clock',
      '🕒', 'When both hands point to 12 and 3, it is 3 o\'clock!'),
    mcq('What time is shown on the clock?', '1 o\'clock', '2 o\'clock', '12 o\'clock', '11 o\'clock',
      '🕐', 'The short (hour) hand points to 1. That means it is 1 o\'clock!'),
    mcq('What time is shown on the clock?', '6 o\'clock', '5 o\'clock', '7 o\'clock', '12 o\'clock',
      '🕕', 'The hour hand points to 6. It is 6 o\'clock!'),
    mcq('What time is shown on the clock?', '9 o\'clock', '8 o\'clock', '10 o\'clock', '3 o\'clock',
      '🕘', 'The hour hand points to 9. It is 9 o\'clock!'),
    mcq('What time is shown on the clock?', '12 o\'clock', '11 o\'clock', '1 o\'clock', '6 o\'clock',
      '🕛', 'When both hands point straight up to 12, it is 12 o\'clock — midday or midnight!'),
    mcq('Is bedtime morning or night?', 'Night', 'Morning', 'Afternoon', 'Lunchtime',
      '🌙', 'We go to bed at night when it is dark outside!'),
    mcq('Do we eat breakfast in the morning or afternoon?', 'Morning', 'Afternoon', 'Night', 'Evening',
      '🌅', 'Breakfast is the first meal of the day — we eat it in the morning!'),
    mcq('Do we go to school in the morning or at night?', 'Morning', 'Night', 'Midnight', 'Dawn',
      '🏫', 'Most schools start in the morning, around 9 o\'clock!'),
    mcq('What comes first: morning or evening?', 'Morning', 'Evening', 'Night', 'They are the same',
      '🌅', 'Morning comes when the sun rises. Evening comes later when the sun sets!'),
    mcq('What time is shown on the clock?', '5 o\'clock', '4 o\'clock', '6 o\'clock', '7 o\'clock',
      '🕔', 'The hour hand points to 5. It is 5 o\'clock!'),
    mcq('Is lunchtime morning or afternoon?', 'Afternoon', 'Morning', 'Night', 'Evening',
      '🥪', 'Lunchtime is around midday, which is in the afternoon — just after noon!'),
    mcq('How many hours are in one day?', '24', '12', '10', '60',
      '⏰', 'There are 24 hours in every day — 12 during the day and 12 during the night!'),
    mcq('Which activity happens at night?', 'Sleeping', 'Going to school', 'Eating breakfast', 'Playing in the park',
      '🌙', 'We sleep at night when it is dark!'),
    mcq('What time is shown on the clock?', '2 o\'clock', '3 o\'clock', '1 o\'clock', '10 o\'clock',
      '🕑', 'The hour hand points to 2. It is 2 o\'clock!'),
    mcq('Which comes first during the day: breakfast or dinner?', 'Breakfast', 'Dinner', 'They are at the same time', 'Supper',
      '🌅', 'Breakfast is in the morning. Dinner is in the evening. Breakfast comes first!')
  ];
}

// ── Year 1: o'clock, half past, simple duration ──────────────
function timeYear1() {
  return [
    mcq('What time is shown on the clock?', 'Half past 3', '3 o\'clock', 'Quarter past 3', 'Quarter to 4',
      '🕟', 'When the minute hand points to 6 (halfway), it is half past the hour. The hour hand is between 3 and 4!'),
    mcq('What time is shown on the clock?', 'Half past 7', '7 o\'clock', 'Half past 8', 'Quarter past 7',
      '🕢', 'The minute hand points to 6 — that means half past. The hour hand is between 7 and 8!'),
    mcq('What time is shown on the clock?', 'Half past 1', 'Half past 2', '1 o\'clock', '2 o\'clock',
      '🕝', 'Half past 1: minute hand at 6, hour hand between 1 and 2!'),
    mcq('School starts at 9 o\'clock and ends at 3 o\'clock. How many hours is that?', '6 hours', '5 hours', '7 hours', '4 hours',
      '🏫', 'Count from 9 to 3: 9, 10, 11, 12, 1, 2, 3 — that is 6 hours!'),
    mcq('What time is shown on the clock?', '6 o\'clock', 'Half past 6', 'Half past 5', '5 o\'clock',
      '🕕', 'Both hands pointing — the long hand at 12 means exactly on the hour. It is 6 o\'clock!'),
    mcq('If it is 3 o\'clock now, what time was it 2 hours ago?', '1 o\'clock', '2 o\'clock', '5 o\'clock', '4 o\'clock',
      '⏰', 'Count back 2 hours from 3: 3 → 2 → 1. It was 1 o\'clock!'),
    mcq('What time is shown on the clock?', 'Half past 10', '10 o\'clock', 'Half past 11', 'Quarter past 10',
      '🕥', 'Minute hand at 6 = half past. Hour hand between 10 and 11 = half past 10!'),
    mcq('A film starts at 2 o\'clock and lasts 1 hour. When does it end?', '3 o\'clock', '2 o\'clock', '4 o\'clock', '1 o\'clock',
      '🎬', '2 o\'clock + 1 hour = 3 o\'clock!'),
    mcq('What time is shown on the clock?', 'Half past 4', '4 o\'clock', 'Half past 5', 'Quarter to 5',
      '🕠', 'Minute hand at 6 = half past. Hour hand between 4 and 5 = half past 4!'),
    mcq('It is half past 6. What time will it be in 1 hour?', 'Half past 7', 'Half past 6', '7 o\'clock', 'Half past 8',
      '🕢', 'Half past 6 + 1 hour = half past 7!'),
    mcq('How many minutes are in half an hour?', '30', '60', '15', '45',
      '⏱️', 'A full hour has 60 minutes. Half an hour is 60 ÷ 2 = 30 minutes!'),
    mcq('What time is shown on the clock?', 'Half past 12', '12 o\'clock', 'Half past 11', 'Half past 1',
      '🕧', 'Minute hand at 6 = half past. Hour hand between 12 and 1 = half past 12!'),
    mcq('A nap starts at 1 o\'clock and ends at half past 1. How long is the nap?', '30 minutes', '1 hour', '15 minutes', '45 minutes',
      '😴', 'From 1 o\'clock to half past 1 is 30 minutes — half an hour!'),
    mcq('What time is shown on the clock?', 'Half past 9', '9 o\'clock', 'Half past 10', 'Quarter past 9',
      '🕤', 'Minute hand at 6 = half past. Hour hand between 9 and 10 = half past 9!'),
    mcq('Which time comes AFTER half past 3?', '4 o\'clock', '3 o\'clock', 'Half past 2', '2 o\'clock',
      '⏰', 'After half past 3 comes 4 o\'clock — time keeps moving forward!')
  ];
}

// ── Year 2: quarter past/to, days/months ──────────────────────
function timeYear2() {
  return [
    mcq('What is quarter past 4?', '4:15', '4:30', '4:45', '3:45',
      '🕓', 'Quarter past means 15 minutes past the hour. Quarter past 4 = 4:15!'),
    mcq('What is quarter to 4?', '3:45', '4:15', '4:30', '3:30',
      '🕟', 'Quarter to 4 means 15 minutes BEFORE 4 o\'clock. That is 3:45!'),
    mcq('What is quarter past 8?', '8:15', '8:30', '8:45', '7:45',
      '🕗', 'Quarter past 8 = 8 hours and 15 minutes = 8:15!'),
    mcq('How many days are in a week?', '7', '5', '6', '8',
      '📅', 'There are 7 days in a week: Mon, Tue, Wed, Thu, Fri, Sat, Sun!'),
    mcq('How many months are in a year?', '12', '10', '11', '13',
      '📅', 'There are 12 months in a year: January through to December!'),
    mcq('What time is quarter to 12?', '11:45', '12:15', '11:30', '12:45',
      '🕛', 'Quarter to 12 = 15 minutes before 12 = 11:45!'),
    mcq('Which day comes after Wednesday?', 'Thursday', 'Tuesday', 'Friday', 'Monday',
      '📅', 'The days in order are: Monday, Tuesday, Wednesday, THURSDAY, Friday!'),
    mcq('Which month comes after March?', 'April', 'February', 'May', 'June',
      '🌸', 'The months in order: January, February, March, APRIL, May...'),
    mcq('How many minutes are in one hour?', '60', '30', '100', '24',
      '⏱️', 'There are 60 minutes in every hour!'),
    mcq('What time is quarter past 11?', '11:15', '11:30', '11:45', '10:45',
      '🕚', 'Quarter past 11 = 11 hours and 15 minutes = 11:15!'),
    mcq('How many days are in a year (usually)?', '365', '360', '366', '350',
      '📅', 'Most years have 365 days. Leap years have 366!'),
    mcq('What is quarter to 9?', '8:45', '9:15', '9:45', '8:15',
      '🕘', 'Quarter to 9 = 15 minutes before 9 = 8:45!'),
    mcq('Which day comes before Friday?', 'Thursday', 'Saturday', 'Wednesday', 'Monday',
      '📅', 'The order is ...Wednesday, Thursday, FRIDAY... so Thursday comes before!'),
    mcq('What is quarter past 6?', '6:15', '6:30', '6:45', '5:45',
      '🕕', 'Quarter past 6 = 6:15. The minute hand points to the 3 on the clock face!'),
    mcq('How many seconds are in one minute?', '60', '100', '30', '12',
      '⏱️', 'There are 60 seconds in every minute. Count them: 1, 2, 3... up to 60!')
  ];
}

// ── Year 3: 5-minute intervals, 12hr vs 24hr, AM/PM ──────────
function timeYear3() {
  return [
    mcq('What is 3pm in 24-hour time?', '15:00', '13:00', '3:00', '03:00',
      '🕒', 'For times after noon, add 12. 3pm + 12 = 15:00!'),
    mcq('What is 7am in 24-hour time?', '07:00', '17:00', '7:00', '19:00',
      '🌅', 'Morning hours stay the same in 24-hour time. 7am = 07:00!'),
    mcq('What is 20:00 in 12-hour time?', '8pm', '8am', '6pm', '10pm',
      '🕗', '20:00 − 12 = 8pm. Subtract 12 to convert afternoon/evening times!'),
    mcq('A film starts at 14:30. What is this in 12-hour time?', '2:30pm', '2:30am', '4:30pm', '12:30pm',
      '🎬', '14:30 − 12 = 2:30pm!'),
    mcq('How many minutes past 4 is 4:25?', '25 minutes', '20 minutes', '30 minutes', '35 minutes',
      '🕓', '4:25 means 25 minutes past 4 o\'clock!'),
    mcq('What time is 10 minutes before 3:00?', '2:50', '3:10', '2:40', '2:45',
      '⏰', '3:00 − 10 minutes = 2:50!'),
    mcq('What is 11pm in 24-hour time?', '23:00', '11:00', '21:00', '13:00',
      '🌙', '11pm: 11 + 12 = 23. So 11pm = 23:00!'),
    mcq('What is 06:30 in 12-hour time?', '6:30am', '6:30pm', '6:00am', '7:30am',
      '🌅', '06:30 is in the morning, so it is 6:30am!'),
    mcq('A lesson starts at 10:15 and lasts 45 minutes. When does it end?', '11:00', '10:45', '11:15', '10:50',
      '🏫', '10:15 + 45 minutes = 11:00. (15 minutes to 10:30, then 30 more = 11:00)'),
    mcq('What is 5 minutes past 7?', '7:05', '7:15', '7:50', '6:55',
      '🕖', '5 minutes past 7 = 7:05!'),
    mcq('What does AM stand for?', 'Ante Meridiem (before noon)', 'After Morning', 'Always Morning', 'After Midnight',
      '🌅', 'AM comes from Latin "Ante Meridiem" meaning before midday — morning hours!'),
    mcq('A bus departs at 09:45. What time is this?', 'Quarter to 10 in the morning', '9:45pm', 'Quarter past 9 at night', '10:45am',
      '🚌', '09:45 = 9:45am = quarter to 10 in the morning!'),
    mcq('What time is 20 minutes after 4:50?', '5:10', '4:70', '5:00', '4:30',
      '⏰', '4:50 + 20 minutes = 5:10. (10 mins to 5:00, then 10 more = 5:10)'),
    mcq('What is 12pm also called?', 'Noon', 'Midnight', 'Dawn', 'Dusk',
      '☀️', '12pm is midday, also called noon — the middle of the day!'),
    mcq('How many minutes in 2 hours?', '120', '60', '90', '100',
      '⏱️', '60 minutes per hour × 2 hours = 120 minutes!')
  ];
}

// ── Year 4: accurate times, timetables, adding/subtracting ────
function timeYear4() {
  return [
    mcq('A train leaves at 09:15 and arrives 40 minutes later. When does it arrive?', '09:55', '09:45', '10:05', '09:50',
      '🚂', '09:15 + 40 minutes = 09:55. Count on 40 minutes!'),
    mcq('How many minutes from 10:40 to 11:15?', '35 minutes', '25 minutes', '45 minutes', '30 minutes',
      '⏰', '10:40 to 11:00 = 20 min, then 11:00 to 11:15 = 15 min. Total = 35 minutes!'),
    mcq('A match starts at 14:45 and lasts 90 minutes. When does it end?', '16:15', '15:45', '16:00', '16:30',
      '⚽', '14:45 + 90 minutes = 14:45 + 1hr 30min = 16:15!'),
    mcq('How many hours and minutes from 08:30 to 11:00?', '2 hours 30 minutes', '3 hours', '2 hours 15 minutes', '2 hours',
      '⏰', '08:30 to 11:00: count 2 hours to 10:30, then 30 more minutes = 2hr 30min!'),
    mcq('A TV programme is on from 19:30 to 20:15. How long is it?', '45 minutes', '30 minutes', '1 hour', '50 minutes',
      '📺', '19:30 to 20:00 = 30 min, 20:00 to 20:15 = 15 min. Total = 45 minutes!'),
    mcq('What time is 1 hour 15 minutes after 10:50?', '12:05', '11:50', '12:15', '11:55',
      '⏰', '10:50 + 1 hour = 11:50. 11:50 + 15 minutes = 12:05!'),
    mcq('A class starts at 13:05 and ends at 13:55. How long is it?', '50 minutes', '40 minutes', '55 minutes', '1 hour',
      '🏫', '13:55 − 13:05 = 50 minutes!'),
    mcq('The school day is 6 hours 15 minutes. School starts at 08:45. When does it end?', '15:00', '14:45', '15:15', '15:30',
      '🏫', '08:45 + 6 hours = 14:45. 14:45 + 15 minutes = 15:00!'),
    mcq('A train timetable shows these departures: 07:22, 07:54, 08:26. How often does it run?', 'Every 32 minutes', 'Every 30 minutes', 'Every 28 minutes', 'Every 25 minutes',
      '🚂', '07:54 − 07:22 = 32 minutes. 08:26 − 07:54 = 32 minutes. Every 32 minutes!'),
    mcq('How many minutes from 09:47 to 10:00?', '13 minutes', '10 minutes', '17 minutes', '15 minutes',
      '⏰', 'Count up from 09:47: 3 minutes to 09:50, then 10 more to 10:00. Total = 13 minutes!'),
    mcq('A flight takes 3 hours 45 minutes. It lands at 17:30. When did it take off?', '13:45', '14:15', '13:30', '14:45',
      '✈️', '17:30 − 3 hours = 14:30. 14:30 − 45 minutes = 13:45!'),
    mcq('Which time is NOT possible on a 12-hour clock?', '13:00', '12:59', '11:30', '6:45',
      '⏰', 'A 12-hour clock only goes from 1 to 12. 13:00 is only used on a 24-hour clock!'),
    mcq('If it is 15:40, how long until 17:00?', '1 hour 20 minutes', '1 hour', '2 hours', '1 hour 30 minutes',
      '⏰', '15:40 to 16:40 = 1 hour, then 16:40 to 17:00 = 20 minutes. Total = 1hr 20min!'),
    mcq('A story starts at 7:35pm and ends at 8:05pm. How long is the story?', '30 minutes', '25 minutes', '35 minutes', '40 minutes',
      '📖', '7:35 to 8:05 = 25 min to 8:00 + 5 min = 30 minutes!'),
    mcq('How many hours in a week?', '168', '144', '156', '180',
      '📅', '24 hours per day × 7 days = 168 hours in a week!')
  ];
}

// ── Year 5: time zones, 24hr, duration problems ────────────────
function timeYear5() {
  return [
    mcq('A train leaves at 14:35 and arrives 1 hour 20 minutes later. When does it arrive?', '15:55', '15:45', '16:05', '15:35',
      '🚂', '14:35 + 1 hour = 15:35. 15:35 + 20 minutes = 15:55!'),
    mcq('London is in GMT. New York is GMT−5. If it is 14:00 in London, what time is it in New York?', '09:00', '19:00', '11:00', '08:00',
      '🌍', 'GMT−5 means 5 hours behind. 14:00 − 5 hours = 09:00!'),
    mcq('Tokyo is GMT+9. If it is 08:00 in London (GMT), what time is it in Tokyo?', '17:00', '23:00', '01:00', '15:00',
      '🗼', 'GMT+9 means 9 hours ahead. 08:00 + 9 = 17:00!'),
    mcq('A flight from London departs at 11:20 and takes 8 hours 45 minutes. When does it land (local London time)?', '20:05', '19:55', '20:15', '21:05',
      '✈️', '11:20 + 8 hours = 19:20. 19:20 + 45 minutes = 20:05!'),
    mcq('How many seconds are in one hour?', '3,600', '600', '360', '1,200',
      '⏱️', '60 seconds × 60 minutes = 3,600 seconds!'),
    mcq('A film is 2 hours 35 minutes long. It starts at 19:45. When does it end?', '22:20', '22:10', '22:30', '21:50',
      '🎬', '19:45 + 2 hours = 21:45. 21:45 + 35 minutes = 22:20!'),
    mcq('How many days are in 4 weeks?', '28', '24', '30', '32',
      '📅', '7 days × 4 weeks = 28 days!'),
    mcq('The time is 23:47. How many minutes until midnight?', '13 minutes', '7 minutes', '17 minutes', '23 minutes',
      '🌙', '23:47 to 24:00 = midnight. Count: 3 minutes to 23:50, then 10 more = 13 minutes!'),
    mcq('Dubai is GMT+4. Paris is GMT+2. If it is 09:00 in Paris, what time is it in Dubai?', '11:00', '07:00', '13:00', '05:00',
      '🌍', 'Dubai is 2 hours ahead of Paris. 09:00 + 2 = 11:00!'),
    mcq('A train timetable shows departure at 08:47 and arrival at 11:23. How long is the journey?', '2 hours 36 minutes', '2 hours 26 minutes', '3 hours 36 minutes', '2 hours 46 minutes',
      '🚂', '08:47 to 09:00 = 13 min, 09:00 to 11:00 = 2 hours, 11:00 to 11:23 = 23 min. Total = 2h 36min!'),
    mcq('If today is Wednesday the 15th, what date is next Monday?', '20th', '22nd', '19th', '21st',
      '📅', 'Wed 15 → Thu 16 → Fri 17 → Sat 18 → Sun 19 → Mon 20!'),
    mcq('Sydney is GMT+11 in summer. If it is 06:00 in London (GMT), what time is it in Sydney?', '17:00', '19:00', '15:00', '21:00',
      '🦘', '06:00 + 11 hours = 17:00 in Sydney!'),
    mcq('A job lasts 4 hours 50 minutes. It finishes at 17:15. When did it start?', '12:25', '12:35', '12:15', '13:05',
      '🔧', '17:15 − 4 hours = 13:15. 13:15 − 50 minutes = 12:25!'),
    mcq('How many minutes are in 3 hours 25 minutes?', '205 minutes', '185 minutes', '195 minutes', '215 minutes',
      '⏱️', '3 hours = 180 minutes. 180 + 25 = 205 minutes!'),
    mcq('California is GMT−8. London is GMT. If it is midnight (00:00) in London, what is the time in California?', '16:00 (previous day)', '08:00', '20:00', '04:00',
      '🌉', '00:00 − 8 hours = 16:00 the previous day! California is 8 hours behind London.')
  ];
}

// ── Year 6: complex duration, speed/distance, word problems ───
function timeYear6() {
  return [
    mcq('If you travel 60 miles at 30mph, how long does it take?', '2 hours', '1 hour', '3 hours', '30 minutes',
      '🚗', 'Time = Distance ÷ Speed. 60 ÷ 30 = 2 hours!'),
    mcq('A car travels 90 miles at 60mph. How long is the journey?', '1 hour 30 minutes', '1 hour', '2 hours', '45 minutes',
      '🚗', '90 ÷ 60 = 1.5 hours = 1 hour 30 minutes!'),
    mcq('A cyclist travels 24km at 8km/h. How long does the journey take?', '3 hours', '2 hours', '4 hours', '6 hours',
      '🚴', 'Time = Distance ÷ Speed. 24 ÷ 8 = 3 hours!'),
    mcq('A train travels 200 miles in 2 hours 30 minutes. What is its average speed?', '80mph', '100mph', '60mph', '75mph',
      '🚂', '2 hours 30 minutes = 2.5 hours. Speed = 200 ÷ 2.5 = 80mph!'),
    mcq('How many minutes are there in a day?', '1,440', '720', '1,200', '2,400',
      '📅', '24 hours × 60 minutes = 1,440 minutes in a day!'),
    mcq('A task takes 1 hour 40 minutes. Three identical tasks are done back to back. How long in total?', '5 hours', '4 hours 20 minutes', '4 hours 40 minutes', '6 hours',
      '⏱️', '1h 40min × 3 = 3 × 100 min = 300 min = 5 hours!'),
    mcq('A project started on 28 February and ended on 15 March (non-leap year). How many days did it take?', '15 days', '13 days', '17 days', '16 days',
      '📅', 'Feb has 28 days. 28 Feb to 28 Feb = 0 days, then 15 more = 15 days total!'),
    mcq('A plane flies 3,500 km at 700 km/h. How long is the flight?', '5 hours', '4 hours', '6 hours', '3.5 hours',
      '✈️', 'Time = Distance ÷ Speed. 3,500 ÷ 700 = 5 hours!'),
    mcq('Events A, B and C take 45 min, 1hr 20min and 55 min respectively. What is the total time?', '3 hours', '2 hours 45 minutes', '3 hours 15 minutes', '3 hours 30 minutes',
      '⏱️', '45 + 80 + 55 = 180 minutes = 3 hours!'),
    mcq('A meeting runs from 09:15 to 12:45. How long does it last?', '3 hours 30 minutes', '3 hours', '3 hours 15 minutes', '4 hours',
      '💼', '09:15 to 12:15 = 3 hours. 12:15 to 12:45 = 30 minutes. Total = 3 hours 30 minutes!'),
    mcq('A town is 150 miles away. You drive at 50mph for the first hour, then 60mph for the rest. How long does the whole trip take?', '2 hours 40 minutes', '3 hours', '2 hours 30 minutes', '2 hours 50 minutes',
      '🚗', 'First hour: 50 miles. Remaining: 100 miles at 60mph = 1h 40min. Total = 2h 40min!'),
    mcq('How many weeks and days is 31 days?', '4 weeks 3 days', '4 weeks 2 days', '5 weeks', '4 weeks 1 day',
      '📅', '31 ÷ 7 = 4 remainder 3. So 4 weeks and 3 days!'),
    mcq('The time is 11:58:30. How many seconds until noon?', '90 seconds', '60 seconds', '120 seconds', '30 seconds',
      '⏱️', '11:58:30 to 11:59:00 = 30 seconds. 11:59:00 to 12:00:00 = 60 seconds. Total = 90 seconds!'),
    mcq('A car averages 48mph for 2.5 hours. How far does it travel?', '120 miles', '100 miles', '96 miles', '110 miles',
      '🚗', 'Distance = Speed × Time. 48 × 2.5 = 120 miles!'),
    mcq('From January 1st, how many days until March 1st (non-leap year)?', '59 days', '60 days', '58 days', '61 days',
      '📅', 'January has 31 days, February has 28 days. 31 + 28 = 59 days!')
  ];
}
