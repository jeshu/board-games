class TicTacToeBoard {
  paint(ctx, geom, properties) {
    // Use `ctx` as if it was a normal canvas
    const minDim = Math.min(geom.width, geom.height);
    const xStart = (geom.width-minDim)/2
    const yStart = (geom.height-minDim)/2
    const boxWidth = minDim/3;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(xStart+boxWidth,yStart);
    ctx.lineTo(xStart+boxWidth,yStart+minDim);
    ctx.moveTo(xStart+boxWidth*2,yStart);
    ctx.lineTo(xStart+boxWidth*2,yStart+minDim);
    ctx.moveTo(xStart,yStart+boxWidth);
    ctx.lineTo(xStart+minDim,yStart+boxWidth);
    ctx.moveTo(xStart,yStart+boxWidth*2);
    ctx.lineTo(xStart+minDim,yStart+boxWidth*2);
    ctx.stroke();
    ctx.beginPath();
    
    ctx.strokeStyle = "rgba(90,80,200,0.8)";
    ctx.moveTo(xStart+boxWidth/2,yStart);
    ctx.lineTo(xStart+boxWidth/2,yStart+minDim);
    ctx.stroke();
  }
}
class PlayerCircle {
  paint(ctx, geom, properties) {
    // Use `ctx` as if it was a normal canvas
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(geom.width/2, geom.height/2, geom.width*0.4, 0, 2 * Math.PI);
    ctx.stroke();
  }
}
class PlayerCross {
  paint(ctx, geom, properties) {
    // Use `ctx` as if it was a normal canvas
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(geom.width*.2, geom.height*.2);
    ctx.lineTo(geom.width*.8, geom.height*.8);
    ctx.moveTo(geom.width*.2, geom.height*.8);
    ctx.lineTo(geom.width*.8, geom.height*.2);
    ctx.stroke();
  }
}

// Register our class under a specific name
registerPaint('tictacboard', TicTacToeBoard);
registerPaint('crossMark', PlayerCross);
registerPaint('circleMark', PlayerCircle);
