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
            < PrivateRoute>
              <Sidebar>
                <CareerDashboard />
              </Sidebar>
            </PrivateRoute>
          }
        />
        <Route
          path="/self-assesment"
          element={
            <PublicRoute restricted>
              <Sidebar>
                <Selfassesment />
              </Sidebar>
            </PublicRoute>
          }
        />

        <Route
          path="/mygoals"
          element={
            <PublicRoute restricted>
              <Sidebar>
                <MyGoal/>
              </Sidebar>
            </PublicRoute>
          }
        />

        <Route
          path="/calculator"
          element={
            <PublicRoute restricted>
              <Sidebar>
                <CaoCalculator/>
              </Sidebar>
            </PublicRoute>
          }
        />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
