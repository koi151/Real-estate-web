import AllRoute from './components/admin/AllRouters/allRouters';
import './App.scss';
import React from 'react';
import { ConfigProvider } from 'antd';

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#6259ca'
        },
      }}
    >
    <AllRoute/>
  </ConfigProvider>
  )
}

export default App;
