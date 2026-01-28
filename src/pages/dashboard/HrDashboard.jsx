import {
  Users,
  IdCard,
  CreditCard,
  Landmark,
  MapPin,
  CheckCircle,
} from "lucide-react";

import MaterialStatCard from "../../components/comman/MaterialStatCard";
import ChartCard from "../../components/charts/ChartCard";
import VerificationChart from "../../components/charts/VerificationChart";
import EmployeeStatusChart from "../../components/charts/EmployeeStatusChart";
import DashboardActions from "../../pages/dashboard/DashboardActions";

import {
  hrStats,
  verificationChartData,
  employeeStatusFlow,
} from "../../data/hrDashboardData";

const icons = [
  Users,
  IdCard,
  CreditCard,
  Landmark,
  MapPin,
  CheckCircle,
];

export default function HrDashboard() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          HR Dashboard
        </h1>
        <p className="text-sm text-slate-500">
          Employee onboarding & verification overview
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {hrStats.map((item, index) => (
          <MaterialStatCard
            key={item.title}
            title={item.title}
            value={item.value}
            icon={icons[index]}
            percent={item.percent}
            trend={item.trend}
            subtitle={item.subtitle}
          />
        ))}
      </div>

      {/* ACTIONS */}
      <DashboardActions />

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Verification Status"
          subtitle="Completed vs Pending documents"
          footer="Aadhaar, PAN, Bank & Address"
        >
          <VerificationChart data={verificationChartData} />
        </ChartCard>

        <ChartCard
          title="Employee Lifecycle"
          subtitle="Created → Confirmed"
          footer="Based on HR review flow"
        >
          <EmployeeStatusChart data={employeeStatusFlow} />
        </ChartCard>
      </div>
    </div>
  );
}


// import {
//   Users,
//   IdCard,
//   CreditCard,
//   Landmark,
//   MapPin,
//   CheckCircle,
// } from "lucide-react";

// import MaterialStatCard from "../../components/comman/MaterialStatCard";
// import ChartCard from "../../components/charts/ChartCard";
// import VerificationChart from "../../components/charts/VerificationChart";
// import EmployeeStatusChart from "../../components/charts/EmployeeStatusChart";
// import DashboardActions from "../../pages/dashboard/DashboardActions";

// import {
//   hrStats,
//   verificationChartData,
//   employeeStatusFlow,
// } from "../../data/hrDashboardData";

// const icons = [
//   Users,
//   IdCard,
//   CreditCard,
//   Landmark,
//   MapPin,
//   CheckCircle,
// ];

// export default function HrDashboard() {
//   return (
//     <div className="space-y-8">
//       <h1 className="text-2xl font-semibold">
//         HR Dashboard
//       </h1>

//       {/* STAT CARDS */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//         {hrStats.map((item, index) => (
//           <MaterialStatCard
//             key={item.title}
//             title={item.title}
//             value={item.value}
//             icon={icons[index]}
//             percent={item.percent}
//             trend={item.trend}
//             subtitle={item.subtitle}
//           />
//         ))}
//       </div>

//       {/* ACTION BUTTONS */}
//       <DashboardActions />

//       {/* CHARTS */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <ChartCard
//           title="Verification Status"
//           subtitle="Completed vs Pending documents"
//           footer="based on employee KYC"
//         >
//           <VerificationChart data={verificationChartData} />
//         </ChartCard>

//         <ChartCard
//           title="Employee Status Flow"
//           subtitle="Lifecycle progress"
//           footer="Created → Confirmed"
//         >
//           <EmployeeStatusChart data={employeeStatusFlow} />
//         </ChartCard>
//       </div>
//     </div>
//   );
// }


// import {
//   DollarSign,
//   Users,
//   UserPlus,
//   BarChart3,
// } from "lucide-react";

// import MaterialStatCard from "../../components/comman/MaterialStatCard";
// import ChartCard from "../../components/charts/ChartCard";
// import WebsiteViewChart from "../../components/charts/WebsiteViewChart";
// import DailySalesChart from "../../components/charts/DailySalesChart";
// import CompletedTasksChart from "../../components/charts/CompletedTasksChart";

// export default function HrDashboard() {
//   return (
//     <div className="space-y-8">
//       <h1 className="text-xl font-semibold">Home</h1>

//       {/* Stat Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
//         <MaterialStatCard
//           title="Today's Money"
//           value="$53k"
//           icon={DollarSign}
//           percent={55}
//           trend="up"
//           subtitle="than last week"
//         />
//         <MaterialStatCard
//           title="Today's Users"
//           value="2,300"
//           icon={Users}
//           percent={3}
//           trend="up"
//           subtitle="than last month"
//         />
//         <MaterialStatCard
//           title="New Clients"
//           value="3,462"
//           icon={UserPlus}
//           percent={2}
//           trend="down"
//           subtitle="than yesterday"
//         />
//         <MaterialStatCard
//           title="Sales"
//           value="$103,430"
//           icon={BarChart3}
//           percent={5}
//           trend="up"
//           subtitle="than yesterday"
//         />
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <ChartCard
//           title="Website View"
//           subtitle="Last Campaign Performance"
//           footer="campaign sent 2 days ago"
//         >
//           <WebsiteViewChart />
//         </ChartCard>

//         <ChartCard
//           title="Daily Sales"
//           subtitle="15% increase in today sales"
//           footer="updated 4 min ago"
//         >
//           <DailySalesChart />
//         </ChartCard>

//         <ChartCard
//           title="Completed Tasks"
//           subtitle="Last Campaign Performance"
//           footer="just updated"
//         >
//           <CompletedTasksChart />
//         </ChartCard>
//       </div>
//     </div>
//   );
// }
