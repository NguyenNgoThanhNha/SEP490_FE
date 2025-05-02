import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/ui/card"
import { Badge } from "@/components/atoms/ui/badge"
import { Separator } from "@/components/atoms/ui/separator"
import { AtSign, MapPin, Phone, User } from "lucide-react"
import { useTranslation } from "react-i18next"

interface Props {
  userName: string
  email: string
  phoneNumber: string
  address: string | null
}

export default function CustomerInfo({ userName, email, phoneNumber, address }: Props) {
  const { t } = useTranslation()

  return (
    <Card className="overflow-hidden border-[1px] shadow-sm">
      <CardHeader className="bg-muted/30 pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="bg-primary/10 p-1.5 rounded-full">
            <User className="h-4 w-4 text-primary" />
          </div>
          {t("customerInfo")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <span className="text-lg font-semibold text-primary">{userName.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <div className="font-medium">{userName || t("noUserNameProvided")}</div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <AtSign className="h-3 w-3" />
              {email || t("noEmailProvided")} 
            </div>
          </div>
        </div>

        <Separator />

        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <div className="bg-muted p-1.5 rounded-full">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <span className="font-medium">{t("phoneNumber")}</span>
            </div>
            <Badge variant="outline" className="font-normal">
              {phoneNumber || t("noPhoneProvided")}
            </Badge>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-sm">
              <div className="bg-muted p-1.5 rounded-full">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <span className="font-medium">{t("address")}</span>
            </div>
            <div className="text-sm text-right max-w-[60%]">{address || t("noAddressProvided")}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
