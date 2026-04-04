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
import HolidayPage from "../pages/setting/holiday/HolidayPage";
import CreateHoliday from "../pages/setting/holiday/CreateHoliday";
import LeaveTemplate from "../pages/setting/leave/LeaveTemplate";
import CreateLeave from "../pages/setting/leave/CreateLeave";
import WeeklyHoliday from "../pages/setting/weeklyholiday/WeeklyHoliday";
import CreateWeeklyOff from "../pages/setting/weeklyholiday/CreateWeeklyOff";
import ManagerusersPage from "../pages/setting/manageuser/ManagerusersPage";
import RolePermission from "../pages/setting/rolespermission/RolePermission";
import RolePermissionPage from "../pages/setting/rolespermission/RolePermissionPage";
import CreateAttendanceWeeklyOff from "../pages/setting/weeklyholiday/CreateAttendanceWeeklyOff";
import Salarylogic from "../pages/setting/salary/Salarylogic";
import ManageSalaryTemplates from "../pages/setting/salary/ManageSalaryTemplates";
import SalaryStructureTemplate from "../pages/setting/salary/CreateSalaryStructure";
import MyProfile from "../pages/setting/myprofile/MyProfile";
import AttendanceReport from "../pages/Attendance/AttendanceReport";
import AttendanceReview from "../pages/Attendance/AttendanceReview";
import LeavesPage from "../pages/Attendance/attendaceleave/LeavesPage";
import EncashPage from "../pages/Attendance/attendaceleave/EncashPage";
import ReportPages from "../pages/report/ReportPages";
import SalaryOverviewVariable from "../pages/setting/salary/salaryoverview/SalaryOverviewVariable";
import Loans from "../pages/loan/Loans";
import ExpenseClaims from "../pages/expenseclaims/ExpenseClaims";
import PaymentsPage from "../pages/payments/PaymentsPage";
import ReimburesementsPage from "../pages/reimburesements/ReimburesementsPage";
import EditSalaryStruture from "../pages/setting/salary/salarystrutureemployee/editsalary/EditSalaryStruture";
import NewEmployee from "../pages/dummyemp/NewEmployee";
import AssetsInventoryPage from "../pages/inventory/AssetsInventoryPage";

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

{/* holidays page */}
<Route path="/holidaypage" element={<HolidayPage />} /> 
<Route path="/createholiday" element={<CreateHoliday />} /> 


{/* holidays page */}
<Route path="/leavepolicy" element={<LeaveTemplate />} /> 
<Route path="/createleave" element={<CreateLeave />} /> 

{/* weekly holiday */}
<Route path="/weeklyholiday" element={<WeeklyHoliday />} /> 
<Route path="/createweeklyholiday" element={<CreateWeeklyOff />} /> 
<Route path="/createattendaceweeklyoff" element={<CreateAttendanceWeeklyOff />} /> 

{/* manager users */}
<Route path="/managerusers" element={<ManagerusersPage />} /> 

{/* roles permission */}
<Route path="/rolespermission" element={<RolePermission />} /> 
<Route path="/rolespermissionpage" element={<RolePermissionPage />} /> 

{/* salary */}
<Route path="/salarylogic" element={<Salarylogic />} /> 
<Route path="/managesalarytemplates" element={<ManageSalaryTemplates />} /> 
<Route path="/createsalarystruture" element={<SalaryStructureTemplate />} /> 
<Route path="/salaryoverviewvariable" element={<SalaryOverviewVariable />} />
<Route path="/salarystruture" element={<SalaryOverviewVariable />} />

{/* Loans */}
<Route path="/loans" element={<Loans />} /> 

{/* my profile */}
<Route path="/profile" element={<MyProfile />} /> 


{/* Attendave report */}
<Route path="/attendancereport" element={<AttendanceReport />} />
<Route path="/attendacereview" element={<AttendanceReview />} /> 

{/* attendence employee leaves */}
<Route path="/attendenceleaves" element={<LeavesPage />} />
<Route path="/encashleaves" element={<EncashPage />} />


{/* expense Claims */}
<Route path="/expenseclaims" element={<ExpenseClaims />} /> 


{/* Payments */}
<Route path="/payments" element={<PaymentsPage />} /> 


{/* Reimburesements Page */}
<Route path="/reimburesementspage" element={<ReimburesementsPage />} /> 


{/* Reporting */}
<Route path="/reportpage" element={<ReportPages />} /> 


{/* employee salary Struture */}
<Route path="/salarystructureemployee" element={<EditSalaryStruture />} /> 


{/* employee salary and details Struture */}
<Route path="/newemployeesalary" element={<NewEmployee />} /> 

{/* assets */}
<Route path="/assetinventory" element={<AssetsInventoryPage />} /> 

 


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
