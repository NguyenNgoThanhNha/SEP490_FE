import React from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "moment/locale/vi"; // Ensure Vietnamese locale is imported
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Event } from "@/types/staff-calendar.type";
import { Loader2 } from "lucide-react";
import CustomToolbar from "./Toolbar";
// import { useTranslation } from "react-i18next"; // Uncomment if using i18next for translations

moment.locale("vi"); // Set moment to use Vietnamese locale
const localizer = momentLocalizer(moment);

interface CustomCalendarProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  loading: boolean;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  events,
  onEventClick,
  loading,
}) => {
  // const { t } = useTranslation(); // Uncomment if using i18next

  const messages = {
    today: "Hôm nay",
    previous: "Trước",
    next: "Tiếp",
    month: "Tháng",
    week: "Tuần",
    day: "Ngày",
    agenda: "Lịch biểu",
    date: "Ngày",
    time: "Giờ",
    event: "Sự kiện",
    noEventsInRange: "Không có sự kiện nào trong khoảng thời gian này",
    showMore: (count: number) => `+${count} sự kiện`,
  };

  return (
    <div style={{ height: "80vh", padding: "10px" }}>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        </div>
      ) : (
        <Calendar
          culture={"vi-VN"} // Set culture to Vietnamese
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={[Views.WEEK, Views.DAY]}
          defaultView={Views.WEEK}
          onSelectEvent={onEventClick}
          step={15}
          timeslots={4}
          components={{
            toolbar: CustomToolbar,
          }}
          messages={messages} // Use the defined messages for localization
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
              backgroundColor: event.status ? "#8F8F47" : "#516D19",
              color: "#F5F5DC",
              borderRadius: "8px",
              padding: "3px 8px",
              fontWeight: "bold",
              fontSize: "12px",
              textAlign: "center",
              borderColor: "#516D19",
            },
          })}
          dayPropGetter={(date) => ({
            style: {
              fontSize: "14px",
              color: "#333",
              borderRadius: "8px",
              backgroundColor: moment(date).isSame(moment(), "month")
                ? "#F5F5DC"
                : "transparent",
            },
          })}
          formats={{
            weekdayFormat: (date) => moment(date).format("dddd"), // Thứ hai, Thứ ba,...
            dayFormat: (date) => moment(date).format("dddd, DD/MM"),
            dayHeaderFormat: (date) => moment(date).format("dddd, DD/MM"),
            dayRangeHeaderFormat: ({ start, end }) =>
              `${moment(start).format ("DD/MM")} - ${moment(end).format("DD/MM")}`,
            timeGutterFormat: (date) => moment(date).format("HH:mm"),
          }}
          
          min={new Date(2024, 0, 1, 9, 0)}
          max={new Date(2024, 0, 1, 21, 0)}
          scrollToTime={new Date(2024, 0, 1, 9, 0)}
        />
      )}
    </div>
  );
};

export default CustomCalendar;