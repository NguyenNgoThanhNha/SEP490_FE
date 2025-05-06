import { useTranslation } from "react-i18next";
import { RoutineTracker } from "./TrackingUserRoutine";

export default function BranchOrderRoutineDetail() {
  const {t} = useTranslation()
  return (
    <main className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">{t('userroutinetracking')}</h1>
      <RoutineTracker />
    </main>
  )
}
