import React, { useState, useEffect } from "react";
import {
  Modal,
  Layout,
  Menu,
  Form,
  Image,
  Select,
  Typography,
  Popover,
  Input,
  Row,
  Col,
  message,
} from "antd";
import mycareer from "../../../../assets/mycareer.png";
import myCareer from "../../../../assets/myCareerlogo.png";
import logout from "../../../../assets/logout.svg";
import logout1 from "../../../../assets/logout1.svg";
import edit from "../../../../assets/edit.svg";
import editwhite from "../../../../assets/editwhite.svg";
import adthe from "../../../../assets/adthe.svg";
import pass from "../../../../assets/pass.svg";
import profileInput from "../../../../assets/profileInput.svg";
import dropdownIcon from "../../../../assets/dropdownIcon.svg";
import { convertBase64 } from "../../../../utils/helper";
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
  ChoicesSvg,
} from "../../../../utils/svg";
import { API_URL } from "../../../../utils/constants";
import "./SidebarStyle.css";
import {
  getApiWithAuth,
  getApiWithoutAuth,
  patchApiWithAuth,
} from "../../../../utils/api";
import MyCareerGuidanceButton from "../../MyCareerGuidanceButton";
const { Content, Sider, Header } = Layout;
const Sidebar = ({ children, flags }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("Overview");
  const [userData, setUserData] = useState({});
  const [updateData, setUpdateData] = useState({});
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [schools, setSchools] = useState([]);
  const [loading2, setLoading2] = useState(false);
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  // console.log("===screen size",screenSize.width)
  const { Title } = Typography;

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    setUpdateData({ ...updateData, [name]: value });
  };

  const handleSelect = (schoolValue) => {
    setUpdateData({ ...updateData, school: schoolValue });
  };

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    setLoading(true);
    const response = await getApiWithAuth(API_URL.GETUSER);
    if (response?.data?.status === 200) {
      setUserData(response.data.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSchools();
  }, []);

  const getSchools = async () => {
    const response = await getApiWithoutAuth(API_URL.GETUSERSCHOOL);
    if (response?.data?.success) {
      const school = response.data.data?.map((item) => {
        return {
          value: item.pk,
          label: item.school,
        };
      });
      setSchools(school);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setEditMode(false);
    getUserData();
  };

  const handleUpdate = async () => {
    setLoading2(true);
    const response = await patchApiWithAuth(API_URL.GETUSER2, updateData);
    console.log("====================goals levels", response);

    if (response.data.status === 200) {
      setIsModalOpen(false);
      getUserData();
      setEditMode(false);
      setLoading2(false);
      message.success("Data Upadte");
    } else {
      setLoading2(false);
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    const base64 = await convertBase64(file);
    setUpdateData({ ...updateData, profile_image: base64 });
    setUserData({ ...userData, profile_image: base64 });
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
      navigate("/cover-letter");
    } else if (key === "SelfAssessment") {
      navigate("/self-assesment");
    } else if (key === "EducationalGuidance") {
      navigate("/educational-guidance");
    } else if (key === "MyChoices") {
      navigate("/my-choices");
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
      location.pathname === "/self-assesment-test" ||
      location.pathname === "/occupation"
    ) {
      setSelectedMenuItem("SelfAssessment");
    } else if (
      location.pathname === "/educational-guidance" ||
      location.pathname === "/educational-guidance-test"
    ) {
      setSelectedMenuItem("EducationalGuidance");
    } else if (
      location.pathname === "/my-choices" ||
      location.pathname === "/my-choice-edit"
    ) {
      setSelectedMenuItem("MyChoices");
    } else {
      setSelectedMenuItem("MyStudy");
    }
  }, [location]);

  // useEffect(() => {
  // console.log("====hggg", screenSize.width);
  //   if (screenSize.width === "425") {
  //     console.log("====hggg");
  //   }
  // }, [screenSize]);

  const logoutUser = async () => {
    console.log("===in logouttt");
    removeToken();
    navigate("/");
  };
  return (
    <>
      {screenSize.width > "748" ? (
        <Layout
          style={{
            height: "100vh",
            width: "100%",
            minHeight: "100vh",
            background: "#F8FAFC",
            overflow: "auto",
            position: "sticky",
            top: 0,
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
                      fill={
                        selectedMenuItem === "Overview" ? "#1476B7" : "#BDBDBD"
                      }
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
                        selectedMenuItem === "CAOCalculator"
                          ? "#1476B7"
                          : "#BDBDBD"
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
                      fill={
                        selectedMenuItem === "MyGoals" ? "#1476B7" : "#BDBDBD"
                      }
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
                        selectedMenuItem === "CoverLater"
                          ? "#1476B7"
                          : "#BDBDBD"
                      }
                    />
                  }
                >
                  <span className="textStyling">
                  My CV{" "}
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
                  My Self Assessment{" "}
                    {selectedMenuItem === "SelfAssessment" ? (
                      <span> &nbsp;&nbsp;&#x25cf; </span>
                    ) : null}
                  </span>
                </Menu.Item>
                <Menu.Item
                  key="MyStudy"
                  icon={
                    <StudySvg
                      fill={
                        selectedMenuItem === "MyStudy" ? "#1476B7" : "#BDBDBD"
                      }
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
                  key="MyChoices"
                  icon={
                    <ChoicesSvg
                      fill={
                        selectedMenuItem === "MyChoices" ? "#1476B7" : "#BDBDBD"
                      }
                    />
                  }
                >
                  <span className="textStyling">
                    My Choices{" "}
                    {selectedMenuItem === "MyChoices" ? (
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
                  My Educational Guidance
                    {selectedMenuItem === "EducationalGuidance" ? (
                      <span> &nbsp;&#x25cf; </span>
                    ) : null}
                  </span>
                </Menu.Item>
              </Menu>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 30,
                }}
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
            <Header
              className="Navbar"
              style={{
                position: "sticky",
                top: 0,
                zIndex: 1,
              }}
            >
              <div className="navtext">
                <p className="nav-text">
                  Hello <strong>{userData.full_name}</strong>, welcome back!
                </p>
              </div>
              <div className="img" onClick={() => showModal()}>
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
            <Content className="marginContent" style={{ overflow: "auto" }}>
              <div className="site-layout-background">{children}</div>
            </Content>
            <Modal
              className="modalStyleClass2"
              width={800}
              bodyStyle={{
                background: "none",
                display: "flex",
                justifyContent: "center",
              }}
              open={isModalOpen}
              // onCancel={handleCancel}
              footer={[]}
              // closeIcon={<img onClick={() => alert('asd')} src={edit} alt="" />}
              title={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Title
                    level={3}
                    style={{
                      marginLeft: "10px",
                      marginBottom: "0px",
                      textAlign: "center",
                      width: "100%",
                      color: "#1476b7",
                    }}
                  >
                    My Profile
                  </Title>
                  <img
                    onClick={handleEditClick}
                    style={{ cursor: "pointer" }}
                    src={edit}
                    alt=""
                  />
                </div>
              }
              visible={true}
              onCancel={handleCancel}
              closable={false}
            >
              <div className="modalInnerStyle">
                <div style={{ alignSelf: "center", textAlign: "center" }}>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{ position: "relative" }}>
                      <label htmlFor="fileUpload">
                        <Popover
                          content="Edit"
                          placement="bottomRight"
                          trigger="hover"
                          overlayInnerStyle={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              top: "80%",
                              left: "80%",
                              transform: "translate(-50%, -50%)",
                              zIndex: 1,
                              cursor: "pointer",
                            }}
                          >
                            <img
                              src={editwhite}
                              alt="Edit"
                              style={{ width: "24px", height: "24px" }}
                            />
                          </div>
                        </Popover>
                      </label>
                      {editMode && (
                        <input
                          type="file"
                          id="fileUpload"
                          style={{ display: "none" }}
                          onChange={handleImageChange}
                        />
                      )}

                      <img
                        src={userData.profile_image}
                        alt="Profile"
                        className="cardprofile"
                        style={{
                          borderRadius: "50%",
                          width: "100px",
                          height: "100px",
                        }}
                      />

                      <div
                        style={{
                          position: "absolute",
                          top: "0",
                          left: "0",
                          backgroundColor: "rgba(0, 0, 255, 0.3)",
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="mt-4">
                    Lorem ipsum is a placeholder text commonly used to
                    demonstrate the visual form of a document.
                  </div>
                  <Row gutter={[16, 16]} justify="center" className="mt-4">
                    <Col xs={24} md={12}>
                      <Input
                        value={userData.full_name}
                        name="full_name"
                        onChange={(e) => handleChange(e)}
                        prefix={
                          <img
                            src={profileInput}
                            style={{ marginRight: "15px" }}
                            alt=""
                          />
                        }
                        disabled={!editMode}
                        style={{ padding: "15px 10px" }}
                        placeholder="Full Name"
                      />
                    </Col>
                    <Col xs={24} md={12}>
                      <Input
                        value={userData.email}
                        name="email"
                        onChange={(e) => handleChange(e)}
                        prefix={
                          <img
                            src={adthe}
                            style={{ marginRight: "15px" }}
                            alt=""
                          />
                        }
                        disabled={!editMode}
                        style={{ padding: "15px 10px" }}
                        placeholder="Email"
                      />
                    </Col>
                    <Col xs={24} md={12}>
                      <Input
                        name="password"
                        type="password"
                        prefix={
                          <img
                            src={pass}
                            style={{ marginRight: "15px" }}
                            alt=""
                          />
                        }
                        disabled={true}
                        style={{ padding: "15px 10px" }}
                        placeholder="***************"
                      />
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="school"
                        rules={[
                          { required: true, message: "Please Select School!" },
                        ]}
                      >
                        <Select
                          placeholder={"School"}
                          options={schools}
                          name="school"
                          className="inputSelectFieldStyle"
                          onChange={handleSelect}
                          bordered={false}
                          disabled={!editMode}
                          defaultValue={userData?.school}
                          suffixIcon={
                            <Image
                              preview={false}
                              src={dropdownIcon}
                              width={15}
                              style={{ marginRight: 10 }}
                            />
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <div className="mt-5" style={{ display: "flex" }}>
                    <MyCareerGuidanceButton
                      label="Update"
                      className="takebutton"
                      type="button"
                      htmlType="button"
                      loading={loading2}
                      onClick={handleUpdate}
                    />
                    <MyCareerGuidanceButton
                      label="Cancel"
                      className="viewResultButton"
                      type="button"
                      htmlType="button"
                      onClick={handleCancel}
                    />
                  </div>
                </div>
              </div>
            </Modal>
          </Layout>
        </Layout>
      ) : (
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
              <img src={myCareer} alt="cyberLegendLogo" width="40%" />
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
                      fill={
                        selectedMenuItem === "Overview" ? "#1476B7" : "#BDBDBD"
                      }
                    />
                  }
                >
                  {/* <span className="textStyling">
                    Overview{" "}
                    {selectedMenuItem === "Overview" ? (
                      <span> &nbsp;&nbsp;&#x25cf; </span>
                    ) : null}
                  </span> */}
                </Menu.Item>
                <Menu.Item
                  key="CAOCalculator"
                  icon={
                    <CalculatorSvg
                      fill={
                        selectedMenuItem === "CAOCalculator"
                          ? "#1476B7"
                          : "#BDBDBD"
                      }
                    />
                  }
                >
                  {/* <span className="textStyling">
                    CAO Calculator{" "}
                    {selectedMenuItem === "CAOCalculator" ? (
                      <span> &nbsp;&nbsp;&#x25cf; </span>
                    ) : null}
                  </span> */}
                </Menu.Item>
                <Menu.Item
                  key="MyGoals"
                  icon={
                    <GoalSvg
                      fill={
                        selectedMenuItem === "MyGoals" ? "#1476B7" : "#BDBDBD"
                      }
                    />
                  }
                >
                  {/* <span className="textStyling">
                    My Goals{" "}
                    {selectedMenuItem === "MyGoals" ? (
                      <span> &nbsp;&nbsp;&#x25cf; </span>
                    ) : null}
                  </span> */}
                </Menu.Item>
                <Menu.Item
                  key="CoverLater"
                  icon={
                    <ProfileSvg
                      fill={
                        selectedMenuItem === "CoverLater"
                          ? "#1476B7"
                          : "#BDBDBD"
                      }
                    />
                  }
                >
                  {/* <span className="textStyling">
                    CV/Cover Later{" "}
                    {selectedMenuItem === "CoverLater" ? (
                      <span> &nbsp;&nbsp;&#x25cf; </span>
                    ) : null}
                  </span> */}
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
                  {/* <span className="textStyling">
                    Self Assessment{" "}
                    {selectedMenuItem === "SelfAssessment" ? (
                      <span> &nbsp;&nbsp;&#x25cf; </span>
                    ) : null}
                  </span> */}
                </Menu.Item>
                <Menu.Item
                  key="MyStudy"
                  icon={
                    <StudySvg
                      fill={
                        selectedMenuItem === "MyStudy" ? "#1476B7" : "#BDBDBD"
                      }
                    />
                  }
                >
                  {/* <span className="textStyling">
                    My Study{" "}
                    {selectedMenuItem === "MyStudy" ? (
                      <span> &nbsp;&nbsp;&#x25cf; </span>
                    ) : null}
                  </span> */}
                </Menu.Item>
                <Menu.Item
                  key="MyChoices"
                  icon={
                    <ChoicesSvg
                      fill={
                        selectedMenuItem === "MyChoices" ? "#1476B7" : "#BDBDBD"
                      }
                    />
                  }
                >
                  {/* <span className="textStyling">
                    My Choices{" "}
                    {selectedMenuItem === "MyChoices" ? (
                      <span> &nbsp;&nbsp;&#x25cf; </span>
                    ) : null}
                  </span> */}
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
                  {/* <span className="textStyling">
                    Educational Guidance
                    {selectedMenuItem === "EducationalGuidance" ? (
                      <span> &nbsp;&#x25cf; </span>
                    ) : null}
                  </span> */}
                </Menu.Item>
              </Menu>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 30,
                }}
                className="careerBtnDiv"
              >
                <MyCareerGuidanceButton
                  // label="Logout"
                  className="mobLogoutBtn"
                  type="primary"
                  htmlType="button"
                  onClick={logoutUser}
                  icon={
                    <Image
                      preview={false}
                      src={logout1}
                      width={20}
                      style={{ paddingRight: 4 }}
                    />
                  }
                />
              </div>
            </div>
          </Sider>
          <Layout className="site-layout">
            <Header className="Navbar">
              <div className="navtext">
                <p className="nav-text">
                  Hello <strong>{userData.full_name}</strong>, welcome back!
                </p>
              </div>
              <div className="img" onClick={() => showModal()}>
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
            <Modal
              className="modalStyleClass2"
              width={800}
              bodyStyle={{
                background: "none",
                display: "flex",
                justifyContent: "center",
              }}
              open={isModalOpen}
              // onCancel={handleCancel}
              footer={[]}
              // closeIcon={<img onClick={() => alert('asd')} src={edit} alt="" />}
              title={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Title
                    level={3}
                    style={{
                      marginLeft: "10px",
                      marginBottom: "0px",
                      textAlign: "center",
                      width: "100%",
                      color: "#1476b7",
                    }}
                  >
                    My Profile
                  </Title>
                  <img
                    onClick={handleEditClick}
                    style={{ cursor: "pointer" }}
                    src={edit}
                    alt=""
                  />
                </div>
              }
              visible={true}
              onCancel={handleCancel}
              closable={false}
            >
              <div className="modalInnerStyle">
                <div style={{ alignSelf: "center", textAlign: "center" }}>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{ position: "relative" }}>
                      <label htmlFor="fileUpload">
                        <Popover
                          content="Edit"
                          placement="bottomRight"
                          trigger="hover"
                          overlayInnerStyle={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              top: "80%",
                              left: "80%",
                              transform: "translate(-50%, -50%)",
                              zIndex: 1,
                              cursor: "pointer",
                            }}
                          >
                            <img
                              src={editwhite}
                              alt="Edit"
                              style={{ width: "24px", height: "24px" }}
                            />
                          </div>
                        </Popover>
                      </label>
                      {editMode && (
                        <input
                          type="file"
                          id="fileUpload"
                          style={{ display: "none" }}
                          onChange={handleImageChange}
                        />
                      )}

                      <img
                        src={userData.profile_image}
                        alt="Profile"
                        className="cardprofile"
                        style={{
                          borderRadius: "50%",
                          width: "100px",
                          height: "100px",
                        }}
                      />

                      <div
                        style={{
                          position: "absolute",
                          top: "0",
                          left: "0",
                          backgroundColor: "rgba(0, 0, 255, 0.3)",
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="mt-4">
                    Lorem ipsum is a placeholder text commonly used to
                    demonstrate the visual form of a document.
                  </div>
                  <Row gutter={[16, 16]} justify="center" className="mt-4">
                    <Col xs={24} md={12}>
                      <Input
                        value={userData.full_name}
                        name="full_name"
                        onChange={(e) => handleChange(e)}
                        prefix={
                          <img
                            src={profileInput}
                            style={{ marginRight: "15px" }}
                            alt=""
                          />
                        }
                        disabled={!editMode}
                        style={{ padding: "15px 10px" }}
                        placeholder="Full Name"
                      />
                    </Col>
                    <Col xs={24} md={12}>
                      <Input
                        value={userData.email}
                        name="email"
                        onChange={(e) => handleChange(e)}
                        prefix={
                          <img
                            src={adthe}
                            style={{ marginRight: "15px" }}
                            alt=""
                          />
                        }
                        disabled={!editMode}
                        style={{ padding: "15px 10px" }}
                        placeholder="Email"
                      />
                    </Col>
                    <Col xs={24} md={12}>
                      <Input
                        name="password"
                        type="password"
                        prefix={
                          <img
                            src={pass}
                            style={{ marginRight: "15px" }}
                            alt=""
                          />
                        }
                        disabled={true}
                        style={{ padding: "15px 10px" }}
                        placeholder="***************"
                      />
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="school"
                        rules={[
                          { required: true, message: "Please Select School!" },
                        ]}
                      >
                        <Select
                          placeholder={"School"}
                          options={schools}
                          name="school"
                          className="inputSelectFieldStyle"
                          onChange={handleSelect}
                          bordered={false}
                          disabled={!editMode}
                          defaultValue={userData?.school}
                          suffixIcon={
                            <Image
                              preview={false}
                              src={dropdownIcon}
                              width={15}
                              style={{ marginRight: 10 }}
                            />
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <div className="mt-5" style={{ display: "flex" }}>
                    <MyCareerGuidanceButton
                      label="Update"
                      className="takebutton"
                      type="button"
                      htmlType="button"
                      loading={loading2}
                      onClick={handleUpdate}
                    />
                    <MyCareerGuidanceButton
                      label="Cancel"
                      className="viewResultButton"
                      type="button"
                      htmlType="button"
                      onClick={handleCancel}
                    />
                  </div>
                </div>
              </div>
            </Modal>
          </Layout>
        </Layout>
      )}
    </>
  );
};

export default Sidebar;
