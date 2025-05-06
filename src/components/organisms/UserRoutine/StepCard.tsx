import { Clock, ChevronDown, ChevronUp, Info, Check, X as Cross } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/atoms/ui/card";
import { Badge } from "@/components/atoms/ui/badge";
import { Button } from "@/components/atoms/ui/button";
import { ProductList } from "./OrderDetailList";
import { AppointmentList } from "./AppointmentList";
import { MappedRoutineStep } from "@/utils/mapRoutineToOrder";
import { useTranslation } from "react-i18next";

interface RoutineStepCardProps {
  step: MappedRoutineStep;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onOpenFeedback: () => void;
  feedback?: string

}

export function RoutineStepCard({ step, isExpanded, onToggleExpand, onOpenFeedback }: RoutineStepCardProps) {
  const { t } = useTranslation();

  return (
    <Card
      className={`overflow-hidden transition-all duration-200 ${
        step.stepStatus === "Completed"
          ? "border-l-4 border-l-green-500"
          : step.stepStatus === "Cancelled"
            ? "border-l-4 border-l-red-500"
            : "border-l-4 border-l-blue-500"
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              {step.stepName}
              <Badge className="ml-2" variant={step.stepStatus === "Completed" ? "default" : "outline"}>
                {t("step")} {step.stepNumber}
              </Badge>
            </CardTitle>
          </div>
          <Badge
            variant={
              step.stepStatus === "Completed"
                ? "success"
                : step.stepStatus === "Cancelled"
                  ? "destructive"
                  : "secondary"
            }
            className={`${
              step.stepStatus === "Completed"
                ? "bg-green-100 text-green-800"
                : step.stepStatus === "Cancelled"
                  ? "bg-red-100 text-red-800"
                  : "bg-amber-100 text-amber-800"
            }`}
          >
            {step.stepStatus === "Completed" && (
              <span className="flex items-center gap-1">
                <Check className="h-3 w-3" /> {t("completed")}
              </span>
            )}
            {step.stepStatus === "Pending" && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {t("pending")}
              </span>
            )}
            {step.stepStatus === "Cancelled" && (
              <span className="flex items-center gap-1">
                <Cross className="h-3 w-3" /> {t("cancelled")}
              </span>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isExpanded && (
            <div className="pt-4 space-y-6 border-t mt-4">
              {step.orderDetailItems.length > 0 && <ProductList products={step.orderDetailItems} />}
              {step.appointments.length > 0 && <AppointmentList appointments={step.appointments} />}

              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  {t("additionalInformation")}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">{t("intervalBeforeNextStep")}</p>
                    <p className="font-medium">
                      {step.intervalBeforeNextStep} {t("day")}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-muted-foreground">{t("feedback")}:</p>
                    <p className="font-medium">{step.feedback || t("nofeedbackprovidedyet")}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button onClick={onToggleExpand} variant="ghost" size="sm" className="flex items-center gap-1">
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4" />
              {t("hideDetails")}
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              {t("showDetails")}
            </>
          )}
        </Button>

        {step.stepStatus === "Completed" && (
          <Button onClick={onOpenFeedback} variant="outline" size="sm" className="ml-auto">
            {step.feedback ? "" : t("addFeedback")}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
