import { User, Calendar } from "lucide-react";
import { Badge } from "@/components/atoms/ui/badge";
import { Button } from "@/components/atoms/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/atoms/ui/card";
import { StaffLeave } from "@/components/pages/LeaveManagement/LeaveManagement";
import { useTranslation } from "react-i18next";

interface LeaveRequestCardProps {
    request: StaffLeave;
    onApprove: (id: number) => void;
    onReject: (id: number) => void;
    onViewAppointments: (id: number) => void;
}

export function LeaveRequestCard({ request, onApprove, onReject, onViewAppointments }: LeaveRequestCardProps) {
    const { t } = useTranslation();

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return <Badge className="bg-yellow-100 text-yellow-800">{t("pending")}</Badge>;
            case "approved":
                return <Badge className="bg-green-100 text-green-800">{t("approved")}</Badge>;
            case "rejected":
                return <Badge className="bg-red-100 text-red-800">{t("rejected")}</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <Card className="transition-all hover:shadow-md">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold">{request.staffName}</CardTitle>
                    {getStatusBadge(request.status)}
                </div>
                <CardDescription className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    {request.staffId}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                            {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        <span className="font-medium">{t("reason")}:</span> {request.reason}
                    </p>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                {request.status === "pending" && (
                    <>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className="w-full bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                                onClick={() => onApprove(request.id)}
                            >
                                {t("approve")}
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                                onClick={() => onReject(request.id)}
                            >
                                {t("reject")}
                            </Button>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full hover:bg-slate-50"
                            onClick={() => onViewAppointments(request.id)}
                        >
                            {t("view_affected_appointments")}
                        </Button>
                    </>
                )}
                {request.status !== "pending" && (
                    <Button
                        variant="outline"
                        className="w-full hover:bg-slate-50"
                        onClick={() => onViewAppointments(request.id)}
                    >
                        {t("view_affected_appointments")}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
