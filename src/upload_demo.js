import React from 'react';
import ReactDOM from 'react-dom';
import AliUploader from './core/request-upload-ali';
import BaiduUplaoder from './core/request-upload-baidu';
const uploaded = (filepath) => {
  console.log(filepath);
};


ReactDOM.render(
  <div>
    <BaiduUplaoder
      type={'product'}
      id={'upload_bd_product'}
      success={uploaded}
      bucket={'fog-pub-test'}
      bosEndPoint={'https://fog-pub-test.gz.bcebos.com'}
      uptokenUrl={'https://cnapitest.fogcloud.io/gettoken/'}
      showSuccess={true}
    />
  </div>
  ,
  document.getElementById('app')
);