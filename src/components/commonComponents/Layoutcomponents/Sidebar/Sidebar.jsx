import React, { useState, useEffect } from "react";
import { Layout, Menu, Image } from "antd";
import mycareer from "../../../../assets/mycareer.png";
import logout from "../../../../assets/logout.svg";

import { useLocation, useNavigate } from "react-router-dom";
import { removeToken } from "../../../../utils/LocalStorage";
import {
  HomeSvg,
  EducationalSvg,
  CalculatorSvg,
  GoalSvg,
  ProfileSvg,
  AssesmentSvg,
  StudySvg,
} from "../../../../utils/svg";
import { API_URL } from "../../../../utils/constants";
import "./SidebarStyle.css";
import { getApiWithAuth } from "../../../../utils/api";
import MyCareerGuidanceButton from "../../MyCareerGuidanceButton";
const { Content, Sider, Header } = Layout;
const Sidebar = ({ children, flags }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedMenuItem, setSelectedMenuItem] = useState("Overview");
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    setLoading(true);
    const response = await getApiWithAuth(API_URL.GETUSER);
    console.log("===========================te", response);
    if (response.data.status === 200) {
      setUserData(response.data.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const componentsSwtich = (key) => {
    setSelectedMenuItem(key);
    if (key === "Overview") {
      navigate("/dashboard");
    } else if (key === "CAOCalculator") {
      navigate("/cao-calculator");
    } else if (key === "MyGoals") {
      navigate("/my-goals");
    } else if (key === "CoverLater") {
      // navigate("/cover-letter");
    } else if (key === "SelfAssessment") {
      navigate("/self-assesment");
    } else if (key === "EducationalGuidance") {
      navigate("/educational-guidance");
    } else {
      navigate("/my-study");
    }
  };
  useEffect(() => {
    if (location.pathname === "/dashboard") {
      setSelectedMenuItem("Overview");
    } else if (location.pathname === "/cao-calculator") {
      setSelectedMenuItem("CAOCalculator");
    } else if (location.pathname === "/my-goals") {
      setSelectedMenuItem("MyGoals");
    } else if (location.pathname === "/cover-letter") {
      setSelectedMenuItem("CoverLater");
    } else if (
      location.pathname === "/self-assesment" ||
      location.pathname === "/self-assesment-test"
    ) {
      setSelectedMenuItem("SelfAssessment");
    } else if (
      location.pathname === "/educational-guidance" ||
      location.pathname === "/educational-guidance-test"
    ) {
      setSelectedMenuItem("EducationalGuidance");
    } else {
      setSelectedMenuItem("MyStudy");
    }
  }, [location]);
  const logoutUser = async () => {
    removeToken();
    navigate("/");
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
            <Menu.Item
              key="Overview"
              icon={
                <HomeSvg
                  fill={selectedMenuItem === "Overview" ? "#1476B7" : "#BDBDBD"}
                />
              }
            >
              <span className="textStyling">
                Overview{" "}
                {selectedMenuItem === "Overview" ? (
                  <span> &nbsp;&nbsp;&#x25cf; </span>
                ) : null}
              </span>
            </Menu.Item>
            <Menu.Item
              key="CAOCalculator"
              icon={
                <CalculatorSvg
                  fill={
                    selectedMenuItem === "CAOCalculator" ? "#1476B7" : "#BDBDBD"
                  }
                />
              }
            >
              <span className="textStyling">
                CAO Calculator{" "}
                {selectedMenuItem === "CAOCalculator" ? (
                  <span> &nbsp;&nbsp;&#x25cf; </span>
                ) : null}
              </span>
            </Menu.Item>
            <Menu.Item
              key="MyGoals"
              icon={
                <GoalSvg
                  fill={selectedMenuItem === "MyGoals" ? "#1476B7" : "#BDBDBD"}
                />
              }
            >
              <span className="textStyling">
                My Goals{" "}
                {selectedMenuItem === "MyGoals" ? (
                  <span> &nbsp;&nbsp;&#x25cf; </span>
                ) : null}
              </span>
            </Menu.Item>
            <Menu.Item
              key="CoverLater"
              icon={
                <ProfileSvg
                  fill={
                    selectedMenuItem === "CoverLater" ? "#1476B7" : "#BDBDBD"
                  }
                />
              }
            >
              <span className="textStyling">
                CV/Cover Later{" "}
                {selectedMenuItem === "CoverLater" ? (
                  <span> &nbsp;&nbsp;&#x25cf; </span>
                ) : null}
              </span>
            </Menu.Item>
            <Menu.Item
              key="SelfAssessment"
              icon={
                <AssesmentSvg
                  fill={
                    selectedMenuItem === "SelfAssessment"
                      ? "#1476B7"
                      : "#BDBDBD"
                  }
                />
              }
            >
              <span className="textStyling">
                Self Assessment{" "}
                {selectedMenuItem === "SelfAssessment" ? (
                  <span> &nbsp;&nbsp;&#x25cf; </span>
                ) : null}
              </span>
            </Menu.Item>
            <Menu.Item
              key="MyStudy"
              icon={
                <StudySvg
                  fill={selectedMenuItem === "MyStudy" ? "#1476B7" : "#BDBDBD"}
                />
              }
            >
              <span className="textStyling">
                My Study{" "}
                {selectedMenuItem === "MyStudy" ? (
                  <span> &nbsp;&nbsp;&#x25cf; </span>
                ) : null}
              </span>
            </Menu.Item>
            <Menu.Item
              key="EducationalGuidance"
              icon={
                <EducationalSvg
                  fill={
                    selectedMenuItem === "EducationalGuidance"
                      ? "#1476B7"
                      : "#BDBDBD"
                  }
                />
              }
            >
              <span className="textStyling">
                Educational Guidance
                {selectedMenuItem === "EducationalGuidance" ? (
                  <span> &nbsp;&#x25cf; </span>
                ) : null}
              </span>
            </Menu.Item>
          </Menu>
          <div
            style={{ display: "flex", justifyContent: "center", marginTop: 30 }}
          >
            <MyCareerGuidanceButton
              label="Logout"
              className="logoutButton"
              type="primary"
              htmlType="button"
              onClick={logoutUser}
              icon={
                <Image
                  preview={false}
                  src={logout}
                  width={20}
                  style={{ paddingRight: 4 }}
                />
              }
            />
          </div>
        </div>
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: 0 }} className="Navbar">
          <div className="navtext">
            <p className="nav-text">
              Hello <strong>{userData.full_name}</strong>, welcome back!
            </p>
          </div>
          <div className="img">
            <div className="imgcard">
              <img src={userData.profile_image} className="cardprofile" />
              <div className="cardtext">
                <p className="name" style={{ height: 20, color: "white" }}>
                  {userData.full_name}
                </p>
                <p className="email">{userData.email}</p>
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
