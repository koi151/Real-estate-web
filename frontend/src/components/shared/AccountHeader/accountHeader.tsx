import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import clientAccountsService from "../../../services/client/accounts.service";
import adminAccountsService from "../../../services/admin/accounts.service";
import { resetAdminUserState, setAdminUser } from "../../../redux/reduxSlices/adminUserSlice";

import './accountHeader.scss'
import { resetClientUserState, setClientUser } from "../../../redux/reduxSlices/clientUserSlice";
import adminAuthorizationService from "../../../services/admin/authorization.service";
import clientAuthorizationService from "../../../services/client/authorization.service";

interface AccountHeaderProps {
  userType: 'admin' | 'client';
  navigateTo: string;
}

const AccountHeader: React.FC<AccountHeaderProps> = ({ userType, navigateTo }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const avatarUrl = useSelector((state: any) => state.clientUser.avatar);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const getUserService = userType === 'admin' ? adminAccountsService.getSingleAccountLocal : clientAccountsService.getSingleAccountLocal;
        const response = await getUserService();
  
        if (response.code === 200 && response.currentUser) {
          dispatch(userType === 'admin' ? setAdminUser(response.currentUser) : setClientUser(response.currentUser));
        } else {
          console.log('Unable to retrieve user information:', response.message || 'Cannot get user information');
        }
      } catch (err: any) {
        if (err.response && err.response.status === 401) {
          message.error('Unauthorized - Please log in to access this feature.', 3);
          navigate(`${userType === 'admin' ? '/admin/auth/login' : '/auth/login'}`);
        } else {
          console.error('Error occurred while fetching user data:', err);
        }
      }
    };
  
    fetchUserData();
  }, [userType, dispatch, navigate]);
  
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
          src={avatarUrl ? avatarUrl : ''}
          alt='avatar-header'
        />
        <div className="logout">LOGOUT</div>
      </div>
    </div>
  )
}

export default AccountHeader;