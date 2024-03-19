import React from "react";
import './postType.scss'
import { Button } from "antd";

import { IoEyeOutline } from "react-icons/io5";

interface PostTypeProps {
  title: string
  color?: string
  height?: string
  active?: boolean
  pricePerDay?: number | null;
  minView?: number | null
  displaySelect?: boolean
  alignCenter?: boolean
}

const PostType: React.FC<PostTypeProps> = ({ title, color, pricePerDay, active, minView, height, displaySelect, alignCenter }) => {
  return (
    <div className="type-wrapper" style={{ height: height }}>
      <div className={`${!alignCenter && 'd-flex flex-column align-items-start'}`}>
        <div className={`type-wrapper--title ${color}`}>
          {title}
        </div>
        <div className="type-wrapper__price-range">
          From <span className="type-wrapper__price-range--price">${pricePerDay}</span>/day
        </div>
      </div>
      <div className="d-flex flex-column justify-content-center align-items-center">
        {minView && (
          <>
            <div className="d-flex justify-content-center align-items-center">
              <IoEyeOutline style={{ fontSize: '2.2rem', marginRight: ".5rem"}}/>
              <span className={`${color}`} style={{ fontSize: "1.5rem"}}>
                x{minView}
              </span>
            </div>
            <span className="post-view-txt">post views</span>
          </>
        )}
      </div>
      {displaySelect && (
        <div>
          <Button className={`type-wrapper__select-btn ${active && 'selected'}`}>
            {active ? 'Selected' : "Select"}
          </Button>
        </div>
      )}
    </div>
  )
}

export default PostType