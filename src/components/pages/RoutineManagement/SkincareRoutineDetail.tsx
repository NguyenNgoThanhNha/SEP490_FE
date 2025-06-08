import type { TRoutine } from "@/types/routine.type"
import { Badge } from "@/components/atoms/ui/badge"
import { Clock} from "lucide-react"
import { useTranslation } from "react-i18next"

interface SkincareRoutineDetailProps {
  routine: TRoutine
}

const SkincareRoutineDetail = ({ routine }: SkincareRoutineDetailProps) => {
  const { t } = useTranslation()
  if (!routine) {
    return null
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{routine.name}</h1>
      <div className="mt-2 flex flex-wrap gap-3 items-center">
        <Badge variant="secondary" className="px-3 py-1 text-sm flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {routine.totalSteps} 
        </Badge>
        <Badge variant="secondary" className="px-3 py-1 text-sm flex items-center gap-1">
          {routine.totalPrice?.toLocaleString()} VND
        </Badge>
      </div>
      <p className="mt-4 text-gray-600">{routine.description}</p>
      <div className="mt-4">
        {routine.targetSkinTypes && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Target Skin Types:</span> {routine.targetSkinTypes}
          </p>
        )}
      </div>
    </div>
  )
}

export default SkincareRoutineDetail
