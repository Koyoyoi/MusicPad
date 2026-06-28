let demos = [];

class Box {
  constructor(pos, num) {
    this.pos = pos;
    this.num = num;
    this.isPlaying = false;
  }
  isInside() {
    return (
      mouseX >= this.pos.x * w &&
      mouseX <= this.pos.x * w + 2 * w &&
      mouseY >= this.pos.y * w &&
      mouseY <= this.pos.y * w + 2 * w
    );
  }
}

function buildDemo() {
  demos = [];
  let initPos = { x: 17, y: -1 };
  for (let i = 0; i < wavTab.Demo.length; i++) {
    demos.push(new Box({ x: initPos.x, y: (initPos.y += 2) }, i));
  }
}

function drawDemo() {
  for (let b of demos) {
    let colorSwitch;
    if (b.isPressed) colorSwitch = [199 - b.num * 30, 62, 58 + b.num * 30];
    else colorSwitch = "#434343";
    stroke("#080808");
    strokeWeight(w / 10);
    fill(colorSwitch);
    square(b.pos.x * w + 5, b.pos.y * w + 1, 2 * w, w / 5);
    noStroke();
    fill("#1c1c1c");
    square(b.pos.x * w + 5 + 10, b.pos.y * w + 1 + 10, 2 * w - 20, w / 10);
    stroke(colorSwitch);
    fill("#1c1c1c");
    textSize(w / 2);
    text(`0${b.num + 1}`, b.pos.x * w + w - 15, b.pos.y * w + w + 5);
    strokeWeight(w / 20);
    noStroke();
    fill(colorSwitch);
    square(b.pos.x * w + w, b.pos.y * w + w + 30, 15, 10);
  }

  stroke("#434343");
  strokeWeight(w / 10);
  fill("#080808");
  textSize(w / 2);
  text(`Demo`, 17 * w + w / 3, w / 2 + 15);
}

function pressedDemo() {
  for (let b of demos) {
    if (b.isInside()) {
      b.isPressed = !b.isPressed;

      if (b.isPressed) wavTab.Demo[b.num].loop();
      else wavTab.Demo[b.num].stop();
      break;
    }
  }
}
