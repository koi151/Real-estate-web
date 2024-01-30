import React from 'react';
import { Tooltip } from 'antd';
import { IoBedOutline } from 'react-icons/io5';
import { LuBath } from 'react-icons/lu';
import { getRoomCount } from '../../../../helpers/standardizeData';
import { RoomType } from '../../../../../../backend/commonTypes';

interface RoomCountTooltipProps {
  roomList: string[] | null;
  type: RoomType;
}

const RoomCountTooltip: React.FC<RoomCountTooltipProps> = ({ roomList, type }) => {
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
    <Tooltip title={title} className='d-flex align-items-center'>
      <div style={{ marginBottom: "1rem" }}>
        {icon}
        {roomCount ? <span className='' >{roomCount}</span> : <>...</> }
      </div>
    </Tooltip>
  );
};

export default RoomCountTooltip;
