import React, { Component } from 'react';

class CvsTest extends Component {
  createBorder = (ctx, x = 490, y = 490, w = 200, h = 200, r = 48) => {
    // // width 100; height 100 radius 50
    // ctx.beginPath();
    // ctx.moveTo(50, 0); // x + r, y
    // ctx.arcTo(100, 0, 100, 100, 50); // ctx.arcTo(x + w, y, x + w, y + h, r);
    // ctx.arcTo(100, 100, 0, 100, 50); // ctx.arcTo(x + w, y + h, x, y + h, r); 
    // ctx.arcTo(0, 100, 0, 0, 50);
    // ctx.arcTo(0, 0, 100, 0, 50);
    // // ctx.arcTo(x, y + h, x, y, r);
    // // ctx.arcTo(x, y, x + w, y, r);
    // ctx.stroke();

    var min_size = Math.min(w, h);
    if (r > min_size / 2) r = min_size / 2;
    // 开始绘制
    ctx.beginPath();
    ctx.strokeStyle='#f00';
    ctx.lineWidth=10;
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.stroke();
  }

  componentDidMount() {
    const cvs = document.getElementById('test_cvs');
    const ctx = cvs.getContext('2d');
    this.createBorder(ctx);
  }
  
  render () {
    return (
      <canvas id="test_cvs" width='1000' height='1000' />
    );
  }
}

export default CvsTest;