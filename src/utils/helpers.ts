import moment from "moment";
import { Appoinment, Event } from "@/types/staff-calendar.type";

export const formatEvents = (appointments: Appoinment[]): Event[] =>
  appointments.map(({ id, service, orderDetail, status }) => {
    const start = moment(`${orderDetail.workDay}T${orderDetail.time}`).toDate();
    const end = moment(start).add(orderDetail.duration, 'minutes').toDate();
    return { id, title: service.name, start, end, status };
  });
