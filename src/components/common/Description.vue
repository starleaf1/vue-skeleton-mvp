<template>
  <v-flex xs12 text-xs-center mb-2 v-html="description"></v-flex>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Description',
  props: {
    description: String
  }
})
</script>
