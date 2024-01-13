import React, { useEffect, useState } from 'react';
import { Button, Select, SelectProps } from 'antd';
import Search, { SearchProps } from 'antd/es/input/Search';
import { IoFilter } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

import './filterBox.scss';

interface FilterBoxProps {
  onKeywordChange: (newKeyword: string | null) => void;
  onStatusChange: (newStatus: string | null) => void;
  onSortingChange: (newSorting: {
    sortKey: string | null,
    sortValue: string | null
  }) => void;
  checkedList: string[]; 
}

const FilterBox: React.FC<FilterBoxProps> = ({ onKeywordChange, onStatusChange, onSortingChange, checkedList}) => {
  
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [sorting, setSorting] = useState<{
    sortKey: string | null;
    sortValue: string | null;
  }>({
    sortKey: '',
    sortValue: '',
  });

  const buildURL = () => {
    const params: { [key: string]: string } = {};
    if (keyword) params['keyword'] = keyword;
    if (status) params['status'] = status;
    if (sorting.sortKey && sorting.sortValue) {
      params['sortKey'] = sorting.sortKey;
      params['sortValue'] = sorting.sortValue;
    }
    console.log("status, params:", status,  params)

    return `/admin/properties${Object.keys(params).length > 0 ? `?${new URLSearchParams(params)}` : ''}`;
  };
  
  const onSearch: SearchProps['onSearch'] = (value) => {
    setKeyword(value);
  };

  useEffect(() => {
    onStatusChange(status);
    onSortingChange(sorting);
    onKeywordChange(keyword)
    navigate(buildURL());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, sorting, keyword]);  

  const handleStatusChange = (value: string) => {
    setStatus(value);
  };

  const handleSortingChange = (value: string) => {
    const [sortKey, sortValue] = value.split('-');
    setSorting({ sortKey, sortValue });
  }

  const handleMultipleChange = (type: string) => {
    navigate(`/multi-change/${type}/${checkedList}`)
  }

  const sortingOptions: SelectProps['options'] = [
    { label: 'Descending position', value: 'position-desc'},
    { label: 'Ascending position', value: 'position-asc'},
    { label: 'Descending price', value: 'price-desc'},
    { label: 'Ascending price', value: 'price-asc'},
    { label: 'Descending view', value: 'view-desc'},
    { label: 'Ascending view', value: 'view-asc'},
  ];

  const multipleChangeOptions: SelectProps['options'] = [
    { label: 'Active status', value: 'active-all'},
    { label: 'Inactive status', value: 'inactive-all'},
    { label: 'Position change', value: 'position-change-all'},
    { label: 'Delete items', value: 'delete-all'},
  ];

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
            <Button 
              onClick={() => handleStatusChange('')} 
              className={`custom-btn ${!status ? 'active' : ''}`}
            >
              All
            </Button>
            <Button 
              onClick={() => handleStatusChange('active')} 
              className={`custom-btn ${status === 'active' ? 'active' : ''}`}
            >
              Active
            </Button>
            <Button
              onClick={() => handleStatusChange('inactive')} 
              className={`custom-btn ${status === 'inactive' ? 'active' : ''}`}
            >
              Inactive
            </Button>
          </span>
        </div>
        <div className='sorting-items'>
          <span>Sorting by: </span>
          <Select
            placement='bottomLeft'
            placeholder="Choose sorting method"
            defaultValue={'position-desc'}
            onChange={handleSortingChange}
            options={sortingOptions}
            className='sorting-items__select'
          />
        </div>
        <div className='multiple-change'>
          <span>Multiple change: </span>
          <Select
            placement='bottomLeft'
            placeholder="Choose change to apply"
            defaultValue={'None'}
            onChange={handleMultipleChange}
            options={multipleChangeOptions}
            className='multiple-change__select'
          />
        </div>
      </div>
    </div>
  )
};

export default FilterBox;


