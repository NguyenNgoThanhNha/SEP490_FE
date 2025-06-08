"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/atoms/ui/button"
import type { TProduct } from "@/types/product.type"
import { useTranslation } from "react-i18next"
import branchProductService from "@/services/branchProductService"
import { Input } from "@/components/atoms/ui/input"
import { Search, ShoppingCart, Plus, Minus, X, BarChart4, Grid2X2 } from "lucide-react"
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
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid")
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setLoading(true)
    branchProductService
      .getAllBranchProduct(branchId, 1, 100)
      .then((res) => {
        const productData = res.result?.data?.map((item: TProduct) => item.product) || []
        setProducts(productData)
        setFilteredProducts(productData)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [branchId])

  useEffect(() => {
    // Filter by search query and category
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

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [])

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 bg-white z-10 pb-2 space-y-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder={t("searchProducts")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              className="h-10 w-10 rounded-none rounded-l-md"
              onClick={() => setViewMode("list")}
            >
              <BarChart4 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              className="h-10 w-10 rounded-none rounded-r-md"
              onClick={() => setViewMode("grid")}
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

               {totalSelectedProducts > 0 && (
          <div className="flex items-center justify-between bg-primary/10 p-2 rounded-md">
            <div className="flex items-center gap-2">
              {/* <ShoppingCart className="h-5 w-5 text-primary" /> */}
              <span>
                <Badge variant="secondary" className="mr-1">
                  {totalSelectedItems}
                </Badge>
                {t("itemsSelected")}
              </span>
            </div>
            <Button size="sm" variant="outline" onClick={() => setQuantities({})}>
              {t("clear")}
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="products" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="products">{t("products")}</TabsTrigger>
          <TabsTrigger value="cart">
            {t("cart")} {totalSelectedProducts > 0 && `(${totalSelectedProducts})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Spin tip={t("loadingProducts")} />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? t("noProductsFound") : t("noProductsAvailable")}
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto py-2 pr-1">
              {filteredProducts.map((product) => {
                const isSelected = !!quantities[product.productId]
                return (
                  <Card
                    key={product.productId}
                    className={`overflow-hidden transition-all ${
                      isSelected ? "border-primary ring-1 ring-primary/20" : ""
                    }`}
                  >
                    <div
                      className="h-24 bg-muted relative cursor-pointer"
                      onClick={() => (!isSelected ? handleIncreaseQuantity(product.productId) : null)}
                    >
                     
                     {product.images?.[0] ? (
                        <img
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.productName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                     
                      {isSelected && (
                        <div className="absolute top-1 right-1">
                          <Badge variant="default" className="bg-primary">
                            {quantities[product.productId]}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-2">
                      <div className="font-medium text-sm line-clamp-1 mb-1">{product.productName}</div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-primary font-semibold">{product.price?.toLocaleString()} VND</div>
                        {isSelected ? (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleDecreaseQuantity(product.productId)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleIncreaseQuantity(product.productId)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2"
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
            <div className="max-h-[60vh] overflow-y-auto py-2 pr-1 space-y-2">
              {filteredProducts.map((product) => {
                const isSelected = !!quantities[product.productId]
                return (
                  <div
                    key={product.productId}
                    className={`flex items-center justify-between border p-2 rounded-lg transition-all ${
                      isSelected ? "border-primary bg-primary/5 shadow-sm" : "hover:border-muted-foreground"
                    }`}
                  >
                    <div
                      className="flex items-center gap-3 flex-1 cursor-pointer"
                      onClick={() => (!isSelected ? handleIncreaseQuantity(product.productId) : null)}
                    >
                      {/* <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                        
                          <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                      
                      </div> */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium line-clamp-1">{product.productName}</div>
                        <div className="text-sm text-primary font-semibold">{product.price?.toLocaleString()} VND</div>
                      </div>
                    </div>
                    {isSelected ? (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDecreaseQuantity(product.productId)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <div className="w-8 text-center font-medium">{quantities[product.productId]}</div>
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
                      <Button variant="outline" size="sm" onClick={() => handleIncreaseQuantity(product.productId)}>
                        <Plus className="h-4 w-4 mr-1" /> {t("add")}
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cart" className="flex-1 overflow-hidden">
          {totalSelectedProducts === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-8 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mb-2" />
              <p>{t("cartEmpty")}</p>  
            </div>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto py-2 pr-1 space-y-2">
              {selectedProductsData.map((product) => (
                <div key={product.productId} className="flex items-center justify-between border p-3 rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    {/* <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                    
                        <ShoppingCart className="h-6 w-6 text-muted-foreground" />
      
                    </div> */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium line-clamp-1">{product.productName}</div>
                      <div className="text-sm text-primary font-semibold">{product.price?.toLocaleString()} VND</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
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
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveProduct(product.productId)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="sticky bottom-0 pt-4 bg-white">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-sm text-muted-foreground">{t("total")}</div>
            <div className="font-bold text-lg">
              {selectedProductsData
                .reduce((sum, product) => sum + (product.price || 0) * (quantities[product.productId] || 0), 0)
                .toLocaleString()}{" "}
              VND
            </div>
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