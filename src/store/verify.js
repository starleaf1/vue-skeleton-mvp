import { defineStore, ref } from 'pinia'
import { buildSuccess, handleError } from '../utils/utils'
import { useAuthStore } from './auth'
import api from '@/services/api/adminCities'
import { useLoadingStore } from './loading'

export const useVerifyStore = defineStore('VerifyStore', () => {
  const authStore = useAuthStore()
  const emailVerified = ref(false)

  const loadingStore = useLoadingStore()

  const sendVerify = (id) => {
    return new Promise((resolve, reject) => {
      // commit(types.SHOW_LOADING, true)
      loadingStore.showLoading = false
      const data = {
        id
      }
      api
        .sendVerify(data)
        .then((response) => {
          if (response.status === 200) {
            const verified = response.data.verified
            emailVerified.value = verified

            // If user is logged in then update localstorage
            if (localStorage.getItem('user')) {
              const _user = JSON.parse(localStorage.getItem('user'))
              _user.verified = verified
              localStorage.setItem('user', JSON.stringify(_user))
              // commit(types.SAVE_USER, _user)
              authStore.saveUser(_user)
            }
            buildSuccess(
              {
                msg: 'verify.EMAIL_VERIFIED'
              },
              resolve
            )
          }
        })
        .catch((error) => {
          handleError(error, reject)
        })
    })
  }

  return {
    emailVerified,
    sendVerify
  }
})
