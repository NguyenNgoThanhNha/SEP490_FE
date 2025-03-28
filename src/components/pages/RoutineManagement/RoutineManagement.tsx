import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Edit} from "lucide-react";
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

const RoutineManagementPage = () => {
  const [routines, setRoutines] = useState<TRoutine[]>([]);
  const [displayedRoutines, setDisplayedRoutines] = useState<TRoutine[]>([]);
  const [, setLoading] = useState(false);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchRoutines = async () => {
    try {
      setLoading(true);
      const response = await routineService.getListSkincareRoutines();
      if (response?.success) {
        const allRoutines = response.result?.data || [];
        setRoutines(allRoutines);
        setTotalPages(Math.ceil(allRoutines.length / pageSize)); // Calculate pages
        setDisplayedRoutines(allRoutines.slice(0, pageSize)); // Show first page
      } else {
        toast.error(response.result?.message || "Failed to fetch routines.");
      }
    } catch {
      toast.error("Failed to fetch routines.");
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
    setDisplayedRoutines(routines.slice(start, end)); // Paginate manually
    setTotalPages(Math.ceil(routines.length / pageSize)); // Recalculate pages
  }, [page, pageSize, routines]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setPage(1); // Reset to first page
  };

  const handleEdit = (skincareRoutineId: number) => {
    navigate(`/routine-management/${skincareRoutineId}`);
  };

  const headers = [
    { label: "Routine Name", key: "name", searchable: true },
    { label: "Description", key: "description" },
    { label: "Steps", key: "steps" },
    { label: "Frequency", key: "frequency" },
  ];

  return (
    <div className="p-6 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-4">
        <Table
          headers={headers}
          selectable={true}
          data={displayedRoutines}
          actions={(row) => (
            <button
              className="text-blue-500 hover:text-blue-700"
              onClick={() => handleEdit(row.skincareRoutineId as number)}
            >
              <Edit className="w-5 h-5" />
            </button>
          )}
        />
      </div>
      <div className="absolute right-10 mt-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="whitespace-nowrap text-gray-400 text-sm">Number of rows per page</span>
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
              {Array.from({ length: totalPages }, (_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink onClick={() => handlePageChange(index + 1)} isActive={page === index + 1}>
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
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

export default RoutineManagementPage;

