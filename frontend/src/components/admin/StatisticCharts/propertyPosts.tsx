import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Select, Skeleton, message } from 'antd';

import './revenue.scss'
import dashboardService from '../../../services/admin/dashboard.service';

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

const PropertyPosts: React.FC = () => {
  const [ color, setColor ] = React.useState('#4e79a7');
  const [ billData, setBillData ] = useState<any>(undefined);
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [ timeRevenueStatistic, setTimeRevenueStatistic ] = useState<string>('14-days');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dashboardService.getRevenueStatistic(timeRevenueStatistic, 'posts');
        if (response.code === 200) {
          setBillData(response.data)
        } else {
          message.error(response.message, 3)
        }

      } catch (err: any) {
        console.log('Error occurred while fetching statistic data');
        message.error('Error occurred while fetching statistic data', 3)
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRevenueStatistic])

  const handleChange = (event: React.MouseEvent<HTMLElement>, nextColor: string) => {
    setColor(nextColor);
  };

  
  setTimeout(() => {
    const viewBox = document.querySelector(
      '.properties-statistic-wrapper .MuiStack-root .css-172kpif-MuiResponsiveChart-container'
    )?.querySelector('svg');
  
    if (viewBox) { // temporary fix MUI display err
      viewBox.setAttribute('viewBox', "0 0 765 310");
    }
  }, 500);


  return (
    <Skeleton
      loading={isLoading} active 
      style={{ padding: '3.5rem' }}
    >
      <div className='properties-statistic-wrapper'>
        <div style={{width: "80%"}}>
          {billData ? (
            <Skeleton loading={isLoading} active style={{ padding: '3.5rem' }}>
              <Stack direction="column" spacing={2} alignItems="left" sx={{ width: '100%' }}>
                <LineChart
                  dataset={billData}
                  xAxis={[{ scaleType: 'band', dataKey: 'createdAt' }]}
                  series={[
                    {
                      dataKey: 'count',
                      label: 'Post number',
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
            </Skeleton>
            
          ) : (
            <Skeleton loading={isLoading} active style={{ padding: '3.5rem' }} />
          )}
        </div>
        <div className='d-flex flex-column' style={{width: "20%"}}>
          <div className='properties-statistic-wrapper--title mt-4'>
            Post statistics
          </div>
          <Select
            defaultValue='Past 2 weeks'
            placement='bottomLeft'
            placeholder="Choose date range"
            onChange={(value: any) => setTimeRevenueStatistic(value)}
            options = {[
              { label: 'Past 7 days', value: '6-days' },
              { label: 'Past 2 weeks', value: '13-days' },
              { label: 'Past 6 months', value: '5-months' },
              { label: 'Past 1 year', value: '12-months' },
              { label: 'Past 3 year', value: '3-years' },
            ]}
            style={{width: "100%", marginTop: ".5rem"}}
          >
          </Select>
        </div>
      </div>
    </Skeleton>
  );
}

export default PropertyPosts;