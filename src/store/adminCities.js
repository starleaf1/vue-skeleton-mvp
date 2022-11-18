import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api/adminCities'
import { buildSuccess, handleError } from '@/utils/utils.js'

export const useAdminCitiesStore = defineStore('adminCitiesStore', () => {
  const cities = ref([])
  const totalCities = ref(0)

  const getCities = (payload) => {
    return new Promise((resolve, reject) => {
      api
        .getCities(payload)
        .then((response) => {
          if (response.status === 200) {
            // commit(types.CITIES, response.data.docs)
            cities.value = response.data.docs
            // commit(types.TOTAL_CITIES, response.data.totalDocs)
            totalCities.value = response.data.totalDocs
            resolve()
          }
        })
        .catch((error) => {
          handleError(error, reject)
        })
    })
  }

  const editCity = (payload) => {
    return new Promise((resolve, reject) => {
      const data = {
        name: payload.name
      }
      api
        .editCity(payload._id, data)
        .then((response) => {
          if (response.status === 200) {
            buildSuccess(
              {
                msg: 'common.SAVED_SUCCESSFULLY'
              },
              resolve
            )
          }
        })
        .catch((error) => {
          handleError(error, reject)
        })
    })
  }

  const saveCity = (payload) => {
    return new Promise((resolve, reject) => {
      api
        .saveCity(payload)
        .then((response) => {
          if (response.status === 201) {
            buildSuccess(
              {
                msg: 'common.SAVED_SUCCESSFULLY'
              },
              resolve
            )
          }
        })
        .catch((error) => {
          handleError(error, reject)
        })
    })
  }

  const deleteCity = (payload) => {
    return new Promise((resolve, reject) => {
      api
        .deleteCity(payload)
        .then((response) => {
          if (response.status === 200) {
            buildSuccess(
              {
                msg: 'common.DELETED_SUCCESSFULLY'
              },
              resolve
            )
          }
        })
        .catch((error) => {
          handleError(error, reject)
        })
    })
  }

  return {
    cities,
    totalCities,
    getCities,
    editCity,
    saveCity,
    deleteCity
  }
})
