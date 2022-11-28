<template>
  <v-container fluid>
    <v-layout row wrap>
      <div class="text-center">
        <v-dialog v-model="showVerifyDialog" width="500" persistent>
          <v-card>
            <v-card-title
              class="headline grey lighten-2 black--text dlgVerifyAccount"
              primary-title
            >
              <v-icon class="orange--text">mdi-information</v-icon>
              &nbsp;{{ $t('home.VERIFY_YOUR_ACCOUNT') }}
            </v-card-title>
            <v-card-text class="mt-4">
              {{ $t('home.VERIFY_YOUR_ACCOUNT_DESCRIPTION') }}
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                text
                @click="showVerifyDialog = false"
                class="btnClose"
                >{{ $t('home.CLOSE') }}</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
      <Heading :title="$t('home.GREETING', [name])" />
      <Description :description="$t('home.DESCRIPTION')" />
    </v-layout>
    <ProjectDescription />
  </v-container>
</template>

<script>
import { t as $t } from 'vue-i18n-composable'
import { defineComponent, ref } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useVerifyStore } from '@/store/verify'

export default defineComponent({
  metaInfo() {
    return {
      title: this.$store.getters.appTitle,
      titleTemplate: `${this.$t('home.TITLE')} - %s`
    }
  },
  setup() {
    const authStore = useAuthStore()
    const verifyStore = useVerifyStore()

    const name = ref(authStore.user.name)
    const showVerifyDialog = ref(!verifyStore.emailVerified)

    return { name, showVerifyDialog, $t }
  }
  // data() {
  //   return {
  //     name: this.$store.state.auth.user.name,
  //     showVerifyDialog: !this.$store.state.verify.emailVerified
  //   }
  // }
})
</script>
