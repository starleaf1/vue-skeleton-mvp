import api from '@/services/api/resetPassword'
import { buildSuccess, handleError } from '@/utils/utils.js'
import { defineStore, ref } from 'pinia'
import { useLoadingStore } from './loading'

export const useResetPasswordStore = defineStore('ResetPasswordStore', () => {
  const loadingStore = useLoadingStore()
  const showChangePasswordInputs = ref(true)

  const resetPassword = (payload) => {
    return new Promise((resolve, reject) => {
      // commit(types.SHOW_LOADING, true)
      loadingStore.showLoading = true

      api
        .resetPassword(payload)
        .then((response) => {
          if (response.status === 200) {
            // commit(types.SHOW_CHANGE_PASSWORD_INPUTS, false)
            showChangePasswordInputs.value = false
            buildSuccess(
              {
                msg: 'resetPassword.PASSWORD_CHANGED'
              },
              resolve
            )
          }
        })
        .catch((error) => {
          if (error.response.status === 404) {
            // commit(types.SHOW_CHANGE_PASSWORD_INPUTS, false)
            showChangePasswordInputs(false)
          }
          handleError(error, reject)
        })
    })
  }

  return {
    showChangePasswordInputs,
    resetPassword
  }
})
