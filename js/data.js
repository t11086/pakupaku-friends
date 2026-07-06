// 定数データ(ゲームロジックはmain.js、音はaudio.js)

export const allFriends = ['🐰', '🐱', '🐶', '🐼', '🐨', '🦁', '🐸', '🐧', '🦊', '🐹', '🐻', '🐤'];

export const friendNames = {
  '🐰': 'Bunny', '🐱': 'Cat', '🐶': 'Dog', '🐼': 'Panda',
  '🐨': 'Koala', '🦁': 'Lion', '🐸': 'Frog', '🐧': 'Penguin',
  '🦊': 'Fox', '🐹': 'Hamster', '🐻': 'Bear', '🐤': 'Chick',
};

// おともだちごとの鳴き声(チップチューン風の音符データ: [周波数, 長さ, 開始遅延, 波形, 音量])
export const friendCries = {
  '🐰': [[700, .07, 0], [1000, .09, .08]],
  '🐱': [[900, .18, 0], [650, .22, .14]],
  '🐶': [[320, .09, 0, 'square'], [320, .09, .14, 'square']],
  '🐼': [[400, .12, 0], [500, .12, .13]],
  '🐨': [[350, .15, 0], [300, .15, .16]],
  '🦁': [[220, .3, 0, 'sawtooth', .15]],
  '🐸': [[250, .12, 0, 'square', .18], [210, .14, .13, 'square', .18]],
  '🐧': [[1000, .06, 0], [1200, .06, .08], [1000, .06, .16]],
  '🦊': [[850, .1, 0], [1100, .12, .1]],
  '🐹': [[1100, .05, 0], [1300, .05, .06], [1100, .05, .12]],
  '🐻': [[260, .2, 0, 'sawtooth', .12], [220, .22, .2, 'sawtooth', .12]],
  '🐤': [[1300, .07, 0], [1500, .07, .09]],
};

export const foodList = [
  ['🍎', 'Apple'], ['🍙', 'Rice ball'], ['🍌', 'Banana'],
  ['🥕', 'Carrot'], ['🍞', 'Bread'], ['🍓', 'Strawberry'],
  ['🍇', 'Grapes'], ['🍅', 'Tomato'],
];

export const balloonColors = [
  ['#ff5a5a', 'Red'], ['#5aa0ff', 'Blue'], ['#ffd75a', 'Yellow'],
  ['#7ed957', 'Green'], ['#b07aff', 'Purple'], ['#ff8ac2', 'Pink'],
];

export const shapeList = [
  ['⭐', 'Star'], ['❤️', 'Heart'], ['🔵', 'Circle'],
  ['🔶', 'Diamond'], ['🟩', 'Square'], ['🌙', 'Moon'],
];

export const toyList = [
  ['🧸', 'Teddy bear'], ['🚗', 'Car'], ['⚽', 'Ball'], ['🪀', 'Yo-yo'],
  ['🦖', 'Dinosaur'], ['🚂', 'Train'], ['🎈', 'Balloon'], ['🥁', 'Drum'],
];

export const hatLevels = [[20, '🌈'], [16, '🌟'], [13, '🎓'], [10, '👑'], [7, '🎩'], [5, '🧢'], [3, '🎀']];
export const hatOf = d => (hatLevels.find(([n]) => d >= n) || [0, ''])[1];

// 画面は👍絵文字のみ(テキストは改行位置が不自然になるためやめた)。褒め言葉は英語音声で
export const praiseWords = [
  'You did it!', 'Great job!', 'Awesome!',
  'Wonderful!', 'Fantastic!', 'Well done!',
];

export const guides = {
  meal: 'たべものを タッチして たべさせてね',
  teeth: 'はを ゆびで こすって ばいきんを やっつけよう',
  bath: 'からだを なでなでして あわあわに してね',
  tidy: 'おもちゃを タッチして はこに おかたづけしよう',
  sleep: 'でんきを けして ねんねさせてあげよう',
};
