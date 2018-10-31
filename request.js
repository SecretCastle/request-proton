import axios from 'axios';

// timeout 10min
const Global_Delay = 10 * 60 * 1000;
// timeout 24h
const Special_Delay = 24 * 60 * 60 * 1000;

const BASE_URL = '/';

// create axios instance
const axiosInstance = () => {
    const instance = axios.create({
        baseURL: BASE_URL,
        timeout: Global_Delay,
    });
    return instance;
};

/**
 *
 * axios request middleware
 * @param {Object} instance axios实例
 *//**
  * @description
  * @param {*} config
  * @returns
  */
 reqmiddleware = instance => {
    instance.interceptors.request.use(
        config => {
            // config header or other parameters here
            // code



            return config;
        },
        err => {
            throw new Error(err);
        },
    );
};

/**
 *
 * axios http response middleware
 * @param {Object} instance axios instance
 */
const resMiddleware = instance => {
    instance.interceptors.response.use(
        res => {
            if (res) {
                if (res.status !== 200) {
                    throw new Error(res.statusText);
                }
                return res;
            } else {
                console.log('no response');
            }
        },
        err => {
            if (err.response) {
                switch (err.response.status) {
                    case 401:
                        break;
                    case 404:
                        throw new Error(
                            'not found',
                            err.response.data.msg,
                        );
                    default:
                        break;
                }
                return Promise.reject(err);
            }
        },
    );
};

// 请求实例
const publicReq = async params => {
    const { url, method, param } = params;
    const instance = axiosInstance();
    reqmiddleware(instance);
    resMiddleware(instance);
    return await instance({
        url,
        method,
        data: param || {},
        params: param || {},
    }).then(res => {
        if (res) {
            if (res.status !== 200) {
                throw new Error(res.statusText);
            }
            return res;
        }
    });
};

// promise timeout function
const timeoutfn = (delay, url) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('timeout');
        }, delay);
    });
};

// 单个请求 存在请求超时
export async function req(params, delay = Global_Delay) {
    try {
        const response = await Promise.race([
            timeoutfn(delay, params.url),
            publicReq(params),
        ]);
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
            }),
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
            }),
        );
        const res = await Promise.all(proms);
        return res;
    } catch (error) {
        throw new Error(error);
    }
}

// GET request
export async function getRequest(url, param) {
    try {
        const response = await req({
            url,
            method: 'get',
            param,
        });
        return response;
    } catch (err) {
        console.log(err);
    }
}

// POST request
export async function postRequest(url, param) {
    try {
        const response = await req({
            url,
            method: 'post',
            param,
        });
        return response;
    } catch (err) {
        console.log(err);
    }
}

// multi get request method, return Array of request;
export async function getMultiRequest(url, reqArr) {
    const reqParams = [];
    reqArr.forEach(item => {
        reqParams.push({
            url,
            param: item,
            method: 'get'
        });
    })
    try{ 
        const response = await multiRequestWithPromise(reqParams)
        return response;
    } catch(err) {
        console.log(err);
    }
}

// multi post request method, return Array of request;
export async function postMultiRequest(url, reqArr) {
    const reqParams = [];
    const { param } = reqArr;
    reqArr.forEach(item => {
        reqParams.push({
            url,
            param: item,
            method: 'post'
        });
    })
    try{ 
        const response = await multiRequestWithPromise(reqParams)
        return response;
    } catch(err) {
        console.log(err);
    }
}
