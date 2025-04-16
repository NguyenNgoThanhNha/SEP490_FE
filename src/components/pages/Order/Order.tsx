import { useEffect, useState } from "react";
import { Edit } from "lucide-react";
import ReusableAreaChart from "@/components/molecules/AreaChart";
import RechartsPieChart from "@/components/molecules/PieChart";
import { Table } from "@/components/organisms/Table/Table";
import { formatPrice } from "@/utils/formatPrice";
import toast from "react-hot-toast";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/atoms/ui/pagination";
import { TOrder } from "@/types/order.type";
import orderService from "@/services/orderService";
import { Badge } from "@/components/atoms/ui/badge";

const OrderManagementPage = () => {
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [, setLoading] = useState(false);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const [orderTypeFilter, ] = useState<string[]>([]);

  const fetchOrders = async (PageIndex: number, PageSize: number, OrderType?: string) => {
    try {
      setLoading(true);
      const response = await orderService.getAllOrder({
        PageIndex,
        PageSize,
        OrderType: OrderType,
      });

      if (response?.success) {
        setOrders(response.result?.data);
        setTotalPages(response.result?.pagination?.totalPage || 0);
      } else {
        toast.error(response.result?.message || "Failed to fetch orders.");
      }
    } catch {
      toast.error("Failed to fetch orders.");
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
    setPage(1);
    fetchOrders(1, value);
  };

  useEffect(() => {
    fetchOrders(page, pageSize);
  }, [page, pageSize]);

  const headers = [
    { label: "Customer", key: "customer.userName" },
    { label: "Price", key: "totalAmount", render: (price: number) =>`${formatPrice(price)} VND`, sortable: true },
    {
      label: "Status",
      key: "status",
      sortable: true,
      render: (status: string) => {
        let variant: "active" | "inactive" | "pending" | "default";
        switch (status.toLowerCase()) {
          case "completed":
            variant = "active";
            break;
          case "pending":
            variant = "pending";
            break;
          case "cancelled":
            variant = "inactive";
            break;
          default:
            variant = "default";
        }
    
        return <Badge variant={variant}>{status}</Badge>;
      },
    },
        {
      label: "Payment method",
      key: "paymentMethod",
      render: (status: string) => (
        <Badge variant={status === "PayOs" ? "active" : "inactive"}>
            {status}
        </Badge>
    ),
    },
    { label: "Order Type", key: "orderType" },

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
      <div className="flex gap-6 mb-8">
        <div className="flex-1">
          <ReusableAreaChart
            title="Product used"
            showTotal={true}
            chartData={[
              { label: "Jan", value: 2000 },
              { label: "Feb", value: 1150 },
              { label: "Mar", value: 1800 },
              { label: "Apr", value: 900 },
            ]}
          />
        </div>
        <div className="flex-1">
          <RechartsPieChart
            title="Type distribution"
            subtitle="Product Type"
            labels={["Serum", "Toner", "Others"]}
            data={[59, 20, 21]}
          />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4">
        <Table
          filters={[
            {
              key: "orderType", 
              values: orderTypeFilter,
            },
          ]} headers={headers}
          selectable={true}
          data={orders.length > 0 ? orders : []}
          badgeConfig={{
            key: "status",
            values: {
              Active: { label: "Active", color: "green", textColor: "white" },
              SoldOut: { label: "Sold Out", color: "red", textColor: "white" },
            },
          }}
          actions={(row) => (
            <>
              <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEdit(row.productId as number)}>
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
              Number of rows per page
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

export default OrderManagementPage;
