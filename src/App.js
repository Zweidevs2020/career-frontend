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
import CheckoutView from "./components/checkout/checkout";
import MyGuidanceReport from "./components/MyGuidanceReport";
import WorkDiary from "./components/MyWorkDiary/WorkDiary";
import ConselorDashboard from "./components/conselor/conselorDashboard";

import { useSubscribe } from "./context/subscribe";
import ConselorPrivateRoute from "./routes/ConselorRouting";
import StudentDetails from "./components/conselor/StudentDetails";
import CounsellorCV from "./components/conselor/counsellorCV";
import CounsellorGoals from "./components/conselor/counselorGoals";
import CounselorLayout from "./components/conselor/counselorLayout";
import CounselorCao from "./components/conselor/counselorCao";
import CounselorGoals from "./components/conselor/StudentGoals";
import CounselorChoices from "./components/conselor/StudentChoices";
import CounselorEducationalReport from "./components/conselor/StudentEducationalReport";
import CounselorGuidanceReport from "./components/conselor/GuidanceReaport";
import CousnelorSelf from "./components/conselor/CousnelorSelf";
import PaymentVerification from "./components/PaymentVerification/payment-verificatin";

function App() {
  const { subscribe, loading } = useSubscribe();

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
            <PrivateRoute restricted={subscribe == null ? false : !subscribe}>
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
          path="/work-diary"
          element={
            <PrivateRoute>
              <Sidebar>
                <WorkDiary />
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
          path="/checkout"
          element={
            <PublicRoute restricted={subscribe}>
              <CheckoutView />
            </PublicRoute>
          }
        />
        <Route
          path="/payment-verification"
          element={
            <PrivateRoute>
              <PaymentVerification />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-guidance-report"
          element={
            <PrivateRoute>
              <Sidebar>
                <MyGuidanceReport />
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
        <Route
          path="/counsellor-Dashboard"
          element={
            <ConselorPrivateRoute>
              <ConselorDashboard />
            </ConselorPrivateRoute>
          }
        />
        {/* <Route
          path="/student-details/:id"
          element={
            <ConselorPrivateRoute>
              <StudentDetails />
            </ConselorPrivateRoute>
          }
        /> */}
        <Route
          path="/counsellor-cv/:id"
          element={
            <ConselorPrivateRoute>
              <CounsellorCV />
            </ConselorPrivateRoute>
          }
        />
        <Route
          path="/counsellor-goals/:id"
          element={
            <ConselorPrivateRoute>
              <CounsellorGoals />
            </ConselorPrivateRoute>
          }
        />
        <Route path="/consellor" element={<CounselorLayout />}>
          <Route path="counsellor-goals/:id" element={<CounsellorGoals />} />
          <Route path="student-details/:id" element={<StudentDetails />} />
          <Route path="student-cao/:id" element={<CounselorCao />} />
          <Route path="student-goals/:id" element={<CounselorGoals />} />
          <Route path="student-choices/:id" element={<CounselorChoices />} />
          <Route path="student-cv/:id" element={<CounsellorCV />} />
          <Route path="self/:id" element={<CousnelorSelf />} />
          {/* <Route path="student-self/:id" element={<CousnelorSelf />} /> */}
          CounsellorCV
          <Route
            path="student-guidance-report/:id"
            element={<CounselorGuidanceReport />}
          />
          <Route
            path="student-educational-report/:id"
            element={<CounselorEducationalReport />}
          />
          <Route
            path="work-diary/:id"
            element={<CounselorEducationalReport />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
