// ゲーム本体(状態・画面遷移・各お世話あそび)
import {
  allFriends, seaFriends, friendNames, foodList, balloonColors, shapeList,
  toyList, hatOf, praiseWords, guides, helloWords,
} from './data.js';
import { tone, sfx, cry, speak, speakEn } from './audio.js';

  // ---------- 状態 ----------
  const tasks = { meal: false, teeth: false, bath: false, tidy: false, sleep: false };
  let day = Number(localStorage.getItem('pakupaku-day') || 1);
  let friends = JSON.parse(localStorage.getItem('pakupaku-zukan') || '[]');
  // なかよし度: おすそわけした回数(おともだち絵文字 → 回数)
  let hearts = JSON.parse(localStorage.getItem('pakupaku-hearts') || '{}');

  // ---------- 画面切り替え ----------
  const screens = document.querySelectorAll('.screen');
  function show(name) {
    screens.forEach(s => s.classList.remove('active'));
    document.getElementById('screen-' + name).classList.add('active');
  }
  document.querySelectorAll('.menu button').forEach(btn => {
    btn.addEventListener('click', () => {
      const go = btn.dataset.go;
      sfx.tap(); show(go); speak(guides[go]);
      if (go === 'meal') setupMeal();
      if (go === 'teeth') setupTeeth();
      if (go === 'bath') setupBath();
      if (go === 'tidy') setupTidy();
      if (go === 'sleep') setupSleep();
      if (go === 'zukan') renderZukan();
      // おうえんおともだちは「ごはん」のみ(おすそわけで意味がある。他画面はユーザー判断で廃止)
      if (go === 'meal') addCheerFriend(go);
    });
  });
  document.querySelectorAll('.back-btn').forEach(b =>
    b.addEventListener('click', () => { sfx.tap(); goHome(); }));

  function goHome() {
    document.getElementById('screen-sleep').classList.remove('night');
    show('home'); renderHome();
  }

  function renderHome() {
    document.getElementById('day-num').textContent = day;
    document.querySelectorAll('.stamp').forEach(s =>
      s.classList.toggle('done', tasks[s.dataset.task]));
    document.querySelectorAll('.menu button').forEach(b =>
      b.classList.toggle('done-badge', tasks[b.dataset.go]));
    renderHomeFriends();
    applyHats();
  }

  // ---------- 🎀 ぼうし(にっすうで きせかえが ふえる) ----------
  function applyHats() {
    const hat = hatOf(day);
    document.querySelectorAll('.char').forEach(c => {
      let el = c.querySelector('.char-hat');
      if (!el) {
        el = document.createElement('div');
        el.className = 'char-hat';
        c.appendChild(el);
      }
      el.textContent = hat;
    });
  }

  // ---------- 🐰 おともだちが おうえんに くる ----------
  function addCheerFriend(screenName) {
    const area = document.querySelector('#screen-' + screenName + ' .play-area');
    area.querySelectorAll('.cheer-friend').forEach(f => f.remove());
    if (!friends.length) return;
    const f = friends[Math.floor(Math.random() * friends.length)];
    const b = document.createElement('button');
    b.className = 'cheer-friend'; b.textContent = f;
    b.dataset.friend = f;
    b.addEventListener('click', () => {
      b.classList.remove('hop');
      void b.offsetWidth;
      b.classList.add('hop');
      cry(f); speakEn(friendNames[f] + '!');
    });
    area.appendChild(b);
  }
  // ひとつ進むたびに おうえんおともだちが ぴょんとよろこぶ
  function cheerReact() {
    const cheer = document.querySelector('.screen.active .cheer-friend');
    if (!cheer) return;
    cheer.classList.remove('hop'); void cheer.offsetWidth; cheer.classList.add('hop');
  }

  // ずかんで なかまになった おともだちが ホームにあそびにくる
  function renderHomeFriends() {
    const wrap = document.querySelector('#screen-home .char-wrap');
    wrap.querySelectorAll('.home-friend').forEach(f => f.remove());
    const picks = [...friends].sort(() => Math.random() - .5).slice(0, 4);
    const spots = [['-26%', '6%'], ['104%', '2%'], ['-30%', '56%'], ['108%', '52%']];
    picks.forEach((f, i) => {
      const b = document.createElement('button');
      b.className = 'home-friend'; b.textContent = f;
      b.style.left = spots[i][0]; b.style.top = spots[i][1];
      b.style.animationDelay = (i * .4) + 's';
      b.addEventListener('click', () => {
        b.classList.add('hop');
        setTimeout(() => b.classList.remove('hop'), 550);
        cry(f); speakEn(friendNames[f] + '!');
      });
      wrap.appendChild(b);
    });
  }

  // ---------- ホームのぱっくんタップ反応 ----------
  const homeChar = document.getElementById('char-home');
  homeChar.addEventListener('click', () => {
    homeChar.classList.remove('hop'); void homeChar.offsetWidth; homeChar.classList.add('hop');
    homeChar.classList.add('happy');
    setTimeout(() => homeChar.classList.remove('happy'), 700);
    sfx.pop();
    speakEn(helloWords[Math.floor(Math.random() * helloWords.length)]);
  });

  // ---------- できた!演出 ----------
  const praiseEl = document.getElementById('praise');
  function completeTask(name) {
    tasks[name] = true;
    sfx.stamp();
    const en = praiseWords[Math.floor(Math.random() * praiseWords.length)];
    praiseEl.classList.add('show');
    burstConfetti(12);
    speakEn(en, true); // 直前のカウント("Three!"等)を消さずに続ける
    cheerReact();
    setTimeout(() => {
      praiseEl.classList.remove('show');
      if (Object.values(tasks).every(Boolean)) celebrate();
      else goHome();
    }, 1600);
  }

  function celebrate() {
    show('home');
    // ごほうび:まだ図鑑にいないおともだちを1匹なかまに
    // まずりくのおともだち、コンプリート後はうみのおともだちが来る
    const landRemaining = allFriends.filter(f => !friends.includes(f));
    const seaRemaining = seaFriends.filter(f => !friends.includes(f));
    const remaining = landRemaining.length ? landRemaining : seaRemaining;
    const msg = document.getElementById('new-friend-msg');
    const icon = document.getElementById('celebrate-icon');
    const parade = document.getElementById('friend-parade');
    parade.innerHTML = '';
    let confettiN = 24;
    if (remaining.length) {
      const newFriend = remaining[Math.floor(Math.random() * remaining.length)];
      friends.push(newFriend);
      localStorage.setItem('pakupaku-zukan', JSON.stringify(friends));
      icon.textContent = newFriend;
      if (friends.length === allFriends.length) {
        // 🏆 りく12ひきコンプリートの特別なお祝い
        msg.textContent = 'ずかん コンプリート! つぎは うみの おともだちが くるよ! 🏆🌊';
        speakEn('All friends together! Amazing!', true);
        confettiN = 48;
      } else if (friends.length === allFriends.length + seaFriends.length) {
        // 🏆 うみのおともだちも全員そろった
        msg.textContent = 'うみの おともだちも ぜんいん あつまったよ! すごい! 🏆🌊';
        speakEn('All sea friends together! Amazing!', true);
        confettiN = 48;
      } else {
        msg.textContent = 'あたらしい おともだちが きたよ! ずかんを みてみてね 📖';
      }
    } else {
      icon.textContent = '🎉';
      msg.textContent = 'おともだち ぜんいん あつまったよ! すごい!';
    }
    // りくのおともだちがそろったら、あつまったみんなでパレード
    if (friends.length >= allFriends.length) {
      friends.forEach((f, i) => {
        const s = document.createElement('span');
        s.textContent = f;
        s.style.animationDelay = (i * .1) + 's';
        parade.appendChild(s);
      });
    }
    document.getElementById('celebrate').classList.add('active');
    sfx.fanfare();
    speak('きょうも ぜんぶ できたね! おめでとう!');
    burstConfetti(confettiN);
  }
  function burstConfetti(n) {
    for (let i = 0; i < n; i++) {
      const c = document.createElement('div');
      c.className = 'confetti';
      c.textContent = ['🎉', '⭐', '💮', '🌸'][i % 4];
      c.style.left = Math.random() * 100 + 'vw';
      c.style.animationDelay = Math.random() * 1.2 + 's';
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 4000);
    }
  }
  // ごほうびは ふうせんわり → いろあわせ → かたちあわせ → かずあわせ の4日ローテーション
  document.getElementById('next-day-btn').addEventListener('click', () => {
    document.getElementById('celebrate').classList.remove('active');
    sfx.tap();
    const kind = day % 4; // day1→🎈, day2→🎨, day3→⭐, day4→🔢, …
    if (kind === 2) { show('colormatch'); setupColorMatch(); }
    else if (kind === 3) { show('shapematch'); setupShapeMatch(); }
    else if (kind === 0) { show('countmatch'); setupCountMatch(); }
    else { show('balloon'); setupBalloons(); }
  });

  function advanceDay() {
    const prevHat = hatOf(day);
    day++; localStorage.setItem('pakupaku-day', day);
    Object.keys(tasks).forEach(k => tasks[k] = false);
    const newHat = hatOf(day);
    if (newHat !== prevHat) showHatReveal(newHat);
    else goHome();
  }
  document.getElementById('balloon-skip').addEventListener('click', () => { sfx.tap(); advanceDay(); });
  document.getElementById('colormatch-skip').addEventListener('click', () => { sfx.tap(); advanceDay(); });
  document.getElementById('shapematch-skip').addEventListener('click', () => { sfx.tap(); advanceDay(); });
  document.getElementById('countmatch-skip').addEventListener('click', () => { sfx.tap(); advanceDay(); });

  // ---------- 🎁 あたらしいぼうしのお披露目 ----------
  function showHatReveal(hat) {
    show('hatreveal');
    const gift = document.getElementById('gift-btn');
    const guide = document.getElementById('hat-guide');
    guide.textContent = 'ぱっくんに プレゼントが とどいたよ! あけてみて!';
    gift.textContent = '🎁';
    gift.classList.remove('opened');
    gift.onclick = () => {
      gift.onclick = null;
      gift.textContent = hat;
      gift.classList.add('opened');
      guide.textContent = 'あたらしい ぼうしを もらったよ!';
      sfx.fanfare();
      speakEn('A new hat!');
      burstConfetti(16);
      setTimeout(goHome, 2500);
    };
  }

  // ---------- 🎨 いろあわせ(ごほうびミニゲーム・いろの えいご) ----------
  function setupColorMatch() {
    const target = document.getElementById('color-target');
    const choices = document.getElementById('color-choices');
    const shine = c => `radial-gradient(circle at 35% 30%, rgba(255,255,255,.6), transparent 55%), ${c}`;
    let round = 0;
    function nextRound() {
      round++;
      const picks = [...balloonColors].sort(() => Math.random() - .5).slice(0, 3);
      const [answerColor, answerName] = picks[Math.floor(Math.random() * picks.length)];
      target.style.background = shine(answerColor);
      const question = 'Which is ' + answerName.toLowerCase() + '?';
      speakEn(question); // 出題も英語で
      choices.innerHTML = '';
      picks.forEach(([c]) => {
        const b = document.createElement('button');
        b.className = 'color-choice';
        b.style.background = shine(c);
        b.onclick = () => {
          if (c === answerColor) {
            choices.querySelectorAll('button').forEach(x => x.onclick = null);
            b.classList.add('correct');
            sfx.pop(); speakEn(answerName + '!');
            if (round === 3) { sfx.fanfare(); setTimeout(advanceDay, 1000); }
            else setTimeout(nextRound, 800);
          } else {
            // まちがえてもペナルティなし。ぷるぷる揺れて、もういちど出題
            sfx.tap();
            b.classList.remove('wobble'); void b.offsetWidth; b.classList.add('wobble');
            speakEn(question);
          }
        };
        choices.appendChild(b);
      });
    }
    nextRound();
  }

  // ---------- ⭐ かたちあわせ(ごほうびミニゲーム・かたちの えいご) ----------
  function setupShapeMatch() {
    const target = document.getElementById('shape-target');
    const choices = document.getElementById('shape-choices');
    let round = 0;
    function nextRound() {
      round++;
      const picks = [...shapeList].sort(() => Math.random() - .5).slice(0, 3);
      const [answerShape, answerName] = picks[Math.floor(Math.random() * picks.length)];
      target.textContent = answerShape;
      const question = 'Which is the ' + answerName.toLowerCase() + '?';
      speakEn(question); // 出題も英語で
      choices.innerHTML = '';
      picks.forEach(([s]) => {
        const b = document.createElement('button');
        b.className = 'color-choice shape';
        b.textContent = s;
        b.onclick = () => {
          if (s === answerShape) {
            choices.querySelectorAll('button').forEach(x => x.onclick = null);
            b.classList.add('correct');
            sfx.pop(); speakEn(answerName + '!');
            if (round === 3) { sfx.fanfare(); setTimeout(advanceDay, 1000); }
            else setTimeout(nextRound, 800);
          } else {
            // まちがえてもペナルティなし。ぷるぷる揺れて、もういちど出題
            sfx.tap();
            b.classList.remove('wobble'); void b.offsetWidth; b.classList.add('wobble');
            speakEn(question);
          }
        };
        choices.appendChild(b);
      });
    }
    nextRound();
  }

  // ---------- 🎈 ふうせんわり(ごほうびミニゲーム・いろの えいご) ----------
  function setupBalloons() {
    const zone = document.getElementById('balloon-zone');
    zone.innerHTML = '';
    // 日数がすすむと ふうせんが少しずつ増える(6→7→8、最大8)
    const count = Math.min(8, 6 + Math.floor((day - 1) / 4));
    let left = count;
    const spots = [[8, 4], [62, 2], [34, 24], [5, 48], [64, 44], [34, 66], [8, 70], [62, 66]];
    [...balloonColors].sort(() => Math.random() - .5).slice(0, count).forEach(([c, name], i) => {
      const b = document.createElement('button');
      b.className = 'balloon';
      b.style.background = `radial-gradient(circle at 35% 30%, rgba(255,255,255,.6), transparent 55%), ${c}`;
      b.style.left = (spots[i][0] + Math.random() * 8) + '%';
      b.style.top = (spots[i][1] + Math.random() * 5) + '%';
      b.style.animationDelay = (Math.random() * 1.5) + 's';
      b.addEventListener('click', () => {
        if (b.classList.contains('popped')) return;
        b.classList.add('popped');
        sfx.pop(); speakEn(name + '!');
        if (--left === 0) {
          sfx.fanfare();
          setTimeout(advanceDay, 1000);
        }
      });
      zone.appendChild(b);
    });
  }

  // ---------- 🔢 かずあわせ(ごほうびミニゲーム・かずの えいご) ----------
  function setupCountMatch() {
    const target = document.getElementById('count-target');
    const choices = document.getElementById('count-choices');
    const countEn = ['One', 'Two', 'Three', 'Four', 'Five'];
    let round = 0;
    function nextRound() {
      round++;
      const n = 1 + Math.floor(Math.random() * 5);
      const [emoji] = foodList[Math.floor(Math.random() * foodList.length)];
      target.textContent = emoji.repeat(n);
      const question = 'How many?';
      speakEn(question); // 出題も英語で
      // 選択肢: 正解 + ちがう数字2つ(1〜5)
      const opts = [n];
      while (opts.length < 3) {
        const c = 1 + Math.floor(Math.random() * 5);
        if (!opts.includes(c)) opts.push(c);
      }
      opts.sort(() => Math.random() - .5);
      choices.innerHTML = '';
      opts.forEach(c => {
        const b = document.createElement('button');
        b.className = 'color-choice num';
        // 数字が読めなくてもわかるように、数字+同じ数の●を並べる
        const digit = document.createElement('span');
        digit.className = 'num-digit'; digit.textContent = c;
        const dots = document.createElement('span');
        dots.className = 'num-dots'; dots.textContent = '●'.repeat(c);
        b.append(digit, dots);
        b.onclick = () => {
          if (c === n) {
            choices.querySelectorAll('button').forEach(x => x.onclick = null);
            b.classList.add('correct');
            sfx.pop(); speakEn(countEn[n - 1] + '!');
            if (round === 3) { sfx.fanfare(); setTimeout(advanceDay, 1000); }
            else setTimeout(nextRound, 800);
          } else {
            // まちがえてもペナルティなし。ぷるぷる揺れて、もういちど出題
            sfx.tap();
            b.classList.remove('wobble'); void b.offsetWidth; b.classList.add('wobble');
            speakEn(question);
          }
        };
        choices.appendChild(b);
      });
    }
    nextRound();
  }

  // ---------- 🍚 ごはん ----------
  function setupMeal() {
    const tray = document.getElementById('food-tray');
    tray.innerHTML = '';
    document.getElementById('meal-guide').textContent = 'たべものを タッチして たべさせてね';
    let eaten = 0;
    const picks = [...foodList].sort(() => Math.random() - .5).slice(0, 3);
    picks.forEach(([f, en]) => {
      const btn = document.createElement('button');
      btn.className = 'food'; btn.textContent = f;
      btn.addEventListener('click', () => {
        if (btn.classList.contains('eaten')) return;
        btn.classList.add('eaten');
        speakEn(en + '!');
        flyToMouth(btn, f, () => {
          eaten++;
          sfx.eat();
          cheerReact();
          speakEn(['One!', 'Two!', 'Three!'][eaten - 1], true); // たべた数を英語でカウント
          const char = document.getElementById('char-meal');
          char.classList.add('happy');
          setTimeout(() => char.classList.remove('happy'), 500);
          if (eaten === 3) setTimeout(offerShare, 700);
        });
      });
      tray.appendChild(btn);
    });
  }
  // おうえんに来ているおともだちにも1つおすそわけしてからタスク完了
  function offerShare() {
    const cheer = document.querySelector('#screen-meal .cheer-friend');
    if (!cheer) { completeTask('meal'); return; }
    document.getElementById('meal-guide').textContent = 'おともだちにも あげよう!';
    // おともだちが「ぼくにもちょうだい!」と全力アピール
    cheer.classList.add('begging');
    const bubble = document.createElement('span');
    bubble.className = 'beg-bubble'; bubble.textContent = '🥺';
    cheer.appendChild(bubble);
    speakEn('Me too, please!', true);
    const [f, en] = foodList[Math.floor(Math.random() * foodList.length)];
    const tray = document.getElementById('food-tray');
    const btn = document.createElement('button');
    btn.className = 'food'; btn.textContent = f;
    tray.appendChild(btn);
    btn.addEventListener('click', () => {
      if (btn.classList.contains('eaten')) return;
      btn.classList.add('eaten');
      speakEn(en + '!');
      const fly = document.createElement('div');
      fly.className = 'flying-food'; fly.textContent = f;
      const from = btn.getBoundingClientRect();
      const to = cheer.getBoundingClientRect();
      fly.style.left = from.left + 'px'; fly.style.top = from.top + 'px';
      document.body.appendChild(fly);
      requestAnimationFrame(() => {
        fly.style.left = to.left + 'px'; fly.style.top = to.top + 'px';
        fly.style.transform = 'scale(.3)';
      });
      setTimeout(() => {
        fly.remove(); sfx.eat();
        cheer.classList.remove('begging'); bubble.remove();
        void cheer.offsetWidth; cheer.classList.add('hop');
        speakEn('Yummy! Thank you!', true);
        // なかよし度アップ(ずかんのハートが増える)
        const fe = cheer.dataset.friend;
        hearts[fe] = (hearts[fe] || 0) + 1;
        localStorage.setItem('pakupaku-hearts', JSON.stringify(hearts));
        setTimeout(() => completeTask('meal'), 900);
      }, 520);
    });
  }
  function flyToMouth(fromEl, emoji, onArrive) {
    const char = document.getElementById('char-meal');
    char.classList.add('open');
    const fly = document.createElement('div');
    fly.className = 'flying-food'; fly.textContent = emoji;
    const from = fromEl.getBoundingClientRect();
    const to = char.querySelector('.mouth').getBoundingClientRect();
    fly.style.left = from.left + 'px'; fly.style.top = from.top + 'px';
    document.body.appendChild(fly);
    requestAnimationFrame(() => {
      fly.style.left = to.left + 'px'; fly.style.top = to.top + 'px';
      fly.style.transform = 'scale(.2)';
    });
    setTimeout(() => { fly.remove(); char.classList.remove('open'); onArrive(); }, 520);
  }

  // ---------- 🪥 はみがき ----------
  function setupTeeth() {
    const mouth = document.getElementById('teeth-mouth');
    mouth.querySelectorAll('.germ').forEach(g => g.remove());
    let alive = 3 + Math.floor(Math.random() * 3); // 3〜5ひき
    const count = alive;
    for (let i = 0; i < count; i++) {
      const g = document.createElement('div');
      g.className = 'germ'; g.textContent = '👾';
      g.dataset.hp = 6;
      g.style.left = (6 + i * (78 / count) + Math.random() * 6) + '%';
      g.style.top = (8 + Math.random() * 20) + '%';
      mouth.appendChild(g);
    }
    const brush = document.getElementById('brush');
    let lastScrub = 0;
    function onMove(e) {
      const t = e.touches ? e.touches[0] : e;
      brush.style.display = 'block';
      brush.style.left = t.clientX + 'px'; brush.style.top = t.clientY + 'px';
      const now = Date.now();
      if (now - lastScrub > 90) { sfx.scrub(); lastScrub = now; }
      mouth.querySelectorAll('.germ:not(.dead)').forEach(g => {
        const r = g.getBoundingClientRect();
        if (t.clientX > r.left - 12 && t.clientX < r.right + 12 &&
            t.clientY > r.top - 12 && t.clientY < r.bottom + 12) {
          g.dataset.hp--;
          g.style.transform = `scale(${.3 + g.dataset.hp * .12}) rotate(${Math.random() * 40 - 20}deg)`;
          if (g.dataset.hp <= 0) {
            g.classList.add('dead'); sfx.pop(); alive--;
            if (alive === 0) {
              brush.style.display = 'none';
              speakEn('Clean teeth!'); // 褒め言葉はこの後queueで続く
              setTimeout(() => completeTask('teeth'), 600);
            }
          }
        }
      });
      e.preventDefault();
    }
    mouth.ontouchmove = onMove;
    mouth.onpointermove = e => { if (e.pointerType !== 'touch' && e.buttons) onMove(e); };
    mouth.ontouchend = mouth.onpointerup = () => { brush.style.display = 'none'; };
  }

  // ---------- 🛁 おふろ ----------
  function setupBath() {
    const zone = document.getElementById('bath-zone');
    const guide = document.getElementById('bath-guide');
    const showerBtn = document.getElementById('shower-btn');
    zone.querySelectorAll('.dirt, .bubble').forEach(el => el.remove());
    showerBtn.style.visibility = 'hidden';
    guide.textContent = 'からだを なでなでして あわあわ にしてね';
    let dirty = 3;
    const spots = [[20, 30], [60, 55], [35, 70]];
    spots.forEach(([x, y]) => {
      const d = document.createElement('div');
      d.className = 'dirt'; d.textContent = '🟤';
      d.dataset.hp = 5;
      d.style.left = x + '%'; d.style.top = y + '%';
      zone.appendChild(d);
    });
    let lastBubble = 0;
    function onMove(e) {
      const t = e.touches ? e.touches[0] : e;
      const zr = zone.getBoundingClientRect();
      const now = Date.now();
      if (now - lastBubble > 120) {
        lastBubble = now; sfx.scrub();
        const b = document.createElement('div');
        b.className = 'bubble'; b.textContent = '🫧';
        b.style.left = (t.clientX - zr.left - 10) + 'px';
        b.style.top = (t.clientY - zr.top - 10) + 'px';
        zone.appendChild(b);
        // 泡はシャワーで流すまで残す(増えすぎたら古いものから消す)
        const bubbles = zone.querySelectorAll('.bubble');
        if (bubbles.length > 50) bubbles[0].remove();
      }
      zone.querySelectorAll('.dirt:not(.clean)').forEach(d => {
        const r = d.getBoundingClientRect();
        if (t.clientX > r.left - 16 && t.clientX < r.right + 16 &&
            t.clientY > r.top - 16 && t.clientY < r.bottom + 16) {
          if (--d.dataset.hp <= 0) {
            d.classList.add('clean'); sfx.pop(); dirty--;
            if (dirty === 0) {
              guide.textContent = 'シャワーで ながそう!';
              speakEn('Bubbles!');
              showerBtn.style.visibility = 'visible';
            }
          }
        }
      });
      e.preventDefault();
    }
    zone.ontouchmove = onMove;
    zone.onpointermove = e => { if (e.pointerType !== 'touch' && e.buttons) onMove(e); };
    showerBtn.onclick = () => {
      showerBtn.onclick = null;
      sfx.tap();
      for (let i = 0; i < 16; i++) {
        const drop = document.createElement('div');
        drop.className = 'drop'; drop.textContent = '💧';
        drop.style.left = (15 + Math.random() * 70) + 'vw';
        drop.style.top = '5vh';
        drop.style.animationDelay = (Math.random() * .5) + 's';
        document.body.appendChild(drop);
        setTimeout(() => drop.remove(), 1500);
      }
      [400, 500, 600].forEach((f, i) => tone(f, .3, i * .1, 'sine', .12));
      zone.querySelectorAll('.bubble').forEach(b => b.remove());
      speakEn('Splash, splash!');
      setTimeout(() => completeTask('bath'), 1200);
    };
  }

  // ---------- 🧸 おかたづけ ----------
  function setupTidy() {
    const zone = document.getElementById('tidy-zone');
    const box = document.getElementById('toy-box');
    zone.innerHTML = '';
    let left = 4;
    const picks = [...toyList].sort(() => Math.random() - .5).slice(0, 4);
    const spots = [[8, 15], [60, 10], [20, 60], [65, 62]];
    picks.forEach(([t, en], i) => {
      const btn = document.createElement('button');
      btn.className = 'toy'; btn.textContent = t;
      btn.style.left = (spots[i][0] + Math.random() * 10) + '%';
      btn.style.top = (spots[i][1] + Math.random() * 10) + '%';
      btn.addEventListener('click', () => {
        if (btn.classList.contains('stored')) return;
        btn.classList.add('stored');
        speakEn(en + '!'); // おもちゃの名前も英語で
        // おもちゃが箱まで飛んでいくアニメーション
        const fly = document.createElement('div');
        fly.className = 'flying-toy'; fly.textContent = t;
        const from = btn.getBoundingClientRect();
        const to = box.getBoundingClientRect();
        fly.style.left = from.left + 'px'; fly.style.top = from.top + 'px';
        document.body.appendChild(fly);
        requestAnimationFrame(() => {
          fly.style.left = (to.left + to.width / 4) + 'px';
          fly.style.top = to.top + 'px';
          fly.style.transform = 'scale(.3)';
        });
        setTimeout(() => {
          fly.remove(); sfx.pop();
          box.classList.add('bounce');
          setTimeout(() => box.classList.remove('bounce'), 200);
          if (--left === 0) setTimeout(() => completeTask('tidy'), 500);
        }, 520);
      });
      zone.appendChild(btn);
    });
  }

  // ---------- 📖 ずかん ----------
  function renderZukan() {
    const grid = document.getElementById('zukan-grid');
    grid.innerHTML = '';
    // りく12ひきコンプリート後は、うみのおともだちの枠も見えるようになる
    const landComplete = allFriends.every(f => friends.includes(f));
    const roster = landComplete ? [...allFriends, ...seaFriends] : allFriends;
    roster.forEach(f => {
      const slot = document.createElement('button');
      const owned = friends.includes(f);
      slot.className = 'zukan-slot' + (owned ? '' : ' locked');
      slot.textContent = owned ? f : '❓';
      if (owned && hearts[f]) {
        // ごはんをおすそわけした回数だけハート(最大3つ表示)
        const h = document.createElement('div');
        h.className = 'zukan-hearts';
        h.textContent = '❤️'.repeat(Math.min(3, hearts[f]));
        slot.appendChild(h);
      }
      slot.addEventListener('click', () => {
        if (!owned) { sfx.tap(); return; }
        slot.classList.remove('hop');
        void slot.offsetWidth; // アニメーションを毎回リスタートさせる
        slot.classList.add('hop');
        cry(f);
        speakEn(friendNames[f] + '!');
      });
      grid.appendChild(slot);
    });
    document.getElementById('zukan-count').textContent =
      `おともだち ${friends.length} / ${roster.length}`;
  }
  document.getElementById('zukan-home-btn').addEventListener('click', () => { sfx.tap(); goHome(); });

  // ---------- 🌙 ねんね ----------
  function setupSleep() {
    const scr = document.getElementById('screen-sleep');
    const sw = document.getElementById('light-switch');
    const guide = document.getElementById('sleep-guide');
    const char = document.getElementById('char-sleep');
    scr.classList.remove('night');
    scr.querySelectorAll('.star').forEach(s => s.remove());
    char.classList.remove('sleeping');
    document.getElementById('zzz').style.display = 'none';
    sw.textContent = '💡';
    sw.style.visibility = 'visible';
    sw.classList.remove('rise');
    guide.textContent = 'でんきを けして ねんねさせてあげよう';
    sw.onclick = () => {
      if (scr.classList.contains('night')) return;
      scr.classList.add('night');
      char.classList.add('sleeping');
      document.getElementById('zzz').style.display = 'block';
      // textContentを空にするとボタンの高さが消えてキャラが持ち上がるので、visibilityで隠す
      sw.style.visibility = 'hidden';
      guide.textContent = 'すやすや… おやすみなさい';
      sfx.night();
      speak('おやすみなさい');
      const area = scr.querySelector('.play-area');
      for (let i = 0; i < 8; i++) {
        const s = document.createElement('div');
        s.className = 'star'; s.textContent = '⭐';
        s.style.left = Math.random() * 90 + '%';
        s.style.top = Math.random() * 30 + '%';
        s.style.animationDelay = Math.random() * 1.5 + 's';
        area.appendChild(s);
      }
      setTimeout(() => {
        sw.textContent = '🌞';
        sw.style.visibility = 'visible';
        sw.classList.add('rise'); // おひさまが下からのぼって自然に登場
        setTimeout(() => sw.classList.remove('rise'), 1700);
        guide.textContent = 'おひさまを タッチして あさに しよう!';
        sw.onclick = () => {
          sw.onclick = null;
          // あさになる演出:夜が明けて、ぱっくんが目をさます
          scr.classList.remove('night');
          scr.querySelectorAll('.star').forEach(s => s.remove());
          document.getElementById('zzz').style.display = 'none';
          char.classList.remove('sleeping');
          char.classList.add('happy');
          sw.classList.remove('rise'); void sw.offsetWidth; sw.classList.add('rise');
          guide.textContent = 'あさに なったよ! おはよう! ☀️';
          speakEn('Good morning!');
          [523, 659, 784, 1047].forEach((f, i) => tone(f, .25, i * .13, 'triangle', .25));
          setTimeout(() => {
            char.classList.remove('happy');
            sw.classList.remove('rise');
            completeTask('sleep');
          }, 1800);
        };
      }, 3000);
    };
  }

  renderHome();
