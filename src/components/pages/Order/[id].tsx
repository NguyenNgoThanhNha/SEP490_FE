import { Button } from "@/components/atoms/ui/button"
import AppointmentList from "@/components/organisms/OrderDetail/AppointmentInfo"
import CustomerInfo from "@/components/organisms/OrderDetail/CustomerInfo"
import PaymentInfo from "@/components/organisms/OrderDetail/PaymentInfo"
import ProductInfo from "@/components/organisms/OrderDetail/ProductInfo"
import RoutineInfo from "@/components/organisms/OrderDetail/RoutineInfo"
import CreateOrderMore from "@/components/pages/CreateOrderMore/CreateOrderMore"
import orderService from "@/services/orderService"
import { message, Spin, Modal } from "antd"
import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"

interface Customer {
  userName: string
  email: string
  phoneNumber: string
  address: string | null
  userId?: number
}

interface Product {
  productName: string
}

interface OrderDetail {
  orderDetailId: number
  product: Product
  quantity: number
  unitPrice: number
  subTotal: number
  status: string
}

interface Shipment {
  shippingCarrier: string
  trackingNumber: string
  shippingCost: number
}

interface Appointment {
  appointmentId: number
  service: { name: string }
  staff: {
    staffInfo: {
      userName: string
    }
  }
  appointmentsTime: string
  status: string
}

interface Routine {
  name: string
  description: string
  totalSteps: number
  targetSkinTypes: string
  totalPrice: number
}

interface OrderDetailData {
  orderCode: string
  orderType: string
  customer: Customer
  totalAmount: number
  status: string
  statusPayment: string
  paymentMethod: string
  orderDetails: OrderDetail[]
  appointments: Appointment[]
  shipment: Shipment
  routine?: Routine
  orderId?: number
}

export default function OrderDetailPage() {
  const [orderDetail, setOrderDetail] = useState<OrderDetailData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [showCreateOrderMore, setShowCreateOrderMore] = useState(false)
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await orderService.getOrderDetail({ orderId: Number(orderId) })
        if (response.success && response.result?.data) {
          setOrderDetail(response.result.data)
        } else {
          message.error(t("orderNotFound"))
        }
      } catch {
        message.error(t("orderDetailError"))
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetail()
  }, [orderId])




  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin tip={t("findingOrder")} />
      </div>
    )
  }

  if (!orderDetail) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>{t("orderNotFound")}</p>
      </div>
    )
  }

  const { orderType, customer, totalAmount, statusPayment, orderDetails, appointments, routine } = orderDetail
  const userId = customer?.userId

  const handleBack = () => {
    navigate(-1)
  }



  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
        </Button>
        <Button onClick={() => setShowCreateOrderMore(true)} className="bg-[#516d19] rounded-full text-white">
          {t("createOrderMore")}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <CustomerInfo {...customer} />
        <PaymentInfo
          statusPayment={statusPayment}
          paymentMethod={orderDetail.paymentMethod}
          totalAmount={totalAmount}
        />
      </div>
      {orderType === "Routine" && routine && <RoutineInfo routine={routine} />}
      {(orderType === "Product" || orderType === "ProductAndService" || orderType === "Routine") && (
        <div>
          <ProductInfo orderDetails={orderDetails} />
        </div>
      )}

      {(orderType === "Appointment" || orderType === "ProductAndService" || orderType === "Routine") && (
        <AppointmentList appointments={appointments} />
      )}
      <Modal
        title={t("createOrderMore")}
        open={showCreateOrderMore}
        onCancel={() => setShowCreateOrderMore(false)}
        footer={null}
        width={800}
      >
        <CreateOrderMore
          branchId={1}
          orderType={orderType === "Appointment" ? "Service" : "ProductAndService"}
          orderId={Number(orderDetail.orderId)}
          userId={Number(userId)}
          onSubmit={(success) => {
            if (success) {
              message.success(t("createdSubOrder"))
              setShowCreateOrderMore(false)
            } else {
              message.error(t("createOrderMoreError"))
            }
          }}
        />
      </Modal>
    </div>
  )
}
