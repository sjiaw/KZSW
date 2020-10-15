import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken, getUid } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  // api的base_url
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // 请求超时时间
  timeout: 5000 // request timeout
})

// request拦截器
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      //  让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['token'] = 'ckw' + getToken()
      config.headers['uid'] = getUid()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is j
   * ust an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    if (res.code !== 201) {
      Message({
        message: res.message || 'error',
        type: 'error',
        duration: 5 * 1000
      })
    }
    return res
  }

)

export default service

