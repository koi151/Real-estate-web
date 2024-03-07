import React, { useEffect } from 'react';
import $ from 'jquery'; 
import 'slick-carousel';

import './filterBoxSlide.scss'

import PriceRange from '../PriceRange/priceRange';
import CategoryTree from '../CategoryTree/categoryTree';
import AreaRange from '../AreaRange/areaRange';
import Direction from '../Direction/direction';
import RoomFilter from '../Rooms/roomFilter';
import { Select } from 'antd';
import { useDispatch } from 'react-redux';
import { setSorting } from '../../../../redux/reduxSlices/filtersSlice';
import { sortingOptionsClient } from '../../../../helpers/filterOptions';


const FilterBoxSlide: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    $('.slick').slick({
      infinite: true,
      slidesToShow: 4,
      slidesToScroll: 1
    });
  }, []);



  const handleSortingChange = (value: string) => {
    const [sortKey, sortValue] = value.split('-');
    dispatch(setSorting({ sortKey, sortValue }));
  };


  return (
    <div className='slide-wrapper'>
      <div className='slide-wrapper__slick-wrapper'>
        <div className="slick">
          <div className="text-center">
            <CategoryTree width='95%' text='Category' />
          </div>
          <PriceRange width='95%' text='Price range' textColor='#999'/>
          <AreaRange width='95%' text='Area range' textColor='#999'/>

          <Direction width='95%' text='Property direction' textColor='#999'/>

          <RoomFilter 
            roomType='bedrooms' width='95%' 
            text='Filter by bedrooms' textColor='#999'
          />
          <RoomFilter 
            roomType='bathrooms' width='95%' 
            text='Filter by bathrooms' textColor='#999'
          />
        </div>
      </div>
      <div className='slide-wrapper__sorting-items'>
        <div className='slide-wrapper__sorting-items--label'>Sorting by: </div>
        <Select
          placement='bottomLeft'
          placeholder="Choose sorting method"
          onChange={handleSortingChange}
          options={sortingOptionsClient}
          className='sorting-items__select'
        />
      </div>
    </div>
  );
};

export default FilterBoxSlide;
