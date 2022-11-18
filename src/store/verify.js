import { defineStore, ref } from 'pinia'
import { buildSuccess, handleError } from '../utils/utils'

export const useVerifyStore = defineStore('VerifyStore', () => {
  const emailVerified = ref(false)

  const sendVerify = (id) => {
    return new Promise((resolve, reject) => {
      commit(types.SHOW_LOADING, true)
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
              commit(types.SAVE_USER, _user)
            }
            buildSuccess(
              {
                msg: 'verify.EMAIL_VERIFIED'
              },
              commit,
              resolve
            )
          }
        })
        .catch((error) => {
          handleError(error, commit, reject)
        })
    })
  }

  return {
    emailVerified
  }
})
