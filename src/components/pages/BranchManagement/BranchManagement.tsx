import { useEffect, useState } from "react";
import { Modal, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { Edit, Trash } from "lucide-react";
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
import { TBranch } from "@/types/branch.type";
import branchService from "@/services/branchService";


const BranchManagementPage = () => {
  const [branches, setBranches] = useState<TBranch[]>([]);
  const [, setLoading] = useState(false);
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages,] = useState(1); 

  const fetchBranches= async (page: number, pageSize: number, status: "Active") => {
    try {
      setLoading(true);
      const response = await branchService.getAllBranch({page, pageSize, status});
      if (response?.success) {
        setBranches(response.result?.data || []);
      } else {
        toast.error(response.result?.message || "Failed to fetch branches.");
      }
    } catch {
      toast.error("Failed to fetch branches.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches(page, pageSize, "Active");
  }, [page, pageSize]);

  const handleDelete = (branchId: number) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This action cannot be undone.",
      okText: "Yes, delete",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const response = await branchService.deleteBranch(branchId);
          if (response?.success) {
            toast.success("Branch deleted successfully.");
            fetchBranches(page, pageSize, "Active"); 
          } else {
            toast.error(response.result?.message || "Failed to delete branch.");
          }
        } catch {
          toast.error("Failed to delete branch.");
        }
      },
    });
  };

  const handleEdit = (branchId: number) => {
    navigate(`/branchs-management/${branchId}`);
  };

  const handleExport = () => {
    const exportData = branches.map((branch) => ({
      "Branch Name": branch.branchName,
      "Address": branch.branchAddress,
      "Phone": branch.branchPhone,
      "Longitude": branch.longAddress,
      "Latitude": branch.latAddress,
      "Status": branch.status,
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Branches");
  
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, `branches_export_${Date.now()}.xlsx`);
  };
  

  const headers = [
    { label: "Branch Name", key: "branchName", searchable: true },
  { label: "Branch Address", key: "branchAddress", searchable: true  },
  { label: "Phone", key: "branchPhone", searchable: true },
  { label: "District", key: "district" },  
  { label: "WardCode", key: "wardCode" },    
  { label: "Status", key: "status" },
  ];

  return (
    <div className="p-6 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-4">
        <Table
          headers={headers}
          data={branches}
          selectable
          onExport={handleExport}
          actions={(row) => (
            <>
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={() => handleEdit(row.voucherId as number)}
              >
                <Edit className="w-5 h-5" />
              </button>
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
          <span>Rows per page:</span>
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
                {size}
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

export default BranchManagementPage;
