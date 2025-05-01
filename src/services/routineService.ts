import { get, ResponseProps } from "./root";

const getListSkincareRoutines = async():Promise<ResponseProps> => {
    return await get("Routine/get-list-skincare-routines")
}

interface GetRoutineDetailProps {
    id: number
}

const getRoutineDetail = async({id}:GetRoutineDetailProps):Promise<ResponseProps> => {
    return await get(`Routine/${id}`)
}


export default {
    getListSkincareRoutines,
    getRoutineDetail,
    
}