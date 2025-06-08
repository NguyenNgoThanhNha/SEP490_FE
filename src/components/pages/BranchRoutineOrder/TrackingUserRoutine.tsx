import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import orderService from "@/services/orderService"
import routineService from "@/services/routineService"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/atoms/ui/tabs"
import { MappedRoutineStep, mapRoutineStepsToOrders } from "@/utils/mapRoutineToOrder"
import toast from "react-hot-toast"
import { RoutineSummary } from "@/components/organisms/UserRoutine/RoutineSummary"
import { RoutineStepCard } from "@/components/organisms/UserRoutine/StepCard"
import { useTranslation } from "react-i18next"
import { ArrowLeft } from "lucide-react"


export function RoutineTracker() {
  // const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([])
  // const [userRoutines, setUserRoutines] = useState<UserRoutine[]>([])
  const [mappedSteps, setMappedSteps] = useState<MappedRoutineStep[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm,] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({})
  const { orderId, userRoutineId } = useParams()

  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const orderData = await orderService.getOrderDetail({ orderId: Number(orderId) })
        const routineData = await routineService.trackingUserRoutine(Number(userRoutineId))

        const mapped = mapRoutineStepsToOrders(routineData, orderData)
        console.log("Mapped Steps:", mapped)
        setMappedSteps(mapped)
      } catch {
        toast.error(t("failedtoLoadData"))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [orderId, userRoutineId])

  const toggleExpand = (stepId: string) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }))
  }


  const filteredSteps = mappedSteps.filter((step) => {
    const matchesSearch =
      step.stepName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      step.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      step.orderId.toString().includes(searchTerm)

    if (selectedTab === "all") return matchesSearch
    if (selectedTab === "Completed") return matchesSearch && step.stepStatus === "Completed"
    if (selectedTab === "Pending") return matchesSearch && step.stepStatus === "Pending"

    return matchesSearch
  })

  const completedSteps = mappedSteps.filter((step) => step.stepStatus === "Completed").length
  const totalSteps = mappedSteps.length
  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 cursor-pointer w-fit" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-5 h-5" />
      </div>
      <RoutineSummary
        loading={loading}
        mappedSteps={mappedSteps}
        completedSteps={completedSteps}
        totalSteps={totalSteps}
        progressPercentage={progressPercentage}
      />
      <Tabs defaultValue="all" onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            {t("all")}
          </TabsTrigger>
          <TabsTrigger value="Completed" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
            {t("Completed")}
          </TabsTrigger>
          <TabsTrigger value="Pending" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
            {t("Pending")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">

          <div className="space-y-4">
            {filteredSteps.map((step) => (
             <RoutineStepCard
             key={step.userRoutineId}
             step={step}
             isExpanded={expandedSteps[step.userRoutineId] || false}
             onToggleExpand={() => toggleExpand(String(step.userRoutineId))}
             onFeedbackChange={(stepId, value) => {
               const updatedSteps = mappedSteps.map((s) =>
                 s.userRoutineId === stepId ? { ...s, feedback: value } : s
               );
               setMappedSteps(updatedSteps);
             }}
           />
           
            ))}
          </div>

        </TabsContent>
      </Tabs>


    </div>
  )
}
