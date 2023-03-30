import React from "react";
import { Input, Image } from "antd";
import hidePassword from "../../../asserts/hidePassword.svg";
import showPassword from "../../../asserts/showPassword.svg";
import "./MyCareerGuidanceInputFieldStyle.css";
const MyCareerGuidanceInputField = (props) => {
  return (
    <>
      <label>{props.label}</label>
      {props.type === "password" ? (
        <Input.Password
          placeholder={props.placeholder}
          value={props.passwordValue}
          type={props.type}
          defaultValue={props.defaultValue}
          className={props.className ? props.className : "inputFieldStyle"}
          onChange={props.onChange}
          name={props.name}
          autoComplete={props.autoComplete}
          required={props.required}
          iconRender={(visible) =>
            visible ? (
              <Image
                preview={false}
                src={showPassword}
                width={25}
                style={{ paddingRight: 5 }}
              />
            ) : (
              <Image
                preview={false}
                src={hidePassword}
                width={25}
                style={{ paddingRight: 5 }}
              />
            )
          }
          disabled={props.disabled}
          prefix={
            <div style={{ color: "#D3D3D3" }}>
              <Image
                preview={false}
                src={props.prefix}
                width={20}
                style={{ paddingRight: 5 }}
              />
              |
            </div>
          }
        />
      ) : (
        <Input
          placeholder={props.placeholder}
          value={props.inputValue}
          type={props.type}
          autoComplete={props.autoComplete}
          className={"inputFieldStyle"}
          onChange={props.onChange}
          name={props.name}
          required={props.required}
          suffix={props.suffix}
          onKeyDown={props.onKeyDown}
          disabled={props.disabled}
          prefix={
            <div style={{ color: "#D3D3D3" }}>
              <Image
                preview={false}
                src={props.prefix}
                width={20}
                style={{ paddingRight: 5 }}
              />
              |
            </div>
          }
        />
      )}
    </>
  );
};
export default MyCareerGuidanceInputField;
