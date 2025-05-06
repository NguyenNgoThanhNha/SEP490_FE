import { get, ResponseProps } from "./root";

const getListSkincareRoutines = async():Promise<ResponseProps> => {
    return await get("Routine/get-list-skincare-routines")
}

interface GetRoutineDetailProps {
    routineId: number
}

const getRoutineDetail = async({routineId}:GetRoutineDetailProps):Promise<ResponseProps> => {
    return await get(`Routine/get-list-skincare-routines-step/${routineId}`)
}

interface GetRoutineByUserIdProps {
    userId: number;
    routineId: number;
}
const getRoutineByUserId = async({routineId, userId}: GetRoutineByUserIdProps):Promise<ResponseProps> => {
    return await get(`Routine/get-routine-by-userId/${routineId}/${userId}`) 
}

export default {
    getListSkincareRoutines,
    getRoutineDetail,
    getRoutineByUserId
    
}