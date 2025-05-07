import { Button } from "@/components/atoms/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/ui/card"
import { Input } from "@/components/atoms/ui/input"
import routineService from "@/services/routineService"
import type { TUserLogger } from "@/types/userLogger.type"
import { Avatar } from "antd"
import { MessageSquare, Send } from "lucide-react"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { useTranslation } from "react-i18next"

interface FeedbackMessage {
  id: number
  username: string
  message: string
  timestamp: string
  isManager?: boolean
}

interface FeedbackFormProps {
  stepId: number
  feedback: string
  managerId: number
  feedbackHistory: FeedbackMessage[]
  onFeedbackChange: (stepId: number, value: string) => void
  onSave: (stepId: number) => void
  onFeedbackSubmit: (newFeedback: TUserLogger) => void
}

export function FeedbackForm({
  stepId,
  feedback,
  managerId,
  feedbackHistory = [],
  onSave,
  onFeedbackSubmit,
}: FeedbackFormProps) {
  const { t } = useTranslation()
  const [stepLogger, setStepLogger] = useState("")

  const handleSaveFeedback = async () => {
    if (!stepLogger.trim()) return

    try {
      const payload = {
        stepId,
        managerId,
        actionDate: new Date().toISOString(),
        step_Logger: stepLogger,
        notes: feedback,
      }

      const response = await routineService.createUserRoutineLogger(payload)

      if (response.success) {
        toast.success(t("savedSuccess"))
        onFeedbackSubmit(response.result?.data)
        onSave(stepId)
        setStepLogger("") 
      } else {
        toast.error(t("saveError"))
      }
    } catch (error) {
      console.error(error)
      toast.error(t("saveErrorUnexpected"))
    }
  }

  const groupedMessages = feedbackHistory.reduce(
    (groups, message) => {
      const date = new Date(message.timestamp).toLocaleDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
      return groups
    },
    {} as Record<string, FeedbackMessage[]>,
  )

  return (
    <Card className="mt-6 border-rose-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-rose-600" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
          {Object.entries(groupedMessages).map(([date, messages]) => (
            <div key={date} className="mb-4">
              <div className="text-xs text-center text-muted-foreground my-2">{date}</div>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 mb-4 ${msg.isManager ? "justify-end" : "justify-start"}`}
                >
                  {!msg.isManager && (
                    <Avatar className="h-8 w-8">
                    {msg.username.substring(0, 2).toUpperCase()}
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.isManager
                        ? "bg-rose-100 text-rose-900 rounded-tr-none"
                        : "bg-gray-100 text-gray-900 rounded-tl-none"
                    }`}
                  >
                    <div className="font-semibold text-xs mb-1">{msg.username}</div>
                    <div>{msg.message}</div>
                    <div className="text-xs text-right mt-1 opacity-70">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  {msg.isManager && (
                    <Avatar className="h-8 w-8">
                      {msg.username.substring(0, 2).toUpperCase()}
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          ))}
        
        <div className="p-4 border-t flex items-center gap-2">
          <Input
            placeholder={t("placeholder")}
            className="flex-1"
            value={stepLogger}
            onChange={(e) => setStepLogger(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSaveFeedback()
              }
            }}
          />
          <Button
            onClick={handleSaveFeedback}
            size="icon"
            className="bg-rose-600 hover:bg-rose-700"
            disabled={!stepLogger.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
