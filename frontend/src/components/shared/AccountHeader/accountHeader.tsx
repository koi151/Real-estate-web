import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import clientAccountsService from "../../../services/client/accounts.service";
import adminAccountsService from "../../../services/admin/accounts.service";
import { resetAdminUserState, setAvatar } from "../../../redux/reduxSlices/adminUserSlice";

import './accountHeader.scss'
import { resetClientUserState } from "../../../redux/reduxSlices/clientUserSlice";

interface AccountHeaderProps {
  userType: 'admin' | 'client';
  navigateTo: string;
}

const AccountHeader: React.FC<AccountHeaderProps> = ({ userType, navigateTo }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const avatarUrl = useSelector((state: any) => state.clientUser);

  // get user avatar if redux don't have
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem(`${userType}UserId`);
        if (userId) {
          try {
            let response: any;

            if (userType === 'admin')
              response = await adminAccountsService.getAvatar(userId);
            else response = await clientAccountsService.getAvatar(userId);

            if (response.code === 200 && response.currentUser) {
              dispatch(setAvatar(response.currentUser.avatar));
            } else {
              console.log('Unable to retrieve user avatar:', response.message || 'No avatar found');
            }
          } catch (err) {
            console.error('Error occurred while fetching user avatar - header:', err);
          }
        } else {
          console.log('User ID not found in local storage');
        }

      } catch (err: any) {
        if (err.response && err.response.status === 401) {
          message.error('Unauthorized - Please log in to access this feature.', 3);
          navigate('/admin/auth/login');
        } else {
          console.log('Error occurred while fetching user avatar:', err);
        }
      }
    }

    if (avatarUrl) return;
    fetchData();
  }, [])

  const handleProfileClick = () => {
    try {
      if (userType === 'admin') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        dispatch(resetAdminUserState())

      } else {
        localStorage.removeItem('clientAccessToken');
        localStorage.removeItem('clientRefreshToken');
        dispatch(resetClientUserState())
      }

      localStorage.removeItem(`${userType}UserId`);

      message.success('Account log out successful!', 3);
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
          src={avatarUrl ? avatarUrl : ''}
          alt='avatar-header'
        />
        <div className="logout">LOGOUT</div>
      </div>
    </div>
  )
}

export default AccountHeader;