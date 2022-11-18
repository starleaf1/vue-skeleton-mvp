import { defineStore, ref } from 'pinia'
import api from '@/services/api/cities'
import { handleError } from '@/utils/utils.js'

export const useCitiesStore = defineStore('citiesStore', () => {
  const allCities = ref([])

  const getAllCities = () => {
    return new Promise((resolve, reject) => {
      api
        .getAllCities()
        .then((response) => {
          if (response.status === 200) {
            const cities = []
            const array = response.data
            array.forEach((element) => {
              cities.push(element.name)
            })
            allCities.value = cities
            resolve()
          }
        })
        .catch((error) => {
          handleError(error, reject)
        })
    })
  }

  const fillAllCities = (cities) => {
    allCities.value = cities
  }

  return {
    allCities,
    getAllCities,
    fillAllCities
  }
})
