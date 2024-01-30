import React, { useEffect, useState } from 'react';
import { Button, message } from 'antd';

import propertiesService from '../../../services/admin/properties.service';
import propertyCategoriesService from '../../../services/admin/property-categories.service';

import { ValidStatus } from '../../../../../backend/commonTypes';

interface StatusButtonProps {
  typeofChange: 'changePropertyStatus' | 'changePropertyCategoriesStatus'; 
  itemId: string;
  status: ValidStatus;
}

const StatusButton: React.FC<StatusButtonProps> = ({ typeofChange, itemId, status }) => {
  const [currentStatus, setCurrentStatus] = useState(status);

  const handleClickStatus = async () => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    try {
      let response;

      if (typeofChange === 'changePropertyStatus') {
        response = await propertiesService.changePropertyStatus(itemId, newStatus);
      } else if (typeofChange === 'changePropertyCategoriesStatus') {
        response = await propertyCategoriesService.changeCategoryStatus(itemId, newStatus);
      }

      if (response?.code === 200) {
        setCurrentStatus(newStatus);
        message.success(`Property status updated to ${newStatus}`, 3);
      } else {
        message.error(response?.message || 'An error occurred while changing property status.', 2);
      }
    } catch (error) {
      message.error('An error occurred while changing property status.', 2);
      console.log('Error occurred:', error);
    }
  };

  useEffect(() => {
    setCurrentStatus(status);
  }, [status]);

  return (
    <div className='item-wrapper__upper-content--status'>
      <p className='status-text'>Status: </p>
      <Button
        type='primary'
        className={`${currentStatus}-btn small-btn`}
        onClick={handleClickStatus}
        data-id={itemId}
      >
        {currentStatus}
      </Button>
    </div>
  );
};

export default StatusButton;
