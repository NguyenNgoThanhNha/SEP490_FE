import { get, ResponseProps } from "./root"

interface GetAppointmentProps {
    page: number,
    pageSize: number,
}

const getAllAppointment = async({page, pageSize}: GetAppointmentProps) : Promise<ResponseProps> => {
    return await get(`Appointments/get-all?page=${page}&pageSize=${pageSize}`)
}

export default {
    getAllAppointment
}