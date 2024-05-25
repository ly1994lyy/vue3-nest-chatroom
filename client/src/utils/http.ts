import axios from "axios";
import { createDiscreteApi } from "naive-ui";


const {message}  =createDiscreteApi(["message"])
const request = axios.create({
  baseURL: "http://localhost:9000",
})

request.interceptors.request.use(config=>{
  return config
},error=>{
  return Promise.reject(error)
})

request.interceptors.response.use(res=>{
  if(res.data.code!==200){
    message.error(res.data.msg)
    return Promise.reject(res.data.msg)
  }
  return res.data
},error=>{
  return Promise.reject(error)
})

export default request;