import React from "react";
import { Input, Image, Button } from "antd";
const MyCareerGuidanceButton = (props) => {
  return (
    <>
      <Button
        type={props.type}
        icon={props.icon}
        loading={props.loading}
        onClick={props.onClick}
        disabled={props.disabled}
        className={props.className}
        htmlType={props.htmlType}
        style={{color:props.color, backgroundColor:props.backgroundColor,width:props.width ? props.width : null}}
      >
        {props.label}
      </Button>
    </>
  );
};
export default MyCareerGuidanceButton;
