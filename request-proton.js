// const fetch = require('node-fetch');

// // 设计思路

// /**
//  * 
//  *  promise 
//  * 
//  */

// async function getData(params) {
//   const url = params.url;
//   const response = await fetch(url);
//   const res = await response.json();
//   return res;
// }

// const req = (params) => new Promise((resolve,reject) => {
//   const res = getData(params);
//   if(res){
//     resolve(res)
//   }
//  })

// console.log('run');
//  req({url: `https://zhuanlan.zhihu.com/api/columns/feweekly`}).then(res => {
//    console.log(res.followersCount);
//    console.log('2');
//  })
 

const fetch = require('node-fetch');

async function getZhihuColumn(id) {
  const url = `https://zhuanlan.zhihu.com/api/columns/${id}`;
  const response = await fetch(url);
  const column = await response.json();
  console.log(`NAME: ${column.name}`);
  console.log(`INTRO: ${column.intro}`);
}

getZhihuColumn('feweekly');