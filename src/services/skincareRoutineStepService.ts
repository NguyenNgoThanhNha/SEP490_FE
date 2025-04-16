import { del, get, post, put, ResponseProps } from "./root";

const getAllSkincareRoutineStep = async (page: number, pageSize: number):Promise<ResponseProps> => {
    return await get(`SkincareRoutineStep/get-all?page=${page}&pageSize=${pageSize}`);
}

const getSkincareRoutineStepDetail = async (skincareRoutineStepId: number):Promise<ResponseProps> => {
    return await get(`SkincareRoutineStep/get-by-id/${skincareRoutineStepId}`);
}

interface CreateSkincareRoutineStepProps{
    skincareRoutineId: number;
    name: string;
    description: string;
    step: number;
    intervalBeforeNextStep: number;
    productIds: number[];
    serviceIds: number[];
}

const createSkincareRoutineStep = async(data: CreateSkincareRoutineStepProps):Promise<ResponseProps> => {
    return await post(`SkincareRoutineStep/create`, data);
}

const updateSkincareRoutineStep = async(data: CreateSkincareRoutineStepProps, skincareRoutineId: number):Promise<ResponseProps> => {
    return await put(`SkincareRoutineStep/update/${skincareRoutineId}`, data);
}

const deleteSkincareRoutineStep = async( skincareRoutineId: number):Promise<ResponseProps> => {
    return await del(`SkincareRoutineStep/update/${skincareRoutineId}`);
}

export default {
    getAllSkincareRoutineStep,
    getSkincareRoutineStepDetail,
    createSkincareRoutineStep,
    updateSkincareRoutineStep,
    deleteSkincareRoutineStep
}