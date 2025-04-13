import { Button } from "@/components/atoms/ui/button";
import { Card, CardContent } from "@/components/atoms/ui/card";
import { Input } from "@/components/atoms/ui/input";
import React, { useState } from "react";

interface Product {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
  products: Product[];
}

interface StepService {
  serviceId: string;
  productIds: string[];
}

interface Step {
  name: string;
  services: StepService[];
  saved: boolean;
  collapsed: boolean;
}

interface SkincareRoutine {
  name: string;
  description: string;
  frequency: string;
  targetSkinTypes: string;
  totalPrice: number;
  steps: Step[];
}

const allServices: Service[] = [
  {
    id: "cleansing",
    name: "Cleansing",
    products: [
      { id: "p1", name: "Gentle Cleanser" },
      { id: "p2", name: "Deep Clean Foam" },
    ],
  },
  {
    id: "mask",
    name: "Facial Mask",
    products: [
      { id: "p3", name: "Clay Mask" },
      { id: "p4", name: "Hydrating Mask" },
    ],
  },
  {
    id: "moisturizer",
    name: "Moisturizer",
    products: [
      { id: "p5", name: "Light Moisturizer" },
      { id: "p6", name: "Rich Cream" },
    ],
  },
];

const RoutineForm: React.FC = () => {
  const [routine, setRoutine] = useState<SkincareRoutine>({
    name: "",
    description: "",
    frequency: "",
    targetSkinTypes: "",
    totalPrice: 0,
    steps: [],
  });

  const [selectedProducts, setSelectedProducts] = useState<Record<string, string>>({});

  const handleRoutineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRoutine({ ...routine, [name]: name === "totalPrice" ? parseFloat(value) || 0 : value });
  };

  const addStep = () => {
    setRoutine({
      ...routine,
      steps: [...routine.steps, { name: `Step ${routine.steps.length + 1}`, services: [], saved: false, collapsed: false }],
    });
  };

  const addServiceToStep = (stepIndex: number) => {
    const updatedSteps = [...routine.steps];
    updatedSteps[stepIndex].services.push({ serviceId: "", productIds: [] });
    updatedSteps[stepIndex].saved = false;
    setRoutine({ ...routine, steps: updatedSteps });
  };

  const updateStepService = (stepIndex: number, serviceIndex: number, value: string) => {
    const updatedSteps = [...routine.steps];
    updatedSteps[stepIndex].services[serviceIndex].serviceId = value;
    updatedSteps[stepIndex].services[serviceIndex].productIds = [];
    updatedSteps[stepIndex].saved = false;
    setRoutine({ ...routine, steps: updatedSteps });
  };

  const addProductToService = (stepIndex: number, serviceIndex: number) => {
    const updatedSteps = [...routine.steps];
    const service = updatedSteps[stepIndex].services[serviceIndex];
    const productId = selectedProducts[`${stepIndex}-${serviceIndex}`];
    if (productId && !service.productIds.includes(productId)) {
      service.productIds.push(productId);
    }
    updatedSteps[stepIndex].saved = false;
    setRoutine({ ...routine, steps: updatedSteps });
    setSelectedProducts({ ...selectedProducts, [`${stepIndex}-${serviceIndex}`]: "" });
  };

  const removeProductFromService = (stepIndex: number, serviceIndex: number, productId: string) => {
    const updatedSteps = [...routine.steps];
    updatedSteps[stepIndex].services[serviceIndex].productIds =
      updatedSteps[stepIndex].services[serviceIndex].productIds.filter((id) => id !== productId);
    updatedSteps[stepIndex].saved = false;
    setRoutine({ ...routine, steps: updatedSteps });
  };

  const toggleCollapseStep = (stepIndex: number) => {
    const updatedSteps = [...routine.steps];
    updatedSteps[stepIndex].collapsed = !updatedSteps[stepIndex].collapsed;
    setRoutine({ ...routine, steps: updatedSteps });
  };

  const saveStep = (stepIndex: number) => {
    const updatedSteps = [...routine.steps];
    updatedSteps[stepIndex].saved = true;
    setRoutine({ ...routine, steps: updatedSteps });
  };

  const saveRoutine = () => {
    console.log("Routine saved:", routine);
    alert("Routine saved! Check console log.");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Create Skincare Package</h1>
      <Card>
        <CardContent className="space-y-4 p-4">
          <Input name="name" placeholder="Routine Name" onChange={handleRoutineChange} />
          <Input name="description" placeholder="Description" onChange={handleRoutineChange} />
          <Input name="frequency" placeholder="Frequency" onChange={handleRoutineChange} />
          <Input name="targetSkinTypes" placeholder="Target Skin Types" onChange={handleRoutineChange} />
          <Input name="totalPrice" type="number" placeholder="Total Price" onChange={handleRoutineChange} />
        </CardContent>
      </Card>

      {routine.steps.map((step, stepIndex) => (
        <Card key={stepIndex} className="border border-blue-300">
          <CardContent className="space-y-4 p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{step.name}</h2>
              <Button className="bg-[#516d19] text-white" variant="ghost" onClick={() => toggleCollapseStep(stepIndex)}>
                {step.collapsed ? "▶ " : "▼ "}
              </Button>
            </div>

            {!step.collapsed && (
              <>
                {step.services.map((svc, svcIndex) => {
                  const selectedService = allServices.find((s) => s.id === svc.serviceId);
                  return (
                    <div key={svcIndex} className="border p-3 rounded-lg space-y-2">
                      <select
                        className="w-full border p-2 rounded"
                        value={svc.serviceId}
                        onChange={(e) => updateStepService(stepIndex, svcIndex, e.target.value)}
                      >
                        <option value="">-- Select a Service --</option>
                        {allServices.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>

                      {selectedService && (
                        <div className="flex gap-2">
                          <select
                            className="flex-1 border p-2 rounded"
                            value={selectedProducts[`${stepIndex}-${svcIndex}`] || ""}
                            onChange={(e) => setSelectedProducts({
                              ...selectedProducts,
                              [`${stepIndex}-${svcIndex}`]: e.target.value,
                            })}
                          >
                            <option value="">-- Select a Product --</option>
                            {selectedService.products.map((p) => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                          <Button className="bg-[#516d19]" onClick={() => addProductToService(stepIndex, svcIndex)}>+ Add Product</Button>
                        </div>
                      )}

                      {svc.productIds.length > 0 && (
                        <ul className="list-disc list-inside ml-4 text-sm">
                          {svc.productIds.map((pid) => {
                            const product = selectedService?.products.find((p) => p.id === pid);
                            return (
                              <li key={pid} className="flex justify-between items-center">
                                {product?.name || pid}
                                <Button  variant="ghost" size="sm" onClick={() => removeProductFromService(stepIndex, svcIndex, pid)}>
                                  ✕
                                </Button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  );
                })}
                <Button className="bg-[#516d19] text-white" variant="outline" onClick={() => addServiceToStep(stepIndex)}>+ Add Service</Button>
                <Button className="ml-4 bg-white text-[#516d19] border-2 border-[#516d19]" onClick={() => saveStep(stepIndex)}>Save Step</Button>
                {step.saved && <span className="ml-2 text-green-600">✔ Step Saved</span>}
              </>
            )}
          </CardContent>
        </Card>
      ))}

      <div className="flex gap-4">
        <Button className="bg-[#516d19]" onClick={addStep}>+ Add Step</Button>
        <Button className="ml-4 bg-white text-[#516d19] border-2 border-[#516d19]" onClick={saveRoutine}>Save Routine</Button>
      </div>
    </div>
  );
};

export default RoutineForm;
