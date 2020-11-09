import request from '@/utils/request'

export function login(loginForm) {
  return request({
    url: '/user/loginByPassword',
    method: 'post',
    params: { username: loginForm.username, password: loginForm.password }
  })
}

export function getToken(tokenFrom) {
  return request({
    url: '/rongcloud/getToken',
    method: 'POST',
    params: { uid: tokenFrom.uid, name: tokenFrom.name, portraitUri: tokenFrom.url }
  })
}

export function logout(Query) {
  return request({
    url: '/user/logout',
    method: 'post',
    params: { token: Query.token, uid: Query.uid }
  })
}
