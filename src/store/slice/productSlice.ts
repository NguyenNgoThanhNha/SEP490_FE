import { TProduct } from '@/types/product.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProductState {
  products: TProduct[]; 
  productDetail: TProduct | null; 
}

const initialState: ProductState = {
  products: [],
  productDetail: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<TProduct[]>) => {
      state.products = action.payload;
    },
    setProductDetail: (state, action: PayloadAction<TProduct>) => {
      state.productDetail = action.payload;
    },
    addProduct: (state, action: PayloadAction<TProduct>) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action: PayloadAction<TProduct>) => {
      const index = state.products.findIndex((p) => p.productId === action.payload.productId);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct: (state, action: PayloadAction<number>) => {
      state.products = state.products.filter((p) => p.productId !== action.payload);
    },
  },
});

export const { setProducts, setProductDetail, addProduct, updateProduct, deleteProduct } = productSlice.actions;
export default productSlice.reducer;
