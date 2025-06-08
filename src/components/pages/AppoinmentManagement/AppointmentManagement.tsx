import { useEffect, useState } from "react";
import { Edit } from "lucide-react";
import { Table } from "@/components/organisms/Table/Table";
import toast from "react-hot-toast";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/atoms/ui/pagination";
import { format } from "date-fns";
import { TAppointment } from "@/types/appoinment.type";
import appoinmentService from "@/services/appoinmentService";
import BranchComponent from "../BranchManagement/BranchManagement";
import { startConnection, stopConnection } from "@/services/signalRService";
import { t } from "i18next";

const AppointmentManagementPage = () => {
  const [appointments, setAppointments] = useState<TAppointment[]>([]);
  const [, setLoading] = useState(false);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const fetchAppointment = async (page: number, pageSize: number) => {
    try {
      setLoading(true);
      const response = await appoinmentService.getAllAppointment({ page, pageSize });
      if (response?.success) {
        setAppointments(response.result?.data || []);
        setTotalPages(response.result?.pagination?.totalPage || 0);
      } else {
        toast.error(response.result?.message || "Failed to fetch appointments");
      }
    } catch {
      toast.error("Failed to fetch appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startConnection();

    return () => {
      stopConnection();
    };
  }, []);

  const handleEdit = (appointmentId: number) => {
    navigate(`/appoinments-management/${appointmentId}`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      fetchAppointment(newPage, pageSize);
    }
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setPage(1);
    fetchAppointment(1, value);
  };

  useEffect(() => {
    fetchAppointment(page, pageSize);
  }, [page, pageSize]);

  const headers = [
    {
      label: "Khách hàng",
      key: "customer.fullName"
    },
    {
      label: "Dịch vụ",
      key: "service.name"
    },
    {
      label: "Chi nhánh",
      key: "branch.branchName"
    },
    {
      label: "Staff",
      key: "staffId"
    },
    {
      label: "Thời gian bắt đầu",
      key: "appointmentsTime",
      sortable: true,
      render: (value: string) =>
        value ? format(new Date(value), "dd/MM/yyyy HH:mm") : "Không hợp lệ"
    },
    {
      label: "Thời gian kết thúc",
      key: "appointmentEndTime",
      sortable: true,
      render: (value: string) =>
        value ? format(new Date(value), "dd/MM/yyyy HH:mm") : "Không hợp lệ"
    },
    {
      label: "Trạng thái",
      key: "status"
    },
    {
      label: "Tổng tiền",
      key: "subTotal",
      sortable: true,
      render: (value: number) => `${value.toLocaleString()} VND`
    }
  ];

  const renderPagination = () => {
    const paginationItems = [];

    if (page >= 1) {
      paginationItems.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => handlePageChange(1)} isActive={page === 1}>
            1
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (page > 3) {
      paginationItems.push(<PaginationEllipsis key="ellipsis-start" />);
    }

    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      paginationItems.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => handlePageChange(i)} isActive={page === i}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (page < totalPages - 2) {
      paginationItems.push(<PaginationEllipsis key="ellipsis-end" />);
    }

    if (totalPages > 1) {
      paginationItems.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => handlePageChange(totalPages)} isActive={page === totalPages}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return paginationItems;
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="my-4 flex justify-between items-center">
        <BranchComponent />
      </div>

      <div className="bg-white shadow-md rounded-lg p-4">
        <Table
          headers={headers}
          selectable={true}
          data={appointments.length > 0 ? appointments : []}
          badgeConfig={{
            key: "status",
            values: {
              Active: { label: "Active", color: "green", textColor: "white" },
              SoldOut: { label: "Sold Out", color: "red", textColor: "white" },
            },
          }}
          actions={(row) => (
            <>
              <button className="text-blue-500 hover:text-blue-700 p-2 rounded-lg"
                onClick={() => handleEdit(row.appointmentId as number)}>
                <Edit className="w-5 h-5" />
              </button>
            </>
          )}
        />
      </div>

      <div className="absolute right-10 mt-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="whitespace-nowrap text-gray-400 text-sm">
             {t("Numberofrowsperpage")}
            </span>
            <Select defaultValue={pageSize} onChange={handlePageSizeChange} className="w-28">
              {[5, 10, 15, 20].map((size) => (
                <Select.Option key={size} value={size}>
                  {size} items
                </Select.Option>
              ))}
            </Select>
          </div>
          <Pagination className="flex">
            <PaginationContent>
              <PaginationPrevious onClick={() => handlePageChange(page - 1)} isDisabled={page === 1}>
                Prev
              </PaginationPrevious>
              {renderPagination()}
              <PaginationNext onClick={() => handlePageChange(page + 1)} isDisabled={page === totalPages}>
                Next
              </PaginationNext>
            </PaginationContent>
          </Pagination>

        </div>
      </div>
    </div>
  );
};

export default AppointmentManagementPage;
