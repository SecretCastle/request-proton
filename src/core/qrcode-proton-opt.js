import Qrious from 'qrious';
import React, { Component } from 'react';

const tools = {
  QrCodeCoreSize: 1300,
  QrCodeIcon: 200,
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
};

class QrcodeOptimize extends Component {
  state = {
    logo: ''
  }
  componentDidMount() {
    this.createQrcode();
    this.createMiniQrcode();
  }

  createQrcode() {
    const { logo } = this.props;
    let CoreDataURL;
    let CoreImgURL;
    const ctx = this.Core.getContext('2d');
    ctx.save();
    this.qriousCore = new Qrious({ element: this.Core });
    this.qriousCore.size = tools.QrCodeCoreSize;
    this.qriousCore.padding = 40;
    CoreDataURL = this.Core.toDataURL();
    this.clearCanvas(ctx, tools.QrCodeCoreSize, tools.QrCodeCoreSize);
    this.qriousCore.size = tools.QrCodeIcon;
    this.qriousCore.padding = 0;
    const img = new Image();
    img.src = logo;
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      ctx.drawImage(img, 0, 0, tools.QrCodeIcon, tools.QrCodeIcon);
      CoreImgURL = this.Core.toDataURL();
      this.drawImg([CoreDataURL, CoreImgURL], ctx, this.qriousCore);
    };
  }

  drawImg(data, context, qriousInstance) {
    const len = data.length;
    this.clearCanvas(context, tools.QrCodeCoreSize, tools.QrCodeCoreSize);
    this.Core.width = tools.QrCodeCoreSize;
    this.Core.height = tools.QrCodeCoreSize + tools.QrCodeIcon;
    for (let index = 0; index < len; index++) {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = data[index];
      img.onload = () => {
        context.drawImage(
          img,
          index === 0
            ? 0
            : (tools.QrCodeCoreSize - tools.QrCodeIcon) / 2,
          index === 0
            ? 0
            : (tools.QrCodeCoreSize - tools.QrCodeIcon) / 2,
          index === 0
            ? tools.QrCodeCoreSize
            : tools.QrCodeIcon,
          index === 0
            ? tools.QrCodeCoreSize
            : tools.QrCodeIcon
        );
        tools.roundRect(
          context,
          (tools.QrCodeCoreSize - tools.QrCodeIcon) / 2,
          (tools.QrCodeCoreSize - tools.QrCodeIcon) / 2,
          200,
          200,
          15,
          'border'
        );
      };
    }
  }
  
  clearCanvas(context, width, height) {
    context.clearRect(0, 0, width, height);
  }

  downloadQrCode() {
    const aLink = document.createElement('a');
    const evt = document.createEvent('HTMLEvents');
    evt.initEvent('click', true, true);
    const dataURL = this.Core.toDataURL();
    const blob = tools.base64ToBlob(dataURL);
    aLink.download = `${new Date().getTime()}.png`;
    aLink.href = URL.createObjectURL(blob);
    aLink.click();
  }

  createMiniQrcode() {
    const qirous = new Qrious({ element: this.Mini });
    const ctx = this.Mini.getContext('2d');
    qirous.size = 400;
    qirous.padding = 10;
    const img = new Image();
    img.src = this.props.logo;
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      ctx.drawImage(img, 150, 150, 100, 100);
      tools.roundRect(ctx, 150, 150, 100, 100, 10, 'border');
    };
  }

  render() {
    return (
      <div>
        <canvas ref={Core => { this.Core = Core; }} style={{ display: 'none' }} />
        <canvas ref={Mini => { this.Mini = Mini; }}/>
      </div>
    );
  }
}

export default QrcodeOptimize;