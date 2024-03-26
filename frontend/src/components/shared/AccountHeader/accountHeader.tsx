import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { useNavigate } from "react-router-dom";

import { resetAdminUserState } from "../../../redux/reduxSlices/adminUserSlice";

import './accountHeader.scss'
import { resetClientUserState } from "../../../redux/reduxSlices/clientUserSlice";
import adminAuthorizationService from "../../../services/admin/authorization.service";
import clientAuthorizationService from "../../../services/client/authorization.service";

interface AccountHeaderProps {
  userType: 'admin' | 'client';
  navigateTo: string;
}

const AccountHeader: React.FC<AccountHeaderProps> = ({ userType, navigateTo }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const avatarUrl = useSelector((state: any) =>
    userType === 'admin' ? state.adminUser.avatar : state.clientUser.avatar
  );

  const handleProfileClick = async () => {
    try {
      if (userType === 'admin') {
        await adminAuthorizationService.logout();
        dispatch(resetAdminUserState())

      } else {
        await clientAuthorizationService.logout();
        dispatch(resetClientUserState())
      }

      message.success('Account logout successful!', 3);
      navigate(navigateTo);

    } catch (err) {
      console.log("Error occurred:", err);
      message.error('Error occurred, cannot log out');
    }
  };

  return (
    <div className="navigation">
      <div className="button" onClick={handleProfileClick}>
        <img 
          className="avatar-header"
          src={avatarUrl ? avatarUrl : 'http://res.cloudinary.com/dd3xua0wu/image/upload/v1707278464/af49qenxpqoxdijei6s5.jpg'}
          alt='avatar-header'
        />
        <div className="logout">LOGOUT</div>
      </div>
    </div>
  )
}

export default AccountHeader;