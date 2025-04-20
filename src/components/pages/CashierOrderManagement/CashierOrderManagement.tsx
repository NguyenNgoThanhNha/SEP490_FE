import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatEvents } from "@/utils/helpers";
import { Event } from "@/types/staff-calendar.type";
import EventPopup from "@/components/molecules/EventPopup";
import CustomCalendar from "@/components/molecules/Calendar";
import { TAppointment } from "@/types/appoinment.type";
import appoinmentService from "@/services/appoinmentService";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

const StaffCalendar = () => {
  const [selectedTask, setSelectedTask] = useState<TAppointment | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const branchIdRedux = useSelector((state: RootState) => state.branch.branchId);
  const branchId = branchIdRedux || Number(localStorage.getItem("branchId"));
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const appointmentsResponse = await appoinmentService.getAppointmentByBranch({
          BranchId: branchId,
          Page: 1,
          PageSize: 100,
        });

        const appointments: TAppointment[] = appointmentsResponse.result?.data || [];
        setEvents(formatEvents(appointments));

        setLoading(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [id]);

  const handleEventClick = async (event: Event) => {
    try {
      const appointmentDetailsResponse = await appoinmentService.getAppointmentDetail({
        appointmentId: Number(event.id),
      });

      const appointmentDetails: TAppointment = appointmentDetailsResponse.result?.data;

      setSelectedTask(appointmentDetails);
      setShowPopup(true);
    } catch (error) {
      console.error("Error fetching appointment details:", error);
    }
  };

  const closePopup = () => setShowPopup(false);

  const markTaskComplete = () => {
    if (selectedTask) {
      setSelectedTask({ ...selectedTask, status: "Completed" });
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedTask.appointmentId
            ? { ...event, status: "Completed" }
            : event
        )
      );
    }
    closePopup();
  };

  return (
    <>
      {showPopup && selectedTask && (
        <EventPopup
          selectedTask={selectedTask}
          onClose={closePopup}
          onComplete={markTaskComplete}
        />
      )}
      <div className="m-4">
        <CustomCalendar
          events={events}
          onEventClick={handleEventClick}
          loading={loading}
        />
      </div>
    </>
  );
};

export default StaffCalendar;
