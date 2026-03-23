import React ,{useState} from 'react';
import { 
  ArrowLeft, 
  Plus, 
  MoreVertical, 
  Building2, 
  Users, 
  X,
  Filter,
  Pencil,
  PlusCircle,
  Copy,
  Trash2,
  ChevronUp,
  User,
  Search,
  ClipboardCheck,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AttendanceTemplate = () => {
  const navigate = useNavigate(); 
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null); // id of the active template

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

    const handleStaffClick = (item) => {
   
    setIsDrawerOpen(true);
  };

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

      <div className="mx-auto px-2 md:px-6 mt-4">
        {/* 📑 PAGE TITLE & ACTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white text-blue-500 rounded-lg border border-blue-500 shadow-sm shadow-blue-200">
                <ClipboardCheck size={20} strokeWidth={2.5} />
              </div>
             <div className='gap-2'>
               <h1 className="md:text-2xl text-lg font-black text-slate-900 tracking-tighter uppercase">Attendance Templates</h1>
              <p className="md:text-[10px] text-[8px] font-bold text-slate-400 uppercase tracking-[0.15em] max-w-md">
               attendance modes, late entry, attendance on holiday and More.
            </p>
             </div>
            </div>
            
          </div>

          <button
            onClick={() => navigate('/createattendancetemplate')}
            className="group flex items-center justify-center gap-2 px-5 py-3 !bg-white !text-blue-600 border-2 !border-blue-600 rounded-xl shadow-sm hover:!bg-white hover:text-white transition-all active:scale-95"
          >
            <Plus size={16} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
            <span className="text-[11px] font-black uppercase tracking-widest">New Template</span>
          </button>
        </div>

        {/* 📂 TEMPLATE CARDS LIST */}
        {/* <div className="grid grid-cols-1 gap-3">
          {templates.map((item) => (
            <div 
              key={item.id} 
              // onClick={() => navigate('/createattendancetemplate', { state: { templateData: item } })}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-400 transition-all group relative overflow-hidden "
            >
             
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

                    <div
                    onClick={(e) => {
                e.stopPropagation(); // Prevents card conflict
                handleStaffClick(item); 
              }}
                    className="bg-blue-50/50 px-3 py-2 cursor-pointer rounded-xl border border-blue-100 flex items-center gap-4">
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

               
          <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenu(activeMenu === item.id ? null : item.id);
                    }}
                    className={`p-2 rounded-xl transition-all border-0 outline-none bg-transparent ${
                      activeMenu === item.id ? "text-blue-600 bg-blue-50" : "text-slate-300 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <MoreVertical size={20} />
                  </button>

                  {activeMenu === item.id && (
                    <>
                      <div className="fixed inset-0 z-100" onClick={() => setActiveMenu(null)} />
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl z-100 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                        <div className="p-2 space-y-0.5">
                          <MenuOption icon={<Pencil size={14} />} label="Edit Template" onClick={() => navigate('/createattendancetemplate', { state: { templateData: item } })} />
                          <MenuOption icon={<Users size={14} />} label="Assign Staff" onClick={() => handleStaffNodeClick(item)} />
                          <MenuOption icon={<PlusCircle size={14} />} label="Manage Rules" onClick={() => setActiveMenu(null)} />
                          <MenuOption icon={<Copy size={14} />} label="Clone Template" onClick={() => setActiveMenu(null)} />
                          <div className="h-px bg-slate-100 my-1 mx-2" />
                          <MenuOption icon={<Trash2 size={14} />} label="Delete Node" variant="danger" onClick={() => setActiveMenu(null)} />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div> */}

        {/* 📂 TEMPLATE CARDS LIST */}
{/* 📂 TEMPLATE CARDS LIST */}
<div className="grid grid-cols-1 gap-3">
  {templates.map((item) => (
    <div 
      key={item.id} 
      /* 🔥 FIX 1: Add conditional z-index to the parent card. 
         When the menu is open, this card must be higher than all other cards.
      */
      className={`bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-400 transition-all group relative ${
        activeMenu === item.id ? "z-[60]" : "z-10"
      }`} 
    >
     {/* 🧩 Watermark (Clipped manually via rounded corners if needed, but now allows menu overlap) */}
      <div className="absolute -bottom-6 z-0 -right-6 text-slate-100 opacity-[0.4] group-hover:text-blue-50 transition-colors -rotate-12 pointer-events-none">
        <ClipboardCheck size={120} />
      </div>

      <div className="flex items-start justify-between relative z-10">
         <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full group-hover:h-8 transition-all" />
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{item.name}</h3>
          </div>

          <div className="flex flex-wrap items-center gap-y-3 gap-x-8">
            <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
               <MetaInfo icon={<Building2 size={12} />} label="Created by" value={item.owner} />
            </div>
            <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
               <MetaInfo icon={<Building2 size={12} />} label="Updated by" value={item.owner} />
            </div>
            <div 
              onClick={(e) => {
                e.stopPropagation();
                handleStaffClick(item); 
              }}
              className="bg-blue-50/50 px-3 py-2 cursor-pointer rounded-xl border border-blue-100 flex items-center gap-4 hover:bg-blue-100 transition-all"
            >
              <MetaInfo icon={<Users size={12} />} label="Assigned Staff" value={`${item.staffCount} Staffs`} isLink />
              <ChevronRight size={12} className="text-blue-400" />
            </div>
          </div>
        </div>

        {/* ⚙️ ACTION DROPDOWN NODE */}
        <div className="relative flex items-center justify-center">
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === item.id ? null : item.id);
            }}
            className={`p-2 rounded-xl transition-all border-0 !bg-transparent outline-none flex items-center justify-center ${
              activeMenu === item.id 
                ? "!text-blue-600 !bg-blue-50 ring-1 ring-blue-100 shadow-inner" 
                : "!text-slate-300 hover:!text-slate-900 hover:!bg-slate-50"
            }`}
          >
            <MoreVertical size={20} />
          </button>

          {activeMenu === item.id && (
            <>
              {/* 🔥 FIX 2: The backdrop should have a slightly lower Z 
                 than the dropdown but higher than the rest of the app.
              */}
              <div 
                className="fixed inset-0 z-[110] cursor-default bg-transparent"  
                onClick={(e) => {
                   e.stopPropagation();
                   setActiveMenu(null);
                }} 
              />
              
              {/* 🔥 FIX 3: Ensure the dropdown has the highest Z.
                 Also, change 'top-full' to 'top-12' to prevent it from 
                 being too far down if the button is small.
              */}
              <div className="absolute right-0 top-12 w-52 bg-white border border-slate-200 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[120] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ring-1 ring-slate-950/5">
                <div className="p-2 space-y-0.5 text-left">
                  <MenuOption 
                    icon={<Pencil size={14} />} 
                    label="Edit" 
                    onClick={() => navigate('/createattendancetemplate', { state: { templateData: item } })} 
                  />
                  <MenuOption 
            icon={<Users size={14} />} 
            label="Assign Staff" 
            onClick={() => handleStaffClick(item)} 
          />
          <MenuOption 
            icon={<PlusCircle size={14} />} 
            label="Manage Rules" 
            onClick={() => setActiveMenu(null)} 
          />
          <MenuOption 
            icon={<Copy size={14} />} 
            label="Clone Template" 
            onClick={() => setActiveMenu(null)} 
          />
          
          <div className="h-px bg-slate-100 my-1 mx-2" />
          
          <MenuOption 
            icon={<Trash2 size={14} />} 
            label="Delete" 
            variant="danger" 
            onClick={() => setActiveMenu(null)} 
          />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  ))}
</div>
      </div>
      {/* 🛡️ STAFF LIST DRAWER */}
      <StaffListDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        templateName={activeTemplate?.name}
      />
      
      {/* Backdrop */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[70] transition-opacity" onClick={() => setIsDrawerOpen(false)} />
      )}

    </div>
    
  );
};


const StaffListDrawer = ({ isOpen, onClose }) => {
  const [subTab, setSubTab] = useState('unselected');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [openSections, setOpenSections] = useState({
    salary: false,
    shift: false,
    dept: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const selectedStaffData = [
    { id: '#MUMGE78', name: "Dhaval Mehta", location: "Goelectronix Technologies Private Limited" },
    { id: '#IN27CD056', name: "Hemlata Tandure", location: "Goelectronix Technologies Private Limited" }
  ];

  const unselectedStaffData = [
    { id: '#MUMGE84', name: "indresh bhai", location: "Goelectronix Technologies Private Limited" },
    { id: '#MUMGE82', name: "Nilesh Khanderao Kuwar", location: "Goelectronix Technologies Private Limited" },
    { id: '#IN27CD064', name: "Pratik Uttam Hankare", location: "Goelectronix Technologies Private Limited" },
    { id: '#IN27CD052', name: "Sandip Satpute", location: "Goelectronix Technologies Private Limited" }
  ];

  // 2. 🔥 Handle Master Checkbox Toggle
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = currentStaffList.map(s => s.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  // 3. 🔥 Handle Individual Checkbox Toggle
  const handleSelectIndividual = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const currentStaffList = subTab === 'selected' ? selectedStaffData : unselectedStaffData;

  return (
    <>
      <div className={`fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-80 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full relative">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-start">
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Staff List</h2>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Check staff assigned and unassigned to this template</p>
            </div>
            <button onClick={onClose} className="p-2 hover:!bg-slate-50 rounded-xl !text-slate-400 !bg-transparent transition-all"><X size={20} /></button>
          </div>

          {/* Sub-Tabs */}
          <div className="px-6 py-4">
            <div className="flex p-1 bg-slate-100 rounded-xl w-fit border border-slate-200/60 shadow-inner">
              {['selected', 'unselected'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSubTab(tab)}
                  className={`relative px-6 py-2 rounded-lg text-[10px] font-black !bg-transparent uppercase tracking-widest transition-all duration-300 ${
                    subTab === tab ? '!bg-white shadow-md !text-blue-600 ring-1 ring-slate-200/50' : '!text-slate-400 hover:!text-slate-600 hover:bg-slate-200/50'
                  }`}
                >
                  {tab === 'selected' ? `Selected Staff (${selectedStaffData.length})` : `Unselected Staff (${unselectedStaffData.length})`}
                  {subTab === tab && <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border-2 border-white animate-pulse" />}
                </button>
              ))}
            </div>
          </div>

          {/* Search & Filter */}
          <div className="px-6 mb-4 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
              <input type="text" placeholder="Search by name or staff ID" className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] outline-none focus:border-blue-400" />
            </div>
            <button onClick={() => setIsFilterOpen(true)} className="flex !bg-transparent items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl !text-blue-600 text-[10px] font-black uppercase tracking-widest hover:!bg-slate-50 transition-colors">
              <Filter size={14} /> Filter
            </button>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-y-auto px-6">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="py-3 px-1">
                    {/* 🔥 MASTER CHECKBOX */}
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-slate-300 accent-blue-600 cursor-pointer" 
                      onChange={handleSelectAll}
                      checked={currentStaffList.length > 0 && selectedIds.length === currentStaffList.length}
                    />
                  </th>
                  <th className="text-[9px] font-black text-slate-400 uppercase tracking-widest py-3">Name</th>
                  <th className="text-[9px] font-black text-slate-400 uppercase tracking-widest py-3">Staff ID</th>
                  <th className="text-[9px] font-black text-slate-400 uppercase tracking-widest py-3">Base Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentStaffList.map((staff, idx) => (
                  <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-1">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-slate-300 accent-blue-600 cursor-pointer" 
                        checked={selectedIds.includes(staff.id)}
                        onChange={() => handleSelectIndividual(staff.id)}
                      />
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400"><User size={16} /></div>
                        <span className="text-[11px] font-bold text-slate-700">{staff.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-[10px] font-black text-blue-600 tracking-tighter uppercase">{staff.id}</td>
                    <td className="py-3 text-[10px] font-medium text-slate-500 max-w-[150px] truncate">{staff.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/50">
            <button className={`w-full py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-sm ${subTab === 'selected' ? '!bg-blue-50 !text-blue-600 border border-blue-500 hover:!bg-white hover:!text-blue-500' : '!bg-white !text-blue-500 border border-blue-500 hover:!bg-white'}`}>
              {subTab === 'selected' ? 'Remove from Selected' : 'Move to Selected'}
            </button>
          </div>
        </div>
      </div>

      {/* 🔍 FILTER MODAL (Outside the Drawer's sliding div for full screen centering) */}
      {/* {isFilterOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-500/50  " onClick={() => setIsFilterOpen(false)} />
          <div className="relative bg-white w-full max-w-[440px] rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Filter By</h3>
                <div className="h-1 w-8 bg-blue-600 rounded-full mt-1" />
              </div>
              <button onClick={() => setIsFilterOpen(false)} className="p-2.5 bg-slate-50 hover:bg-red-50 hover:text-red-500 rounded-2xl text-slate-400 transition-all"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto text-left">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Salary Type</label>
                <div className="relative">
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-[12px] font-bold text-slate-700 appearance-none outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all">
                    <option>Select salary type</option>
                    <option>Monthly</option><option>Daily</option><option>Hourly</option>
                  </select>
                  <ChevronUp className="absolute right-5 top-1/2 -translate-y-1/2 rotate-180 text-slate-300 pointer-events-none" size={16} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Available Shifts</label>
                <div className="border border-slate-100 rounded-[24px] overflow-hidden bg-white shadow-sm ring-1 ring-slate-200/50">
                  <div className="px-5 py-4 bg-slate-50 flex justify-between items-center border-b border-slate-100">
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Shift Options</span>
                  </div>
                  <div className="p-3 space-y-1 bg-white">
                    {['Select All', 'IT Staff', '9:30 to 6:30', '11 to 8', '10 to 7'].map((shift, i) => (
                      <label key={i} className="flex items-center gap-4 p-3 hover:bg-blue-50/50 rounded-xl cursor-pointer transition-all group border border-transparent hover:border-blue-100">
                        <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-300 text-blue-600" />
                        <span className="text-[12px] font-bold text-slate-600 group-hover:text-blue-700">{shift}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Department</label>
                <div className="relative">
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-[12px] font-bold text-slate-700 appearance-none outline-none">
                    <option>Select department</option>
                    <option>Technology</option><option>Operations</option><option>Sales</option>
                  </select>
                  <ChevronUp className="absolute right-5 top-1/2 -translate-y-1/2 rotate-180 text-slate-300 pointer-events-none" size={16} />
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50/80 border-t border-slate-100 flex gap-4">
              <button onClick={() => setIsFilterOpen(false)} className="flex-1 py-4 border-2 border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:bg-white hover:text-slate-600 transition-all">Reset</button>
              <button onClick={() => setIsFilterOpen(false)} className="flex-1 py-4 bg-blue-600 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-blue-200 transition-all">Apply Filters</button>
            </div>
          </div>
        </div>
      )} */}
      {/* 🔍 COMPACT FILTER MODAL */}
{isFilterOpen && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-2">
    {/* Global Backdrop */}
    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setIsFilterOpen(false)} />
    
    <div className="relative bg-white w-full max-w-[360px] rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-300">
      {/* 🚀 Header */}
      <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center bg-white">
        <div>
          <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-tighter">Filter By</h3>
          <div className="h-0.5 w-6 bg-blue-600 rounded-full mt-0.5" />
        </div>
        <button 
          onClick={() => setIsFilterOpen(false)} 
          className="p-1.5 !bg-slate-50 hover:!bg-slate-50 hover:!text-slate-500 rounded-lg !text-slate-400 transition-all active:scale-90"
        >
          <X size={16} />
        </button>
      </div>

      <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto text-left custom-scrollbar">
        
        {/* Accordion Section Component Wrapper */}
        {[
          { id: 'salary', label: 'Salary Type', options: ['Monthly', 'Daily', 'Work Basis', 'Hourly'], color: 'blue' },
          { id: 'shift', label: 'Available Shifts', options: ['IT Staff', '9:30 to 6:30', '11 to 8'], color: 'blue' },
          { id: 'dept', label: 'Department', options: ['Finance', 'Hr & Admin', 'IT', 'Sales'], color: 'emerald' }
        ].map((section) => (
          <div key={section.id} className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-0.5">{section.label}</label>
            <div className={`border rounded-xl overflow-hidden transition-all duration-300 bg-white shadow-sm ${openSections === section.id ? 'ring-2 ring-blue-500/10 border-blue-200' : 'border-slate-100 ring-1 ring-slate-200/50'}`}>
               {/* 🖱️ Dropdown Header (Toggle Logic: sets active ID, closing others) */}
               <div 
                 onClick={() => setOpenSections(openSections === section.id ? null : section.id)}
                 className={`px-3 py-2 flex justify-between items-center cursor-pointer transition-colors ${openSections === section.id ? 'bg-blue-50/30' : 'bg-slate-50/50 hover:bg-slate-50'}`}
               >
                  <span className={`text-[10px] font-bold ${openSections === section.id ? 'text-blue-600' : 'text-slate-500'}`}>
                    Select {section.label}
                  </span>
                  <ChevronUp 
                    size={14} 
                    className={`transition-transform duration-500 ${openSections === section.id ? 'text-blue-500 rotate-0' : 'text-slate-400 rotate-180'}`} 
                  />
               </div>

               {/* 📂 Dropdown Content (Only shows if this section is the active ID) */}
               {openSections === section.id && (
                 <div className="p-1 space-y-0.5 max-h-48 overflow-y-auto animate-in slide-in-from-top-2 duration-300">
                    {/* SECTION SELECT ALL */}
                    <label className={`flex items-center gap-x-5 px-3 py-2 rounded-lg cursor-pointer border mb-1 group transition-all ${section.color === 'emerald' ? 'bg-emerald-50/40 border-emerald-100/50' : 'bg-blue-50/40 border-blue-100/50'}`}>
                      <input 
                        type="checkbox" 
                        onChange={(e) => {
                          const checkboxes = document.querySelectorAll(`.${section.id}-checkbox`);
                          checkboxes.forEach(cb => cb.checked = e.target.checked);
                        }}
                        className={`w-4 h-4 rounded mr-2 focus:ring-0 cursor-pointer ${section.color === 'emerald' ? 'border-emerald-300 text-emerald-600' : 'border-blue-300 text-blue-600'}`} 
                      />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${section.color === 'emerald' ? 'text-emerald-700' : 'text-blue-700'}`}>
                        Select All {section.id === 'dept' ? 'Depts' : section.id}
                      </span>
                    </label>

                    {/* INDIVIDUAL OPTIONS */}
                    {section.options.map((option) => (
                      <label key={option} className="flex items-center gap-x-5 px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer group transition-all">
                        <input 
                          type="checkbox" 
                          className={`${section.id}-checkbox w-4 h-4 mr-2 rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer transition-all`} 
                        />
                        <span className="text-[11px] font-bold text-slate-600 group-hover:text-slate-900 tracking-wide">
                          {option}
                        </span>
                      </label>
                    ))}
                 </div>
               )}
            </div>
          </div>
        ))}
      </div>

      {/* 🛡️ Footer Actions */}
      <div className="p-3 flex justify-end bg-slate-50 border-t border-slate-100 gap-2">
        {/* <button 
          onClick={() => setIsFilterOpen(false)}
          className="flex-1 py-2.5 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white hover:text-slate-600 transition-all active:scale-95"
        >
          Clear Filter
        </button> */}
        <button 
          onClick={() => setIsFilterOpen(false)}
          className="flex  py-2.5 px-5 !bg-white border border-blue-500 rounded-lg  text-[10px] font-black uppercase tracking-widest !text-blue-500 hover:!bg-white shadow-sm shadow-blue-200 active:scale-95 transition-all"
        >
          Apply Filter
        </button>
      </div>
    </div>
  </div>
)}

    </>
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

const MenuOption = ({ icon, label, onClick, variant = 'default' }) => (
  <button
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group !bg-transparent border-0 outline-none ${
      variant === 'danger' 
        ? 'hover:bg-red-50 text-red-400 hover:text-red-600' 
        : 'hover:bg-slate-50 text-slate-400 hover:text-blue-600'
    }`}
  >
    <span className="shrink-0">{icon}</span>
    <span className={`text-[9px] font-black uppercase tracking-[0.15em] ${
      variant === 'danger' ? 'text-red-500/70 group-hover:text-red-600' : 'text-slate-500 group-hover:text-slate-900'
    }`}>
      {label}
    </span>
  </button>
);

export default AttendanceTemplate;

//******************************************working code phase 1 17/03/26****************************************************** */
// import React from 'react';
// import { 
//   ArrowLeft, 
//   Plus, 
//   MoreVertical, 
//   Building2, 
//   Users, 
//   Search,
//   ClipboardCheck,
//   ChevronRight
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const AttendanceTemplate = () => {
//   const navigate = useNavigate(); 
//   const templates = [
//     {
//       id: 1,
//       name: "Field Employees",
//       owner: "Goelectronix Technologies Private Limited",
//       staffCount: 14,
//       isNew: false
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
//     <div className="min-h-screen bg-slate-50 font-['Inter'] pb-10">
//       {/* 🚀 NAV HEADER */}
//       <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => navigate(-1)} 
//             className="p-2 hover:!bg-slate-50 rounded-xl !text-slate-400 border !broder-blue-500 transition-all border !bg-transparent hover:!border-slate-100"
//           >
//             <ArrowLeft size={18} />
//           </button>
//           <div>
            
//             <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Template</h2>
//           </div>
//         </div>
//       </div>

//       <div className="mx-auto px-6 mt-8">
//         {/* 📑 PAGE TITLE & ACTION */}
//         <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
//           <div className="space-y-1">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-white text-blue-500 rounded-lg border border-blue-500 shadow-sm shadow-blue-200">
//                 <ClipboardCheck size={20} strokeWidth={2.5} />
//               </div>
//              <div className='gap-2'>
//                <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Attendance Templates</h1>
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] max-w-md">
//                attendance modes, late entry, attendance on holiday and More.
//             </p>
//              </div>
//             </div>
            
//           </div>

//           <button
//             onClick={() => navigate('/createattendancetemplate')}
//             className="group flex items-center gap-2 px-5 py-3 !bg-white !text-blue-600 border-2 !border-blue-600 rounded-2xl shadow-sm hover:!bg-white hover:text-white transition-all active:scale-95"
//           >
//             <Plus size={16} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
//             <span className="text-[11px] font-black uppercase tracking-widest">New Template</span>
//           </button>
//         </div>

//         {/* 📂 TEMPLATE CARDS LIST */}
//         <div className="grid grid-cols-1 gap-3">
//           {templates.map((item) => (
//             <div 
//               key={item.id} 
//               // onClick={() => navigate('/createattendancetemplate', { state: { templateData: item } })}
//               className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-400 transition-all group relative overflow-hidden "
//             >
//               {/* Subtle Background Watermark */}
//               <div className="absolute -bottom-6 -right-6 text-slate-100 opacity-[0.4] group-hover:text-blue-50 transition-colors -rotate-12">
//                 <ClipboardCheck size={120} />
//               </div>

//               <div className="flex items-start justify-between relative z-10">
//                 <div className="space-y-4 w-full">
//                   <div className="flex items-center gap-3">
//                     <div className="w-1.5 h-6 bg-blue-600 rounded-full group-hover:h-8 transition-all" />
//                     <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
//                       {item.name}
//                     </h3>
//                     {item.isNew && (
//                       <span className="px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black rounded-md tracking-widest shadow-sm shadow-emerald-200">NEW</span>
//                     )}
//                   </div>

//                   <div className="flex flex-wrap items-center gap-y-3 gap-x-8">
//                     <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
//                        <MetaInfo icon={<Building2 size={12} />} label="Created by" value={item.owner} />
//                     </div>
                    
//                     <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
//                        <MetaInfo icon={<Building2 size={12} />} label="Updated by" value={item.owner} />
//                     </div>

//                     <div className="bg-blue-50/50 px-3 py-2 rounded-xl border border-blue-100 flex items-center gap-4">
//                       <MetaInfo 
//                         icon={<Users size={12} />} 
//                         label="Assigned Staff" 
//                         value={`${item.staffCount} Staffs`} 
//                         isLink 
//                       />
//                       <ChevronRight size={12} className="text-blue-400 group-hover:translate-x-1 transition-transform" />
//                     </div>
//                   </div>
//                 </div>

//                 <button className="p-2 !text-slate-300 hover:!text-slate-900 hover:!bg-slate-50 !bg-transparent rounded-xl transition-all border-0 outline-none">
//                   <MoreVertical size={20} />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// // 🛡️ REUSABLE META COMPONENT - Upgraded Typography
// const MetaInfo = ({ icon, label, value, isLink }) => (
//   <div className="flex items-center gap-2.5">
//     <div className={`p-1.5 rounded-lg ${isLink ? 'bg-blue-100 text-blue-600' : 'bg-white text-slate-400 shadow-sm border border-slate-100'}`}>
//       {icon}
//     </div>
//     <div>
//       <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none mb-1">
//         {label}
//       </p>
//       <p className={`text-[10px] font-bold uppercase leading-none ${isLink ? 'text-blue-600 underline cursor-pointer' : 'text-slate-600'}`}>
//         {value}
//       </p>
//     </div>
//   </div>
// );

// export default AttendanceTemplate;
