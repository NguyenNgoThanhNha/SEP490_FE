import { useEffect, useState } from "react";
import { Modal, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { Edit, Trash } from "lucide-react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/atoms/ui/pagination";

import { Table } from "@/components/organisms/Table/Table";
import { TBranch } from "@/types/branch.type";
import branchService from "@/services/branchService";
import { useTranslation } from "react-i18next";

const BranchManagementPage = () => {
  const [branches, setBranches] = useState<TBranch[]>([]);
  const [, setLoading] = useState(false);
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const { t } = useTranslation();

  const fetchBranches = async (page: number, pageSize: number, status: "Active") => {
    try {
      setLoading(true);
      const response = await branchService.getAllBranch({ page, pageSize, status });
      if (response?.success) {
        setBranches(response.result?.data || []);
        setTotalPages(response.result?.pagination?.totalPage || 1);
      } else {
        toast.error(response.result?.message || t("fetchError"));
      }
    } catch {
      toast.error(t("fetchError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches(page, pageSize, "Active");
  }, [page, pageSize]);

  const handleDelete = (branchId: number) => {
    Modal.confirm({
      title: t("confirmDeleteTitle"),
      content: t("confirmDeleteContent"),
      okText: t("confirmDeleteOk"),
      cancelText: t("confirmDeleteCancel"),
      onOk: async () => {
        try {
          const response = await branchService.deleteBranch(branchId);
          if (response?.success) {
            toast.success(t("deleteSuccess"));
            fetchBranches(page, pageSize, "Active");
          } else {
            toast.error(response.result?.message || t("deleteError"));
          }
        } catch {
          toast.error(t("deleteError"));
        }
      },
    });
  };

  const handleEdit = (branchId: number) => {
    navigate(`/branchs-management/${branchId}`);
  };

  const handleExport = () => {
    const exportData = branches.map((branch) => ({
      [t("branchName")]: branch.branchName,
      [t("branchAddress")]: branch.branchAddress,
      [t("phone")]: branch.branchPhone,
      [t("longitude")]: branch.longAddress,
      [t("latitude")]: branch.latAddress,
      [t("status")]: branch.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, t("branches"));

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, `branches_export_${Date.now()}.xlsx`);
  };

  const headers = [
    { label: t("branchname"), key: "branchName", searchable: true },
    { label: t("branchaddress"), key: "branchAddress", searchable: true },
    { label: t("branchphone"), key: "branchPhone", searchable: true },
    { label: t("district"), key: "district" },
    { label: t("wardCode"), key: "wardCode" },
    { label: t("Status"), key: "status" },
  ];

  return (
    <div className="p-6 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-4">
        <Table
          headers={headers}
          data={branches}
          selectable
          onExport={handleExport}
          actions={(row) => (
            <>
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={() => handleEdit(row.branchId as number)}
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDelete(row.branchId as number)}
              >
                <Trash className="w-5 h-5" />
              </button>
            </>
          )}
        />
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>{t("Numberofrowsperpage")}:</span>
          <Select
            defaultValue={pageSize}
            onChange={(value: number) => {
              setPageSize(value);
              setPage(1);
            }}
            className="w-28"
          >
            {[5, 10, 15, 20].map((size) => (
              <Select.Option key={size} value={size}>
                {size} {t("items")}
              </Select.Option>
            ))}
          </Select>
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationPrevious
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              isDisabled={page === 1}
            />
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => setPage(index + 1)}
                  isActive={page === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationNext
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              isDisabled={page === totalPages}
            />
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default BranchManagementPage;
