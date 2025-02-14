import { Appoinment } from "@/types/staff-calendar.type";

export const fakeAppointments: Appoinment[] = [
  {
    id: "1",
    service: { name: "Full Body Massage" },
    orderDetail: {
      workDay: "2025-01-24",
      time: "09:00",
      duration: 60,
      customerName: "John Doe", 
       note: "Please use essential oils.",
       staff: "Jenny"
    },
    status: false,
  },
  {
    id: "2",
    service: { name: "Facial Treatment" },
    orderDetail: {
      workDay: "2025-01-23",
      time: "11:00",
      duration: 30,
      customerName: "",
      note: "",
      staff: "Jenny"

    },
    status: false,
  },
  {
    id: "3",
    service: { name: "Hot Stone Therapy" },
    orderDetail: {
      workDay: "2025-01-23",
      time: "14:00",
      duration: 45,
      customerName: "",
      note: "",
      staff: "Jenny"

    },
    status: true,
  },
];
