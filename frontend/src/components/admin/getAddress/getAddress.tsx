import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Col, Form, Input, Row, Select } from 'antd';

interface OptionType {
  name: string;
  province_id?: string;
  district_id?: string;
}

const API_HOST = 'https://vapi.vnappmob.com/api';

const GetAddress: React.FC<{ initialValues?: any }> = ({ initialValues }) => {
  const [cities, setCities] = useState<OptionType[]>([]);
  const [districts, setDistricts] = useState<OptionType[]>([]);
  const [wards, setWards] = useState<OptionType[]>([]);

  const [selectedCityCode, setSelectedCityCode] = useState<string | undefined>(initialValues?.city);
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<string | undefined>(initialValues?.district);
  const [selectedWardCode, setSelectedWardCode] = useState<string | undefined>(initialValues?.ward);

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (selectedCityCode) {
      const selectedCity = cities.find(city => city.province_id === selectedCityCode);
      if (selectedCity !== undefined) {
        fetchDistricts(selectedCity.province_id || '');
      }
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCityCode]);

  useEffect(() => {
    if (districts.length > 0 && selectedDistrictCode !== undefined) {
      fetchWards(selectedDistrictCode);
    }
  }, [districts, selectedDistrictCode]);
  
  useEffect(() => {
    if (wards.length > 0 && initialValues?.ward) {
      setSelectedWardCode(initialValues.ward);
    }
  }, [wards, initialValues]);

  const fetchCities = async () => {
    const response = await axios.get<{ results: any }>(`${API_HOST}/province`);
    const formattedCities = response.data.results.map((city: any) => ({
      name: city.province_name,
      province_id: city.province_id,
    }));
    setCities(formattedCities);
  };

  const fetchDistricts = async (cityId: string) => {
    const response = await axios.get<{ results: any }>(`${API_HOST}/province/district/${cityId}`);
    const formattedDistricts = response.data.results.map((district: any) => ({
      name: district.district_name,
      district_id: district.district_id,
    }));
    setDistricts(formattedDistricts);
  };

  const fetchWards = async (selectedDistrictCode: string) => {
    if (selectedDistrictCode) {
      const response = await axios.get<{ results: any }>(`${API_HOST}/province/ward/${selectedDistrictCode}`);
      const formattedWards = response.data.results.map((ward: any) => ({
        name: ward.ward_name,
        ward_id: ward.ward_id,
      }));
      setWards(formattedWards);
    } else {
      setWards([]);
    }
  };

  const handleCityChange = (value: string) => {
    setSelectedCityCode(value);
    setSelectedDistrictCode(undefined);
    setSelectedWardCode(undefined);
    const selectedCity = cities.find(city => city.name === value);
    if (selectedCity !== undefined) {
      fetchDistricts(selectedCity.province_id || '');
    }
  };

  const handleDistrictChange = (value: string) => {
    const selectedDistrict = districts.find(district => district.name === value);
    if (selectedDistrict !== undefined) {
      setSelectedDistrictCode(selectedDistrict.district_id || '');
      setSelectedWardCode(undefined);
      fetchWards(selectedDistrict.district_id || ''); 
    }
  };
  

  const handleWardChange = (value: string) => {
    setSelectedWardCode(value);
  };

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  return (
    <Row gutter={16}>
      <Col sm={24} md={12} lg={8} xl={8} xxl={8}>
        <Form.Item 
          label='City' 
          name={['location', 'city']}  
          initialValue={initialValues?.city}
          rules={[{ required: true }]}
          >
          <Select
            placeholder="Choose city"
            onChange={handleCityChange}
            value={selectedCityCode}
            style={{ width: "100%" }}
            options={cities.map(city => ({ value: city.name || '', label: city.name }))}
            showSearch
            optionFilterProp="children"
            filterOption={filterOption}
          />
        </Form.Item>
      </Col>
      <Col sm={24} md={12} lg={8} xl={8} xxl={8}>
        <Form.Item 
          label='District' 
          name={['location', 'district']}   
          initialValue={initialValues?.district}
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Choose district"
            onChange={handleDistrictChange}
            value={selectedDistrictCode}
            style={{ width: "100%" }}
            options={districts.map(district => ({ value: district.name || '', label: district.name }))}
            showSearch
            optionFilterProp="children"
            filterOption={filterOption}
          />
        </Form.Item>
      </Col>
      <Col sm={24} md={12} lg={8} xl={8} xxl={8}>
        <Form.Item 
          label='Ward' 
          name={['location', 'ward']}  
          initialValue={initialValues?.ward}
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Choose ward"
            onChange={handleWardChange}
            value={selectedWardCode}
            style={{ width: "100%" }}
            options={wards.map(ward => ({ value: ward.name, label: ward.name }))}
            showSearch
            optionFilterProp="children"
            filterOption={filterOption}
          />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item 
          label='Address' 
          name={['location', 'address']}  
          initialValue={initialValues?.address}
        >
          <Input placeholder={`Enter your address`} />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default GetAddress;
