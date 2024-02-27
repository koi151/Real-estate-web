import React, { useEffect } from 'react';
import $ from 'jquery'; 
import 'slick-carousel';

import './filterBoxSlide.scss'
import { useDispatch } from 'react-redux';

import PriceRange from '../PriceRange/priceRange';
import CategoryTree from '../CategoryTree/categoryTree';
import AreaRange from '../AreaRange/areaRange';
import Direction from '../Direction/direction';
import RoomFilter from '../Rooms/roomFilter';


const FilterBoxSlide: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    $('.slick').slick({
      infinite: true,
      slidesToShow: 5,
      slidesToScroll: 1
    });
  }, []);


  return (
    <div className='slick-wrapper'>
      <div className="slick">
        <div className="text-center">
          <CategoryTree width='95%' text='Category' />
        </div>
        <PriceRange width='95%' text='Price range'/>
        <AreaRange width='95%' text='Area range'/>

        <Direction width='95%' text='Property direction'/>

        <RoomFilter roomType='bedrooms' width='95%' text='Number of bedrooms'/>
        <RoomFilter roomType='bathrooms' width='95%' text='Number of bathrooms'/>
      </div>
    </div>
  );
};

export default FilterBoxSlide;
