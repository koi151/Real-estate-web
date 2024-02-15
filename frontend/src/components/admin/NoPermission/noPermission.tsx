import React from "react";

interface Props {
  permissionType: string;
}

const NoPermission: React.FC<Props> = ({ permissionType }) => {
  return (
    <div className="no-permission-div">
      Account does not have permission to {permissionType}
    </div>
  );
}

export default NoPermission;
