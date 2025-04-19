export type TProduct = {
    stockQuantity: number;
    productId: number; 
    productName: string; 
    productDescription: string; 
    price: number; 
    volume: number; 
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
    images: string[];
    skintypesuitable: string;
    
  };
  