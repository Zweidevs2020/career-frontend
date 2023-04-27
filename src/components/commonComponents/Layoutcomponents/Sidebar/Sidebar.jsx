import React, { useState, useEffect } from "react";
import { Layout, Menu, Select, message, Form } from "antd";
import mycareer from "../../../../assets/mycareer.png";
import Home from "../../../../assets/Home.svg";
import Gp from "../../../../assets/Gp.svg";
import profile from "../../../../assets/profile.svg";
import assesment from "../../../../assets/assesment.svg";
import goal from "../../../../assets/goal.svg";
import pf from "../../../../assets/pf.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { HomeSvg } from "../../../../utils/svg";
import { CalculatorSvg } from "../../../../utils/svg";
import { GoalSvg } from "../../../../utils/svg";
import { ProfileSvg } from "../../../../utils/svg";
import { AssesmentSvg } from "../../../../utils/svg";
import { StudySvg } from "../../../../utils/svg";

import "./SidebarStyle.css";
const { Content, Sider, Header } = Layout;
const { Option } = Select;

const Sidebar = ({ children, flags }) => {
  const navigate = useNavigate();
  const [selectedMenuItem, setSelectedMenuItem] = useState("Overview");
  const componentsSwtich = (key) => {
    setSelectedMenuItem(key);
    if (key === "Overview") {
      navigate("/dashboard");
    } else if (key === "MyGoals") {
      navigate("/mygoals");
    } else if (key === "CAOCalculator") {
      navigate("/calculator");
    } else if (key === "CoverLater") {
      navigate("/coverletter");
    } else if (key === "Reporting") {
      navigate("/self-assesment");
    } else if (key === "Learning") {
      navigate("/self-assesment");
    } else if (key === "Activities") {
      navigate("/self-assesment");
    } else if (key === "MembershipsandBilling") {
      navigate("/self-assesment");
    } else {
      navigate("/self-assesment");
    }
  };
  return (
    <Layout
      style={{
        height: "100%",
        width: "100%",
        minHeight: "100vh",
        background: "#F8FAFC",
      }}
    >
      <Sider className="backgroundColorSidebar">
        <div className="logoStyle my-2">
          <img src={mycareer} alt="cyberLegendLogo" width="70%" />
        </div>
        <div className="selectTextMain">
          <Menu
            selectedKeys={selectedMenuItem}
            mode="inline"
            className="sideBarStyle"
            onClick={(e) => componentsSwtich(e.key)}
          >
            <Menu.Item key="Overview" icon={<HomeSvg />}>
              <span className="textStyling">Overview</span>
            </Menu.Item>
            <Menu.Item key="CAOCalculator" icon={<CalculatorSvg />}>
              <span className="textStyling">CAO Calculator</span>
            </Menu.Item>
            <Menu.Item key="MyGoals" icon={<GoalSvg />}>
              <span className="textStyling">My Goals</span>
            </Menu.Item>
            <Menu.Item key="CoverLater" icon={<ProfileSvg />}>
              <span className="textStyling">CV/Cover Later</span>
            </Menu.Item>
            <Menu.Item key="SelfAssessment" icon={<AssesmentSvg />}>
              <span className="textStyling">Self Assessment</span>
            </Menu.Item>
            <Menu.Item key="MyStudy" icon={<StudySvg />}>
              <span className="textStyling">My Study</span>
            </Menu.Item>
            {/* <Menu.Item
              key="EducationalGuidance"
              icon={<img src={Home} alt="cyberLegendLogo" />}
            >
              <span class="text-[#737373] text-md font-lighter lg:text-[12px] ">
                Educational Guidance
              </span>
            </Menu.Item> */}
          </Menu>
        </div>
      </Sider>
      <Layout className="site-layout">
        <Header style={{padding:0}} className="Navbar">
          <div className="navtext">
            <p className="nav-text">
              Hello <strong> Bruno Fernandes</strong>, welcome back!
            </p>
          </div>
          <div className="img">
            <div className="imgcard">
              <img src={pf} className="cardprofile" />
              <div className="cardtext">
                <p className="name" style={{height:20 , color: "white",}}>Bruno Fernandes</p>
                <p className="email" >Bruno@gmail.com</p>

              </div>
            </div>
          </div>
        </Header>
        <Content className="marginContent">
          <div className="site-layout-background">{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Sidebar;
