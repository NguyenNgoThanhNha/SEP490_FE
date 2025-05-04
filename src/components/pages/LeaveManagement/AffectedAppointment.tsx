import { Button } from "@/components/atoms/ui/button";
import { Card, CardContent } from "@/components/atoms/ui/card";
import { Calendar, Clock, User, UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Appointment {
  appointmentId: number;
  customer: {
    fullName: string;
    phoneNumber: string;
    email: string;
  };
  service: {
    name: string;
    price: number;
    duration: string;
  };
  appointmentsTime: string;
  appointmentEndTime: string;
  status: string;
  unitPrice: number;
  subTotal: number;
}

interface AffectedAppointmentsModalProps {
  appointments: Appointment[];
  request: {
    staffName: string;
    startDate: string;
    endDate: string;
  };
  onClose: () => void;
  onReplaceStaff: (appointment: Appointment) => void;
}

export function AffectedAppointmentsModal({
  appointments,
  request,
  onClose,
  onReplaceStaff,
}: AffectedAppointmentsModalProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{t("staffAppointments")}</h2>
          <Button variant="outline" size="sm" onClick={onClose}>
            {t("close")}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
        {t("staffLeave")} {request.staffName} {t("date")}{" "}
          {new Date(request.startDate).toLocaleDateString()}

        </p>
        <div className="max-h-[60vh] overflow-y-auto pr-4">
          {appointments.length === 0 ? (
            <div className="text-center text-gray-500">{t("noAppointments")}</div>
          ) : (
            <div className="space-y-3">
              {appointments.map((appointment) => (
                <Card key={appointment.appointmentId} className="border border-muted">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {new Date(appointment.appointmentsTime).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {new Date(appointment.appointmentsTime).toLocaleTimeString()} -{" "}
                            {new Date(appointment.appointmentEndTime).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{appointment.customer.fullName}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {t("service")}: {appointment.service.name} ({appointment.service.duration} {t("minutes")})
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {t("price")}: {appointment.unitPrice.toLocaleString()} VND
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => onReplaceStaff(appointment)}
                      >
                        <UserPlus className="h-4 w-4" />
                        <span>{t("replaceStaff")}</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
