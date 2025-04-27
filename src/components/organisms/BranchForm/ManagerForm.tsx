import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/ui/select";
import branchService from "@/services/branchService";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

interface AssignManagerToBranchProps {
  onManagerSelect: (managerId: number) => void;
}

export const AssignManagerToBranch: React.FC<AssignManagerToBranchProps> = ({ onManagerSelect }) => {
  const [managers, setManagers] = useState<{ userId: number; userName: string }[]>([]);
  const { t } = useTranslation();

  const fetchManager = async () => {
    try {
      const response = await branchService.getManagerNotInBranch();
      if (response.success) {
        setManagers(response.result?.data || []);
      } else {
        toast.error(response.result?.message || t("fetchError"));
      }
    } catch {
      toast.error(t("fetchError"));
    }
  };

  useEffect(() => {
    fetchManager();
  }, []);

  return (
    <div>
      <Select onValueChange={(value) => onManagerSelect(Number(value))}>
        <SelectTrigger>
          <SelectValue placeholder={t("selectManager")} />
        </SelectTrigger>
        <SelectContent>
          {managers.length > 0 ? (
            managers.map((manager) => (
              <SelectItem key={manager.userId} value={manager.userId.toString()}>
                {manager.userName}
              </SelectItem>
            ))
          ) : (
            <SelectItem disabled value="no-data">
              {t("noData")}
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};
