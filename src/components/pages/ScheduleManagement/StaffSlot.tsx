import { Tooltip } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

interface EmployeeSlotProps {
  staffName: string;
  status: "Active" | "Inactive";
}

const EmployeeSlot: React.FC<EmployeeSlotProps> = ({ staffName, status }) => {
  const statusColor = status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
  const statusIcon = status === "Active" ? <CheckCircleOutlined className="text-green-500" /> : <CloseCircleOutlined className="text-red-500" />;

  return (
    <div className="mb-2 flex items-center gap-2">
      <div className="font-bold">{staffName}</div>
      <Tooltip title={status === "Active" ? "Nhân viên đang hoạt động" : "Nhân viên không hoạt động"}>
        <span className={`px-2 py-1 text-xs font-normal rounded flex items-center gap-1 ${statusColor}`}>
          {statusIcon}
          {status}
        </span>
      </Tooltip>
    </div>
  );
};

export default EmployeeSlot;