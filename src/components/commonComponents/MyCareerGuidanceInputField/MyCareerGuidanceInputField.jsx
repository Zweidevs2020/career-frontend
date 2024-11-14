import React from "react";
import { Input, Image } from "antd";
import hidePassword from "../../../assets/hidePassword.svg";
import showPassword from "../../../assets/showPassword.svg";
import "./MyCareerGuidanceInputFieldStyle.css";
const MyCareerGuidanceInputField = (props) => {
  const isPassword = props.type === "password";
  return (
    <>
      <label>{props.label}</label>
      {isPassword ? (
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
            props.prefix ? (
              <div style={{ color: "#D3D3D3" }}>
                <Image
                  preview={false}
                  src={props.prefix}
                  width={20}
                  style={{ paddingRight: 5 }}
                />
                |
              </div>
            ) : null
          }
        />
      ) : props.isPrefix == undefined || props.isPrefix ? (
        <Input
          placeholder={props.placeholder}
          value={props.inputValue}
          type={props.type}
          autoComplete={props.autoComplete}
          className={"inputFieldStyle"}
          onChange={props.onChange}
          onBlur={props.onBlur}
          required={props.required}
          suffix={props.suffix}
          onKeyDown={props.onKeyDown}
          disabled={props.disabled}
          name={props.name}
          prefix={
            props.prefix ? (
              <div
                style={{
                  color: "#D3D3D3",
                  display: "flex",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  preview={false}
                  src={props.prefix}
                  width={20}
                  style={{ paddingRight: 5 }}
                />
                |
              </div>
            ) : null
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
          autoFocus={props.inputValue}
          name={props.name}
          required={props.required}
          suffix={props.suffix}
          onKeyDown={props.onKeyDown}
          disabled={props.disabled}
          {...props}
        />
      )}
    </>
  );
};
export default MyCareerGuidanceInputField;
