import { login, logout } from '@/api/user'
import { getToken, setToken, removeToken, getUid, setUid, removeUid, getNickname, setNickname, removeNickname, getUrl, setUrl, removeUrl, getRealityName, setRealityName, removeRealityName, getRCtoken, setRCtoken, removeRCtoken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    uid: getUid(),
    nickname: getNickname(),
    url: getUrl(),
    realityName: getRealityName(),
    rctoken: getRCtoken(),
    name: '',
    avatar: ''
  }
}

const Query = {
  token: getToken(),
  uid: getUid()
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    // const { username, password } = userInfo
    const username = userInfo.username
    const password = userInfo.password
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        setUid(data.uid)
        setNickname(data.nickname)
        setUrl(data.portraituri)
        setRealityName(data.realityName)
        setRCtoken(data.rctoken)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      Query.token = 'ckw' + state.token
      logout(Query).then(() => {
        removeToken() // must remove  token  first
        removeUid()
        removeNickname()
        removeUrl()
        resetRouter()
        removeRealityName()
        removeRCtoken()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      removeUid()
      removeUrl()
      removeNickname()
      removeRealityName()
      removeRCtoken()
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

