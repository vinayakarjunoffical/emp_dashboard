import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import HrDashboard from "../pages/dashboard/HrDashboard";
import ProtectedRoute from "./ProtectedRoute";
import PageLayout from "../components/layout/PageLayout";
import DepartmentList from "../pages/departments/DepartmentList";
import AddEditDepartment from "../pages/departments/AddEditDepartment";
import EmployeePage from "../pages/employees/EmployeePage";
import EmployeeDetails from "../pages/employees/EmployeeDetails";
import EmpDemoPage from "../pages/dummyemp/EmployeeDemoPage";
import EmployeeDemoDetails from "../pages/dummyemp/EmployeeDemoDetails";
import ReviewPage from "../pages/dummyemp/EmployeeReview";
import CandidateIntake from "../pages/intake/CandidateIntake";
import InvitationTracker from "../pages/followup/InvitationTracker";
import CandidateProfile from "../pages/followup/CandidateProfile";
import ScheduleInterview from "../pages/followup/ScheduleInterview";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<PageLayout />}>
          <Route path="/dashboard" element={<HrDashboard />} />

          {/* Departments */}
          <Route path="/departments" element={<DepartmentList />} />
          <Route path="/departments/add" element={<AddEditDepartment />} />
          <Route path="/departments/edit/:id" element={<AddEditDepartment />} />

          {/* Employees */}
          <Route path="/employees" element={<EmployeePage />} />
          <Route path="/employees/:id" element={<EmployeeDetails />} />
          {/* <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employees/add" element={<AddEmployee />} /> */}

          {/* Dummy Employees */}
          <Route path="/dummyemp" element={<EmpDemoPage />} />
          <Route path="/dummyemp/:id" element={<EmployeeDemoDetails />} />
          <Route path="/dummyemp/:id/review" element={<ReviewPage />} />

{/* Dummy Intake candidate */}
<Route path="/candidate" element={<CandidateIntake />} />

{/* Dummy Follow Up candidate */}
<Route path="/invitation" element={<InvitationTracker />} />
 <Route path="/invitation/:id" element={<CandidateProfile />} />
 <Route path="/invitation/:id/scheduleinterview" element={<ScheduleInterview />} />



        </Route>
      </Route>
    </Routes>
  );
}

// import { Routes, Route } from "react-router-dom";
// import Login from "../pages/auth/Login";
// import HrDashboard from "../pages/dashboard/HrDashboard";
// import ProtectedRoute from "./ProtectedRoute";
// import PageLayout from "../components/layout/PageLayout";
// import DepartmentList from "../pages/departments/DepartmentList";
// import AddEditDepartment from "../pages/departments/AddEditDepartment";

// export default function AppRoutes() {
//   return (
//     <Routes>
//       <Route path="/" element={<Login />} />

//       <Route element={<ProtectedRoute />}>
//         <Route element={<PageLayout />}>
//           <Route path="/dashboard" element={<HrDashboard />} />
//           <Route path="/departments" element={<DepartmentList />} />
// <Route path="/departments/add" element={<AddEditDepartment />} />
// <Route path="/departments/edit/:id" element={<AddEditDepartment />} />

//         </Route>
//       </Route>
//     </Routes>
//   );
// }

// import { Routes, Route } from "react-router-dom";
// import Login from "../pages/auth/Login";
// import HrDashboard from "../pages/dashboard/HrDashboard";
// import ProtectedRoute from "./ProtectedRoute";
// import PageLayout from "../components/layout/PageLayout";

// export default function AppRoutes() {
//   return (
//     <Routes>
//       <Route path="/" element={<Login />} />

//       <Route element={<ProtectedRoute />}>
//         <Route path="/dashboard" element={
//            <PageLayout>
//               <HrDashboard />
//             </PageLayout>
//         } />
//       </Route>
//     </Routes>
//   );
// }
