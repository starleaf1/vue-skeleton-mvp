import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSuccessStore = defineStore('SuccessStore', () => {
  const showSuccessMessage = ref(false)
  const successMessage = ref(null)
  const successMessageParams = ref([])
  const successMessageTimeout = ref(0)

  const success = (payload) => {
    if (payload === null) {
      showSuccessMessage.value = false
      successMessage.value = null
      successMessageParams.value = []
    } else {
      showSuccessMessage.value = true
      successMessageTimeout.value = payload.timeout ?? 6000
      successMessage.value = payload.msg
      if (payload.params) {
        successMessageParams.value = payload.params
      }
    }
  }

  return {
    showSuccessMessage,
    successMessage,
    successMessageParams,
    successMessageTimeout,
    success
  }
})
