import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoadingStore = defineStore('LoadingStore', () => {
  const showLoading = ref(false)

  return { showLoading }
})
