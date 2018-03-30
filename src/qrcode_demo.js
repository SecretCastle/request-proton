import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { Button, Icon } from 'antd';
import QRCode from './core/qrcode-proton';
import QRCodeExtra from './extra/qrcode_extra';
import CVSDemo from './extra/canvas_extra';
import QrcodeOpt from './core/qrcode-proton-opt';

class App extends PureComponent {
  state = {
    value: 'hello world 1',
    name: 'Bug Test 1'
  }
  download = () => {
    // this.clickdownload.downloadImgae();
    this.domQrcode.downloadQrCode();
  }

  reload = () => {
    this.setState({
      value: 'hello world 2',
      name: 'Bug Test 2'
    });
    this.clickdownload.reload();
  }

  render() {
    return (
      <div>
        <Button type="primary" onClick={this.download}>点击下载</Button>
        <Button type="dashed" onClick={this.reload}><Icon type="reload"/>刷新一波</Button>
        <QRCode
          ref = { qrcode => this.clickdownload = qrcode }
          size={200}
          logoSize={70}
          download={true}
          name={this.state.name}
          value={this.state.value}
          logo={'https://fog-pub-test.gz.bcebos.com/fog-pub-front/18225864728/app/b6fcedca1dfa11e8804bfa163e431402/image/3c28af542f2d49f7-44af7693092324ab-869d2323859c3b4f0635ae36154fd44d1520230202929.jpg'}
        />
        <QrcodeOpt
          ref={ domQrcode => this.domQrcode = domQrcode }
          download={true}
          name={this.state.name}
          value={this.state.value}
          logo={'https://fog-pub-test.gz.bcebos.com/fog-pub-front/18225864728/app/b6fcedca1dfa11e8804bfa163e431402/image/3c28af542f2d49f7-44af7693092324ab-869d2323859c3b4f0635ae36154fd44d1520230202929.jpg'}
        />
      </div>
    );
  }
}


ReactDOM.render(
  <App />,
  document.getElementById('app')
);
