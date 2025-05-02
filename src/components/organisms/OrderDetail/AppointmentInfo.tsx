import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/atoms/ui/table"
import { Badge } from "@/components/atoms/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/ui/card"
import { Calendar, Clock, User, CheckCircle, AlertCircle, Clock3 } from "lucide-react"
import dayjs from "dayjs"
import { useTranslation } from "react-i18next"

interface Appointment {
  appointmentId: number
  service: { name: string }
  staff: { staffInfo: { userName: string } }
  appointmentsTime: string
  status: string
}

interface Props {
  appointments: Appointment[]
  title?: string
}

export default function AppointmentList({ appointments, title = "Appointment" }: Props) {
  const { t } = useTranslation()

  const getStatusInfo = (status: string) => {
    const statusLower = status.toLowerCase().replace(/\s+/g, "")

    switch (statusLower) {
      case "completed":
        return {
          color: "bg-green-50 text-green-700 border-green-200",
          icon: <CheckCircle className="h-3.5 w-3.5 mr-1.5" />,
        }
      case "pending":
      case "pendingdeposit":
        return {
          color: "bg-amber-50 text-amber-700 border-amber-200",
          icon: <Clock3 className="h-3.5 w-3.5 mr-1.5" />,
        }
      case "cancelled":
        return {
          color: "bg-red-50 text-red-700 border-red-200",
          icon: <AlertCircle className="h-3.5 w-3.5 mr-1.5" />,
        }
      case "scheduled":
        return {
          color: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <Calendar className="h-3.5 w-3.5 mr-1.5" />,
        }
      default:
        return {
          color: "bg-gray-50 text-gray-700 border-gray-200",
          icon: <Clock className="h-3.5 w-3.5 mr-1.5" />,
        }
    }
  }

  const formatAppointmentDate = (dateString: string) => {
    const date = dayjs(dateString)
    const today = dayjs().startOf("day")

    if (date.isSame(today, "day")) {
      return `${t("today")}, ${date.format("HH:mm")}`
    } else {
      return date.format("HH:mm, DD MMM YYYY")
    }
  }

  return (
    <Card className="overflow-hidden border-[1px] shadow-sm">
      <CardHeader className="bg-muted/30 pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="bg-primary/10 p-1.5 rounded-full">
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          {t(title)}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-[35%]">{t("Service")}</TableHead>
                <TableHead>{t("StaffName")}</TableHead>
                <TableHead>{t("appointmentTime")}</TableHead>
                <TableHead className="text-center">{t("Status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.length > 0 ? (
                appointments.map((appointment) => {
                  const { color, icon } = getStatusInfo(appointment.status)
                  return (
                    <TableRow key={appointment.appointmentId} className="hover:bg-muted/5">
                      <TableCell className="py-3 font-medium">{appointment.service?.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-muted/50 flex items-center justify-center">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                          {appointment.staff?.staffInfo?.userName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{formatAppointmentDate(appointment.appointmentsTime)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={`${color} inline-flex items-center`}>
                          {icon}
                          {t(appointment.status.replace(" ", "_"))}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    {t("noAppointmentsFound")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
