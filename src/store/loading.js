import { defineStore, ref } from 'pinia'

export const useLoadingStore = defineStore('LoadingStore', () => {
  const showLoading = ref(false)

  return { showLoading }
})
