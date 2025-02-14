import React from 'react';
import { Input } from './ui/input';

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ placeholder = 'Tìm kiếm...', value, onChange }) => {
  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: '300px', marginBottom: '16px' }}
    />
  );
};

export default SearchInput;
