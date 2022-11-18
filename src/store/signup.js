import router from '@/router'
import api from '@/services/api/signup'
import { buildSuccess, handleError } from '@/utils/utils.js'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { useLoadingStore } from './loading'

export const useSignupStore = defineStore('SignupStore', () => {
  const loadingStore = useLoadingStore()
  const authStore = useAuthStore()

  const userSignUp = (payload) => {
    return new Promise((resolve, reject) => {
      // commit(types.SHOW_LOADING, true)
      loadingStore.showLoading = true
      api
        .userSignUp(payload)
        .then((response) => {
          if (response.status === 201) {
            window.localStorage.setItem(
              'user',
              JSON.stringify(response.data.user)
            )
            window.localStorage.setItem(
              'token',
              JSON.stringify(response.data.token)
            )
            // commit(types.SAVE_USER, response.data.user)
            authStore.saveUser(response.data.user)
            // commit(types.SAVE_TOKEN, response.data.token)
            authStore.saveToken(response.data.token)
            buildSuccess(
              null,
              resolve,
              router.push({
                name: 'home'
              })
            )
          }
        })
        .catch((error) => {
          handleError(error, reject)
        })
    })
  }

  return { userSignUp }
})
