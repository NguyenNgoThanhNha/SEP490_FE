import {MappedRoutineStep } from "@/utils/mapRoutineToOrder"
import { Avatar} from "antd"
import { User} from "lucide-react"
import { useTranslation } from "react-i18next"


interface RoutineSummaryProps {
  loading: boolean
  mappedSteps: MappedRoutineStep[]
  completedSteps: number
  totalSteps: number
  progressPercentage: number
}

export function RoutineSummary({
  mappedSteps,
}: RoutineSummaryProps) 
{
  const { t } = useTranslation()
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            {t('customer')}
          </h2>
         
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border">
               
                  {mappedSteps[0]?.userName?.substring(0, 2) || "UN"}
               
              </Avatar>
              <div>
                <p className="font-medium">{mappedSteps[0]?.userName || "Unknown"}</p>
                <p className="text-sm text-muted-foreground">{t("Order")} #{mappedSteps[0]?.orderId || "N/A"}</p>
              </div>
            </div>
        
        </div>


      </div>
    </div>
  )
}
