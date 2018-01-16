import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Spin, Icon, Button } from 'antd';
const BdUploader = require('bce-bos-uploader/bce-bos-uploader.bundle');

import { req } from './request-proton';


/**
 * 工具类方法
 */

const randomFileName = (file) => {
  const filename = file.name;
  
  // 校验字符串中是否存在特殊字符的正则表达式
  const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\]<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
  let nfn = '';
  for(let i = 0 ; i < filename.length; i++ ){
    // 如果这一位是空格，则忽略
    if(filename.substr(i, 1)!== ' '){
      nfn += filename.substr(i ,1).replace(pattern, ''); 
    }
  }
  console.log(nfn);
  // 增加时间戳，防止上传的文件名重复
  const timestamp = new Date().getTime();
  // 获取 '.'最后出现的位置
  const lastIndex = nfn.lastIndexOf('.');
  // 拼接字符串
  const head = nfn.substr(0, lastIndex) + timestamp;
  // 返回字符串
  return `${head}${nfn.substr(lastIndex)}`;
};


const styles = {
  uploaderWrap: {
    display: 'inline-block',
    position: 'relative',
    margin: '0 5px'
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
  },
  progress: {
    fontSize: '12px',
    paddingLeft: '5px'
  }
};

/** 
 * 
 * 百度云 OSS直传， React版本
 * 
 * 基于bce-bos-uploader , 详情请看 https://github.com/leeight/bce-bos-uploader
 * 
 */

class Uploader extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      status: false,
      show: false
    };
  }

  componentDidMount() {
    this.createUploader();
  }

  createUploader = () => {
    const _this = this;
    const { 
      id,
      success,
      bucket = 'fog-pub-test',
      bosEndPoint = 'https://fog-pub-test.gz.bcebos.com',
      uptokenUrl = 'https://cnapitest.fogcloud.io/gettoken/'
    } = this.props;

    const uploader = new BdUploader.bos.Uploader({
      bos_bucket: bucket,
      bos_endpoint: bosEndPoint,
      browse_button: document.getElementById(id),
      uptoken_url: uptokenUrl,
      max_retries: 3,
      accept: '',
      init: {
        PostInit() {
          console.log(`初始化${id}`);
        },
        Key(_, file){
          const filaname = randomFileName(file);
          return Promise.resolve(filaname);
        },
        FilesAdded(_, fille) {
          _this.setStatueState('fileAdded');
          uploader.start();
        },
        BeforeUpload() {
          console.log('before uploaded');
        },
        FileUploaded(_, file, info) {
          const bucket = info.body.bucket;
          const object = info.body.object;
          const uploadPath = `${bosEndPoint}/${bucket}/${object}`;
          _this.setStatueState('success');
          success(uploadPath, file, info);
        },
        Error(_, error, file) {
          if(error) {
            _this.setStatueState('fail');
            throw new Error(error);
          }
        }
      }
    });
  }

  /**
   * 设置加载状态 showSuccess
   */
  setStatueState = (stack) => {
    switch(stack) {
    case 'fileAdded': 
      this.setState({
        show: true
      });
      break;
    case 'success':
      this.setState({
        show: true,
        status: true
      });
      this.delayHide(500);
      break;
    case 'fail':
      this.setState({
        show: false,
        status: false
      });
      this.delayHide(500);
      break;
    default:
      break;
    }
  }

  /**
   * 延迟消失 showSuccess
   * 默认 1000ms
   */
  delayHide = (delay = 1000) => {
    setTimeout(() => {
      this.setState({
        show: false
      });
    }, delay);
  }
  
  render() {
    const { children, id, showSuccess = true } = this.props;
    return (
      <div style={styles.uploaderWrap} id={id}>
        {
          children ? 
            children
            :
            <Button style={styles.innerBtn}>点击上传</Button>
        }
        {
          showSuccess ? 
            <span style={
              {
                fontSize: '12px',
                paddingLeft: '5px',
                width: '100px'
              }
            }>
              {
                this.state.show ?
                  <Spin
                    indicator={
                      <Icon
                        type={
                          this.state.status ? 'check': 'loading'}
                        style={{ fontSize: 14 }} 
                        spin={!this.state.status} />
                    }
                  />
                  :
                  null
              }
            </span>
            :
            null
        }
        
      </div>
    );
  }
}

Uploader.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  success: PropTypes.func.isRequired,
};


export default Uploader;