import { defineStore } from 'pinia'
import { ref } from 'vue'
import { version } from '../../package.json'

export const useAppStore = defineStore('AppStore', () => {
  const appTitle = ref('MyAwesomeApp')
  const appVersion = ref(version)

  return { appTitle, appVersion }
})
