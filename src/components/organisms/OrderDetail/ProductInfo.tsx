import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/atoms/ui/table"
import { Badge } from "@/components/atoms/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/ui/card"
import { ShoppingBag, Package, Truck, CheckCircle } from "lucide-react"
import { useTranslation } from "react-i18next"

interface Product {
  productName: string
  images?: string[] 
}

interface OrderDetail {
  orderDetailId: number
  product: Product
  quantity: number
  subTotal: number
  status: string
}

interface Props {
  orderDetails: OrderDetail[]
}

export default function ProductInfo({ orderDetails }: Props) {
  const { t } = useTranslation()

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "shipping":
        return <Truck className="h-3.5 w-3.5 mr-1.5" />
      case "delivered":
      case "completed":
        return <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
      case "processing":
      case "pendingdeposit":
        return <Package className="h-3.5 w-3.5 mr-1.5" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "shipping":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "delivered":
      case "completed":
        return "bg-green-50 text-green-700 border-green-200"
      case "processing":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "pendingdeposit":
        return "bg-amber-50 text-amber-700 border-amber-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <Card className="overflow-hidden border-[1px] shadow-sm">
      <CardHeader className="bg-muted/30 pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="bg-primary/10 p-1.5 rounded-full">
            <ShoppingBag className="h-4 w-4 text-primary" />
          </div>
          {t("products")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-[40%]">{t("products")}</TableHead>
                <TableHead className="text-center">{t("Quantity")}</TableHead>
                <TableHead className="text-right">{t("Price")}</TableHead>
                <TableHead className="text-center">{t("Status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderDetails.map((detail) => (
                <TableRow key={detail.orderDetailId} className="hover:bg-muted/5">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md bg-muted/50 flex items-center justify-center">
                        {detail.product?.images?.[0] ? (
                          <img
                            src={detail.product.images[0]} 
                            alt={detail.product?.productName}
                            className="h-full w-full object-cover rounded-md"
                          />
                        ) : (
                          <Package className="h-5 w-5 text-muted-foreground" /> 
                        )}
                      </div>
                      <span className="font-medium">{detail.product?.productName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 bg-muted/30 rounded-full text-sm font-medium">
                      {detail.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">{detail.subTotal.toLocaleString()} VND</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={`${getStatusColor(detail.status)} inline-flex items-center`}>
                      {getStatusIcon(detail.status)}
                      {t(detail.status)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="p-4 bg-muted/20 border-t flex justify-between items-center">
          <div className="font-medium">
            {t("totalItems")}: {orderDetails.length}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
