<template>
  <div>
    <v-data-table
      :loading="dataTableLoading"
      :no-data-text="$t('dataTable.NO_DATA')"
      :no-results-text="$t('dataTable.NO_RESULTS')"
      :headers="headers"
      :items="items"
      :options.sync="pagination"
      :items-per-page="5"
      :server-items-length="totalItems"
      class="elevation-1"
      :footer-props="{
        'items-per-page-text': $t('dataTable.ROWS_PER_PAGE'),
        'items-per-page-options': [5, 10, 25]
      }"
    >
      <template v-slot:top>
        <v-layout wrap>
          <v-flex xs12 sm12 md4 mt-3 pl-4>
            <div class="text-left">
              <v-toolbar-title>{{ $t('cities.TITLE') }}</v-toolbar-title>
            </div>
          </v-flex>
          <v-flex xs12 sm6 md4 px-3>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              :label="$t('dataTable.SEARCH')"
              single-line
              hide-details
              clearable
              id="search"
              clear-icon="mdi-close"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md4 mb-2 mt-2 pr-2>
            <ValidationObserver
              ref="observer"
              v-slot="{ invalid }"
              tag="form"
              @submit.prevent="submit()"
            >
              <v-dialog
                v-model="dialog"
                max-width="500px"
                content-class="dlgNewEditItem"
              >
                <template v-slot:activator="{ on }">
                  <div class="text-right">
                    <v-btn color="secondary" v-on="on" class="btnNewItem">
                      <v-icon class="mr-2">mdi-plus</v-icon>
                      {{ $t('dataTable.NEW_ITEM') }}
                    </v-btn>
                  </div>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container grid-list-md>
                      <v-layout wrap>
                        <template v-if="editedItem._id">
                          <v-flex xs12 md6>
                            <label for="createdAt">{{
                              $t('common.CREATED')
                            }}</label>
                            <div name="createdAt">
                              {{ getFormat(editedItem.createdAt) }}
                            </div>
                          </v-flex>
                          <v-flex xs12 md6>
                            <label for="updatedAt">{{
                              $t('common.UPDATED')
                            }}</label>
                            <div name="updatedAt">
                              {{ getFormat(editedItem.updatedAt) }}
                            </div>
                          </v-flex>
                        </template>
                        <v-flex xs12>
                          <ValidationProvider
                            rules="required"
                            v-slot="{ errors }"
                          >
                            <v-text-field
                              requierd
                              id="name"
                              name="name"
                              v-model="editedItem.name"
                              :label="$t('cities.headers.NAME')"
                              :error="errors.length > 0"
                              :error-messages="errors[0]"
                              autocomplete="off"
                            ></v-text-field>
                          </ValidationProvider>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="red lighten3"
                      text
                      @click="close"
                      class="btnCancel"
                      >{{ $t('dataTable.CANCEL') }}</v-btn
                    >
                    <v-btn
                      color="green lighten3"
                      text
                      @click="save"
                      class="btnSave"
                      :disabled="invalid"
                      >{{ $t('dataTable.SAVE') }}</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </ValidationObserver>
          </v-flex>
        </v-layout>
      </template>
      <template v-slot:[`item._id`]="{ item }">
        <v-layout class="justify-center">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn id="edit" icon v-on="on" @click="editItem(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('dataTable.EDIT') }}</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn id="delete" icon v-on="on" @click="deleteItem(item)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('dataTable.DELETE') }}</span>
          </v-tooltip>
        </v-layout>
      </template>
      <template v-slot:[`item.createdAt`]="{ item }">
        {{ getFormat(item.createdAt) }}
      </template>
      <template v-slot:[`item.updatedAt`]="{ item }">
        {{ getFormat(item.updatedAt) }}
      </template>
      <template
        v-slot:[`footer.page-text`]="{ pageStart, pageStop, itemsLength }"
      >
        {{ pageStart }} - {{ pageStop }}
        {{ $t('dataTable.OF') }}
        {{ itemsLength }}
      </template>
      <template v-slot:no-data>{{ $t('dataTable.NO_DATA') }}</template>
      <template v-slot:no-results>{{ $t('dataTable.NO_RESULTS') }}</template>
    </v-data-table>
    <ErrorMessage />
    <SuccessMessage />
  </div>
</template>

<script>
// import { mapActions } from 'vuex'
import {
  getFormat as utilGetFormat,
  buildPayloadPagination
} from '@/utils/utils.js'
import { defineComponent, ref, computed, watchEffect } from 'vue'
import { t as $t } from 'vue-i18n-composable'
import { useAdminCitiesStore } from '@/store/adminCities'
import { useLocaleStore } from '@/store/locale'
import { useConfirm } from '@/composables/useConfirm'

export default defineComponent({
  // metaInfo() {
  //   return {
  //     title: this.$store.getters.appTitle,
  //     titleTemplate: `${this.$t('cities.TITLE')} - %s`
  //   }
  // },

  /* eslint-disable max-statements */
  setup() {
    const adminCitiesStore = useAdminCitiesStore()

    const dataTableLoading = ref(true)
    const delayTimer = ref(null)
    const dialog = ref(false)
    const search = ref('')
    const pagination = ref({})
    const editedItem = ref({})
    const defaultItem = ref({})
    const fieldsToSearch = ref(['name'])

    const formTitle = computed(() => {
      return editedItem.value._id
        ? this.$t('dataTable.EDIT_ITEM')
        : this.$t('dataTable.NEW_ITEM')
    })

    const headers = computed(() => [
      {
        text: $t('dataTable.ACTIONS'),
        value: '_id',
        sortable: false,
        width: 100
      },
      {
        text: $t('cities.headers.NAME'),
        align: 'left',
        sortable: true,
        value: 'name'
      },
      {
        text: $t('common.CREATED'),
        align: 'left',
        sortable: true,
        value: 'createdAt'
      },
      {
        text: $t('common.UPDATED'),
        align: 'left',
        sortable: true,
        value: 'updatedAt'
      }
    ])
    const items = computed(() => adminCitiesStore.cities)
    const totalItems = computed(() => adminCitiesStore.totalCities)

    const close = () => {
      dialog.value = false
      setTimeout(() => {
        editedItem.value = Object.assign({}, defaultItem.value)
      }, 300)
    }

    const localeStore = useLocaleStore()
    const getFormat = (date) => {
      window.__localeId__ = localeStore.locale
      return utilGetFormat(date, 'iii, MMMM d yyyy, h:mm a')
    }

    // eslint-disable-next-line prettier/prettier
    const { getCities, editCity, saveCity, deleteCity } = adminCitiesStore

    const doSearch = async () => {
      try {
        dataTableLoading.value = true
        await getCities(
          buildPayloadPagination(this.pagination, this.buildSearch())
        )
        dataTableLoading.value = false
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        dataTableLoading.value = false
      }
    }

    const buildSearch = () => {
      return search.value
        ? { query: search.value, fields: this.fieldsToSearch.join(',') }
        : {}
    }

    const editItem = (item) => {
      editedItem.value = Object.assign({}, item)
      dialog.value = true
    }

    const confirm = useConfirm()
    const deleteItem = async (item) => {
      try {
        const response = await confirm(
          $t('common.DO_YOU_REALLY_WANT_TO_DELETE_THIS_ITEM'),
          {
            title: $t('common.WARNING'),
            buttonTrueText: $t('common.DELETE'),
            buttonFalseText: $t('common.CANCEL'),
            buttonTrueColor: 'red lighten3',
            buttonFalseColor: 'green'
          }
        )
        if (response) {
          dataTableLoading.value = true
          await deleteCity(item._id)
          await getCities(
            buildPayloadPagination(this.pagination, this.buildSearch())
          )
          dataTableLoading.value = false
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        dataTableLoading.value = false
      }
    }

    const observer = ref(null)
    const save = async () => {
      const isValid = await observer.value?.validate()
      if (isValid) {
        try {
          this.dataTableLoading = true
          // Updating item
          if (this.editedItem._id) {
            await this.editCity(this.editedItem)
            await this.getCities(
              buildPayloadPagination(this.pagination, this.buildSearch())
            )
            this.dataTableLoading = false
          } else {
            // Creating new item
            await this.saveCity({ name: this.editedItem.name })
            await this.getCities(
              buildPayloadPagination(this.pagination, this.buildSearch())
            )
            this.dataTableLoading = false
          }
          this.close()
          // eslint-disable-next-line no-unused-vars
        } catch (error) {
          this.dataTableLoading = false
          this.close()
        }
      }
    }

    watchEffect(() => {
      if (dialog.value) {
        close()
      }
    })

    watchEffect(
      async () => {
        try {
          dataTableLoading.value = true
          await getCities(
            buildPayloadPagination(pagination.value, buildSearch())
          )
          dataTableLoading.value = false
          // eslint-disable-next-line no-unused-vars
        } catch (error) {
          this.dataTableLoading = false
        }
      },
      { deep: true }
    )

    watchEffect((onInvalidate) => {
      delayTimer.value = setTimeout(() => {
        doSearch()
      }, 400)
      onInvalidate(() => {
        clearTimeout(delayTimer.value)
      })
    })

    return {
      dataTableLoading,
      delayTimer,
      dialog,
      search,
      pagination,
      editedItem,
      defaultItem,
      fieldsToSearch,
      formTitle,
      headers,
      getCities,
      editCity,
      saveCity,
      deleteCity,
      items,
      totalItems,
      getFormat,
      doSearch,
      buildSearch,
      editItem,
      deleteItem,
      save
    }
  }
})
</script>

<style>
table.v-table {
  max-width: none;
}
</style>
