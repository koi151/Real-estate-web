import React, { ReactNode } from 'react';
import './statistic.scss';

interface StatisticProps {
  title: string;
  icon: ReactNode;
  value: ReactNode;
  label: ReactNode;
  color?: string;
}

const Statistic: React.FC<StatisticProps> = ({ title, icon, value, label, color = '' }) => {
  return (
    <>
      <span className='statistic-title'>{title}</span>
      <div className='statistic'>
        <div className={"statistic__icon " + (color && `statistic__icon--${color}`)}>
          {icon}
        </div>
        <div className='statistic__info'>
          <div className='statistic__info--value'>
            {value}
          </div>
          <div className='statistic__info--label'>
            {label}
          </div>
        </div>
      </div>
    </>
  );
}

export default Statistic;
