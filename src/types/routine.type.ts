export type TRoutine = {
  skincareRoutineId: number
  name: string
  description: string
  targetSkinTypes: string[]
  createdDate: string
  updatedDate: string
  totalSteps: number
  totalPrice: number
  intervalBeforeNextRoutine: number
  step: number
}

export interface IService {
  id: number
  name: string
  description: string
  price: number
  duration: string
  images: string[]
}

export interface IProduct {
  id: number
  name: string
  brand: string
  description: string
  price: number
  imageUrl: string
}

export interface IRoutineStep {
  id: number
  name: string
  description: string
  intervalBeforeNextStep: number
  intervalUnit: 'days' | 'hours' | 'weeks'
  services: IService[]
  products: IProduct[]
}

export interface IRoutineInfo {
  skincareRoutineId: number
  name: string
  description: string
  targetSkinTypes: string
  totalSteps: number
  totalPrice: number
  createdDate: string
  updatedDate: string
  intervalBeforeNextRoutine: number
}
