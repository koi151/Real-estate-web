import React, { useState } from 'react';
import { Button } from 'antd';
import Search, { SearchProps } from 'antd/es/input/Search';
import { IoFilter } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';

interface FilterBoxProps {
  onKeywordChange: (newKeyword: string | null) => void;
}

const FilterBox: React.FC<FilterBoxProps> = ({ onKeywordChange }) => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState<string | null>(null);

  const onSearch: SearchProps['onSearch'] = (value) => {
    setKeyword(value);
    onKeywordChange(value); // notify the parent about the keyword change
    navigate(`/admin/properties?keyword=${value}`);
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
            <Link to={`/`} className='ml-1'> 
              <Button>All</Button>
            </Link>
            <Link to={`/`} className='ml-1'> 
              <Button>Active</Button>
            </Link>
            <Link to={`/`} className='ml-1'> 
              <Button>Inactive</Button>
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
};

export default FilterBox;
