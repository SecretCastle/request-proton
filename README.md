# Request Document

> `./src/core/request-upload-baidu.js` 基于[bce-bos-uploader](https://github.com/leeight/bce-bos-uploader)的OSS直传React组件

> `./src/core/request-upload.js` 基于[plupload](https://github.com/moxiecode/plupload)的OSS直传React组件

里面需要的是服务端支持，纯js的需要再一步细化，如获取加密签名, `accesskey`和`accessid`加密等

> `./src/core/request-proton.js` 封装的请求文件，基于[axios](https://github.com/axios/axios)

 使用

单个请求
参数配置

```
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

### 杂项

可行的一种React优化方式， PureComponent的使用, 详细参见 `/src/extra/purecomponents`

### 上传组件

> `request-upload-baidu` 百度bos直传组件

安装

```
npm install bce-bos-uploader jquery --S
```

使用

```js
import Uploader from '**/**/request-upload-baidu.js'

ReactDOM.render(
    <Uploader 
        type={'app-appid-image'}
        id={'upload_bd_product'} // 这个uploader的id，唯一表示
        success={uploaded} // 上传成功返回的函数， 参数中 uploaded(filepath 上传路径, file 上传文件 ,info 上传成功后的信息)
        bucket={'fog-pub-front'} // 可选（默认参数中所填）， 上传到的bucket
        bosEndPoint={''} // 可选（默认参数中所填）， 上传的服务器地址
        uptokenUrl={''} // 可选（默认参数中所填）， 获取签名等信息的地址， 返回的是jsonp格式，需要后端直传
        showSuccess={true}  // 可选， 是否显示上传加载和上传完成提示       
    />,
    document.getElementById('app')
);
```

**tips**:
```
type属性说明

填入的参数结构:

例如: [userid]-[app/product/account/ota]-[appid/productid]-[folder]-[file]

{
    userid => 用户id，根据用户区分文件夹
    app/product/account/ota => 四个类型的文件夹，当然喽，可以添加别的文件夹
    appid/productid => appid或productid，用于区分不同app或者product，如果不涉及appid或productid可以忽略
    folder => 区分上传文件的类别，如【image】，【bin】，【license】等
}
```