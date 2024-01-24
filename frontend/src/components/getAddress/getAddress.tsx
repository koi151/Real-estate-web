import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Col, Form, Input, Row, Select } from 'antd';

interface OptionType {
  code: number;
  name: string;
}

const API_HOST = 'https://provinces.open-api.vn/api/';

const GetAddress: React.FC<{ initialValues?: any }> = ({ initialValues }) => {
  const [cities, setCities] = useState<OptionType[]>([]);
  const [districts, setDistricts] = useState<OptionType[]>([]);
  const [wards, setWards] = useState<OptionType[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | undefined>(initialValues?.city);
  const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>(initialValues?.district);
  const [selectedWard, setSelectedWard] = useState<string | undefined>(initialValues?.ward);

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (initialValues?.city && cities.length > 0) {
      const selectedCityCode = cities.find(city => city.name === initialValues.city)?.code;
      if (selectedCityCode !== undefined) {
        setSelectedCity(initialValues.city);
        fetchDistricts(selectedCityCode);
      }
    }
  }, [cities, initialValues]);
  
  useEffect(() => {
    if (districts.length > 0) {
      if (initialValues?.district) {
        const selectedDistrictCode = districts.find(district => district.name === initialValues.district)?.code;
        if (selectedDistrictCode !== undefined) {
          setSelectedDistrict(initialValues.district);
          fetchWards(selectedDistrictCode);
        }
      }
    }
  }, [districts, initialValues]);

  useEffect(() => {
    if (wards.length > 0) {
      if (initialValues?.ward) {
        const selectedWardCode = wards.find(ward => ward.name === initialValues.ward)?.code;
        if (selectedWardCode !== undefined) {
          setSelectedWard(initialValues.ward);
        }
      }
    }
  }, [wards, initialValues])
  

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
        <Form.Item label='City' name='city' initialValue={initialValues?.city || undefined}>
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
        <Form.Item label='District' name='district' initialValue={initialValues?.district || undefined}>
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
        <Form.Item label='Ward' name='ward' initialValue={initialValues?.ward || undefined}>
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
        <Form.Item label='Address' name='address' initialValue={initialValues?.address || undefined}>
          <Input placeholder={`Enter your address`} />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default GetAddress;
