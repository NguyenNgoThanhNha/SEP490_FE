import { post } from './root'

const updateUserRoutineStep = async () => {
  return await post('Auth/run-user-routine-step-update')
}

const updateStatusOrderRoutine = async () => {
  return await post(`Auth/update-status-order-routine`)
}

const cancelAppointment = async () => {
  return await post(`Auth/run-order-appointment-update`)
}
export const configService = {
  updateUserRoutineStep,
  updateStatusOrderRoutine,
  cancelAppointment
}
