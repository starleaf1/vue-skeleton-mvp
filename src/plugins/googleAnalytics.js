import Vue from 'vue'
import router from '@/router'
import VueAnalytics from 'vue-analytics'

if (import.meta.env.NODE_ENV === 'production') {
  Vue.use(VueAnalytics, {
    id: 'UA-138050457-1',
    router
  })
}
