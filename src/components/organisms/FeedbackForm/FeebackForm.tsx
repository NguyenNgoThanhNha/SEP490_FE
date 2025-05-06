import { Button } from "@/components/atoms/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/ui/card";
import routineService from "@/services/routineService";
import TextArea from "antd/es/input/TextArea";
import { MessageSquare } from "lucide-react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

interface FeedbackFormProps {
  stepId: number;
  feedback: string;
  managerId: number;
  userId: number;
  onFeedbackChange: (stepId: number, value: string) => void;
  onSave: (stepId: number) => void;
}

export function FeedbackForm({
  stepId,
  feedback,
  managerId,
  onFeedbackChange,
  onSave,
}: FeedbackFormProps) {
  const { t } = useTranslation();

  const handleSaveFeedback = async () => {
    try {
      const payload = {
        stepId,
        managerId,
        actionDate: new Date().toISOString(),
        step_Logger: "Feedback",
        notes: feedback,
      };

      const response = await routineService.createUserRoutineLogger(payload);

      if (response.success) {
        toast.success(t("savedSuccess"));
        onSave(stepId);
      } else {
        toast.error(t("saveError"));
      }
    } catch (error) {
      console.error(error);
      toast.error(t("saveErrorUnexpected"));
    }
  };

  return (
    <Card className="mt-6 border-dashed border-rose-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-rose-600" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TextArea
          placeholder={t("placeholder")} 
          className="resize-none mb-4"
          rows={4}
          value={feedback}
          onChange={(e) => onFeedbackChange(stepId, e.target.value)}
        />
        <Button onClick={handleSaveFeedback} className="w-full md:w-auto">
          {t("saveButton")}
        </Button>
      </CardContent>
    </Card>
  );
}
