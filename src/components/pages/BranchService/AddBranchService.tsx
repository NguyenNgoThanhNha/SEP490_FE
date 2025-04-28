import { useEffect, useState } from "react";
import { Modal, Button, Form, Select } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import toast from "react-hot-toast";
import serviceService from "@/services/serviceService";
import serviceBranchService from "@/services/serviceBranchService";
import { TBranchService } from "@/types/branchService.type";
import { TService } from "@/types/serviceType";
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation(); // Hook để sử dụng i18next
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const branchIdRedux = useSelector((state: RootState) => state.branch.branchId);
    const branchId = branchIdRedux || Number(localStorage.getItem("branchId"));
    const [availableService, setAvailableServices] = useState<{
        serviceId: number, name: string
    }[]>([]);

    useEffect(() => {
        if (isOpen) {
            fetchAvailableProducts();
        }
    }, [isOpen]);

    const fetchAvailableProducts = async () => {
        try {
            setLoading(true);

            const allServiceResponse = await serviceService.getAllService({ page: 1, pageSize: 100 });
            const serviceBranchResponse = await serviceBranchService.getAllBranchService(branchId, 1, 100);

            if (allServiceResponse?.success && serviceBranchResponse?.success) {
                const allServices = allServiceResponse.result?.data || [];
                const branchService = serviceBranchResponse.result?.data || [];
                const branchServiceId = new Set(branchService.map((bp: TBranchService) => Number(bp.service.serviceId)));
                const availableService = allServices.filter((ser: TService) => !branchServiceId.has(Number(ser.serviceId)));
                setAvailableServices(availableService);

            } else {
                toast.error(t("fetchServiceError")); // Sử dụng khóa dịch
            }
        } catch {
            toast.error(t("fetchServiceError")); // Sử dụng khóa dịch
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values: ServiceFormValues) => {
        try {
            setLoading(true);
            const response = await serviceBranchService.createBranchService({
                serviceId: values.ServiceId,
                branchId: branchId,
                status: "Active",
            });

            if (response?.success) {
                toast.success(t("serviceAddedSuccess")); // Sử dụng khóa dịch
                onClose();
                form.resetFields();
                onServiceAdded();
            } else {
                toast.error(response.result?.message || t("addServiceError")); // Sử dụng khóa dịch
            }
        } catch {
            toast.error(t("addServiceError")); // Sử dụng khóa dịch
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={t("addServiceToBranch")} // Sử dụng khóa dịch
            open={isOpen}
            onCancel={onClose}
            footer={null}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label={t("selectService")} // Sử dụng khóa dịch
                    name="serviceId"
                    rules={[{ required: true, message: t("selectServiceRequired") }]} // Sử dụng khóa dịch
                >
                    <Select placeholder={t("selectServicePlaceholder")}> {/* Sử dụng khóa dịch */}
                        {availableService.map((service) => (
                            <Option key={service.serviceId} value={service.serviceId}>
                                {service.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <div className="flex justify-end space-x-2">
                    <Button onClick={onClose}>{t("cancel")}</Button> {/* Sử dụng khóa dịch */}
                    <Button type="primary" className="bg-[#516D19]" htmlType="submit" loading={loading}>
                        {t("addService")} {/* Sử dụng khóa dịch */}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default AddServiceModal;