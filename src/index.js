import { req } from './request.js';

req({url: 'https://cnodejs.org/api/v1/topics'}).then(res => {
  console.log(res);
})
