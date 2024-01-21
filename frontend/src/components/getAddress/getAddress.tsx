import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Col, Form, Input, Row, Select } from 'antd';

interface OptionType {
  code: number;
  name: string;
}

const API_HOST = 'https://provinces.open-api.vn/api/';

const GetAddress: React.FC = () => {
  const [cities, setCities] = useState<OptionType[]>([]);
  const [districts, setDistricts] = useState<OptionType[]>([]);
  const [wards, setWards] = useState<OptionType[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | undefined>(undefined);
  const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>(undefined);
  const [selectedWard, setSelectedWard] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    const response = await axios.get<OptionType[]>(`${API_HOST}?depth=1`);
    setCities(response.data);
  };

  const fetchDistricts = async (cityCode: number) => {
    const response = await axios.get<{ districts: OptionType[] }>(`${API_HOST}p/${cityCode}?depth=2`);
    setDistricts(response.data.districts);
  };

  const fetchWards = async (districtCode: number) => {
    const response = await axios.get<{ wards: OptionType[] }>(`${API_HOST}d/${districtCode}?depth=2`);
    setWards(response.data.wards);
  };

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    setSelectedDistrict(undefined);
    setSelectedWard(undefined);
    const selectedCityCode = cities.find(city => city.name === value)?.code;
    if (selectedCityCode !== undefined) {
      fetchDistricts(selectedCityCode);
    }
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    setSelectedWard(undefined);
    const selectedDistrictCode = districts.find(district => district.name === value)?.code;
    if (selectedDistrictCode !== undefined) {
      fetchWards(selectedDistrictCode);
    }
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
            options={cities.map(city => ({ value: city.name, label: city.name }))}
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
            options={districts.map(district => ({ value: district.name, label: district.name }))}
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
            options={wards.map(ward => ({ value: ward.name, label: ward.name }))}
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
