// 定数データ(ゲームロジックはmain.js、音はaudio.js)

export const allFriends = ['🐰', '🐱', '🐶', '🐼', '🐨', '🦁', '🐸', '🐧', '🦊', '🐹', '🐻', '🐤'];

// 12匹コンプリート後にやってくる第2弾: うみのおともだち
export const seaFriends = ['🐬', '🐳', '🐙', '🦀', '🐢', '🦈', '🐠', '🦐', '🦑', '🐡', '🦭', '🦞'];

export const friendNames = {
  '🐰': 'Bunny', '🐱': 'Cat', '🐶': 'Dog', '🐼': 'Panda',
  '🐨': 'Koala', '🦁': 'Lion', '🐸': 'Frog', '🐧': 'Penguin',
  '🦊': 'Fox', '🐹': 'Hamster', '🐻': 'Bear', '🐤': 'Chick',
  '🐬': 'Dolphin', '🐳': 'Whale', '🐙': 'Octopus', '🦀': 'Crab',
  '🐢': 'Turtle', '🦈': 'Shark', '🐠': 'Fish', '🦐': 'Shrimp',
  '🦑': 'Squid', '🐡': 'Pufferfish', '🦭': 'Seal', '🦞': 'Lobster',
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
  '🐬': [[900, .1, 0], [1200, .12, .1], [900, .1, .22]],
  '🐳': [[180, .35, 0, 'sine', .2]],
  '🐙': [[500, .08, 0], [400, .08, .09], [300, .08, .18]],
  '🦀': [[700, .05, 0, 'square', .15], [700, .05, .08, 'square', .15]],
  '🐢': [[300, .25, 0, 'sine', .15]],
  '🦈': [[200, .2, 0, 'sawtooth', .15], [250, .2, .2, 'sawtooth', .15]],
  '🐠': [[1000, .07, 0], [1150, .07, .09]],
  '🦐': [[1200, .05, 0], [1400, .05, .07]],
  '🦑': [[450, .12, 0], [350, .12, .13]],
  '🐡': [[550, .1, 0, 'square', .15], [550, .1, .15, 'square', .15]],
  '🦭': [[400, .15, 0], [500, .15, .16]],
  '🦞': [[600, .06, 0, 'square', .15], [500, .06, .08, 'square', .15]],
};

export const foodList = [
  ['🍎', 'Apple'], ['🍙', 'Rice ball'], ['🍌', 'Banana'],
  ['🥕', 'Carrot'], ['🍞', 'Bread'], ['🍓', 'Strawberry'],
  ['🍇', 'Grapes'], ['🍅', 'Tomato'], ['🍊', 'Orange'],
  ['🥦', 'Broccoli'], ['🧀', 'Cheese'], ['🍉', 'Watermelon'],
];

// ホームのぱっくんをタップしたときのあいさつ
export const helloWords = [
  'Hello!', 'Hi!', "Let's play!", 'I love you!',
  'Peekaboo!', 'You are my friend!', 'Happy day!', 'Hooray!',
];

export const balloonColors = [
  ['#ff5a5a', 'Red'], ['#5aa0ff', 'Blue'], ['#ffd75a', 'Yellow'],
  ['#7ed957', 'Green'], ['#b07aff', 'Purple'], ['#ff8ac2', 'Pink'],
  ['#ff9b3d', 'Orange'], ['#7de0e6', 'Light blue'],
];

export const shapeList = [
  ['⭐', 'Star'], ['❤️', 'Heart'], ['🔵', 'Circle'],
  ['🔶', 'Diamond'], ['🟩', 'Square'], ['🌙', 'Moon'],
];

// おきがえの服(絵文字, 英語名)。着る位置・サイズは main.js の wornPos
export const clothesList = [
  ['👕', 'Shirt'], ['👖', 'Pants'], ['🧦', 'Socks'],
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
  dress: 'おようふくを タッチして きせてあげよう',
  tidy: 'おもちゃを タッチして はこに おかたづけしよう',
  sleep: 'でんきを けして ねんねさせてあげよう',
};
