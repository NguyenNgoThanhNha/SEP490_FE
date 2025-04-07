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
import { TVoucher } from "@/types/voucher.type";
import voucherService from "@/services/voucherService";
import { formatDate } from "@/utils/formatDate";

const VoucherManagementPage = () => {
  const [vouchers, setVouchers] = useState<TVoucher[]>([]);
  const [, setLoading] = useState(false);
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, ] = useState(1); 

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const response = await voucherService.getAllVoucher({ Status: "active" });
      if (response?.success) {
        setVouchers(response.result?.data || []);
      } else {
        toast.error(response.result?.message || "Failed to fetch vouchers.");
      }
    } catch {
      toast.error("Failed to fetch vouchers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, [page, pageSize]);

  const handleDelete = (voucherId: number) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This action cannot be undone.",
      okText: "Yes, delete",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const response = await voucherService.deleteVoucher(voucherId);
          if (response?.success) {
            toast.success("Voucher deleted successfully.");
            fetchVouchers();
          } else {
            toast.error(response.result?.message || "Failed to delete voucher.");
          }
        } catch {
          toast.error("Failed to delete voucher.");
        }
      },
    });
  };

  const handleEdit = (voucherId: number) => {
    navigate(`/voucher-management/${voucherId}`);
  };

  const handleExport = () => {
    const exportData = vouchers.map((voucher) => ({
      "Voucher Code": voucher.code,
      "Discount": `${voucher.discountAmount}%`,
      "Description": voucher.description,
      "Quantity": voucher.quantity,
      "Remain Quantity": voucher.remainQuantity,
      "Valid From": formatDate(voucher.validFrom),
      "Valid To": formatDate(voucher.validTo),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vouchers");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, `vouchers_export_${Date.now()}.xlsx`);
  };

  const headers = [
    { label: "Voucher code", key: "code", searchable: true },
    {
      label: "Discount",
      key: "discountAmount",
      render: (price: number) => `${price}%`,
      sortable: true,
    },
    { label: "Description", key: "description" },
    { label: "Quantity", key: "quantity" },
    { label: "Remain Quantity", key: "remainQuantity" },
    { label: "Valid from", key: "validFrom", render: formatDate },
    { label: "Valid to", key: "validTo", render: formatDate },
  ];

  return (
    <div className="p-6 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-4">
        <Table
          headers={headers}
          data={vouchers}
          selectable
          onExport={handleExport}
          actions={(row) => (
            <>
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={() => handleEdit(row.voucherId as number)}
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDelete(row.voucherId as number)}
              >
                <Trash className="w-5 h-5" />
              </button>
            </>
          )}
        />
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Rows per page:</span>
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
                {size}
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

export default VoucherManagementPage;
