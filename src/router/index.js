import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'
import routes from '@/router/routes'
// import { store } from '@/store'
import { useAuthStore } from '@/store/auth'
import { checkIfTokenNeedsRefresh } from '@/utils/utils.js'
import { checkForUpdates } from '@/utils/updates.js'
// import * as types from '@/store/mutation-types'
import { useSuccessStore } from '../store/success'
import { useErrorStore } from '../store/error'

Vue.use(Router)
Vue.use(Meta)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [...routes]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const successStore = useSuccessStore()
  const errorStore = useErrorStore()

  checkForUpdates()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  // const isTokenSet = store.getters.isTokenSet
  const isTokenSet = authStore.isTokenSet
  if (requiresAuth && !isTokenSet) {
    return next('/login')
  }
  checkIfTokenNeedsRefresh()
  // store.commit(types.SUCCESS, null)
  successStore.success(null)
  // store.commit(types.ERROR, null)
  errorStore.error(null)
  return next()
})

export default router
