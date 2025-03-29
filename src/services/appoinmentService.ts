import { get, ResponseProps } from "./root"

interface GetAppointmentProps {
    page: number,
    pageSize: number,
}

const getAllAppointment = async({page, pageSize}: GetAppointmentProps) : Promise<ResponseProps> => {
    return await get(`Appointments/get-all?page=${page}&pageSize=${pageSize}`)
}

interface AppointmentDetailProps {
    appointmentId: number
}

const getAppointmentDetail = async({appointmentId}: AppointmentDetailProps) : Promise<ResponseProps> => {
    return await get(`Appointments/get-by-id/${appointmentId}`)
}

export default {
    getAllAppointment,
    getAppointmentDetail,

}