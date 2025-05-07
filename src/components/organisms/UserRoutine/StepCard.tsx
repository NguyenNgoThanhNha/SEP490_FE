import {
  Clock,
  ChevronDown,
  ChevronUp,
  Info,
  Check,
  X as Cross
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/atoms/ui/card";
import { Badge } from "@/components/atoms/ui/badge";
import { Button } from "@/components/atoms/ui/button";
import { ProductList } from "./OrderDetailList";
import { AppointmentList } from "./AppointmentList";
import { MappedRoutineStep } from "@/utils/mapRoutineToOrder";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FeedbackForm } from "../FeedbackForm/FeedbackForm";
import StepFeedback from "../FeedbackForm/FeedbackList";
import routineService from "@/services/routineService";
import { TUserLogger } from "@/types/userLogger.type";
import { useParams } from "react-router-dom";

interface RoutineStepCardProps {
  step: MappedRoutineStep;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onFeedbackChange: (stepId: number, value: string) => void;
}

export function RoutineStepCard({
  step,
  isExpanded,
  onToggleExpand,
  onFeedbackChange,

}: RoutineStepCardProps) {
  const { t } = useTranslation();
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackData, setFeedbackData] = useState<TUserLogger[] | null>(null);
  const managerId = localStorage.getItem("managerId");
  const { userRoutineId } = useParams();

  const handleToggleFeedback = () => {
    if (step.stepStatus !== "Completed") {
      toast.error("Bạn chỉ có thể đánh giá sau khi bước này hoàn thành");
      return;
    }
    setShowFeedbackForm((prev) => !prev);
  };

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await routineService.getUserRoutineLogger({
          userRoutineId: Number(userRoutineId),
          pageIndex: 1,
          pageSize: 100,
        });

        if (res?.result?.data && Array.isArray(res.result.data)) {
          setFeedbackData(res.result.data);
          console.log("Response Feedback data:", res.result.data);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    if (userRoutineId) {
      fetchFeedback();
    }
  }, [userRoutineId]);

  useEffect(() => {
    console.log("Updated feedbackData:", feedbackData);
  }, [feedbackData]);


  return (
    <Card
      className={`overflow-hidden transition-all duration-200 ${step.stepStatus === "Completed"
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
            className={`${step.stepStatus === "Completed"
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
                  {t("additional_information")}
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
                    {step.stepStatus === "Completed" ? (
                      feedbackData && feedbackData.length > 0 ? (
                        feedbackData.filter(feedback => feedback.stepId === step.stepId).map((feedback, index) => (
                          <StepFeedback key={index} feedback={feedback} />
                        ))
                      ) : (
                        <p>{t("noFeedback")}</p>
                      )
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 items-end pt-0">
        <div className="w-full flex justify-between">
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

          {step.stepStatus === "Completed" && !feedbackData && (
            <Button onClick={handleToggleFeedback} variant="outline" size="sm">
              {showFeedbackForm ? t("hideFeedbackForm") : t("addFeedback")}
            </Button>
          )}
        </div>

        {showFeedbackForm && step.stepStatus === "Completed" && (
          <FeedbackForm
            stepId={Number(step.stepId)}
            feedback={step.feedback || ""}
            userId={step.customer.userId}
            managerId={Number(managerId)}
            onFeedbackChange={(stepId, value) => {
              onFeedbackChange(stepId, value);
            }}
            onSave={() => {
              toast.success(t(`feedbacksuccess`));
              setShowFeedbackForm(false);
            }}
          />
        )}
      </CardFooter>
    </Card>
  );
}
