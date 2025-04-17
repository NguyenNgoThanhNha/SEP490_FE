import { Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { TService } from "@/types/serviceType";
import serviceService from "@/services/serviceService";
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
import { formatPrice } from "@/utils/formatPrice";
import { useTranslation } from "react-i18next";

const ServicesManagementPage = () => {
  const [services, setServices] = useState<TService[]>([]);
  const [, setLoading] = useState(false);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchServices = async (page: number, pageSize: number) => {
    try {
      setLoading(true);
      const response = await serviceService.getAllService({ page, pageSize });
      if (response?.success) {
        setServices(response.result?.data || []);
        setTotalPages(response.result?.pagination?.totalPage || 0);
      } else {
        toast.error(response.result?.message || t("Failedtofetchservices"));
      }
    } catch {
      toast.error(t("Failedtofetchservices"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (serviceId: number) => {
    Modal.confirm({
      title: t("Areyousure?"),
      content: t("Thisactioncannotbeundone."),
      okText: t("Yesdelete"),
      cancelText: t("Cancel"),
      onOk: async () => {
        try {
          const response = await serviceService.deleteService(serviceId);
          if (response?.success) {
            toast.success(t("Servicedeletedsuccessfully"));
            fetchServices(page, pageSize);
          } else {
            toast.error(response.result?.message || t("Failedtodeleteservice"));
          }
        } catch {
          toast.error(t("Failedtodeleteservice"));
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

  const { t } = useTranslation();

  const headers = [
    { label: t("ServiceName"), key: "name", searchable: true },
    {
      label: t("Price"),
      key: "price",
      render: (price: number) => formatPrice(price),
      sortable: true,
    },
    { label: t("Duration"), key: "duration", render: (duration: number) => `${duration} ${t('minutes')}` },
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
                onClick={() => handleEdit(row.serviceId as number)}
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDelete(row.serviceId as number)}
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
            <span className="whitespace-nowrap text-gray-400 text-sm">{t("Numberofrowsperpage")}</span>
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

export default ServicesManagementPage;
