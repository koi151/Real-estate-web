import React, { useState } from 'react';
import { Button } from 'antd';
import Search, { SearchProps } from 'antd/es/input/Search';
import { IoFilter } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

import './filterBox.scss'

interface FilterBoxProps {
  onKeywordChange: (newKeyword: string | null) => void;
  onStatusChange: (newStatus: string | null) => void;
}

const FilterBox: React.FC<FilterBoxProps> = ({ onKeywordChange, onStatusChange }) => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const onSearch: SearchProps['onSearch'] = (value) => {
    setKeyword(value);
    onKeywordChange(value); // notify the parent about the keyword change
    navigate(`/admin/properties?keyword=${value}`);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onStatusChange(value);
    navigate(`/admin/properties?status=${value}`);
  };

  return (
    <div className='filter-box'>
      <div className='filter-box__button-wrapper'>
        <Search
          className='search-box'
          placeholder="Search by title..." 
          onSearch={onSearch}
        />
        <Button className='filter-button'>
          Filters <IoFilter/>
        </Button>
      </div>

      <div className='filter-box__detail'>
        <div className='status-filter'>
          <span>Filter by status:</span>
          <span className='status-filter__status-wrap mr-2'>
            <Button onClick={() => handleStatusChange('')} className='ml-1'>All</Button>
            <Button onClick={() => handleStatusChange('active')} className='ml-1'>Active</Button>
            <Button onClick={() => handleStatusChange('inactive')} className='ml-1'>Inactive</Button>
          </span>
        </div>
      </div>
    </div>
  )
};

export default FilterBox;
