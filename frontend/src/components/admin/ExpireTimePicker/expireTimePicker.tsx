import { Button, Col, DatePicker, Form, Radio, RadioChangeEvent, Row } from "antd";
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useState } from "react";

import * as dateTimeHelper from '../../../helpers/dateTimeHelpers'
import './expireTimePicker.scss'

interface ExpireTimePickerProps {
  onExpireDateTimeChange: (dateTime: Dayjs | null) => void;
  expireTimeGiven?: Date | string 
}

const ExpireTimePicker: React.FC<ExpireTimePickerProps> = ({ onExpireDateTimeChange, expireTimeGiven }) => {
  
  const [currentDateTime, setCurrentDateTime] = useState<Dayjs | null>(dayjs());
  const [expireDateTime, setExpireDateTime] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (expireTimeGiven) {
      setExpireDateTime(dayjs(expireTimeGiven));
    }
  }, [expireTimeGiven]);

  const handleChangeExpireOption = (e: RadioChangeEvent) => {
    const timePicker = document.querySelector('.time-picker');
    timePicker?.classList.toggle('d-none', e.target.value !== 'other');
  };

  const handleDateTimeChange = (value: Dayjs | null) => {
    setCurrentDateTime(value);
  };

  const handleExpireDateTimeChange = (value: Dayjs | null) => {
    setExpireDateTime(value);
    onExpireDateTimeChange(value);
  };

  const handleSetCurrentDateTime = () => {
    setCurrentDateTime(dayjs());
  };

  const handleSetExpireDateTime = () => {
    setExpireDateTime(dayjs());
  };

  const disabledDate = (current: Dayjs) => {
    return current.isBefore(dayjs(), 'day');
  };

  const disabledTime = (current: Dayjs | null) => {
    if (expireDateTime && expireDateTime.isSame(dayjs(), 'day')) {
      return {
        disabledHours: () => (current && current < dayjs().startOf('hour')) ? [...Array(24).keys()] : [],
        disabledMinutes: () => (current && current < dayjs().startOf('minute')) ? [...Array(60).keys()] : [],
        disabledSeconds: () => (current && current < dayjs().startOf('second')) ? [...Array(60).keys()] : [],
      };
    }
    return {};
  };

  return (
    <Form.Item 
      label={`Post expire after:${expireDateTime ? ` ${dateTimeHelper.differenceInTime(expireDateTime.toDate())}` : ''}`}
      name="expireAt" 
      initialValue={'other'}>
      <div>
        <Radio.Group defaultValue={'other'} onChange={handleChangeExpireOption}>
          <Radio value="day">1 day</Radio>
          <Radio value="week">1 week</Radio>
          <Radio value="month">1 month</Radio>
          <Radio value="other">Other</Radio>
          <Radio value="">None</Radio>
        </Radio.Group>

        <div className="time-picker" style={{ marginTop: "2rem" }}>
          <div className="d-flex">
            <Row gutter={16}>
              <Col sm={24} md={12} lg={12} xl={12} xxl={12} className="custom-col-one">
                <DatePicker
                  disabled
                  showTime
                  value={currentDateTime}
                  onChange={handleDateTimeChange}
                  style={{ width: "90%" }}
                />
                <Button onClick={handleSetCurrentDateTime} className="custom-btn-main">Update current time</Button>
              </Col>

              <Col sm={24} md={12} lg={12} xl={12} xxl={12} className="custom-col-two">
                <DatePicker
                  showTime
                  value={expireDateTime}
                  onChange={handleExpireDateTimeChange}
                  style={{ width: "90%" }}
                  disabledDate={disabledDate} 
                  disabledTime={disabledTime}
                />
                <Button 
                  onClick={handleSetExpireDateTime} 
                  className="custom-btn-main"
                >
                  Set expire time
                </Button>
              </Col>
            </Row>
          </div>
          <div className="time-display">
            <Row gutter={16} style={{width: "100%"}}>
              <Col sm={24} md={12} lg={12} xl={12} xxl={12}>
                <p>Current time: <b>{currentDateTime?.format('HH:mm - DD/MM/YYYY')}</b></p>
              </Col>
              <Col sm={24} md={12} lg={12} xl={12} xxl={12}>
                <p>Expire time: <b>{expireDateTime ? expireDateTime?.format('HH:mm - DD/MM/YYYY') : 'Not select'}</b></p>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </Form.Item>
  )
}

export default ExpireTimePicker;