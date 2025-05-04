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


export default {
    getListSkincareRoutines,
    getRoutineDetail,
    
}