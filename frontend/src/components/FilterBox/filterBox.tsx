import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Select, SelectProps, Slider, message } from 'antd';
import { FaPlus } from "react-icons/fa6";
import Search, { SearchProps } from 'antd/es/input/Search';
import { IoFilter } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';

import propertiesService from '../../services/admin/properties.service';
import { ValidMultiChangeType } from '../../../../backend/commonTypes';

import './filterBox.scss';

interface FilterBoxProps {
  onKeywordChange: (newKeyword: string | null) => void;
  onStatusChange: (newStatus: string | null) => void;
  onSortingChange: (newSorting: {
    sortKey: string | null,
    sortValue: string | null
  }) => void;
  checkedList: string[]; 
  resetFilters: () => void;
}

const FilterBox: React.FC<FilterBoxProps> = ({ onKeywordChange, onStatusChange, onSortingChange, checkedList, resetFilters}) => {
  
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

  const handleStatusClick = (value: string) => {
    setStatus(value);
  };

  const handleSortingChange = (value: string) => {
    const [sortKey, sortValue] = value.split('-');
    setSorting({ sortKey, sortValue });
  }

  const handleResetFilters = () => {
    onKeywordChange(null);
    onStatusChange(null);
    onSortingChange({ sortKey: null, sortValue: null });
    resetFilters();
  };

  const handleMultipleChange = async (type: ValidMultiChangeType) => {
    const response = await propertiesService.multiChangeProperties(checkedList, type);
    if (response?.code === 200) {
      if (type === 'active' || type === 'inactive') {
        response.idList?.forEach((id: string) => {
          const statusButton = document.querySelector(`.item-wrapper__upper-content--status button[data-id="${id}"]`);
          if (statusButton) {
            const oppositeType = type === 'active' ? 'inactive' : 'active';
            statusButton.classList.remove(`${oppositeType}-btn`);
            statusButton.classList.add(`${type}-btn`);
            statusButton.innerHTML = type;
          }
        })
      } else if (type === 'delete') {
        response.idList?.forEach((id: string) => {
          const statusButton = document.querySelector(`.item-wrapper[data-id="${id}"]`);
          if (statusButton) statusButton.remove();
        })
      }

      message.success(response.message, 3);

    } else {
      message.error("Error occurred, can not do multiple update", 3)
    }
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
    { label: 'Active status', value: 'active' },
    { label: 'Inactive status', value: 'inactive' },
    { label: 'Position change', value: 'position' },
    { label: 'Delete items', value: 'delete' },
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
        <Link to={'/admin/properties/create'} className='custom-link'>
          <Button className='add-new-button'>
            Add new <FaPlus/>
          </Button>
        </Link>
      </div>

      <div className='filter-box__detail'>
        <Row className='custom-row'>
          <Col
            xxl={8} xl={8} lg={8}
          >
            <div className='status-filter'>
              <span>Filter by status:</span>
              <span className='status-filter__status-wrap mr-2'>
                <br/>
                <Button 
                  onClick={() => handleStatusClick('')} 
                  className={`custom-btn ${!status ? 'active' : ''}`}
                >
                  All
                </Button>
                <Button 
                  onClick={() => handleStatusClick('active')} 
                  className={`custom-btn ${status === 'active' ? 'active' : ''}`}
                >
                  Active
                </Button>
                <Button
                  onClick={() => handleStatusClick('inactive')} 
                  className={`custom-btn ${status === 'inactive' ? 'active' : ''}`}
                >
                  Inactive
                </Button>
              </span>
            </div>
          </Col>
          <Col
            xxl={8} xl={8} lg={8}
          >
            <div className='sorting-items'>
              <span>Sorting by: </span>
              <br/>
              <Select
                placement='bottomLeft'
                placeholder="Choose sorting method"
                defaultValue={'position-desc'}
                onChange={handleSortingChange}
                options={sortingOptions}
                className='sorting-items__select'
              />
            </div>
          </Col>
          <Col
            xxl={8} xl={8} lg={8}
          >
            <div className='multiple-change'>
              <span>Multiple change: </span>
              <Select
                placement='bottomLeft'
                placeholder="Choose change to apply"
                // defaultValue='None'
                onChange={handleMultipleChange}
                options={multipleChangeOptions}
                className='multiple-change__select'
              />
            </div>
          </Col>
          <Col
            xxl={8} xl={8} lg={8}
          >
            <Slider
              className='custom-slider'
              range
              step={10}
              defaultValue={[20, 50]}
              // onChange={onChange}
              // onChangeComplete={onChangeComplete}
            />
          </Col>
          <Col
            xxl={8} xl={8} lg={8}
          >
            <Button
              onClick={handleResetFilters}  
              className='clear-filters' 
              danger type='primary'>
              Clear filters
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  )
};

export default FilterBox;

