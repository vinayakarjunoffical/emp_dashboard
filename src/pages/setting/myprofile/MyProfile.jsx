import React, { useState } from 'react';
import { 
  Info, Settings, LayoutGrid, CheckCircle2, ArrowLeft, HelpCircle, 
  UserCircle2, Building2, Fingerprint, ExternalLink, Edit3, X, ImagePlus, Save
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyProfile = () => {
  const navigate = useNavigate();

  // 1. State Management for Profile Data
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    businessName: "Goelectronix Technologies Pvt Ltd",
    jurisdiction: "Maharashtra, Mumbai",
    address: "4th Floor, Ellora Clarissa, Unit 403, Plot A-785",
    phone: "+91 9892580308",
    email: "sujithankare@goelectronix.com",
    logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=GT" // Initial placeholder
  });

  // ✨ COMPACT Metadata Row Component
  const ProfileItem = ({ label, value, badge, children }) => (
    <div className="py-3 flex flex-col gap-1 group transition-all duration-200">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">
        {label}
      </label>
      <div className="flex items-center gap-2">
        {children ? children : (
          <span className="text-[13px] font-bold text-slate-800 tracking-tight leading-none group-hover:text-blue-600 transition-colors">
            {value}
          </span>
        )}
        {badge}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter'] pb-12 text-left relative overflow-x-hidden">
      
      {/* 🛡️ BACKGROUND WATERMARK */}
      <div className="absolute -bottom-10 -right-10 opacity-[0.02] text-slate-900 pointer-events-none rotate-12">
        <UserCircle2 size={400} />
      </div>

      {/* 🚀 COMPACT HEADER */}
      <div className="bg-white border-b border-slate-100 px-6 py-2.5 flex items-center justify-between sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 !text-slate-400 hover:text-blue-600 border-0 !bg-transparent cursor-pointer group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.15em]">Back</span>
        </button>

      </div>

      <div className=" mx-auto px-6 mt-6 relative z-10">
        
        {/* 🎭 HERO SECTION */}
        <div className="flex items-center justify-between mb-4 animate-in fade-in slide-in-from-top-2 duration-500">
           <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm border-2 border-blue-500 ring-4 ring-blue-50/50">
                <Building2 size={24} className="text-blue-500" />
              </div>
              <div className="space-y-0.5">
                <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Organization Profile</h1>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">ID: ENT-9825-GTPL</p>
              </div>
           </div>
           
           {/* ✅ EDIT TRIGGER */}
           <button 
             onClick={() => setIsEditModalOpen(true)}
             className="flex items-center gap-2 px-4 py-3 !bg-white !text-blue-500 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 border-0 cursor-pointer"
           >
             <Edit3 size={14} strokeWidth={3} />
             Edit Profile
           </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start text-left">
          
          <div className="lg:col-span-8 space-y-5">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-slate-50/50 px-6 py-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-white rounded-lg shadow-sm border border-slate-100 text-blue-600"><Info size={16} strokeWidth={2.5} /></div>
                  <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">Business Info</h3>
                </div>
              </div>
              <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 divide-y md:divide-y-0 divide-slate-50">
                <ProfileItem label="Business Name" value={profileData.businessName} />
                
                {/* ✅ LOGO DISPLAY */}
                <ProfileItem label="Business Logo">
                  <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-lg overflow-hidden shadow-inner">
                    <img src={profileData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                </ProfileItem>

                <div className="md:col-span-2 border-t border-slate-50 mt-2 pt-2">
                   <ProfileItem label="Business (State & City)" value={profileData.jurisdiction} />
                </div>
                <div className="md:col-span-2 border-t border-slate-50 pt-2">
                   <ProfileItem label="Business Address" value={profileData.address} />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden ring-1 ring-blue-50/30">
              <div className="bg-slate-100 px-6 py-4 flex items-center gap-3">
                <Settings size={18} strokeWidth={2.5} className="text-blue-500" />
                <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Account</h3>
              </div>
              <div className="px-6 py-4 space-y-2 divide-y divide-slate-50">
                <ProfileItem label="Contact Number" value={profileData.phone} />
                <ProfileItem label="Email" value={profileData.email} badge={<div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md border border-emerald-100/50"><CheckCircle2 size={8} strokeWidth={4} /><span className="text-[7px] font-black uppercase">Verified</span></div>} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setIsEditModalOpen(false)} />
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300">
            
            <div className="p-4 px-6 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3 text-left">
                 <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Edit3 size={18} /></div>
                 <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Edit Details</h2>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:!bg-slate-50 !bg-transparent rounded-full transition-colors border-0  cursor-pointer !text-slate-400"><X size={20} /></button>
            </div>

            <div className="px-8 py-4 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto custom-scrollbar text-left">
              
              {/* Logo Upload Box */}
              <div className="md:col-span-2 flex flex-col gap-2">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Logo</label>
                 <div className="flex items-center gap-6 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                    <div className="w-16 h-16 bg-white border-2 border-slate-100 rounded-xl flex items-center justify-center shadow-sm overflow-hidden">
                       <img src={profileData.logoUrl} className="w-full h-full object-cover" alt="Preview" />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white shadow-sm cursor-pointer">
                       <ImagePlus size={14} /> Replace Logo
                    </button>
                 </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Name</label>
                <input type="text" value={profileData.businessName} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold text-slate-700 outline-none focus:border-blue-400" onChange={(e) => setProfileData({...profileData, businessName: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Business (State & City)</label>
                <input type="text" value={profileData.jurisdiction} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold text-slate-700 outline-none focus:border-blue-400" onChange={(e) => setProfileData({...profileData, jurisdiction: e.target.value})} />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Address</label>
                <textarea rows="2" value={profileData.address} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold text-slate-700 outline-none focus:border-blue-400 resize-none" onChange={(e) => setProfileData({...profileData, address: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Number</label>
                <input type="text" value={profileData.phone} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold text-slate-700 outline-none focus:border-blue-400" onChange={(e) => setProfileData({...profileData, phone: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <input type="email" value={profileData.email} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold text-slate-700 outline-none focus:border-blue-400" onChange={(e) => setProfileData({...profileData, email: e.target.value})} />
              </div>
            </div>

            <div className="p-6 border-t !border-slate-50 justify-end  flex gap-4 bg-slate-50/30">
              <button onClick={() => setIsEditModalOpen(false)} className="flex px-5 py-3 !bg-white border !border-slate-200 !text-slate-500 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-white cursor-pointer">Cancel</button>
              <button onClick={() => setIsEditModalOpen(false)} className="flex px-5 py-3 !bg-white !text-blue-500 border border-blue-500 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm shadow-blue-200 hover:bg-blue-700 transition-all cursor-pointer flex items-center justify-center gap-2">
                 <Save size={14} /> Update 
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
//***************************************************************************************************** */
// import React from 'react';
// import { 
//   Info, 
//   Settings, 
//   LayoutGrid, 
//   CheckCircle2, 
//   ArrowLeft, 
//   HelpCircle,
//   ShieldCheck,
//   UserCircle2,
//   Building2,
//   Fingerprint,
//   ExternalLink
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const MyProfile = () => {
//   const navigate = useNavigate();

//   // ✨ COMPACT Metadata Row
//   const ProfileItem = ({ label, value, badge }) => (
//     <div className="py-3 flex flex-col gap-0.5 group transition-all duration-200">
//       <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">
//         {label}
//       </label>
//       <div className="flex items-center gap-2">
//         <span className="text-[13px] font-bold text-slate-800 tracking-tight leading-none group-hover:text-blue-600">
//           {value}
//         </span>
//         {badge}
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-slate-50 font-['Inter'] pb-12 text-left relative overflow-hidden">
      
//       {/* 🛡️ BACKGROUND WATERMARK */}
//       <div className="absolute -bottom-10 -right-10 opacity-[0.02] text-slate-900 pointer-events-none rotate-12">
//         <UserCircle2 size={400} />
//       </div>

//       {/* 🚀 COMPACT HEADER */}
//       <div className="bg-white border-b border-slate-100 px-6 py-2.5 flex items-center justify-between sticky top-0 z-50">
//         <button 
//           onClick={() => navigate(-1)} 
//           className="flex items-center gap-2 text-slate-400 !bg-transparent hover:text-blue-600 transition-all border-0 bg-transparent cursor-pointer group"
//         >
//           <div className="p-1.5 rounded-lg group-hover:bg-blue-50 transition-colors">
//             <ArrowLeft size={16} className="group-hover:-translate-x-1 text-slate-400 transition-transform" />
//           </div>
//           <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.15em]">Back</span>
//         </button>
        
//         <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-md border border-emerald-100/50">
//            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
//            <span className="text-[8px] font-black text-emerald-700 uppercase tracking-widest pt-0.5">Live Sync</span>
//         </div>
//       </div>

//       <div className=" mx-auto px-6 mt-6 relative z-10">
        
//         {/* 🎭 COMPACT HERO SECTION */}
//         <div className="flex items-center gap-4 mb-6 animate-in fade-in slide-in-from-top-2 duration-500">
//            <div className="w-14 h-14 !bg-white rounded-xl flex items-center justify-center shadow-sm  shadow-blue-100 border-2 border-blue-500 ring-4 ring-blue-50/50">
//               <Building2 size={24} className="text-blue-500" />
//            </div>
//            <div className="space-y-0.5">
//               <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Organization Profile</h1>
//               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">ID: ENT-9825-GTPL</p>
//            </div>
//         </div>

//         {/* 🏢 TIGHT GRID LAYOUT */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
//           {/* ⬅️ MAIN CONTENT: BUSINESS INFO (8/12) */}
//           <div className="lg:col-span-8 space-y-5 animate-in fade-in slide-in-from-left-4 duration-500">
//             <div className="!bg-white border !border-slate-200 rounded-2xl shadow-sm overflow-hidden">
//               <div className="bg-slate-50/50 px-6 py-3 border-b border-slate-100 flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="p-1.5 bg-white rounded-lg shadow-sm border border-slate-100 text-blue-600">
//                     <Info size={16} strokeWidth={2.5} />
//                   </div>
//                   <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">Business Info</h3>
//                 </div>
//                 <ExternalLink size={14} className="text-slate-300 hover:text-blue-600 cursor-pointer" />
//               </div>
//               <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 divide-y md:divide-y-0 divide-slate-50">
//                 <ProfileItem label="Business Name" value="Goelectronix Technologies Pvt Ltd" />
//                 <ProfileItem label="Business Logo" value="Logo Added" />
//                 <div className="md:col-span-2 border-t border-slate-50 mt-2 pt-2">
//                    <ProfileItem label="Business State & City" value="Maharashtra, Mumbai" />
//                 </div>
//                 <div className="md:col-span-2 border-t border-slate-50 pt-2">
//                    <ProfileItem label="Business Address" value="4th Floor, Ellora Clarissa, Unit 403, Plot A-785" />
//                 </div>
//               </div>
//             </div>

//             {/* MINIMAL OTHERS CARD */}
//             <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-4 border-dashed bg-slate-50/10">
//                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-300">
//                   <LayoutGrid size={20} />
//                </div>
//                <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.25em]">No additional modules detected</p>
//             </div>
//           </div>

//           {/* ➡️ SIDEBAR: ACCOUNT SETTINGS (4/12) */}
//           <div className="lg:col-span-4 space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
//             <div className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden ring-1 ring-blue-50/30">
//               <div className="bg-slate-100 px-6 py-4 flex items-center gap-3">
//                 <Settings size={18} strokeWidth={2.5} className="text-blue-500" />
//                 <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Account Hub</h3>
//               </div>
              
//               <div className="px-6 space-y-1 pt-3 pb-3 divide-y divide-slate-50">
           
//                 <ProfileItem label="Contact Number" value="+91 9892580308" />
//                 <ProfileItem 
//                   label="Email" 
//                   value="sujithankare@goelectronix.com" 
//                   badge={
//                     <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md border border-emerald-100/50">
//                       <CheckCircle2 size={8} strokeWidth={4} />
//                       <span className="text-[7px] font-black uppercase">Verified</span>
//                     </div>
//                   }
//                 />
             
//               </div>

//             </div>

//             {/* COMPACT HELP BUTTON */}
//             <button className="w-full bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 hover:bg-slate-50 transition-all active:scale-95 cursor-pointer shadow-sm border-0">
//                 <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
//                    <HelpCircle size={18} />
//                 </div>
//                 <div className="text-left">
//                    <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest leading-none">Support</p>
//                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Direct Ticket</p>
//                 </div>
//             </button>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyProfile;