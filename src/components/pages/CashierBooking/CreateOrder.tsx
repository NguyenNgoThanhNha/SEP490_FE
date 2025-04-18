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
import { useSelector } from "react-redux";

interface SelectedProduct {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}

const EmployeeStore: React.FC = () => {
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

  useEffect(() => {
    fetchProducts(branchId);
    fetchVouchers();
  }, []);

  const fetchProducts = async (branchId: number) => {
    try {
      const response = await productService.filterProducts({ branchId });
      const formattedProducts = response.result?.data.map((item: TProduct) => ({
        productId: item.productId,
        productName: item.productName || "",
        price: item.price || 0,
        categoryId: item.categoryId || null,
        stockQuantity: item.stockQuantity || 0,
        images: item.images || [],
      }));
      setProducts(formattedProducts);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  const fetchVouchers = async () => {
    try {
      const response = await voucherService.getAllVoucher({ Status: "Active" });
      setVouchers(response.result?.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách voucher:", error);
    }
  };

  const updateProductQuantity = (product: TProduct, quantity: number) => {
    setSelectedProducts((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.productId !== product.productId);
      }
      const existing = prev.find((item) => item.productId === product.productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.productId ? { ...item, quantity } : item
        );
      }
      return [...prev, { productId: product.productId, productName: product.productName, price: product.price, quantity }];
    });
  };

  const totalAmount = selectedProducts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const finalAmount = totalAmount - discountAmount;

  const handleApplyVoucher = () => {
    const selected = vouchers.find(v => v.code === voucherCode);
    if (!selected) {
      alert("Mã giảm giá không hợp lệ!");
      return;
    }
    setDiscountAmount(selected.discountAmount || 0);
    alert(`Áp dụng mã giảm ${selected.discountAmount.toLocaleString()} VND thành công!`);
  };

  const handleCheckout = async () => {
    try {
      if (selectedProducts.length === 0) return;

      const orderPayload = {
        userId: userId as number,
        paymentMethod,
        shippingCost: 1,
        products: selectedProducts.map((item) => ({
          productBranchId: item.productId,
          quantity: item.quantity,
        })),
      };

      const response = await orderService.createOrderFull(orderPayload);

      if (!response.success) {
        alert(`Lỗi tạo đơn hàng: ${response.result?.message}`);
        return;
      }

      const orderId = response.result?.data;
      if (!orderId) throw new Error("Không tìm thấy orderId");

      if (paymentMethod === "cash") {
        alert("Đơn hàng đã được tạo và thanh toán bằng tiền mặt thành công!");
        setSelectedProducts([]);
      } else {
        const confirmData = {
          orderId,
          totalAmount: finalAmount.toString(),
          request: {
            returnUrl: `${window.location.origin}/payment-noti`,
            cancelUrl: `${window.location.origin}/payment-cancel`,
          },
        };
        console.log("Xác nhận đơn hàng với PayOS:", confirmData);
        const payosResponse = await orderService.confirmOrderProduct(confirmData);
        if (payosResponse.success && payosResponse.result?.data) {
          window.location.href = payosResponse.result.data;
        } else {
          alert(`Lỗi khi xác nhận thanh toán PayOS: ${payosResponse.result?.message}`);
        }
      }
    } catch (error) {
      console.error("Lỗi khi xử lý thanh toán:", error);
      alert("Đã xảy ra lỗi khi thanh toán.");
    }
  };

  // const filteredProducts = products.filter((product) =>
  //   product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    <div className="flex flex-col md:flex-row max-w-5xl mx-auto p-4 gap-4">
      <div className="md:w-2/3 w-full">
        <h1 className="text-2xl font-bold text-center my-4 text-[#516D19]">Cửa hàng nhân viên</h1>
        <Input
          inputMode="numeric"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mb-4 rounded-lg"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.productId} className="p-2 hover:shadow-md transition-shadow h-full">
              <CardContent className="flex flex-col items-center p-2 h-full">
                <img
                  src={product.images[0] || "https://i.pinimg.com/736x/fe/9f/c5/fe9fc53618e47885bf815cb9a2699b75.jpg"}
                  alt={product.productName}
                  className="w-24 h-24 object-cover rounded mb-2"
                />
                <h3 className="text-sm font-semibold text-center line-clamp-2 min-h-[3rem]">{product.productName}</h3>
                <p className="text-primary font-bold mt-1">{product.price.toLocaleString()} VND</p>

                <div className="flex-grow" />

                <Button onClick={() => updateProductQuantity(product, 1)} className="mt-auto w-full bg-[#516D19]">
                  Thêm
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="md:w-1/3 w-full md:sticky md:top-4 md:self-start">
        <h2 className="text-xl font-bold mb-2">Giỏ hàng</h2>

        <div className="border p-4 rounded-lg bg-gray-50 shadow-sm">
          <div className="mb-2">
            <RegisterWithPhoneOrEmail
              onRegisterSuccess={(id) => setUserId(id)}
            />
          </div>
          {selectedProducts.length > 0 ? (
            <>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {selectedProducts.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between items-center text-sm p-2 bg-white rounded"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{item.productName}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateProductQuantity({ ...item } as TProduct, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateProductQuantity({ ...item } as TProduct, item.quantity + 1)}
                        >
                          +
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 ml-auto"
                          onClick={() => updateProductQuantity({ ...item } as TProduct, 0)}
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

              {/* Apply Voucher */}
              <div className="my-2">
                <label className="block mb-1 font-semibold">Mã giảm giá</label>
                <div className="flex gap-2">
                  <Select
                    placeholder="Chọn mã giảm giá"
                    value={voucherCode}
                    onChange={(value) => setVoucherCode(value)}
                    className="w-full"
                  >
                    {vouchers.map((voucher) => (
                      <Select.Option key={voucher.code} value={voucher.code}>
                        {voucher.code} - Giảm {voucher.discountAmount.toLocaleString()} VND
                      </Select.Option>
                    ))}
                  </Select>
                  <Button variant="outline" onClick={handleApplyVoucher}>
                    Áp dụng
                  </Button>
                </div>
                {discountAmount > 0 && (
                  <p className="text-[#516d19] text-sm mt-1">Giảm giá: {discountAmount.toLocaleString()} VND</p>
                )}
              </div>

              <div className="text-right font-bold text-lg text-[#516D19]">
                Tổng: {finalAmount.toLocaleString()} VND
              </div>

              <div className="mt-4">
                <Button
                  className="w-full mb-2"
                  variant={paymentMethod === "cash" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("cash")}
                >
                  Thanh toán bằng tiền mặt
                </Button>
                <Button
                  className="w-full"
                  variant={paymentMethod === "payos" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("payos")}
                >
                  Thanh toán qua PayOS
                </Button>
              </div>

              {/* Checkout */}
              <div className="mt-6">
                <Button className="w-full bg-[#516D19]" onClick={handleCheckout}>
                  Thanh toán
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-400">Giỏ hàng trống</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeStore;
