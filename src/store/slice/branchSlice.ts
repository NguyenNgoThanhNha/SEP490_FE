import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import branchService from '../../services/branchService';
import { TBranch } from '@/types/branch.type';
import toast from 'react-hot-toast';

interface BranchState {
  branches: TBranch[];
  branchId: number | null;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: BranchState = {
  branches: [],
  branchId: null,
  totalPages: 0,
  loading: false,
  error: null,
};

export const fetchBranches = createAsyncThunk(
  'branch/fetchBranches',
  async ({ status, page, pageSize }: { status: string; page: number; pageSize: number }, { rejectWithValue }) => {
    try {
      const response = await branchService.getAllBranch({ status, page, pageSize });
      if (response?.success) {
        return {
          branches: response.result?.data || [],
          totalPages: response.result?.pagination?.totalPage || 0,
        };
      } else {
        toast.error(response.result?.message || 'Failed to fetch branches.');
        return rejectWithValue(response.result?.message || 'Failed to fetch branches.');
      }
    } catch {
      toast.error('Failed to fetch branches.');
      return rejectWithValue('Failed to fetch branches.');
    }
  }
);

const branchSlice = createSlice({
  name: 'branch',
  initialState,
  reducers: {
    setBranchId: (state, action) => {
      state.branchId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranches.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.loading = false;
        state.branches = action.payload.branches;
        state.totalPages = action.payload.totalPages;
        if (action.payload.branches.length > 0) {
          state.branchId = action.payload.branches[0].branchId;
        }
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setBranchId } = branchSlice.actions;
export default branchSlice.reducer;
