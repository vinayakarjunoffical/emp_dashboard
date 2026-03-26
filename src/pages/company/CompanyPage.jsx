import React, { useState, useMemo, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Trash2, 
  PlusCircle, 
  Search, 
  Command, 
  Edit3, 
  Mail, 
  Phone, 
  AlertTriangle,
  Navigation,
  X,
  Building,
  Map,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Globe
} from 'lucide-react';
import toast from 'react-hot-toast';
// 1. ADD THIS IMPORT AT THE TOP
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

// IMPORT YOUR SERVICES HERE
import { companyService } from '../../services/companyService'; 
import { branchService } from '../../services/branchService';   

const CompanyBranchManagement = () => {
  const [activeTab, setActiveTab] = useState('companies'); 
  const [searchQuery, setSearchQuery] = useState("");
  
  // Data State
  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  // Modal & API States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({}); // NEW: Validation State

  // Pincode Integration States
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);
  const [availableCities, setAvailableCities] = useState([]);

  const tabs = [
    { id: 'companies', label: 'Companies', icon: <Building2 size={14} strokeWidth={2.5} /> },
    { id: 'branches', label: 'Branches', icon: <MapPin size={14} strokeWidth={2.5} /> },
  ];

  // --- API DATA FETCHING ---
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const companiesData = await companyService.getAll();
      setCompanies(companiesData || []);

      let allBranches = [];
      if (companiesData && companiesData.length > 0) {
        const branchPromises = companiesData.map(async (company) => {
          try {
            const compBranches = await branchService.getByCompanyId(company.id);
            return (compBranches || []).map(b => ({ ...b, companyId: company.id }));
          } catch (err) {
            console.warn(`Could not fetch branches for company ${company.id}`);
            return [];
          }
        });

        const results = await Promise.all(branchPromises);
        allBranches = results.flat();
      }
      setBranches(allBranches);
    } catch (error) {
      toast.error("Failed to fetch registry data from server");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };


  // --- GEOLOCATION HANDLER ---
//   const handleGetLocation = () => {
//     if (!navigator.geolocation) {
//       toast.error("Geolocation is not supported by your browser");
//       return;
//     }

//     setIsFetchingLocation(true);
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         // Formats to 6 decimal places for standard GPS accuracy
//         handleInputChange('latitude', position.coords.latitude.toFixed(6));
//         handleInputChange('longitude', position.coords.longitude.toFixed(6));
//         setIsFetchingLocation(false);
//         toast.success("Location detected successfully");
//       },
//       (error) => {
//         setIsFetchingLocation(false);
//         let errorMsg = "Unable to retrieve your location";
//         if (error.code === 1) errorMsg = "Location access denied by user";
//         toast.error(errorMsg);
//       },
//       { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
//     );
//   };

  useEffect(() => {
    fetchAllData();
  }, []);

  // --- HANDLERS ---
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const openAddModal = () => {
    setActiveItem(null);
    setAvailableCities([]); 
    setFormErrors({}); // Clear errors
    setFormData(activeTab === 'companies' 
      ? { name: '', contact_person: '', contact_person_profile: '', contact_number: '', email: '', org_size: '', address: '', city: '', district: '', state: '', pincode: '' }
      : { companyId: '', name: '', latitude: 0, longitude: 0, allowed_radius_meters: 100 }
    );
    setIsFormModalOpen(true);
  };

  const openEditModal = (item) => {
    setActiveItem(item);
    setAvailableCities([]); 
    setFormErrors({}); // Clear errors
    setFormData({ ...item });
    setIsFormModalOpen(true);
  };

  const openDeleteModal = (item) => {
    setActiveItem(item);
    setIsDeleteModalOpen(true);
  };

  // --- INPUT CHANGE HANDLER (Clears specific error on type) ---
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // --- PINCODE API LOGIC ---
  const handlePincodeChange = async (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6); 
    handleInputChange('pincode', val);

    if (val.length === 6) {
      setIsFetchingPincode(true);
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${val}`);
        const data = await response.json();

        if (data && data[0] && data[0].Status === "Success") {
          const postOffices = data[0].PostOffice;
          const fetchedState = postOffices[0].State;
          const fetchedDistrict = postOffices[0].District;
          const uniqueAreas = [...new Set(postOffices.map(po => po.Name))];
          
          setAvailableCities(uniqueAreas);
          setFormData(prev => ({
            ...prev,
            state: fetchedState,
            district: fetchedDistrict,
            city: uniqueAreas.length === 1 ? uniqueAreas[0] : ''
          }));
          
          // Clear location errors if they existed
          setFormErrors(prev => ({ ...prev, state: null, district: null, city: null, pincode: null }));
          toast.success(`Location found: ${fetchedDistrict}, ${fetchedState}`);
        } else {
          setFormErrors(prev => ({ ...prev, pincode: "Invalid Pincode" }));
          setAvailableCities([]);
        }
      } catch (error) {
        toast.error("Failed to verify pincode");
      } finally {
        setIsFetchingPincode(false);
      }
    } else {
      if (availableCities.length > 0) {
        setAvailableCities([]);
        setFormData(prev => ({ ...prev, city: '', state: '', district: '' }));
      }
    }
  };

  // --- FORM VALIDATION ---
  const validateForm = () => {
    const newErrors = {};

    if (activeTab === 'companies') {
      if (!formData.name?.trim()) newErrors.name = "Company name is required";
      if (!formData.contact_person?.trim()) newErrors.contact_person = "Contact person is required";
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email || !emailRegex.test(formData.email)) {
        newErrors.email = "Valid email address is required";
      }

      // Basic Phone Validation (Allows optional +, followed by 10 to 14 digits)
      const phoneRegex = /^\+?[0-9]{10,14}$/;
      const cleanedPhone = formData.contact_number?.replace(/[\s-]/g, '') || '';
      if (!cleanedPhone || !phoneRegex.test(cleanedPhone)) {
        newErrors.contact_number = "Valid 10+ digit phone number required";
      }

      if (formData.pincode && formData.pincode.length !== 6) {
        newErrors.pincode = "Pincode must be exactly 6 digits";
      }

      if (!formData.city?.trim()) newErrors.city = "City is required";
      if (!formData.state?.trim()) newErrors.state = "State is required";

    } else {
      const isEdit = !!activeItem;
      if (!isEdit && !formData.companyId) newErrors.companyId = "Parent company is required";
      if (!formData.name?.trim()) newErrors.name = "Branch name is required";

      const lat = parseFloat(formData.latitude);
      if (isNaN(lat) || lat < -90 || lat > 90) newErrors.latitude = "Valid latitude (-90 to 90) required";

      const lng = parseFloat(formData.longitude);
      if (isNaN(lng) || lng < -180 || lng > 180) newErrors.longitude = "Valid longitude (-180 to 180) required";

      if (!formData.allowed_radius_meters || formData.allowed_radius_meters <= 0) {
        newErrors.allowed_radius_meters = "Radius must be greater than 0";
      }
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // --- API MUTATIONS ---
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // RUN VALIDATION
    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
      return;
    }

    setIsSubmitting(true);
    const isEdit = !!activeItem;
    
    try {
      if (activeTab === 'companies') {
        const payload = {
          name: formData.name || "",
          contact_person: formData.contact_person || "",
          contact_person_profile: formData.contact_person_profile || "",
          contact_number: formData.contact_number || "",
          email: formData.email || "",
          org_size: formData.org_size || "",
          address: formData.address || "",
          state: formData.state || "",
          district: formData.district || "",
          city: formData.city || "",
          pincode: formData.pincode || ""
        };

        if (isEdit) {
          await companyService.updateCompany(activeItem.id, payload);
          toast.success("Company updated successfully");
        } else {
          await companyService.createCompany(payload);
          toast.success("Company added successfully");
        }
      } else {
        const payload = {
          name: formData.name || "string",
          latitude: parseFloat(formData.latitude) || 0,
          longitude: parseFloat(formData.longitude) || 0,
          allowed_radius_meters: parseInt(formData.allowed_radius_meters) || 100
        };

        if (isEdit) {
          await branchService.updateBranch(activeItem.id, payload);
          toast.success("Branch updated successfully");
        } else {
          await branchService.createBranch(formData.companyId, payload);
          toast.success("Branch added successfully");
        }
      }

      setIsFormModalOpen(false);
      fetchAllData(); 
    } catch (error) {
      toast.error(error.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      if (activeTab === 'companies') {
        await companyService.deleteCompany(activeItem.id);
        toast.success("Company removed successfully");
      } else {
        await branchService.deleteBranch(activeItem.id);
        toast.success("Branch removed successfully");
      }
      
      setIsDeleteModalOpen(false);
      
      if (paginatedData.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
      
      fetchAllData();
    } catch (error) {
      toast.error(error.message || "Failed to delete item");
    } finally {
      setIsSubmitting(false);
    }
  };


  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyBSfRK5JaewoPA_0H7qWhsKQ0WZySkNalg" 
    // googleMapsApiKey: "sdfsdfsdfsdfdfsdfsdfsf" 
  });

  const mapContainerStyle = {
    width: '100%',
    height: '250px',
    borderRadius: '1rem'
  };

  const defaultCenter = { lat: 19.0330, lng: 73.0297 };


  // --- GEOCODING HELPER ---
  const getAddressFromCoordinates = (lat, lng) => {
    if (!window.google) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        handleInputChange('address', results[0].formatted_address);
      }
    });
  };

  // --- MAP PIN DRAG HANDLER ---
  const handleMarkerDragEnd = (e) => {
    const newLat = e.latLng.lat();
    const newLng = e.latLng.lng();
    
    handleInputChange('latitude', newLat.toFixed(6));
    handleInputChange('longitude', newLng.toFixed(6));
    getAddressFromCoordinates(newLat, newLng);
  };

  // --- UPDATED AUTO-FETCH (Browser Location) ---
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        handleInputChange('latitude', lat.toFixed(6));
        handleInputChange('longitude', lng.toFixed(6));
        getAddressFromCoordinates(lat, lng);
        
        setIsFetchingLocation(false);
        toast.success("Location detected successfully");
      },
      (error) => {
        setIsFetchingLocation(false);
        toast.error("Unable to retrieve your location");
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  // --- FILTERING & PAGINATION LOGIC ---
  const displayData = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (activeTab === 'companies') {
      return companies.filter(c => c.name?.toLowerCase().includes(query) || c.city?.toLowerCase().includes(query));
    } else {
      return branches.filter(b => b.name?.toLowerCase().includes(query));
    }
  }, [activeTab, searchQuery, companies, branches]);

  const totalItems = displayData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = displayData.slice(startIndex, startIndex + itemsPerPage);

  // --- HELPER FOR INPUT STYLES ---
  const getInputClass = (field) => `w-full px-5 py-4 border rounded-2xl text-[11px] font-bold outline-none transition-all shadow-inner ${
    formErrors[field] 
    ? 'bg-rose-50 border-rose-300 focus:bg-white focus:border-rose-500 text-rose-900 placeholder:text-rose-300' 
    : 'bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-600'
  }`;

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-700">
      
      {/* --- HEADER BLOCK --- */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-white rounded-lg text-blue-500 shadow-lg shadow-blue-100">
              <Command size={16} />
            </div>
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">
              Admin
            </h2>
          </div>
          <h1 className="text-2xl font-black !text-slate-500 tracking-tight"> Company & Branch Management </h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Manage Companies and Branches 
          </p>
        </div>

        <button 
          onClick={openAddModal}
          disabled={isLoading}
          className="group flex items-center gap-3 px-8 py-3 !bg-white !text-blue-500 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border border-slate-200 hover:!border-blue-300 transition-all shadow-sm active:scale-95 disabled:opacity-50"
        >
          <PlusCircle size={16} className="group-hover:rotate-90 transition-transform duration-300" /> 
           Add {activeTab === 'companies' ? 'Company' : 'Branch'}
        </button>
      </div>

      {/* --- ENTERPRISE TOOLBAR --- */}
      <div className="mb-6 flex flex-wrap items-center gap-4 bg-white p-4 rounded-[1.5rem] border border-slate-200 shadow-sm">
        <div className="flex p-1 bg-slate-100 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-[9px] font-black !bg-transparent uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                ? "!bg-white !text-blue-600 shadow-sm scale-[1.02]" 
                : "!text-slate-400 hover:!text-slate-600"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="h-8 w-[1px] bg-slate-100 hidden md:block mx-2" />

        <div className="relative group flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={14} />
          <input 
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* --- DETAILED LIST VIEW --- */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm relative min-h-[500px] flex flex-col justify-between">
        <div className="relative z-10 flex-1 flex flex-col">
          <div className="px-8 py-5 bg-slate-50/50 flex items-center justify-between gap-6 border-b border-slate-100">
  
  {/* Left Column Header */}
  <div className="flex-1">
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
      {activeTab === 'companies' ? 'Company Details' : 'Branch Details'}
    </span>
  </div>

  {/* Middle Column Header (Matches the hidden md:block of your data rows) */}
  <div className="flex-1 hidden md:block">
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
      {activeTab === 'companies' ? 'Email & Contact No.' : 'Company & Location'}
    </span>
  </div>

  {/* Right Column Header */}
  <div className="w-auto text-right pr-[100px]">
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
      Status & Actions
    </span>
  </div>

</div>

          <div className="divide-y divide-slate-100 flex-1 relative">
            <Building className="absolute -right-12 -bottom-12 text-slate-50 opacity-[0.4] -rotate-12 pointer-events-none z-[-1]" size={300} />

            {isLoading ? (
               <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 rounded-b-[2.5rem]">
                 <Loader2 className="animate-spin text-blue-600 mb-4" size={40} strokeWidth={2.5} />
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Fetching Company Details...</span>
               </div>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <div key={item.id} className="group p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/40 backdrop-blur-sm">
                  
                  <div className="flex items-center gap-5 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                      {activeTab === 'companies' ? <Building2 size={20} strokeWidth={2} /> : <MapPin size={20} strokeWidth={2} />}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase tracking-widest">
                          ID: {item.id}
                        </span>
                        {activeTab === 'companies' ? (
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            CITY: {item.city || 'N/A'}
                          </span>
                        ) : (
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            RAD: {item.allowed_radius_meters}m
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2 hidden md:block">
                    {activeTab === 'companies' ? (
                      <>
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                          <Mail size={12} className="text-slate-400"/> {item.email || 'No email provided'}
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                          <Phone size={12} className="text-slate-400"/> {item.contact_number || 'No contact provided'}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                          <Building2 size={12} className="text-slate-400"/> 
                          {companies.find(c => c.id === item.companyId)?.name || `Company ID: ${item.companyId}`}
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                          <Globe size={12} className="text-slate-400"/> 
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">GEO:</span> 
                          {item.latitude}, {item.longitude}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                    <span className={`inline-block px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                          (item.status || 'active') === 'active' 
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                          : 'bg-slate-100 border-slate-200 text-slate-500'
                      }`}>
                        {(item.status || 'active').replace(/_/g, ' ')}
                    </span>

                    <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditModal(item)}
                        className="p-2.5 !bg-white !text-blue-500 hover:!text-blue-500 hover:!bg-white rounded-xl transition-all border !border-slate-200 hover:!border-blue-600 shadow-sm"
                      >
                        <Edit3 size={16} strokeWidth={2.5} />
                      </button>
                      <button 
                        onClick={() => openDeleteModal(item)}
                        className="p-2.5 !bg-white !text-slate-400 hover:!text-white hover:!bg-rose-500 rounded-xl transition-all border !border-slate-200 hover:!border-rose-600 shadow-sm"
                      >
                        <Trash2 size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>

                </div>
              ))
            ) : (
              <div className="py-32 flex flex-col items-center justify-center relative z-10">
                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mb-6 shadow-inner">
                  {activeTab === 'companies' ? <Building2 size={40} strokeWidth={1} /> : <Map size={40} strokeWidth={1} />}
                </div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Empty Registry</p>
                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-2">No {activeTab} match current filters or API returned empty.</p>
              </div>
            )}
          </div>
        </div>

        {/* --- PAGINATION FOOTER --- */}
        {totalPages > 1 && !isLoading && (
          <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/80 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 z-10 relative">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} Entries
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 !bg-white border !border-slate-200 rounded-xl !text-slate-400 hover:!text-blue-600 hover:!border-blue-200 disabled:opacity-50 disabled:hover:!border-slate-200 disabled:hover:!text-slate-400 transition-all shadow-sm"
              >
                <ChevronLeft size={14} strokeWidth={2.5} />
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-xl text-[10px] font-black transition-all ${
                      currentPage === page
                        ? "!bg-blue-600 !text-white shadow-md !shadow-blue-200 border !border-blue-600"
                        : "!bg-white border !border-slate-200 !text-slate-500 hover:!border-blue-200 hover:!text-blue-600 shadow-sm"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:text-slate-400 transition-all shadow-sm"
              >
                <ChevronRight size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- FORM MODAL (ADD/UPDATE) --- */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => !isSubmitting && setIsFormModalOpen(false)} />
          
          <div className="relative bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300">
            
            <div className="px-10 py-8 bg-gradient-to-br from-blue-50 to-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                  {activeTab === 'companies' ? <Building2 size={24} strokeWidth={2} /> : <MapPin size={24} strokeWidth={2} />}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-[0.2em]">
                    {activeItem ? 'Update' : 'Add'} {activeTab === 'companies' ? 'Company' : 'Branch'}
                  </h3>
                  <p className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mt-1">
                    Manage the company and Branch
                  </p>
                </div>
              </div>
              <button disabled={isSubmitting} onClick={() => setIsFormModalOpen(false)} className="p-2 !bg-white hover:!bg-slate-100 rounded-xl transition-colors !text-slate-400 border border-slate-100 shadow-sm disabled:opacity-50"><X size={18}/></button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="flex flex-col">
              <div className="p-10 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {activeTab === 'companies' ? (
                  <div className="space-y-8">
                    
                    {/* SECTION: Core Info */}
                    <div>
                      <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span> Company Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Company Name *</label>
                          <input required value={formData.name || ''} onChange={e => handleInputChange('name', e.target.value)} className={getInputClass('name')} placeholder="e.g. Acme Corp"/>
                          {formErrors.name && <p className="text-[9px] font-black text-rose-500 mt-1 ml-1 uppercase tracking-widest">{formErrors.name}</p>}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Org Size</label>
                          <input value={formData.org_size || ''} onChange={e => handleInputChange('org_size', e.target.value)} className={getInputClass('org_size')} placeholder="e.g. 50-200 Employees"/>
                        </div>
                      </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* SECTION: Contact Details */}
                    <div>
                      <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span> Contact Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Contact Person *</label>
                          <input required value={formData.contact_person || ''} onChange={e => handleInputChange('contact_person', e.target.value)} className={`${getInputClass('contact_person')} uppercase`} placeholder="John Doe"/>
                          {formErrors.contact_person && <p className="text-[9px] font-black text-rose-500 mt-1 ml-1 uppercase tracking-widest">{formErrors.contact_person}</p>}
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Person Profile</label>
                          <input value={formData.contact_person_profile || ''} onChange={e => handleInputChange('contact_person_profile', e.target.value)} className={`${getInputClass('contact_person_profile')} uppercase`} placeholder="e.g. HR Director"/>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Email *</label>
                          <input type="email" required value={formData.email || ''} onChange={e => handleInputChange('email', e.target.value)} className={getInputClass('email')} placeholder="admin@acme.com"/>
                          {formErrors.email && <p className="text-[9px] font-black text-rose-500 mt-1 ml-1 uppercase tracking-widest">{formErrors.email}</p>}
                        </div>
                       <div className="space-y-2">
  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Contact No. *</label>
  <input 
    type="tel"
    required 
    maxLength={10}
    value={formData.contact_number || ''} 
    onChange={e => {
      // Strips out all non-numeric characters and limits to 10 digits
      const onlyNums = e.target.value.replace(/\D/g, '').slice(0, 10);
      handleInputChange('contact_number', onlyNums);
    }} 
    className={getInputClass('contact_number')} 
    placeholder="0000000000"
  />
  {formErrors.contact_number && <p className="text-[9px] font-black text-rose-500 mt-1 ml-1 uppercase tracking-widest">{formErrors.contact_number}</p>}
</div>
                      </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* SECTION: Location */}
                    <div>
                      <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span> Location & Address
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        
                        {/* PINCODE FIELD */}
                        <div className="space-y-2 relative">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Pincode *</label>
                          <div className="relative">
                            <input 
                              maxLength={6}
                              value={formData.pincode || ''} 
                              onChange={handlePincodeChange} 
                              className={getInputClass('pincode')}
                              placeholder="e.g. 400001"
                            />
                            {isFetchingPincode && (
                              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-blue-500" size={16} />
                            )}
                          </div>
                          {formErrors.pincode && <p className="text-[9px] font-black text-rose-500 mt-1 ml-1 uppercase tracking-widest">{formErrors.pincode}</p>}
                        </div>

                        {/* CITY FIELD */}
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">City / Area *</label>
                          {availableCities.length > 1 ? (
                            <select 
                              required 
                              value={formData.city || ''} 
                              onChange={e => handleInputChange('city', e.target.value)} 
                              className={`${getInputClass('city')} uppercase cursor-pointer`}
                            >
                              <option value="">Select Area...</option>
                              {availableCities.map(city => (
                                <option key={city} value={city}>{city}</option>
                              ))}
                            </select>
                          ) : (
                            <input 
                              required 
                              readOnly={availableCities.length === 1}
                              value={formData.city || ''} 
                              onChange={e => handleInputChange('city', e.target.value)} 
                              className={`${getInputClass('city')} uppercase ${availableCities.length === 1 ? 'bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200' : ''}`} 
                              placeholder="City Name"
                            />
                          )}
                          {formErrors.city && <p className="text-[9px] font-black text-rose-500 mt-1 ml-1 uppercase tracking-widest">{formErrors.city}</p>}
                        </div>

                        {/* DISTRICT FIELD (Auto-locked) */}
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">District</label>
                          <input 
                            readOnly={availableCities.length > 0}
                            value={formData.district || ''} 
                            onChange={e => handleInputChange('district', e.target.value)} 
                            className={`w-full px-5 py-4 border rounded-2xl text-[11px] font-bold uppercase outline-none transition-all shadow-inner ${
                              availableCities.length > 0 
                              ? 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed' 
                              : 'bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-600'
                            }`} 
                            placeholder="District"
                          />
                        </div>

                        {/* STATE FIELD (Auto-locked) */}
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">State *</label>
                          <input 
                            required 
                            readOnly={availableCities.length > 0}
                            value={formData.state || ''} 
                            onChange={e => handleInputChange('state', e.target.value)} 
                            className={`${getInputClass('state')} uppercase ${availableCities.length > 0 ? 'bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200' : ''}`} 
                            placeholder="State"
                          />
                          {formErrors.state && <p className="text-[9px] font-black text-rose-500 mt-1 ml-1 uppercase tracking-widest">{formErrors.state}</p>}
                        </div>

                        {/* ADDRESS FIELD */}
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Address Line</label>
                          <input value={formData.address || ''} onChange={e => handleInputChange('address', e.target.value)} className={`${getInputClass('address')} uppercase`} placeholder="Street / Building / Office No."/>
                        </div>

                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* BRANCH FIELDS */}
                    <div>
                      <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span> Branch
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {!activeItem && (
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Company Name *</label>
                            <select required value={formData.companyId || ''} onChange={e => handleInputChange('companyId', e.target.value)} className={getInputClass('companyId')}>
                              <option value="">Select Target Company...</option>
                              {companies.map(c => <option key={c.id} value={c.id}>{c.name} (ID: {c.id})</option>)}
                            </select>
                            {formErrors.companyId && <p className="text-[9px] font-black text-rose-500 mt-1 ml-1 uppercase tracking-widest">{formErrors.companyId}</p>}
                          </div>
                        )}
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Branch Name *</label>
                          <input required value={formData.name || ''} onChange={e => handleInputChange('name', e.target.value)} className={getInputClass('name')} placeholder="e.g. North Division HQ"/>
                          {formErrors.name && <p className="text-[9px] font-black text-rose-500 mt-1 ml-1 uppercase tracking-widest">{formErrors.name}</p>}
                        </div>
                       {/* --- EYE CATCHING GEO-COORDINATES BLOCK --- */}
{/* --- EYE CATCHING GEO-COORDINATES & MAP BLOCK --- */}
<div className="md:col-span-2 bg-indigo-50/50 border border-indigo-100 rounded-[2rem] p-6 mt-2 relative overflow-hidden">
  <Map className="absolute -right-6 -bottom-6 text-indigo-500 opacity-5 pointer-events-none" size={120} />
  
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
    <div>
      <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
        <Navigation size={14} strokeWidth={2.5} /> Location Mapping
      </h5>
      <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
        Drag the pin to set exact branch location
      </p>
    </div>
    <button
      type="button"
      onClick={handleGetLocation}
      disabled={isFetchingLocation}
      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-indigo-200 text-indigo-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm disabled:opacity-50 active:scale-95"
    >
      {isFetchingLocation ? <Loader2 size={14} className="animate-spin" /> : <MapPin size={14} />}
      {isFetchingLocation ? 'Detecting...' : 'Auto-Fetch'}
    </button>
  </div>

  {/* GOOGLE MAP RENDERER */}
  <div className="mb-6 border-2 border-white rounded-2xl shadow-sm overflow-hidden relative z-10 bg-slate-100 flex items-center justify-center min-h-[250px]">
    {isLoaded ? (
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={{
          lat: parseFloat(formData.latitude) || defaultCenter.lat,
          lng: parseFloat(formData.longitude) || defaultCenter.lng
        }}
        zoom={14}
        options={{ disableDefaultUI: true, zoomControl: true }}
      >
        <Marker 
          draggable={true}
          onDragEnd={handleMarkerDragEnd}
          position={{
            lat: parseFloat(formData.latitude) || defaultCenter.lat,
            lng: parseFloat(formData.longitude) || defaultCenter.lng
          }} 
        />
      </GoogleMap>
    ) : (
      <div className="flex flex-col items-center text-indigo-300">
        <Loader2 className="animate-spin mb-2" size={24} />
        <span className="text-[10px] font-black uppercase tracking-widest">Loading Map Engine...</span>
      </div>
    )}
  </div>

  {/* COORDINATES & ADDRESS DATA */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
    <div className="space-y-2">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Latitude *</label>
      <input 
        type="number" 
        step="any" 
        required 
        value={formData.latitude || ''} 
        onChange={e => handleInputChange('latitude', e.target.value)} 
        className={getInputClass('latitude')} 
      />
    </div>
    <div className="space-y-2">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Longitude *</label>
      <input 
        type="number" 
        step="any" 
        required 
        value={formData.longitude || ''} 
        onChange={e => handleInputChange('longitude', e.target.value)} 
        className={getInputClass('longitude')} 
      />
    </div>
    
    {/* Fetched Address Output */}
    <div className="space-y-2 md:col-span-2">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Mapped Address</label>
      <textarea 
        rows={2}
        readOnly
        value={formData.address || ''} 
        className="w-full px-5 py-4 bg-white/50 border border-indigo-100 rounded-2xl text-[11px] font-bold uppercase outline-none resize-none text-slate-600 shadow-inner" 
        placeholder="Drop pin on map to auto-fill address..."
      />
    </div>
  </div>
</div>
{/* --- END GEO-COORDINATES & MAP BLOCK --- */}
{/* --- END GEO-COORDINATES BLOCK --- */}
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Allowed Radius (Meters) *</label>
                          <input type="number" required value={formData.allowed_radius_meters || ''} onChange={e => handleInputChange('allowed_radius_meters', e.target.value)} className={getInputClass('allowed_radius_meters')} placeholder="100"/>
                          {formErrors.allowed_radius_meters && <p className="text-[9px] font-black text-rose-500 mt-1 ml-1 uppercase tracking-widest">{formErrors.allowed_radius_meters}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Footer */}
              {/* <div className="px-10 py-6 bg-slate-50 border-t border-slate-100 justify-end  flex gap-4 mt-auto">
                <button type="button" disabled={isSubmitting} onClick={() => setIsFormModalOpen(false)} className="flex-1 py-4 !bg-white border !border-slate-200 !text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:!border-slate-300 transition-all disabled:opacity-50">Cancel Process</button>
                <button type="submit" disabled={isSubmitting} className="flex-[2] flex items-center justify-center border border-blue-500 gap-2 py-4 !bg-white !text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-80 disabled:cursor-not-allowed">
                  {isSubmitting ? <Loader2 size={14} className="animate-spin"/> : null}
                  {activeItem ? 'Update' : 'Submit'}
                </button>
              </div> */}
              <div className="px-10 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-4 mt-auto">
  <button 
    type="button" 
    disabled={isSubmitting} 
    onClick={() => setIsFormModalOpen(false)} 
    className="px-8 py-3.5 !bg-white border !border-slate-200 !text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:!bg-slate-100 transition-all disabled:opacity-50"
  >
    Cancel
  </button>
  
  <button 
    type="submit" 
    disabled={isSubmitting} 
    className="px-10 py-3.5 flex items-center justify-center gap-2 border !border-blue-500 !bg-white !text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md shadow-blue-100 hover:!bg-blue-50 transition-all disabled:opacity-80 disabled:cursor-not-allowed"
  >
    {isSubmitting ? <Loader2 size={14} className="animate-spin"/> : null}
    {activeItem ? 'Update' : 'Submit'}
  </button>
</div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={() => !isSubmitting && setIsDeleteModalOpen(false)} />
          <div className="relative bg-white w-full max-w-sm rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 text-center">
              <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-rose-50">
                <AlertTriangle size={32} strokeWidth={2.5} />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-3">Delete Item </h3>
              <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                Are you sure you want to delete  <span className="text-rose-600 font-black">"{activeItem?.name}"</span> This action cannot be undone. 
                
              </p>
            </div>
            <div className="p-8 bg-slate-50 flex gap-3">
              <button disabled={isSubmitting} onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 !bg-white border !border-slate-200 !text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:!bg-white hover:!shadow-md disabled:opacity-50">Close</button>
              <button disabled={isSubmitting} onClick={handleDelete} className="flex-1 flex items-center justify-center gap-2 py-4 !bg-rose-500 !text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl !shadow-rose-200 transition-all hover:!bg-rose-700 disabled:opacity-80">
                {isSubmitting ? <Loader2 size={14} className="animate-spin"/> : null}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyBranchManagement;
//**********************************************working code phase 1 11/03/26********************************************************** */
// import React, { useState, useMemo, useEffect } from 'react';
// import { 
//   Building2, 
//   MapPin, 
//   Trash2, 
//   PlusCircle, 
//   Search, 
//   Command, 
//   Edit3, 
//   Mail, 
//   Phone, 
//   AlertTriangle,
//   X,
//   Building,
//   Map,
//   ChevronLeft,
//   ChevronRight
// } from 'lucide-react';
// import toast from 'react-hot-toast';

// // --- EXPANDED DUMMY DATA (To trigger pagination) ---
// const INITIAL_COMPANIES = [
//   { id: 'C001', name: 'GoElectronix Technologies', email: 'contact@goelectronix.com', phone: '+91 9876543210', regNo: 'GSTIN0987654321', status: 'active' },
//   { id: 'C002', name: 'Nexus Enterprise Solutions', email: 'hello@nexusent.in', phone: '+91 8765432109', regNo: 'GSTIN1234567890', status: 'inactive' },
//   { id: 'C003', name: 'Stark Industries India', email: 'info@stark.in', phone: '+91 7654321098', regNo: 'GSTIN3456789012', status: 'active' },
//   { id: 'C004', name: 'Wayne Enterprises HQ', email: 'admin@wayne.com', phone: '+91 6543210987', regNo: 'GSTIN4567890123', status: 'active' },
//   { id: 'C005', name: 'Cyberdyne Systems', email: 'support@cyberdyne.co', phone: '+91 5432109876', regNo: 'GSTIN5678901234', status: 'inactive' },
//   { id: 'C006', name: 'Umbrella Corporation', email: 'hr@umbrella.corp', phone: '+91 4321098765', regNo: 'GSTIN6789012345', status: 'active' },
// ];

// const INITIAL_BRANCHES = [
//   { id: 'B001', companyId: 'C001', name: 'Navi Mumbai HQ', city: 'Navi Mumbai', manager: 'Rahul Sharma', status: 'active' },
//   { id: 'B002', companyId: 'C001', name: 'Pune Development Center', city: 'Pune', manager: 'Priya Desai', status: 'active' },
//   { id: 'B003', companyId: 'C002', name: 'Bangalore Office', city: 'Bangalore', manager: 'Amit Kumar', status: 'active' },
//   { id: 'B004', companyId: 'C003', name: 'Delhi NCR Hub', city: 'Gurgaon', manager: 'Sanjay Singh', status: 'active' },
//   { id: 'B005', companyId: 'C004', name: 'Hyderabad Tech Park', city: 'Hyderabad', manager: 'Kavita Reddy', status: 'inactive' },
//   { id: 'B006', companyId: 'C006', name: 'Chennai Operations', city: 'Chennai', manager: 'Vikram Iyer', status: 'active' },
// ];

// const CompanyBranchManagement = () => {
//   const [activeTab, setActiveTab] = useState('companies'); 
//   const [searchQuery, setSearchQuery] = useState("");
  
//   // Data State
//   const [companies, setCompanies] = useState(INITIAL_COMPANIES);
//   const [branches, setBranches] = useState(INITIAL_BRANCHES);

//   // Pagination State
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5; // Change this to 10 for production

//   // Modal States
//   const [isFormModalOpen, setIsFormModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
//   // Active Item State (for Edit/Delete)
//   const [activeItem, setActiveItem] = useState(null);

//   // Form State
//   const [formData, setFormData] = useState({});

//   const tabs = [
//     { id: 'companies', label: 'Companies', icon: <Building2 size={14} strokeWidth={2.5} /> },
//     { id: 'branches', label: 'Branches', icon: <MapPin size={14} strokeWidth={2.5} /> },
//   ];

//   // --- HANDLERS ---
//   const handleTabChange = (tabId) => {
//     setActiveTab(tabId);
//     setSearchQuery("");
//     setCurrentPage(1); // Reset page on tab change
//   };

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//     setCurrentPage(1); // Reset page on search
//   };

//   const openAddModal = () => {
//     setActiveItem(null);
//     setFormData(activeTab === 'companies' 
//       ? { name: '', email: '', phone: '', regNo: '', status: 'active' }
//       : { companyId: '', name: '', city: '', manager: '', status: 'active' }
//     );
//     setIsFormModalOpen(true);
//   };

//   const openEditModal = (item) => {
//     setActiveItem(item);
//     setFormData({ ...item });
//     setIsFormModalOpen(true);
//   };

//   const openDeleteModal = (item) => {
//     setActiveItem(item);
//     setIsDeleteModalOpen(true);
//   };

//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     const isEdit = !!activeItem;
    
//     if (activeTab === 'companies') {
//       if (isEdit) {
//         setCompanies(prev => prev.map(c => c.id === activeItem.id ? { ...formData } : c));
//         toast.success("Company updated successfully");
//       } else {
//         const newCompany = { ...formData, id: `C00${companies.length + 3}` };
//         setCompanies([newCompany, ...companies]); // Add to top
//         toast.success("Company added successfully");
//       }
//     } else {
//       if (isEdit) {
//         setBranches(prev => prev.map(b => b.id === activeItem.id ? { ...formData } : b));
//         toast.success("Branch updated successfully");
//       } else {
//         const newBranch = { ...formData, id: `B00${branches.length + 4}` };
//         setBranches([newBranch, ...branches]); // Add to top
//         toast.success("Branch added successfully");
//       }
//     }
//     setIsFormModalOpen(false);
//   };

//   const handleDelete = () => {
//     if (activeTab === 'companies') {
//       setCompanies(prev => prev.filter(c => c.id !== activeItem.id));
//       setBranches(prev => prev.filter(b => b.companyId !== activeItem.id));
//       toast.success("Company and associated branches removed");
//     } else {
//       setBranches(prev => prev.filter(b => b.id !== activeItem.id));
//       toast.success("Branch removed successfully");
//     }
//     setIsDeleteModalOpen(false);
    
//     // Safety check: if deleting last item on a page, go back one page
//     if (paginatedData.length === 1 && currentPage > 1) {
//       setCurrentPage(prev => prev - 1);
//     }
//   };

//   // --- FILTERING & PAGINATION LOGIC ---
//   const displayData = useMemo(() => {
//     const query = searchQuery.toLowerCase();
//     if (activeTab === 'companies') {
//       return companies.filter(c => c.name.toLowerCase().includes(query) || c.regNo.toLowerCase().includes(query));
//     } else {
//       return branches.filter(b => b.name.toLowerCase().includes(query) || b.city.toLowerCase().includes(query));
//     }
//   }, [activeTab, searchQuery, companies, branches]);

//   // Pagination Calculations
//   const totalItems = displayData.length;
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedData = displayData.slice(startIndex, startIndex + itemsPerPage);

//   return (
//     <div className="min-h-screen bg-slate-50 p-6 lg:p-10 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-700">
      
//       {/* --- HEADER BLOCK --- */}
//       <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
//         <div className="space-y-1">
//           <div className="flex items-center gap-2 mb-2">
//             <div className="p-1.5 bg-white rounded-lg text-blue-500 shadow-lg shadow-blue-100">
//               <Command size={16} />
//             </div>
//             <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">
//               Admin
//             </h2>
//           </div>
//           <h1 className="text-2xl font-black !text-slate-500 tracking-tight"> Company Management </h1>
//           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
//             Manage Companies and Branches
//           </p>
//         </div>

//         <button 
//           onClick={openAddModal}
//           className="group flex items-center gap-3 px-8 py-3 !bg-white !text-blue-500 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border border-slate-200 hover:!border-blue-300 transition-all shadow-sm active:scale-95"
//         >
//           <PlusCircle size={16} className="group-hover:rotate-90 transition-transform duration-300" /> 
//            Add {activeTab.slice(0, -1)}
//         </button>
//       </div>

//       {/* --- ENTERPRISE TOOLBAR --- */}
//       <div className="mb-6 flex flex-wrap items-center gap-4 bg-white p-4 rounded-[1.5rem] border border-slate-200 shadow-sm">
//         {/* TAB STRIP */}
//         <div className="flex p-1 bg-slate-100 rounded-xl">
//           {tabs.map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => handleTabChange(tab.id)}
//               className={`flex items-center gap-2 px-6 py-2 rounded-lg text-[9px] font-black !bg-transparent uppercase tracking-widest transition-all ${
//                 activeTab === tab.id 
//                 ? "!bg-white !text-blue-600 shadow-sm scale-[1.02]" 
//                 : "!text-slate-400 hover:!text-slate-600"
//               }`}
//             >
//               {tab.icon} {tab.label}
//             </button>
//           ))}
//         </div>

//         <div className="h-8 w-[1px] bg-slate-100 hidden md:block mx-2" />

//         {/* SEARCH CONSOLE */}
//         <div className="relative group flex-1 max-w-md">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={14} />
//           <input 
//             type="text"
//             placeholder={`Search ${activeTab}...`}
//             value={searchQuery}
//             onChange={handleSearchChange}
//             className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all shadow-inner"
//           />
//         </div>
//       </div>

//       {/* --- DETAILED LIST VIEW WITH PAGINATION --- */}
//       <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm relative min-h-[500px] flex flex-col justify-between">
        
//         <div className="relative z-10 flex-1 flex flex-col">
//           {/* List Header */}
//           <div className="px-8 py-5 bg-slate-50/50 flex items-center justify-between border-b border-slate-100">
//              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                {activeTab === 'companies' ? 'Company Details' : 'Branch Details'}
//              </span>
//              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-[120px]">
//                Status & Actions
//              </span>
//           </div>

//           <div className="divide-y divide-slate-100 flex-1">
//             {/* Background Watermark */}
//             <Building className="absolute -right-12 -bottom-12 text-slate-50 opacity-[0.4] -rotate-12 pointer-events-none z-[-1]" size={300} />

//             {paginatedData.length > 0 ? (
//               paginatedData.map((item) => (
//                 <div key={item.id} className="group p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/40 backdrop-blur-sm">
                  
//                   {/* Left Side: Core Info */}
//                   <div className="flex items-center gap-5 flex-1">
//                     <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
//                       {activeTab === 'companies' ? <Building2 size={20} strokeWidth={2} /> : <MapPin size={20} strokeWidth={2} />}
//                     </div>
//                     <div>
//                       <h3 className="text-sm font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
//                         {item.name}
//                       </h3>
//                       <div className="flex items-center gap-2 mt-1">
//                         <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase tracking-widest">
//                           {item.id}
//                         </span>
//                         {activeTab === 'companies' ? (
//                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                             REG: {item.regNo}
//                           </span>
//                         ) : (
//                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                             CITY: {item.city}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Middle: Secondary Meta Data */}
//                   <div className="flex-1 space-y-2 hidden md:block">
//                     {activeTab === 'companies' ? (
//                       <>
//                         <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
//                           <Mail size={12} className="text-slate-400"/> {item.email}
//                         </div>
//                         <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
//                           <Phone size={12} className="text-slate-400"/> {item.phone}
//                         </div>
//                       </>
//                     ) : (
//                       <>
//                         <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
//                           <Building2 size={12} className="text-slate-400"/> 
//                           {companies.find(c => c.id === item.companyId)?.name || 'Unknown Company'}
//                         </div>
//                         <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
//                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">MGR:</span> 
//                           {item.manager}
//                         </div>
//                       </>
//                     )}
//                   </div>

//                   {/* Right Side: Status & Actions */}
//                   <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
//                     <span className={`inline-block px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
//                           item.status === 'active' 
//                           ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
//                           : 'bg-slate-100 border-slate-200 text-slate-500'
//                       }`}>
//                         {item.status.replace(/_/g, ' ')}
//                     </span>

//                     <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
//                       <button 
//                         onClick={() => openEditModal(item)}
//                         className="p-2.5 bg-white text-blue-500 hover:text-white hover:bg-blue-500 rounded-xl transition-all border border-slate-200 hover:border-blue-600 shadow-sm"
//                       >
//                         <Edit3 size={16} strokeWidth={2.5} />
//                       </button>
//                       <button 
//                         onClick={() => openDeleteModal(item)}
//                         className="p-2.5 bg-white text-slate-400 hover:text-white hover:bg-rose-500 rounded-xl transition-all border border-slate-200 hover:border-rose-600 shadow-sm"
//                       >
//                         <Trash2 size={16} strokeWidth={2.5} />
//                       </button>
//                     </div>
//                   </div>

//                 </div>
//               ))
//             ) : (
//               <div className="py-32 flex flex-col items-center justify-center relative z-10">
//                 <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mb-6 shadow-inner">
//                   {activeTab === 'companies' ? <Building2 size={40} strokeWidth={1} /> : <Map size={40} strokeWidth={1} />}
//                 </div>
//                 <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Empty Registry</p>
//                 <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-2">No {activeTab} match current filters</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* --- PAGINATION FOOTER --- */}
//         {totalPages > 1 && (
//           <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/80 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 z-10 relative">
//             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//               Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} Entries
//             </div>
            
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//                 disabled={currentPage === 1}
//                 className="p-2 !bg-white border !border-slate-200 rounded-xl !text-slate-400 hover:!text-blue-600 hover:!border-blue-200 disabled:opacity-50 disabled:hover:!border-slate-200 disabled:hover:!text-slate-400 transition-all shadow-sm"
//               >
//                 <ChevronLeft size={14} strokeWidth={2.5} />
//               </button>

//               <div className="flex gap-1">
//                 {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
//                   <button
//                     key={page}
//                     onClick={() => setCurrentPage(page)}
//                     className={`w-8 h-8 flex items-center justify-center rounded-xl text-[10px] font-black transition-all ${
//                       currentPage === page
//                         ? "!bg-blue-600 !text-white shadow-md !shadow-blue-200 border !border-blue-600"
//                         : "!bg-white border !border-slate-200 !text-slate-500 hover:!border-blue-200 hover:!text-blue-600 shadow-sm"
//                     }`}
//                   >
//                     {page}
//                   </button>
//                 ))}
//               </div>

//               <button
//                 onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//                 disabled={currentPage === totalPages}
//                 className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:text-slate-400 transition-all shadow-sm"
//               >
//                 <ChevronRight size={14} strokeWidth={2.5} />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* --- FORM MODAL (ADD/UPDATE) --- */}
//       {isFormModalOpen && (
//         <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
//           <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={() => setIsFormModalOpen(false)} />
//           <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300">
//             <div className="px-10 py-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
//               <div>
//                 <h3 className="!text-lg font-black text-slate-900 uppercase tracking-[0.2em]">
//                   {activeItem ? 'Update' : 'Deploy'} {activeTab.slice(0, -1)}
//                 </h3>
//                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                   System Registry Config
//                 </p>
//               </div>
//               <button onClick={() => setIsFormModalOpen(false)} className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400"><X size={18}/></button>
//             </div>
            
//             <form onSubmit={handleFormSubmit} className="p-10 space-y-6">
              
//               {/* Dynamic Fields based on Entity */}
//               {activeTab === 'companies' ? (
//                 <>
//                   <div className="space-y-2">
//                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Company Name</label>
//                     <input required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold outline-none focus:bg-white focus:border-blue-600 transition-all shadow-inner" placeholder="e.g. Acme Corp"/>
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Email</label>
//                       <input type="email" required value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold outline-none focus:bg-white focus:border-blue-600 transition-all shadow-inner" placeholder="admin@acme.com"/>
//                     </div>
//                     <div className="space-y-2">
//                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Phone</label>
//                       <input required value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold outline-none focus:bg-white focus:border-blue-600 transition-all shadow-inner" placeholder="+91 0000000000"/>
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Registration No (CIN/GST)</label>
//                     <input required value={formData.regNo || ''} onChange={e => setFormData({...formData, regNo: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold uppercase outline-none focus:bg-white focus:border-blue-600 transition-all shadow-inner" placeholder="GSTIN..."/>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div className="space-y-2">
//                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Parent Company</label>
//                     <select required value={formData.companyId || ''} onChange={e => setFormData({...formData, companyId: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold outline-none focus:bg-white focus:border-blue-600 transition-all shadow-inner">
//                       <option value="">Select Company</option>
//                       {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//                     </select>
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Branch Name</label>
//                     <input required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold outline-none focus:bg-white focus:border-blue-600 transition-all shadow-inner" placeholder="e.g. North Division"/>
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">City / Location</label>
//                       <input required value={formData.city || ''} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold outline-none focus:bg-white focus:border-blue-600 transition-all shadow-inner" placeholder="e.g. Mumbai"/>
//                     </div>
//                     <div className="space-y-2">
//                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Manager Name</label>
//                       <input required value={formData.manager || ''} onChange={e => setFormData({...formData, manager: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold outline-none focus:bg-white focus:border-blue-600 transition-all shadow-inner" placeholder="John Doe"/>
//                     </div>
//                   </div>
//                 </>
//               )}

//               {/* Status Toggle (Common) */}
//               <div className="space-y-2">
//                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Entity Status</label>
//                 <select value={formData.status || 'active'} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold uppercase tracking-wider outline-none focus:bg-white focus:border-blue-600 transition-all shadow-inner">
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                 </select>
//               </div>

//               <div className="flex gap-4 pt-4">
//                 <button type="button" onClick={() => setIsFormModalOpen(false)} className="flex-1 py-4 !bg-white border !border-slate-200 !text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:!border-slate-300 transition-all">Cancel</button>
//                 <button type="submit" className="flex-[2] py-4 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
//                   {activeItem ? 'Save Changes' : 'Confirm Deployment'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* --- DELETE CONFIRMATION MODAL --- */}
//       {isDeleteModalOpen && (
//         <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
//           <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={() => setIsDeleteModalOpen(false)} />
//           <div className="relative bg-white w-full max-w-sm rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
//             <div className="p-10 text-center">
//               <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-rose-50">
//                 <AlertTriangle size={32} strokeWidth={2.5} />
//               </div>
//               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-3">Confirm Deletion</h3>
//               <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
//                 You are about to remove <span className="text-rose-600 font-black">"{activeItem?.name}"</span>. 
//                 {activeTab === 'companies' && " All associated branches will also be orphaned or removed."}
//               </p>
//             </div>
//             <div className="p-8 bg-slate-50 flex gap-3">
//               <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white hover:shadow-md">Keep</button>
//               <button onClick={handleDelete} className="flex-1 py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-200 transition-all hover:bg-rose-700">Remove</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CompanyBranchManagement;