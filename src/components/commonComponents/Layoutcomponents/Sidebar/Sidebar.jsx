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
  const location = useLocation();

  const [selectedMenuItem, setSelectedMenuItem] = useState("Overview");
  const componentsSwtich = (key) => {
    setSelectedMenuItem(key);
    if (key === "Overview") {
      navigate("/dashboard");
    } else if (key === "CAOCalculator") {
      navigate("/cao-calculator");
    } else if (key === "MyGoals") {
      navigate("/my-goals");
    } else if (key === "CoverLater") {
      navigate("/cover-letter");
    } else if (key === "SelfAssessment") {
      navigate("/self-assesment");
    } else if (key === "EducationalGuidance") {
      navigate("/educational-guidance");
    } else {
      navigate("MyStudy");
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
      setSelectedMenuItem("/my-study");
    }
  }, [location]);
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
            <Menu.Item key="EducationalGuidance" icon={<StudySvg />}>
              <span className="textStyling">Educational Guidance</span>
            </Menu.Item>
          </Menu>
        </div>
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: 0 }} className="Navbar">
          <div className="navtext">
            <p className="nav-text">
              Hello <strong> Bruno Fernandes</strong>, welcome back!
            </p>
          </div>
          <div className="img">
            <div className="imgcard">
              <img src={pf} className="cardprofile" />
              <div className="cardtext">
                <p className="name" style={{ height: 20, color: "white" }}>
                  Bruno Fernandes
                </p>
                <p className="email">Bruno@gmail.com</p>
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

// import React, { useState, useEffect } from "react";
// import { Layout, Menu, Select, message, Form } from "antd";
// import mycareer from "../../../../assets/mycareer.png";
// import Home from "../../../../assets/Home.svg";
// import Gp from "../../../../assets/Gp.svg";
// import profile1 from "../../../../assets/profile.svg";
// import assesment from "../../../../assets/assesment.svg";
// import goal from "../../../../assets/goal.svg";
// import pf from "../../../../assets/pf.svg";
// import book from "../../../../assets/book.svg";
// import study from "../../../../assets/study.svg"
// import { useNavigate } from "react-router-dom";

// import "./SidebarStyle.css";
// const { Content, Sider, Header } = Layout;

// const Sidebar = ({ children, flags }) => {

// const navigate=useNavigate()

//   return (
//     <Layout
//       style={{
//         height: "100%",
//         width: "100%",
//         minHeight: "100vh",
//         background: "#F8FAFC",
//       }}
//     >
//       <Sider className="backgroundColorSidebar">
//         <div className="logoStyle my-2">
//           <img src={mycareer} alt="cyberLegendLogo" width="70%" />
//         </div>
//         <div className="mainContainerSideBar">
//           <div className="firstOption1" >
//             <img className="sidebarHomeImage" src={Home} />
//             <div className="overviewHead"   onClick={() => {
//                       navigate("/dashboard");
//                     }} >
//               <h className="firstHead"> OverView</h>
//             </div>
//           </div>
//           <div className="firstOption">
//             <img className="sidebarHomeImage" src={goal} />
//             <div className="overviewHead2"  onClick={() => {
//                       navigate("/my-goals");
//                     }}>
//               <h className="firstHead">My Goals</h>
//             </div>
//           </div>
//           <div className="firstOption">
//             <img className="sidebarHomeImage" src={Gp} />
//             <div className="overviewHead2"  onClick={() => {
//                       navigate("/cao-calculator");
//                     }}>
//               <h className="firstHead">CAO Calculator</h>
//             </div>
//           </div>{" "}
//           <div className="firstOption">
//             <img className="sidebarHomeImage" src={profile1} />
//             <div className="cvHead" onClick={()=>
//             {
//               navigate("/coverletter")
//             }}>
//               <h className="firstHead">CV/Cover Later</h>
//             </div>
//           </div>
//           <div className="firstOption">
//             <img className="sidebarHomeImage" src={assesment} />
//             <div className="selfHead"  onClick={() => {
//                       navigate("/self-assesment");
//                     }}>
//               <h className="firstHead">Self Assessment</h>
//             </div>
//           </div>{" "}
//           <div className="firstOption">
//             <img className="sidebarHomeImage" src={study} />
//             <div className="studyHead"onClick={() => {
//                       navigate("/my-study");
//                     }} >
//               <h className="firstHead">My Study</h>
//             </div>
//           </div>{" "}
//           <div className="firstOption">
//             <img className="sidebarHomeImage" src={book} />
//             <div className="study">
//               <h className="firstHead">Educational Guidance</h>
//             </div>
//           </div>
//         </div>
//       </Sider>
//       <Layout className="site-layout">
//         <Header style={{ padding: 0 }} className="Navbar">
//           <div className="navtext">
//             <p className="nav-text">
//               Hello <strong> Bruno Fernandes</strong>, welcome back!
//             </p>
//           </div>
//           <div className="img">
//             <div className="imgcard">
//               <img src={pf} className="cardprofile" />
//               <div className="cardtext">
//                 <p className="name" style={{ height: 20, color: "white" }}>
//                   Bruno Fernandes
//                 </p>
//                 <p className="email">Bruno@gmail.com</p>
//               </div>
//             </div>
//           </div>
//         </Header>
//         <Content className="marginContent">
//           <div className="site-layout-background">{children}</div>
//         </Content>
//       </Layout>
//     </Layout>
//   );
// };

// export default Sidebar;
