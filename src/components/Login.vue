<template>
  <v-container fluid>
    <v-layout row wrap>
      <Heading :title="$t('login.TITLE')" />
      <Description :description="$t('login.DESCRIPTION')" />
      <v-flex xs12 sm6 offset-sm3>
        <ValidationObserver v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(submit)">
            <v-layout column>
              <v-flex>
                <ValidationProvider rules="required|email" v-slot="{ errors }">
                  <v-text-field
                    id="email"
                    name="email"
                    type="email"
                    :label="$t('login.EMAIL')"
                    v-model="email"
                    :error="errors.length > 0"
                    :error-messages="errors[0]"
                    autocomplete="off"
                  ></v-text-field>
                </ValidationProvider>
              </v-flex>
              <v-flex>
                <ValidationProvider rules="required|min:5" v-slot="{ errors }">
                  <v-text-field
                    id="password"
                    name="password"
                    type="password"
                    :label="$t('login.PASSWORD')"
                    v-model="password"
                    :error="errors.length > 0"
                    :error-messages="errors[0]"
                    autocomplete="off"
                  ></v-text-field>
                </ValidationProvider>
              </v-flex>
              <v-flex text-xs-center mt-5 mb-3>
                <SubmitButton :buttonText="$t('login.LOGIN')" />
              </v-flex>
              <v-flex text-xs-center>
                <v-btn
                  :to="{ name: 'forgotPassword' }"
                  small
                  text
                  class="btnForgotPassword"
                  >{{ $t('login.FORGOT_PASSWORD') }}</v-btn
                >
              </v-flex>
            </v-layout>
          </form>
        </ValidationObserver>
      </v-flex>
      <ErrorMessage />
    </v-layout>
  </v-container>
</template>

<script>
import router from '@/router'
// import { mapActions } from 'vuex'
import { t as $t } from 'vue-i18n-composable'
import { defineComponent, ref } from 'vue'
import { useAuthStore } from '@/store/auth'

export default defineComponent({
  metaInfo() {
    return {
      title: this.$store.getters.appTitle,
      titleTemplate: `${this.$t('login.TITLE')} - %s`
    }
  },
  setup() {
    const email = ref('')
    const password = ref('')
    const authStore = useAuthStore()

    const { userLogin } = authStore

    const submit = async () => {
      await userLogin({
        email: email.value,
        password: password.value
      })
    }

    if (authStore.isTokenSet) {
      router.push({ name: 'home' })
    }

    return {
      email,
      password,
      userLogin,
      submit,
      $t
    }
  }
  // data() {
  //   return {
  //     email: '',
  //     password: ''
  //   }
  // },
  // methods: {
  //   ...mapActions(['userLogin']),
  //   async submit() {
  //     await this.userLogin({
  //       email: this.email,
  //       password: this.password
  //     })
  //   }
  // },
  // created() {
  //   if (this.$store.state.auth.isTokenSet) {
  //     router.push({ name: 'home' })
  //   }
  // }
})
</script>
