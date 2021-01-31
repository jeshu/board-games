class TicTacToeBoard {
  paint(ctx, geom, properties) {
    // Use `ctx` as if it was a normal canvas
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(geom.width / 3, 0);
    ctx.lineTo(geom.width / 3, geom.height);
    ctx.moveTo(geom.width* 2 / 3, 0);
    ctx.lineTo(geom.width* 2/ 3, geom.height);
    ctx.moveTo(0, geom.height / 3);
    ctx.lineTo(geom.width, geom.height / 3);
    ctx.moveTo(0, geom.height *2/ 3);
    ctx.lineTo(geom.width, geom.height *2/ 3);
    ctx.stroke();

    // for (let y = 0; y < geom.height / size; y++) {
    //   for (let x = 0; x < geom.width / size; x++) {
    //     const color = colors[(x + y) % colors.length];
    //     ctx.beginPath();
    //     ctx.fillStyle = color;
    //     ctx.rect(x * size, y * size, size, size);
    //     ctx.fill();
    //   }
    // }
  }
}

// Register our class under a specific name
registerPaint('checkerboard', TicTacToeBoard);
