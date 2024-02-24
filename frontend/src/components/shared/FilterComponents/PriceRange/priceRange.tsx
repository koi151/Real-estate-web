import { Button, Col, InputNumber, Modal, Radio, RadioChangeEvent, Row, Slider, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/stores";
import { listingTypeFormatted } from "../../../../helpers/standardizeData";
import { setPriceRange } from "../../../../redux/reduxSlices/filtersSlice";
import { FaArrowRightLong } from "react-icons/fa6";
import './priceRange.scss'

interface PriceRangeProps {
  label?: string;
  width?: string;
  text?: string;
}

const PriceRange: React.FC<PriceRangeProps> = ({
  label,
  text,
  width='100%', 
}) => {
  const dispatch = useDispatch();

  const { listingType } = useSelector((state: RootState) => state.filters);

  const [ isModalOpen, setIsModalOpen ] = useState(false);

  const [ sliderValue, setSliderValue ] = useState<[number, number]>([0, listingType === 'forRent' ? 500 : 10000]);
  const [ priceRangeString, setPriceRangeString ] = useState<string | undefined>(undefined)

  useEffect(() => {
    // Update the slider value when listingType changes
    setSliderValue([0, listingType === 'forRent' ? 1000 : 10000]);
  }, [listingType]);

  useEffect(() => {
    priceRangeString && dispatch(setPriceRange(JSON.parse(priceRangeString)));
  }, [priceRangeString, dispatch])


  const handleModalOk = () => {
    setIsModalOpen(false);
    dispatch(setPriceRange(sliderValue));
  };

  const handleInputChange = (index: number, value: number | undefined) => {
    const newSliderValue: [number, number] = [...sliderValue];
    newSliderValue[index] = value || 0;
    setSliderValue(newSliderValue);
  };

  const handleSliderChange = (newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setSliderValue(newValue as [number, number]);
    }
  };

  const handleRadioChange = (e: RadioChangeEvent) => {
    setIsModalOpen(false);
    setPriceRangeString(e.target.value);
    setSliderValue(JSON.parse(e.target.value))
  }

  const priceRangeValue = [
    { value: undefined, label: "All" },
    { value: "[0, 499]", label: "Below 500 million" },
    { value: "[500, 800]", label: "500 - 800 million" },
    { value: "[800, 1000]", label: "800 million - 1 billion" },
    { value: "[1000, 2000]", label: "1 billion - 2 billion" },
    { value: "[2000, 999999]", label: "Above 2 billion" }
  ]

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
        title={`Select price range - ${listingType ? listingTypeFormatted(listingType) : 'for all'}`} 
        open={isModalOpen} 
        onOk={handleModalOk} 
        onCancel={() => setIsModalOpen(false)}
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

            <Col span={24} className="d-flex justify-content-center">
              <Radio.Group 
                onChange={handleRadioChange} 
                value={priceRangeString}
                className="custom-radio-group"
              > 
                <Space direction="vertical">
                  {priceRangeValue.map((item, index) => (
                    <Radio 
                      key={index} value={item.value} 
                      className="label-light custom-radio"
                      >{item.label}</Radio>
                  ))}
                </Space>
              </Radio.Group>
            </Col>
          </Row>
        </div>
      </Modal>
    </div> 
  )
}

export default PriceRange;