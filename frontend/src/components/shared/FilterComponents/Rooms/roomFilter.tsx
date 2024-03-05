import { Button, Modal } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setBathrooms, setBedrooms } from "../../../../redux/reduxSlices/filtersSlice";

interface RoomFilterProps {
  roomType: string;
  label?: string;
  width?: string;
  text?: string;
  textColor?: string;
}

const RoomFilter: React.FC<RoomFilterProps> = ({
  roomType,
  label,
  text,
  textColor,
  width='100%', 
}) => {
  const dispatch = useDispatch();

  const [ isModalOpen, setIsModalOpen ] = useState(false);

  const numbers = Array.from({ length: 4 }, (_, index) => index + 1);

  const handleFilterClick = (number: any) => {
    dispatch((roomType === 'bathrooms') ? setBathrooms(`${roomType}-${number}`) : setBedrooms(`${roomType}-${number}`));
    setIsModalOpen(false);
  }

  const handleFilterClickTwo = () => {
    dispatch((roomType === 'bathrooms') ? setBathrooms(`${roomType}-gte-${5}`) : setBedrooms(`${roomType}-gte-${5}`));
    setIsModalOpen(false);
  }

  return (
    <div className='price-range'>
      {label && (
        <span style={{marginBottom: ".5rem"}}>{label}</span>
      )}
      <Button
        onClick={() => setIsModalOpen(true)}
        style={{ width: `${width}`, color: `${textColor}` }}
      >
        { text }
      </Button>
      <Modal 
        title={`Filter by ${roomType}`} 
        open={isModalOpen} 
        onOk={() => setIsModalOpen(false)} 
        onCancel={() => setIsModalOpen(false)}
      >
        <hr style={{marginTop: "1.5rem", marginBottom: "2.5rem"}}/>
        {numbers.map(number => (
          <Button 
            key={number} 
            className="mr-1"
            onClick={() => handleFilterClick(number)}
            >
            {number}
          </Button>
        ))}
        <Button 
          className="mr-1" 
          onClick={handleFilterClickTwo}
        >
          5+
        </Button>
      </Modal>
    </div> 
  )
}

export default RoomFilter;