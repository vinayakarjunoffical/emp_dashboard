import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { 
  Search, 
  ChevronRight, 
  Clock, 
  Building2, 
   ArrowLeft,
  ShieldCheck, 
  Bell, 
  CreditCard, 
  Users, 
  MapPin, 
  Settings2,
  HelpCircle,
  Sparkles
} from 'lucide-react';

const Setting = () => {
    const navigate = useNavigate(); // 2. Initialize navigate
  return (
    <div className="min-h-screen bg-white font-['Inter'] !rounded-xl pb-20">
      {/* 🚀 STICKY HEADER */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Back Action Node */}
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:!bg-slate-100 !text-black hover:!text-blue-600 rounded-lg transition-all !bg-transparent border-0 outline-none active:scale-90"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          
          <div>
            <h1 className="text-xl font-black !text-black tracking-tight !capitalize  leading-none">Settings</h1>
          </div>
        </div>

        {/* Action Node Placeholder */}
        
      </div>

      <div className=" mx-auto px-2 md:px-6 mt-8 space-y-8">
        
        {/* 🔍 SEARCH BAR SECTION */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-600 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="SEARCH SETTINGS"
            className="w-full bg-white h-10 pl-12 pr-4 rounded-xl border border-slate-200 shadow-sm outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 text-xs font-bold capitalize  tracking-wider transition-all placeholder:text-slate-500"
          />
        </div>

        {/* 🛠️ SETTINGS SECTION 1: ATTENDANCE */}
        <SettingsGroup title="Attendance Settings" icon={<Clock size={20} />}>
          <SettingItem 
            title="Attendance Templates" 
            desc="Configure attendance modes, late entry rules, and holiday integration."
            // badge="NEW"
          onClick={() => navigate('/attendancetemplate')}
          />
          <SettingItem 
            title="Attendance Geofence Settings" 
            desc="Manage office perimeter logs and mobile location tracking nodes."
              onClick={() => navigate('/geofence')}
          />
          <SettingItem 
            title="Shift Settings" 
            desc="Current Active: 4 Shifts Appended"
            onClick={() => navigate('/shift')}
          />
          {/* <SettingItem 
            title="Automation Rules" 
            desc="Track late entry, breaks, early out, and overtime sync logs."
          /> */}
        </SettingsGroup>

        {/* 🏢 SETTINGS SECTION 2: BUSINESS */}
        <SettingsGroup title="Business Settings" icon={<Building2 size={20} />}>
          <SettingItem 
            title="Holiday Policy" 
            onClick={() => navigate('/holidaypage')}
            desc="Manage company holidays and leave encashment ."
          />
          <SettingItem 
            title="Leave Policy" 
             onClick={() => navigate('/leavepolicy')}
            desc="Manage company leave Policy"
          />
            <SettingItem 
            title="Weekly Holidays" 
             onClick={() => navigate('/weeklyholiday')}
            desc="Manage company leave Policy"
          />
            <SettingItem 
            title="Manage Users" 
             onClick={() => navigate('/managerusers')}
            desc="Configure User type across your organisation"
          />
          <SettingItem 
            title="Roles & Permissions" 
             onClick={() => navigate('/rolespermissionpage')}
            desc="Security protocols for multi-admin deployment"
          />
           {/* <SettingItem 
            title="Manage Business Functions" 
            desc="Not added"
          />
           <SettingItem 
            title="Manage Documents" 
            desc="Publish organization specific documents for your staff"
          /> */}
        </SettingsGroup>

        {/* 🔐 SECURITY & SYSTEM */}
        <SettingsGroup title="Salary Setting" icon={<ShieldCheck size={20} />}>
          <SettingItem 
            title="Salary Calculation Logic" 
             onClick={() => navigate('/salarylogic')}
            desc="Trace all system modifications and user activity."
          />
          <SettingItem 
            title="Manage Salary Templates" 
             onClick={() => navigate('/managesalarytemplates')}
            desc="Templates"
          />
        </SettingsGroup>

        {/* 🔐 SECURITY & SYSTEM */}
        <SettingsGroup title="Account Settings" icon={<ShieldCheck size={20} />}>
          <SettingItem 
            title="My Profile" 
             onClick={() => navigate('/profile')}
            desc="User All Infromation "
          />
         
        </SettingsGroup>

      </div>


    </div>
  );
};

// 🛡️ REUSABLE GROUP WRAPPER
const SettingsGroup = ({ title, icon, children, highlight }) => (
  <div className={`space-y-3 ${highlight ? 'animate-in fade-in slide-in-from-bottom-2 duration-700' : ''}`}>
    <div className="flex items-center gap-2.5 ml-1">
      <div className={`p-2 rounded-xl border shadow-sm ${
        highlight 
          ? 'bg-indigo-600 text-white border-indigo-400' 
          : 'bg-blue-50 text-blue-600 border-blue-100'
      }`}>
        {icon}
      </div>
      <h2 className={`text-[12px] font-black !capitalize  tracking-[0.2em] ${
        highlight ? 'text-indigo-700' : '!text-black'
      }`}>
        {title}
      </h2>
    </div>
    
    <div className={`border rounded-2xl shadow-sm divide-y divide-slate-50 overflow-hidden ${
      highlight 
        ? 'bg-slate-900 border-slate-800' 
        : 'bg-white border-slate-100'
    }`}>
      {children}
    </div>
  </div>
);

// 📄 COMPACT ITEM COMPONENT
const SettingItem = ({ title, desc, badge, icon, onClick }) => (
  <div 
  onClick={onClick}
  className="group flex items-center justify-between p-4 hover:bg-slate-50/5 transition-all cursor-pointer relative">
    <div className="flex items-center gap-4 relative z-10">
      {/* Small Icon Branding Box */}
      <div className="p-2 bg-slate-50 rounded-lg text-black group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
        {icon || <Settings2 size={16} />}
      </div>
      
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <h3 className="text-[14px] font-black !capitalize  tracking-tight !text-black group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          {badge && (
            <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[7px] font-black rounded capitalize ">
              {badge}
            </span>
          )}
        </div>
        <p className="text-[11px] font-bold text-black font-medium capitalize  tracking-wide leading-none">
          {desc}
        </p>
      </div>
    </div>
    
    <div className="flex items-center gap-4 relative z-10">
      <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-black group-hover:bg-blue-600 group-hover:text-white transition-all">
        <ChevronRight size={14} strokeWidth={3} />
      </div>
    </div>

    {/* SECURITY SCANNER EFFECT (Only for Security Group) */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
  </div>
);

export default Setting;