import { Tooltip } from "antd";
import React from "react";
import { FaRegEye } from "react-icons/fa";

interface ViewCountProps {
  propertyView: number | null | undefined;
}

const ViewCount: React.FC<ViewCountProps> = ({ propertyView }) => {
  return (
    <>
      {propertyView ? (
        <Tooltip title={`${propertyView} views`} placement="bottom">
          <div className='d-flex justify-content-center align-items-center'>
            <FaRegEye />
            {propertyView}
          </div>
        </Tooltip>
      ) : (
        <Tooltip title='No data of views' placement="bottom">
          <div className='d-flex justify-content-center align-items-center'>
            <FaRegEye />...
          </div>
        </Tooltip>
      )}
    </>
  );
}

export default ViewCount;
