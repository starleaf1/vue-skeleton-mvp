import api from '@/services/api/forgotPassword'
import { buildSuccess, handleError } from '@/utils/utils.js'
import { defineStore, ref } from 'pinia'
import { useLoadingStore } from './loading'

export const useForgotPasswordStore = defineStore('ForgotPasswordStore', () => {
  const resetEmailSent = ref(false)
  const loadingStore = useLoadingStore()

  const forgotPassword = (payload) => {
    return new Promise((resolve, reject) => {
      // commit(types.SHOW_LOADING, true)
      loadingStore.showLoading = true
      api
        .forgotPassword(payload)
        .then((response) => {
          if (response.status === 200) {
            // commit(types.RESET_EMAIL_SENT, true)
            resetEmailSent.value = true
            buildSuccess(
              {
                msg: 'forgotPassword.RESET_EMAIL_SENT',
                params: [payload.email],
                timeout: 0
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
    resetEmailSent,
    forgotPassword
  }
})
