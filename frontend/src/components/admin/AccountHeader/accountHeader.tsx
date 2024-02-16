import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import adminAccountsService from "../../../services/admin/accounts.service";
import { setAvatar } from "../../../redux/reduxSlices/userSlice";

import './accountHeader.scss'

const AccountHeader: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const avatarUrl = useSelector((state: any) => state.user?.avatar);

  // get user avatar if redux don't have
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('adminUserId');
        if (userId) {
          try {
            const response = await adminAccountsService.getAvatar(userId);
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
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('adminUserId');

      message.success('Account log out successful!', 3);
      navigate('/admin/auth/login');

    } catch (err) {
      console.log("Error occurred:", err);
      message.error('Error occurred, cannot log out');
    }
  };

  return (
    <div className="navigation">
      <div className="button" onClick={handleProfileClick}>
        <img 
          src={avatarUrl ? avatarUrl : ''}
          alt='avatar-header'
        />
        <div className="logout">LOGOUT</div>
      </div>
    </div>
  )
}

export default AccountHeader;