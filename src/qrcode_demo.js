import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'antd';
import QRCode from './core/qrcode-proton';
import QRCodeExtra from './extra/qrcode_extra';
import CVSDemo from './extra/canvas_extra';

class App extends PureComponent {
  download = () => {
    this.clickdownload.downloadImgae();
  }
  render() {
    return (
      <div>
        <Button type="primary" onClick={this.download}>点击下载</Button>
        <QRCode
          ref = { qrcode => this.clickdownload = qrcode }
          size={200}
          logoSize={70}
          download={true}
          name={'智能球泡灯 A5'}
          value={'http://www.baidu.com'}
          logo={'https://avatars0.githubusercontent.com/u/12498143?s=460&v=4'}
        />
      </div>
    );
  }
}
  

ReactDOM.render(
  <App />,
  document.getElementById('app')
);