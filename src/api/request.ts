/**
 * 项目axios 请求封装
 * 功能：
 * - 支持取消已发送的重复请求，
 *    是否重复默认根据 method+url+data+params生成的字符串作为key,
 *    可通过配置项决定key的生成是否需要加入参数
 */


import axios from 'axios'
import {stringify} from 'qs'
import type {InternalAxiosRequestConfig} from 'axios'
const baseURL = `http://192.168.31.158:8091/`
const timeout = 15*1000
const UNIQUE_KEY_NO_PARAMS = 'uniqueKeyNoParams'

const instance = axios.create({
  baseURL,
  timeout,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})

interface configType extends InternalAxiosRequestConfig {
  [UNIQUE_KEY_NO_PARAMS]?:boolean
}
/**
 * 根据请求，生成标识该请求的唯一key
 * key的生成可配置化：需要参数（默认） | 无需参数
 * @param config 
 * @returns string
 */
function getRequestKey(config:configType) {
  const {method, url, baseURL, params, data} = config
  // 功能完善，唯一key的生成支持是否需要包含参数，默认需要包含参数
  const isNoParams = config[UNIQUE_KEY_NO_PARAMS]
  const keys = [method, baseURL, url]
  if(!isNoParams) {
    keys.push(JSON.stringify(params))
    keys.push(data)
  }
  return keys.join('&')
}

/**
 * 用map记录已发起的请求，pending状态，在返回后会移除该请求
 */
const pendingRequests = new Map()
/**
 * 往pending数组中添加请求，并配置取消逻辑
 * @param config 
 */
function addPenddingRequest(config:configType) {
  const reqKey = getRequestKey(config)
  config.cancelToken = 
    config.cancelToken || 
    new axios.CancelToken((cancel) => {
      if(!pendingRequests.has(reqKey)) {
        pendingRequests.set(reqKey, cancel)
      }
    })
} 
/**
 * 取消重复请求
 * @param config 
 */
function removePendingRequest(config: configType) {
  const reqKey = getRequestKey(config)
  if(pendingRequests.has(reqKey)) {
    // 取消pending状态的请求
    const cancel = pendingRequests.get(reqKey)
    cancel(reqKey)
    // 从map中移除对应的记录
    pendingRequests.delete(reqKey)
  }
}



function checkUniqueKeyMakeWay(config:configType) {
  const {data, params} = config
  const isNoParams = (params && params[UNIQUE_KEY_NO_PARAMS]) || 
    (data && data[UNIQUE_KEY_NO_PARAMS])
  if(isNoParams) {
    config[UNIQUE_KEY_NO_PARAMS] = true
    typeof params === 'object' && delete params[UNIQUE_KEY_NO_PARAMS]
    typeof data === 'object' && delete data[UNIQUE_KEY_NO_PARAMS]
  }

}
// 请求拦截器
instance.interceptors.request.use(
  (config: configType) => {
    // console.log('config', config);
    checkUniqueKeyMakeWay(config)
    // 取消重复的请求
    removePendingRequest(config)
    // 添加新请求的记录
    addPenddingRequest(config)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    removePendingRequest(response.config)
    return response
  },
  (error) => {
    console.log('interceptors.response.error', error);
    // removePendingRequest(error.config)
    if(axios.isCancel(error)) {
      console.log(`已经取消的重复请求： ${error.message}`)
    } else {
      console.log(`响应拦截器中的其他错误`)
    }
    return Promise.reject(error)
  }
)

type apiType = {
  get: Function,
  post: Function
}
export const api:apiType = {
  get: () =>{},
  post: () => {}
}
const methods = ['post', 'get']
methods.forEach((method:string) => {
  // keyof 获取一个对象接口的所有key值
  api[method as keyof apiType] = (url: string, data:any, options: any) => {
    return new Promise((resolve, reject) => {
      let tempParams 
      if(method === 'get') {
        tempParams = {params: data}
      } else if(method === 'post'){
        tempParams = {
          data: data
        }
      } else {
        tempParams = stringify(data, { allowDots: true })
      }
      if(options?.type === 'json'){
        tempParams = data
      }
      instance({
        method,
        url: url,
        ...tempParams
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
})
export default {
  axios,
  api
}