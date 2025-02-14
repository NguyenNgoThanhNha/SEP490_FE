// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { formatEvents } from "@/utils/helpers";
// import { Appoinment, Event } from "@/types/staff-calendar.type";
// import { fakeAppointments } from "@/data/appointments";
// import EventPopup from "@/components/molecules/EventPopup";
// import CustomCalendar from "@/components/molecules/Calendar";

// const StaffCalendar = () => {
//   const [selectedTask, setSelectedTask] = useState<Appoinment | null>(null);
//   const [showPopup, setShowPopup] = useState(false);
//   const [events, setEvents] = useState<Event[]>([]);
//   const [loading, setLoading] = useState(true);
//   const { id } = useParams();

//   useEffect(() => {
//     setEvents(formatEvents(fakeAppointments));
//     setLoading(false);
//   }, [id]);

//   const handleEventClick = (event: Event) => {
//     const task = fakeAppointments.find((item) => item.id === event.id);
//     if (task) {
//       setSelectedTask(task);
//       setShowPopup(true);
//     }
//   };

//   const closePopup = () => setShowPopup(false);
//   const markTaskComplete = () => {
//     if (selectedTask) {
//       setSelectedTask({ ...selectedTask, status: true });
//       setEvents((prevEvents) =>
//         prevEvents.map((event) =>
//           event.id === selectedTask.id ? { ...event, status: true } : event
//         )
//       );
//     }
//     closePopup();
//   };

//   return (
//     <>
//       {showPopup && selectedTask && (
//         <EventPopup
//           selectedTask={selectedTask}
//           onClose={closePopup}
//           onComplete={markTaskComplete}
//         />
//       )}
//       <div className="m-4">
//         <CustomCalendar
//           events={events}
//           onEventClick={handleEventClick}
//           loading={loading}
//         />
//       </div>
//     </>
//   );
// };

// export default StaffCalendar;


import { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'tailwindcss/tailwind.css';
import { Modal, Button, Select, DatePicker, Input } from 'antd';
import toast from 'react-hot-toast';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);
const { Option } = Select;

const workingHours = {
  start: moment().set({ hour: 9, minute: 0 }).toDate(),
  end: moment().set({ hour: 17, minute: 0 }).toDate(),
};

const SpaCalendar = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Facial Treatment',
      start: new Date(), 
      end: new Date(moment().add(1, 'hours').toDate()),
      staff: 'Alice',
      services: ['Massage'],
    },
  ]);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newService, setNewService] = useState('');

  const onEventResize = ({ start, end, event }) => {
    if (moment(start).isBefore(moment(), 'day')) {
      toast.error('Không thể dời lịch về ngày quá khứ.');
      return;
    }
    setEvents(events.map((e) => (e.id === event.id ? { ...e, start, end } : e)));
  };

 
const onEventDrop = ({ start, end, event }) => {
  if (moment(start).isBefore(moment(), 'day')) {
    toast.error('Không thể dời lịch về ngày quá khứ.');
    return;
  }
  setEvents(events.map((e) => (e.id === event.id ? { ...e, start, end } : e)));
};

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const handleUpdateEvent = () => {
    setEvents(events.map((e) => (e.id === selectedEvent.id ? { ...selectedEvent } : e)));
    setModalVisible(false);
  };

  const handleAddService = () => {
    setSelectedEvent({ ...selectedEvent, services: [...selectedEvent.services, newService] });
    setNewService('');
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold text-center mb-4">Spa Appointment Calendar</h1>
      <DnDCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        resizable
        onEventDrop={onEventDrop}
        onEventResize={onEventResize}
        selectable
        onSelectEvent={handleSelectEvent}
        views={['month', 'week', 'day']}
        className="bg-white shadow-lg p-4 rounded-md"
      />

      <Modal
        title="Edit Appointment"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleUpdateEvent}
      >
        <div className="mb-4">
          <label className="block text-gray-700">Staff</label>
          <Select
            value={selectedEvent?.staff || ''}
            onChange={(value) => setSelectedEvent({ ...selectedEvent, staff: value })}
            className="w-full"
          >
            <Option value="Alice">Alice</Option>
            <Option value="Bob">Bob</Option>
            <Option value="Charlie">Charlie</Option>
          </Select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Appointment Time</label>
          <DatePicker
            showTime
            value={moment(selectedEvent?.start)}
            onChange={(date) => setSelectedEvent({ ...selectedEvent, start: date.toDate() })}
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Services</label>
          <ul>
            {selectedEvent?.services.map((service, index) => (
              <li key={index} className="text-gray-800">{service}</li>
            ))}
          </ul>
          <div className="flex gap-2 mt-2">
            <Input
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              placeholder="Add new service"
            />
            <Button onClick={handleAddService}>Add</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SpaCalendar;
