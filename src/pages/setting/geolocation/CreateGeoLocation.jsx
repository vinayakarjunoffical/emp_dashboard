import React, { useState } from 'react';
import { 
  GoogleMap, 
  useJsApiLoader, 
  Marker, 
  Circle, 
  Autocomplete 
} from '@react-google-maps/api'; // Added Google Maps components
import { 
  ArrowLeft, 
  Plus, 
  MapPin, 
  Info, 
  ChevronUp, 
  X, 
  Search,
  Navigation 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Map Configuration
const containerStyle = { width: '100%', height: '100%' };
const libraries = ['places'];

const CreateGeoLocation = () => {
  const navigate = useNavigate();
  
  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    // googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY", 
    googleMapsApiKey: "AIzaSyBSfRK5JaewoPA_0H7qWhsKQ0WZySkNalg", 
    libraries
  });

  // State for multiple sites - Added lat/lng to track pin
  const [sites, setSites] = useState([
    { id: Date.now(), siteName: '', address: '', radius: 100, lat: 19.0760, lng: 72.8777, isOpen: true, autocomplete: null }
  ]);

  // Helper: Update specific site data
  const updateSiteData = (id, field, value) => {
    setSites(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  // Helper: Get address text when dragging pin
  const handlePinDrag = (id, lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        updateSiteData(id, 'address', results[0].formatted_address);
        updateSiteData(id, 'lat', lat);
        updateSiteData(id, 'lng', lng);
      }
    });
  };

  const addSite = () => {
    setSites([...sites, { id: Date.now(), siteName: '', address: '', radius: 100, lat: 19.0760, lng: 72.8777, isOpen: true }]);
  };

  const removeSite = (id) => {
    setSites(sites.filter(site => site.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter'] pb-20">
      {/* HEADER */}
      <div className="bg-white border-b border-slate-100 px-4 py-2 flex items-center gap-3 sticky top-0 z-30">
        <button onClick={() => navigate(-1)} className="!text-blue-600 !bg-transparent hover:!bg-blue-50 p-1.5 rounded-lg transition-colors">
          <ArrowLeft size={18} />
        </button>
        <span className="text-[11px] font-black !capitalize tracking-widest !text-slate-700">Back to Templates</span>
      </div>

      <div className=" mx-auto px-1 md:px-4 mt-4">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* FORM HEADER */}
          <div className="p-4 border-b border-slate-50">
            <h1 className="md:text-sm text-[10px] font-black !text-slate-800 !capitalize tracking-tight">Add Geofence Template</h1>
            <p className="md:text-[10px] text-[8px] font-bold text-slate-400 capitalize tracking-widest">Add one or more sites to this geofence template.</p>
          </div>

          <div className="p-4 space-y-4">
            {/* TEMPLATE NAME SECTION */}
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[300px]">
                <label className="text-[9px] font-black !text-slate-600 !capitalize tracking-widest mb-1 block">Template Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="Enter Template Name"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                />
              </div>
              <div className="flex items-center gap-2 pb-2">
                <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600" id="approval" />
                <label htmlFor="approval" className="text-[11px] font-bold text-slate-600 !capitalize cursor-pointer">Approval Required?</label>
                <Info size={14} className="text-slate-300" />
              </div>
            </div>

            {/* SITES LIST */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-black !text-slate-800 !capitalize tracking-[0.2em]">Sites List</h3>
              
              {sites.map((site, index) => (
                <div key={site.id} className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                  {/* Site Collapse Header */}
                  <div className="bg-slate-50/50 px-4 py-2 flex items-center justify-between border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-white border border-slate-200 rounded-lg text-blue-600">
                        <MapPin size={14} />
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-slate-700 capitalize leading-none">{site.siteName || 'Untitled Site'}</p>
                        <p className="text-[9px] font-bold text-slate-400 capitalize tracking-tighter">Radius: {site.radius || '-'}m</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {sites.length > 1 && (
                        <button onClick={() => removeSite(site.id)} className="!text-slate-300 hover:text-slate-500 !bg-transparent p-1"><X size={14} /></button>
                      )}
                      <ChevronUp size={16} className="text-slate-400" />
                    </div>
                  </div>

                  {/* Site Inputs & Map Container */}
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-[9px] font-black !text-slate-600 !capitalize tracking-widest mb-1 block">Site Name <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          placeholder="Enter Site Name" 
                          value={site.siteName}
                          onChange={(e) => updateSiteData(site.id, 'siteName', e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none" 
                        />
                      </div>
              
<div>
  <label className="text-[9px] font-black !text-slate-600 !capitalize tracking-widest mb-1 block">
    Address <span className="text-red-500">*</span>
  </label>
  <div className="relative">
    <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-300 z-10" size={14} />
    
    {isLoaded ? (
      <Autocomplete
        onLoad={(ref) => (site.autocomplete = ref)}
        onPlaceChanged={() => {
          if (site.autocomplete !== null) {
            const place = site.autocomplete.getPlace();
            if (place.geometry) {
              const newLat = place.geometry.location.lat();
              const newLng = place.geometry.location.lng();
              
              // This updates the text field and moves the map/pin
              updateSiteData(site.id, 'address', place.formatted_address);
              updateSiteData(site.id, 'lat', newLat);
              updateSiteData(site.id, 'lng', newLng);
            }
          }
        }}
      >
        <input 
          type="text" 
          placeholder="Search Address" 
          value={site.address}
          onChange={(e) => updateSiteData(site.id, 'address', e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-400" 
        />
      </Autocomplete>
    ) : (
      <input 
        disabled 
        className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs" 
        placeholder="Loading Map..."
      />
    )}
  </div>
</div>
                      <div>
                        <label className="text-[9px] font-black !text-slate-600 !capitalize tracking-widest mb-1 block">Radius (in meters) <span className="text-red-500">*</span></label>
                        <input 
                          type="number" 
                          placeholder="Enter Radius" 
                          value={site.radius}
                          onChange={(e) => updateSiteData(site.id, 'radius', e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none" 
                        />
                      </div>
                    </div>

                    {/* Map Integration */}
                    <div className="h-48 bg-slate-100 rounded-xl border border-slate-200 relative overflow-hidden group">
                      {isLoaded ? (
                        <GoogleMap
                          mapContainerStyle={containerStyle}
                          center={{ lat: Number(site.lat), lng: Number(site.lng) }}
                          zoom={15}
                          options={{ disableDefaultUI: true, zoomControl: true }}
                        >
                          <Marker 
                            position={{ lat: Number(site.lat), lng: Number(site.lng) }}
                            draggable={true}
                            onDragEnd={(e) => handlePinDrag(site.id, e.latLng.lat(), e.latLng.lng())}
                          />
                          <Circle 
                            center={{ lat: Number(site.lat), lng: Number(site.lng) }}
                            radius={Number(site.radius)}
                            options={{ fillColor: '#3b82f6', fillOpacity: 0.1, strokeColor: '#3b82f6', strokeOpacity: 0.8, strokeWeight: 1 }}
                          />
                        </GoogleMap>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-200/50 backdrop-blur-[1px]">
                             <Navigation size={24} className="text-slate-400 animate-pulse mb-2" />
                             <span className="text-[9px] font-black text-slate-500 capitalize tracking-widest">Loading Google Maps...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <button 
                onClick={addSite}
                className="flex items-center gap-2 px-3 py-2 !bg-blue-50 !text-blue-600 rounded-xl hover:!bg-blue-100 transition-colors border !border-blue-100"
              >
                <Plus size={14} strokeWidth={3} />
                <span className="text-[10px] font-black capitalize tracking-widest">Add Site</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-3 flex justify-end gap-3 px-6 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
{/*          <button className="px-8 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50">Cancel</button> */}
         <button className="px-10 py-2 !bg-white !text-blue-600 rounded-xl border border-blue-600 text-sm font-bold hover:!bg-white transition-all shadow-sm">Save</button>
      </div>
    </div>
  );
};

export default CreateGeoLocation;