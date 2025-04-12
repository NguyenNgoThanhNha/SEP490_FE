import { useEffect, useState } from "react";
import { Modal, Button, Form, Select } from "antd";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store";
import toast from "react-hot-toast";
import serviceService from "@/services/serviceService";
import serviceBranchService from "@/services/serviceBranchService";
import { TBranchService } from "@/types/branchService.type";
import { TService } from "@/types/serviceType";

const { Option } = Select;

interface AddServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    branchId: number;
    onServiceAdded: () => void;
}
interface ServiceFormValues {
    ServiceId: number;
    status: string;
    stockQuantity: number;
}

const AddServiceModal: React.FC<AddServiceModalProps> = ({ isOpen, onClose, onServiceAdded }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [availableService, setAvailableServices] = useState<{
        serviceId: number, name: string
    }[]>([]);

    useEffect(() => {
        if (isOpen && 1) {
            fetchAvailableProducts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, 1]);

    const fetchAvailableProducts = async () => {
        try {
            setLoading(true);

            const allServiceResponse = await serviceService.getAllService({ page: 1, pageSize: 100 });

            const serviceBranchResponse = await serviceBranchService.getAllBranchService(1, 1, 100);

            if (allServiceResponse?.success && serviceBranchResponse?.success) {
                const allServices = allServiceResponse.result?.data || [];
                const branchService = serviceBranchResponse.result?.data || [];
                const branchServiceId = new Set(branchService.map((bp: TBranchService) => Number(bp.service.serviceId)));
                const availableService = allServices.filter((ser: TService) => !branchServiceId.has(Number(ser.serviceId)));             
                setAvailableServices(availableService);

            } else {
                toast.error("Failed to fetch service.");
            }
        } catch {
            toast.error("Failed to fetch service.");
        } finally {
            setLoading(false);
        }
    };


    const handleSubmit = async (values: ServiceFormValues) => {
        try {
            setLoading(true);
            const response = await serviceBranchService.createBranchService({
                serviceId: values.ServiceId,
                branchId: 1,
                status: values.status,
            });

            if (response?.success) {
                toast.success("Service added successfully!");
                onClose();
                form.resetFields();
                onServiceAdded()
            } else {
                toast.error(response.result?.message || "Failed to add service.");
            }
        } catch {
            toast.error("Error adding service.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Add service to Branch"
            open={isOpen}
            onCancel={onClose}
            footer={null}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item label="Select service" name="serviceId" rules={[{ required: true }]}>
                    <Select placeholder="Select a service">
                        {availableService.map((service) => (
                            <Option key={service.serviceId} value={service.serviceId}>
                                {service.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item label="Status" name="status" rules={[{ required: true }]}>
                    <Select placeholder="Select status">
                        <Option value="Active">Active</Option>
                        <Option value="Inactive">Inactive</Option>
                    </Select>
                </Form.Item>

                <div className="flex justify-end space-x-2">
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="primary" className="bg-[#516D19]" htmlType="submit" loading={loading}>
                        Add Service
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default AddServiceModal