import Vue from 'vue'
import '@/plugins/axios'
import vuetify from '@/plugins/vuetify'
import '@/plugins/veevalidate'
import { createPinia, PiniaVuePlugin, setActivePinia } from 'pinia'
import '@/plugins/common'
import '@/plugins/googleAnalytics'
import i18n from '@/plugins/i18n'
import App from '@/App.vue'
import router from '@/router'
import { store } from '@/store'
import VuetifyConfirm from 'vuetify-confirm'
import VueCompositionAPI from '@vue/composition-api'

const pinia = createPinia()
setActivePinia(pinia)
Vue.use(PiniaVuePlugin)
Vue.config.productionTip = false
Vue.use(VueCompositionAPI)
Vue.use(VuetifyConfirm, { vuetify })

const app = new Vue({
  vuetify,
  router,
  store,
  i18n,
  render: (h) => h(App),
  created() {
    store.dispatch('setLocale', store.getters.locale)
    if (store.getters.isTokenSet) {
      store.dispatch('autoLogin')
    }
  }
}).$mount('#app')

if (window.Cypress) {
  // Only available during E2E tests
  window.app = app
}
