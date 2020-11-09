
const TokenKey = 'vue_token'
const Uid = 'vue_uid'
const Nickname = 'vue_nickname'
const Url = 'vue_portraituri'
const Username = 'vue_username'
const RealityName = 'vue_realityName'
const RCtoken = 'rc_token'

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
  return localStorage.getItem(Uid)
}

export function setUid(uid) {
  return localStorage.setItem(Uid, uid)
}

export function removeUid() {
  return localStorage.removeItem(Uid)
}

export function getNickname() {
  return localStorage.getItem(Nickname)
}

export function setNickname(nickname) {
  return localStorage.setItem(Nickname, nickname)
}

export function removeNickname() {
  return localStorage.removeItem(Nickname)
}

export function getUrl() {
  return localStorage.getItem(Url)
}

export function setUrl(portraituri) {
  return localStorage.setItem(Url, portraituri)
}

export function removeUrl() {
  return localStorage.removeItem(Url)
}

export function getUsername() {
  return localStorage.getItem(Username)
}

export function setUsername(Username) {
  return localStorage.setItem(Username, username)
}

export function removeUsername() {
  return localStorage.removeItem(Username)
}

export function getRealityName() {
  return localStorage.getItem(RealityName)
}

export function setRealityName(realityName) {
  return localStorage.setItem(RealityName, realityName)
}

export function removeRealityName() {
  return localStorage.removeItem(RealityName)
}

export function getRCtoken() {
  return localStorage.getItem(RCtoken)
}

export function setRCtoken(realityName) {
  return localStorage.setItem(RCtoken, rctoken)
}

export function removeRCtoken() {
  return localStorage.removeItem(RCtoken)
}
