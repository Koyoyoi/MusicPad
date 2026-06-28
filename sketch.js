let bpm = 120;
let row = 5;
let col = 16;
let maxCol = 16;
let w = 50;
let infoChord = [];
let icons = [];
let isLoop = false;
let bpmDrag = false;
let volDrag = false;
let animate = false;
let keepSound = false;
let keepPressed = false;
let rollingPos = 1;
let play_icon, stop_icon;
let prevMouse = {};
let wavTab = {
  Drum: [],
  "Lofi Piano": [],
  Guitar: [],
  "Full Brass Staccato": [],
  Demo: [],
};
let volume = 75;
let volPos, modPos, keyPos, typePos, synthPos;

function preload() {
  icons[0] = { img: loadImage("Icon/cymbal.jpg"), name: "cymbal" };
  icons[1] = { img: loadImage("Icon/hihat.jpg"), name: "hihat" };
  icons[2] = { img: loadImage("Icon/snare.jpg"), name: "snare" };
  icons[3] = { img: loadImage("Icon/tom.jpg"), name: "tom" };
  icons[4] = { img: loadImage("Icon/kick.jpg"), name: "kick" };
  play_icon = loadImage("Icon/play.jpg");
  stop_icon = loadImage("Icon/stop.jpg");
  wavTab.Drum = [
    loadSound("Drum/cymbal.wav"),
    loadSound("Drum/hihat.wav"),
    loadSound("Drum/snare.wav"),
    loadSound("Drum/tom.wav"),
    loadSound("Drum/kick.wav"),
  ];
  for (let syn of synthTab) {
    for (let n = startNote; n <= endNote; n++) {
      wavTab[syn][n] = loadSound(`${syn}/${n}.wav`);
    }
  }
  for (let i = 0; i < 5; i++) {
    wavTab.Demo[i] = loadSound(`Demo/${i}.wav`);
  }
}

function setup() {
  let window = { w: (maxCol + 3) * w + 7, h: (row + 2) * w + 2 };
  key_font.wk = { w: w, h: 3 * w };
  key_font.bk = { w: w / 2, h: (3 * w) / 2 };

  createCanvas(window.w, window.h + 300);
  buildBlock(2);
  buildPianoKey(window.h + w);
  buildDemo();

  volPos = { x: maxCol * w - w / 5 - 5, y: w / 2 - 5 };
  modPos = { x: w / 7, y: 7 * w + w / 3 - 4, L: 0, R: 0 };
  modPos.L = modPos.x + (6 * w) / 5;
  modPos.R = modPos.x + 5;
  keyPos = { x: (maxCol - 3) * w, y: w / 9 + 7 * w + 2 };
  typePos = { x: (maxCol - 2) * w, y: w / 9 + 7 * w + 2 };
}

function draw() {
  background("#080808");
  drawBlock();
  drawKey();
  drawDemo();
  drawBeat(col, w);
  drawBPM(bpm, w);
  drawVolume(volPos, w, maxCol);
  drawChordMod(chordMode, animate, modPos, w);
  drawScale(w, maxCol);
  drawSynth(w);

  // play || stop
  let icon_w = w / 5;
  if (buttoms[col + 1].isPressed) {
    stop_icon.resize(w - 10, w - 10);
    image(stop_icon, 5, 5 + w);
  } else {
    play_icon.resize(w - 10, w - 10);
    image(play_icon, 5, +5 + w);
    isLoop = false;
    rollingPos = 1;
  }

  if (chordMode && infoChord[1]) {
    noStroke();
    fill("#fcfaf2");
    textSize(w / 3);
    text(
      `${keyName[infoChord[0] % 12]}${infoChord[2]}`,
      9 * w + w / 11,
      w - w / 3
    );
  }
}
// Mouse Pressed
function mousePressed() {
  pressedButton();
  pressedDemo();
  infoChord = pressedKey();

  // loop controll
  if (buttoms[col + 1].isPressed && !isLoop) {
    LiveLoop();
  }
  // block controll
  if (buttoms[2].isPressed) {
    bitNum++;
    bitNum %= bitRange.length;
    buildBlock(bitNum);
  }
  // mode controll
  if (checkInside(0, w / 9 + 7 * w + 2, 2 * w - 2, (w / 9) * 7)) {
    chordMode = !chordMode;
    animate = true;
  }
  // key controll
  if (checkInside(keyPos.x, keyPos.y, w - 2, (w / 9) * 7)) {
    scaleKey++;
    scaleKey %= keyName.length;
    changeKey();
  }
  // type controll
  if (checkInside(typePos.x, typePos.y, 3 * w - 2, (w / 9) * 7)) {
    type++;
    type %= typeTab.length;
    changeKey();
  }
  // synth controll
  if (checkInside(synthPos.R, synthPos.y, w / 2, (w / 9) * 7)) {
    synth--;
    synth = (synth + synthTab.length) % synthTab.length;
  } else if (checkInside(synthPos.L, synthPos.y, w / 2, (w / 9) * 7)) {
    synth++;
    synth %= synthTab.length;
  }
}

function checkInside(x, y, w, h) {
  return mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h;
}

// Mouse Dragged
function mouseDragged() {
  let pressedVolume = checkInside(volPos.x, volPos.y, w / 4, w / 4);

  if (buttoms[4].isInside()) bpmDrag = true;
  else if (pressedVolume) volDrag = true;

  // BPM controll
  if (bpmDrag) {
    if (mouseY < prevMouse.y) bpm++;
    else if (mouseY > prevMouse.y) bpm--;
  }
  // sound volume controll
  else if (volDrag) {
    if (mouseX < prevMouse.x) volume -= 2;
    else if (mouseX > prevMouse.x) volume += 2;
    volPos.x = mouseX - w / 8;
  }

  if (bpm < 30) bpm = 30;
  if (bpm > 244) bpm = 244;
  if (volPos.x < (maxCol - 1) * w - w / 10) {
    volume = 0;
    volPos.x = (maxCol - 1) * w - w / 10;
  }
  if (volPos.x > (maxCol + 1) * w - w / 2) {
    volume = 150;
    volPos.x = (maxCol + 1) * w - w / 2;
  }

  prevMouse = { x: mouseX, y: mouseY };
}

// Mouse Released
function mouseReleased() {
  bpmDrag = false;
  volDrag = false;
  resetKey();
}

function keyPressed() {
  infoChord = pressedKey(keyTab[key]);
}

function keyReleased() {
  resetKey();
}
// Delay
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Start Loop
async function LiveLoop() {
  isLoop = true;
  rollingPos = 1;
  let beat;
  while (isLoop) {
    if (rollingPos > maxCol) rollingPos = 1;
    else {
      beat = ((60000 / bpm) * 4) / col;
      drumSound(rollingPos);
      await sleep(beat);
      rollingPos += maxCol / col;
      for (let b of buttoms) b.isPlaying = false;
    }
  }
}

// Play Sound
function drumSound(col) {
  for (let b of buttoms) {
    if (b.pos.X == col && b.pos.Y >= 2) {
      b.isPlaying = true;
      wavTab.Drum[b.pos.Y - 2].setVolume(volume / 10);
      if (b.isPressed) wavTab.Drum[b.pos.Y - 2].play();
    }
  }
}
