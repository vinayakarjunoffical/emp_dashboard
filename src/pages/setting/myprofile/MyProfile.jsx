import React, { useState, useRef, useEffect } from 'react';
import { 
  Info, LayoutGrid, CheckCircle2, ArrowLeft, ChevronDown, Search, Plus,
  UserCircle2, Building2, Edit3, X, ImagePlus, Save
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- NEW OFFICIAL GOOGLE MAPS IMPORTS ---
import { APIProvider, Map, AdvancedMarker, useMapsLibrary, useMap } from '@vis.gl/react-google-maps';

const defaultCenter = { lat: 19.0760, lng: 72.8777 }; // Default: Mumbai

const PlaceAutocomplete = ({ onPlaceSelect }) => {
  const containerRef = useRef(null);
  const places = useMapsLibrary('places');
  const [autocompleteEl, setAutocompleteEl] = useState(null);

  useEffect(() => {
    if (!places || !containerRef.current) return;

    const el = new places.PlaceAutocompleteElement();
    
    // Set Google's internal CSS variables to fix the white text
    el.style.width = '100%';
    el.style.boxSizing = 'border-box';
    el.style.backgroundColor = '#ffffff'; 
    el.style.color = '#1e293b'; // slate-800 text
    el.style.borderRadius = '12px';
    
    containerRef.current.appendChild(el);
    setAutocompleteEl(el);

    return () => {
      if (containerRef.current && el) {
        containerRef.current.removeChild(el);
      }
    };
  }, [places]);

  useEffect(() => {
    if (!autocompleteEl) return;

    const handleSelect = async (event) => {
      const place = event.place;
      if (!place) return;
      
      await place.fetchFields({ fields: ['location', 'displayName', 'formattedAddress', 'addressComponents'] });
      onPlaceSelect(place);
    };

    autocompleteEl.addEventListener('gmp-placeselect', handleSelect);
    return () => autocompleteEl.removeEventListener('gmp-placeselect', handleSelect);
  }, [autocompleteEl, onPlaceSelect]);

  return (
    <div className="absolute top-3 left-3 right-3 sm:w-80 z-[1000]">
      <div className="relative bg-white rounded-xl shadow-lg border border-slate-200">
        <div ref={containerRef} className="w-full outline-none" />
      </div>
    </div>
  );
};

// 🗺️ INNER MAP COMPONENT (Required to use map panning hooks)
const MapInner = ({ profileData, setProfileData }) => {
  const map = useMap('profile-map'); // Connect to the map by ID
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);

  // 🔥 NEW: Watch for marker position changes and pan the map
  useEffect(() => {
    if (map && markerPosition) {
      map.panTo(markerPosition);
      map.setZoom(17);
    }
  }, [map, markerPosition]);

  const handlePlaceSelect = (place) => {
    if (place.location) {
      // Safely extract coordinates
      const newPos = { 
        lat: typeof place.location.lat === 'function' ? place.location.lat() : place.location.lat, 
        lng: typeof place.location.lng === 'function' ? place.location.lng() : place.location.lng 
      };
      
      // Update marker state (which triggers the useEffect to pan the map)
      setMarkerPosition(newPos);
    }
    
    setProfileData(prev => ({
      ...prev,
      address: place.formattedAddress || place.displayName || '',
      jurisdiction: extractCityState(place.addressComponents)
    }));
  };

  const handleMarkerDragEnd = (e) => {
    const latLng = e.latLng || (e.detail && e.detail.latLng);
    if (latLng) {
      setMarkerPosition({ 
        lat: typeof latLng.lat === 'function' ? latLng.lat() : latLng.lat, 
        lng: typeof latLng.lng === 'function' ? latLng.lng() : latLng.lng 
      });
    }
  };

  const extractCityState = (components) => {
    if (!components) return profileData.jurisdiction;
    let city = '', state = '';
    components.forEach(c => {
      const types = c.types || [];
      const text = c.longText || c.name || '';
      if (types.includes('locality')) city = text;
      if (types.includes('administrative_area_level_1')) state = text;
    });
    return city && state ? `${state}, ${city}` : profileData.jurisdiction;
  };

  return (
    <>
      <PlaceAutocomplete onPlaceSelect={handlePlaceSelect} />
      
      <div className="w-full h-full rounded-2xl overflow-hidden">
        <Map
          id="profile-map" // MUST match useMap('profile-map')
          defaultCenter={defaultCenter} 
          defaultZoom={14}
          mapId="DEMO_MAP_ID" 
          disableDefaultUI={true}
          zoomControl={true}
        >
          <AdvancedMarker 
            position={markerPosition} 
            draggable={true} 
            onDragEnd={handleMarkerDragEnd} 
          />
        </Map>
      </div>
    </>
  );
};

// 🗺️ MAP WRAPPER
const LocationPicker = ({ profileData, setProfileData }) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl shadow-sm flex flex-col relative h-64 w-full">
      <APIProvider apiKey="AIzaSyBSfRK5JaewoPA_0H7qWhsKQ0WZySkNalg">
        {/* Render the inner map component so it can use the map hook */}
        <MapInner profileData={profileData} setProfileData={setProfileData} />
      </APIProvider>
    </div>
  );
};

// ✨ EXTRACTED PROFILE ITEM COMPONENT (Fixes the "type is invalid" React Error)
const ProfileItem = ({ label, value, badge, children }) => (
  <div className="py-3 flex flex-col gap-1 group transition-all duration-200">
    <label className="text-[9px] font-black text-slate-500 !capitalize tracking-[0.2em] leading-none">
      {label}
    </label>
    <div className="flex items-center gap-2">
      {children ? children : (
        <span className="text-[13px] font-bold text-slate-800 tracking-tight leading-none group-hover:text-blue-600 transition-colors break-words">
          {value}
        </span>
      )}
      {badge}
    </div>
  </div>
);

// 🏢 MAIN COMPONENT
const MyProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    businessName: "Goelectronix Technologies Pvt Ltd",
    jurisdiction: "Maharashtra, Mumbai",
    address: "4th Floor, Ellora Clarissa, Unit 403, Plot A-785",
    phone: "+91 9892580308",
    email: "sujithankare@goelectronix.com",
    logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=GT" 
  });

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({ ...prev, logoUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter'] pb-12 text-left relative overflow-x-hidden">
      
      {/* 🛡️ BACKGROUND WATERMARK */}
      <div className="absolute -bottom-10 -right-10 opacity-[0.02] text-slate-900 pointer-events-none rotate-12">
        <UserCircle2 size={400} />
      </div>

      {/* 🚀 COMPACT HEADER */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-6 py-2.5 flex items-center justify-between sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 !text-slate-400 hover:text-blue-600 border-0 !bg-transparent cursor-pointer group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black capitalize tracking-[0.15em]">Back</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto md:px-6 px-4 mt-6 relative z-10">
        
        {/* 🎭 HERO SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-6 animate-in fade-in slide-in-from-top-2 duration-500">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl flex items-center justify-center shadow-sm border-2 border-blue-600 ring-4 ring-blue-50/50 shrink-0">
                <Building2 size={24} className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="space-y-0.5">
                <h1 className="text-xl sm:text-2xl font-black !text-slate-900 tracking-tighter !capitalize leading-none">Organization Profile</h1>
                <p className="text-[9px] font-bold text-slate-600 !capitalize tracking-[0.3em]">ID: ENT-9825-GTPL</p>
              </div>
           </div>
           
           <button 
             onClick={() => setIsEditModalOpen(true)}
             className="flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto px-4 py-3 !bg-white !text-blue-600 rounded-lg text-[10px] font-black capitalize tracking-widest shadow-sm shadow-blue-100 hover:bg-blue-50 transition-all active:scale-95 border border-blue-100 cursor-pointer"
           >
             <Edit3 size={14} strokeWidth={3} />
             Edit Profile
           </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start text-left">
          
          <div className="lg:col-span-12 space-y-5">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-slate-50/50 px-4 sm:px-6 py-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-white rounded-lg shadow-sm border border-slate-100 text-blue-600"><Info size={16} strokeWidth={2.5} /></div>
                  <h3 className="text-[10px] font-black text-slate-800 !capitalize tracking-[0.2em]">Business Info</h3>
                </div>
              </div>
              <div className="px-4 sm:px-6 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2 divide-y sm:divide-y-0 divide-slate-50">
                <ProfileItem label="Business Name" value={profileData.businessName} />
                
                <ProfileItem label="Business Logo">
                  <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-lg overflow-hidden shadow-inner">
                    <img src={profileData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                </ProfileItem>

                <ProfileItem label="Contact Number" value={profileData.phone} />
                <ProfileItem label="Email" value={profileData.email} badge={<div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md border border-emerald-100/50 shrink-0"><CheckCircle2 size={8} strokeWidth={4} /><span className="text-[7px] font-black capitalize">Verified</span></div>} />
                <ProfileItem label="Business (State & City)" value={profileData.jurisdiction} />
                <ProfileItem label="Business Address" value={profileData.address} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-12 space-y-5">
             <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                <div className="p-4 sm:p-8 pb-4 sm:pb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 border-b border-slate-50 lg:border-none">
              
                  <div className="space-y-0.5">
                    <h2 className="text-lg sm:text-xl font-black !text-slate-900 !capitalize tracking-tighter leading-none">
                      Manage Documents
                    </h2>
                    <p className="text-[9px] sm:text-[10px] font-black text-slate-400 capitalize tracking-[0.2em]">
                      Publish organisation specific documents to your staff
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                    <div>
                       <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 !bg-white !text-blue-600 rounded-xl text-[11px] border border-blue-600 font-black capitalize tracking-widest shadow-sm shadow-blue-200 hover:!bg-blue-50 transition-all active:scale-95 cursor-pointer">
                    <Plus size={16} strokeWidth={3} />
                    New Document
                  </button>
                    </div>
                      <div className="w-px h-6 bg-slate-200 mx-1 hidden md:block" />
                    <div className="flex items-center justify-between gap-2 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg cursor-pointer group hover:border-blue-300 transition-all h-[42px] w-full sm:w-auto">
                      <span className="text-[10px] font-black text-slate-700 capitalize tracking-widest whitespace-nowrap">
                        All Documents
                      </span>
                      <ChevronDown size={14} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>

                    <div className="w-px h-6 bg-slate-200 mx-1 hidden md:block" />

                    <div className="relative group w-full md:w-72">
                      <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      <input type="text" placeholder="Search for documents..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-600/5 transition-all placeholder:text-slate-300 capitalize tracking-tight"/>
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 text-center animate-in fade-in zoom-in duration-700">
                  <div className="relative mb-6">
                    <div className="w-20 h-28 sm:w-24 sm:h-32 bg-emerald-50 border border-emerald-100 rounded-lg shadow-sm -rotate-6 absolute -left-4 top-0 opacity-40" />
                    <div className="w-20 h-28 sm:w-24 sm:h-32 bg-blue-50 border border-blue-100 rounded-lg shadow-md rotate-3 relative z-10 flex items-center justify-center">
                        <LayoutGrid size={28} className="text-blue-300 opacity-50 sm:w-8 sm:h-8" />
                    </div>
                  </div>
                  
                  <h4 className="text-[12px] sm:text-[13px] font-black text-slate-400 capitalize tracking-widest mb-6">No documents found</h4>
                  
                 
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* ✅ EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setIsEditModalOpen(false)} />
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-3xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            
            <div className="p-4 px-6 border-b border-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 text-left">
                 <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Edit3 size={18} /></div>
                 <h2 className="text-lg font-black text-slate-900 capitalize tracking-tighter">Edit Details</h2>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-slate-50 !bg-transparent rounded-full transition-colors border-0 cursor-pointer !text-slate-400"><X size={20} /></button>
            </div>

            <div className="px-4 sm:px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-5 overflow-y-auto custom-scrollbar text-left flex-1">
              
              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-[9px] font-black text-slate-400 capitalize tracking-widest ml-1">
                  Business Logo
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <div className="w-16 h-16 bg-white border-2 border-slate-100 rounded-xl flex items-center justify-center shadow-sm overflow-hidden group relative shrink-0">
                     <img src={profileData.logoUrl} className="w-full h-full object-cover" alt="Preview" />
                  </div>
                  <div className="flex flex-col gap-2 w-full sm:w-auto">
                    <input type="file" ref={fileInputRef} onChange={handleLogoChange} accept="image/*" className="hidden" />
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto px-4 py-2 !bg-white border !border-slate-200 !text-blue-600 rounded-xl text-[10px] font-black capitalize tracking-widest hover:!bg-blue-50 transition-all cursor-pointer shadow-sm"
                    >
                      <ImagePlus size={14} /> Upload Logo
                    </button>
                    <p className="text-[8px] font-bold text-slate-400 capitalize ml-1 text-center sm:text-left">
                      PNG, JPG or SVG (Max 2MB)
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 capitalize tracking-widest ml-1">Business Name</label>
                <input type="text" value={profileData.businessName} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-400 transition-all" onChange={(e) => setProfileData({...profileData, businessName: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 capitalize tracking-widest ml-1">Contact Number</label>
                <input type="text" value={profileData.phone} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-400 transition-all" onChange={(e) => setProfileData({...profileData, phone: e.target.value})} />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[9px] font-black text-slate-400 capitalize tracking-widest ml-1">Email</label>
                <input type="email" value={profileData.email} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-400 transition-all" onChange={(e) => setProfileData({...profileData, email: e.target.value})} />
              </div>
              
              {/* 🗺️ NEW OFFICIAL GOOGLE MAPS IMPLEMENTATION */}
              <div className="md:col-span-2 space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-[9px] font-black text-slate-400 capitalize tracking-widest ml-1">Location Details</label>
                  <span className="text-[9px] font-bold text-blue-600 capitalize tracking-widest bg-blue-50 px-2 py-0.5 rounded-md">Search or Drag Pin</span>
                </div>

                <LocationPicker profileData={profileData} setProfileData={setProfileData} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <input type="text" value={profileData.jurisdiction} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold text-slate-700 outline-none focus:border-blue-400" onChange={(e) => setProfileData({...profileData, jurisdiction: e.target.value})} placeholder="State & City" />
                  <input type="text" value={profileData.address} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold text-slate-700 outline-none focus:border-blue-400" onChange={(e) => setProfileData({...profileData, address: e.target.value})} placeholder="Detailed Address" />
                </div>
              </div>

            </div>

            <div className="p-4 sm:p-6 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 bg-slate-50/50 shrink-0">
              <button onClick={() => setIsEditModalOpen(false)} className="w-full sm:w-auto px-6 py-3 !bg-white border !border-slate-200 !text-slate-500 rounded-xl text-[11px] font-black capitalize tracking-widest hover:!bg-slate-50 cursor-pointer transition-colors flex items-center justify-center">Cancel</button>
              <button onClick={() => setIsEditModalOpen(false)} className="w-full sm:w-auto px-8 py-3 !bg-blue-600 !text-white border border-blue-600 rounded-xl text-[11px] font-black capitalize tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2">
                 <Save size={14} /> Update Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
