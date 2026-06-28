let buttoms = [];
let bitRange = [4, 8, 16, 32];
let bitNum = 2;

class Block {
  constructor(pos, icon) {
    this.pos = pos;
    this.icon = icon;
    this.isPressed = false;
    this.isPlaying = false;
  }
  isInside() {
    let t = (maxCol / col) * w - 1;
    if (this.pos.X == 0 || this.pos.Y == 0) t = w;
    return (
      mouseX >= this.pos.X * w &&
      mouseX <= this.pos.X * w + t &&
      mouseY >= this.pos.Y * w &&
      mouseY <= this.pos.Y * w + w
    );
  }
}

function buildBlock(n) {
  buttoms = [];
  col = bitRange[n];
  for (let y = 0; y <= row + 1; y++) {
    let t = maxCol / col - 1;
    for (let x = 0; x <= col; x++) {
      let icon = null;

      if (x == 0 && y > 1) icon = icons[y - 2].img;
      if (y > 0 && x > 1) {
        buttoms.push(new Block({ X: x + t, Y: y }, icon));
        t += maxCol / col - 1;
      } else {
        buttoms.push(new Block({ X: x, Y: y }, icon));
      }
    }
  }
}

function drawBlock() {
  let quarterBar = true;
  let bar = 1;

  // color
  for (let b of buttoms) {
    stroke("#080808");
    strokeWeight(w / 10);
    if (b.pos.Y > 0) {
      if (b.pos.X % 4 == 1) {
        quarterBar = !quarterBar;
      }

      if (b.pos.X == 0 || b.pos.Y == 1) {
        fill("#1c1c1c");
      } else if (b.isPlaying && b.isPressed) {
        fill("#f8c3cd");
      } else if (b.isPlaying) {
        fill("#bdc0ba");
      } else if (b.isPressed) {
        fill("#a8d8b9");
      } else if (quarterBar) {
        fill("#434343");
      } else {
        fill("#656765");
      }

      if (b.pos.X == 0) {
        square(b.pos.X * w + 1, b.pos.Y * w + 1, w, w / 10);
      } else if (b.pos.Y == 1 && b.pos.X % 4 == 1) {
        rect(b.pos.X * w + 1, b.pos.Y * w + 1, 4 * w, w, w / 10);
      } else if (b.pos.X > 0 && b.pos.Y > 1) {
        rect(b.pos.X * w + 1, b.pos.Y * w + 1, (w * maxCol) / col, w, w / 10);
      }

      // Add text at row
      if (b.pos.Y == 1 && b.pos.X % 4 == 1) {
        fill("#fcfaf2");
        noStroke();
        textSize(w / 3);
        text(
          ` ${bar}  /  4`,
          b.pos.X * w + 1 + w * 1.5,
          b.pos.Y * w + 1 + (w * 9) / 14
        );
        bar++;
      }
      // Add icon at first column
      if (b.icon != null) {
        b.icon.resize(w - 10, w - 10);
        image(b.icon, b.pos.X * w + 5, b.pos.Y * w + 5);
      }
    }
  }
}

function pressedButton() {
  for (let b of buttoms) {
    if (b.isInside()) {
      b.isPressed = !b.isPressed;
      break;
    }
  }
}
