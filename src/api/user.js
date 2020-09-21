import request from '@/utils/request'

export function login(loginForm) {
  return request({
    url: '/user/loginByPassword',
    method: 'post',
    params: { username: loginForm.username, password: loginForm.password }
  })
}

// export function getInfo(token) {
//   return request({
//     url: '/user/info',
//     method: 'get',
//     params: { access_token: token }
//   })
// }

export function logout(Query) {
  return request({
    url: '/user/logout',
    method: 'post',
    params: { token: Query.token, uid: Query.uid }
  })
}
