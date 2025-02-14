import React, { useState } from "react";
import { Form, Select, Button, List, Typography } from "antd";

const { Option } = Select;

interface Booking {
  id: number;
  title: string;
  staff: string;
  services: string[];
  price: number;
}

interface BookingModalProps {
  booking: Booking;
}

const BookingModal: React.FC<BookingModalProps> = ({ booking }) => {
  const [selectedStaff, setSelectedStaff] = useState<string>(booking.staff);
  const [services, setServices] = useState<string[]>(booking.services);
  const [totalPrice, setTotalPrice] = useState<number>(booking.price);

  const availableStaff = ["Nhân viên A", "Nhân viên B", "Nhân viên C"];
  const availableServices = [
    { name: "Massage", price: 300000 },
    { name: "Chăm sóc da", price: 200000 },
    { name: "Gội đầu", price: 100000 },
  ];

  const handleStaffChange = (value: string) => {
    setSelectedStaff(value);
  };

  const handleAddService = (value: string) => {
    const newService = availableServices.find((s) => s.name === value);
    if (newService) {
      setServices([...services, newService.name]);
      setTotalPrice(totalPrice + newService.price);
    }
  };

  return (
    <div>
      <Typography.Title level={4}>{booking.title}</Typography.Title>
      <Form layout="vertical">
        <Form.Item label="Nhân viên">
          <Select value={selectedStaff} onChange={handleStaffChange}>
            {availableStaff.map((staff) => (
              <Option key={staff} value={staff}>
                {staff}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Dịch vụ hiện tại">
          <List
            bordered
            dataSource={services}
            renderItem={(service) => <List.Item>{service}</List.Item>}
          />
        </Form.Item>

        <Form.Item label="Thêm dịch vụ mới">
          <Select placeholder="Chọn dịch vụ" onChange={handleAddService}>
            {availableServices.map((service) => (
              <Option key={service.name} value={service.name}>
                {service.name} - {service.price.toLocaleString()} VND
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Typography.Text strong>Tổng tiền: {totalPrice.toLocaleString()} VND</Typography.Text>

        <Button type="primary" style={{ marginTop: "15px" }}>
          Cập nhật lịch hẹn
        </Button>
      </Form>
    </div>
  );
};

export default BookingModal;
