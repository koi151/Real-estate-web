import React, { useEffect } from 'react';
import $ from 'jquery'; 
import 'slick-carousel';

import './filterBoxSlide.scss'

import PriceRange from '../PriceRange/priceRange';
import CategoryTree from '../CategoryTree/categoryTree';
import AreaRange from '../AreaRange/areaRange';
import Direction from '../Direction/direction';
import RoomFilter from '../Rooms/roomFilter';


interface FilterBoxSlideProps {
  slickWidth?: string
  userType: 'admin' | 'client',
  slideShow?: number
}

const FilterBoxSlide: React.FC<FilterBoxSlideProps> = ({slickWidth = "100%", userType, slideShow = 4}) => {

  useEffect(() => {
    $('.slick').slick({
      infinite: true,
      slidesToShow: slideShow,
      slidesToScroll: 1
    });
  }, []);

  return (
    <div 
      className={`slick-wrapper ${userType === 'client' && 'client-bg'} ${userType === 'admin' && 'mt-4'}`} 
      style={{ width: `${slickWidth}` }}>
      <div className="slick">
        <div className="text-center">
          <CategoryTree width='95%' text='Category' userType={userType} />
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