import React, { Component } from 'react';
import Qrious from 'qrious';

const paintUtil = {
  base64ToBlob(code) {
    const parts = code.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; i += 1) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  },
  qrcodeSize: 1300,
  iconSize: 200,
  roundRect(ctx, x, y, w, h, r, type) {
    var min_size = Math.min(w, h);
    if (r > min_size / 2) r = min_size / 2;
    if (type) {
      ctx.strokeStyle = '#ccc';
      ctx.lineWidth = 10;
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
  },
  createImage(blob) {
    const img = new Image();
    img.src = blob;
    img.onload = () => {
      return img;
    };
    return img;
  }
};

class QrcodeOpt extends Component {
  componentDidMount() {
    this.qrious = new Qrious({ element: this.CoreCVS });
    this.ctx = this.CoreCVS.getContext('2d');
    this.ctx.save();
    this.createQrCode();
  }

  /**
   *  初始化二维码
   */
  createQrCode() {
    this.qrious.padding = 50;
    this.qrious.size = paintUtil.qrcodeSize;
    this.qrious.level = 'M';
    this.createIcon();
  }

  createIcon() {
    const imgIcon = new Image();
    imgIcon.src = 'https://fog-pub-test.gz.bcebos.com/fog-pub-front/18225864728/app/b6fcedca1dfa11e8804bfa163e431402/image/3c28af542f2d49f7-44af7693092324ab-869d2323859c3b4f0635ae36154fd44d1520230202929.jpg';
    imgIcon.setAttribute('crossOrigin', 'Anonymous');
    imgIcon.onload = () => {
      this.ctx.drawImage(
        imgIcon,
        (paintUtil.qrcodeSize - paintUtil.iconSize) / 2,
        (paintUtil.qrcodeSize - paintUtil.iconSize) / 2,
        paintUtil.iconSize, paintUtil.iconSize
      );
      const dWidth = paintUtil.iconSize;
      const dHeight = paintUtil.iconSize;
      const px = (paintUtil.qrcodeSize - dWidth) / 2;
      const py = (paintUtil.qrcodeSize - dWidth) / 2;
      paintUtil.roundRect(this.ctx, px, py, dWidth, dHeight, 10, 'border');
      this.downLoadQrcode();
    };
  }

  downLoadQrcode() {
    const aLink = document.createElement('a');
    const evt = document.createEvent('HTMLEvents');
    evt.initEvent('click', true, true);
    const cvsDownload = this.DownloadCvs.getContext('2d');
    // const blob = paintUtil.base64ToBlob(this.CoreCVS.toDataURL());
    const img = new Image();
    img.src = this.CoreCVS.toDataURL();
    img.onload = () => {
      cvsDownload.drawImage(img, 0, 0, paintUtil.qrcodeSize, paintUtil.qrcodeSize);
      const blob2 = paintUtil.base64ToBlob(this.DownloadCvs.toDataURL());
      aLink.download = `${new Date().getTime()}.png`;
      aLink.href = URL.createObjectURL(blob2);
      aLink.click();
    };
    // const downloadImg = paintUtil.createImage(this.CoreCVS.toDataURL());
  }

  render() {
    return (
      <div>
        <canvas ref={(CoreCVS) => { this.CoreCVS = CoreCVS; }} />
        <canvas
          ref={(DownloadCvs) => {this.DownloadCvs = DownloadCvs; }} 
          width='1300'
          height='1600'
          style={{
            width: 1300,
            height: 1600
          }}
        />
      </div>
    );
  }
}

export default QrcodeOpt;
