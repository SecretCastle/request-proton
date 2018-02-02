import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import QRious from 'qrious';

/**
 * 常量设置
 */
const DOWNLOAD_IMG_WIDTH = 1200;
const DOWNLOAD_IMG_HEIGHT = 1380;
const DOWNLOAD_QRCODE_SIZE = 1000;
const DOWNLOAD_LOGO_WIDTH = 220;
const DOWNLOAD_LOGO_HEIGHT = 220;



class QRCodeExtra extends PureComponent {
  componentDidMount () {
    this.qr = new QRious({
      element: this.cvsbase,
      value: this.props.value || 'https://github.com/SecretCastle',
      size: DOWNLOAD_QRCODE_SIZE,
      level: this.props.level || 'M',
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

  // 画圆角
  roundRect = (ctx, x, y, w, h, r, type) => {
    var min_size = Math.min(w, h);
    if (r > min_size / 2) r = min_size / 2;
    if (type) {
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 15;
    }
    // 开始绘制
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    if (type) {
      ctx.stroke();
    }
  };


  createText = (ctx) => {
    ctx.restore();
    ctx.font = '72px serif';
    ctx.textAlign = 'center';
    ctx.fillText(this.props.name || 'APP', 600, 1260);
  }

  createIcon = (ctx) => {
    const img = new Image();
    const size = DOWNLOAD_QRCODE_SIZE;
    img.src = 'https://fog-pub-test.gz.bcebos.com/fog-pub-front/18225864728/product/57adb732fc2111e7804bfa163e431402/productimg/BitmapCopy51516678162020.png';
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      // draw circle
      const dWidth = DOWNLOAD_LOGO_WIDTH;
      const dHeight = DOWNLOAD_LOGO_HEIGHT;
      const px = (size + 200 - dWidth) / 2;
      const py = (size + 200 - dWidth) / 2;
      img.width = dWidth;
      img.height = dHeight;
      ctx.restore();
      this.roundRect(ctx, px, py, dWidth, dHeight, 48);
      ctx.clip();
      ctx.drawImage(img, px, py, dWidth, dHeight);
      this.roundRect(ctx, px, py, dWidth, dWidth, 48, 'border');
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
        <canvas ref={ (cvsdisplay) => { this.cvsdisplay = cvsdisplay; }} />
      </div>
    );
  }
}

export default QRCodeExtra;
