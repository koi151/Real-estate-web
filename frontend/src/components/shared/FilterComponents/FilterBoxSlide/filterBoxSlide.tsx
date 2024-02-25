import React, { useEffect } from 'react';
import $ from 'jquery'; 
import 'slick-carousel';

import './filterBoxSlide.scss'
import { Button } from 'antd';
import { useDispatch } from 'react-redux';

import PriceRange from '../PriceRange/priceRange';
import CategoryTree from '../CategoryTree/categoryTree';
import AreaRange from '../AreaRange/areaRange';
import BedroomNumber from '../BedroomNumber/bedroomNumber';


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
        <BedroomNumber width='95%' text='Number of bedrooms'/>
        <Button>Slide 3</Button>
        <Button>Slide 4</Button>
        <Button>Slide 5</Button>
        <Button>Slide 6</Button>
        <Button>Slide 7</Button>
      </div>
    </div>
  );
};

export default FilterBoxSlide;
