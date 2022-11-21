import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api/adminUsers'
import { buildSuccess, handleError } from '@/utils/utils.js'

export const useAdminUsersStore = defineStore('AdminUsersStore', () => {
  const users = ref([])
  const totalUsers = ref(0)

  const getUsers = (payload) => {
    return new Promise((resolve, reject) => {
      api
        .getUsers(payload)
        .then((response) => {
          if (response.status === 200) {
            // commit(types.USERS, response.data.docs)
            users.value = response.data.docs
            // commit(types.TOTAL_USERS, response.data.totalDocs)
            totalUsers.value = response.data.totalDocs
            resolve()
          }
        })
        .catch((error) => {
          handleError(error, reject)
        })
    })
  }

  const editUser = (payload) => {
    return new Promise((resolve, reject) => {
      const data = {
        name: payload.name,
        email: payload.email,
        role: payload.role,
        phone: payload.phone,
        city: payload.city,
        country: payload.country
      }
      api
        .editUser(payload._id, data)
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

  const deleteUser = (payload) => {
    return new Promise((resolve, reject) => {
      api
        .deleteUser(payload)
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
    users,
    totalUsers,
    getUsers,
    editUser,
    deleteUser
  }
})
