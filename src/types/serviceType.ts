import { TCate } from "./category.type"

export type TService = {
    serviceId: number,
    name: string,
    description: string,
    price: number,
    duration: string,
    status: string,
    steps: string[],
    createdDate: string,
    updatedDate: string,
    images: string[],
    serviceCategoryId: number,
    serviceCategory : TCate,
}