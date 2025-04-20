import { useState, useEffect } from "react";
import { Table, Modal, Select } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(weekOfYear);
import { TSlotWorking } from "@/types/staff-calendar.type";
import staffService from "@/services/staffService";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import EmployeeSlot from "./StaffSlot";
import { useNavigate } from "react-router-dom";

dayjs.locale("vi");

const { Option } = Select;

const daysOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

const generateWeekDates = (year: number, weekNumber: number): dayjs.Dayjs[] => {
  const startOfYear = dayjs(`${year}-01-01`);
  const base = startOfYear.add((weekNumber - 1) * 7, "day");
  const monday = base.day() === 0 ? base.subtract(6, "day") : base.startOf("week").add(1, "day");

  return Array.from({ length: 7 }, (_, i) => monday.add(i, "day"));
};

const getShiftColor = (shiftName: string) => {
  switch (shiftName) {
    case "Ca sáng":
      return "bg-blue-100";
    case "Ca chiều":
      return "bg-yellow-100";
    case "Ca tối":
      return "bg-purple-100";
    default:
      return "bg-gray-100";
  }
};

const WeeklySchedule = () => {
  const [selectedYear, setSelectedYear] = useState<number>(dayjs().year());
  const [selectedWeek, setSelectedWeek] = useState<number>(dayjs().week());
  const [selectedEvent, setSelectedEvent] = useState<{ employees: string[] } | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [scheduleData, setScheduleData] = useState<TSlotWorking[]>([]);
  const branchIdRedux = useSelector((state: RootState) => state.branch.branchId);
  const branchId = branchIdRedux || Number(localStorage.getItem("branchId"));
  const weekDates = generateWeekDates(selectedYear, selectedWeek);
  const selectedMonth = weekDates[0].month() + 1;
  const [shifts, setShifts] = useState<{ shiftName: string; startTime: string; endTime: string }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShifts = async () => {
      const response = await staffService.getListShift();
      if (response.success) {
        setShifts(response.result?.data || []);
      }
    };
    fetchShifts();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await staffService.staffWorkingSlot(branchId, selectedMonth, selectedYear);
      if (response.success) {
        setScheduleData(response.result?.data);
      }
    };
    fetchData();
  }, [branchId, selectedWeek, selectedYear]);

  const today = dayjs().format("DD/MM");

  const dataSource = shifts.map((shift) => {
    const row: any = { key: shift.shiftName, shift: `${shift.shiftName} (${shift.startTime} - ${shift.endTime})` };
    weekDates.forEach((date) => {
      const dateStr = date.format("YYYY-MM-DD");
      const employees: string[] = [];

      scheduleData.forEach((staff) => {
        staff.slots.forEach((slot) => {
          if (
            slot.shiftName === shift.shiftName &&
            dayjs(slot.workDate).format("YYYY-MM-DD") === dateStr
          ) {
            employees.push(`${staff.staffName}`);
          }
        });
      });

      row[date.format("DD/MM")] = { employees };
    });
    return row;
  });

  const columns = [
    {
      title: "",
      dataIndex: "shift",
      key: "shift",
      fixed: "left",
      width: 120,
      render: (text: string, record: { shift: string }) => (
        <div
          className={`p-2 text-center font-bold text-gray-800 rounded ${getShiftColor(record.shift.split(" ")[0])}`}
        >
          {text}
        </div>
      ),
    },
    ...weekDates.map((date, index) => {
      const isToday = date.format("DD/MM") === today;

      return {
        title: (
          <div>
            <div>{daysOfWeek[index]}</div>
            <div className={isToday ? "text-[#516d19] font-bold" : ""}>{date.format("DD/MM")}</div>
          </div>
        ),
        dataIndex: date.format("DD/MM"),
        key: date.format("DD/MM"),
        render: (record: { employees: string[] }) => {
          const employeesForDay = record.employees.length
            ? record.employees
            : ["Không có nhân viên"];

          return (
            <div
              onClick={() => {
                setSelectedEvent(record);
                setIsModalVisible(true);
              }}
              className={`cursor-pointer p-4 rounded border ${isToday ? "bg-green-50 border-green-300" : "bg-white border-gray-300"
                } hover:bg-gray-100`}
            >
              {employeesForDay.map((emp, index) => {
                const staff = scheduleData.find((staff) => staff.staffName === emp);
                const slot = staff?.slots.find((slot) => slot.status);
                const status: "Active" | "Inactive" = slot?.status === "Active" || slot?.status === "Inactive" ? slot.status : "Inactive";
                return (
                  <EmployeeSlot
                    key={index}
                    staffName={emp}
                    status={status}
                  />
                );
              })}
            </div>
          );
        },
      };
    }),
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
        <div className="flex gap-4">
          <Select value={selectedWeek} onChange={setSelectedWeek} style={{ width: 150 }}>
            {Array.from({ length: 52 }, (_, i) => {
              const weekStart = generateWeekDates(selectedYear, i + 1)[0];
              const weekEnd = generateWeekDates(selectedYear, i + 1)[5];
              return (
                <Option key={i + 1} value={i + 1}>
                  Tuần {i + 1} ({weekStart.format("DD/MM")} - {weekEnd.format("DD/MM")})
                </Option>
              );
            })}
          </Select>
          <Select value={selectedYear} onChange={setSelectedYear} style={{ width: 100 }}>
            {[2024, 2025, 2026].map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </Select>
        </div>

        <button
          onClick={() => navigate("/leave-schedule")}
          className="px-4 py-2 bg-[#516d19] text-white font-semibold rounded hover:bg-green-800"
        >
          Lịch nghỉ của nhân viên
        </button>
      </div>

      <div className="overflow-x-auto">
        <Table size="small" columns={columns} dataSource={dataSource} pagination={false} bordered />
      </div>

      <Modal
        title="Chi tiết lịch làm việc"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {selectedEvent && (
          <div className="p-4 border rounded bg-gray-50">
            <ul className="space-y-2">
              {selectedEvent.employees.map((emp, index) => {
                const [staffName] = emp.split(" (");
                return (
                  <li key={index} className="flex items-center gap-2">
                    <EmployeeSlot staffName={staffName} status={status} />
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default WeeklySchedule;
