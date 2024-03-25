import React from "react";
import { Button, Result } from "antd";
import { Link } from "react-router-dom";

interface CreatePostResultProps {
  handleCurrentReset: () => void
}

const CreatePostResult: React.FC<CreatePostResultProps> = ({ handleCurrentReset }) => {
  return (
    <>
      <Result
        style={{height: '60rem'}}
        status="success"
        title="Create post successful!"
        subTitle="Post created successfully. Your post has been added to moderation queue, please wait for a moment"
        extra={[
          <Link to="/" onClick={handleCurrentReset}>
            <Button key="buy">View pending post</Button>
          </Link>,
          <Link to="/properties" onClick={handleCurrentReset}>
            <Button type="primary" key="console">
              Back to home
            </Button>
          </Link>,
        ]}
      />
    </>
  );
};

export default CreatePostResult;
