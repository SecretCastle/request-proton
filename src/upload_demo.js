import React from 'react';
import ReactDOM from 'react-dom';
import AliUploader from './core/request-upload-ali';
import BaiduUplaoder from './core/request-upload-baidu';

const uploaded = (filepath) => {
  console.log(filepath);
};

ReactDOM.render(
  <div>
    <AliUploader type={'image'} id={'upload_product'} success={uploaded}/>
    <BaiduUplaoder
      type={'product'}
      id={'upload_bd_product'}
      success={uploaded}
    />
  </div>
  ,
  document.getElementById('app')
);