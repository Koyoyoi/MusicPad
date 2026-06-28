// bpm block
function drawBPM(bpm, w) {
  stroke("#080808");
  strokeWeight(w / 10);
  fill("#1c1c1c");
  rect(3 * w, w / 9 + 2, 2 * w - 2, (w / 9) * 7, 40); // bpm

  noStroke();
  fill("#fcfaf2");
  textSize(w / 4);
  text(` BPM  =   ${bpm}`, 3 * w + w / 5, (w / 5) * 3 + 1);
}
// beat block
function drawBeat(col, w) {
  stroke("#080808");
  strokeWeight(w / 10);
  fill("#1c1c1c");
  rect(1 * w, w / 9 + 2, 4 * w - 2, (w / 9) * 7, 40);

  noStroke();
  fill("#fcfaf2");
  textSize(w / 2);
  text(`🎵`, 1 * w + w / 7, (w / 7) * 5 + 1);

  textSize(w / 4);
  text(`=  1 / ${col}`, 2 * w - w / 20, (w / 5) * 3 + 1);
}
// volume block
function drawVolume(volPos, w, maxCol) {
  stroke("#080808");
  strokeWeight(w / 10);
  fill("#1c1c1c");
  rect((maxCol - 2) * w, w / 9 + 2, 3 * w, (w / 9) * 7, 40);

  noStroke();
  fill("#fcfaf2");
  textSize(w / 2);
  text(`🔊`, (maxCol - 2) * w + w / 7, (w / 7) * 5 + 1);

  fill("#434343");
  rect((maxCol - 1) * w - w / 10, w / 2, 2 * w - w / 5, w / 10, 40);

  fill("#fcfaf2");
  square(volPos.x, volPos.y, w / 4, 50);
}
// chord mode block
function drawChordMod(chordMode, animate, modPos, w) {
  stroke("#080808");
  strokeWeight(w / 10);
  if (chordMode) fill("#006284");
  else fill("#1c1c1c");
  rect(0, w / 9 + 7 * w + 2, 2 * w - 2, (w / 9) * 7, 40);

  noStroke();
  if (chordMode) {
    fill("#1e88a8");
    if (animate && modPos.x < modPos.L) modPos.x += 5;
    else animate = false;
  } else {
    fill("#434343");
    if (animate && modPos.x > modPos.R) modPos.x -= 5;
    else animate = false;
  }
  square(modPos.x, modPos.y, w / 2, 50);
  textSize(w / 2);
  text(`Chord Mode`, w / 7 + 2 * w, 8 * w - w / 3 + 3);
}

function drawScale(w, maxCol) {
  stroke("#080808");
  strokeWeight(w / 10);
  fill("#1c1c1c");
  rect((maxCol - 3) * w, w / 9 + 7 * w + 2, 4 * w, (w / 9) * 7, 40);

  noStroke();
  fill("#080808");
  rect((maxCol - 2) * w, 7 * w, 3, w);

  fill("#fcfaf2");
  textSize(w / 3);
  text(` Scale`, (maxCol - 4) * w, 8 * w - w / 3);
  text(` ${keyName[`${scaleKey}`]}`, (maxCol - 3) * w + w / 4, 8 * w - w / 3);
  text(` ${typeTab[type]}`, (maxCol - 1) * w, 8 * w - w / 3);
}

function drawSynth(w) {
  let textLength = 20 - synthTab[synth].length;
  stroke("#080808");
  strokeWeight(w / 10);
  fill("#1c1c1c");
  rect(6 * w, w / 9 + 7 * w + 2, 5 * w, (w / 9) * 7, 20);
  rect(7 * w - w / 2, w / 9 + 7 * w + 2, 4 * w, (w / 9) * 7, 5);

  noStroke();
  fill("#fcfaf2");
  textSize(w / 3);
  text(` <`, 6 * w + 5, 8 * w - w / 3);
  text(` >`, 10 * w + w / 2 + 5, 8 * w - w / 3);
  text(`${synthTab[synth]}`, 7 * w + w / 11 + textLength * 5, 8 * w - w / 3);

  synthPos = { R: 6 * w + 5, L: 10 * w + w / 2 + 5, y: w / 9 + 7 * w + 2 };
}
