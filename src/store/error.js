import { defineStore, ref } from 'pinia'

export const useErrorStore = defineStore('ErrorStore', () => {
  const showErrorMessage = ref(false)
  const errorMessage = ref(null)

  const error = (payload) => {
    if (payload === null) {
      showErrorMessage.value = false
      errorMessage.value = null
    } else {
      showErrorMessage.value = true
      errorMessage.value = payload
    }
  }

  return {
    showErrorMessage,
    errorMessage,
    error
  }
})
