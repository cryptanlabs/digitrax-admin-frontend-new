import axios from 'axios'



const base_url =  'https://dev.digitrax.live' // 'http://localhost:3000' // 'http://localhost:3000' //
const axiosBase = axios.create({
  baseURL: base_url,
  timeout: 6000
})


export {axiosBase, base_url}
