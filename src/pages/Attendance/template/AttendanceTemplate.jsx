import React from 'react';
import { 
  ArrowLeft, 
  Plus, 
  MoreVertical, 
  Building2, 
  Users, 
  Search,
  ClipboardCheck,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AttendanceTemplate = () => {
  const navigate = useNavigate(); 
  const templates = [
    {
      id: 1,
      name: "Field Employees",
      owner: "Goelectronix Technologies Private Limited",
      staffCount: 14,
      isNew: false
    },
    {
      id: 2,
      name: "Regular Employees",
      owner: "Goelectronix Technologies Private Limited",
      staffCount: 25,
      isNew: false
    },
    {
      id: 3,
      name: "No attendance without punch out",
      owner: "Goelectronix Technologies Private Limited",
      staffCount: 0,
      isNew: false
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter'] pb-10">
      {/* 🚀 NAV HEADER */}
      <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)} 
            className="p-2 hover:!bg-slate-50 rounded-xl !text-slate-400 border !broder-blue-500 transition-all border !bg-transparent hover:!border-slate-100"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Template</h2>
          </div>
        </div>
      </div>

      <div className="mx-auto px-6 mt-8">
        {/* 📑 PAGE TITLE & ACTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white text-blue-500 rounded-lg border border-blue-500 shadow-sm shadow-blue-200">
                <ClipboardCheck size={20} strokeWidth={2.5} />
              </div>
             <div className='gap-2'>
               <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Attendance Templates</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] max-w-md">
               attendance modes, late entry, attendance on holiday and More.
            </p>
             </div>
            </div>
            
          </div>

          <button
            onClick={() => navigate('/createattendancetemplate')}
            className="group flex items-center gap-2 px-5 py-3 !bg-white !text-blue-600 border-2 !border-blue-600 rounded-2xl shadow-sm hover:!bg-white hover:text-white transition-all active:scale-95"
          >
            <Plus size={16} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
            <span className="text-[11px] font-black uppercase tracking-widest">New Template</span>
          </button>
        </div>

        {/* 📂 TEMPLATE CARDS LIST */}
        <div className="grid grid-cols-1 gap-3">
          {templates.map((item) => (
            <div 
              key={item.id} 
              onClick={() => navigate('/createattendancetemplate', { state: { templateData: item } })}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-400 transition-all group relative overflow-hidden cursor-pointer"
            >
              {/* Subtle Background Watermark */}
              <div className="absolute -bottom-6 -right-6 text-slate-100 opacity-[0.4] group-hover:text-blue-50 transition-colors -rotate-12">
                <ClipboardCheck size={120} />
              </div>

              <div className="flex items-start justify-between relative z-10">
                <div className="space-y-4 w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-blue-600 rounded-full group-hover:h-8 transition-all" />
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </h3>
                    {item.isNew && (
                      <span className="px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black rounded-md tracking-widest shadow-sm shadow-emerald-200">NEW</span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-y-3 gap-x-8">
                    <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                       <MetaInfo icon={<Building2 size={12} />} label="Created by" value={item.owner} />
                    </div>
                    
                    <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                       <MetaInfo icon={<Building2 size={12} />} label="Updated by" value={item.owner} />
                    </div>

                    <div className="bg-blue-50/50 px-3 py-2 rounded-xl border border-blue-100 flex items-center gap-4">
                      <MetaInfo 
                        icon={<Users size={12} />} 
                        label="Assigned Staff" 
                        value={`${item.staffCount} Staffs`} 
                        isLink 
                      />
                      <ChevronRight size={12} className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                <button className="p-2 !text-slate-300 hover:!text-slate-900 hover:!bg-slate-50 !bg-transparent rounded-xl transition-all border-0 outline-none">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 🛡️ REUSABLE META COMPONENT - Upgraded Typography
const MetaInfo = ({ icon, label, value, isLink }) => (
  <div className="flex items-center gap-2.5">
    <div className={`p-1.5 rounded-lg ${isLink ? 'bg-blue-100 text-blue-600' : 'bg-white text-slate-400 shadow-sm border border-slate-100'}`}>
      {icon}
    </div>
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none mb-1">
        {label}
      </p>
      <p className={`text-[10px] font-bold uppercase leading-none ${isLink ? 'text-blue-600 underline cursor-pointer' : 'text-slate-600'}`}>
        {value}
      </p>
    </div>
  </div>
);

export default AttendanceTemplate;
// import React from 'react';
// import { 
//   ArrowLeft, 
//   Plus, 
//   MoreVertical, 
//   Building2, 
//   Users, 
//   Search
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const AttendanceTemplate = () => {
//    const navigate = useNavigate(); // 2. Initialize navigate
//   const templates = [
//     {
//       id: 1,
//       name: "Field Employees",
//       owner: "Goelectronix Technologies Private Limited",
//       staffCount: 14,
//       isNew: true
//     },
//     {
//       id: 2,
//       name: "Regular Employees",
//       owner: "Goelectronix Technologies Private Limited",
//       staffCount: 25,
//       isNew: false
//     },
//     {
//       id: 3,
//       name: "No attendance without punch out",
//       owner: "Goelectronix Technologies Private Limited",
//       staffCount: 0,
//       isNew: false
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-slate-50 rounded-xl font-['Inter'] pb-10">
//       {/* 🚀 NAV HEADER - Padding reduced to py-2 */}
//       <div className="bg-white border-b border-slate-100 px-4 py-2 flex items-center gap-3">
//         <button
//         onClick={() => navigate(-1)} 
//         className="p-1.5 hover:!bg-slate-50 rounded-full !text-slate-400 transition-all !bg-transparent border-0 outline-none">
//           <ArrowLeft size={18} />
//         </button>
//         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Back</span>
//       </div>

//       <div className="mx-auto px-4 mt-4">
//         {/* 📑 PAGE TITLE & ACTION - mb-10 reduced to mb-4 */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
//           <div className="space-y-0">
//             <div className="flex items-center gap-2">
//               <h1 className="text-lg font-black text-slate-900 tracking-tight uppercase">Attendance Templates</h1>
//               {/* <span className="px-1.5 py-0.5 bg-blue-600 text-white text-[7px] font-black rounded-md tracking-widest">BETA</span> */}
//             </div>
//             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
//               Configure attendance modes, late entry ,attendance on holiday and More.
//             </p>
//           </div>

//           <button
//                  onClick={() => navigate('/createattendancetemplate')}
//           className="flex items-center gap-2 px-4 py-2 !bg-white !text-blue-500 border border-blue-500 rounded-xl shadow-sm shadow-blue-600/20 hover:scale-[1.01] active:scale-95 transition-all">
//             <Plus size={16} strokeWidth={3} />
//             <span className="text-[10px] font-black uppercase tracking-widest">New Template</span>
//           </button>
//         </div>

//         {/* 🔍 SEARCH FILTERS - mb-6 reduced to mb-3, h-12 to h-10 */}
        

//         {/* 📂 TEMPLATE CARDS LIST - space-y-4 reduced to space-y-2 */}
//         <div className="space-y-2">
//           {templates.map((item) => (
//             <div 
//               // key={item.id} 
//               key={item.id} 
//       onClick={() => navigate('/createattendancetemplate', { state: { templateData: item } })}
//               className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group relative overflow-hidden"
//             >
//               <div className="flex items-start justify-between relative z-10">
//                 <div className="space-y-2">
//                   <div className="flex items-center gap-2">
//                     <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
//                       {item.name}
//                     </h3>
//                     {/* {item.isNew && (
//                       <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[6px] font-black rounded uppercase">NEW</span>
//                     )} */}
//                   </div>

//                   <div className="flex flex-wrap items-center gap-y-1 gap-x-4">
//                     <MetaInfo icon={<Building2 size={10} />} label="Created by" value={item.owner} />
//                     <div className="h-3 w-[1px] bg-slate-200 hidden md:block" />
//                      <MetaInfo icon={<Building2 size={10} />} label="Updated by" value={item.owner} />
//                      <div className="h-3 w-[1px] bg-slate-200 hidden md:block" />
//                     <MetaInfo 
//                       icon={<Users size={10} />} 
//                       label="Assigned Staff" 
//                       value={`${item.staffCount} Staffs`} 
//                       isLink 
//                     />
//                   </div>
//                 </div>

//                 <button className="p-1 !text-slate-300 hover:!text-slate-900 !bg-transparent border-0 outline-none">
//                   <MoreVertical size={18} />
//                 </button>
//               </div>

//               <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-blue-600/0 group-hover:bg-blue-600/10 transition-all" />
//             </div>
//           ))}
//         </div>
//       </div>

     
//     </div>
//   );
// };

// // 🛡️ REUSABLE META COMPONENT
// const MetaInfo = ({ icon, label, value, isLink }) => (
//   <div className="flex items-center gap-1.5">
//     <span className="text-slate-300">{icon}</span>
//     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">
//       {label}: <span className={`${isLink ? 'text-blue-600 underline cursor-pointer' : 'text-slate-500'}`}>{value}</span>
//     </p>
//   </div>
// );

// export default AttendanceTemplate;