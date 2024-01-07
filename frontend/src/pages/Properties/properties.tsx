import React, { useEffect, useState } from 'react';
import { Breadcrumb, Space, Tag } from 'antd';
import { getProperties } from '../../services/admin/properties.service';
import './properties.scss';

interface Location {
  city: string;
  district: string;
}

interface PropertyDetails {
  propertyType: string;
}

interface Property {
  title: string;
  images?: string[];
  location?: Location;
  listingType?: string;
  propertyDetails?: PropertyDetails;
}

const Properties: React.FC = () => {
  const [propertyList, setPropertyList] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProperties('/properties');
        setPropertyList(response.properties);
      } catch (error) {
        setError('An error occurred while fetching properties.');
        console.log('Error occurred:', error);
      }
    };
    fetchData();
  }, []);

  const standardizeDefaultText = (word: string): string => {
    return word ? word.toLowerCase().startsWith('for') ? `For ${word.slice(3)}` : word.charAt(0).toUpperCase() + word.slice(1) : word;
  };

  const renderTag = (value: string, colorMap: Record<string, string>) => (
    <Tag className="listing-type-tag" color={colorMap[value]}>
      {standardizeDefaultText(value)}
    </Tag>
  );

  return (
    <>
      <h1 className="main-content-title">Properties:</h1>
      <Breadcrumb style={{ margin: '16px 0' }} items={[
        {breadcrumbName: 'Home'},
        {breadcrumbName: 'Properties'}
      ]} />

      {error ? (
        <div>{error}</div>
      ) : propertyList.length > 0 ? (
        propertyList.map((property, index) => (
          <div className='item-wrapper' key={index}>
            <img src={property.images?.[0] ?? ""} className='item-wrapper__image' alt='property img' />
            <div className='item-wrapper__info'>
              <h3 className='item-wrapper__info--title'>{property.title}</h3>
              <div className='item-wrapper__info--location'>
                {property.location ? (
                  <span>{property.location.city}, {property.location.district}</span>
                ) : "No information"}
              </div>
              <div className='item-wrapper__info--listing-type'>
                <Space size={[0, 8]} wrap>
                  {property.listingType === 'forSale' 
                    && renderTag(property.listingType, { forSale: 'green', forRent: 'orange' })}
                  {property.propertyDetails?.propertyType === 'house' 
                    && renderTag(property.propertyDetails.propertyType, { house: 'purple', apartment: 'blue' })}
                </Space>
              </div>
            </div>
          </div>
        ))
      ) : (
        <>Loading...</>
      )}
    </>
  );
};

export default Properties;

