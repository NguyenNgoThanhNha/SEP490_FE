export interface OrderDetailItem {
    productId: number
    product: {
      productId: number
      productName: string
    }
    quantity: number
    unitPrice: number
    status: string
  }
  
  export interface Appointment {
    appointmentId: number
    service: {
      name: string
    }
    staffName?: string
    staff?: {
      staffInfo?: {
        fullName: string
      }
    }
    appointmentsTime: string
    appointmentEndTime: string
    status: string
  }
  
  export interface MappedRoutineStep {
    stepId: string | number
    userRoutineId: number
    stepName: string
    description: string
    stepNumber: number
    intervalBeforeNextStep: number
    stepStatus: string
    dueDate: string | null
    feedback: string
    userName: string
    orderId: number
    customer: {
      userId: number
    }
    orderDetailItems: OrderDetailItem[]
    appointments: Appointment[]
  }
  
  export interface OrderDetail {
    result?: {
      data?: {
        orderId: number
        orderDetails: OrderDetailItem[]
        appointments: Appointment[]
      }
    }
  }
  
  export interface UserRoutine {
    result?: {
      data?: {
        userRoutineSteps: any[] | any
        user: {
          userId: number
          fullName: string
        }
      }
    }
  }
  
  export const mapRoutineStepsToOrders = (routineData: any, orderData: any): MappedRoutineStep[] => {
    const userRoutineSteps = Array.isArray(routineData?.result?.data?.userRoutineSteps)
      ? routineData.result.data.userRoutineSteps
      : [routineData.result?.data?.userRoutineSteps]
  
    const orderItems = orderData?.result?.data?.orderDetails || []
    const appointments = orderData?.result?.data?.appointments || []
  
    return userRoutineSteps.map((step: any) => {
      return {
        stepId: step.userRoutineStepId,
        userRoutineId: step.userRoutineId,
        stepName: step.skinCareRoutineStep?.name ?? "No Name",
        description: step.skinCareRoutineStep?.description ?? "",
        stepNumber: step.skinCareRoutineStep?.step ?? 0,
        intervalBeforeNextStep: step.skinCareRoutineStep?.intervalBeforeNextStep ?? 0,
        stepStatus: step.stepStatus ?? "Unknown",
        dueDate: step.endDate ?? null,
        feedback: step.feedback || "",
        userName: routineData?.result?.data?.user?.fullName ?? "Unknown",
        orderId: orderData?.result?.data?.orderId ?? 0,
        customer: {
          userId: routineData?.result?.data?.user?.userId ?? 0,
        },
        orderDetailItems: orderItems,
        appointments: appointments,
      }
    })
  }
  
  export const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }
  
  export const getDaysRemaining = (dueDate: string | null) => {
    if (!dueDate) return null
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }
  