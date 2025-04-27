import React from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "moment/locale/vi"; // Import ngôn ngữ tiếng Việt cho moment
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Event } from "@/types/staff-calendar.type";
import { Loader2 } from "lucide-react";
import CustomToolbar from "./Toolbar";
import { useTranslation } from "react-i18next";

moment.locale("vi"); // Thiết lập ngôn ngữ mặc định cho moment
const localizer = momentLocalizer(moment);

interface CustomCalendarProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  loading: boolean;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ events, onEventClick, loading }) => {
  const { t } = useTranslation();

  const messages = {
    today: t("today"),
    previous: t("previous"),
    next: t("next"),
    month: t("month"),
    week: t("week"),
    day: t("day"),
    agenda: t("agenda"),
    date: t("date"),
    time: t("time"),
    event: t("event"),
    noEventsInRange: t("noEventsInRange"),
    showMore: (count: number) => t("showMore", { count }),
  };

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
          components={{
            toolbar: CustomToolbar,
          }}
          messages={messages}
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
              backgroundColor: moment(date).isSame(moment(), "month") ? "#F5F5DC" : "transparent",
            },
          })}
          formats={{
            dayFormat: (date) => moment(date).format("dddd DD"), // Hiển thị "Thứ Hai 13"
            weekdayFormat: (date) => moment(date).format("dddd"), // Hiển thị "Thứ Hai"
            dayRangeHeaderFormat: ({ start, end }) =>
              `${moment(start).format("DD/MM")} - ${moment(end).format("DD/MM")}`, // Hiển thị "27/04 - 03/05"
            timeGutterFormat: (date) => moment(date).format("HH:mm"), // Hiển thị "09:00", "10:00", v.v.
          }}
          min={new Date(2024, 0, 1, 9, 0)} // Bắt đầu từ 9:00 sáng
          max={new Date(2024, 0, 1, 21, 0)} // Kết thúc lúc 21:00 tối
          scrollToTime={new Date(2024, 0, 1, 9, 0)} // Cuộn đến 9:00 sáng
        />
      )}
    </div>
  );
};

export default CustomCalendar;
