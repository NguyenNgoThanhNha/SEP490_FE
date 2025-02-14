import React from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Event } from "@/types/staff-calendar.type";
import { Loader2 } from "lucide-react";
import CustomToolbar from "./Toolbar";

const localizer = momentLocalizer(moment);

interface CustomCalendarProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  loading: boolean;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ events, onEventClick, loading }) => {
  const currentMonth = moment().month();

  return (
    <div style={{ height: "80vh", padding: "10px" }}>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        </div>
      ) : (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={[Views.WEEK, Views.DAY]}
          defaultView={Views.WEEK}
          onSelectEvent={onEventClick}
          step={15}
          timeslots={4}
          className="custom-calendar"
          components={{
            toolbar: CustomToolbar,
          }}
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: "#f9fafc",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.status ? " #8F8F47" : "#516D19", 
              color: " #F5F5DC",
              borderRadius: "8px",
              padding: "3px 8px",
              fontWeight: "bold",
              fontSize: "12px",
              textAlign: "center",
              borderColor: "#516D19"
            },
          })}
          dayPropGetter={(date) => {
            const isCurrentMonth = moment(date).month() === currentMonth; 
            return {
              style: {
                padding: "5px",
                fontSize: "14px",
                fontWeight: "bold",
                color: "#333",
                borderRadius: "8px",
                margin: "2px",
                backgroundColor: isCurrentMonth ? "#F5F5DC" : "transparent",
              },
            };
          }}
          min={new Date(2024, 0, 1, 9, 0)} 
          max={new Date(2024, 0, 1, 18, 0)}
          scrollToTime={new Date(2024, 0, 1, 9, 0)}
        />
      )}
    </div>
  );
};

export default CustomCalendar;
