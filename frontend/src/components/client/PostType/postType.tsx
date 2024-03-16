import React from "react";
import './postType.scss'
import { Button } from "antd";

interface PostTypeProps {
  title: string
  pricePerDay?: string
}

const PostType: React.FC<PostTypeProps> = ({ title, pricePerDay }) => {
  return (
    <div className="type-wrapper">
      <div>
        <div className="type-wrapper--title">
          {title}
        </div>
        <div className="type-wrapper__price-range">
          From <span className="type-wrapper__price-range--price">{pricePerDay}</span>/day
        </div>
      </div>
      <div>
        <Button className="type-wrapper__select-btn">Select</Button>
      </div>
    </div>
  )
}

export default PostType