import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { req } from './request-proton';
const BdUploader = require('bce-bos-uploader/bce-bos-uploader.bundle');

const HOST = '';
const URL_SERVER = 'https://cnapitest.fogcloud.io';
let URL_UPLOAD = '/';


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

  getToken = async () => {
    const reqUrl = `${URL_SERVER}/gettoken_product`;
    const data = await req({url: reqUrl});
    return data.data;
  }

  setParams = (data) => {
    const host = '';
  }

  createUploader = (data) => {
    const { id, success } = this.props;
    const uploader = new BdUploader.bos.Uploader({
      bos_bucket: 'baidubce',
      bos_endpoint: data.host,
      browse_button: document.getElementById(id),
      uptoken_url: 'http://127.0.0.1:1337/ack',  
      // 需要后端支持，明儿协调下， 需要如下url返回的
      // https://cloud.baidu.com/api/authorization?callback=jQuery321021050317675941788_1515914098189&httpMethod=PUT&path=%2Fv1%2Fbaidubce%2Ferror_code.md&queries=%7B%7D&headers=%7B%22x-bce-date%22%3A%222018-01-14T07%3A22%3A30Z%22%2C%22Content-Type%22%3A%22application%2Foctet-stream%3B%20charset%3DUTF-8%22%2C%22Host%22%3A%22mxchip-fog.oss-cn-beijing.aliyuncs.com%22%2C%22Content-Length%22%3A4273%7D&_=1515914098190
      init: {
        PostInit() {
          console.log(`初始化${id}`);
        },
        FilesAdded(_, fille) {
          uploader.start();
        },
        UploadProgress() {

        },
        FileUploaded(_, file, info) {
          const bucket = info.body.bucket;
          const object = info.body.object;
          const uploadPath = `${data.host}/${bucket}/${object}`;
          success(uploadPath, file, info);
        }
      }
    });
  }

  componentDidMount = async () =>  {
    const data = await this.getToken();
    console.log(data);
    this.createUploader(data);
  }
  render() {
    const { children, id } = this.props;
    return (
      <div style={styles.uploaderWrap} id={id}>
        {
          children ? 
            children
            :
            <div style={styles.innerBtn}>点击上传_bd</div>
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
