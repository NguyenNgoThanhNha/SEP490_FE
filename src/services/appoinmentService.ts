import { get, post, ResponseProps } from "./root"

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

interface CreateAppointmentProps {
    staffId: [],
    serviceId: [],
    branchId: number,
    appointmentsTime: string,
    status: string,
    notes?: string,
    feedback?: string,
    voucherId?: number
}

const createAppointment = async({staffId, serviceId, branchId, appointmentsTime, notes, feedback, voucherId, status}: CreateAppointmentProps) : Promise<ResponseProps> => {
    return await post('Appointments/create', {staffId, serviceId,branchId, appointmentsTime, notes, feedback, voucherId, status})
}
export default {
    getAllAppointment,
    getAppointmentDetail,
    createAppointment
}