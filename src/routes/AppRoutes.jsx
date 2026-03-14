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
import ManualEntryPage from "../pages/intake/ManualEntryPage";
import EditCandidate from "../pages/intake/EditCandidate";
import ManualEntryPage14 from "../pages/intake/ManualEntrayPage14";
import CandidateProfilePage from "../pages/intake/CandidateProfile";
import MasterManagement from "../pages/master/MasterPage";
import VacanciesPage from "../pages/vacancies/Vacancies";
import VacancyDetails from "../pages/vacancies/VacancyDetails";
import EditVacancyPage from "../pages/vacancies/EditVacancy";
import ManualEntry from "../pages/intake/ManualEntry";
import AttendanceTerminal from "../pages/Attendance/AttendancePunch";
import VacanciesDummyPage from "../pages/vacancies/Vacancydummy";
import CandidateIntakeDummy from "../pages/intake/CandidateIntakedummy";
import CandidateIntakeFilter from "../pages/intake/CandidateIntakeFilter";
import CandidateFollowUp from "../pages/candidatefollowup/CandidateFollowUp";
import CandidateFlow from "../pages/candidatefollowup/CandidateFlow";
import CandidatePage from "../pages/tempcandidate/CandidatePage";
import CandidateDemoPage from "../pages/tempcandidate/CandidatePage";
import CompanyBranchManagement from "../pages/company/CompanyPage";
import EmployeeProfileLayout from "../pages/dummyemp/EmployeeDemoDetails";
import EmployeeDemoDetails2 from "../pages/dummyemp/EmployeeDemoDetailscomment";
import Setting from "../pages/setting/Setting";
import AttendanceTemplate from "../pages/Attendance/template/AttendanceTemplate";
import CreateAttendaceTemplate from "../pages/Attendance/template/CreateAttendaceTemplate";
import GeolocationPage from "../pages/setting/geolocation/GeolocationPage";
import CreateGeoLocation from "../pages/setting/geolocation/CreateGeoLocation";
import ShiftPage from "../pages/setting/shift/ShiftPage";
import CreateShiftTemplate from "../pages/setting/shift/CreateShiftTemplate";

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

           {/* master page */}
            <Route path="/master" element={<MasterManagement />} />

            {/* vaccancy page */}
            {/* <Route path="/vacancies" element={<VacanciesPage />} /> */}
               <Route path="/vacancies" element={<VacanciesDummyPage />} />
            <Route path="/vacancy-details/:id" element={<VacancyDetails />} />
            <Route path="/edit-vacancy/:id" element={<EditVacancyPage />} />

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
{/* <Route path="/candidate" element={<CandidateIntake />} /> */}
<Route path="/candidate" element={<CandidateIntakeDummy />} />
<Route path="/candidatefilter" element={<CandidateIntakeFilter />} />
<Route path="/manualentry" element={<ManualEntryPage />} />
{/* <Route path="/editentry/:id" element={<ManualEntryPage14 />} /> */}
<Route path="/editentry/:id" element={<ManualEntry />} />
<Route path="/profile/:id" element={<CandidateProfilePage />} />

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

{/* attendance */}
<Route path="/attendance" element={<AttendanceTerminal />} /> 
<Route path="/attendancetemplate" element={<AttendanceTemplate />} /> 
<Route path="/createattendancetemplate" element={<CreateAttendaceTemplate />} /> 

{/* candidate followup */}
<Route path="/candidatefollowup" element={<CandidateFollowUp />} /> 
<Route path="/candidateflow" element={<CandidateFlow />} /> 


{/* candidate temp */}
<Route path="/tempcandidate" element={<CandidateDemoPage />} /> 

{/* company master */}
<Route path="/company" element={<CompanyBranchManagement />} /> 

{/* company master */}
<Route path="/employeedetailpage/:id" element={<EmployeeDemoDetails2 />} /> 

{/* company master */}
<Route path="/setting" element={<Setting />} /> 


{/* GEO Location */}
<Route path="/geofence" element={<GeolocationPage />} /> 
<Route path="/creategeofence" element={<CreateGeoLocation />} /> 

{/* shift page */}
<Route path="/shift" element={<ShiftPage />} /> 
<Route path="/createnewtemplate" element={<CreateShiftTemplate />} /> 

 


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
