/**
 * 
 * OSS 直传组件 React版本
 * 
 * CREATED BY SecretCastle 2018-01-03
 * MXCHIP FOGCLOUD
 * 
 * 为了保证安全，需要服务端提供相关参数
 * 
 * 
 * 所需传入的参数
 * 
 * {
 *  type: 'product' 产品相关 ，'image' 图片相关 最大1M，
 *  id: 这个组件的id，必须传，不然不响应，
 *  success：上传成功后返回的函数， 暂时只返回上传后的url
 * }
 * 
 * 可自定义显示内容
 * 
 * 如：
 * <Uploader>
 *    <button>click to upload file</button>
 * </Uploader>
 */

import React from 'react';
import PropTypes from 'prop-types';
import { req } from './request-proton';


const plupload = require('plupload');
const HOST = 'https://mxchip-fog.oss-cn-beijing.aliyuncs.com';
const URL_SERVER = 'https://cnapitest.fogcloud.io';
let DIR_UPLOAD = '/';

const styles = {
  uploaderWrap: {
    display: 'inline-block',
    position: 'relative',
  },
  innerBtn: {
    padding: '5px 10px',
    backgroundColor: '#1890ff',
    borderRadius: '3px',
    color: '#fff',
    fontSize: '12px',
    cursor: 'pointer',
  },
  successInfo: {
    fontSize: '12px'
  }
};

class Uploader extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      success: false,
      error: false,
      msg:'',
    };
  }

  // 这里还能走async/await惊呆了我的小伙伴
  componentDidMount = async () => {
  	const { type } = this.props;
  	// 获取相关依赖
  	const res = await this.getTokenWithType(type);
  	const option = this.getOptionWithType(type);
  	this.uploaderInstance(res, option);
  }

  // 对象实例
  uploaderInstance = (res, option) => {
  	const { id, success } = this.props;
  	const _this = this;
  	const upload = new plupload.Uploader({
  		runtimes: 'html5,flash,silverlight,html4',
  		browse_button: document.getElementById(id),
  		multi_selection: false,
  		...option,
  		init: {
  			PostInit() {
  				console.log(id + '初始化完成');
  			},
  			BeforeUpload(up, file) {
  				_this.set_name(file);
  				_this.set_upload_param(up, '', true, res);
  			},
  			FilesAdded(up){
  				_this.set_name();
  				_this.set_upload_param(up, '', true, res);
  			},
  			FileUploaded(up, file, info) {
  				// 暂时只返回上传后的路径
  				if(info.status === 200){
  					_this.setState({
  						success: true,
  					});
  					success(HOST + '/' + DIR_UPLOAD);
  				}
  			},
  			Error(up, err) {
  				if(err) {
  					_this.setState({
  						error: true,
  						msg: err.message,
  					});
  				}
  			}
  		}
  	});
  	upload.init();
  }

  // 设置上传的文件名
  set_name = (file) => {
  	const { type } = this.props;
  	if(file){
  		DIR_UPLOAD = `${type}/${file.name}`;
  	}else{ 
  		DIR_UPLOAD = `${type}/`;
  	}
  }


  // 设置上传参数
  set_upload_param = (up, filename, ret, res) => {
  	const new_multipart_params = {
  		'key': DIR_UPLOAD,
  		'policy': res.policy,
  		'OSSAccessKeyId': res.accessid,
  		'success_action_status': '200', //让服务端返回200,不然，默认会返回204
  		'callback': res.callback,
  		'signature': res.signature,
  	};

  	up.setOption({
  		'url': HOST,
  		'multipart_params': new_multipart_params
  	});

  	up.start();
  }

  // 根据type获取对应的token
  getTokenWithType = async (type) => {
  	let reqUrl = `${URL_SERVER}/gettoken_product`;
  	const data =  await req({url: reqUrl});
  	const obj = data.data;
  	return obj;
  }

  // 根据
  getOptionWithType = (type) => {
  	let options = {};
  	switch (type) {
  	case 'product':
  		return options;
  	case 'image':
  		options['filters'] = {
  			mime_types: [ //只允许上传图片和zip,rar文件
  				{title: 'Image files', extensions: 'jpg,gif,png,bmp'}
  				//{title: "Zip files", extensions: "zip,rar"}
  			],
  			max_file_size: '1mb', //最大只能上传10mb的文件
  			prevent_duplicates: false //不允许选取重复文件
  		};
  		return options;
  	default:
  		return options;
  	}
  }

  render () {
  	const { children, id } = this.props;
  	return (
  		<div style={styles.uploaderWrap} id={id}>
  			{
  				children ? 
  					children
  					: 
  					<div style={styles.innerBtn}>点击上传</div>
  			}
  			<span style={styles.successInfo}>{this.state.success ? '上传成功' : (this.state.error ? this.state.msg : '')}</span>
  		</div>
  	);
  }
}

Uploader.propTypes = {
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  success: PropTypes.func.isRequired,
};

export default Uploader;

