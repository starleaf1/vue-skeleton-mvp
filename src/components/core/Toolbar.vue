<template v-slot:activator="{ on }">
  <div>
    <v-app-bar flat>
      <span class="hidden-md-and-up">
        <v-app-bar-nav-icon @click="sidebar = !sidebar"></v-app-bar-nav-icon>
      </span>
      <div class="headline text-uppercase ml-0">
        <div v-resize-text>
          <router-link
            :to="{ name: 'home' }"
            tag="span"
            style="cursor: pointer"
            v-if="isTokenSet"
            >{{ appTitle }}</router-link
          >
          <router-link
            :to="{ name: 'landing' }"
            tag="span"
            style="cursor: pointer"
            v-else
            >{{ appTitle }}</router-link
          >
        </div>
      </div>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn
          text
          v-for="(item, index) in menuItems"
          :key="index"
          :to="{ name: item.link }"
          exact
          :class="['hidden-sm-and-down', item.class]"
        >
          <v-icon>{{ item.icon }}</v-icon>
          &nbsp;{{ item.title }}
        </v-btn>
        <v-list-item class="hidden-sm-and-down">
          <v-icon>mdi-weather-sunny</v-icon>
          <v-list-item-action>
            <v-switch v-model="isDark" inset></v-switch>
          </v-list-item-action>
          <v-icon class="pl-2">mdi-weather-night</v-icon>
        </v-list-item>
        <v-menu v-if="admin" offset-y>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" text class="btnAdmin hidden-sm-and-down">
              <v-icon>mdi-lock</v-icon>
              &nbsp;{{ $t('adminItems.ADMIN') }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in adminItems"
              :key="index"
              :to="{ name: item.link }"
              exact
              :class="[item.class]"
            >
              <v-list-item-icon class="mr-2">
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn
          text
          v-if="isTokenSet"
          @click="userLogout"
          class="hidden-sm-and-down btnLogout"
        >
          <v-icon left>mdi-exit-to-app</v-icon>
          {{ $t('menuItems.LOGOUT') }}
        </v-btn>
        <LocaleChanger />
      </v-toolbar-items>
    </v-app-bar>
    <v-navigation-drawer v-model="sidebar" absolute disable-resize-watcher>
      <v-list>
        <v-list-item>
          <v-list-item-content>{{ appTitle }}</v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click.stop="sidebar = !sidebar">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-list-item
          v-for="(item, index) in menuItems"
          :key="index"
          :to="{ name: item.link }"
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>{{ item.title }}</v-list-item-content>
        </v-list-item>

        <v-list-group v-if="admin" prepend-icon="mdi-lock" no-action>
          <v-list-item slot="activator" class="pl-0">
            <v-list-item-content>{{
              $t('adminItems.ADMIN')
            }}</v-list-item-content>
          </v-list-item>
          <v-list-item
            v-for="(item, index) in adminItems"
            :key="index"
            :to="{ name: item.link }"
            exact
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-item v-if="isTokenSet" @click="userLogout">
          <v-list-item-action>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            {{ $t('menuItems.LOGOUT') }}
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-action></v-list-item-action>
          <v-icon>mdi-weather-sunny</v-icon>
          <v-list-item-action class="ml-2">
            <v-switch id="themeSwitcher" v-model="isDark" inset></v-switch>
          </v-list-item-action>
          <v-icon>mdi-weather-night</v-icon>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import { defineComponent, computed, ref, watchEffect } from 'vue'
import LocaleChanger from '@/components/core/LocaleChanger'
import ResizeText from 'vue-resize-text'
import { useAppStore } from '@/store/app'
import { useAuthStore } from '@/store/auth'
import i18n from '../../plugins/i18n'
import { useI18n } from 'vue-i18n-composable'
import useVuetify from '@/composables/useVuetify'

export default defineComponent({
  name: 'Toolbar',
  metaInfo() {
    const appStore = useAppStore()
    return {
      // title: this.$store.getters.appTitle,
      title: appStore.appTitle,
      htmlAttrs: {
        // lang: this.$i18n.locale
        lang: i18n
      },
      meta: [
        { name: 'msapplication-TileColor', content: '#ffc40d' },
        { name: 'theme-color', content: '#ffffff' },
        {
          name: 'apple-mobile-web-app-title',
          // content: this.$store.getters.appTitle
          content: appStore.appTitle
        },
        {
          name: 'application-name',
          // content: this.$store.getters.appTitle
          content: appStore.appTitle
        }
      ],
      link: [
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png'
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon-32x32.png'
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/favicon-16x16.png'
        },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'mask-icon', color: '#5bbad5', href: '/safari-pinned-tab.svg' },
        { rel: 'favicon', href: '/favicon.ico' }
      ]
    }
  },
  components: {
    LocaleChanger
  },
  directives: {
    ResizeText
  },
  // data() {
  //   return {
  //     isDark: false,
  //     sidebar: false
  //   }
  // },

  setup() {
    const appStore = useAppStore()
    const authStore = useAuthStore()
    const { t } = useI18n()

    const dark = localStorage.getItem('dark')
    const isDark = ref(dark ? JSON.parse(dark) : false)

    const sidebar = ref(false)

    const appTitle = computed(() => appStore.appTitle)
    const isTokenSet = computed(() => authStore.isTokenSet)
    const user = computed(() => authStore.user)

    const admin = computed(() =>
      user.value !== null ? user.value.role === 'admin' : false
    )

    const adminItems = computed(() => [
      {
        title: t('adminItems.CITIES'),
        link: 'admin-cities',
        icon: 'mdi-city',
        class: 'btnAdminCities'
      },
      {
        title: t('adminItems.USERS'),
        link: 'admin-users',
        icon: 'mdi-account-supervisor',
        class: 'btnAdminUsers'
      }
    ])

    const menuItems = computed(() => {
      if (isTokenSet.value) {
        return [
          {
            title: t('menuItems.HOME'),
            link: 'home',
            icon: 'mdi-home',
            class: 'btnHome'
          },
          {
            title: t('menuItems.ABOUT'),
            link: 'about',
            icon: 'mdi-help-circle-outline',
            class: 'btnAbout'
          },
          {
            title: t('menuItems.MY_PROFILE'),
            link: 'profile',
            icon: 'mdi-face',
            class: 'btnProfile'
          }
        ]
      }
      return [
        {
          title: t('menuItems.HOME'),
          link: 'landing',
          icon: 'mdi-home'
        },
        {
          title: t('menuItems.ABOUT'),
          link: 'about',
          icon: 'mdi-help-circle-outline',
          class: 'btnAbout'
        },
        {
          title: t('menuItems.LOGIN'),
          link: 'login',
          icon: 'mdi-lock',
          class: 'btnLogin'
        },
        {
          title: t('menuItems.SIGNUP'),
          link: 'signup',
          icon: 'mdi-plus-circle-outline',
          class: 'btnLogin'
        }
      ]
    })

    watchEffect(() => {
      const vuetify = useVuetify()
      if (vuetify) {
        vuetify.theme.dark = isDark.value
      }
      localStorage.setItem('dark', isDark.value)
    })

    return {
      isDark,
      sidebar,
      appTitle,
      isTokenSet,
      user,
      admin,
      adminItems,
      menuItems
    }
  }
  // computed: {
  // ...mapGetters(['appTitle', 'isTokenSet', 'user']),
  // admin() {
  //   return this.user !== null ? this.user.role === 'admin' : false
  // },
  // adminItems() {
  //   return [
  //     {
  //       title: t('adminItems.CITIES'),
  //       link: 'admin-cities',
  //       icon: 'mdi-city',
  //       class: 'btnAdminCities'
  //     },
  //     {
  //       title: t('adminItems.USERS'),
  //       link: 'admin-users',
  //       icon: 'mdi-account-supervisor',
  //       class: 'btnAdminUsers'
  //     }
  //   ]
  // },
  //   menuItems() {
  //     if (this.isTokenSet) {
  //       return [
  //         {
  //           title: t('menuItems.HOME'),
  //           link: 'home',
  //           icon: 'mdi-home',
  //           class: 'btnHome'
  //         },
  //         {
  //           title: t('menuItems.ABOUT'),
  //           link: 'about',
  //           icon: 'mdi-help-circle-outline',
  //           class: 'btnAbout'
  //         },
  //         {
  //           title: t('menuItems.MY_PROFILE'),
  //           link: 'profile',
  //           icon: 'mdi-face',
  //           class: 'btnProfile'
  //         }
  //       ]
  //     }
  //     return [
  //       {
  //         title: t('menuItems.HOME'),
  //         link: 'landing',
  //         icon: 'mdi-home'
  //       },
  //       {
  //         title: t('menuItems.ABOUT'),
  //         link: 'about',
  //         icon: 'mdi-help-circle-outline',
  //         class: 'btnAbout'
  //       },
  //       {
  //         title: t('menuItems.LOGIN'),
  //         link: 'login',
  //         icon: 'mdi-lock',
  //         class: 'btnLogin'
  //       },
  //       {
  //         title: t('menuItems.SIGNUP'),
  //         link: 'signup',
  //         icon: 'mdi-plus-circle-outline',
  //         class: 'btnLogin'
  //       }
  //     ]
  //   }
  // },
  // methods: {
  //   userLogout() {
  //     this.$store.dispatch('userLogout')
  //   }
  // },
  // watch: {
  //   isDark() {
  //     this.$vuetify.theme.dark = this.isDark
  //     localStorage.setItem('dark', this.isDark)
  //   }
  // },
  // created() {
  //   const dark = localStorage.getItem('dark')
  //   this.isDark = dark ? JSON.parse(dark) : false
  // }
})
</script>
