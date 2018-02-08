import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { Button, Icon } from 'antd';
import QRCode from './core/qrcode-proton';
import QRCodeExtra from './extra/qrcode_extra';
import CVSDemo from './extra/canvas_extra';

class App extends PureComponent {
  state = {
    value: 'hello world 1',
    name: 'Bug Test 1'
  }
  download = () => {
    this.clickdownload.downloadImgae();
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
