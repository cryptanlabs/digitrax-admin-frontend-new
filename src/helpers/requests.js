import axios from 'axios'



const base_url =    'http://localhost:3000' // 'https://dev.digitrax.live' // v
const axiosBase = axios.create({
  baseURL: base_url,
  timeout: 6000
})


export {axiosBase, base_url}
