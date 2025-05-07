import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { Card, Spin } from "antd";
import { CardContent } from "@/components/atoms/ui/card";
import { IRoutineInfo, IRoutineStep } from "@/types/routine.type";
import routineService from "@/services/routineService";
import skincareRoutineService from "@/services/skincareRoutineService";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const RoutineDetailPage = () => {
  const { routineId } = useParams();
  const [routineInfo, setRoutineInfo] = useState<IRoutineInfo | null>(null);
  const [routineSteps, setRoutineSteps] = useState<IRoutineStep[]>([]);
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const routineInfoResponse = await skincareRoutineService.getSkincareRoutineDetail(Number(routineId));
        if (routineInfoResponse.success && routineInfoResponse.result?.data) {
          const routineData = routineInfoResponse.result.data;
          setRoutineInfo({
            skincareRoutineId: routineData.skincareRoutineId,
            name: routineData.name,
            description: routineData.description,
            targetSkinTypes: routineData.targetSkinTypes,
            totalSteps: routineData.totalSteps,
            totalPrice: routineData.totalPrice,
            createdDate: routineData.createdDate || new Date().toISOString(),
            updatedDate: routineData.updatedDate || new Date().toISOString(),
            intervalBeforeNextRoutine: routineData.intervalBeforeNextRoutine || 0,
          });
        } else {
          toast.error(routineInfoResponse.result?.message || "Failed to fetch routine information");
        }

        // Fetch routine steps
        const stepsResponse = await routineService.getRoutineDetail({ routineId: Number(routineId) });
        if (stepsResponse.success && stepsResponse.result?.data) {
          const stepsData: IRoutineStep[] = stepsResponse.result.data.map((step: any) => ({
            id: step.skinCareRoutineStepId,
            name: step.name,
            description: step.description,
            intervalBeforeNextStep: step.intervalBeforeNextStep,
            intervalUnit: "days",
            services: step.serviceRoutineSteps.map((s: any) => ({
              id: s.service.serviceId,
              name: s.service.name,
              description: s.service.description,
              price: s.service.price,
              duration: `${s.service.duration} `,
              images: s.service.images,
            })),
            products: step.productRoutineSteps.map((p: any) => ({
              id: p.product.productId,
              name: p.product.productName,
              brand: p.product.brand,
              description: p.product.productDescription,
              price: p.product.price,
              imageUrl: p.product.images?.[0] || "/placeholder.svg",
            })),
          }));

          setRoutineSteps(stepsData);
          if (stepsData.length > 0) {
            setExpandedSteps({ [stepsData[0].id]: true });
          }
        } else {
          toast.error("Failed to fetch routine steps");
        }
      } catch (error) {
        toast.error("An error occurred while fetching routine details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (routineId) {
      fetchData();
    }
  }, [routineId]);

  const toggleStep = (stepId: number) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spin size="large" tip="Loading routine details..." />
      </div>
    );
  }

  if (!routineInfo) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-600">Routine not found</h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 flex items-center gap-2 mx-auto text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>
        <div className="bg-gradient-to-r from-rose-50 to-teal-50 p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{routineInfo.name}</h1>
          <p className="mt-4 text-gray-600">{routineInfo.description}</p>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              <strong>{t("targetSkinType")}:</strong> {routineInfo.targetSkinTypes}
            </p>
            <p className="text-sm text-gray-500">
              <strong>{t("totalSteps")}:</strong> {routineInfo.totalSteps}
            </p>
            <p className="text-sm text-gray-500">
              <strong>{t("totalPrice")}:</strong> {routineInfo.totalPrice.toLocaleString()} VND
            </p>
          </div>
        </div>
        <div className="p-6 sm:p-8">
          <h2 className="text-xl font-semibold mb-6">{t("routinestep")}</h2>

          {routineSteps.length === 0 ? (
            <div className="text-center py-8 text-gray-500">{t("nostepfound")}</div>
          ) : (
            <div className="space-y-6">
              {routineSteps.map((step, index) => (
                <div key={step.id} className="border rounded-lg overflow-hidden">
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                    onClick={() => toggleStep(step.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                      <h3 className="font-medium text-lg">{step.name}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      {step.intervalBeforeNextStep > 0 && (
                        <span className="text-sm text-gray-500 hidden sm:inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {t("wait")} {step.intervalBeforeNextStep} {step.intervalUnit} {t("beforeNextStep")}
                        </span>
                      )}
                      {expandedSteps[step.id] ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </div>

                  {expandedSteps[step.id] && (
                    <div className="p-4 border-t">
                      <p className="text-gray-600 mb-4">{step.description}</p>
                      {step.services.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-medium text-gray-900 mb-3">{t("service")}</h4>
                          <div className="grid gap-3">
                            {step.services.map((service) => (
                              <Card key={service.id} className="overflow-hidden">
                                <CardContent className="p-3">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h5 className="font-medium">{service.name}</h5>
                                      <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-sm font-medium">{service.price.toLocaleString()} VND</div>
                                      <div className="text-xs text-gray-500 mt-1">{service.duration} phút</div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                      {step.products.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">{t("product")}</h4>
                          <div className="grid gap-3">
                            {step.products.map((product) => (
                              <Card key={product.id} className="overflow-hidden">
                                <CardContent className="p-3">
                                  <div className="flex gap-3">
                                    <img
                                      src={product.imageUrl || "/placeholder.svg"}
                                      alt={product.name}
                                      className="w-16 h-16 object-cover rounded-md"
                                    />
                                    <div className="flex-1">
                                      <div className="flex justify-between">
                                        <div>
                                          <h5 className="font-medium">{product.name}</h5>
                                          <p className="text-xs text-gray-500">{product.brand}</p>
                                        </div>
                                        <div className="text-sm font-medium">{product.price.toLocaleString()} VND</div>
                                      </div>
                                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoutineDetailPage;
