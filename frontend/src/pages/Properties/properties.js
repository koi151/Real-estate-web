import { Breadcrumb, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';

import { getProperties } from '../../services/admin/properties.service';
import './properties.scss'

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

  const standardizeDefaultText = (word) => {
    return word
      ? word.toLowerCase().startsWith('for')
        ? `For ${word.slice(3)}`
        : word.charAt(0).toUpperCase() + word.slice(1)
      : word;
  };
      
  // const rowSelection = {
  //   onChange: (selectedRowKeys, selectedRows) => {
  //   },
  // }

  return (
    <>
      <h1 className="main-content-title">Properties:</h1>
      <Breadcrumb style={{ margin: '16px 0' }} items={[
        <Breadcrumb.Item>Home</Breadcrumb.Item>,
        <Breadcrumb.Item>Properties</Breadcrumb.Item>
      ]} />

      {propertyList.length > 0 ? (
        propertyList.map((property, index) => (
          <div className='item-wrapper' key={index}>
            <img
              src={property.images && property.images.length > 0 ? property.images[0] : ""}  
              className='item-wrapper__image'
              alt='property img'
            />

            <div className='item-wrapper__info'>
              <h3 className='item-wrapper__info--title'>
                {property.title}
              </h3>

              <div className='item-wrapper__info--location'>
                {property.location && (
                  <span>{property.location.city}, {property.location.district}</span>
                )}
                {!property.location && "No information"}
              </div>

              <div className='item-wrapper__info--listing-type'>
                <Space size={[0, 8]} wrap>
                  {property.listingType === 'forSale' && (
                    <Tag
                      className="listing-type-tag" 
                      color={property.listingType === 'forSale' ? 'green' : 'orange'}
                    >
                      {standardizeDefaultText(property.listingType)}
                    </Tag>
                  )}

                  {property.propertyDetails && property.propertyDetails.propertyType === 'house' && (
                    <Tag
                      className="listing-type-tag" 
                      color={property.propertyDetails.propertyType === 'house' ? 'purple' : ''}
                    >
                      {standardizeDefaultText(property.propertyDetails.propertyType)}
                    </Tag>
                  )}
                
               </Space>
              </div>
              

              
            </div>


          </div>
        ))
      ) : (
        <> Loading... </>
      )}

    </>
  )
}

export default Properties;
