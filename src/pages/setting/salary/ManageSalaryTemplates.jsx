import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ArrowLeft, Plus, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

// 1. Memoized Skeleton Component for better performance
const TemplateSkeleton = () => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border border-slate-100 rounded-2xl bg-white gap-4 sm:gap-0 animate-pulse">
    <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
      {/* Icon Box Skeleton */}
      <div className="w-10 h-10 shrink-0 rounded-xl bg-slate-100" />
      <div className="space-y-2">
        {/* Title Skeleton */}
        <div className="h-4 w-32 bg-slate-100 rounded" />
        {/* Subtitle Skeleton */}
        <div className="h-3 w-48 bg-slate-50 rounded" />
      </div>
    </div>
    <div className="flex items-center gap-4 sm:gap-12 w-full sm:w-auto border-t border-slate-50 sm:border-0 pt-3 sm:pt-0 mt-1 sm:mt-0">
      {/* Badge Skeleton */}
      <div className="h-6 w-16 bg-slate-100 rounded-lg ml-auto sm:ml-0" />
      {/* Button Skeleton */}
      <div className="h-9 w-20 bg-slate-100 rounded-lg" />
    </div>
  </div>
);

const TemplateItem = React.memo(({ template, index, onEdit }) => (
  <div className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border border-slate-100 rounded-2xl hover:border-blue-200 transition-all bg-white gap-4 sm:gap-0">
    <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
      <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
        <span className="text-[11px] font-black text-blue-600">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="space-y-1">
        <h3 className="text-[14px] font-black !text-black !capitalize tracking-tight group-hover:text-blue-600 transition-colors leading-tight">
          {template.name}
        </h3>
        <p className="text-[11px] font-medium text-black capitalize tracking-widest leading-none">
          {template.description}
        </p>
      </div>
    </div>

    <div className="flex items-center gap-4 sm:gap-12 w-full sm:w-auto border-t border-slate-50 sm:border-0 pt-3 sm:pt-0 mt-1 sm:mt-0">
      {template.id === 1 && (
        <span className="mr-auto sm:mr-0 px-4 py-1.5 bg-slate-100 !text-slate-900 text-[9px] font-black rounded-lg capitalize tracking-widest border border-slate-200">
          Default
        </span>
      )}

      <button
        onClick={() => onEdit(template)}
        className="ml-auto sm:ml-0 text-[10px] font-black border border-blue-600 !text-blue-600 !bg-blue-50 uppercase tracking-widest hover:!bg-blue-100 px-6 sm:px-4 py-2 rounded-lg transition-all cursor-pointer shrink-0"
      >
        Edit
      </button>
    </div>
  </div>
));

const ManageSalaryTemplates = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleEdit = useCallback((template) => {
    navigate("/createsalarystruture", { state: { template } });
  }, [navigate]);

  useEffect(() => {
    let isMounted = true;
    const fetchTemplates = async () => {
      try {
        const response = await fetch("https://uathr.goelectronix.co.in/salary-templates");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        if (isMounted) setTemplates(data);
      } catch (error) {
        console.error("Error fetching salary templates:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchTemplates();
    return () => { isMounted = false; };
  }, []);

  const renderedTemplates = useMemo(() => {
    return templates.map((template, index) => (
      <TemplateItem 
        key={template.id} 
        template={template} 
        index={index} 
        onEdit={handleEdit} 
      />
    ));
  }, [templates, handleEdit]);

  return (
    <div className="min-h-screen bg-white font-['Inter'] pb-15 text-left relative">
      <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-4 sticky top-0 z-30 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-black hover:text-blue-600 transition-all group !bg-transparent border-0 outline-none cursor-pointer"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 text-black transition-transform" />
          <span className="text-[11px] font-black capitalize tracking-widest text-black leading-none">
            Back
          </span>
        </button>
      </div>

      <div className="mx-auto md:px-6 px-2 mt-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-10 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="space-y-1">
              <h1 className="md:text-xl text-lg font-black !text-black tracking-tighter !capitalize leading-none">
                Salary Structure Templates
              </h1>
              <p className="md:text-[10px] text-[10px] font-black text-slate-500 capitalize tracking-widest">
                Add and save templates of salary structures
              </p>
            </div>

            <button
              onClick={() => navigate("/createsalarystruture")}
              className="flex items-center justify-center gap-2 px-6 py-2.5 !bg-white !text-blue-600 border border-blue-600 rounded-lg shadow-sm hover:bg-blue-50 transition-all active:scale-95 cursor-pointer"
            >
              <Plus size={16} strokeWidth={3} />
              <span className="text-[11px] font-black capitalize tracking-widest">
                Create Template
              </span>
            </button>
          </div>

          <div className="space-y-4 pt-4 mb-4">
            {loading ? (
              // Render 3 skeleton items while loading
              <>
                <TemplateSkeleton />
                <TemplateSkeleton />
                <TemplateSkeleton />
              </>
            ) : (
              renderedTemplates
            )}
          </div>

          <div className="absolute -bottom-10 -right-10 opacity-[0.04] text-slate-900 pointer-events-none rotate-12">
            <Wallet size={280} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSalaryTemplates;
//*******************************************************working code phase 3 optimize the code 24/06/26******************************************** */
// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import { ArrowLeft, Plus, Wallet } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// // 1. Memoized Item Component to prevent unnecessary re-renders of the entire list
// const TemplateItem = React.memo(({ template, index, onEdit }) => (
//   <div className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border border-slate-100 rounded-2xl hover:border-blue-200 transition-all bg-white gap-4 sm:gap-0">
//     <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
//       <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
//         <span className="text-[11px] font-black text-blue-600">
//           {String(index + 1).padStart(2, "0")}
//         </span>
//       </div>

//       <div className="space-y-1">
//         <h3 className="text-[14px] font-black !text-black !capitalize tracking-tight group-hover:text-blue-600 transition-colors leading-tight">
//           {template.name}
//         </h3>
//         <p className="text-[11px] font-medium text-black capitalize tracking-widest leading-none">
//           {template.description}
//         </p>
//       </div>
//     </div>

//     <div className="flex items-center gap-4 sm:gap-12 w-full sm:w-auto border-t border-slate-50 sm:border-0 pt-3 sm:pt-0 mt-1 sm:mt-0">
//       {/* Logic preserved: ID 1 as default */}
//       {template.id === 1 && (
//         <span className="mr-auto sm:mr-0 px-4 py-1.5 bg-slate-100 !text-slate-900 text-[9px] font-black rounded-lg capitalize tracking-widest border border-slate-200">
//           Default
//         </span>
//       )}

//       <button
//         onClick={() => onEdit(template)}
//         className="ml-auto sm:ml-0 text-[10px] font-black border border-blue-600 !text-blue-600 !bg-blue-50 uppercase tracking-widest hover:!bg-blue-100 px-6 sm:px-4 py-2 rounded-lg transition-all cursor-pointer shrink-0"
//       >
//         Edit
//       </button>
//     </div>
//   </div>
// ));

// const ManageSalaryTemplates = () => {
//   const navigate = useNavigate();
//   const [templates, setTemplates] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // 2. Use useCallback for the edit function so it's not recreated on every render
//   const handleEdit = useCallback((template) => {
//     navigate("/createsalarystruture", { state: { template } });
//   }, [navigate]);

//   useEffect(() => {
//     let isMounted = true; // Cleanup flag to prevent memory leaks

//     const fetchTemplates = async () => {
//       try {
//         const response = await fetch("https://uathr.goelectronix.co.in/salary-templates");
//         if (!response.ok) throw new Error("Network response was not ok");
//         const data = await response.json();
        
//         if (isMounted) {
//           setTemplates(data);
//         }
//       } catch (error) {
//         console.error("Error fetching salary templates:", error);
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     };

//     fetchTemplates();
//     return () => { isMounted = false; };
//   }, []);

//   // 3. Memoize the list rendering
//   const renderedTemplates = useMemo(() => {
//     return templates.map((template, index) => (
//       <TemplateItem 
//         key={template.id} 
//         template={template} 
//         index={index} 
//         onEdit={handleEdit} 
//       />
//     ));
//   }, [templates, handleEdit]);

//   return (
//     <div className="min-h-screen bg-slate-50 font-['Inter'] pb-15 text-left relative">
//       <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-4 sticky top-0 z-30 shadow-sm">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-2 text-black hover:text-blue-600 transition-all group !bg-transparent border-0 outline-none cursor-pointer"
//         >
//           <ArrowLeft size={18} className="group-hover:-translate-x-1 text-black transition-transform" />
//           <span className="text-[11px] font-black capitalize tracking-widest text-black leading-none">
//             Back
//           </span>
//         </button>
//       </div>

//       <div className="mx-auto md:px-6 px-2 mt-4">
//         <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-10 relative overflow-hidden">
          
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
//             <div className="space-y-1">
//               <h1 className="md:text-xl text-lg font-black !text-black tracking-tighter !capitalize leading-none">
//                 Salary Structure Templates
//               </h1>
//               <p className="md:text-[10px] text-[10px] font-black text-slate-500 uppercase tracking-widest">
//                 Add and save templates of salary structures
//               </p>
//             </div>

//             <button
//               onClick={() => navigate("/createsalarystruture")}
//               className="flex items-center justify-center gap-2 px-6 py-2.5 !bg-white !text-blue-600 border border-blue-600 rounded-lg shadow-sm hover:bg-blue-50 transition-all active:scale-95 cursor-pointer"
//             >
//               <Plus size={16} strokeWidth={3} />
//               <span className="text-[11px] font-black capitalize tracking-widest">
//                 Create Template
//               </span>
//             </button>
//           </div>

//           <div className="space-y-4 pt-4 mb-4">
//             {loading ? (
//               <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">
//                 Loading Templates...
//               </div>
//             ) : (
//               renderedTemplates
//             )}
//           </div>

//           <div className="absolute -bottom-10 -right-10 opacity-[0.04] text-slate-900 pointer-events-none rotate-12">
//             <Wallet size={280} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManageSalaryTemplates;
//***********************************************************working code 2 with api integration 24/03/26********************************************* */
// import React, { useState, useEffect } from "react";
// import {
//   ArrowLeft,
//   Plus,
//   Wallet,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const ManageSalaryTemplates = () => {
//   const navigate = useNavigate();
//   const [templates, setTemplates] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // API Integration
//   useEffect(() => {
//     const fetchTemplates = async () => {
//       try {
//         const response = await fetch("https://uathr.goelectronix.co.in/salary-templates");
//         const data = await response.json();
//         setTemplates(data);
//       } catch (error) {
//         console.error("Error fetching salary templates:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTemplates();
//   }, []);

//   return (
//     <div className="min-h-screen bg-slate-50 font-['Inter'] pb-15 text-left relative">
//       {/* 🚀 HEADER */}
//       <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-4 sticky top-0 z-30 shadow-sm">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-2 text-black hover:text-blue-600 transition-all group !bg-transparent border-0 outline-none cursor-pointer"
//         >
//           <ArrowLeft
//             size={18}
//             className="group-hover:-translate-x-1 text-black transition-transform"
//           />
//           <span className="text-[11px] font-black capitalize tracking-widest text-black leading-none">
//             Back
//           </span>
//         </button>
//       </div>

//       <div className="mx-auto md:px-6 px-2 mt-4">
//         {/* 📑 MAIN CONTAINER CARD */}
//         <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-10 relative overflow-hidden">
          
//           {/* HEADER SECTION */}
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
//             <div className="space-y-1">
//               <h1 className="md:text-xl text-lg font-black !text-black tracking-tighter !capitalize leading-none">
//                 Salary Structure Templates
//               </h1>
//               <p className="md:text-[10px] text-[10px] font-black text-slate-500 uppercase tracking-widest">
//                 Add and save templates of salary structures
//               </p>
//             </div>

//             <button
//               onClick={() => navigate("/createsalarystruture")}
//               className="flex items-center justify-center gap-2 px-6 py-2.5 !bg-white !text-blue-600 border border-blue-600 rounded-lg shadow-sm hover:bg-blue-50 transition-all active:scale-95 cursor-pointer"
//             >
//               <Plus size={16} strokeWidth={3} />
//               <span className="text-[11px] font-black capitalize tracking-widest">
//                 Create Template
//               </span>
//             </button>
//           </div>

//           <div className="space-y-4 pt-4 mb-4">
//             {loading ? (
//               <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">
//                 Loading Templates...
//               </div>
//             ) : (
//               templates.map((template, index) => (
//                 <div
//                   key={template.id}
//                   className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border border-slate-100 rounded-2xl hover:border-blue-200 transition-all bg-white gap-4 sm:gap-0"
//                 >
//                   <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
//                     {/* Index Indicator */}
//                     <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
//                       <span className="text-[11px] font-black text-blue-600">
//                         {String(index + 1).padStart(2, '0')}
//                       </span>
//                     </div>

//                     <div className="space-y-1">
//                       <h3 className="text-[14px] font-black !text-black !capitalize tracking-tight group-hover:text-blue-600 transition-colors leading-tight">
//                         {template.name}
//                       </h3>
//                       {/* Integrated Description here */}
//                       <p className="text-[11px] font-medium text-black capitalize tracking-widest leading-none">
//                         {template.description}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-4 sm:gap-12 w-full sm:w-auto border-t border-slate-50 sm:border-0 pt-3 sm:pt-0 mt-1 sm:mt-0">
//                     {/* Placeholder for Default logic if API adds is_default flag later */}
//                     {template.id === 1 && (
//                       <span className="mr-auto sm:mr-0 px-4 py-1.5 bg-slate-100 !text-slate-900 text-[9px] font-black rounded-lg capitalize tracking-widest border border-slate-200">
//                         Default
//                       </span>
//                     )}

//                     <button
//                       onClick={() =>
//                         navigate("/createsalarystruture", { state: { template } })
//                       }
//                       className="ml-auto sm:ml-0 text-[10px] font-black border border-blue-600 !text-blue-600 !bg-blue-50 uppercase tracking-widest hover:!bg-blue-100 px-6 sm:px-4 py-2 rounded-lg transition-all cursor-pointer shrink-0"
//                     >
//                       Edit
//                     </button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           {/* Background Decorative Watermark */}
//           <div className="absolute -bottom-10 -right-10 opacity-[0.04] text-slate-900 pointer-events-none rotate-12">
//             <Wallet size={280} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManageSalaryTemplates;

//************************************************working phase 1 24/03/26******************************************************* */
// import React from "react";
// import {
//   ArrowLeft,
//   Plus,
//   ShieldCheck,
//   Cloud,
//   HelpCircle,
//   Wallet,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const ManageSalaryTemplates = () => {
//   const navigate = useNavigate();

//   // Data mapped directly from image_d76052.jpg
//   const templates = [
//     {
//       id: 1,
//       name: "Regular PT",
//       type: "Monthly Staff | Percentage wise",
//       isDefault: true,
//     },
//     {
//       id: 2,
//       name: "hourly",
//       type: "Hourly Staff | Percentage wise",
//       isDefault: true,
//     },
//     {
//       id: 3,
//       name: "Regular Non PT",
//       type: "Monthly Staff | Percentage wise",
//       isDefault: false,
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-white font-['Inter'] pb-15 text-left relative">
//       {/* 🚀 HEADER - */}
//       <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-4 sticky top-0 z-30 shadow-sm">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-2 text-black hover:text-blue-600 transition-all group !bg-transparent border-0 outline-none cursor-pointer"
//         >
//           <ArrowLeft
//             size={18}
//             className="group-hover:-translate-x-1 text-black transition-transform"
//           />
//           <span className="text-[11px] font-black capitalize tracking-widest text-black leading-none">
//             Back
//           </span>
//         </button>
//       </div>

//       <div className=" mx-auto md:px-6 px-2 mt-4">
//         {/* 📑 MAIN CONTAINER CARD - */}
//         <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-10 relative overflow-hidden">
//           {/* HEADER SECTION */}
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
//             <div className="space-y-1">
//               <h1 className="md:text-xl text-lg font-black !text-black tracking-tighter !capitalize leading-none">
//                 Salary Structure Templates
//               </h1>
//               <p className="md:text-[10px] text-[10px] font-bold text-black capitalize tracking-widest">
//                 Add and save templates of salary structures
//               </p>
//             </div>

//             <button
//               onClick={() => navigate("/createsalarystruture")}
//               className="flex items-center justify-center gap-2 px-6 py-2.5 !bg-white !text-blue-600 border border-blue-600 rounded-lg shadow-sm shadow-!blue-200 hover:bg-white transition-all active:scale-95 cursor-pointer"
//             >
//               <Plus size={16} strokeWidth={3} />
//               <span className="text-[11px] font-black capitalize tracking-widest">
//                 Create Template
//               </span>
//             </button>
//           </div>

//           <div className="space-y-4 pt-4 mb-4">
//             {templates.map((template, index) => (
//               <div
//                 key={template.id}
//                 /* 📱 MOBILE FIX: flex-col on mobile, flex-row on desktop */
//                 className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border border-slate-100 rounded-xl hover:border-blue-200 transition-all bg-white gap-4 sm:gap-0"
//               >
//                 <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
//                   {/* Index Indicator */}
//                   {/* 📱 MOBILE FIX: shrink-0 prevents the circle from turning into an oval on small screens */}
//                   <div className="w-8 h-8 shrink-0 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
//                     <span className="text-[11px] font-black text-blue-600">
//                       {index + 1}
//                     </span>
//                   </div>

//                   <div className="space-y-1">
//                     {/* 📱 MOBILE FIX: added leading-tight for long template names on mobile */}
//                     <h3 className="text-[14px] font-black !text-black !capitalize tracking-tight group-hover:text-blue-600 transition-colors leading-tight">
//                       {template.name}
//                     </h3>
//                     <p className="text-[11px] font-medium !text-black capitalize tracking-widest leading-none">
//                       {template.type}
//                     </p>
//                   </div>
//                 </div>

//                 {/* 📱 MOBILE FIX: Full width with a top border on mobile, reverts to standard flex on desktop */}
//                 <div className="flex items-center gap-4 sm:gap-12 w-full sm:w-auto border-t border-slate-50 sm:border-0 pt-3 sm:pt-0 mt-1 sm:mt-0">
//                   {/* Default Badge */}
//                   {template.isDefault && (
//                     /* 📱 MOBILE FIX: mr-auto pushes the badge to the far left on mobile */
//                     <span className="mr-auto sm:mr-0 px-4 py-1.5 bg-slate-200 !text-black text-[9px] font-black rounded-lg capitalize tracking-widest border border-slate-200/50">
//                       Default
//                     </span>
//                   )}

//                   <button
//                     onClick={() =>
//                       navigate("/createsalarystruture", { state: { template } })
//                     }
//                     /* 📱 MOBILE FIX: ml-auto pushes the button to the far right on mobile */
//                     className="ml-auto sm:ml-0 text-[11px] font-black border border-blue-600 !text-blue-600 !bg-blue-50 capitalize tracking-[0.15em] hover:!bg-blue-100 px-6 sm:px-4 py-2 rounded-lg transition-all cursor-pointer shrink-0"
//                   >
//                     Edit
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Background Decorative Watermark */}
//           <div className="absolute -bottom-10 -right-10 opacity-[0.03] text-slate-900 pointer-events-none rotate-12">
//             <Wallet size={280} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManageSalaryTemplates;
