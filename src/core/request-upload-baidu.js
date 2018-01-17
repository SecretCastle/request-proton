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
  // 增加时间戳，防止上传的文件名重复
  const timestamp = new Date().getTime();
  // 获取 '.'最后出现的位置
  const lastIndex = nfn.lastIndexOf('.');
  // 拼接字符串
  const head = nfn.substr(0, lastIndex) + timestamp;
  // 返回文件名字符串
  return `${head}${nfn.substr(lastIndex)}`;
};

/**
 * 获取需要上传路径的前缀
 */
const prefixname = (type) => {
  let prefixpath = '';
  const typeArr = type.split('-');
  for(let index = 0, len = typeArr.length; index < len ; index += 1){
    prefixpath += `${typeArr[index]}/`;
  }
  return prefixpath;
};

/**
 * 根据传入的type，把传入的文件归类
 * @param {*} filename 文件名
 * @param {*} type 类型
 */
const collectfiles = (filename, type) => {
  if(!type){
    return filename;
  }
  const prefix = prefixname(type);
  return `${prefix}${filename}`;
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
    const { type } = this.props;
    const _this = this;
    const { 
      id,
      success,
      bucket = 'fog-pub-front',
      bosEndPoint = '',
      uptokenUrl = ''
    } = this.props;

    const uploader = new BdUploader.bos.Uploader({
      bos_bucket: bucket,
      bos_endpoint: bosEndPoint,
      browse_button: document.getElementById(id),
      uptoken_url: uptokenUrl,
      max_retries: 2,
      auto_start: true,
      bos_multipart_min_size: '20M',
      init: {
        PostInit() {
          // 初始化
          // console.log(`初始化${id}`);
        },
        Key(_, file){
          const filaname = randomFileName(file);
          const collect = collectfiles(filaname, type);
          return Promise.resolve(collect);
        },
        FilesAdded(_, fille) {
          _this.setStatueState('fileAdded');
        },
        FileUploaded(_, file, info) {
          const bucket = info.body.bucket;
          const object = info.body.object;
          const uploadPath = `${bosEndPoint}/${bucket}/${object}`;
          _this.setStatueState('success');
          success(uploadPath, file, info);
        },
        Error(_, error, file) {
          _this.setStatueState('fail');
          throw new Error(error);
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
        show: true,
        status: false
      });
      break;
    case 'success':
      this.setState({
        show: true,
        status: true
      });
      this.delayHide();
      break;
    case 'fail':
      this.setState({
        show: false,
        status: false
      });
      this.delayHide();
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
  success: PropTypes.func.isRequired,
};


export default Uploader;