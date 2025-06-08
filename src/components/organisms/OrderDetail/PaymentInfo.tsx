import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/ui/card"
import { CreditCard, CheckCircle, DollarSign, CreditCardIcon, Truck } from "lucide-react"
import { Badge } from "@/components/atoms/ui/badge"
import { Separator } from "@/components/atoms/ui/separator"
import { useTranslation } from "react-i18next"
import dayjs from "dayjs"

interface Props {
  statusPayment: string
  paymentMethod: string
  totalAmount: number
  orderType?: string
  shipment?: {
    estimatedDeliveryDate: string
    shippingStatus: string
    shippingCost: number
    recipientName?: string
    recipientPhone?: string
    recipientAddress?: string
  }
}

export default function PaymentInfo({ statusPayment, paymentMethod, totalAmount, orderType, shipment }: Props) {
  const { t } = useTranslation()

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "completed":
        return "bg-green-50 text-green-700 border-green-200"
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "failed":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-blue-50 text-blue-700 border-blue-200"
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "credit card":
      case "card":
        return <CreditCardIcon className="h-4 w-4" />
      case "cash":
        return <DollarSign className="h-4 w-4" />
      default:
        return <CreditCardIcon className="h-4 w-4" />
    }
  }

  const isDeliveryOverdue = shipment && dayjs().isAfter(dayjs(shipment.estimatedDeliveryDate))

  const finalTotalAmount = orderType === "Product" && shipment ? totalAmount + shipment.shippingCost : totalAmount

  return (
    <Card className="overflow-hidden border-[1px] shadow-sm">
      <CardHeader className="bg-muted/30 pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="bg-primary/10 p-1.5 rounded-full">
            <CreditCard className="h-4 w-4 text-primary" />
          </div>
          {t("paymentInfo")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-muted-foreground">{t("Status")}</div>
            <Badge
              variant="outline"
              className={`${getStatusColor(statusPayment)} font-medium px-2.5 py-0.5 flex items-center`}
            >
              <CheckCircle className="mr-1.5 h-3 w-3" /> {t(statusPayment)}
            </Badge>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-muted-foreground">{t("method")}</div>
            <div className="flex items-center gap-1.5 bg-muted/40 px-2.5 py-1 rounded-md text-sm">
              {getPaymentMethodIcon(paymentMethod)}
              <span>{t(paymentMethod)}</span>
            </div>
          </div>
        </div>

        {orderType === "Product" && shipment && paymentMethod !== "cash" && (
          <>
            <Separator />
            <div className="p-4">
              <div className="mb-3">
                <div className="flex items-center gap-2 font-medium mb-3">
                  <div className="bg-blue-50 p-1.5 rounded-full">
                    <Truck className="h-4 w-4 text-blue-600" />
                  </div>
                  {t("shippingInfo")}
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-muted-foreground">{t("shippingCost")}</div>
                  <div className="text-sm font-medium">{shipment.shippingCost.toLocaleString()} VND</div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">{t("estimatedDeliveryDate")}</div>
                  <div className="text-sm font-medium">
                    {dayjs(shipment.estimatedDeliveryDate).format("DD/MM/YYYY")}
                  </div>
                </div>

                {isDeliveryOverdue && (
                  <div className="text-sm text-red-600 font-medium mt-2">{t("deliveryOverdueWarning")}</div>
                )}
              </div>
            </div>
          </>
        )}

      

        <Separator />

        <div className="p-4 bg-muted/20">
          {orderType === "Product" && shipment &&  paymentMethod !== 'cash' &&(
            <div className="space-y-2 mb-3">
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">{t("subtotal")}</div>
                <div className="text-sm font-medium">
                  {totalAmount.toLocaleString()} <span className="text-xs">VND</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">{t("shippingCost")}</div>
                <div className="text-sm font-medium">
                  {shipment.shippingCost.toLocaleString()} <span className="text-xs">VND</span>
                </div>
              </div>
              <Separator className="my-2" />
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="font-medium">{t("totalAmount")}</div>
            <div className="text-lg font-bold text-primary">
              {finalTotalAmount.toLocaleString()} <span className="text-sm font-medium">VND</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
