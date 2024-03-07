import React, { useEffect } from 'react';
import $ from 'jquery'; 
import 'slick-carousel';

import './filterBoxSlide.scss'

import PriceRange from '../PriceRange/priceRange';
import CategoryTree from '../CategoryTree/categoryTree';
import AreaRange from '../AreaRange/areaRange';
import Direction from '../Direction/direction';
import RoomFilter from '../Rooms/roomFilter';


const FilterBoxSlide: React.FC = () => {

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
  );
};

export default FilterBoxSlide;
