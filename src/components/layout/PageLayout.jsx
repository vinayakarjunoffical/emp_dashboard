import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function PageLayout() {
  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setCollapsed(mobile); // 👉 hide sidebar on mobile by default
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
      />

      <Header
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <div
        className={`
          pt-16 min-h-screen bg-slate-100 transition-all duration-300
          ${isMobile ? "ml-0" : collapsed ? "ml-[60px]" : "ml-[240px]"}
        `}
      >
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </>
  );
}

//************************************************************************************************************ */
// import { Outlet } from "react-router-dom";
// import { useState } from "react";
// import Sidebar from "./Sidebar";
// import Header from "./Header";

// export default function PageLayout() {
//   const [collapsed, setCollapsed] = useState(false);

//   return (
//     <>
//       <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
//       <Header collapsed={collapsed} setCollapsed={setCollapsed} />

//       {/* <div
//         className={`
//           pt-16 min-h-screen bg-slate-100 transition-all duration-300
//           ${collapsed ? "ml-[80px]" : "ml-[240px]"}
//         `}
//       > */}
//       <div
//   className={`
//     pt-16 min-h-screen bg-slate-100 transition-all duration-300
//     overflow-x-auto
//     ${collapsed ? "ml-[60px]" : "ml-[240px]"}
//   `}
// >

//         <main className="p-6">
//           <Outlet />
//         </main>
//       </div>
//     </>
//   );
// }

//******************************************************************************************************* */
// import { Outlet } from "react-router-dom";
// import Sidebar from "./Sidebar";
// import Header from "./Header";

// export default function PageLayout() {
//   return (
//     <>

//       <Sidebar />
//       <Header />

//       <div
//         className="
//           ml-[240px]      
//           pt-16           
//           min-h-screen
//           bg-slate-100
//         "
//       >
//         <main className="p-6">
//           <Outlet />
//         </main>
//       </div>
//     </>
//   );
// }



// import Sidebar from "./Sidebar";
// import Header from "./Header";

// export default function PageLayout({ children }) {
//   return (
//     <div className="flex">
//       <Sidebar />

//       <div className="flex-1 flex flex-col min-h-screen">
//         <Header />
//         <main className="p-6 bg-slate-100 flex-1 border-2 border-amber-700">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }

// import Sidebar from "./Sidebar";
// import Header from "./Header";

// export default function PageLayout({ children }) {
//   return (
//     <div className="flex">
//       <Sidebar />

//       <div className="flex-1 flex flex-col min-h-screen">
//         <Header />
//         <main className="p-6 bg-slate-100 flex-1">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }
