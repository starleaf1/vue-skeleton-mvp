<template>
  <v-container v-show="showSuccessMessage">
    <v-layout>
      <v-flex>
        <v-snackbar
          v-model="showSuccessMessage"
          color="success"
          multi-line
          bottom
          :timeout="successMessageTimeout"
        >
          {{ successMessage }}
          <v-btn text @click="showSuccessMessage = false">
            {{ $t('common.CLOSE') }}
          </v-btn>
        </v-snackbar>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
// import * as types from '@/store/mutation-types'
import { defineComponent, computed, watchEffect } from 'vue'
import { useSuccessStore } from '@/store/success'
import { useI18n } from 'vue-i18n-composable'

export default defineComponent({
  name: 'SuccessMessage',
  setup() {
    const successStore = useSuccessStore()

    const { t } = useI18n()

    const showSuccessMessage = computed({
      get: () => successStore.showSuccessMessage,
      set: (value) => {
        successStore.success(value)
      }
    })

    const successMessage = computed(() =>
      successStore.successMessageParams
        ? t(successStore.successMessage, [...successStore.successMessageParams])
        : t(successStore.successMessage)
    )

    const successMessageTimeout = computed(
      () => successStore.successMessageTimeout
    )

    watchEffect((onCancel) => {
      const timerId = setTimeout(() => {
        showSuccessMessage.value = successMessage.value !== ''
      }, 100)

      onCancel(() => clearTimeout(timerId))
    })

    return {
      showSuccessMessage,
      successMessage,
      successMessageTimeout,
      t
    }
  }
  // computed: {
  //   showSuccessMessage: {
  //     get() {
  //       return this.$store.state.success.showSuccessMessage
  //     },
  //     set(value) {
  //       this.$store.commit(types.SHOW_SUCCESS, value)
  //     }
  //   },
  //   successMessage() {
  //     if (this.$store.state.success.successMessageParams) {
  //       return this.$i18n.t(this.$store.state.success.successMessage, [
  //         ...this.$store.state.success.successMessageParams
  //       ])
  //     }
  //     return this.$i18n.t(this.$store.state.success.successMessage)
  //   },
  //   successMessageTimeout() {
  //     return this.$store.state.success.successMessageTimeout
  //   }
  // },
  // watch: {
  //   successMessage() {
  //     setTimeout(() => {
  //       this.showSuccessMessage = this.successMessage !== ''
  //     }, 100)
  //   }
  // }
})
</script>
