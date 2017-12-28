const OSS = require('ali-oss');

// OSS REGION LIST https://help.aliyun.com/document_detail/31837.html?spm=5176.doc32070.2.9.15JU6d

// 定义基础信息
const REGION = 'oss-cn-hangzhou';
const ACCESSKEYID = '';
const ACCESSKETSCRET = '';
const BUCKET = '';  // bucket name

// 创建OSS实例
const client = new OSS({
  region: REGION,
  accessKeyId: ACCESSKEYID,
  accessKeySecret : ACCESSKETSCRET,
  bucket: BUCKET,
});


const upload_file = async () => {
  
}