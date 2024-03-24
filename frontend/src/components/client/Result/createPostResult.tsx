import { Button, Result } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const CreatePostResult: React.FC = () => {
  return (
    <>
      <Result
        status="success"
        title="Create post successful!"
        subTitle='Post created successfully. Your post has been added to moderation queue, please wait for a moment'   
        extra={[
          <Link to='/'>
            <Button key="buy">View pending post</Button>,
          </Link>,

          <Link to='/properties'>
            <Button type="primary" key="console">
              Back to home
            </Button>
          </Link>
        ]}
      />
    </>
  )
}

export default CreatePostResult;