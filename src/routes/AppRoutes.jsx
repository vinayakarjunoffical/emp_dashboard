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
import JobTemplateBuilder from "../pages/jobtemplate/JobTemplateBuilder";
import RolesManagement from "../pages/roles/Roles";
import DocumentManagementModule from "../pages/document/DocumentManagementModule";
import CandidateTable from "../pages/dashboard/CandidateTable";
import EmployeeTable from "../pages/dashboard/EmployeeTable";
import HolidayManager from "../pages/holidays/HolidayManager";
import EmployeeProfilePage from "../pages/dashboard/EmployeeProfilePage";
import EmployeeDemoDetails1 from "../pages/dummyemp/EmployeeDemoDetails1";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<PageLayout />}>
          <Route path="/dashboard" element={<HrDashboard />} />
          <Route path="/dashboard/candidate-table" element={<CandidateTable />} />
          <Route path="/dashboard/employee-table" element={<EmployeeTable />} />
          <Route path="/dashboard/employee/:id" element={<EmployeeProfilePage />} />


          {/* Departments */}
          <Route path="/departments" element={<DepartmentList />} />
          <Route path="/departments/add" element={<AddEditDepartment />} />
          <Route path="/departments/edit/:id" element={<AddEditDepartment />} />

          {/* Roles template */}
           <Route path="/roles" element={<RolesManagement />} />

          {/* Employees */}
          <Route path="/employees" element={<EmployeePage />} />
          <Route path="/employees/:id" element={<EmployeeDetails />} />
          {/* <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employees/add" element={<AddEmployee />} /> */}

          {/* Dummy Employees */}
          <Route path="/dummyemp" element={<EmpDemoPage />} />
          <Route path="/dummyemp/:id" element={<EmployeeDemoDetails />} />
          <Route path="/dummyemp1/:id" element={<EmployeeDemoDetails1 />} />
          <Route path="/dummyemp/:id/review" element={<ReviewPage />} />

{/* Dummy Intake candidate */}
<Route path="/candidate" element={<CandidateIntake />} />

{/* Dummy Follow Up candidate */}
<Route path="/invitation" element={<InvitationTracker />} />
 <Route path="/invitation/:id" element={<CandidateProfile />} />
 <Route path="/invitation/:id/scheduleinterview" element={<ScheduleInterview />} />

 {/* Dummy job template */}
<Route path="/jobtemplate" element={<JobTemplateBuilder />} />


 {/* Documents submited */}
<Route path="/document" element={<DocumentManagementModule />} />

{/* Holidays submited */}
<Route path="/holidays" element={<HolidayManager />} />


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
