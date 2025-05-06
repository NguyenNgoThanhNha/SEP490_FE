import { get, post, ResponseProps } from "./root";

const getListSkincareRoutines = async():Promise<ResponseProps> => {
    return await get("Routine/get-list-skincare-routines")
}

interface GetRoutineDetailProps {
    routineId: number
}

const getRoutineDetail = async({routineId}:GetRoutineDetailProps):Promise<ResponseProps> => {
    return await get(`Routine/get-list-skincare-routines-step/${routineId}`)
}


const getRoutineByUserId = async(userRoutineId: number):Promise<ResponseProps> => {
    return await get(`Routine/get-routine-by-userId/${userRoutineId}`) 
}

const trackingUserRoutine = async(userRoutineId: number):Promise<ResponseProps> => {      
    return await get(`Routine/tracking-user-routine/${userRoutineId}`) 
}

interface CreateUserRoutineLoggerProps {
    stepId: number
    managerId: number
    actionDate: string
    step_Logger: string
    notes: string
}

const createUserRoutineLogger = async(data: CreateUserRoutineLoggerProps):Promise<ResponseProps> => {        
    return await post(`UserRoutineLogger/create`, data) 
}
export default {
    getListSkincareRoutines,
    getRoutineDetail,
    getRoutineByUserId,
    trackingUserRoutine,
    createUserRoutineLogger
    
}