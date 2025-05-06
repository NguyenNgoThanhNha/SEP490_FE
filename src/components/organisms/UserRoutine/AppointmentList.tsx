import { Calendar } from "lucide-react";
import { Badge } from "@/components/atoms/ui/badge";
import { Appointment } from "@/utils/mapRoutineToOrder";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/utils/formatDate";

interface AppointmentListProps {
  appointments: Appointment[];
}

export function AppointmentList({ appointments }: AppointmentListProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <h4 className="font-medium flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        {t("title")} {/* "Appointments" */}
      </h4>
      <div className="grid gap-3">
        {appointments.map((appointment) => (
          <div
            key={`appointment-${appointment.appointmentId}`}
            className="p-4 bg-muted/50 rounded-lg flex justify-between items-center hover:bg-muted transition-colors"
          >
            <div>
              <p className="font-medium">{appointment.service.name}</p>
              <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-muted-foreground mt-1">
                <span>
                  {t("time")}:{" "}
                 {formatDate((appointment.appointmentsTime))}
                </span>
                <span>
                  {t("staff")}:{" "}
                  {appointment.staffName || appointment.staff?.staffInfo?.fullName || t("unknown")}
                </span>
              </div>
            </div>
            <Badge
              variant={appointment.status === "Completed" ? "default" : "outline"}
              className={`${appointment.status === "Completed" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                }`}
            >
              {t(`${appointment.status.toLowerCase()}`)}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
