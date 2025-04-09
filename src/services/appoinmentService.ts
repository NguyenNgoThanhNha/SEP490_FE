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
    userId: number
    staffId: [],
    serviceId: [],
    branchId: number,
    appointmentsTime: string,
    status: string,
    notes?: string,
    feedback?: string,
    voucherId?: number
}

const createAppointment = async(data: CreateAppointmentProps) : Promise<ResponseProps> => {
    return await post('Appointments/create', data)
}

interface GetAppointmentByBranchProps {
    BranchId: number,
    Page: number,
    PageSize: number
}

const getAppointmentByBranch = async({BranchId, Page , PageSize}: GetAppointmentByBranchProps) : Promise<ResponseProps> => {
    return await get(`Appointments/by-branch?BranchId=${BranchId}&Page=${Page}&PageSize=${PageSize}`)
}

export default {
    getAllAppointment,
    getAppointmentDetail,
    createAppointment,
    getAppointmentByBranch,
}