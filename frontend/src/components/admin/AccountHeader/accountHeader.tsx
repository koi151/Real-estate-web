import { message } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import './accountHeader.scss'

const AccountHeader: React.FC = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

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
          src="https://pbs.twimg.com/profile_images/378800000639740507/fc0aaad744734cd1dbc8aeb3d51f8729_400x400.jpeg"
          alt='avatar-header'
        />
        <div className="logout">LOGOUT</div>
      </div>
    </div>
  )
}

export default AccountHeader;