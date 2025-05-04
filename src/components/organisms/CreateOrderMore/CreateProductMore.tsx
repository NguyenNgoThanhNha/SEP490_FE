import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/atoms/ui/button"
import type { TProduct } from "@/types/product.type"
import { useTranslation } from "react-i18next"
import branchProductService from "@/services/branchProductService"
import { Input } from "@/components/atoms/ui/input"
import { Search, ShoppingCart, Plus, Minus, X, BarChart4, Grid2X2, Package } from "lucide-react"
import { Badge } from "@/components/atoms/ui/badge"
import { Spin } from "antd"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/atoms/ui/tabs"
import { Card, CardContent } from "@/components/atoms/ui/card"

interface CreateProductMoreProps {
  branchId: number
  onSubmit: (data: {
    productIds: number[]
    promotionId: number
    quantity: number[]
    status: string
    statusPayment: string
    branchId: number
  }) => void
}

const CreateProductMore: React.FC<CreateProductMoreProps> = ({ branchId, onSubmit }) => {
  const { t } = useTranslation()
  const [products, setProducts] = useState<TProduct[]>([])
  const [filteredProducts, setFilteredProducts] = useState<TProduct[]>([])
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setLoading(true)
    branchProductService
      .getAllBranchProduct(branchId, 1, 100)
      .then((res) => {
        const productData = res.result?.data?.map((item: TProduct) => ({ productId: item.productId })) || []
        setProducts(productData)
        setFilteredProducts(productData)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [branchId])

  useEffect(() => {
    let filtered = products

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((product) => product.productName.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    setFilteredProducts(filtered)
  }, [searchQuery, products])

  const handleIncreaseQuantity = (productId: number, amount = 1) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + amount,
    }))
  }

  const handleDecreaseQuantity = (productId: number) => {
    setQuantities((prev) => {
      const updated = { ...prev }
      if (updated[productId] > 1) {
        updated[productId] -= 1
      } else {
        delete updated[productId]
      }
      return updated
    })
  }

  const handleSetQuantity = (productId: number, quantity: number) => {
    setQuantities((prev) => {
      const updated = { ...prev }
      if (quantity > 0) {
        updated[productId] = quantity
      } else {
        delete updated[productId]
      }
      return updated
    })
  }

  const handleRemoveProduct = (productId: number) => {
    setQuantities((prev) => {
      const updated = { ...prev }
      delete updated[productId]
      return updated
    })
  }

  const handleSubmit = () => {
    const productIds = Object.keys(quantities).map((id) => Number(id))
    const quantity = Object.values(quantities)

    if (productIds.length === 0) {
      return
    }

    const payload = {
      productIds,
      promotionId: 0,
      quantity,
      status: "Pending",
      statusPayment: "Pending",
      branchId,
    }

    onSubmit(payload)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, productId: number) => {
    if (e.key === "Enter") {
      const value = Number.parseInt((e.target as HTMLInputElement).value)
      if (!isNaN(value)) {
        handleSetQuantity(productId, value)
      }
    }
  }

  const totalSelectedItems = Object.values(quantities).reduce((sum, qty) => sum + qty, 0)
  const totalSelectedProducts = Object.keys(quantities).length
  const selectedProductsData = products.filter((p) => quantities[p.productId])
  const totalAmount = selectedProductsData.reduce(
    (sum, product) => sum + (product.price || 0) * (quantities[product.productId] || 0),
    0,
  )

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [])

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="sticky top-0 bg-background z-10 pb-4 pt-2 px-1 border-b">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder={t("searchProducts")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 h-10 bg-muted/40"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              className="h-8"
              onClick={() => setViewMode("list")}
            >
              <BarChart4 className="h-4 w-4 mr-1" />
              {t("list")}
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              className="h-8"
              onClick={() => setViewMode("grid")}
            >
              <Grid2X2 className="h-4 w-4 mr-1" />
              {t("grid")}
            </Button>
          </div>

          {totalSelectedProducts > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setQuantities({})}>
              {t("clearAll")}
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="products" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-2 sticky top-[105px] z-10 bg-background mx-1">
          <TabsTrigger value="products" className="relative">
            {t("products")}
            {filteredProducts.length > 0 && (
              <Badge variant="secondary" className="ml-1.5 bg-muted">
                {filteredProducts.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="cart" className="relative">
            {t("cart")}
            {totalSelectedProducts > 0 && (
              <Badge variant="secondary" className="ml-1.5 bg-primary text-primary-foreground">
                {totalSelectedProducts}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="flex-1 overflow-hidden mt-2">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Spin tip={t("loadingProducts")} />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium mb-1">
                {searchQuery ? t("noProductsFound") : t("noProductsAvailable")}
              </h3>
              {searchQuery && (
                <p className="text-muted-foreground mb-4">
                  {t("tryDifferentSearch")} "{searchQuery}"
                </p>
              )}
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  {t("clearSearch")}
                </Button>
              )}
            </div>
          ) : (
            <div className="h-[calc(100vh-280px)] overflow-y-auto pr-1">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 gap-3 p-1">
                  {filteredProducts.map((product) => {
                    const isSelected = !!quantities[product.productId]
                    return (
                      <Card
                        key={product.productId}
                        className={`overflow-hidden transition-all ${
                          isSelected ? "border-primary bg-primary/5" : "hover:border-muted-foreground/20"
                        }`}
                      >
                        <CardContent className="p-3">
                          <div className="font-medium line-clamp-2 mb-2 min-h-[40px]">{product.productName}</div>
                          <div className="flex items-center justify-between">
                            <div className="text-primary font-semibold">{product.price?.toLocaleString()} VND</div>
                            {isSelected ? (
                              <Badge variant="secondary" className="bg-primary text-primary-foreground">
                                {quantities[product.productId]}
                              </Badge>
                            ) : null}
                          </div>
                          <div className="mt-3">
                            {isSelected ? (
                              <div className="flex items-center justify-between gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => handleDecreaseQuantity(product.productId)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="font-medium w-8 text-center">{quantities[product.productId]}</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => handleIncreaseQuantity(product.productId)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => handleIncreaseQuantity(product.productId)}
                              >
                                <Plus className="h-3 w-3 mr-1" /> {t("add")}
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <div className="space-y-2 p-1">
                  {filteredProducts.map((product) => {
                    const isSelected = !!quantities[product.productId]
                    return (
                      <div
                        key={product.productId}
                        className={`flex items-center justify-between border p-3 rounded-lg transition-all ${
                          isSelected ? "border-primary bg-primary/5" : "hover:border-muted-foreground/20"
                        }`}
                      >
                        <div
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => (!isSelected ? handleIncreaseQuantity(product.productId) : null)}
                        >
                          <div className="font-medium line-clamp-1">{product.productName}</div>
                          <div className="text-primary font-semibold mt-1">{product.price?.toLocaleString()} VND</div>
                        </div>
                        <div className="ml-4">
                          {isSelected ? (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleDecreaseQuantity(product.productId)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="font-medium w-8 text-center">{quantities[product.productId]}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleIncreaseQuantity(product.productId)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleIncreaseQuantity(product.productId)}
                            >
                              <Plus className="h-4 w-4 mr-1" /> {t("add")}
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cart" className="flex-1 overflow-hidden mt-2">
          {totalSelectedProducts === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium mb-1">{t("cartEmpty")}</h3>
              <p className="text-muted-foreground mb-4">{t("addProductsToCart")}</p>
              <Button
                variant="outline"
                onClick={() => {
                  const element = document.querySelector('[value="products"]') as HTMLElement;
                  element?.click();
                }}
              >
                {t("browseProducts")}
              </Button>
            </div>
          ) : (
            <div className="h-[calc(100vh-280px)] overflow-y-auto pr-1">
              <div className="space-y-2 p-1">
                {selectedProductsData.map((product) => (
                  <div key={product.productId} className="border p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium line-clamp-1 flex-1">{product.productName}</div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveProduct(product.productId)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-primary font-semibold">
                        {product.price?.toLocaleString()} VND
                        <span className="text-muted-foreground font-normal text-sm ml-2">
                          × {quantities[product.productId]} ={" "}
                          {((product.price || 0) * quantities[product.productId]).toLocaleString()} VND
                        </span>
                      </div>
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none rounded-l-md"
                          onClick={() => handleDecreaseQuantity(product.productId)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          value={quantities[product.productId]}
                          onChange={(e) => {
                            const value = Number.parseInt(e.target.value)
                            if (!isNaN(value)) {
                              handleSetQuantity(product.productId, value)
                            }
                          }}
                          onKeyDown={(e) => handleKeyDown(e, product.productId)}
                          className="w-12 h-8 text-center p-0 border-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none rounded-r-md"
                          onClick={() => handleIncreaseQuantity(product.productId)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="sticky bottom-0 pt-3 pb-4 px-1 bg-background border-t mt-auto">
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <div className="text-sm text-muted-foreground">{t("total")}</div>
            <div className="font-bold text-lg">{totalAmount.toLocaleString()} VND</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">{t("items")}</div>
            <div className="font-medium">{totalSelectedItems}</div>
          </div>
        </div>
        <Button onClick={handleSubmit} className="w-full" size="lg" disabled={totalSelectedProducts === 0}>
          {totalSelectedProducts > 0 ? t("addToOrder") : t("selectProducts")}
        </Button>
      </div>
    </div>
  )
}

export default CreateProductMore
