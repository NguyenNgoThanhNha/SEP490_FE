import { useEffect, useState } from "react";
import { Edit, Trash } from "lucide-react";
import { Table } from "@/components/organisms/Table/Table";
import productService from "@/services/productService"; 
import { formatPrice } from "@/utils/formatPrice";
import toast from "react-hot-toast";
import { Modal, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { TProduct } from "@/types/product.type";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/atoms/ui/pagination";
import { useTranslation } from "react-i18next";

const ProductManagementPage = () => {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [, setLoading] = useState(false);  
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const {t} = useTranslation();

  const fetchProducts = async (page: number, pageSize: number) => {
    try {
      setLoading(true);
      const response = await productService.getAllProduct({ page, pageSize });
      if (response?.success) {
        const activeProducts = response.result?.data.filter(
          (product: TProduct) => product.status === "Active"
        ) || [];
        setProducts(activeProducts);
        setTotalPages(response.result?.pagination?.totalPage || 0);
      } else {
        toast.error(response.result?.message || "Failed to fetch products.");
      }
    } catch {
      toast.error("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleDelete = (productId: number) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This action cannot be undone.",
      okText: "Yes, delete",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const response = await productService.deleteProduct(productId);
          if (response?.success) {
            toast.success("Product deleted successfully.");
            fetchProducts(page, pageSize); 
          } else {
            toast.error(response.result?.message || "Failed to delete product.");
          }
        } catch {
          toast.error("Failed to delete product.");
        }
      },
    });
  };

  const handleEdit = (productId: number) => {
    navigate(`/products-management/${productId}`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      fetchProducts(newPage, pageSize); 
    }
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setPage(1);
    fetchProducts(1, value); 
  };

  useEffect(() => {
    fetchProducts(page, pageSize);
  }, [page, pageSize]);

  const headers = [
    { label: t("Image"), key: "image", hiding: true },
    { label: t("Product"), key: "productName" },
    { label: t("Price"), key: "price", render: (price: number) => `${formatPrice(price)} VND`, sortable: true },
    { label: t("Quantity"), key: "quantity", sortable: true },
    { 
      label: t("category"), 
      key: "category.name", 
      render: (value: string) => <span className="font-sm">{value}</span> 
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
          data={products.length > 0 ? products : []}
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
              <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(row.productId as number)}>
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

export default ProductManagementPage;
