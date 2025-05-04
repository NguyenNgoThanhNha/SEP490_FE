import CreateServiceMore from "@/components/organisms/CreateOrderMore/CreateAppointmentMore";
import CreateProductMore from "@/components/organisms/CreateOrderMore/CreateProductMore";
import orderService from "@/services/orderService";
import toast from "react-hot-toast";

interface CreateOrderMoreProps {
    branchId: number;
    orderType: "Appointment" | "ProductAndService";
    orderId: number;
    userId: number;
    onSubmit: (success: boolean) => void;
}

const CreateOrderMore: React.FC<CreateOrderMoreProps> = ({ branchId, orderType, orderId, userId, onSubmit }) => {
    const handleServiceSubmit = async (data: {
        staffId: number[];
        branchId: number;
        appointmentsTime: number[];
        status: string;
        notes: "No";
        feedback: string;
        voucherId: number;
        serviceId: number[];
    }) => {
        try {
            const response = await orderService.createAppointmentMore({ ...data, userId }, orderId);
            if (response.success) {
                toast.success("Service added successfully!");
                onSubmit(true);
            } else {
                toast.error("Failed to add service.");
                onSubmit(false);
            }
        } catch {
            toast.error("An error occurred while adding service.");
            onSubmit(false);
        }
    };

    const handleProductSubmit = async (data: {
        productIds: number[];
        quantity: number[];
        branchId: number;
        status: string;
        promotionId: number;
        statusPayment: string;
    }) => {
        try {
            const response = await orderService.CreateProductMore({ ...data, userId }, orderId);
            if (response?.success) {
                toast.success("Product added successfully!");
                onSubmit(true);
            } else {
                toast.error("Failed to add product.");
                onSubmit(false);
            }
        } catch {
            toast.error("An error occurred while adding product.");
            onSubmit(false);
        }
    };

    return (
        <div className="space-y-6">
            {(orderType === "Appointment" || orderType === "ProductAndService") && (
                <CreateServiceMore branchId={branchId} onSubmit={handleServiceSubmit} />
            )}

            {(orderType === "ProductAndService") && (
                <CreateProductMore branchId={branchId} onSubmit={handleProductSubmit} />
            )}
        </div>
    );
};

export default CreateOrderMore;
