import axios from 'axios';
const BASE_URL = 'https://cnodejs.org/api/v1';  

// https://cnodejs.org/api/v1/topics

//创建axios实例
const axiosInstance = () => {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
  });
  return instance;
}

//请求实例
const publicReq = async(params) => {
  const { url, method, param } = params;
  const instance = axiosInstance();
  return await instance({
    url: url,
    method: method || 'get',
    data: param || {}
  }).then(res => {
    if(res){
      return res;
    }
  })
  
}



export async function req(params) {
  const res = await publicReq(params);
  console.log('res', res);
  const res2 = await publicReq({url: `https://cnodejs.org/api/v1/topic/592917b59e32cc84569a7458`});
  console.log('res2', res2);
  return res
}