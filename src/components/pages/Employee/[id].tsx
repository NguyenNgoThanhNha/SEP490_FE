import StaffForm from "@/components/organisms/Employee/EmployeeForm";
import { StaffType } from "@/schemas/staffSchema";
import staffService from "@/services/staffService";
import { TStaff } from "@/types/staff.type";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

export const EmployeeDetail = () => {
  const { staffId } = useParams();
  const [staffData, setStaffData] = useState<TStaff | null>(null);
  const [loading, setLoading] = useState(false);
  const mapTStaffToStaffType = (staff: TStaff): StaffType => ({
    userName: staff.staffInfo.userName,
    fullName: staff.staffInfo.fullName,
    email: staff.staffInfo.email,
    branchId: staff.branchId,
  });

  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
        const response = await staffService.getStaffDetail({ staffId: Number(staffId) });
        if (response.success && response.result) {
          setStaffData(response.result.data.data);
          console.log(response.result.data.data)
        } else {
          toast.error("Failed to fetch staff details");
        }
      } catch {
        toast.error("An error occurred while fetching staff details");
      }
    };

    if (staffId) {
      fetchStaffDetails();
    }
  }, [staffId]);

  const updateStaffApi = async (data: TStaff) => {
    setLoading(true);
    try {
      const mappedData = mapTStaffToStaffType(data);
      console.log(mappedData)

      const response = await staffService.updateStaff({
        ...mappedData,
        staffId: Number(staffId), 
      });

      setLoading(false);
      if (response.success) {
        toast.success("Staff updated successfully");
      } else {
        toast.error(response?.result?.message || "Failed to update staff");
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error("An error occurred while updating the staff");
    }
  };


  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <StaffForm mode="update" initialData={staffData ? mapTStaffToStaffType(staffData) : undefined} onSubmit={(values) => updateStaffApi({ ...staffData, ...values, staffId: Number(staffData?.staffId) || 0 })}
        />
      )}
    </div>
  );
};
