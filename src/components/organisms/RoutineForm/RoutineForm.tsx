import { useState } from "react";
import SkincareRoutineForm from "../CreateSkincareRountineForm/SkincareRoutineForm";
import { SkincareStepForm } from "../CreateSkincareRountineForm/SkincareRoutineStepForm";
import { TRoutine } from "@/types/routine.type";

const RoutineForm: React.FC = () => {
  const [routine, setRoutine] = useState<TRoutine | null>(null); // Lưu thông tin routine sau khi tạo

  const handleRoutineCreated = (routineData: TRoutine) => {
    setRoutine(routineData); // Lưu skincareRoutineId và các thông tin khác
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {!routine ? (
          // Hiển thị form tạo routine
          <SkincareRoutineForm onCreated={handleRoutineCreated} />
        ) : (
          // Hiển thị form tạo step
          <SkincareStepForm routineData={routine} />
        )}
      </div>
    </div>
  );
};

export default RoutineForm;
