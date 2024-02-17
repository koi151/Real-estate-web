import React, { ReactNode } from "react";
import './cardItem.scss';

interface CardItemProps {
  children: ReactNode;
}

const CardItem: React.FC<CardItemProps> = ({ children }) => {
  return (
    <div className="card-item">
      {children}
    </div>
  );
}

export default CardItem;
