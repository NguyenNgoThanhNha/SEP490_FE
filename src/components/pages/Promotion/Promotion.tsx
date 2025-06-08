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
import { TPromotion } from "@/types/promotion.type";
import promotionService from "@/services/promotionService";
import { useTranslation } from "react-i18next";

const PromotionManagementPage = () => {
  const [promotions, setPromotions] = useState<TPromotion[]>([]);
  const [, setLoading] = useState(false);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const { t } = useTranslation();

  const fetchPromotion = async (page: number, pageSize: number) => {
    try {
      setLoading(true);
      const response = await promotionService.getAllPromotion({ page, pageSize });
      if (response?.success) {
        const activePromo =
          response.result?.data.filter((promo: TPromotion) => promo.status === "Active") || [];
        setPromotions(activePromo);
        setTotalPages(response.result?.pagination?.totalPage || 0);
      } else {
        toast.error(response.result?.message || t("fetchError"));
      }
    } catch {
      toast.error(t("fetchError"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (promotionId: number) => {
    Modal.confirm({
      title: t("confirmDeleteTitle"),
      content: t("confirmDeleteContent"),
      okText: t("confirmDeleteOk"),
      cancelText: t("confirmDeleteCancel"),
      onOk: async () => {
        try {
          const response = await promotionService.deletePromotion(promotionId);
          if (response?.success === true) {
            toast.success(t("deleteSuccess"));
            fetchPromotion(page, pageSize);
          } else {
            toast.error(response.result?.message || t("deleteError"));
          }
        } catch {
          toast.error(t("deleteError"));
        }
      },
    });
  };

  const handleEdit = (promotionId: number) => {
    navigate(`/promotions-management/${promotionId}`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      fetchPromotion(newPage, pageSize);
    }
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setPage(1);
    fetchPromotion(1, value);
  };

  useEffect(() => {
    fetchPromotion(page, pageSize);
  }, [page, pageSize]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const headers = [
    { label: t("PromotionName"), key: "promotionName" },
    {
      label: t("StartDate"),
      key: "startDate",
      sortable: true,
      render: (value: string) => formatDate(value),
    },
    {
      label: t("EndDate"),
      key: "endDate",
      sortable: true,
      render: (value: string) => formatDate(value),
    },
    {
      label: t("Discount"),
      key: "discountPercent",
      render: (value: string) => <span className="font-sm">{value}%</span>,
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
          data={promotions.length > 0 ? promotions : []}
          badgeConfig={{
            key: "status",
            values: {
              Active: { label: t("active"), color: "green", textColor: "white" },
              SoldOut: { label: t("soldOut"), color: "red", textColor: "white" },
            },
          }}
          actions={(row) => (
            <>
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={() => handleEdit(row.promotionId as number)}
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDelete(row.promotionId as number)}
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

export default PromotionManagementPage;
