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
}

const FilterBox: React.FC<FilterBoxProps> = ({ onKeywordChange, onStatusChange, onSortingChange}) => {
  
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

  const options: SelectProps['options'] = [
    { label: 'Descending position', value: 'position-desc'},
    { label: 'Ascending position', value: 'position-asc'},
    { label: 'Descending price', value: 'price-desc'},
    { label: 'Ascending price', value: 'price-asc'},
    { label: 'Descending view', value: 'view-desc'},
    { label: 'Ascending view', value: 'view-asc'},
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
            style={{ width: '25rem' }}
            options={options}
          />
        </div>
      </div>
    </div>
  )
};

export default FilterBox;


