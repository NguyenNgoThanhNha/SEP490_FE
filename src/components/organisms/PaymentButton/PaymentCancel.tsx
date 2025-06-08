import { Button } from "@/components/atoms/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/atoms/ui/card"
import { ArrowLeft, XCircle } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

export default function PaymentCancelPage() {
    const navigate = useNavigate()
    const {t} = useTranslation()
    const handleBack = () => {
        navigate(-1)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="flex justify-center mb-2">
                        <XCircle className="h-16 w-16 text-red-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{t('paymentCancelled')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600">{t("yourpaymenthavebeencancelled")}</p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button onClick={handleBack} className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        {t("back")}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
