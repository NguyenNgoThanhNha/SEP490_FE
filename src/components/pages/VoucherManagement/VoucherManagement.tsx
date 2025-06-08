import { useEffect, useState } from "react";
import { Modal, Select } from "antd";
import { Trash } from "lucide-react";
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
import { formatPrice } from "@/utils/formatPrice";
import { useTranslation } from "react-i18next";

const VoucherManagementPage = () => {
  const { t } = useTranslation();
  const [vouchers, setVouchers] = useState<TVoucher[]>([]);
  const [, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const response = await voucherService.getAllVoucher({ Status: "active" });
      if (response?.success) {
        setVouchers(response.result?.data || []);
        setTotalPages(Math.ceil((response.result?.data.length || 0) / pageSize));
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
    fetchVouchers();
  }, [page, pageSize]);

  const handleDelete = (voucherId: number) => {
    Modal.confirm({
      title: t("confirmDeleteTitle"),
      content: t("confirmDeleteContent"),
      okText: t("confirmDeleteOk"),
      cancelText: t("confirmDeleteCancel"),
      onOk: async () => {
        try {
          const response = await voucherService.deleteVoucher(voucherId);
          if (response?.success) {
            toast.success(t("deleteSuccess"));
            fetchVouchers();
          } else {
            toast.error(response.result?.message || t("deleteError"));
          }
        } catch {
          toast.error(t("deleteError"));
        }
      },
    });
  };

  const handleExport = () => {
    const exportData = vouchers.map((voucher) => ({
      [t("voucherCode")]: voucher.code,
      [t("Discount")]: `${voucher.discountAmount} VND`,
      [t("description")]: voucher.description,
      [t("quantity")]: voucher.quantity,
      [t("remainQuantity")]: voucher.remainQuantity,
      [t("validFrom")]: formatDate(voucher.validFrom),
      [t("validTo")]: formatDate(voucher.validTo),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, t("vouchers"));

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, `vouchers_export_${Date.now()}.xlsx`);
  };

  const headers = [
    { label: t("voucherCode"), key: "code", searchable: true },
    {
      label: t("Discount"),
      key: "discountAmount",
      render: (price: number) => `${formatPrice(price)} VND`,
      sortable: true,
    },
    { label: t("description"), key: "description" },
    { label: t("Quantity"), key: "quantity", sortable: true },
    { label: t("remainQuantity"), key: "remainQuantity", sortable: true },
    { label: t("validFrom"), key: "validFrom", render: formatDate, sortable: true },
    { label: t("validTo"), key: "validTo", render: formatDate, sortable: true },
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

export default VoucherManagementPage;
