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
import { TRoutine } from "@/types/routine.type";
import routineService from "@/services/routineService";
import { useTranslation } from "react-i18next";
import skincareRoutineService from "@/services/skincareRoutineService";

const RoutineManagementPage = () => {
  const [routines, setRoutines] = useState<TRoutine[]>([]);
  const [displayedRoutines, setDisplayedRoutines] = useState<TRoutine[]>([]);
  const [, setLoading] = useState(false);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const { t } = useTranslation();

  const fetchRoutines = async () => {
    try {
      setLoading(true);
      const response = await routineService.getListSkincareRoutines();
      if (response?.success) {
        const allRoutines = response.result?.data || [];
        setRoutines(allRoutines);
        setTotalPages(Math.ceil(allRoutines.length / pageSize));
        setDisplayedRoutines(allRoutines.slice(0, pageSize));
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
    fetchRoutines();
  }, []);

  useEffect(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    setDisplayedRoutines(routines.slice(start, end));
    setTotalPages(Math.ceil(routines.length / pageSize));
  }, [page, pageSize, routines]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setPage(1);
  };

  const handleEdit = (skincareRoutineId: number) => {
    navigate(`/routine-management/${skincareRoutineId}`);
  };

  const handleDelete = async (skincareRoutineId: number) => {
    try {
      const response = await skincareRoutineService.deleteSkincareRoutine(skincareRoutineId);
      if (response?.success) {
        toast.success(t("deleteSuccess"));
        setRoutines((prev) => prev.filter((routine) => routine.skincareRoutineId !== skincareRoutineId));
      } else {
        toast.error(response?.result?.message || t("deleteError"));
      }
    } catch (error) {
      console.error("Error deleting routine:", error);
      toast.error(t("deleteError"));
    }
  };

  const headers = [
    { label: t("routineName"), key: "name", searchable: true },
    { label: t("description"), key: "description" },
    { label: t("step"), key: "totalSteps" },
    { label: t("targetSkinTypes"), key: "targetSkinTypes" },
  ];

  return (
    <div className="p-6 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-4">
        <Table
          headers={headers}
          data={displayedRoutines}
          actions={(row) => (
            <div className="flex space-x-2">
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={() => handleEdit(row.skincareRoutineId as number)}
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDelete(row.skincareRoutineId as number)}
              >
                <Trash className="w-5 h-5" />
              </button>
            </div>
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

export default RoutineManagementPage;

