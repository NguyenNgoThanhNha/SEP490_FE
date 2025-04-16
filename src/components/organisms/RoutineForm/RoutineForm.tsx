import SkincareRoutineForm from "../CreateSkincareRountineForm/SkincareRoutineForm";
import { TRoutine } from "@/types/routine.type";
import { useState } from "react";
import { SkincareStepForm } from "../CreateSkincareRountineForm/SkincareRoutineStepForm";


const RoutineForm: React.FC = () => {

  const [routine, setRoutine] = useState<TRoutine | null>(null);


  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Tạo gói liệu trình </h1>
      <SkincareRoutineForm onCreated={async (routine) => {
        setRoutine(routine);
      }} />

      <h2 className="text-lg font-bold">Tạo các bước cho routine: {routine?.name}</h2>
      {Array.from({ length: routine?.totalSteps || 0 }).map((_, index) => (
        <SkincareStepForm
          key={index}
          step={index + 1}
          routineId={Number(routine?.skincareRoutineId)}
        />
      ))}
    </div>
  );
};

export default RoutineForm;
