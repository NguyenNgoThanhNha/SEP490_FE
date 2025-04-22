export type TProduct = {
    productBranchId: number;
    stockQuantity: number;
    productId: number; 
    productName: string; 
    productDescription: string; 
    price: number; 
    dimension: string; 
    quantity: number; 
    discount: number; 
    categoryId: number; 
    companyId: number; 
    categoryName: string; 
    companyName: string; 
    status: "Active" | "Sold Out"; 
    createdDate: string; 
    updatedDate: string; 
    images: File;
    brand: string    
  };
  