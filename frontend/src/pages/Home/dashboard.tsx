import { Breadcrumb, Col, Row, message } from 'antd';
import React, { useEffect, useState } from 'react';
import CardItem from '../../components/admin/CardItem/cardItem';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineLineChart } from 'react-icons/ai';
import Statistic from '../../components/admin/Statistic/statistic';
import { FaUsersCog } from "react-icons/fa";
import NoPermission from '../../components/admin/NoPermission/noPermission';
import dashboardService from '../../services/admin/dashboard.service';
import { DashboardStatistics, Statistics } from '../../../../backend/commonTypes';


const DashBoard: React.FC = () => {
  const navigate = useNavigate();

  const [accessAllowed, setAccessAllowed] = useState(true);
  const [loading, setLoading] = useState(true);

  const createInitialStatistics = (): Statistics => ({
    total: 0,
    active: 0,
    inactive: 0
  });
  
  const [statistics, setStatistics] = useState<DashboardStatistics>({
    adminAccounts: createInitialStatistics(),
    properties: createInitialStatistics(),
    categories: createInitialStatistics()
  });

  // fetch statistic data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getStatistics();

        if (response.code === 200) {
          setStatistics(response.statistics);
        } else {
          message.error('Error occurred, cannot fetch data', 3);
        }

      } catch (err: any) {
        if ((err.response && err.response.status === 401) || err.message === 'Unauthorized') {
          message.error('Unauthorized - Please log in to access this feature.', 3);
          navigate('/admin/auth/login');
        } else {
          message.error('Error occurred while fetching properties data', 2);
          console.log('Error occurred:', err);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [])

  return (
    <>
    {accessAllowed ? (
      <>
        <div className='title-wrapper'>
          <h1 className="main-content-title">Welcome To Dashboard</h1>
          <Breadcrumb
            className='mt-1 mb-1'
            items={[
              { title: <Link to="/admin">Admin</Link> },
              { title: <Link to="/admin/dashboard">Dashboard</Link> },
            ]}
          />
        </div>

        <Row gutter={[20, 20]} className='mb-20'>
          <Col xxl={6} xl={6} lg={6} md={12} sm={24} xs={24}>
            <CardItem>
              <Statistic
                title={'Admin accounts'} 
                icon={<FaUsersCog />} 
                value={`${statistics?.adminAccounts?.active} / ${statistics?.adminAccounts?.total}`} 
                label={'Active accounts'} color='blue'/>
            </CardItem>
          </Col>
          <Col xxl={6} xl={6} lg={6} md={12} sm={24} xs={24}>
            <CardItem>
              <Statistic
                title={'Properties:'} 
                icon={<AiOutlineLineChart />} 
                value={`${statistics?.properties?.active} / ${statistics?.properties?.total}`} 
                label={'Active properties'} color='green'
              />
            </CardItem>
          </Col>
          <Col xxl={6} xl={6} lg={6} md={12} sm={24} xs={24}>
            <CardItem>
              <Statistic
                title={'Property categories:'} 
                icon={<AiOutlineLineChart />} 
                value={`${statistics?.categories?.active} / ${statistics?.categories?.total}`} 
                label={'Active categories'} color='yellow'
              />
            </CardItem>
          </Col>
        </Row>
      </>
    ) : (
      <NoPermission permissionType='view' />
    )}
  </>
  );
}

export default DashBoard;
