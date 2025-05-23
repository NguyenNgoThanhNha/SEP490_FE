import { useEffect, useState } from "react";
import { Edit, Trash } from "lucide-react";
import { Table } from "@/components/organisms/Table/Table";
import toast from "react-hot-toast";
import { Modal, Select } from "antd";
import { useNavigate } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/atoms/ui/pagination";
import { TStaff } from "@/types/staff.type";
import staffService from "@/services/staffService";
import { formatDate } from "@/utils/formatDate";
import { useTranslation } from "react-i18next";

const EmployeeManagementPage = () => {
  const [staffs, setStaffs] = useState<TStaff[]>([]);
  const [, setLoading] = useState(false);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const { t } = useTranslation();

  const fetchStaff = async (pageIndex: number, pageSize: number) => {
    try {
      setLoading(true);
      const response = await staffService.getAllStaff({ pageIndex, pageSize });
      if (response?.success) {
        const activeStaffs =
          response.result?.data.data.filter(
            (staff: TStaff) => staff.staffInfo.status === "Active"
          ) || [];
        setStaffs(activeStaffs);
        setTotalPages(response.result?.data?.totalPagesCount || 0);
      } else {
        toast.error(response.result?.message || t("fetchError"));
      }
    } catch {
      toast.error(t("fetchError"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (staffId: number) => {
    Modal.confirm({
      title: t("confirmDeleteTitle"),
      content: t("confirmDeleteContent"),
      okText: t("confirmDeleteOk"),
      cancelText: t("confirmDeleteCancel"),
      onOk: async () => {
        try {
          const response = await staffService.deleteStaff(staffId);
          if (response?.success) {
            toast.success(t("deleteSuccess"));
            fetchStaff(page, pageSize);
          } else {
            toast.error(response.result?.message || t("deleteError"));
          }
        } catch {
          toast.error(t("deleteError"));
        }
      },
    });
  };

  const handleEdit = (staffId: number) => {
    navigate(`/staffs-management/${staffId}`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      fetchStaff(newPage, pageSize);
    }
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setPage(1);
    fetchStaff(1, value);
  };

  useEffect(() => {
    fetchStaff(page, pageSize);
  }, [page, pageSize]);

  const headers = [
    { label: t("StaffName"), key: "staffInfo.userName", sortable: true },
    { label: t("email"), key: "staffInfo.email" },
    { label: t("Gender"), key: "staffInfo.gender" },
    { label: t("PhoneNumber"), key: "staffInfo.phoneNumber" },
    {
      label: t("BirthDate"),
      key: "staffInfo.birthDate",
      render: (value: string) => formatDate(value),
      sortable: true,
    },
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
      <div className="bg-white shadow-md rounded-lg p-4">
        <Table
          headers={headers}
          selectable={true}
          data={staffs.length > 0 ? staffs : []}
          actions={(row) => (
            <>
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={() => handleEdit(row.staffId as number)}
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDelete(row.staffId as number)}
              >
                <Trash className="w-5 h-5" />
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
                  {size} {t("items")}
                </Select.Option>
              ))}
            </Select>
          </div>
          <Pagination className="flex">
            <PaginationContent>
              <PaginationPrevious onClick={() => handlePageChange(page - 1)} isDisabled={page === 1}>
                {t("Prev")}
              </PaginationPrevious>
              {renderPagination()}
              <PaginationNext onClick={() => handlePageChange(page + 1)} isDisabled={page === totalPages}>
                {t("Next")}
              </PaginationNext>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagementPage;
