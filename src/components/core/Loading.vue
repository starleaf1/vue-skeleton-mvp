<template>
  <v-dialog v-model="showLoading" persistent width="300">
    <v-card class="pt-4">
      <v-card-text>
        {{ t('loading.PLEASE_WAIT') }}
        <v-progress-linear indeterminate class="mb-0"></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
// import { mapGetters } from 'vuex'
import { defineComponent, computed } from 'vue'
import { useI18n } from 'vue-i18n-composable'
import { useLoadingStore } from '@/store/loading'

export default defineComponent({
  // computed: mapGetters(['showLoading'])
  setup() {
    const { t } = useI18n()
    const loadingStore = useLoadingStore()

    const showLoading = computed(() => loadingStore.showLoading)

    return {
      t,
      showLoading
    }
  }
})
</script>
