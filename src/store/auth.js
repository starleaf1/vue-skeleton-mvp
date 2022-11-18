import { defineStore, ref } from 'pinia'
import router from '@/router'
import api from '@/services/api/auth'

export const useAuthStore = defineStore('AuthenticationStore', () => {
  const user = ref(null)
  const token = ref(JSON.parse(!!localStorage.getItem('token')) || null)
  const isTokenSet = ref(!!localStorage.getItem('token'))

  const logOut = () => {
    user.value = null
    token.value = null
    isTokenSet.value = false
  }

  const saveUser = (userParam) => {
    user.value = userParam
  }

  const saveToken = (tokenParam) => {
    token.value = tokenParam
    isTokenSet.value = true
  }

  const userLogout = () => {
    window.localStorage.removeItem('token')
    window.localStorage.removeItem('tokenExpiration')
    window.localStorage.removeItem('user')
    logOut()
    router.push({
      name: 'login'
    })
  }

  const autoLogin = () => {
    const userFromJSON = JSON.parse(localStorage.getItem('user'))
    // commit(types.SAVE_USER, user)
    saveUser(userFromJSON)
    // commit(types.SAVE_TOKEN, JSON.parse(localStorage.getItem('token')))
    saveToken(JSON.parse(localStorage.getItem('token')))
    // commit(types.SET_LOCALE, JSON.parse(localStorage.getItem('locale')))
    saveToken(JSON.parse(localStorage.getItem('locale')))
    // commit(types.EMAIL_VERIFIED, user.verified)
  }

  return {
    user,
    token,
    isTokenSet,
    userLogout,
    saveUser,
    saveToken
  }
})
