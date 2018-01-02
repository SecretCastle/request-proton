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
    data: param || {},
  }).then(res => {
    if (res) {
      if (res.status !== 200) {
        throw new Error(res.statusText)
      }
      return res;
    }
  })
}

// 请求超时函数
const timeoutfn = (delay) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('请求超时');
    }, delay)
  })
}

// 单个请求 存在请求超时
export async function req(params, delay=10000) {
  try {
    const response = await Promise.race([timeoutfn(delay), publicReq(params)]);
    return response;
  } catch (error) {
    throw new Error(error);
  }
}


// 多请求 async loop 
export async function multiRequest(reqArr) {
  let res = [];
  if (typeof reqArr !== 'object' && !(reqArr instanceof Array)) {
    throw new Error(`please set ${reqArr} to Array`);
  }
  try {
    const proms = reqArr.map(ele =>
      publicReq({
        url: ele.url,
        method: ele.method || '',
        param: ele.param || {},
      })
    )

    for (let promise of proms) {
      const response = await promise;
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }

      res.push(response);
    }
    return Promise.resolve(res);
  } catch (error) {
    throw new Error(error);
  }
}

// 多请求 promise 
export async function multiRequestWithPromise(reqArr) {
  if (typeof reqArr !== 'object' && !(reqArr instanceof Array)) {
    throw new Error(`please set ${reqArr} to Array`);
  }
  try {
    const proms = reqArr.map(ele =>
      publicReq({
        url: ele.url,
        method: ele.method || '',
        param: ele.param || {},
      })
    )
    const res = await Promise.all(proms);
    return res;
  } catch (error) {
    throw new Error(error);
  }
}