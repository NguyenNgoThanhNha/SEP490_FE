import { Button } from "@/components/atoms/ui/button";
import { Card, CardContent } from "@/components/atoms/ui/card";
import { Input } from "@/components/atoms/ui/input";
import RegisterWithPhoneOrEmail from "@/components/organisms/BookingStep/RegisterForm";
import orderService from "@/services/orderService";
import productService from "@/services/productService";
import voucherService from "@/services/voucherService";
import { RootState } from "@/store";
import { TProduct } from "@/types/product.type";
import { TVoucher } from "@/types/voucher.type";
import { Select } from "antd";
import { Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next"; 

interface SelectedProduct {
  productBranchId: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}

const EmployeeStore: React.FC = () => {
  const { t } = useTranslation(); 
  const [products, setProducts] = useState<TProduct[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "payos">("cash");
  const [userId, setUserId] = useState<number | null>(null);
  const branchIdRedux = useSelector((state: RootState) => state.branch.branchId);
  const branchId = branchIdRedux || Number(localStorage.getItem("branchId"));
  const [vouchers, setVouchers] = useState<TVoucher[]>([]);
  const [voucherCode, setVoucherCode] = useState<string>("");
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [bonusPoint, setBonusPoint] = useState<number>(0);

  useEffect(() => {
    fetchProducts(branchId);
    fetchVouchers();
  }, []);

  const fetchProducts = async (branchId: number) => {
    try {
      const response = await productService.filterProducts({ branchId });
      const formattedProducts = response.result?.data.map((item: TProduct) => ({
        productId: item.productBranchId,
        productBranchId: item.productBranchId,
        productName: item.productName || "",
        price: item.price || 0,
        categoryId: item.categoryId || null,
        stockQuantity: item.stockQuantity || 0,
        images: item.images || [],
      }));
      setProducts(formattedProducts);
    } catch (error) {
      console.error(t("fetchProductsError"), error); 
    }
  };

  const fetchVouchers = async () => {
    try {
      const response = await voucherService.getAllVoucher({ Status: "Active" });
      setVouchers(response.result?.data || []);
    } catch (error) {
      console.error(t("fetchVouchersError"), error); 
    }
  };

  const updateProductQuantity = (product: TProduct, quantity: number) => {
    setSelectedProducts((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.productBranchId !== product.productBranchId);
      }
      const existing = prev.find((item) => item.productBranchId === product.productBranchId);
      if (existing) {
        return prev.map((item) =>
          item.productBranchId === product.productBranchId ? { ...item, quantity } : item
        );
      }
      return [
        ...prev,
        {
          productId: product.productBranchId,
          productBranchId: product.productBranchId,
          productName: product.productName,
          price: product.price,
          quantity,
        },
      ];
    });
  };

  const totalAmount = selectedProducts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const finalAmount = totalAmount - discountAmount;

  const handleApplyVoucher = () => {
    if (!voucherCode) {
      setDiscountAmount(0);
      toast(t("voucherRemoved"));
      return;
    }

    const selected = vouchers.find((v) => v.code === voucherCode);
    if (!selected) {
      toast.error(t("invalidVoucher")); 
      return;
    }

    if (bonusPoint < selected.requirePoint) {
      toast.error(t("notEnoughPoints"));
      return;
    }

    if (totalAmount < selected.minOrderAmount) {
      toast.error(t("orderAmountTooLow", { min: selected.minOrderAmount.toLocaleString() })); 
      return;
    }

    setDiscountAmount(selected.discountAmount || 0);
    toast.success(t("voucherApplied", { discount: selected.discountAmount.toLocaleString() })); 
  };

  const handleCheckout = async () => {
    try {
      if (selectedProducts.length === 0) return;

      const orderPayload = {
        userId: userId as number,
        paymentMethod,
        shippingCost: 1,
        products: selectedProducts.map((item) => ({
          productBranchId: item.productBranchId,
          quantity: item.quantity,
        })),
      };

      const response = await orderService.createOrderFull(orderPayload);

      if (!response.success) {
        toast.error(t("orderCreationError", { message: response.result?.message })); 
        return;
      }

      const orderId = response.result?.data;
      if (!orderId) throw new Error(t("orderIdNotFound")); 

      if (paymentMethod === "cash") {
        const updateResponse = await orderService.updateOrderStatus(orderId, "Completed");
        if (!updateResponse.success) {
          toast.error(t("orderStatusUpdateError", { message: updateResponse.result?.message })); 
          return;
        }
        toast.success(t("orderCreatedAndPaid")); 
        setSelectedProducts([]);
      } else {
        const confirmData = {
          orderId,
          totalAmount: finalAmount.toString(),
          request: {
            returnUrl: `${window.location.origin} payment-noti`,
            cancelUrl: `${window.location.origin}/payment-cancel`,
          },
        };
        const payosResponse = await orderService.confirmOrderProduct(confirmData);
        if (payosResponse.success && payosResponse.result?.data) {
          window.location.href = payosResponse.result.data;
        } else {
          toast.error(t("payosError", { message: payosResponse.result?.message })); 
        }
      }
    } catch (error) {
      console.error(t("checkoutError"), error); 
      toast.error(t("checkoutError"));
    }
  };

  return (
    <div className="flex flex-col md:flex-row max-w-5xl mx-auto p-4 gap-4">
      <div className="md:w-2/3 w-full">
        <h1 className="text-2xl font-bold text-center my-4 text-[#516D19]">{t("employeeStore")}</h1>
        <Input
          inputMode="numeric"
          placeholder={t("searchProduct")} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mb-4 rounded-lg"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.productBranchId} className="p-2 hover:shadow-md transition-shadow h-full">
              <CardContent className="flex flex-col items-center p-2 h-full">
                <img
                  src={
                    product.images[0] ||
                    "https://i.pinimg.com/736x/fe/9f/c5/fe9fc53618e47885bf815cb9a2699b75.jpg"
                  }
                  alt={product.productName}
                  className="w-24 h-24 object-cover rounded mb-2"
                />
                <h3 className="text-sm font-semibold text-center line-clamp-2 min-h-[3rem]">
                  {product.productName}
                </h3>
                <p className="text-primary font-bold mt-1">{product.price.toLocaleString()} VND</p>

                <div className="flex-grow" />

                <Button
                  onClick={() => updateProductQuantity(product, 1)}
                  className="mt-auto w-full bg-[#516D19]"
                >
                  {t("add")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="md:w-1/3 w-full md:sticky md:top-4 md:self-start">
        <h2 className="text-xl font-bold mb-2">{t("cart")}</h2>

        <div className="border p-4 rounded-lg bg-gray-50 shadow-sm">
          <div className="mb-2">
            <RegisterWithPhoneOrEmail
              onRegisterSuccess={(id, points) => {
                setUserId(id);
                setBonusPoint(points);
              }}
            />          </div>
          {selectedProducts.length > 0 ? (
            <>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {selectedProducts.map((item) => (
                  <div
                    key={item.productBranchId}
                    className="flex justify-between items-center text-sm p-2 bg-white rounded"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{item.productName}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateProductQuantity(
                              { ...item } as TProduct,
                              item.quantity - 1
                            )
                          }
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateProductQuantity(
                              { ...item } as TProduct,
                              item.quantity + 1
                            )
                          }
                        >
                          +
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 ml-auto"
                          onClick={() =>
                            updateProductQuantity({ ...item } as TProduct, 0)
                          }
                        >
                          <Trash />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right font-semibold ml-2 ">
                      {(item.price * item.quantity).toLocaleString()} VND
                    </div>
                  </div>
                ))}
              </div>

              <div className="my-2">
                <label className="block mb-1 font-semibold">{t("voucherCode")}</label>
                <div className="flex gap-2">
                  <Select
                    placeholder={t("selectVoucher")}
                    value={voucherCode}
                    onChange={(value) => setVoucherCode(value || "")} 
                    className="w-full"
                  >
                    <Select.Option value="">{t("noVoucher")}</Select.Option> 
                    {vouchers.map((voucher) => (
                      <Select.Option key={voucher.code} value={voucher.code}>
                        {voucher.code} - {t("Discount")} {voucher.discountAmount.toLocaleString()} VND
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="flex justify-end mt-2">
                <Button variant="outline" onClick={handleApplyVoucher}>
                  {t("apply")}
                </Button>
              </div>

              {discountAmount > 0 && (
                <p className="text-[#516d19] text-sm mt-1">
                  {t("discountAmount")}: {discountAmount.toLocaleString()} VND
                </p>
              )}
              <div className="text-right font-bold text-lg text-[#516D19]">
                {t("total")}: {finalAmount.toLocaleString()} VND
              </div>

              <div className="mt-4">
                <Button
                  className="w-full mb-2"
                  variant={paymentMethod === "cash" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("cash")}
                >
                  {t("payWithCash")}
                </Button>
                <Button
                  className="w-full"
                  variant={paymentMethod === "payos" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("payos")}
                >
                  {t("payWithPayOS")}
                </Button>
              </div>

              <div className="mt-6">
                <Button className="w-full bg-[#516D19]" onClick={handleCheckout}>
                  {t("checkout")}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-400">{t("emptyCart")}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeStore;
