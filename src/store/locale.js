import i18n from '@/plugins/i18n'
import * as Validator from 'vee-validate'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useErrorStore } from './error'
import { useSuccessStore } from './success'

export const useLocaleStore = defineStore('LocaleStore', () => {
  const errorStore = useErrorStore()
  const successStore = useSuccessStore()

  const locale = ref(
    JSON.parse(localStorage.getItem('locale')) ??
      navigator.language.slice(0, 2) ??
      'en'
  )

  const setLocale = (payload) => {
    // commit(types.SUCCESS, null)
    successStore.success(null)
    // commit(types.ERROR, null)
    errorStore.error(null)
    i18n.locale = payload
    Validator.localize(payload)
    window.localStorage.setItem('locale', JSON.stringify(payload))
    // commit(types.SET_LOCALE, payload)
    locale.value = payload
  }

  return {
    locale,
    setLocale
  }
})
