import axios, { AxiosError, AxiosResponse } from 'axios'
import toast from 'react-hot-toast'
import authService from '@/services/authService.ts'
import { redirect } from 'react-router-dom'
import { ROUTES } from '@/constants/RouterEndpoint.ts'

const BASE_URL = import.meta.env.VITE_ORIGINAL_URL || ''
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers.set('Authorization', `Bearer ${accessToken}`)
    }
    return config
  },
  (error) => Promise.reject(error)
)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalReq = error.config
    if (error.response.status === 401 && !originalReq._retry) {
      originalReq._retry = true
      try {
        const rs = await authService.getRefresh()
        const newAccessToken = rs.result?.data
        localStorage.setItem('accessToken', newAccessToken)
        originalReq.headers.Authorization = `Bearer ${newAccessToken}`
        return axios(originalReq)
      } catch (error: any) {
        handleApiError(error)
        redirect(ROUTES.LOGIN)
      }
    }
    return Promise.reject(error)
  }
)

export interface ResponseProps<T = any> {
  data: any
  success?: boolean
  result?: {
    message?: string
    data?: T
    pagination?: T
  }
}

const handleApiError = (error: AxiosError) => {
  const { response } = error
  if (response?.status === 401) {
    toast.error('Please login again.')
  } else if (response?.status === 500) {
    toast.error('Something went wrong')
  } else {
    return response?.data as ResponseProps
  }
}

export const get = async <T>(url: string): Promise<T | ResponseProps> => {
  try {
    const response: AxiosResponse<T> = await api.get<T>(url)
    return response.data
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return handleApiError(error)
    }
    throw error
  }
}

export const post = async <T>(url: string, data?: unknown): Promise<T | ResponseProps> => {
  try {
    const config = {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    };

    const response: AxiosResponse<T> = await api.post<T>(url, data, config);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return handleApiError(error);
    }
    throw error;
  }
};


export const put = async <T>(url: string, data?: unknown): Promise<T | ResponseProps> => {
  try {
    const response: AxiosResponse<T> = await api.put<T>(url, data)
    return response.data
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return handleApiError(error)
    }
    throw error
  }
}

export const patch = async <T>(url: string, data: unknown): Promise<T | ResponseProps> => {
  try {
    const response: AxiosResponse<T> = await api.patch<T>(url, data)
    return response.data
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return handleApiError(error)
    }
    throw error
  }
}

export const del = async <T>(url: string): Promise<T | ResponseProps> => {
  try {
    const response: AxiosResponse<T> = await api.delete<T>(url)
    return response.data
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return handleApiError(error)
    }
    throw error
  }
}

export const patchFormData = async <T>(url: string, data: unknown): Promise<T | ResponseProps> => {
  try {
    const accessToken = localStorage.getItem('accessToken')
    const response: AxiosResponse<T> = await axios
      .create({
        baseURL: BASE_URL,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`
        }
      })
      .patch<T>(url, data)
    return response.data
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return handleApiError(error)
    }
    throw error
  }
}
