import request from '@/utils/request'

/**
 * 获取 Token
 * */
export function queryList(query) {
  return request({
    url: '/user/getToken',
    method: 'get',
    params: {
      App-Key: query.App-Key
    }
  })
}