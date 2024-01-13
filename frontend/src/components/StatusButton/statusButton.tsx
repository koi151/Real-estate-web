import React, { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import propertiesService from '../../services/admin/properties.service';
import { ValidStatus } from '../../../../backend/commonTypes';

interface StatusButtonProps {
  itemId: string;
  status: ValidStatus;
}

const StatusButton: React.FC<StatusButtonProps> = ({ itemId, status }) => {
  const [currentStatus, setCurrentStatus] = useState(status);

  const handleClickStatus = async () => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const response = await propertiesService.changePropertyStatus(itemId, newStatus);
      if (response?.code === 200) {
        setCurrentStatus(newStatus);
      } else {
        message.error(response.message, 2);
      }
    } catch (error) {
      message.error('An error occurred while changing property status.', 2);
      console.log('Error occurred:', error);
    }
  };

  useEffect(() => {
    setCurrentStatus(status); // Update the state initially
  }, [status]);

  return (
    <div className='item-wrapper__upper-content--status'>
      <p className='status-text'>Status: </p>
      <Button
        type='primary'
        className={`${currentStatus}-btn small-btn`}
        onClick={handleClickStatus}
      >
        {currentStatus}
      </Button>
    </div>
  );
};

export default StatusButton;
