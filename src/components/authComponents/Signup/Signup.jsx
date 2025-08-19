"use client"

import { useState, useEffect } from "react"
import sideAuthImage from "../../../assets/kid-front-page (1).jpg"
import myCareerGuidanceIcon from "../../../assets/my-guidance-logo.png"
import usernameIcon from "../../../assets/usernameIcon.svg"
import nameIcon from "../../../assets/nameIcon.svg"
import lockIcon from "../../../assets/lockIcon.svg"
import dropdownIcon from "../../../assets/dropdownIcon.svg"
import { Link } from "react-router-dom"
import { Form, Image, Select, Upload, message } from "antd"
import { MyCareerGuidanceInputField, MyCareerGuidanceButton } from "../../commonComponents"
import { API_URL } from "../../../utils/constants"
import { getApiWithoutAuth, postApiWithoutAuth } from "../../../utils/api"
import "./SignupStyle.css"
import { convertBase64 } from "../../../utils/helper"
import moment from "moment"
import { useNavigate } from "react-router-dom"
import { setToken } from "../../../utils/LocalStorage"
import { useSubscribe } from "../../../context/subscribe"

const Signup = () => {
  const navigate = useNavigate()
  const { setSubscribe } = useSubscribe()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({})
  const [schools, setSchools] = useState([])
  const [newSchools, setNewSchools] = useState("")
  const [dobSave, setDobSave] = useState({})
  const [number, setPhoneNumber] = useState("")
  const [open, setOpen] = useState(false)
  const [isAddSchoolValid, setIsAddSchoolValid] = useState(false)

  const currentYear = moment().year()

  const disabledDate = (current) => {
    return current.year() > currentYear
  }

  const onChangeYearInternal = (date) => {
    onChangeYear(date?.year())
  }

  const onChangeHandle = (e) => {
    const { name, value } = e.target
    setData({ ...data, [name]: value })
  }

  const handlerSaveSubmit = async () => {
    setLoading(true)
    setLoading(false)
    const response = await postApiWithoutAuth(API_URL.SINGUPUSER, {
      ...data,
      dob: `${dobSave.year}-${dobSave.month}-${dobSave.day}`,
      email: data.email.toLowerCase(),
    })

    if (response.status === 200) {
      message.success(
        "Congratulations! You've successfully signed up. You're now ready to log in and explore our platform. Welcome aboard!",
      )
      setSubscribe(false)
      setToken(response.data.access_token)
      navigate("/checkout")
    } else {
      setLoading(false)
      message.error(response.data.message)
    }
  }

  const onChangeUpload = async (e) => {
    if (e.fileList.length > 0) {
      const base64 = await convertBase64(e.file)
      setData({ ...data, profile_image: base64 })
    }
  }

  // Updated handleSelect function to send pk instead of school name
  const handleSelect = (schoolValue) => {
    // schoolValue is already the pk (primary key) from the schools array
    setData({ ...data, school: schoolValue })
  }

  const handleSelectDay = (d) => {
    setDobSave({ ...dobSave, day: d })
  }

  useEffect(() => {}, [dobSave])

  const onChangeYear = (date) => {
    setDobSave({ ...dobSave, year: date })
  }

  useEffect(() => {
    getSchools()
  }, [])

  const handleSchool = (e) => {
    const { value } = e.target
    setNewSchools(value)
    setIsAddSchoolValid(!!value.trim())
  }

  const getSchools = async () => {
    const response = await getApiWithoutAuth(API_URL.GETUSERSCHOOL)
    if (response?.data?.success) {
      const school = response.data.data?.map((item) => {
        return {
          value: item.pk, // This is the primary key
          label: item.school,
          county: item.county,
        }
      })
      setSchools(school)
      setLoading(false)
    } else {
      setLoading(false)
    }
  }

  const handleSelectMonth = (m) => {
    setDobSave({ ...dobSave, month: m })
    if (dobSave.day) {
      const isValidDayForMonth =
        (m === "02" && dobSave.day >= "01" && dobSave.day <= "28") ||
        (["04", "06", "09", "11"].includes(m) && dobSave.day >= "01" && dobSave.day <= "30") ||
        (["01", "03", "05", "07", "08", "10", "12"].includes(m) && dobSave.day >= "01" && dobSave.day <= "31")

      if (!isValidDayForMonth) {
        setDobSave((prevDobSave) => ({ ...prevDobSave, day: "" }))
      }
    }
  }

  return (
    <div className="mainDiv">
      <div className="leftDiv">
        <Image preview={false} src={myCareerGuidanceIcon || "/placeholder.svg"} width={207} />
        <Form onFinish={handlerSaveSubmit} className="formStyle" autoComplete={false}>
          <div className="welcomeHaddingText">Hello</div>
          <div className="textStyle18" style={{ marginBottom: 15 }}>
            Signup to Get Started
          </div>

          <Form.Item name="full_name" rules={[{ required: true, message: "Please input your Name!" }]}>
            <MyCareerGuidanceInputField
              placeholder="Full Name"
              prefix={nameIcon}
              type="input"
              name="full_name"
              onChange={onChangeHandle}
              inputValue={data.name}
            />
          </Form.Item>

          <Form.Item name="email" rules={[{ required: true, message: "Please input your Email Address!" }]}>
            <MyCareerGuidanceInputField
              placeholder="Email Address"
              prefix={usernameIcon}
              type="email"
              name="email"
              onChange={onChangeHandle}
              inputValue={data.email}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                pattern: new RegExp(/^(?=.*\d)(?=.*?[@$!%*#?&^_.,-])(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
                message:
                  "Please ensure your password contains at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.",
              },
            ]}
          >
            <MyCareerGuidanceInputField
              type="password"
              placeholder="Password"
              prefix={lockIcon}
              name="password"
              passwordValue={data.password}
              onChange={onChangeHandle}
            />
          </Form.Item>

          <Form.Item rules={[{ required: true, message: "Please select a school!" }]} style={{ marginBottom: "12px" }}>
            <Select
              showSearch
              placeholder="School"
              name="school"
              value={data?.school}
              optionFilterProp="children"
              filterOption={(input, option) => option.children.toLowerCase().startsWith(input.toLowerCase())}
              className="inputSelectFieldStyle"
              onChange={handleSelect}
              bordered={false}
              suffixIcon={
                <Image
                  preview={false}
                  src={dropdownIcon || "/placeholder.svg"}
                  width={15}
                  style={{ marginRight: 10 }}
                />
              }
            >
              {schools.map((school) => (
                <Select.Option key={school.value} value={school.value}>
                  {`${school.label}, ${school.county}`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="profile_image" style={{ marginTop: "10px" }}>
            <Upload
              beforeUpload={() => false}
              listType="picture"
              name={"profile_image"}
              maxCount={1}
              onChange={onChangeUpload}
              showUploadList={true}
              style={{ height: 64 }}
            >
              <MyCareerGuidanceButton
                label="Add Profile Picture"
                className={"signInButtonStyle"}
                type="button"
                icon={
                  <div style={{ color: "#D3D3D3", marginRight: 10 }}>
                    <Image
                      preview={false}
                      src={nameIcon || "/placeholder.svg"}
                      width={20}
                      style={{ paddingRight: 4 }}
                    />
                    |
                  </div>
                }
              />
            </Upload>
          </Form.Item>

          <MyCareerGuidanceButton
            label="Sign Up"
            className="signInButton"
            type="primary"
            htmlType="submit"
            loading={loading}
          />

          <div className="textStyle16" style={{ display: "flex", justifyContent: "center" }}>
            Already have an account?&nbsp;&nbsp;
            <Link to="/" className="linkStyle">
              Login
            </Link>
          </div>
        </Form>

        <span className="allRights">© 2023 My Guidance. All Rights Reserved</span>
      </div>

      <div className="mobileScreenImage">
        <img
          src={sideAuthImage || "/placeholder.svg"}
          style={{
            objectFit: "cover",
            height: "100vh",
            width: "100%",
            borderRadius: "20px",
          }}
          alt="img"
        />
      </div>
    </div>
  )
}

export default Signup
