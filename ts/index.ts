/**
 * 
 * let reqInstance = new RequestProton();
 * 
 * 
 * 
 * 
 * req内部运行机制
 * async function req(obj: { url: string, type ?: string, param ?: object}) {
 *  return await publicReq({url, type, param});
 * }
 * 
 * 
 * reqInstance.req({
 * 
 * }).then(res => {
 * 
 * })
 * 
 */

/**
 * 接口定义是确定对象中必须存在的属性
 */
import axios from 'axios';

interface RequestBasic {
    // 公共请求函数
    publicReq(obj: {url: string, type ?: string, param ?: object}): Promise<Object>;
    // 单独请求函数
    req(obj: {url: string, type ?: string, param ?: object}, delay ?: number) : Promise<Object>;
    // 多请求函数
    muiltiReq(arr: Array<Object>, delay ?: number): Promise<Object>;
    // 请求超时
    timeoutfn(delay: number): Promise<Object>;
};

class RequestProton implements RequestBasic {
    axiosInstance: any;
    async publicReq(params: { url: string, method ?: string, param ?: Object }): Promise<Object> {
        const { url, method, param } = params;
        this.axiosRequestInterceptor(this.axiosInstance);
        this.axiosResponseInterceptor(this.axiosInstance);
        return await this.axiosInstance({
            url: url,
            method: method || 'get',
            data: param || {}
        }).then((res: any) => {
            if (res) {
                if (res.status !== 200) {
                    throw new Error(res.statusText);
                }
                return res;
            }
        });
    }

    timeoutfn(delay: number) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve('请求超时');
            }, delay);
        }); 
    }

    async req(params: { url: string, method ?: string, param ?: Object }, delay = 10000): Promise<Object> {
        try {
            const response = await Promise.race([this.timeoutfn(delay), this.publicReq(params)]);
            return response;
        } catch (error) {
            throw new Error(error);
        }
    }

    async muiltiReq(reqArr: Array<Object>, delay = 10000): Promise<Object> {
        let res = [];
        if (typeof reqArr !== 'object') {
            throw new Error(`please set ${reqArr} to Array`);
        }
        try {
            const proms = reqArr.map((ele: any ) =>
                this.publicReq({
                    url: ele.url,
                    method: ele.method || '',
                    param: ele.param || {},
                })
            );

            for (let promise of proms) {
                const response: any = await promise;
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
    
    constructor(public baseUrl: string) {
        this.axiosInstance = axios.create({
            baseURL: baseUrl,
            timeout: 10000,
        });
    }
    /**
     * 请求拦截器
     */
    axiosRequestInterceptor(axiosInstance: any) {
        axiosInstance.interceptors.request.use((config: any) => {
            if (localStorage.getItem('token')) {
                config.headers = {
                    Authorization: `token ${localStorage.getItem('token')}`
                };
            }
            return config;
        }, (err: any) => {
            throw new Error(err);
        });
    }

    /**
     * 响应拦截器
     */
    axiosResponseInterceptor(axiosInstance: any) {
        axiosInstance.interceptors.response.use((res: any) => {
            if (res.status !== 200) {
                throw new Error(res.statusText);
            }
            // removePending(res);
            return res;
        }, (err: any) => {
            if (err.response) {
                switch (err.response.status) {
                    case 500:
                        throw new Error('服务器错误');
                    case 401:
                        break;
                    case 404:
                        throw new Error('请求路径不存在');
                    default:
                        break;
                }
                return Promise.reject(err);
            }
        });
    }
}

let reqInstance = new RequestProton('https://cnodejs.org/api/v1');
/**
 * 单请求例子
 */
// reqInstance.req({
//     url: '/topics'
// }).then(res => {
//     console.log(res);
// });

/**
 * 多请求例子
 */
// reqInstance.muiltiReq([{url: '/topics'}, {url: '/topics'}]).then(res => {
//     console.log(res);
// })

