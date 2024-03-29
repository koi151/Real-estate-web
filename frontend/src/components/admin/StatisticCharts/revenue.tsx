import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import propertiesService from '../../../services/admin/properties.service';
import { message } from 'antd';

const Tableau10 = [
  '#4e79a7',
  '#f28e2c',
  '#e15759',
  '#76b7b2',
  '#59a14f',
  '#edc949',
  '#af7aa1',
  '#ff9da7',
  '#9c755f',
  '#bab0ab',
];

const chartsParams = {
  margin: { bottom: 20, left: 25, right: 5 },
  height: 300,
};

const RevenueChart: React.FC = () => {
  const [ color, setColor ] = React.useState('#4e79a7');
  const [ billData, setBillData ] = useState<any>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await propertiesService.getPropertyStatistic();
        if (response.code === 200) {
          console.log("response:", response)
          setBillData(response.bills)
        } else {
          message.error(response.message, 3)
        }
        

      } catch (err: any) {
        console.log('Error occurred while fetching statistic data');
        message.error('Error occurred while fetching statistic data', 3)
      }
    }

    fetchData();
  }, [])

  const handleChange = (event: React.MouseEvent<HTMLElement>, nextColor: string) => {
    setColor(nextColor);
  };

  useEffect(() => { // testing
    console.log("billData:", billData)
  }, [billData])

  return (
    <>
      {billData ? (
        <>
          <Stack direction="column" spacing={2} alignItems="center" sx={{ width: '100%' }}>
            <LineChart
              dataset={billData}
              xAxis={[{ scaleType: 'band', dataKey: 'createdAt' }]}
              series={[
                {
                  dataKey: 'amount',
                  label: 'Revenue',
                  color,
                },
              ]}
              {...chartsParams}
            />
            <ToggleButtonGroup
              // orientation="vertical"
              value={color}
              exclusive
              onChange={handleChange}
            >
              {Tableau10.map((value) => (
                <ToggleButton key={value} value={value} sx={{ p: 1 }}>
                  <div
                    style={{
                      width: 15,
                      height: 15,
                      backgroundColor: value,
                      display: 'inline-block',
                    }}
                  />
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Stack>
        </>
      ) : (
        <>Loading...</>
      )}
    </>
  );
}

export default RevenueChart;