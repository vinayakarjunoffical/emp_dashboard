import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  MdNotificationsNone, 
  MdSearch, 
  MdOutlineHelpOutline, 
  MdKeyboardArrowDown 
} from "react-icons/md";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";

const Header = ({ collapsed, setCollapsed, isMobile }) => {

  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sessionUser = sessionStorage.getItem("role");

  const formatRole = (role = "") =>
  role
    .toLowerCase()
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");


  // Handle subtle shadow on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Convert current path to breadcrumb label
  const pathLabel = location.pathname.split("/").pop()?.replace("-", " ") || "Dashboard";

  return (
    // <header
    //   className={`
    //     fixed top-0 right-0 z-[60]
    //     h-16 w-full lg:w-[calc(100%-240px)]
    //     transition-all duration-200
    //     ${scrolled ? "bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm" : "bg-white border-b border-slate-100"}
    //     flex items-center justify-between px-6
    //   `}
    // >
  <header
  className={`
    fixed top-0 right-0 z-[60] h-16
    transition-all duration-300
    ${isMobile ? "left-0" : collapsed ? "left-[60px]" : "left-[240px]"}
    ${scrolled
      ? "bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm"
      : "bg-white border-b border-slate-100"}
    flex items-center justify-between px-4 sm:px-6
  `}
>


      {/* LEFT SIDE: Breadcrumbs & Context */}
      <div className="flex items-center gap-4">
      <button
  onClick={() => setCollapsed(!collapsed)}
  className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
>
  <HiOutlineMenuAlt2 size={22} />
</button>


        
        <div className="hidden sm:flex flex-col">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>HR Portal</span>
            <span className="text-slate-200">/</span>
            <span className="text-blue-600">{pathLabel}</span>
          </div>
          <h1 className="text-sm font-black text-slate-800 tracking-tight">
            Goelectronix <span className="text-slate-300 font-normal">v2.4</span>
          </h1>
        </div>
      </div>

      {/* CENTER: Enterprise Search Bar */}
      {/* <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full group">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search employees, documents, or logs..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100/50 border border-transparent focus:border-blue-500/20 focus:bg-white focus:ring-4 focus:ring-blue-500/5 rounded-xl text-xs font-medium transition-all outline-none"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
            <kbd className="px-1.5 py-0.5 border border-slate-200 rounded text-[10px] text-slate-400 bg-white font-sans">Ctrl</kbd>
            <kbd className="px-1.5 py-0.5 border border-slate-200 rounded text-[10px] text-slate-400 bg-white font-sans">K</kbd>
          </div>
        </div>
      </div> */}

      {/* RIGHT SIDE: Global Actions & Profile */}
      <div className="flex items-center gap-2">
        {/* Support Icon */}
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors hidden sm:block">
          <MdOutlineHelpOutline size={20} />
        </button>

        {/* Notification Hub */}
        <div className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors group">
          <MdNotificationsNone size={22} className="group-hover:scale-110 transition-transform" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 border-2 border-white rounded-full"></span>
        </div>

        <div className="h-6 w-[1px] bg-slate-200 mx-2 hidden sm:block" />

        {/* User Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex !bg-slate-50 items-center gap-3 p-1 pr-2 hover:!bg-slate-100 rounded-xl transition-all group"
          >
            {/* <div className="relative">
              <img
                src={user?.avatar || "https://i.pravatar.cc/150?u=hr"}
                alt="avatar"
                className="w-8 h-8 rounded-lg object-cover border border-slate-200 group-hover:border-blue-300 transition-colors"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div> */}
             <div className="relative group cursor-pointer">
  {/* Text-Based Avatar */}
  <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center border border-blue-500 shadow-sm group-hover:bg-blue-600 transition-all duration-300">
    <span className="text-[11px] font-black text-white tracking-tighter">
      {/* Logic: Splits name by space, takes first letter of each part, 
         uppercases them, and joins them. 
      */}
      {user?.name
        ? user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : "HR"}
    </span>
  </div>

  {/* Status Indicator */}
  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm ring-1 ring-slate-100"></div>
</div>
            
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-[11px] font-black text-slate-800 leading-none">{formatRole(sessionUser)}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Administrator</span>
            </div>
            <MdKeyboardArrowDown className={`text-slate-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Professional Menu Dropdown */}
          {profileOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)}></div>
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-2 z-20 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-slate-50 mb-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase">System Status</p>
                  <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> All Services Online
                  </p>
                </div>
                
                <button
                  className="flex items-center w-full px-3 !bg-white py-2 text-xs font-bold !text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/owner/profile");
                  }}
                >
                  Account Settings
                </button>

                <button
                  className="flex items-center !bg-transparent w-full px-3 py-2 text-xs font-bold !text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-1"
                  onClick={handleLogout}
                >
                  Log out session
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;


// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { MdNotifications } from "react-icons/md";
// import { GiHamburgerMenu } from "react-icons/gi";
// import { ImCross } from "react-icons/im";
// import { useAuth } from "../../context/AuthContext";

// const Header = () => {
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();

//   const [menuOpen, setMenuOpen] = useState(false);
//   const [profileOpen, setProfileOpen] = useState(false);

//   const handleLogout = () => {
//     logout();               // 🔴 clears sessionStorage
//     navigate("/");          // 🔁 redirect to login
//   };

//   return (
//     <header
//       className="
//         fixed top-0 right-0 z-50
//         h-16 w-full lg:w-[calc(100%-240px)]
//         bg-white border-b border-gray-200
//         flex items-center justify-between px-5
//       "
//     >
//       {/* Left */}
//       <h1 className="text-lg font-semibold text-slate-700">
//         HR Dashboard
//       </h1>

//       {/* Right */}
//       <div className="flex items-center gap-4">
//         {/* Notification */}
//         <div className="relative cursor-pointer">
//           <MdNotifications className="text-xl text-slate-600 hover:text-blue-600 transition" />
//           <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] bg-red-500 text-white rounded-full flex items-center justify-center">
//             2
//           </span>
//         </div>

//         {/* User Avatar */}
//         <div className="relative">
//           <img
//             src={
//               user?.avatar ||
//               "https://freesvg.org/img/abstract-user-flat-4.png"
//             }
//             alt="avatar"
//             onClick={() => setProfileOpen(!profileOpen)}
//             className="w-8 h-8 rounded-full border cursor-pointer hover:ring-2 hover:ring-blue-500 transition"
//           />

//           {profileOpen && (
//             <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-md border">
//               <button
//                 className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
//                 onClick={() => {
//                   setProfileOpen(false);
//                   navigate("/owner/profile");
//                 }}
//               >
//                 Profile
//               </button>

//               <button
//                 className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
//                 onClick={handleLogout}
//               >
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Mobile Menu */}
//         <div className="lg:hidden">
//           {menuOpen ? (
//             <ImCross
//               size={20}
//               onClick={() => setMenuOpen(false)}
//               className="cursor-pointer"
//             />
//           ) : (
//             <GiHamburgerMenu
//               size={20}
//               onClick={() => setMenuOpen(true)}
//               className="cursor-pointer"
//             />
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
