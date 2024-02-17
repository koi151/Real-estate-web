import React, { useEffect, useState } from 'react';
import { Button, Col, InputNumber, Modal, Row, Segmented, Select, Slider, message } from 'antd';
import { FaArrowRightLong } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import Search from 'antd/es/input/Search';
import { IoFilter } from 'react-icons/io5';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/stores';
import { SegmentedValue } from 'antd/es/segmented';

import { listingTypeFormatted, reverseListingType } from '../../../helpers/standardizeData';
import { setListingType, setKeyword, setStatus, setSorting, resetFilters, setPriceRange } from '../../../redux/reduxSlices/filtersSlice';
import propertiesService from '../../../services/admin/properties.service';
import { ValidMultiChangeType } from '../../../../../backend/commonTypes';

import './filterBox.scss';

interface Props {
  createAllowed?: boolean;
  priceRangeFilter?: boolean;
}

const FilterBox: React.FC<Props> = ({createAllowed = false, priceRangeFilter = false}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // Redux state selectors
  const { listingType, status } = useSelector((state: RootState) => state.filters);

  const [isFilterDetailVisible, setIsFilterDetailVisible] = useState<boolean>(true);
  const [sliderValue, setSliderValue] = useState<[number, number]>([0, listingType === 'forRent' ? 500 : 10000]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Update the slider value when listingType changes
    setSliderValue([0, listingType === 'forRent' ? 1000 : 10000]);
  }, [listingType]);

  const onSearch = (value: string) => {
    dispatch(setKeyword(value));
  };

  const handleStatusClick = (value: string) => {
    dispatch(setStatus(value));
  };

  const handleSortingChange = (value: string) => {
    const [sortKey, sortValue] = value.split('-');
    dispatch(setSorting({ sortKey, sortValue }));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    navigate('/admin/properties');
  };

  const handleMultipleChange = async (type: ValidMultiChangeType) => {
    const response = await propertiesService.multiChangeProperties([], type);
    if (response?.code === 200) {
      message.success(response.message, 3);
    } else {
      message.error("Error occurred, can not do multiple updates", 3);
    }
  };

  const handleSliderChange = (newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setSliderValue(newValue as [number, number]);
    }
  };

  const handleInputChange = (index: number, value: number | undefined) => {
    const newSliderValue: [number, number] = [...sliderValue];
    newSliderValue[index] = value || 0;
    setSliderValue(newSliderValue);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleModalOk = () => {
    setIsModalOpen(false);
    dispatch(setPriceRange(sliderValue));
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };


  const sortingOptions = [
    { label: 'Descending position', value: 'position-desc' },
    { label: 'Ascending position', value: 'position-asc' },
    { label: 'Descending price', value: 'price-desc' },
    { label: 'Ascending price', value: 'price-asc' },
    { label: 'Descending view', value: 'view-desc' },
    { label: 'Ascending view', value: 'view-asc' },
  ];

  const multipleChangeOptions = [
    { label: 'Active status', value: 'active' },
    { label: 'Inactive status', value: 'inactive' },
    { label: 'Position change', value: 'position' },
    { label: 'Delete items', value: 'delete' },
  ];

  return (
    <>
      <div className='filter-box'>
        <div className='d-flex justify-content-end align-items-center'>
          <div className='filter-box__button-wrapper--right'>
            <Search
              className='search-box'
              placeholder="Search by title..."
              onSearch={onSearch}
            />
            <Button
              className='filter-button d-flex align-items-center justify-content-center ml-1'
              onClick={() => setIsFilterDetailVisible(prev => !prev)}
            >
              Filters <IoFilter style={{ marginLeft: '.75rem' }} />
            </Button>
            {createAllowed && (
              <Link to={`${location.pathname}/create`} className='custom-link'>
                <Button className='add-new-button'>
                  Add new <FaPlus />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <Segmented 
        options={['All', 'For rent', 'For sale']} 
        onChange={(value: SegmentedValue) => {
          if (typeof value === 'string') {
            dispatch(setListingType(value === 'All' ? '' : reverseListingType(value)));
          }
        }}
        className={`listing-type ${isFilterDetailVisible ? '' : 'fade-out'}`}
      />

      <div className={`filter-box__detail ${isFilterDetailVisible ? '' : 'fade-out'} ${listingType ? '' : 'mt-3'}`}>
        <Row className='custom-row d-flex align-items-center'>
          <Col xxl={8} xl={8} lg={8}>
            <div className='status-filter'>
              <span>Filter by status:</span>
              <span className='status-filter__status-wrap mr-2'>
                <br />
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
          <Col xxl={8} xl={8} lg={8}>
            <div className='sorting-items'>
              <span>Sorting by: </span>
              <br />
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
          <Col xxl={8} xl={8} lg={8}>
            <div className='multiple-change'>
              <span>Multiple change: </span>
              <Select
                placement='bottomLeft'
                placeholder="Choose change to apply"
                onChange={(value: string) => handleMultipleChange(value as ValidMultiChangeType)}
                options={multipleChangeOptions}
                className='multiple-change__select'
              />
            </div>
          </Col>
          {priceRangeFilter && (
            <Col xxl={8} xl={8} lg={8}>
              <div className='price-range'>
                <span>Price range: </span>
                <Button
                  onClick={showModal}
                  className='price-range__btn'
                >
                  Select to apply
                </Button>
              </div>
              <Modal 
                title={`Select price range - ${listingType ? listingTypeFormatted(listingType) : 'for all'}`} 
                open={isModalOpen} 
                onOk={handleModalOk} 
                onCancel={handleModalCancel}
              >
                <hr />
                <div className='price-range__box'>
                  <Row gutter={16}>
                    <Col span={10} className='d-flex flex-column align-items-center'>
                      <div className='d-flex'>
                        <b>From: </b>
                        <span className='price-range__box--txt'>
                          {sliderValue[0] >= 100 ? `${sliderValue[0] / 1000} billion` : `${sliderValue[0]} million`}
                        </span>
                      </div>
                      <InputNumber
                        value={sliderValue[0]}
                        onChange={(value) => handleInputChange(0, value ?? undefined)}                    
                      />
                    </Col>
                    <Col span={4} className="d-flex align-items-center justify-content-center">
                      <FaArrowRightLong style={{fontSize: "2rem", color: "#666"}}/>
                    </Col>
                    <Col span={10} className='d-flex flex-column align-items-center'>
                      <div className='d-flex'>
                        <b>To: </b>
                        <span className='price-range__box--txt'>
                          {sliderValue[1] >= 100 ? `${sliderValue[1] / 1000} billion` : `${sliderValue[1]} million`}
                        </span>
                      </div>
                      <InputNumber
                        value={sliderValue[1]}
                        onChange={(value) => handleInputChange(1, value ?? undefined)}
                        />
                    </Col>
                    <Col span={24} className='d-flex justify-content-center'>
                      <Slider
                        className='custom-slider'
                        range
                        min={0}
                        max={listingType === 'forRent' ? 1000 : 10000}
                        step={listingType === 'forRent' ? undefined : 100}
                        value={sliderValue}
                        onChange={handleSliderChange}
                      />
                    </Col>
                  </Row>
                </div>
              </Modal>
            </Col>
          )}
          <Col xxl={8} xl={8} lg={8}>
            <Button
              onClick={handleResetFilters}
              className='clear-filters'
              danger type='primary'>
              Clear filters
            </Button>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default FilterBox;
