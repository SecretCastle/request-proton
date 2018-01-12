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
};

/**
 * 
 * axios 请求的中间件,可根据需求，修改header
 * @param {Object} instance axios实例
 */
const reqmiddleware = (instance) => {
  instance.interceptors.request.use((config) => {
    if (localStorage.getItem('token')) {
      config.headers = {
        Authorization: `token ${localStorage.getItem('token')}`
      };
    }
    return config;
  }, (err) => {
    throw new Error(err);
  });
};

/**
 * 
 * axios 请求成功后响应的中间件
 * @param {Object} instance axios实例
 */
const resMiddleware = (instance) => {
  instance.interceptors.response.use((res) => {
    if (res.status !== 200) {
      throw new Error(res.statusText);
    }
    return res;
  }, (err) => {
    if (err.response) {
      switch (err.response.status) {
      case 500:
        throw new Error('服务器错误', err.response.data.msg);
      case 401:
        break;
      case 404:
        throw new Error('请求路径不存在', err.response.data.msg);
      default:
        break;
      }
      return Promise.reject(err);
    }
  });
};

//请求实例
const publicReq = async (params) => {
  const { url, method, param } = params;
  const instance = axiosInstance();
  reqmiddleware(instance);
  resMiddleware(instance);
  return await instance({
    url: url,
    method: method || 'get',
    data: param || {},
  }).then(res => {
    if (res) {
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }
      return res;
    }
  });
};

// 请求超时函数
const timeoutfn = (delay) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('请求超时');
    }, delay);
  });
};

// 单个请求 存在请求超时
export async function req(params, delay = 10000) {
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
    );

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
    );
    const res = await Promise.all(proms);
    return res;
  } catch (error) {
    throw new Error(error);
  }
}