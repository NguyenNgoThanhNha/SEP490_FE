import { useEffect, useState } from "react";
import { Edit, Trash } from "lucide-react";
import { Table } from "@/components/organisms/Table/Table";
import toast from "react-hot-toast";
import { Modal, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/atoms/ui/pagination";
import { TBranchPromotion } from "@/types/branchPromotion.type";
import branchPromotionService from "@/services/branchPromotionService";
import { format } from "date-fns";
import AddPromotionModal from "./CreateBranchPromotion";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useTranslation } from "react-i18next";

const BranchPromotionManagementPage = () => {
  const [branchPromotions, setBranchPromotions] = useState<TBranchPromotion[]>([]);
  const [, setLoading] = useState(false);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const branchIdRedux = useSelector((state: RootState) => state.branch.branchId);
  const branchId = branchIdRedux || Number(localStorage.getItem("branchId"));
  const { t } = useTranslation();

  const fetchBranchPromotion = async (branchId: number, page: number, pageSize: number) => {
    try {
      setLoading(true);
      const response = await branchPromotionService.getAllBranchPromotion({ branchId, page, pageSize });
      if (response?.success) {
        const activePromotions = response.result?.data.filter((item: TBranchPromotion) => item.status === "Active") || [];
        setBranchPromotions(activePromotions);
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

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: t("confirmDeleteTitle"),
      content: t("confirmDeleteContent"),
      okText: t("confirmDeleteOk"),
      cancelText: t("confirmDeleteCancel"),
      onOk: async () => {
        try {
          const response = await branchPromotionService.deleteBranchPromotion(id);
          if (response?.success) {
            toast.success(t("deleteSuccess"));
            setBranchPromotions((prev) => prev.filter((item) => item.id !== id));
          } else {
            toast.error(response.result?.message || t("deleteError"));
          }
        } catch {
          toast.error(t("deleteError"));
        }
      },
    });
  };

  const handleEdit = (branchPromotionId: number) => {
    navigate(`/branch-promotion-management/${branchPromotionId}`);
  };

  const handlePageChange = (newPage: number) => {
    if (!branchId) {
      toast.error(t("branchIdRequired"));
      return;
    }

    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      fetchBranchPromotion(branchId, newPage, pageSize);
    }
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setPage(1);
    fetchBranchPromotion(branchId, page, value);
  };

  useEffect(() => {
    if (branchId) {
      fetchBranchPromotion(branchId, page, pageSize);
    }
  }, [branchId, page, pageSize]);

  const headers = [
    {
      label: t("Image"),
      key: "promotion.image",
      render: (value: string) => (
        <img
          src={value}
          alt={t("promotionImage")}
          style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
        />
      ),
    },
    { label: t("PromotionName"), key: "promotion.promotionName" },
    {
      label: t("Discount"),
      key: "promotion.discountPercent",
      sortable: true,
      render: (value: number) => `${value}%`,
    },
    {
      label: t("StartDate"),
      key: "promotion.startDate",
      sortable: true,
      render: (value: string) =>
        value ? format(new Date(value), "dd/MM/yyyy HH:mm") : t("invalidDate"),
    },
    {
      label: t("EndDate"),
      key: "promotion.endDate",
      sortable: true,
      render: (value: string) =>
        value ? format(new Date(value), "dd/MM/yyyy HH:mm") : t("invalidDate"),
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
      <div className="my-4 flex justify-between items-center">
        <button
          className="px-4 py-1 bg-[#516d19] text-white rounded-lg hover:bg-green-700 ml-auto"
          onClick={() => setIsModalOpen(true)}
        >
          {t("addPromote")}
        </button>
      </div>
      <AddPromotionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        branchId={branchId ?? 0}
      />
      <div className="bg-white shadow-md rounded-lg p-4">
        <Table
          headers={headers}
          selectable={true}
          data={branchPromotions.length > 0 ? branchPromotions : []}
          badgeConfig={{
            key: "status",
            values: {
              Active: { label: t("active"), color: "green", textColor: "white" },
              Expired: { label: t("expired"), color: "red", textColor: "white" },
            },
          }}
          actions={(row) => (
            <>
              <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEdit(row.id as number)}>
                <Edit className="w-5 h-5" />
              </button>
              <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(row.id as number)}>
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

export default BranchPromotionManagementPage;
