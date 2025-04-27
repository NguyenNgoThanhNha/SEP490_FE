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
    staffId: staff.staffId,
    userName: staff.staffInfo.userName,
    fullName: staff.staffInfo.fullName,
    email: staff.staffInfo.email,
    branchId: staff.branchId,
    roleId: staff.roleId,
    avatar: staff.avatar
  });


  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
        const response = await staffService.getStaffDetail({ staffId: Number(staffId) });
        if (response.success && response.result) {
          setStaffData(response.result.data);
          console.log("staffid", response.result.data)
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

  const updateStaffApi = async (data: TStaff) => {  await staffService.updateStaff({
    userName: values.userName,
    fullName: values.fullName,
    email: values.email,
    branchId: values.branchId,
    roleId: values.roleId,
    avatar: values.avatar,
  });
    setLoading(true);
    try {
      const updatedData = {
        ...staffData,
        ...data,   // 🔥 lấy data mới đúng
        staffId: Number(staffId),
      }
      const mappedData = mapTStaffToStaffType(updatedData);
      console.log("Payload gửi lên API:", mappedData);
  
      const response = await staffService.updateStaff(mappedData);
  
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
        <StaffForm
          mode="update"
          initialData={staffData ? mapTStaffToStaffType(staffData) : undefined}
          onSubmit={(values) => updateStaffApi(values)}
        />
      )}
    </div>
  );
};
