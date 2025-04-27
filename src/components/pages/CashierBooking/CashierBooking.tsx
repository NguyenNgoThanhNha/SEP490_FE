import { useState } from "react";
import { useNavigate } from "react-router-dom";
import appoinmentService from "@/services/appoinmentService";
import BookingForm from "@/components/organisms/BookingStep/Step1";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next"; // Import hook i18next

interface AppointmentData {
    userId: number;
    staffId: number[];
    serviceId: number[];
    branchId: number;
    appointmentsTime: string;
    notes: string;
    status: string;
    voucherId?: number;
}

const BookingPage: React.FC = () => {
    const { t } = useTranslation(); // Hook để sử dụng i18next
    const [, setOrderId] = useState<number | null>(null);
    const [, setAppointmentData] = useState<AppointmentData | null>(null);
    const navigate = useNavigate();

    const onSubmit = async (data: AppointmentData) => {
        try {
            const response = await appoinmentService.createAppointment(data);

            if (response?.success && response.result?.data) {
                const orderId = response.result.data;
                setOrderId(orderId);
                setAppointmentData(data);
                navigate("/checkout", { state: { orderId } });
                toast.success(t("appointmentCreated")); // Sử dụng khóa dịch
            } else {
                toast.error(t("appointmentCreationFailed")); // Sử dụng khóa dịch
            }
        } catch (error) {
            console.error("Error creating appointment", error);
            toast.error(t("appointmentCreationError")); // Sử dụng khóa dịch
        }
    };

    return (
        <div>
            <BookingForm onSubmit={onSubmit} />
        </div>
    );
};

export default BookingPage;
