import { Tooltip } from "antd";
import { IoBedOutline } from "react-icons/io5";
import { LuBath } from "react-icons/lu";
import { getRoomCount } from '../../helpers/standardizeData'

const RoomCountTooltip = ({ roomList, type }) => {
  const roomCount = getRoomCount(roomList, type);

  const title = roomCount !== null ? `${roomCount} ${type}` : `No data of ${type.toLowerCase()}`;
  const icon = type === 'bedrooms' ? <IoBedOutline /> : <LuBath />;

  return (
    <Tooltip title={title} className='d-flex align-items-center'>
      <div style={{ marginBottom: "1rem" }}>
        {icon}
        {roomCount ? 
          <span className='' >{roomCount}</span> 
        : <>...</>
        }
      </div>
    </Tooltip>
  );
};

export default RoomCountTooltip;