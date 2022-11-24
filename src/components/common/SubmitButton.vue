<template>
  <v-btn
    :color="colorString"
    type="submit"
    :disabled="disabledButton"
    :class="customClass"
    :text="text"
    >{{ buttonText }}</v-btn
  >
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useLoadingStore } from '@/store/loading'

export default defineComponent({
  name: 'SubmitButton',
  props: {
    color: String,
    buttonText: String,
    customClass: String,
    text: Boolean
  },
  setup(props) {
    const loadingStore = useLoadingStore()
    const disabledButton = computed(() => loadingStore.showLoading)
    const colorString = computed(() => props.color ?? 'secondary')

    return {
      disabledButton,
      colorString
    }
  }
  // computed: {
  //   disabledButton() {
  //     return this.$store.state.loading.showLoading
  //   },
  //   colorString() {
  //     return this.color ? this.color : 'secondary'
  //   }
  // }
})
</script>
