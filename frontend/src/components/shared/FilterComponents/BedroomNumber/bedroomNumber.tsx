import { Button, Modal } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import './bedroomNumber.scss'
import { setBedrooms } from "../../../../redux/reduxSlices/filtersSlice";

interface BedroomNumberProps {
  label?: string;
  width?: string;
  text?: string;
}

const BedroomNumber: React.FC<BedroomNumberProps> = ({
  label,
  text,
  width='100%', 
}) => {
  const dispatch = useDispatch();

  const [ isModalOpen, setIsModalOpen ] = useState(false);

  const numbers = Array.from({ length: 4 }, (_, index) => index + 1);

  const handleModalOk = () => {
    setIsModalOpen(false);
    // dispatch(setPriceRange(sliderValue));
  };

  return (
    <div className='price-range'>
      {label && (
        <span style={{marginBottom: ".5rem"}}>{label}</span>
      )}
      <Button
        onClick={() => setIsModalOpen(true)}
        style={{ width: `${width}` }}
      >
        { text }
      </Button>
      <Modal 
        title={`Number of bedrooms`} 
        open={isModalOpen} 
        onOk={handleModalOk} 
        onCancel={() => setIsModalOpen(false)}
      >
        <hr style={{marginTop: "1.5rem", marginBottom: "2.5rem"}}/>
        {numbers.map(number => (
          <Button 
            key={number} 
            className="mr-1"
            onClick={() => dispatch(setBedrooms(`bedrooms-${number}`))}
          >
            {number}
          </Button>
        ))}
        <Button 
          className="mr-1" 
          onClick={() => dispatch(setBedrooms(`bedrooms-gte-${5}`))}
        >
          5+
        </Button>
      </Modal>
    </div> 
  )
}

export default BedroomNumber;