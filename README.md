# Request Document

> `./dist/request-proton.js` 封装的请求文件

 使用

单个请求
参数配置

```json
{
    url: '',   请求地址
    method: '' 请求方法
    param: {} 请求body参数
}

delay: 超时时间设置
```


```js
import { req, multiRequestWithPromise, multiRequest } from 'request-proton.js'

//单个请求 
req({
  url: 'xxx',
  method: '',
  param: {}
}).then( res=> {
  // code
}, [delay])
```

多请求
multiRequestWithPromise 内部走的是 Promise.all()

```js
multiRequestWithPromise([   //参数是数组
    {
        url: '',
        method: '',
        param: {}
    },
    {
        url: '',
        method: '',
        param: {}
    }
]).then(res=> {
    // code
    // res 为数组
})
```

multiRequest 内部走的是 async/await loop ， 返回promise对象

```js
multiRequest([
    {
        url: '',
        method: '',
        param: {}
    },
    {
        url: '',
        method: '',
        param: {}
    }
]).then( res=> {
    // code
    // 返回的为数组
})
```

请求串联写法

```js

const getData = async () => {
    const res1 = await req(params);
    const res2 = await req(params, res1.props)
    return res2
}

getData().then(res => {
    // res 为上面res2 返回的promise对象
})
```
