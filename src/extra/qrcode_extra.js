import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import QRious from 'qrious';


class QRCodeExtra extends PureComponent {
  componentDidMount () {
    console.log(this.cvsbase);
    this.qr = new QRious({
      element: this.cvsbase,
      value: 'hello world',
      size: 500,
      padding: 0,
    });
    this.qr.canvas.parentNode.appendChild(this.qr.image);
    this.drawShowCanvas();
  }
  
  drawShowCanvas = () => {
    const ctx = this.cvsshow.getContext('2d');
    this.qr.image.onload = () => {
      ctx.drawImage(this.qr.image, 0, 0, 500, 500, 0, 0, 500, 500);
    };
  }

  render() {
    return(
      <div ref={(dom) => { this.domQRcode = dom; }}>
        <canvas ref={ (cvsbase) => { this.cvsbase = cvsbase; } } style={{ display: 'none' }}/>
        <canvas ref={ (cvsshow) => { this.cvsshow = cvsshow; }} style={{ width: '1200px', height: '1300px'  }}/>
      </div>
    );
  }
}

export default QRCodeExtra;
