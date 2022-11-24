<template>
  <v-container v-show="showErrorMessage">
    <v-layout>
      <v-flex>
        <v-snackbar
          v-model="showErrorMessage"
          color="error"
          multi-line
          bottom
          :timeout="0"
        >
          <ul>
            <li v-for="(item, index) in error" :key="index">{{ item }}</li>
          </ul>
          <v-btn text @click="showErrorMessage = false">{{
            $t('common.CLOSE')
          }}</v-btn>
        </v-snackbar>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
// import * as types from '@/store/mutation-types'
import { formatErrorMessages } from '@/utils/utils.js'
import { computed, watchEffect, defineComponent } from 'vue'
import { useErrorStore } from '@/store/error'

export default defineComponent({
  name: 'ErrorMessage',
  // computed: {
  //   showErrorMessage: {
  //     get() {
  //       return this.$store.state.error.showErrorMessage
  //     },
  //     set(value) {
  //       this.$store.commit(types.SHOW_ERROR, value)
  //     }
  //   },
  //   error() {
  //     return formatErrorMessages('errors', this.$store.state.error.errorMessage)
  //   }
  // },
  setup() {
    const errorStore = useErrorStore()
    const showErrorMessage = computed({
      get: () => errorStore.showErrorMessage,
      set: (value) => {
        errorStore.error(value)
      }
    })

    const error = computed(() => {
      return formatErrorMessages('errors', errorStore.errorMessage)
    })

    watchEffect((onCancelTimeout) => {
      const timerId = setTimeout(() => {
        showErrorMessage.value = error.value !== null
      }, 100)

      onCancelTimeout(() => {
        clearTimeout(timerId)
      })
    })

    return {
      showErrorMessage,
      error
    }
  }
  // watch: {
  //   error() {
  //     setTimeout(() => {
  //       this.showErrorMessage = this.error !== null
  //     }, 100)
  //   }
  // }
})
</script>
