import React from "react";
import { Input, Image, Button } from "antd";
const MyCareerGuidanceButton = (props) => {
  return (
    <>
      <Button
        type={props.props}
        icon={props.icon}
        loading={props.loading}
        onClick={props.onClick}
        disabled={props.disabled}
        className={props.className}
        htmlType={props.htmlType}
      >
        {props.label}
      </Button>
    </>
  );
};
export default MyCareerGuidanceButton;
