import { useEffect, useState } from "react";
import { Edit } from "lucide-react";
import { Table } from "@/components/organisms/Table/Table";
import { formatPrice } from "@/utils/formatPrice";
import toast from "react-hot-toast";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/atoms/ui/pagination";
import { TOrder } from "@/types/order.type";
import orderService from "@/services/orderService";
import { Badge } from "@/components/atoms/ui/badge";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useTranslation } from "react-i18next";

const BranchOrderManagementPage = () => {
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [, setLoading] = useState(false);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const branchIdRedux = useSelector((state: RootState) => state.branch.branchId);
  const BranchId = branchIdRedux || Number(localStorage.getItem("branchId"));
  const { t } = useTranslation();

  const fetchOrders = async (PageIndex: number, PageSize: number) => {
    try {
      setLoading(true);
      const response = await orderService.getAllOrder({
        BranchId,
        PageIndex,
        PageSize,
      });

      if (response?.success) {
        setOrders(response.result?.data); // Lưu danh sách đơn hàng vào state
        setTotalPages(response.result?.pagination?.totalPage || 0); // Cập nhật tổng số trang
      } else {
        toast.error(response.result?.message || t("fetchError"));
      }
    } catch {
      toast.error(t("fetchError"));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (orderId: number) => {
    navigate(`/order-management/${orderId}`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      fetchOrders(newPage, pageSize); 
    }
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setPage(1); // Đặt lại trang về 1
    fetchOrders(1, value); // Gọi API với kích thước trang mới
  };

  useEffect(() => {
    fetchOrders( page, pageSize);
  }, [BranchId, page, pageSize]);

  const headers = [
    { label: t("customer"), key: "customer.userName" },
    { label: t("Price"), key: "totalAmount", render: (price: number) => `${formatPrice(price)} VND`, sortable: true },
    {
      label: t('Status'),
      key: 'status',
      sortable: true,
      render: (status: string) => {
        let variant: 'active' | 'inactive' | 'pending' | 'default';
        let translatedStatus = '';

        switch (status) {
          case 'Completed':
            variant = 'active';
            translatedStatus = t('Completed');
            break;
          case 'Pending':
            variant = 'pending';
            translatedStatus = t('Pending');
            break;
          case 'Cancelled':
            variant = 'inactive';
            translatedStatus = t('Cancelled');
            break;

          default:
            variant = 'default';
            translatedStatus = t('Unknown');
        }

        return <Badge variant={variant}>{translatedStatus}</Badge>;
      },
    }, {
      label: t("paymentMethod"),
      key: "paymentMethod",
      render: (status: string) => (
        <Badge variant={status?.toUpperCase() === "PAYOS" ? "active" : "inactive"}>
          {t(status)}
        </Badge>
      ),
    },
    {
      label: t('OrderType'),
      key: 'orderType',
      render: (orderType: string) => {
        let translatedOrderType = '';

        switch (orderType) {
          case 'Product':
            translatedOrderType = t('Product');
            break;
          case 'ProductAndService':
            translatedOrderType = t('productandservice');
            break;
          case 'Appointment':
            translatedOrderType = t('Appointment');
            break;
          case 'Routine':
            translatedOrderType = t('Routine');
            break;
          default:
            translatedOrderType = t('Unknown');
        }

        return translatedOrderType;
      },
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
      <div className="bg-white shadow-md rounded-lg p-4">
        <Table
          headers={headers}
          selectable={true}
          data={orders.length > 0 ? orders : []}
          badgeConfig={{
            key: "status",
            values: {
              Active: { label: t("active"), color: "green", textColor: "white" },
              SoldOut: { label: t("soldOut"), color: "red", textColor: "white" },
            },
          }}
          actions={(row) => (
            <>
              <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEdit(row.orderId as number)}>
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

export default BranchOrderManagementPage;
