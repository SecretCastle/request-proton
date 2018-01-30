import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'antd';
import QRCode from './core/qrcode-proton';
import QRCodeExtra from './extra/qrcode_extra';


class App extends PureComponent {
  download = () => {
    this.clickdownload.downloadFile();
  }
  render() {
    return (
      <div>
        <Button type="primary" onClick={this.download}>点击下载</Button>
        {/* <QRCode
          ref = { input => this.clickdownload = input }
          size={150}
          value={'https://app.fogcloud.io/xxxxxxx/xxxxxx'}
          logoSize={60}
          download={true}
          appname={'智能球泡灯 A5'}
          logo={'https://fog-pub-test.gz.bcebos.com/fog-pub-front/18225864728/product/57adb732fc2111e7804bfa163e431402/productimg/BitmapCopy51516678162020.png'}
        /> */}
        <QRCodeExtra />
      </div>
    );
  }
}
  

ReactDOM.render(
  <App />,
  document.getElementById('app')
);