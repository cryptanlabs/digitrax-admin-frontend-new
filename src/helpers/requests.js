import axios from 'axios'


const base_url =     'https://dev.digitrax.live' //   'http://localhost:3000' //  'http://ec2-34-227-220-139.compute-1.amazonaws.com' //   'https://dev.digitrax.live' // 'https://dev.digitrax.live' //     'http://172.20.101.164:3000' //
const returnLimit =       -1 //  30000; //
const axiosBase =  axios.create({
  baseURL: base_url,
  timeout: 12000
})

const axiosBaseWithKey = function(key){
  if(key){
    return axios.create({
      baseURL: base_url,
      timeout: 12000,
      headers: {'x-access-token': key},
    })
  }
  return axios.create({
    baseURL: base_url,
    timeout: 12000
  })
}

export {axiosBase, axiosBaseWithKey, base_url, returnLimit}
