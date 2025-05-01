import { del, get, post, put, ResponseProps } from "./root";

const getAllSkincareRoutine = async ():Promise<ResponseProps> => {
    return await get('SkincareRoutine/get-all');
}

const getSkincareRoutineDetail = async(skincareRoutineId: number):Promise<ResponseProps> => {
    return await get(`SkincareRoutine/get-by-id/${skincareRoutineId}`);
}

interface CreateSkincareRoutineProps {
    name: string;
    description: string;
    totalSteps: number,
    targetSkinTypes: string[],
    totalPrice: number
}

const createSkincareRoutine = async(data: CreateSkincareRoutineProps):Promise<ResponseProps> => {
    return await post(`SkincareRoutine/create`, data);
}

const updateSkincareRoutine = async(data: CreateSkincareRoutineProps, skincareRoutineId: number):Promise<ResponseProps> => {
    return await put(`SkincareRoutine/update/${skincareRoutineId}`, data);
}

const deleteSkincareRoutine = async( skincareRoutineId: number):Promise<ResponseProps> => {
    return await del(`SkincareRoutine/delete/${skincareRoutineId}`);
}

const getTargetSkinType = async ():Promise<ResponseProps> => {
    return await get('SkincareRoutine/get-target-skin-type');
}

export default {
    getAllSkincareRoutine,
    getSkincareRoutineDetail,
    createSkincareRoutine,
    updateSkincareRoutine,
    deleteSkincareRoutine,
    getTargetSkinType
}