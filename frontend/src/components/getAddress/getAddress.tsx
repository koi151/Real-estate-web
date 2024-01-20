import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Col, Form, Input, Row, Select } from 'antd';

interface OptionType {
  code: number;
  name: string;
}

const GetAddress: React.FC = () => {
  const [cities, setCities] = useState<OptionType[]>([]);
  const [districts, setDistricts] = useState<OptionType[]>([]);
  const [wards, setWards] = useState<OptionType[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');

  useEffect(() => {
    const host = 'https://provinces.open-api.vn/api/';

    const callAPI = (api: string, setter: React.Dispatch<React.SetStateAction<OptionType[]>>) => {
      axios.get(api)
        .then((response) => {
          setter(response.data);
        });
    };

    callAPI(`${host}?depth=1`, setCities);
  }, []);

  const callApiDistrict = (cityCode: number) => {
    const host = 'https://provinces.open-api.vn/api/';
    axios.get(`${host}p/${cityCode}?depth=2`)
      .then((response) => {
        setDistricts(response.data.districts);
      });
  };

  const callApiWard = (districtCode: number) => {
    const host = 'https://provinces.open-api.vn/api/';
    axios.get(`${host}d/${districtCode}?depth=2`)
      .then((response) => {
        setWards(response.data.wards);
      });
  };

  const handleCityChange = (value: string) => {
    const selectedCityCode = parseInt(value, 10);
    setSelectedCity(value);
    setSelectedDistrict('');
    setSelectedWard('');
    callApiDistrict(selectedCityCode);
  };

  const handleDistrictChange = (value: string) => {
    const selectedDistrictCode = parseInt(value, 10);
    setSelectedDistrict(value);
    setSelectedWard('');
    callApiWard(selectedDistrictCode);
  };

  const handleWardChange = (value: string) => {
    setSelectedWard(value);
  };

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  return (
    <Row gutter={16}>
      <Col sm={24} md={12} lg={8} xl={8} xxl={8}>
        <Form.Item label='City' name='city'>
          <Select
            placeholder="Choose city"
            onChange={handleCityChange}
            value={selectedCity}
            style={{ width: "100%" }}
            options={cities.map(city => ({ value: city.code.toString(), label: city.name }))}
            showSearch
            optionFilterProp="children"
            filterOption={filterOption}
          />
        </Form.Item>
      </Col>

      <Col sm={24} md={12} lg={8} xl={8} xxl={8}>
        <Form.Item label='District' name='district'>
          <Select
            placeholder="Choose district"
            onChange={handleDistrictChange}
            value={selectedDistrict}
            style={{ width: "100%" }}
            options={districts.map(district => ({ value: district.code.toString(), label: district.name }))}
            showSearch
            optionFilterProp="children"
            filterOption={filterOption}
          />
        </Form.Item>
      </Col>

      <Col sm={24} md={12} lg={8} xl={8} xxl={8}>
        <Form.Item label='Ward' name='ward'>
          <Select
            placeholder="Choose ward"
            onChange={handleWardChange}
            value={selectedWard}
            style={{ width: "100%" }}
            options={wards.map(ward => ({ value: ward.code.toString(), label: ward.name }))}
            showSearch
            optionFilterProp="children"
            filterOption={filterOption}
          />
        </Form.Item>
      </Col>

      <Col span={24}>
        <Form.Item label='Address' name='address'>
          <Input placeholder={`Enter your address`} />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default GetAddress;
