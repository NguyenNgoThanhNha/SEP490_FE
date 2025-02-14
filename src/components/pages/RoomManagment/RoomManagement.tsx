import React, { useState } from "react";
import { Button, Modal, Input, Form, Card, Popconfirm, notification } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, CloseOutlined } from "@ant-design/icons";

interface Bed {
  id: number;
  name: string;
  status: "available" | "occupied";
}

interface Room {
  id: number;
  name: string;
  beds: Bed[];
}

const RoomManagement: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: 1,
      name: "Room A",
      beds: [
        { id: 1, name: "Bed 1", status: "available" },
        { id: 2, name: "Bed 2", status: "occupied" },
      ],
    },
    {
      id: 2,
      name: "Room B",
      beds: [{ id: 1, name: "Bed 1", status: "available" }],
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [editMode, setEditMode] = useState(false); 
  const [form] = Form.useForm();

  const openModal = (room: Room | null = null) => {
    setCurrentRoom(room);
    setEditMode(!!room); 
    if (room) {
      form.setFieldsValue(room);
      setBeds(room.beds || []);
    } else {
      form.resetFields();
      setBeds([]);
    }
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then((values: Partial<Room>) => {
      const updatedRoom: Room = {
        ...values,
        beds,
        id: currentRoom ? currentRoom.id : Date.now(),
      } as Room;

      if (currentRoom) {
        // Edit room
        setRooms(rooms.map((room) => (room.id === currentRoom.id ? updatedRoom : room)));
        notification.success({ message: "Room updated successfully!" });
      } else {
        // Add new room
        setRooms([...rooms, updatedRoom]);
        notification.success({ message: "Room added successfully!" });
      }
      setIsModalOpen(false);
      setEditMode(false); // Disable edit mode after saving
    });
  };

  const handleDelete = (id: number) => {
    setRooms(rooms.filter((room) => room.id !== id));
    notification.success({ message: "Room deleted successfully!" });
  };

  const addBed = () => {
    setBeds([
      ...beds,
      { id: Date.now(), name: `Bed ${beds.length + 1}`, status: "available" },
    ]);
  };

  const removeBed = (id: number) => {
    setBeds(beds.filter((bed) => bed.id !== id));
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Spa Rooms</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openModal()}
        >
          Add Room
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <Card
            key={room.id}
            title={room.name}
            actions={[
              <EditOutlined key="edit" onClick={() => openModal(room)} />,
              <Popconfirm
                title="Are you sure you want to delete this room?"
                onConfirm={() => handleDelete(room.id)}
                okText="Yes"
                cancelText="No"
              >
                <DeleteOutlined key="delete" />
              </Popconfirm>,
            ]}
          >
            <div className="grid grid-cols-2 gap-4">
              {room.beds.map((bed) => (
                <div
                  key={bed.id}
                  className={`p-2 rounded shadow ${
                    bed.status === "occupied" ? "bg-red-200" : "bg-green-200"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">🛏 {bed.name}</span>
                    {editMode && currentRoom?.id === room.id && (
                      <CloseOutlined
                        className="text-red-500 cursor-pointer"
                        onClick={() => removeBed(bed.id)}
                      />
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      bed.status === "occupied" ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {bed.status === "occupied" ? "Occupied" : "Available"}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Modal
        title={currentRoom ? "Edit Room" : "Add Room"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => {
          setIsModalOpen(false);
          setEditMode(false); // Disable edit mode if canceling
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Room Name"
            name="name"
            rules={[{ required: true, message: "Please enter room name!" }]}
          >
            <Input placeholder="Enter room name" />
          </Form.Item>
        </Form>
        <div>
          <h3 className="font-bold mb-4">Beds</h3>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {beds.map((bed) => (
              <div
                key={bed.id}
                className="relative flex flex-col items-start p-2 bg-blue-50 rounded shadow"
              >
                <span>🛏 {bed.name}</span>
                <span className="text-sm text-gray-500">
                  Status: {bed.status}
                </span>
                {editMode && (
                  <CloseOutlined
                    className="absolute top-1 right-1 text-red-500 cursor-pointer"
                    onClick={() => removeBed(bed.id)}
                  />
                )}
              </div>
            ))}
          </div>
          {editMode && (
            <Button type="dashed" onClick={addBed} block>
              Add Bed
            </Button>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default RoomManagement;