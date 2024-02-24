import React, { useEffect } from 'react';
import $ from 'jquery'; 
import 'slick-carousel';

import './filterBoxSlide.scss'
import { Button } from 'antd';
import { useDispatch } from 'react-redux';

import PriceRange from '../../PriceRange/priceRange';
import CategoryTree from '../CategoryTree/categoryTree';


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
        <PriceRange width='95%' text='Price range'/>
        <div className="text-center">
          <CategoryTree width='95%' text='Category' />
        </div>
        
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
