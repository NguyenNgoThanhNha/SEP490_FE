import { Card, CardContent, CardTitle } from "@/components/atoms/ui/card"
import type React from "react"
import { useTranslation } from "react-i18next"

interface RoutineCardProps {
    name: string
    description: string
    totalSteps: number
    targetSkinTypes: string
    totalPrice: number
}
interface Props {
    routine: RoutineCardProps
}
const RoutineInfo: React.FC<Props> = ({ routine }: Props) => {
    const {t} = useTranslation()
  return (
    <Card className="overflow-hidden border-none shadow-md">
      <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-4">
        <CardTitle className="text-white text-xl font-bold">{routine.name}</CardTitle>
      </div>
      <CardContent className="pt-5 pb-4 px-5">
        <div className="space-y-4">
          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground italic">{routine.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 bg-muted/20 p-2 rounded-md">
              <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                <span className="text-teal-700 text-sm font-medium">{routine.totalSteps}</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("totalSteps")}</p>
                <p className="text-sm font-medium">{t("steps")}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-muted/20 p-2 rounded-md">
              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                <span className="text-xs">SKIN</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("targetSkinTypes")}</p>
                <p className="text-sm font-medium">{routine.targetSkinTypes}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center border-t pt-3">
            <p className="text-sm font-medium text-muted-foreground">{t("totalPrice")}</p>
            <p className="text-lg font-bold text-emerald-600">{routine.totalPrice.toLocaleString()} VND</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default RoutineInfo
