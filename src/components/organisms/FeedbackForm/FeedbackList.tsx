import { TUserLogger } from "@/types/userLogger.type";
import { Separator } from "@/components/atoms/ui/separator";
import { formatDate } from "@/utils/formatDate";

export default function StepFeedback({ feedback }: { feedback: TUserLogger }) {
  const actor = feedback.manager || feedback.user;
    
  return (
    <div className="w-full max-w-3xl mx-auto p-4 border rounded-xl shadow-sm bg-white mb-4">
      <div className="mb-2">
        <h2 className="text-lg font-semibold text-gray-800">Phản hồi bước chăm sóc</h2>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div>
          <p className="font-medium text-gray-700">{actor?.userName || "Không xác định"}</p>
        </div>
      </div>

      <Separator className="my-3" />

      <div className="space-y-4 text-gray-700">
        <div>
          <h3 className="text-sm font-semibold text-gray-600">Đánh giá</h3>
          <p className="mt-1">{feedback.step_Logger}</p>
        </div>

        {feedback.notes && feedback.notes !== "string" && (
          <div>
            <h3 className="text-sm font-semibold text-gray-600">Ghi chú</h3>
            <p className="mt-1">{feedback.notes}</p>
          </div>
        )}
      </div>

      <div className="w-full mt-4 text-sm text-gray-500 flex justify-between">
        <span>Ngày đánh giá: {formatDate(feedback.actionDate)}</span>
      </div>
    </div>
  );
}
