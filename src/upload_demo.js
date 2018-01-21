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
      bosEndPoint={''}
      uptokenUrl={''}
      showSuccess={true}
      accept={'.bin'}
    />
  </div>
  ,
  document.getElementById('app')
);