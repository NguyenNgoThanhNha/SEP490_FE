import { useState } from "react";
import SkincareRoutineForm from "../CreateSkincareRountineForm/SkincareRoutineForm";
import { SkincareStepForm } from "../CreateSkincareRountineForm/SkincareRoutineStepForm";
import { TRoutine } from "@/types/routine.type";

const RoutineForm: React.FC = () => {
  const [routine, setRoutine] = useState<TRoutine | null>(null); 

  const handleRoutineCreated = (routineData: TRoutine) => {
    setRoutine(routineData); 
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {!routine ? (
          <SkincareRoutineForm onCreated={handleRoutineCreated} />
        ) : (
          <SkincareStepForm routineData={routine} />
        )}
      </div>
    </div>
  );
};

export default RoutineForm;
