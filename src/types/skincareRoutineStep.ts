export type TSkincareRoutineSteps = {
    skinCareRoutineStepsId: number,
    createdDate: string,
    updatedDate: string,
    skincareRoutineId: number,
    name: string,
    description: string,
    step: number,
    intervalBeforeNextStep: number,
    productIds: number[],
    serviceIds: number[]

}