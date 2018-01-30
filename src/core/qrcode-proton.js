import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import QRious from 'qrious';

/**
 * 支持可下载，可预览的QRCode组件
 *
 * 思路
 * 1、下载：传递一个dom node绑定click事件，当点击那个click的时候，下载图片
 * 2、预览：正常绘制canva预览图片
 */


class QRCode extends PureComponent {
  componentDidMount() {
    this.load();
    if (this.props.download) {
      this.loadDownload();
    }
  }

  componentDidUpdate() {
    this.load();
    if (this.props.download) {
      this.loadDownload();
    }
  }

  // 加载二维码
  load = () => {
    const canvas = this.showCanvas;
    this.qrcode = new QRious({
      element: canvas,
      value: this.props.value,
      level: 'M',
      size: this.props.size,
    });

    if (this.props.logo) {
      this.drawLogo(canvas);
    }
  }

  // 加载下载的二维码
  loadDownload = () => {
    const canvas = this.downloadcvs;
    this.qrcode_big = new QRious({
      element: canvas,
      value: this.props.value,
      level: 'M',
      size: 1200,
      padding: 100,
    });
    if (this.props.logo) {
      this.drawLogoBig(canvas);
      this.drawText(canvas);
    }
  }

  // logo绘制
  drawLogo = (canvas) => {
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const size = this.props.size;
    img.src = this.props.logo;
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const dWidth = this.props.logoSize || size * 0.2;
      const dHeight = this.props.logoSize || size * 0.2;
      const px = (size - dWidth) / 2;
      const py = (size - dWidth) / 2;
      img.width = dWidth;
      img.height = dHeight;
      ctx.drawImage(img, px, py, dWidth, dHeight);
    };
  }

  // 供下载的二维码logo绘制
  drawLogoBig = (canvas) => {
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const size = 1200;
    img.src = this.props.logo;
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const dWidth = 228;
      const dHeight = 228;
      const px = (size - dWidth) / 2;
      const py = (size - dWidth) / 2;
      img.width = dWidth;
      img.height = dHeight;
      ctx.restore();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ccc';
      ctx.strokeRect(px, py, dWidth, dHeight);
      ctx.drawImage(img, px, py, dWidth, dHeight);
    };
  }

  drawText = (canvas) => {
    const ctx = canvas.getContext('2d');
    ctx.restore();
    ctx.font = '52px serif';
    ctx.textAlign = 'center';
    ctx.fillText(this.props.appname, 600, 1160);
  }

  // 下载支持
  downloadFile = () => {
    if (!this.props.download) {
      return false;
    }
    const aLink = document.createElement('a');
    const blob = this.base64ToBlob(this.downloadcvs.toDataURL()); // new Blob([content]);
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
    return (
      <div>
        <canvas
          ref={(canvasShow) => { this.showCanvas = canvasShow; }}
          width={this.props.size}
          height={this.props.size}
          style={{
            height: this.props.size,
            width: this.props.size,
          }}
        />
        {
          this.props.download ? <canvas ref={(downloadcvs) => { this.downloadcvs = downloadcvs; }} width="1200px" height="1200px" style={{ height: '1200px', width: '1200px', display: 'none' }} /> : null
        }
      </div>
    );
  }
}

QRCode.propTypes = {
  size: PropTypes.number.isRequired,
  value: PropTypes.string.isRequired,
};

QRCode.defaultProps = {
  size: 1000,
  value: 'hello world',
};

export default QRCode;
