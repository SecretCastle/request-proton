import React from 'react';
import ReactDOM from 'react-dom';
import AliUploader from './core/request-upload-ali';
import BaiduUplaoder from './core/request-upload-baidu';

const uploaded = (filepath) => {
  console.log(filepath);
};

ReactDOM.render(
  <AliUploader type={'image'} id={'upload_product'} success={uploaded}/>
  ,
  document.getElementById('app')
);