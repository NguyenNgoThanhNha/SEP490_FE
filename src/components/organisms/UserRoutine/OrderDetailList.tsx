import { Package } from "lucide-react";
import { Badge } from "@/components/atoms/ui/badge";
import { OrderDetailItem } from "@/utils/mapRoutineToOrder";
import { useTranslation } from "react-i18next";
import { formatPrice } from "@/utils/formatPrice";

interface ProductListProps {
  products: OrderDetailItem[];
}

export function ProductList({ products }: ProductListProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <h4 className="font-medium flex items-center gap-2">
        <Package className="h-4 w-4 text-muted-foreground" />
        {t("products")} 
      </h4>
      <div className="grid gap-3">
        {products.map((item) => (
          <div
            key={`order-item-${item.productId}`}
            className="p-4 bg-muted/50 rounded-lg flex justify-between items-center hover:bg-muted transition-colors"
          >
            <div>
              <p className="font-medium">{item.product.productName}</p>
              <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                <span>{t("quantity")}: {item.quantity}</span>
                <span>{t("price")}: {formatPrice(item.unitPrice)} VND</span>
              </div>
            </div>
            <Badge
              variant={item.status === "delivered" ? "default" : "outline"}
              className={`${item.status === "delivered"
                  ? "bg-green-100 text-green-800"
                  : "bg-amber-100 text-amber-800"
                }`}
            >
              {t(`${item.status.toLowerCase()}`)}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
