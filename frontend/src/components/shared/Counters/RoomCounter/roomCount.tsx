import React from 'react';
import { Tooltip } from 'antd';
import { IoBedOutline } from 'react-icons/io5';
import { LuBath } from 'react-icons/lu';
import { getRoomCount } from '../../../../helpers/standardizeData';
import { RoomType } from '../../../../../../backend/commonTypes';

interface RoomCountTooltipProps {
  tooltip?: boolean;
  roomList: string[] | undefined;
  type: RoomType;
}

const RoomCountTooltip: React.FC<RoomCountTooltipProps> = ({ roomList, type, tooltip = true }) => {
  const roomCount = roomList ? getRoomCount(roomList, type) : null;
  const title = roomCount !== null ? `${roomCount} ${type}` : `No data of ${type.toLowerCase()}`;

  let icon;
  switch (type) {
    case 'bedrooms':
      icon = <IoBedOutline />;
      break;
    case 'bathrooms':
      icon = <LuBath />;
      break;
    // case 'kitchens':
    //   icon = < />;
    //   break;
    // case 'livingRooms':
    //   icon = < />;
    //   break;
    default:
      icon = null;
  }

  return (
    <>
      {tooltip ? (
        <Tooltip title={title} className='d-flex align-items-center mb-2'>
          {icon}
          {roomCount ? <span className='mb-1'>{roomCount}</span> : <span>...</span>}
        </Tooltip>
      ) : (
        <>
        {roomCount && (
          <div className='d-flex align-items-center justify-content-center mr-2'>
            <span style={{fontSize: '1.4rem', color: '#666'}}>{roomCount}</span>
            <span style={{marginLeft: ".5rem", fontSize: '1.8rem', color: '#666'}}>{icon}</span>
          </div>
        )}
        </> 
      )}
    </>
  );
};

export default RoomCountTooltip;
