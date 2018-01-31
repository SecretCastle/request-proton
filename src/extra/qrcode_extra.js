import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import QRious from 'qrious';

const DOWNLOAD_IMG_WIDTH = 1200;
const DOWNLOAD_IMG_HEIGHT = 1380;
const DOWNLOAD_QRCODE_SIZE = 1000;
const DOWNLOAD_LOGO_WIDTH = 220;
const DOWNLOAD_LOGO_HEIGHT = 200;

class QRCodeExtra extends PureComponent {
  componentDidMount () {
    console.log(this.cvsbase);
    this.qr = new QRious({
      element: this.cvsbase,
      value: 'http://www.baidu.com',
      size: DOWNLOAD_QRCODE_SIZE,
      level: 'M',
      padding: 0,
    });
    this.drawShowCanvas();
  }
  
  drawShowCanvas = () => {
    const ctx = this.cvsshow.getContext('2d');
    ctx.save();
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0 , DOWNLOAD_IMG_WIDTH, DOWNLOAD_IMG_HEIGHT);
    this.qr.image.onload = () => {
      ctx.drawImage(this.qr.image, 100, 100);
    };
    this.createText(ctx);
    this.createIcon(ctx);
  }

  createText = (ctx) => {
    ctx.restore();
    ctx.font = '72px serif';
    ctx.textAlign = 'center';
    ctx.fillText('智能球泡灯 A5', 600, 1260);
  }

  createIcon = (ctx) => {
    const img = new Image();
    const size = DOWNLOAD_QRCODE_SIZE;
    img.src = 'https://fog-pub-test.gz.bcebos.com/fog-pub-front/18225864728/product/57adb732fc2111e7804bfa163e431402/productimg/BitmapCopy51516678162020.png';
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const dWidth = DOWNLOAD_LOGO_WIDTH;
      const dHeight = DOWNLOAD_LOGO_HEIGHT;
      const px = (size + 200 - dWidth) / 2;
      const py = (size + 200 - dWidth) / 2;
      img.width = dWidth;
      img.height = dHeight;
      ctx.restore();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#ccc';
      ctx.strokeRect(px, py, dWidth, dHeight);
      ctx.drawImage(img, px, py, dWidth, dHeight);
    };
  }

  downloadImgae = () => {
    const aLink = document.createElement('a');
    const blob = this.base64ToBlob(this.cvsshow.toDataURL()); // new Blob([content]);
    const evt = document.createEvent('HTMLEvents');
    evt.initEvent('click', true, true); // initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
    aLink.download = `${new Date().getTime()}.png`;
    aLink.href = URL.createObjectURL(blob);
    aLink.click();
  }

  base64ToBlob = (code) => {
    const parts = code.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; i += 1) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  }

  render() {
    return(
      <div ref={(dom) => { this.domQRcode = dom; }}>
        <canvas ref={ (cvsbase) => { this.cvsbase = cvsbase; } } style={{ display: 'none' }}/>
        <canvas ref={ (cvsshow) => { this.cvsshow = cvsshow; }} width={DOWNLOAD_IMG_WIDTH} height={DOWNLOAD_IMG_HEIGHT} style={{ width: DOWNLOAD_IMG_WIDTH, height: DOWNLOAD_IMG_HEIGHT, background: '#fff' }}/>
        <canvas ref={ (cvsdisplay) => {this.cvsdisplay = cvsdisplay;}} />
      </div>
    );
  }
}

export default QRCodeExtra;
