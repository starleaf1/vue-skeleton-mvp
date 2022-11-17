import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api/adminCities'
import { buildSuccess, handleError } from '@/utils/utils.js'

export const useAdminCitiesStore = defineStore('adminCitiesStore', () => {})
