let startNote = 60;
let endNote = 88;
let interval = 3; // 音度
let chordMode = false;
let whiteKeys = [];
let blackKeys = [];
let chordTab = { M: [0, 4, 7], m: [0, 3, 7], dim: [0, 3, 6] };
let scaleTab = {
  Major: [
    ["M", 2],
    ["m", 2],
    ["m", 1],
    ["M", 2],
    ["M", 2],
    ["m", 2],
    ["dim", 1],
  ],
  Minor: [
    ["m", 2],
    ["dim", 1],
    ["M", 2],
    ["m", 2],
    ["m", 1],
    ["M", 2],
    ["M", 2],
  ],
};
let keyName = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
let typeTab = ["Major", "Minor"];
let synthTab = ["Lofi Piano", "Guitar", "Full Brass Staccato"];
let type = 0;
let scaleKey = 0;
let synth = 0;
let chords = [];
let key_font = {
  wk: {},
  bk: {},
};

class Key {
  constructor(midi, pos, isBlack) {
    this.midi = midi;
    this.pos = pos;
    this.isBlack = isBlack;
    this.isPressed = false;
  }

  // 檢查滑鼠是否在此鍵範圍內
  isInside() {
    if (this.isBlack) {
      return (
        mouseX >= this.pos.x &&
        mouseX <= this.pos.x + key_font.bk.w &&
        mouseY >= this.pos.y &&
        mouseY <= this.pos.y + key_font.bk.h
      );
    } else {
      return (
        mouseX >= this.pos.x &&
        mouseX <= this.pos.x + key_font.wk.w &&
        mouseY >= this.pos.y &&
        mouseY <= this.pos.y + key_font.wk.h
      );
    }
  }
}

function buildPianoKey(h) {
  blackKeys = [];
  whiteKeys = [];
  let initP = 0;
  for (let n = 0; n < interval; n++) {
    for (let i = 0; i < 12; i++) {
      let midi = startNote + i + n * 12;
      if (midi > endNote) break;
      let pos = { x: initP + 1, y: h };
      let isBlack = (i > 4 && i % 2 == 0) || (i < 4 && i % 2 == 1);

      let k = new Key(midi, pos, isBlack);

      // 黑鍵
      if (isBlack) {
        k.pos.x -= 20; // 黑鍵偏移量
        blackKeys.push(k);
      }
      // 白鍵
      else {
        whiteKeys.push(k);
        initP += key_font.wk.w; // 每次移動 x 位置以容納下一個白鍵
      }
    }
  }
  changeKey();
}

function changeKey() {
  chords = [];
  for (let scale of scaleTab[typeTab[type]]) {
    let tmp = [];
    tmp = [scaleKey % 12, scale[0]];
    scaleKey = (scaleKey + scale[1]) % 12;
    chords.push(tmp);
  }
}

function drawKey() {
  strokeWeight(w / 10);
  // 繪製白鍵
  for (let w of whiteKeys) {
    stroke("#080808");
    if (w.isPressed) {
      fill("#f8c3cd"); // 按下時
    } else {
      fill("#fcfaf2");
    }
    rect(w.pos.x, w.pos.y, key_font.wk.w, key_font.wk.h, 10);

    if (chordMode) {
      noStroke();
      let mark = { x: key_font.wk.w / 2 - 4, y: key_font.wk.h - 20 };
      for (let c of chords) {
        if (c[0] == w.midi % 12) {
          fill("#1e88a8");
          square(w.pos.x + mark.x, w.pos.y + mark.y, 10, 50);
        }
      }
    }
  }

  // 繪製黑鍵
  for (let b of blackKeys) {
    stroke("#080808");
    if (b.isPressed) {
      fill("#f8c3cd"); // 按下時
    } else {
      fill("#1c1c1c");
    }
    rect(b.pos.x, b.pos.y, key_font.bk.w, key_font.bk.h, 5);

    if (chordMode) {
      noStroke();
      let mark = { x: key_font.bk.w / 2 - 4, y: key_font.bk.h - 20 };
      for (let c of chords) {
        if (c[0] == b.midi % 12) {
          fill("#1e88a8");
          square(b.pos.x + mark.x, b.pos.y + mark.y, 10, 50);
        }
      }
    }
  }
}

function resetKey() {
  for (let w of whiteKeys) {
    w.isPressed = false; // 重置為未按下
  }
  for (let b of blackKeys) {
    b.isPressed = false; // 重置為未按下
  }
  infoChord = [];
}

function pressedKey(keyNum = 0) {
  let isChord = false;
  let t;
  let root = 0;
  // black key
  for (let b of blackKeys) {
    if (keyNum == 0) wavTab[synthTab[synth]][b.midi].stop();
    if ((b.isInside() && keyNum == 0) || (keyNum == b.midi && !b.isPressed)) {
      wavTab[synthTab[synth]][b.midi].setVolume(volume / 50);
      wavTab[synthTab[synth]][b.midi].play();
      b.isPressed = true; // 標記為按下
      root = b.midi;
      break;
    }
  }
  // white key
  if (root == 0) {
    for (let w of whiteKeys) {
      if (keyNum == 0) wavTab[synthTab[synth]][w.midi].stop();
      if ((w.isInside() && keyNum == 0) || (keyNum == w.midi && !w.isPressed)) {
        wavTab[synthTab[synth]][w.midi].setVolume(volume / 50);
        wavTab[synthTab[synth]][w.midi].play();
        w.isPressed = true; // 標記為按下
        root = w.midi;
        break;
      }
    }
  }

  // chord generate
  for (let c of chords) {
    if (c[0] == root % 12) {
      for (let note of chordTab[c[1]]) {
        // black key
        for (let b of blackKeys) {
          if (b.midi == note + root && !b.isPressed) {
            wavTab[synthTab[synth]][b.midi].setVolume(volume / 50);
            wavTab[synthTab[synth]][b.midi].play();
            b.isPressed = true; // 標記為按下
            break;
          }
        }
        // white key
        for (let w of whiteKeys) {
          if (w.midi == note + root && !w.isPressed) {
            wavTab[synthTab[synth]][w.midi].setVolume(volume / 50);
            wavTab[synthTab[synth]][w.midi].play();
            w.isPressed = true; // 標記為按下
            break;
          }
        }
        if (!chordMode) break;
        else {
          isChord = true;
          t = c[1];
        }
      }
      break;
    }
  }
  if (root == 0) return ["", "", ""];
  return [root, isChord, t];
}
