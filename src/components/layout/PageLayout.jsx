import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function PageLayout() {
  return (
    <>

      <Sidebar />
      <Header />

      <div
        className="
          ml-[240px]      
          pt-16           
          min-h-screen
          bg-slate-100
        "
      >
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </>
  );
}



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
