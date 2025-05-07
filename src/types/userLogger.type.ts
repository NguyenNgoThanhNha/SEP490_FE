export type TUserLogger = {
  actionDate: string
  userRoutineLoggerId: number
  stepId: number
  userRoutineStep: {
    userRoutineStepId: number
    userRoutineId: number
    skincareRoutineStepId: number
    skinCareRoutineStep: {
      stepStatus: number
      startDate: string
      endDate: string
    }
  }
  managerId: number
  manager: {
    userName: string
    userId: number
    fullName: string
  }
  userId: number
  user: {
    userName: string
  }
  step_Logger: string
  notes: string
}
