import moment from "moment";
import { Event } from "@/types/staff-calendar.type";
import { TAppointment } from "@/types/appoinment.type";

export const formatEvents = (appointments: TAppointment[]): Event[] =>
  appointments.map(({ appointmentId, service, status, appointmentsTime, appointmentEndTime }) => {
    const start = moment(appointmentsTime).toDate();
    
    const end = appointmentEndTime !== "0001-01-01T00:00:00" 
      ? moment(appointmentEndTime).toDate() 
      : start; 
    return { 
      id: appointmentId.toString(), 
      title: service.name,
      start,
      end,
      status: status === "Completed", 
    };
  });
