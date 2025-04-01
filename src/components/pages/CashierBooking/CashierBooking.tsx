import { useState } from "react";
import { useNavigate } from "react-router-dom";
import appoinmentService from "@/services/appoinmentService";
import BookingForm from "@/components/organisms/BookingStep/Step1";

interface AppointmentData {
    staffId: number[];
    serviceId: number[];
    branchId: number;
    appointmentsTime: string[];
    notes: string;
    status: string;
    voucherId?: number;
}

const BookingPage: React.FC = () => {
    const [, setOrderId] = useState<number | null>(null);
    const [, setAppointmentData] = useState<AppointmentData | null>(null);
    const navigate = useNavigate();

    const onSubmit = async (data: any) => {
        try {
            const formattedData: AppointmentData = {
                staffId: data.staff ? [Number(data.staff)] : [],
                serviceId: data.service?.map(Number) || [],
                branchId: Number(data.branch),
                appointmentsTime: [`${data.date}T${data.time}`],
                notes: data.notes || "",
                status: "Pending",
                ...(data.voucher ? { voucherId: Number(data.voucher) } : {}),
            };

            const response = await appoinmentService.createAppointment(formattedData);

            if (response?.success && response.result?.data) {
                const orderId = response.result.data;
                setOrderId(orderId);
                setAppointmentData(formattedData);
                navigate("/checkout", { state: { orderId, appointmentData: formattedData } });
            } else {
                alert("Failed to create appointment. Please try again.");
            }
        } catch (error) {
            console.error("Error creating appointment", error);
            alert("An error occurred while booking the appointment.");
        }
    };

    return (
        <div>
            <BookingForm onSubmit={onSubmit} />
        </div>
    );
};

export default BookingPage;
