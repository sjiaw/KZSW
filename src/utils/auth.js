import Cookies from 'js-cookie'

const TokenKey = 'vue_token'
const Uid = 'vue_uid'

export function getToken() {
  // return Cookies.get(TokenKey)
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  // return Cookies.set(TokenKey, token)
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  // return Cookies.remove(TokenKey)
  return localStorage.removeItem(TokenKey)
}

export function getUid() {
  // return Cookies.get(Uid)
  return localStorage.getItem(Uid)
}

export function setUid(uid) {
  // return Cookies.set(Uid, uid)
  return localStorage.setItem(Uid, uid)
}

export function removeUid() {
  // return Cookies.remove(Uid)
  return localStorage.removeItem(Uid)
}
