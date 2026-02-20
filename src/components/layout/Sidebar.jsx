import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  UserPlus,
  ShieldCheck,
  ChevronRight,
  Menu,
} from "lucide-react";
import { useState } from "react";

const Sidebar = ({ collapsed, setCollapsed, isMobile }) => {
  const location = useLocation();
  // const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    {
      label: "Main Menu",
      items: [{ name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> }],
    },
    {
      label: "Organization",
      items: [
        { name: "Departments", path: "/departments", icon: <Building2 size={18} /> },
        { name: "Document", path: "/document", icon: <Users size={18} /> },
        { name: "Holidays", path: "/holidays", icon: <Users size={18} /> },
      ],
    },
    {
      label: "Intake Candidate",
      items: [{ name: "Candidate", path: "/candidate", icon: <UserPlus size={18} /> }],
    },
    {
      label: "Follow Up Candidate",
      items: [{ name: "Follow Up", path: "/invitation", icon: <UserPlus size={18} /> }],
    },
    {
      label: "Job Template",
      items: [{ name: "Template", path: "/jobtemplate", icon: <UserPlus size={18} /> }],
    },
    {
      label: "Onboarding",
      items: [{ name: "New Employee", path: "/dummyemp", icon: <UserPlus size={18} /> }],
    },
  ];

  return (
    // <aside
    //   className={`
    //     fixed top-0 left-0 h-dvh bg-[#0f172a] text-slate-300 border-r scroll- border-slate-800/50
    //     flex flex-col z-[70] transition-all duration-300
    //     ${collapsed ? "w-16" : "w-60"}
    //   `}
    // >
    <aside
  className={`
    fixed top-0 left-0 h-dvh bg-[#0f172a] text-slate-300 border-r border-slate-800/50
    flex flex-col z-[70] transition-all duration-300
    overflow-y-auto overflow-x-hidden
    ${
      isMobile
        ? `w-60 transform ${collapsed ? "-translate-x-full" : "translate-x-0"}`
        : collapsed
        ? "w-16"
        : "w-60"
    }
  `}
>

      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-lg shadow-blue-500/20">
            <ShieldCheck size={20} />
          </div>

          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-black text-white">Goelectronix</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase">
                Enterprise
              </span>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
  onClick={() => setCollapsed(!collapsed)}
  className="lg:hidden text-slate-400 hover:text-white transition"
>
  <Menu size={20} />
</button>

      </div>

      {/* Navigation */}
      {/* <nav className="flex-1 mt-6 px-2 space-y-6 overflow-y-auto"> */}
      <nav className="flex-1 min-h-0 mt-6 px-2 space-y-6 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">

        {navItems.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <h3 className="px-3 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3">
                {group.label}
              </h3>
            )}

            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`
                      group flex items-center ${
                        collapsed ? "justify-center" : "justify-between"
                      }
                      px-3 py-2.5 rounded-xl text-[13px] font-bold
                      transition-all duration-200 relative
                      ${
                        isActive
                          ? "bg-blue-600/10 text-blue-400"
                          : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`${
                          isActive
                            ? "text-blue-400"
                            : "text-slate-500 group-hover:text-slate-300"
                        }`}
                      >
                        {item.icon}
                      </span>

                      {!collapsed && item.name}
                    </div>

                    {/* Active Indicator */}
                    {!collapsed && isActive && (
                      <>
                        <ChevronRight size={14} className="text-blue-400" />
                        <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
                      </>
                    )}

                    {/* Tooltip (Collapsed Mode) */}
                    {collapsed && (
                      // <span className="absolute left-14 scale-0 group-hover:scale-100 transition bg-slate-900 text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                      <span className="absolute left-14 scale-0 group-hover:scale-100 transition bg-slate-900 text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none">

                        {item.name}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      {isMobile && !collapsed && (
  <div
    className="fixed inset-0 bg-black/40 -z-10"
    onClick={() => setCollapsed(true)}
  />
)}

    </aside>
  );
};

export default Sidebar;

//****************************************************working code phase 17/02/26**************************************************************** */
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { 
//   LayoutDashboard, 
//   Building2, 
//   Users, 
//   UserPlus, 
//   LogOut, 
//   ShieldCheck,
//   ChevronRight,
//   Settings
// } from "lucide-react";

// const Sidebar = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const navItems = [
//     { label: "Main Menu", items: [
//       { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
//     ]},
//     { label: "Organization", items: [
//       { name: "Departments", path: "/departments", icon: <Building2 size={18} /> },
//       // { name: "Roles", path: "/roles", icon: <Users size={18} /> },
//       { name: "Document", path: "/document", icon: <Users size={18} /> },
//       { name: "Holidays", path: "/holidays", icon: <Users size={18} /> },
//     ]},
//     { label: "Intake Candidate", items: [
//       { name: "Candidate", path: "/candidate", icon: <UserPlus size={18} /> },
//     ]},
//      { label: "Follow Up Candidate", items: [
//       { name: "Follow Up", path: "/invitation", icon: <UserPlus size={18} /> },
//     ]}
//     ,
//      { label: "Job Template", items: [
//       { name: "Template", path: "/jobtemplate", icon: <UserPlus size={18} /> },
//     ]},
//     { label: "Onboarding", items: [
//       { name: "New Employee", path: "/dummyemp", icon: <UserPlus size={18} /> },
//     ]}
//   ];

//   return (
//     <aside className="fixed top-0 left-0 h-screen w-60 bg-[#0f172a] text-slate-300 border-r border-slate-800/50 flex flex-col z-[70]">
      
//       {/* Brand Section */}
//       <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-800/50">
//         <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-lg shadow-blue-500/20">
//           <ShieldCheck size={20} />
//         </div>
//         <div className="flex flex-col">
//           <span className="text-sm font-black text-white tracking-tight">Goelectronix</span>
//           <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Enterprise</span>
//         </div>
//       </div>

//       {/* Navigation Groups */}
//       <nav className="flex-1 mt-6 px-3 space-y-8 overflow-y-auto custom-scrollbar">
//         {navItems.map((group) => (
//           <div key={group.label} className="space-y-1">
//             <h3 className="px-3 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3">
//               {group.label}
//             </h3>
            
//             <div className="space-y-1">
//               {group.items.map((item) => {
//                 const isActive = location.pathname === item.path;
                
//                 return (
//                   <Link
//                     key={item.name}
//                     to={item.path}
//                     className={`
//                       relative group flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-bold
//                       transition-all duration-200 outline-none
//                       ${isActive 
//                         ? "bg-blue-600/10 text-blue-400" 
//                         : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"}
//                     `}
//                   >
//                     <div className="flex items-center gap-3">
//                       <span className={`${isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"}`}>
//                         {item.icon}
//                       </span>
//                       {item.name}
//                     </div>

//                     {isActive && (
//                       <>
//                         <ChevronRight size={14} className="text-blue-400" />
//                         <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
//                       </>
//                     )}
//                   </Link>
//                 );
//               })}
//             </div>
//           </div>
//         ))}
//       </nav>

//       {/* Footer / Logout Section */}
//       {/* <div className="p-4 mt-auto border-t border-slate-800/50 space-y-2">
//         <button
//           onClick={() => navigate("/owner/settings")}
//           className="w-full flex items-center gap-3 px-3 py-2 text-[13px] font-bold text-slate-400 hover:bg-slate-800/50 rounded-xl transition-all"
//         >
//           <Settings size={18} />
//           Settings
//         </button>
        
//         <button
//           onClick={() => navigate("/login")}
//           className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-black text-slate-400 hover:text-white hover:bg-red-500/10 group rounded-xl transition-all"
//         >
//           <div className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-red-500/20 group-hover:text-red-500 transition-all">
//             <LogOut size={16} />
//           </div>
//           Logout Session
//         </button>

//       </div> */}
//     </aside>
//   );
// };

// export default Sidebar;

//**********************************************working code phase 1 plan  ui**************************************************************** */

// import { Link, useLocation, useNavigate } from "react-router-dom";
// import {
//   MdDashboard,
//   MdHome,
//   MdReport,
//   MdSettings,
// } from "react-icons/md";
// import { FaUsers, FaUser } from "react-icons/fa";
// import { BsFileEarmarkText } from "react-icons/bs";
// import { GiPriceTag } from "react-icons/gi";
// import { FiLogOut } from "react-icons/fi";

// const Sidebar = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const navItems = {
//     OWNER: [
//       { name: "Dashboard", path: "/dashboard", icon: <MdDashboard /> },
//       { name: "Departments", path: "/departments", icon: <MdHome /> },
//       { name: "Employees", path: "/employees", icon: <FaUser /> },
//       // {
//       //   name: "Branch Admins",
//       //   path: "/owner/branch/admins",
//       //   icon: <FaUser />,
//       // },
//       {
//         name: "New Employee",
//         path: "/dummyemp",
//         icon: <GiPriceTag />,
//       },
//       // { name: "Reports", path: "/owner/reports", icon: <MdReport /> },
//       // { name: "Settings", path: "/owner/settings", icon: <MdSettings /> },
//     ],
//   };

//   const links = navItems.OWNER;

//   return (
//     <aside className="fixed top-0 left-0 h-screen w-60 bg-slate-900 text-white border-r border-slate-800">
//       {/* Logo */}
//       <div className="h-16 flex items-center px-5 font-semibold text-lg border-b border-slate-800">
//         HR Admin
//       </div>

//       {/* Menu */}
//       <nav className="mt-2 px-2">
//         {links.map((item) => {
//           const isActive = location.pathname === item.path;

//           return (
//             <Link
//               key={item.name}
//               to={item.path}
//               className={`
//                 flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium
//                 transition-all duration-200
//                 ${
//                   isActive
//                     ? "bg-blue-600 text-white"
//                     : "text-slate-300 hover:bg-slate-800 hover:text-white"
//                 }
//               `}
//             >
//               <span className="text-lg">{item.icon}</span>
//               {item.name}
//             </Link>
//           );
//         })}
//       </nav>

//       {/* Logout */}
//       <div className="absolute bottom-4 left-0 w-full px-3">
//         <button
//           onClick={() => navigate("/login")}
//           className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-md
//                      bg-slate-800 hover:bg-red-600 transition"
//         >
//           <FiLogOut />
//           Logout
//         </button>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;

//************************************************************************************************** */
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import {
//   MdDashboard,
//   MdHome,
//   MdReport,
//   MdSettings,
// } from "react-icons/md";
// import { FaUsers, FaUserCircle, FaUser } from "react-icons/fa";
// import { BsFileEarmarkText } from "react-icons/bs";
// import { FiLogOut } from "react-icons/fi";
// import Button from "../comman/Button";
// import { GiPriceTag } from "react-icons/gi";
// // import CompanyImage from "../../../../../assets/360 RestoHub.png";

// const Sidebar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Define sidebar links for roles WITH ICONS
//   const navItems = {
//     SUPERADMIN: [
//       {
//         name: "Dashboard",
//         path: "/",
//         icon: <MdDashboard />,
//       },
//       { name: "Hotel Owners", path: "/superadmin/owners", icon: <FaUsers /> },
//       {
//         name: "Plans and Pricing",
//         path: "/superadmin/plans",
//         icon: <GiPriceTag />,
//       },
//       {
//         name: "Subscriptions",
//         path: "/superadmin/subscription&billing",
//         icon: <GiPriceTag />,
//       },
//       {
//         name: "Reports",
//         path: "/superadmin/reports",
//         icon: <MdReport />,
//       },
//       {
//         name: "Settings",
//         path: "/superadmin/settings",
//         icon: <MdSettings />,
//       },
//     ],
//     OWNER: [
//       { name: "Dashboard", path: "/", icon: <MdDashboard /> },
//       {
//         name: "Branches",
//         path: "/owner/branches",
//         icon: <MdHome />,
//       },
//       // {
//       //   name: "Restaurant List",
//       //   path: "/owner/restaurantlist",
//       //   icon: <MdRestaurant />,
//       // },
//       {
//         name: "Branch Admins",
//         path: "/owner/branch/admins",
//         icon: <FaUser></FaUser>,
//       },
//       {
//         name: "Subscription & Billing",
//         path: "/owner/subscription",
//         icon: <FaUser></FaUser>,
//       },
//       { name: "Reports", path: "/owner/reports", icon: <MdReport /> },
//       {
//         name: "Settings",
//         path: "/owner/settings",
//         icon: <MdSettings />,
//       },
//     ],
//     ADMIN: [
//       { name: "Dashboard", path: "/admin/dashboard", icon: <MdDashboard /> },
//       { name: "Tasks", path: "/admin/tasks", icon: <BsFileEarmarkText /> },
//     ],
//     USER: [
//       { name: "Dashboard", path: "/user/dashboard", icon: <MdDashboard /> },
//       { name: "Profile", path: "/user/profile", icon: <FaUserCircle /> },
//     ],
//   };

//   const links = navItems["OWNER"] || [];

//   return (
//     <aside className="fixed top-0 bottom-0 left-0 min-h-screen w-60 bg-(--sidebar-bg) shadow-lg lg:block hidden border-r border-gray-200">
//       <div className="p-2">
//         {/* <img
//           src={CompanyImage}
//           alt="companyImage"
//           className="w-[70%] h-[80px] object-contain"
//         ></img> */}
//       </div>
//       <div className="flex flex-col h-full">
//         <nav className="flex-1 mt-2">
//           <ul className="flex flex-col gap-1">
//             {links.map((item, index) => (
//               <li key={index}>
//                 <Link
//                   to={item.path}
//                   className={`flex items-center gap-3 px-2 py-2 text-[15px] font-medium transition-all duration-200
//                     hover:bg-(--primary) hover:text-white
//                     ${
//                       location.pathname === item.path
//                         ? "bg-(--primary) text-white"
//                         : "text-gray-700"
//                     }
//                   `}
//                 >
//                   <span className="text-lg">{item.icon}</span>
//                   {item.name}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </nav>

//         {/* Logout */}
//         <div className="absolute bottom-4 left-0 w-full px-3">
//           {/* <Button
//             btnType="button"
//             btnText={"Log Out"}
//             icon={<FiLogOut></FiLogOut>}
//             onClick={() => navigate("/login")}
//             iconPosition="left"
//             // className="flex items-center justify-center w-full bg-(--primary) p-2 rounded-md text-white cursor-pointer hover:bg-(--secondary)"
//             className="w-full btn-lg flex gap-1 items-center justify-center"
//           ></Button> */}
//         </div>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;