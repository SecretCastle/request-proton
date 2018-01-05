import React from 'react';
import ReactDOM from 'react-dom';
import Uploader from './core/request-upload';

const uploaded = (filepath) => {
	console.log(filepath);
};

ReactDOM.render(
	<Uploader type={'image'} id={'upload_product'} success={uploaded}/>
	,
	document.getElementById('app')
);