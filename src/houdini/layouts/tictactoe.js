class TicTacToeBoard {
  static get inputProperties() {
    return ['--win-condition'];
  }

  highlightWinings(ctx, x, y, width) {
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(x, y, width, width);
  }

  paint(ctx, geom, properties) {
    // Use `ctx` as if it was a normal canvas
    const minDim = Math.min(geom.width, geom.height);
    const xStart = (geom.width - minDim) / 2;
    const yStart = (geom.height - minDim) / 2;
    const boxWidth = minDim / 3;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(xStart + boxWidth, yStart);
    ctx.lineTo(xStart + boxWidth, yStart + minDim);
    ctx.moveTo(xStart + boxWidth * 2, yStart);
    ctx.lineTo(xStart + boxWidth * 2, yStart + minDim);
    ctx.moveTo(xStart, yStart + boxWidth);
    ctx.lineTo(xStart + minDim, yStart + boxWidth);
    ctx.moveTo(xStart, yStart + boxWidth * 2);
    ctx.lineTo(xStart + minDim, yStart + boxWidth * 2);
    ctx.stroke();
    ctx.beginPath();

    const winingBoxes = properties.get('--win-condition')[0];
    if (winingBoxes) {
      let winingCombinations = (winingBoxes >>> 0).toString(2);
      winingCombinations =
        '000000000'.substr(winingCombinations.length) + winingCombinations;
      for (let i = 0; i < 9; i++) {
        if (winingCombinations[i] === '1') {
          console.log(winingCombinations, i % 3, Math.floor(i / 3));
          this.highlightWinings(
            ctx,
            boxWidth * 0.05 + xStart + (i % 3) * boxWidth,
            boxWidth * 0.05 + yStart + Math.floor(i / 3) * boxWidth,
            boxWidth * 0.9,
          );
        }
      }
    }
  }
}
class PlayerCircle {
  paint(ctx, geom, properties) {
    // Use `ctx` as if it was a normal canvas
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(geom.width / 2, geom.height / 2, geom.width * 0.4, 0, 2 * Math.PI);
    ctx.stroke();
  }
}
class PlayerCross {
  paint(ctx, geom, properties) {
    // Use `ctx` as if it was a normal canvas
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(geom.width * 0.2, geom.height * 0.2);
    ctx.lineTo(geom.width * 0.8, geom.height * 0.8);
    ctx.moveTo(geom.width * 0.2, geom.height * 0.8);
    ctx.lineTo(geom.width * 0.8, geom.height * 0.2);
    ctx.stroke();
  }
}

// Register our class under a specific name
registerPaint('tictacboard', TicTacToeBoard);
registerPaint('crossMark', PlayerCross);
registerPaint('circleMark', PlayerCircle);
