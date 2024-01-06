import { Breadcrumb, Table } from 'antd';
import { getProperties } from '../../services/admin/properties.service';
import './properties.scss'
import { useEffect, useState } from 'react';

const Properties = () => {
  const [propertyList, setPropertyList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProperties('/properties');
        setPropertyList(response.properties);
      } catch (error) {
        console.log('Error occurred:', error);
      }
    };
    fetchData();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'title',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
  ];

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
  }

  return (
    <>
      <h1 className="main-content-title">Properties:</h1>
      <Breadcrumb style={{ margin: '16px 0' }} items={[
        <Breadcrumb.Item>Home</Breadcrumb.Item>,
        <Breadcrumb.Item>Properties</Breadcrumb.Item>
      ]} />
      {propertyList.length ? (
        <Table 
          rowSelection={{ type: "checkbox", ...rowSelection, }} 
          columns={columns} 
          dataSource={propertyList.map((property, index) => ({ key: index, ...property }))} 
        />
      ) : (
        <> Loading... </>
      )}
    </>
  )
}

export default Properties;
