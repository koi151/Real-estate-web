import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import clientAccountsService from "../../../services/client/accounts.service";
import { setClientUser } from "../../../redux/reduxSlices/clientUserSlice";
import { Spin, message } from "antd";
import adminAccountsService from "../../../services/admin/accounts.service";
import { setAdminUser } from "../../../redux/reduxSlices/adminUserSlice";

interface UserResponse {
  code: number;
  user: any; 
}

interface ProtectedRouteProps {
  userType: 'admin' | 'client',
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ userType, children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response: UserResponse = userType === 'admin' 
          ? await adminAccountsService.getSingleAccountLocal()
          : await clientAccountsService.getSingleAccountLocal()
          
        if (response.code === 200 && response.user) {
          setIsAuthenticated(true);
          userType === 'admin' ? dispatch(setAdminUser(response.user)) : dispatch(setClientUser(response.user))
        } else {
          setIsAuthenticated(false);
        }
      } catch (err: any) {
        if (err.response && err.response.status === 401) {
          message.error('Unauthorized - Please log in to access this feature.', 3);
          navigate('/auth/login');
        } else {
          console.error('Error occurred while fetching user data:', err);
        }
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, dispatch, userType]);

  // Render loading indicator
  if (isLoading) {
    return (
      <Spin size="large" className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }} />
    );
  }

  return isAuthenticated ? children : <Navigate to="/auth/login" replace />;
};

export default ProtectedRoute;
