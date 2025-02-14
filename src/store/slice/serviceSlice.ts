import { TService } from '@/types/serviceType';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ServiceState {
  services: TService[]; 
  serviceDetail: TService | null; 
}

const initialState: ServiceState = {
  services: [],
  serviceDetail: null,
};

const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    setServices: (state, action: PayloadAction<TService[]>) => {
      state.services = action.payload;
    },
    setServiceDetail: (state, action: PayloadAction<TService>) => {
      state.serviceDetail = action.payload;
    },
    addService: (state, action: PayloadAction<TService>) => {
      state.services.push(action.payload);
    },
    updateService: (state, action: PayloadAction<TService>) => {
      const index = state.services.findIndex((s) => s.serviceId === action.payload.serviceId);
      if (index !== -1) {
        state.services[index] = action.payload;
      }
    },
    deleteService: (state, action: PayloadAction<number>) => {
      state.services = state.services.filter((s) => s.serviceId !== action.payload);
    },
  },
});

export const { setServices, setServiceDetail, addService, updateService, deleteService } = serviceSlice.actions;
export default serviceSlice.reducer;
