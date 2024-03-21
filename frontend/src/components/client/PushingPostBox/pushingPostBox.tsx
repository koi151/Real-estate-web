import { Tag } from "antd";
import React from "react";
import { FaArrowUp } from "react-icons/fa";

import './pusingPostBox.scss';

interface PushingPostBoxProps {
  pushTimes: number;  
  defaultPrice: number;
  multiple?: number;
  discountPercentage?: number;
  selected?: boolean;
  onClick?: any;
}

const PushingPostBox: React.FC<PushingPostBoxProps> = ({ multiple, defaultPrice, discountPercentage, pushTimes, selected, onClick }) => {
  
  return (
    <div className={`push-box-wrapper ${selected && 'selected'}`} onClick={onClick}>
      <div className="push-box-wrapper__left">
        <span className="push-box-wrapper__left--push-time">{pushTimes} push time</span>
        <div className="d-flex mt-2 mb-5">
          <div className="icon-wrapper-round"><FaArrowUp /></div>
          <span className="push-box-wrapper__left--multiple">X{multiple}</span>
          <span className="push-box-wrapper__left--view-txt">post view</span>
        </div>
        <div className="push-price">
          {discountPercentage && (
            <div className="push-price--promo">
              ${((defaultPrice * (100 - discountPercentage)) / 100).toFixed(2)}
            </div>
          )}
          <div className="push-price--default">${defaultPrice}</div>
        </div>
      </div>
      { discountPercentage && (
        <div className="push-box-wrapper__right">
          <Tag color="red" className="push-box-wrapper__right--discount-tag">-{discountPercentage}%</Tag>
        </div>
      )}
    </div>
  )
}

export default PushingPostBox;