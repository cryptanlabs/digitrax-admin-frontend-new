import axios from 'axios'



const base_url =          'https://dev.digitrax.live' //     'http://172.20.101.164:3000' //   'http://localhost:3000' //
const returnLimit =      -1 //1000; //
const axiosBase =  axios.create({
  baseURL: base_url,
  timeout: 6000
})

const axiosBaseWithKey = function(key){
  if(key){
    return axios.create({
      baseURL: base_url,
      timeout: 6000,
      headers: {'x-access-token': key},
    })
  }
  return axios.create({
    baseURL: base_url,
    timeout: 6000
  })
}

export {axiosBase, axiosBaseWithKey, base_url, returnLimit}
