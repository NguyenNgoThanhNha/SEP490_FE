import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatEvents } from "@/utils/helpers";
import { Appoinment, Event } from "@/types/staff-calendar.type";
import { fakeAppointments } from "@/data/appointments";
import EventPopup from "@/components/molecules/EventPopup";
import CustomCalendar from "@/components/molecules/Calendar";

const StaffCalendar = () => {
  const [selectedTask, setSelectedTask] = useState<Appoinment | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    setEvents(formatEvents(fakeAppointments));
    setLoading(false);
  }, [id]);

  const handleEventClick = (event: Event) => {
    const task = fakeAppointments.find((item) => item.id === event.id);
    if (task) {
      setSelectedTask(task);
      setShowPopup(true);
    }
  };

  const closePopup = () => setShowPopup(false);
  const markTaskComplete = () => {
    if (selectedTask) {
      setSelectedTask({ ...selectedTask, status: true });
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedTask.id ? { ...event, status: true } : event
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
