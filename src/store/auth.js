import { defineStore, ref } from 'pinia'
import router from '@/router'
import api from '@/services/api/auth'
import { addMinutes, format } from 'date-fns'
import { handleError } from '../utils/utils'

const MINUTES_TO_CHECK_FOR_TOKEN_REFRESH = 1440

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

  const refreshToken = () => {
    return new Promise((resolve, reject) => {
      api
        .refreshToken()
        .then((response) => {
          if (response.status === 200) {
            window.localStorage.setItem(
              'token',
              JSON.stringify(response.data.token)
            )
            window.localStorage.setItem(
              'tokenExpiration',
              JSON.stringify(
                format(
                  addMinutes(new Date(), MINUTES_TO_CHECK_FOR_TOKEN_REFRESH),
                  't'
                )
              )
            )
            // commit(types.SAVE_TOKEN, response.data.token)
            saveToken(response.data.token)
            resolve()
          }
        })
        .catch((error) => {
          handleError(error, reject)
        })
    })
  }

  return {
    user,
    token,
    isTokenSet,
    userLogout,
    saveUser,
    saveToken,
    autoLogin,
    refreshToken
  }
})
