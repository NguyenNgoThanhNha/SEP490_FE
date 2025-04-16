import { useEffect, useState } from "react";
import { Edit, Trash } from "lucide-react";
import { Table } from "@/components/organisms/Table/Table";
import toast from "react-hot-toast";
import { Modal, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/atoms/ui/pagination";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { formatPrice } from "@/utils/formatPrice";
import { Badge } from "@/components/atoms/ui/badge";
import AddServiceModal from "./AddBranchService";
import { TBranchService } from "@/types/branchService.type";
import serviceBranchService from "@/services/serviceBranchService";

const BranchServiceManagementPage = () => {
    const [branchServices, setBranchServices] = useState<TBranchService[]>([]);
    const [, setLoading] = useState(false);
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const branchIdRedux = useSelector((state: RootState) => state.branch.branchId);
    const branchId = branchIdRedux || Number(localStorage.getItem("branchId"));
  
    const fetchBranchService = async (branchId: number, page: number, pageSize: number) => {
        try {
            setLoading(true);
            const response = await serviceBranchService.getAllBranchService(branchId, page, pageSize);
            if (response?.success) {
                setBranchServices(response.result?.data);
                setTotalPages(response.result?.pagination?.totalPage || 0);
            } else {
                toast.error(response.result?.message || "Failed to fetch branch services.");
            }
        } catch {
            toast.error("Failed to fetch branch services.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: number) => {
        Modal.confirm({
            title: "Are you sure?",
            content: "This action cannot be undone.",
            okText: "Yes, delete",
            cancelText: "Cancel",
            onOk: async () => {
                try {
                    const response = await serviceBranchService.deleteBranchService(id);
                    if (response?.success) {
                        toast.success("Branch service deleted successfully.");
                        setBranchServices(prev => prev.filter(item => item.id !== id));
                    } else {
                        toast.error(response.result?.message || "Failed to delete branch service.");
                    }
                } catch {
                    toast.error("Failed to delete branch service.");
                }
            },
        });
    };

    const handleEdit = (serviceId: number) => {
        navigate(`/branch-service-management/${serviceId}`);
    };

    const handlePageChange = (newPage: number) => {
        if (!branchId) {
            toast.error("Branch ID is required!");
            return;
        }

        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handlePageSizeChange = (value: number) => {
        setPageSize(value);
        setPage(1);
    };
    useEffect(() => {
        if (branchId) {
            fetchBranchService(branchId, page, pageSize);
        }
    }, [branchId, page, pageSize]);
    const handleServiceAdded = () => {
        if (branchId) {
            fetchBranchService(branchId, page, pageSize);
        }
    };

    const headers = [
        {
            label: "Service",
            key: "service.name",
        },
        {
            label: "Price",
            key: "service.price",
            sortable: true,
            render: (value: number) => `${formatPrice(value)} VND`
        },
        {
            label: "Duration",
            key: "service.duration",
            render: (value: number) => `${value} minute(s)`
        },
        {
            label: "Status",
            key: "status",
            render: (status: string) => (
                <Badge variant={status === "Active" ? "active" : "inactive"}>
                    {status}
                </Badge>
            ),
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
            <div className="my-4 flex justify-between items-center">
                <button
                    className="px-4 py-1 bg-[#516d19] text-white rounded-lg hover:bg-green-700 ml-auto"
                    onClick={() => setIsModalOpen(true)}
                >
                    Add Service
                </button>
            </div>
            <AddServiceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                branchId={branchId ?? 0}
                onServiceAdded={handleServiceAdded}
            />
            <div className="bg-white shadow-md rounded-lg p-4">
                <Table
                    headers={headers}
                    selectable={true}
                    data={branchServices.length > 0 ? branchServices : []}
                    badgeConfig={{
                        key: "status",
                        values: {
                            Active: { label: "Active", color: "green", textColor: "white" },
                            SoldOut: { label: "Sold Out", color: "red", textColor: "white" },
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

export default BranchServiceManagementPage;
