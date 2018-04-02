import Qrious from 'qrious';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * qrcode 优化版本
 */
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
  roundRect(ctx, x, y, w, h, rs, type, borderWidth = 10) {
    const minSize = Math.min(w, h);
    let r = rs;
    if (rs > minSize / 2) {
      r = minSize / 2;
    }
    if (type) {
      ctx.strokeStyle = '#ccc';
      ctx.lineWidth = borderWidth;
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
  componentDidMount() {
    this.createQrcode();
    this.createMiniQrcode();
  }

  createQrcode() {
    const { logo } = this.props;
    const newLogo = `${logo.split(':')[0].replace('s', '')}:${logo.split(':')[1]}`;
    let CoreImgURL;
    const ctx = this.Core.getContext('2d');
    ctx.save();
    this.qriousCore = new Qrious({ element: this.Core });
    this.qriousCore.size = tools.QrCodeCoreSize;
    this.qriousCore.padding = 40;
    this.qriousCore.level = this.props.level;
    this.qriousCore.value = this.props.value;
    const CoreDataURL = this.Core.toDataURL();
    this.clearCanvas(ctx, tools.QrCodeCoreSize, tools.QrCodeCoreSize);
    this.qriousCore.size = tools.QrCodeIcon;
    this.qriousCore.padding = 0;
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = newLogo;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, tools.QrCodeIcon, tools.QrCodeIcon);
      CoreImgURL = this.Core.toDataURL();
      this.drawImg([CoreDataURL, CoreImgURL], ctx);
    };
  }

  clearCanvas = (context, width, height) => {
    context.clearRect(0, 0, width, height);
  }

  createText = (ctx) => {
    ctx.restore();
    ctx.font = '72px serif';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.fillText(this.props.name || 'APP', tools.QrCodeCoreSize / 2, 1400);
  }

  drawImg(data, context) {
    const len = data.length;
    this.clearCanvas(context, tools.QrCodeCoreSize, tools.QrCodeCoreSize);
    this.Core.width = tools.QrCodeCoreSize;
    this.Core.height = tools.QrCodeCoreSize + tools.QrCodeIcon;
    context.fillStyle = '#fff';
    context.fillRect(0, 0, tools.QrCodeCoreSize, tools.QrCodeCoreSize + tools.QrCodeIcon);
    this.createText(context);
    for (let index = 0; index < len; index += 1) {
      const img = new Image();
      img.src = data[index];
      img.crossOrigin = 'Anonymous';
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
            : tools.QrCodeIcon,
        );
        tools.roundRect(
          context,
          (tools.QrCodeCoreSize - tools.QrCodeIcon) / 2,
          (tools.QrCodeCoreSize - tools.QrCodeIcon) / 2,
          200,
          200,
          15,
          'border',
        );
      };
    }
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
    qirous.size = 200;
    qirous.padding = 0;
    qirous.level = this.props.level;
    qirous.value = this.props.value;
    const img = new Image();
    img.src = this.props.logo;
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      ctx.drawImage(img, 70, 70, 50, 50);
      tools.roundRect(ctx, 70, 70, 50, 50, 10, 'border', 5);
    };
  }

  render() {
    return (
      <div>
        <canvas ref={(Core) => { this.Core = Core; }} style={{ display: 'none' }} />
        <canvas ref={(Mini) => { this.Mini = Mini; }} />
      </div>
    );
  }
}

QrcodeOptimize.propType = {
  value: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  level: PropTypes.string.isRequired,
};

QrcodeOptimize.defaultProps = {
  value: '',
  logo: '',
  level: 'M',
};

export default QrcodeOptimize;
