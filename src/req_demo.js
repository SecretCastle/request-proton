import { req, multiRequestWithPromise, multiRequest } from './core/request-proton.js';

localStorage.setItem('token', '111');

// 单个请求
req({ url: '/topics', method: 'get', param: {}, type: 'xxx' }).then(res => {
	console.log(res);
});

// // 多请求 1
// multiRequestWithPromise([{
//     url: '/topics'
//   },
//   {
//     url: '/topics'
//   }
// ]).then(res => {
//   console.log('多请求1', res);
// })


// // 多请求2
// multiRequest([{
//     url: '/topics'
//   },
//   {
//     url: '/topics'
//   }
// ]).then(res => {
//   console.log('多请求2', res);
// })


// // example
// const fn1 = async() => {
//   const res1 = await req({ url: '/topics', method: 'get', param: {}, type: 'xxx' });
//   console.log('请求实例1', res1);
//   const res2 = await multiRequestWithPromise([{ url: '/topics' }, { url: '/topics' }])
//   console.log('请求实例2', res2);
// }

// fn1()