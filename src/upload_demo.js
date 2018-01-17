import React from 'react';
import ReactDOM from 'react-dom';
import AliUploader from './core/request-upload-ali';
import BaiduUplaoder from './core/request-upload-baidu';


const uploaded = (filepath, file, info) => {
  console.log(filepath);
};

ReactDOM.render(
  <div>
    <BaiduUplaoder
      type={`useridtest-app-xxxxx-profile`}
      id={'upload_bd_product'}
      success={uploaded}
      bucket={'fog-pub-front'}
      bosEndPoint={'https://fog-pub-test.gz.bcebos.com'}
      uptokenUrl={'https://cnapitest.fogcloud.io/gettoken/'}
      showSuccess={true}
    />
  </div>
  ,
  document.getElementById('app')
);