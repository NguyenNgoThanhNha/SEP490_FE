import { Button } from "@/components/atoms/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/ui/card"
import TextArea from "antd/es/input/TextArea"
import { MessageSquare } from "lucide-react"

interface FeedbackFormProps {
  stepId: number
  feedback: string
  onFeedbackChange: (stepId: number, value: string) => void
  onSave: (stepId: number) => void
}

export function FeedbackForm({ stepId, feedback, onFeedbackChange, onSave }: FeedbackFormProps) {
  return (
    <Card className="mt-6 border-dashed border-rose-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-rose-600" />
          Phản hồi của bạn
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TextArea
          placeholder="Chia sẻ cảm nhận của bạn về bước này..."
          className="resize-none mb-4"
          rows={4}
          value={feedback}
          onChange={(e) => onFeedbackChange(stepId, e.target.value)}
        />
        <Button onClick={() => onSave(stepId)} className="w-full md:w-auto">
          Lưu phản hồi
        </Button>
      </CardContent>
    </Card>
  )
}
