import axios from 'axios'
import { ElNotification } from 'element-plus'

export const Request = axios.create({
  // baseURL: "https://v2.elis.uaz.ru/api",
  baseURL: 'https://dev.v2.elis.uaz.ru/api'
})

Request.interceptors.request.use((config) => {
  return config
})
Request.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response.status === 422) {
      return error.response
    } else if (error.response.status === 500) {
      ElNotification({
        title: 'Ошибка сервера!',
        message: 'Попробуйте позднее.',
        type: 'error'
      })
      return false
    }
    return Promise.reject(error)
  }
)
export const Request2 = axios.create({
  baseURL: 'https://v2.elis.uaz.ru/api'
})

Request2.interceptors.request.use((config) => {
  return config
})
Request2.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response.status === 422) {
      return error.response
    } else if (error.response.status === 500) {
      ElNotification({
        title: 'Ошибка сервера!',
        message: 'Попробуйте позднее.',
        type: 'error'
      })
      return false
    }
    return Promise.reject(error)
  }
)
