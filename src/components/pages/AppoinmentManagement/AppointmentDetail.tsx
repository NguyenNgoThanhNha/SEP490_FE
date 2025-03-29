import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card, Button, Modal, Input, Badge } from "antd";
import toast from "react-hot-toast";
import appoinmentService from "@/services/appoinmentService";
import chatService from "@/services/chatService";
import { RootState } from "@/store";
import { TAppointment } from "@/types/appoinment.type";
import { ArrowLeft } from "lucide-react";

const statusColors = {
  Pending: "yellow",
  Approved: "green",
  Rejected: "red",
  Completed: "blue",
};

const AppointmentDetailPage = () => {
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState<TAppointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [hasChannel, setHasChannel] = useState(false);
  const navigate = useNavigate();
  const adminId = useSelector((state: RootState) => state.auth.user?.userId);

  useEffect(() => {
    const fetchAppointmentDetail = async () => {
      if (appointmentId) {
        try {
          const response = await appoinmentService.getAppointmentDetail({ appointmentId: Number(appointmentId) });
          if (response.success && response.result) {
            setAppointment(response.result.data);
          } else {
            toast.error("Failed to fetch appointment details");
          }
        } catch {
          toast.error("An error occurred while fetching appointment details");
        }
      }
    };

    const checkChannelExistence = async () => {
      try {
        const response = await chatService.checkExistChannel(Number(appointmentId));
        if (response.success) {
          setHasChannel(true);
        }
      } catch {
        toast.error("Failed to check channel existence");
      }
    };

    if (appointmentId) {
      fetchAppointmentDetail();
      checkChannelExistence();
    }
  }, [appointmentId]);

  const handleCreateHub = async () => {
    if (!adminId) {
      toast.error("Admin chưa đăng nhập!");
      return;
    }

    if (!channelName.trim()) {
      toast.error("Vui lòng nhập tên Chat Hub!");
      return;
    }

    try {
      const response = await chatService.createChannel({
        adminId: Number(adminId),
        channelName,
        appointmentId: Number(appointmentId),
      });

      if (response?.success) {
        const channelId = response.result?.data.id;
        if (channelId) {
          await chatService.addManyMember(channelId);
          const channelResponse = await chatService.getChannels(channelId);
          const channelInfo = channelResponse.data;
          navigate(`/chat/${channelId}`, { state: { channelInfo } });
        }
        toast.success("Chat Hub đã được tạo thành công!");
        setIsModalOpen(false);
        setChannelName("");
        setHasChannel(true);
      } else {
        toast.error(response.result?.message || "Lỗi khi tạo Chat Hub");
      }
    } catch {
      toast.error("Không thể tạo Chat Hub, vui lòng thử lại!");
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="flex items-center mb-6">
        <ArrowLeft className="text-[#516D19] text-2xl cursor-pointer mr-2" onClick={() => navigate(-1)} />
        <h1 className="text-2xl font-bold text-[#516D19]">Chi tiết cuộc hẹn</h1>
      </div>
      {appointment ? (
        <Card className="shadow-md bg-white rounded-xl p-4">
          <div className="flex justify-between items-center">
            <Badge className="font-medium" color={statusColors[appointment.status]} text={appointment.status} />
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900">Thông tin khách hàng</h3>
            <div className="mt-2 text-lg text-gray-600">
              <p><strong>Khách hàng:</strong> {appointment.customer.fullName}</p>
              <p><strong>Email:</strong> {appointment.customer.email}</p>
              <p><strong>SĐT:</strong> {appointment.customer.phoneNumber}</p>
              <p><strong>Địa chỉ:</strong> {appointment.customer.address}</p>
            </div>
          </div>

          <hr className="my-4" />

          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900">Thông tin dịch vụ</h3>
            <div className="mt-2 text-lg text-gray-600">
              <p><strong>Tên:</strong> {appointment.service.name}</p>
              <p><strong>Giá:</strong> {appointment.service.price.toLocaleString()} VND</p>
              <p><strong>Thời gian:</strong> {appointment.service.duration} phút</p>
              <p><strong>Liệu trình:</strong></p>
              <p className="whitespace-pre-line">{appointment.service.steps}</p>
            </div>
          </div>

          <hr className="my-4" />

          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900">Thông tin chi nhánh</h3>
            <div className="mt-2 text-lg text-gray-600">
              <p><strong>Chi nhánh:</strong> {appointment.branch.branchName}</p>
              <p><strong>Địa chỉ:</strong> {appointment.branch.branchAddress}</p>
              <p><strong>SĐT:</strong> {appointment.branch.branchPhone}</p>
            </div>
          </div>

          <hr className="my-4" />

          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900">Thời gian hẹn</h3>
            <p className="mt-2 text-lg text-gray-600">{new Date(appointment.appointmentsTime).toLocaleString()}</p>
          </div>
          {!hasChannel && (
            <Button type="primary" className="mt-4 bg-green-600" onClick={() => setIsModalOpen(true)}>
              Tạo Chat Hub
            </Button>
          )}
        </Card>
      ) : (
        <p className="text-gray-600">Loading...</p>
      )}

      <Modal title="Tạo Chat Hub" open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={handleCreateHub}>
        <Input placeholder="Nhập tên Chat Hub" value={channelName} onChange={(e) => setChannelName(e.target.value)} />
      </Modal>
    </div>
  );
};

export default AppointmentDetailPage;