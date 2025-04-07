import { AppDispatch, RootState } from '@/store';
import { fetchBranches, setBranchId } from '@/store/slice/branchSlice';
import { Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const BranchComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { branches, branchId, loading } = useSelector((state: RootState) => state.branch);
  const [page] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    dispatch(fetchBranches({ status: 'active', page, pageSize }));
  }, [dispatch, page]);

  const handleBranchChange = (value: number) => {
    dispatch(setBranchId(value));
  };

  return (
    <div>
      <h3>Select Branch</h3>
      <Select
        value={branchId}
        onChange={handleBranchChange}
        loading={loading}
        style={{ width: 200 }}
      >
        {branches.map((branch) => (
          <Select.Option key={branch.branchId} value={branch.branchId}>
            {branch.branchName}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default BranchComponent;
