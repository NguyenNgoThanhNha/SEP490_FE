import { Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Edit, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { Select } from "antd";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/atoms/ui/pagination";
import { Table } from "@/components/organisms/Table/Table";
import { TServiceCategory } from "@/types/serviceCategory.type";
import serviceCategory from "@/services/serviceCategory";
import { useTranslation } from "react-i18next";

const ServicesCateManagementPage = () => {
  const [services, setServices] = useState<TServiceCategory[]>([]);
  const [, setLoading] = useState(false);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const { t } = useTranslation();

  const fetchServices = async (page: number, pageSize: number) => {
    try {
      setLoading(true);
      const response = await serviceCategory.getAllSerCate({ page, pageSize });
      if (response?.success) {
        setServices(response.result?.data || []);
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

  const handleDelete = (serviceCategoryId: number) => {
    Modal.confirm({
      title: t("confirmDeleteTitle"),
      content: t("confirmDeleteContent"),
      okText: t("confirmDeleteOk"),
      cancelText: t("confirmDeleteCancel"),
      onOk: async () => {
        try {
          const response = await serviceCategory.deleteServiceCate(serviceCategoryId);
          if (response?.success) {
            toast.success(t("deleteSuccess"));
            fetchServices(page, pageSize);
          } else {
            toast.error(response.result?.message || t("deleteError"));
          }
        } catch {
          toast.error(t("deleteError"));
        }
      },
    });
  };

  const handleEdit = (serviceId: number) => {
    navigate(`/services-management/${serviceId}`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      fetchServices(newPage, pageSize);
    }
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setPage(1);
    fetchServices(1, value);
  };

  useEffect(() => {
    fetchServices(page, pageSize);
  }, [page, pageSize]);

  const headers = [
    { label: t("serviceCategoryName"), key: "name", searchable: true },
    {
      label: t("description"),
      key: "description",
    },
    {
      label: t("Image"),
      key: "thumbnail",
      render: (thumbnail: string) => (
        <img
          src={thumbnail}
          onError={(e) => {
            e.currentTarget.src = "https://i.pinimg.com/736x/36/cc/a8/36cca88b83b1846acf77f17b10ef62dd.jpg";
          }}
          alt={t("thumbnail")}
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
      ),
    },
    {
      label: t("Status"),
      key: "status",
      render: (status: string) => (
        <span
          style={{
            padding: "5px 10px",
            borderRadius: "5px",
            color: status === "Active" ? "darkgreen" : "darkred",
            backgroundColor: status === "Active" ? "#d4edda" : "#f8d7da",
            fontWeight: "bold",
          }}
        >
          {status === "Active" ? t("active") : t("inactive")}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-4">
        <Table
          headers={headers}
          selectable={true}
          data={services}
          actions={(row) => (
            <>
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={() => handleEdit(row.serviceCategoryId as number)}
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDelete(row.serviceCategoryId as number)}
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
            <Select
              defaultValue={pageSize}
              onChange={handlePageSizeChange}
              className="w-28"
            >
              {[5, 10, 15, 20].map((size) => (
                <Select.Option key={size} value={size}>
                  {size} {t("items")}
                </Select.Option>
              ))}
            </Select>
          </div>
          <Pagination className="flex">
            <PaginationContent>
              <PaginationPrevious
                onClick={() => handlePageChange(page - 1)}
                isDisabled={page === 1}
              >
                {t("Prev")}
              </PaginationPrevious>
              {Array.from({ length: totalPages }, (_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    onClick={() => handlePageChange(index + 1)}
                    isActive={page === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationNext
                onClick={() => handlePageChange(page + 1)}
                isDisabled={page === totalPages}
              >
                {t("Next")}
              </PaginationNext>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default ServicesCateManagementPage;
