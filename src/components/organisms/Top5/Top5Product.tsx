import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import productService from "@/services/productService";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import TopItemsTable from "@/components/molecules/TopTable";

interface TopProduct {
    id: number;
    product: {
        productId: number;
        productName: string;
        price: number;
    };
    stockQuantity: number;
}

const Top5Product = () => {
    const { t } = useTranslation();
    const branchIdRedux = useSelector((state: RootState) => state.branch.branchId);
    const branchId = branchIdRedux || Number(localStorage.getItem("branchId"));

    const [topProducts, setTopProducts] = useState<TopProduct[]>([]);

    const fetchProductData = async () => {
        try {
            const response = await productService.top5Product(branchId);
            if (response.success) {
                setTopProducts(response.result?.data || []);
            } else {
                toast.error(response.result?.message || t("fetchError"));
            }
        } catch {
            toast.error(t("apiError"));
        }
    };

    useEffect(() => {
        fetchProductData();
    }, []);

    const columns = [
        {
            header: t("Product Name"),
            accessor: (item: TopProduct) => item.product.productName,
        },
        {
            header: t("Price"),
            accessor: (item: TopProduct) => `${item.product.price.toLocaleString()} VND`,
        },
        {
            header: t("Stock Quantity"),
            accessor: (item: TopProduct) => item.stockQuantity,
        },
    ];

    return (
        <div className="container mx-auto py-6 px-4">
            <h2 className="text-lg font-semibold mb-4">{t("Top 5 Best-Selling Products")}</h2>
            <TopItemsTable data={topProducts} columns={columns} />
        </div>
    );
};

export default Top5Product;
