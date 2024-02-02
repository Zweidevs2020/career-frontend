import {
  BrowserRouter,
  Routes,
  Route,
  useSearchParams,
} from "react-router-dom";
import {
  Login,
  Signup,
  EmailVerification,
  ForgetPassword,
  NewPasword,
} from "./components/authComponents";
import CareerDashboard from "./components/Careerdashboard";
import PublicRoute from "./routes/PublicRouting";
import PrivateRoute from "./routes/PrivateRouting";
import "./App.css";
import Sidebar from "./components/commonComponents/Layoutcomponents/Sidebar/Sidebar";
import Selfassesment from "./components/Selfassesment";
import MyGoal from "./components/MyGoal";
import CaoCalculator from "./components/CaoCalculator";
import CvCoverLetter from "./components/CvCoverLetter/CvCoverLetter";
import EducationalGuidance from "./components/EducationalGuidance";
import TakeTest from "./components/TakeTest";
import TakeSelfTest from "./components/TakeSelfTest";
import MyStudy from "./components/MyStudy";
import MyChoices from "./components/MyChoices";
import MyChoicesEdit from "./components/MyChoicesEdit";
import Occupational from "./components/Occupational";
import YoutubePage from "./components/CvCoverLetter/YoutubePage";
import OccupationalOption from "./components/OccupationalOption";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute restricted>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/sign-up"
          element={
            <PublicRoute restricted>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/forget-password"
          element={
            <PublicRoute restricted>
              <ForgetPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/email-verification"
          element={
            <PublicRoute restricted>
              <EmailVerification />
            </PublicRoute>
          }
        />
        <Route
          path="/new-password"
          element={
            <PublicRoute restricted>
              <NewPasword />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Sidebar>
                <CareerDashboard />
              </Sidebar>
            </PrivateRoute>
          }
        />
        <Route
          path="/video"
          element={
            <PrivateRoute>
              <Sidebar>
                <YoutubePage />
              </Sidebar>
            </PrivateRoute>
          }
        />
        <Route
          path="/self-assesment"
          element={
            <PrivateRoute>
              <Sidebar>
                <Selfassesment />
              </Sidebar>
            </PrivateRoute>
          }
        />
        <Route
          path="/self-assesment-test"
          element={
            <PrivateRoute>
              <Sidebar>
                <TakeSelfTest />
              </Sidebar>
            </PrivateRoute>
          }
        />

        <Route
          path="/my-goals"
          element={
            <PrivateRoute>
              <Sidebar>
                <MyGoal />
              </Sidebar>
            </PrivateRoute>
          }
        />

        <Route
          path="/cao-calculator"
          element={
            <PrivateRoute>
              <Sidebar>
                <CaoCalculator />
              </Sidebar>
            </PrivateRoute>
          }
        />

        <Route
          path="/cover-letter"
          element={
            <PrivateRoute>
              <Sidebar>
                <CvCoverLetter />
              </Sidebar>
            </PrivateRoute>
          }
        />
        <Route
          path="/educational-guidance"
          element={
            <PrivateRoute>
              <Sidebar>
                <EducationalGuidance />
              </Sidebar>
            </PrivateRoute>
          }
        />
        <Route
          path="/educational-guidance-test"
          element={
            <PrivateRoute>
              <Sidebar>
                <TakeTest />
              </Sidebar>
            </PrivateRoute>
          }
        />
        <Route
          path="/my-study"
          element={
            <PrivateRoute>
              <Sidebar>
                <MyStudy />
              </Sidebar>
            </PrivateRoute>
          }
        />
        <Route
          path="/my-choices"
          element={
            <PrivateRoute>
              <Sidebar>
                <MyChoices />
              </Sidebar>
            </PrivateRoute>
          }
        />
        <Route
          path="/my-choice-edit"
          element={
            <PrivateRoute>
              <Sidebar>
                <MyChoicesEdit />
              </Sidebar>
            </PrivateRoute>
          }
        />
         <Route
          path="/occupation/:idea"
          element={
            <PrivateRoute>
              <Sidebar>
                <OccupationalOption />
              </Sidebar>
            </PrivateRoute>
          }
        />
        <Route
          path="/occupation"
          element={
            <PrivateRoute>
              <Sidebar>
                <Occupational />
              </Sidebar>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
