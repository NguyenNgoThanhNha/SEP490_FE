import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/ui/card"
import { CreditCard, CheckCircle, DollarSign, CreditCardIcon } from "lucide-react"
import { Badge } from "@/components/atoms/ui/badge"
import { Separator } from "@/components/atoms/ui/separator"
import { useTranslation } from "react-i18next"

interface Props {
  statusPayment: string
  paymentMethod: string
  totalAmount: number
}

export default function PaymentInfo({ statusPayment, paymentMethod, totalAmount }: Props) {
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
              <span>{paymentMethod}</span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="p-4 bg-muted/20">
          <div className="flex justify-between items-center">
            <div className="font-medium">{t("totalAmount")}</div>
            <div className="text-lg font-bold text-primary">
              {totalAmount?.toLocaleString()} <span className="text-sm font-medium">VND</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
