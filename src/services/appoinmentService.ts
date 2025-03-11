interface CreateAppointmentProps {
    staffId: number,
    servicesId: [],
    branchId: number,
    appointmentsTime: string,
    status?: string,
    note?: string,
    feedback?: string,
    voucherId?: number,
}
const createAppointment = async()