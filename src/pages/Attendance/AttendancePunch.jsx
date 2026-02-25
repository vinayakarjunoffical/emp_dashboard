import React, { useState, useEffect, useRef } from "react";
import { 
  Camera, MapPin, CheckCircle, Clock, ShieldCheck, 
  RotateCcw, Fingerprint, Loader2, ArrowRightLeft, X, 
  ChevronUp, Globe
} from "lucide-react";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import toast from "react-hot-toast";

const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Helper component to recenter map
const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.setView([lat, lng], 18);
  }, [lat, lng, map]);
  return null;
};

const AttendanceTerminal = ({ employeeId = "1" }) => {
  const [status, setStatus] = useState("not_checked_in");
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [showMap, setShowMap] = useState(false); 
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    captureLocation();
  }, []);

  useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(new Date());
  }, 1000);

  return () => clearInterval(timer); // Cleanup on unmount
}, []);

  const captureLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => toast.error("GPS required"),
        { enableHighAccuracy: true }
      );
    }
  };

  const startCamera = async () => {
    setCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      toast.error("Camera denied");
      setCameraActive(false);
    }
  };

  const takeSelfie = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const data = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedImage(data);
    const stream = video.srcObject;
    stream.getTracks().forEach(track => track.stop());
    setCameraActive(false);
  };

  const handlePunchRegistry = async () => {
    if (!capturedImage) return toast.error("Selfie required");
    setLoading(true);
    const punchType = status === "not_checked_in" ? "in" : "out";
    const loadingToast = toast.loading(`sending ...`);

    try {
      const apiData = new FormData();
      apiData.append("punch_type", punchType);
      apiData.append("latitude", location.lat.toString());
      apiData.append("longitude", location.lng.toString());
      apiData.append("remarks", `Terminal Sync - Mobile`);
      const responseBlob = await fetch(capturedImage);
      const blob = await responseBlob.blob();
      apiData.append("picture", blob, "selfie.jpg");

      const response = await fetch(
        `https://apihrr.goelectronix.co.in/employees/${employeeId}/attendance/punch`,
        { method: "POST", body: apiData }
      );

      if (response.ok) {
        toast.success(`Protocol Success`, { id: loadingToast });
        setStatus(punchType === "in" ? "working" : "not_checked_in");
        setCapturedImage(null);
      } else {
        const result = await response.json();
        toast.error(result.detail || "Rejected", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Sync Failed", { id: loadingToast });
    } finally { setLoading(false); }
  };

  return (
    /* h-screen + overflow-hidden prevents scrolling of the whole page */
    <div className="max-w-md mx-auto h-screen max-h-screen bg-[#F8FAFC] flex flex-col antialiased relative overflow-hidden">
      
      {/* HEADER SECTION - FIXED SIZE */}
      <div className="bg-white px-6 py-6 border-b border-slate-200 rounded-b-[2.5rem] shadow-sm shrink-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md">
            <Fingerprint size={22} />
          </div>
          {/* <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-100 text-blue-600">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Secure Registry</span>
          </div> */}
        </div>
        {/* <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">Good Morning, Raj 👋</h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
          <Clock size={12} /> {new Date().toLocaleDateString('en-GB')} • 09:12 AM
        </p> */}
        <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">
  {currentTime.getHours() < 12 ? "Good Morning" : currentTime.getHours() < 17 ? "Good Afternoon" : "Good Evening"}, Raj
</h2>

<p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
  <Clock size={12} className="text-blue-500" /> 
  {currentTime.toLocaleDateString('en-GB', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  })} 
  <span className="text-slate-200 mx-1">•</span> 
  {currentTime.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: true 
  })}
</p>
      </div>

      {/* BODY SECTION - FLEX GROW TO FILL SPACE */}
      <div className="flex-1 p-6 flex flex-col gap-5 overflow-hidden">
        
        {/* STATUS BAR */}
        {/* <div className={`p-4 rounded-2xl border flex items-center justify-between shrink-0 ${status === 'working' ? 'bg-emerald-50 border-emerald-100' : 'bg-blue-50 border-blue-100'}`}>
           <div className="flex items-center gap-3">
             <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-white ${status === 'working' ? 'bg-emerald-500' : 'bg-blue-500'}`}>
               {status === 'working' ? <CheckCircle size={18} /> : <Loader2 className="animate-spin" size={18} />}
             </div>
             <div>
               <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-0.5">System Status</p>
               <p className="text-xs font-bold text-slate-900">{status === 'working' ? 'Active: Working' : 'Ready for Ingestion'}</p>
             </div>
           </div>
        </div> */}

        {/* SELFIE VIEWPORT - TAKES REMAINING SPACE */}
        <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-200 p-5 shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center gap-4 overflow-hidden relative">
          {capturedImage ? (
            <div className="relative w-full h-full animate-in zoom-in-95 duration-300">
              <img src={capturedImage} className="w-full h-full rounded-[2rem] border-2 border-slate-50 object-cover shadow-inner" alt="Captured" />
              <button onClick={() => setCapturedImage(null)} className="absolute -top-2 -right-2 bg-slate-900 text-white p-2 rounded-full shadow-xl border-2 border-white">
                <RotateCcw size={16} />
              </button>
            </div>
          ) : (
            <div className="w-full max-h-[80%] h-full bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 gap-2">
              <Camera size={40} strokeWidth={1} />
              <span className="text-[9px] font-black uppercase tracking-widest">Scanner Standby</span>
            </div>
          )}

          {!capturedImage && (
            <button onClick={startCamera} className="absolute bottom-6 px-8 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">
              Launch Scanner
            </button>
          )}
        </div>

        {/* SMART GEO STRIP */}
        <button 
          onClick={() => setShowMap(true)}
          className="shrink-0 w-full bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-4 text-left">
            <MapPin size={20} className={location.lat ? "text-emerald-400" : "text-blue-400 animate-pulse"} />
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Location Map</p>
              <p className="text-[11px] font-bold tracking-tight">{location.lat ? "Fetch the map data" : "Fetch Location..."}</p>
            </div>
          </div>
          <ChevronUp size={18} className="text-slate-400 animate-bounce" />
        </button>
      </div>

      {/* FOOTER ACTION BUTTON - FIXED SIZE */}
      <div className="p-6 bg-white border-t border-slate-100 shrink-0">
        <button
          disabled={loading || (!capturedImage && status === 'not_checked_in')}
          onClick={handlePunchRegistry}
          className={`w-full py-5 rounded-[1.5rem] text-[13px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${
            status === 'working' ? 'bg-red-600 text-white shadow-red-100' : 'bg-emerald-600 text-white shadow-emerald-100 disabled:opacity-30'
          }`}
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : status === 'working' ? 'Punch Out' : 'Punch In'}
        </button>
      </div>

      {/* SLIDING MAP PANEL */}
      <div className={`fixed inset-x-0 bottom-0 z-[120] bg-white rounded-t-[3.5rem] shadow-[0_-20px_40px_rgba(0,0,0,0.15)] border-t border-slate-200 transition-transform duration-500 ease-out flex flex-col h-[70vh] ${showMap ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="flex flex-col h-full pt-4 px-6 pb-8">
          <div className="w-12 h-1.5 bg-slate-100 rounded-full mb-6 mx-auto shrink-0" />
          
          <div className="flex justify-between items-center w-full mb-6 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Globe size={20} /></div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Location</h3>
            </div>
            <button onClick={() => setShowMap(false)} className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><X size={20} /></button>
          </div>

          <div className="flex-1 rounded-[2.5rem] overflow-hidden border border-slate-200 bg-slate-100 relative shadow-inner">
            {location.lat && location.lng ? (
              <MapContainer 
                center={[location.lat, location.lng]} 
                zoom={18} 
                className="h-full w-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[location.lat, location.lng]} icon={customIcon} />
                <RecenterMap lat={location.lat} lng={location.lng} />
              </MapContainer>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                <Loader2 className="animate-spin mr-2" /> Loading...
              </div>
            )}
          </div>

        </div>
      </div>

      {/* CAMERA OVERLAY */}
      {cameraActive && (
        <div className="fixed inset-0 bg-black z-[150] flex flex-col">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-12 z-[110]">
            <button onClick={() => { const s = videoRef.current.srcObject; if(s) s.getTracks().forEach(t => t.stop()); setCameraActive(false); }} className="text-white text-xs font-black uppercase">Cancel</button>
            <button onClick={takeSelfie} className="h-20 w-20 bg-white rounded-full border-8 border-white/30 flex items-center justify-center active:scale-90 transition-transform">
              <div className="h-14 w-14 rounded-full border-2 border-slate-900 bg-white" />
            </button>
            <div className="w-12" />
          </div>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default AttendanceTerminal;
//************************************************************************************************************************* */
// import React, { useState, useEffect, useRef } from "react";
// import {
//   Camera,
//   MapPin,
//   CheckCircle,
//   Clock,
//   ShieldCheck,
//   RotateCcw,
//   Fingerprint,
//   Loader2,
//   ArrowRightLeft,
//   X,
//   ChevronUp,
//   ChevronDown,
//   Globe,
// } from "lucide-react";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
// import toast from "react-hot-toast";

// // Fix for default Leaflet icon not showing in React
// const customIcon = new L.Icon({
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// const AttendanceTerminal = ({ employeeId = "1" }) => {
//   const [status, setStatus] = useState("not_checked_in");
//   const [loading, setLoading] = useState(false);
//   const [cameraActive, setCameraActive] = useState(false);
//   const [capturedImage, setCapturedImage] = useState(null);
//   const [location, setLocation] = useState({ lat: null, lng: null });
//   const [showMap, setShowMap] = useState(false); // 🆕 Map Overlay State

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     captureLocation();
//   }, []);

//   const captureLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (pos) =>
//           setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
//         () => toast.error("GPS required for node registry"),
//         { enableHighAccuracy: true },
//       );
//     }
//   };

//   const startCamera = async () => {
//     setCameraActive(true);
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           facingMode: "user",
//           width: { ideal: 1280 },
//           height: { ideal: 720 },
//         },
//       });
//       if (videoRef.current) videoRef.current.srcObject = stream;
//     } catch (err) {
//       toast.error("Camera access denied");
//       setCameraActive(false);
//     }
//   };

//   const takeSelfie = () => {
//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     const context = canvas.getContext("2d");
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);
//     const data = canvas.toDataURL("image/jpeg", 0.9);
//     setCapturedImage(data);
//     const stream = video.srcObject;
//     stream.getTracks().forEach((track) => track.stop());
//     setCameraActive(false);
//   };

//   const handlePunchRegistry = async () => {
//     if (!capturedImage) return toast.error("Selfie required");
//     setLoading(true);
//     const punchType = status === "not_checked_in" ? "in" : "out";
//     const loadingToast = toast.loading(
//       `Synchronizing ${punchType.toUpperCase()}...`,
//     );

//     try {
//       const apiData = new FormData();
//       apiData.append("punch_type", punchType);
//       apiData.append("latitude", location.lat.toString());
//       apiData.append("longitude", location.lng.toString());
//       apiData.append("remarks", `Terminal Registry via Mobile`);
//       const responseBlob = await fetch(capturedImage);
//       const blob = await responseBlob.blob();
//       apiData.append("picture", blob, "selfie.jpg");

//       const response = await fetch(
//         `https://apihrr.goelectronix.co.in/employees/${employeeId}/attendance/punch`,
//         { method: "POST", body: apiData },
//       );

//       if (response.ok) {
//         toast.success(`Protocol ${punchType.toUpperCase()} Complete`, {
//           id: loadingToast,
//         });
//         setStatus(punchType === "in" ? "working" : "not_checked_in");
//         setCapturedImage(null);
//       } else {
//         const result = await response.json();
//         toast.error(result.detail || "Registry Rejection", {
//           id: loadingToast,
//         });
//       }
//     } catch (err) {
//       toast.error("Sync Failed", { id: loadingToast });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const RecenterMap = ({ lat, lng }) => {
//     const map = useMap();
//     useEffect(() => {
//       if (lat && lng) map.setView([lat, lng], 18);
//     }, [lat, lng, map]);
//     return null;
//   };

//   return (
//     <div className="max-w-md mx-auto min-h-screen bg-[#F8FAFC] flex flex-col antialiased relative overflow-hidden">
//       {/* HEADER SECTION */}
//       <div className="bg-white px-6 py-8 border-b border-slate-200 rounded-b-[2.5rem] shadow-sm z-10">
//         <div className="flex justify-between items-center mb-6">
//           <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
//             <Fingerprint size={24} />
//           </div>
//           <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-100 text-blue-600">
//             <ShieldCheck size={14} />
//             <span className="text-[10px] font-black uppercase tracking-widest">
//               Secure Registry
//             </span>
//           </div>
//         </div>
//         <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
//           Good Morning, Raj 👋
//         </h2>
//         <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
//           <Clock size={12} /> {new Date().toLocaleDateString("en-GB")} •{" "}
//           {new Date().toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           })}
//         </p>
//       </div>

//       {/* BODY SECTION */}
//       <div className="flex-1 p-6 space-y-6 pb-32">
//         <div
//           className={`p-4 rounded-2xl border flex items-center justify-between transition-all duration-500 ${status === "working" ? "bg-emerald-50 border-emerald-100" : "bg-blue-50 border-blue-100"}`}
//         >
//           <div className="flex items-center gap-3">
//             <div
//               className={`h-8 w-8 rounded-lg flex items-center justify-center text-white ${status === "working" ? "bg-emerald-500" : "bg-blue-500"}`}
//             >
//               {status === "working" ? (
//                 <CheckCircle size={18} />
//               ) : (
//                 <Loader2 className="animate-spin" size={18} />
//               )}
//             </div>
//             <div className="leading-none">
//               <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-1">
//                 System Status
//               </p>
//               <p className="text-xs font-bold text-slate-900">
//                 {status === "working" ? "Active: Working" : "Ready to Punch In"}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* SELFIE VIEWPORT */}
//         <div className="bg-white rounded-[2.5rem] border border-slate-200 p-6 shadow-xl shadow-slate-200/50 flex flex-col items-center gap-6 overflow-hidden relative">
//           {capturedImage ? (
//             <div className="relative w-full animate-in zoom-in-95 duration-300">
//               <img
//                 src={capturedImage}
//                 className="w-full h-auto rounded-[2rem] border-4 border-slate-50 shadow-lg object-contain"
//                 alt="Captured"
//               />
//               <button
//                 onClick={() => setCapturedImage(null)}
//                 className="absolute -top-2 -right-2 bg-slate-900 text-white p-2 rounded-full shadow-xl border-2 border-white"
//               >
//                 <RotateCcw size={16} />
//               </button>
//             </div>
//           ) : (
//             <div className="h-48 w-full bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 gap-2">
//               <Camera size={40} strokeWidth={1} />
//               <span className="text-[9px] font-black uppercase tracking-widest">
//                 Scanner Standby
//               </span>
//             </div>
//           )}

//           {!capturedImage && (
//             <button
//               onClick={startCamera}
//               className="px-8 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-100 active:scale-95 transition-all"
//             >
//               Launch Scanner
//             </button>
//           )}
//         </div>

//         {/* 🆕 SMART GEO STRIP (No numbers, just status + Up Arrow) */}
//         <button
//           onClick={() => setShowMap(true)}
//           className="w-full bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between hover:bg-slate-800 transition-all group active:scale-[0.98]"
//         >
//           <div className="flex items-center gap-4">
//             <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center">
//               <MapPin
//                 size={20}
//                 className={
//                   location.lat
//                     ? "text-emerald-400"
//                     : "text-blue-400 animate-pulse"
//                 }
//               />
//             </div>
//             <div className="text-left">
//               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
//                 Location Map
//               </p>
//               <p className="text-[11px] font-bold tracking-tight">
//                 {location.lat ? "Fetch The Location" : "Fetch Signal..."}
//               </p>
//             </div>
//           </div>
//           <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10">
//             <ChevronUp size={18} className="text-slate-400 animate-bounce" />
//           </div>
//         </button>
//       </div>

//       {/* FOOTER ACTION */}
//       <div className="p-6 bg-white border-t border-slate-100 z-10">
//         <button
//           disabled={loading || (!capturedImage && status === "not_checked_in")}
//           onClick={handlePunchRegistry}
//           className={`w-full py-5 rounded-[1.5rem] text-[13px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${
//             status === "working"
//               ? "bg-red-600 text-white shadow-red-100"
//               : "bg-emerald-600 text-white shadow-emerald-100 disabled:opacity-30"
//           }`}
//         >
//           {loading ? (
//             <Loader2 className="animate-spin" size={20} />
//           ) : (
//             <>
//               <ArrowRightLeft size={18} />{" "}
//               {status === "working" ? "Punch Out" : "Punch In"}
//             </>
//           )}
//         </button>
//       </div>

//       {/* 🆕 SLIDING MAP REGISTRY PANEL */}
//       {/* <div className={`fixed inset-x-0 bottom-0 z-[120] bg-white rounded-t-[3.5rem] shadow-[0_-20px_40px_rgba(0,0,0,0.1)] border-t border-slate-200 transition-transform duration-500 ease-out flex flex-col overflow-hidden ${showMap ? 'translate-y-0' : 'translate-y-full'}`}>
//         <div className="flex flex-col items-center pt-4 pb-6 px-6">
//           <div className="w-12 h-1.5 bg-slate-100 rounded-full mb-6" />
//           <div className="flex justify-between items-center w-full mb-6">
//             <div className="flex items-center gap-3">
//               <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Globe size={20} /></div>
//               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Geofence Registry</h3>
//             </div>
//             <button onClick={() => setShowMap(false)} className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><X size={20} /></button>
//           </div>

//           <div className="w-full h-80 rounded-[2.5rem] overflow-hidden border border-slate-200 bg-slate-50 relative group">
//             {location.lat ? (
//               <iframe
//                 title="Location Verification"
//                 width="100%"
//                 height="100%"
//                 frameBorder="0"
//                 style={{ border: 0 }}
//                 src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${location.lat},${location.lng}&zoom=18`}
//                 allowFullScreen
//               ></iframe>
//             ) : (
//               <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
//                 <Loader2 className="animate-spin text-blue-600" size={24} />
//                 <span className="text-[10px] font-black uppercase text-slate-400">Locking Coordinates...</span>
//               </div>
//             )}
//           </div>
          
//           <div className="mt-8 w-full space-y-2 px-2">
//              <div className="flex justify-between items-center py-3 border-b border-slate-50">
//                 <span className="text-[10px] font-black text-slate-400 uppercase">Latitude</span>
//                 <span className="text-[11px] font-bold text-slate-900">{location.lat?.toFixed(6)}</span>
//              </div>
//              <div className="flex justify-between items-center py-3 border-b border-slate-50">
//                 <span className="text-[10px] font-black text-slate-400 uppercase">Longitude</span>
//                 <span className="text-[11px] font-bold text-slate-900">{location.lng?.toFixed(6)}</span>
//              </div>
//           </div>

//           <button 
//             onClick={() => setShowMap(false)}
//             className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl"
//           >
//             Confirm Node Position
//           </button>
//         </div>
//       </div> */}

//       {/* SLIDING MAP REGISTRY PANEL */}
//       <div
//         className={`fixed inset-x-0 bottom-0 z-[120] bg-white rounded-t-[3.5rem] shadow-[0_-20px_40px_rgba(0,0,0,0.1)] border-t border-slate-200 transition-transform duration-500 ease-out flex flex-col overflow-hidden ${showMap ? "translate-y-0" : "translate-y-full"}`}
//       >
//         <div className="flex flex-col items-center pt-4 pb-6 px-6">
//           <div className="w-12 h-1.5 bg-slate-100 rounded-full mb-6" />

//           <div className="flex justify-between items-center w-full mb-6">
//             <div className="flex items-center gap-3">
//               <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
//                 <Globe size={20} />
//               </div>
//               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
//                 Location Map
//               </h3>
//             </div>
//             <button
//               onClick={() => setShowMap(false)}
//               className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
//             >
//               <X size={20} />
//             </button>
//           </div>

//           {/* FREE MAP ENGINE (Leaflet + OpenStreetMap) */}
//           <div className="w-full h-80 rounded-[2.5rem] overflow-hidden border border-slate-200 bg-slate-100 relative shadow-inner">
//             {location.lat && location.lng ? (
//               <MapContainer
//                 center={[location.lat, location.lng]}
//                 zoom={18}
//                 scrollWheelZoom={false}
//                 className="h-full w-full z-0"
//               >
//                 <TileLayer
//                   attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 />
//                 <Marker
//                   position={[location.lat, location.lng]}
//                   icon={customIcon}
//                 />
//                 <RecenterMap lat={location.lat} lng={location.lng} />
//               </MapContainer>
//             ) : (
//               <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
//                 <Loader2 className="animate-spin text-blue-600" size={32} />
//                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest animate-pulse">
//                   Syncing Satellite Data...
//                 </p>
//               </div>
//             )}

//             {/* Visual Map Overlay Overlay for Enterprise feel */}
//             <div className="absolute top-4 right-4 z-[400] bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 pointer-events-none">
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
//                 <span className="text-[8px] font-black text-slate-700 uppercase tracking-tighter">
//                   Live Signal
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* COORDINATE READOUT */}
//           {/* <div className="mt-8 w-full space-y-2 px-2">
//        <div className="flex justify-between items-center py-4 border-b border-slate-100 group">
//           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors">Registry Latitude</span>
//           <span className="text-xs font-mono font-bold text-slate-900 bg-slate-50 px-3 py-1 rounded-md">{location.lat?.toFixed(6)}° N</span>
//        </div>
//        <div className="flex justify-between items-center py-4 border-b border-slate-100 group">
//           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors">Registry Longitude</span>
//           <span className="text-xs font-mono font-bold text-slate-900 bg-slate-50 px-3 py-1 rounded-md">{location.lng?.toFixed(6)}° E</span>
//        </div>
//     </div> */}

//           {/* <button 
//       onClick={() => setShowMap(false)}
//       className="mt-10 w-full py-5 bg-slate-900 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-black active:scale-[0.98] transition-all"
//     >
//       Confirm Node Position
//     </button> */}
//         </div>
//       </div>

//       {/* CAMERA OVERLAY - PRESERVED FROM PREVIOUS CODE */}
//       {cameraActive && (
//         <div className="fixed inset-0 bg-black z-[150] flex flex-col">
//           <video
//             ref={videoRef}
//             autoPlay
//             playsInline
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-12 z-[110]">
//             <button
//               onClick={() => {
//                 const s = videoRef.current.srcObject;
//                 s.getTracks().forEach((t) => t.stop());
//                 setCameraActive(false);
//               }}
//               className="text-white text-[10px] font-black uppercase tracking-widest"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={takeSelfie}
//               className="h-20 w-20 bg-white rounded-full border-8 border-white/30 flex items-center justify-center active:scale-90 transition-transform shadow-2xl"
//             >
//               <div className="h-14 w-14 rounded-full border-2 border-slate-900 bg-white" />
//             </button>
//             <div className="w-12" />
//           </div>
//         </div>
//       )}
//       <canvas ref={canvasRef} className="hidden" />
//     </div>
//   );
// };

// export default AttendanceTerminal;
//********************************************working code pahse 1 23/02/26*************************************************************** */
// import React, { useState, useEffect, useRef } from "react";
// import {
//   Camera, MapPin, CheckCircle, Clock, ShieldCheck,
//   RotateCcw, Fingerprint, Loader2, ArrowRightLeft, X
// } from "lucide-react";
// import toast from "react-hot-toast";

// const AttendanceTerminal = ({ employeeId = "1" }) => {
//   const [status, setStatus] = useState("not_checked_in"); // 'not_checked_in' or 'working'
//   const [loading, setLoading] = useState(false);
//   const [cameraActive, setCameraActive] = useState(false);
//   const [capturedImage, setCapturedImage] = useState(null);
//   const [location, setLocation] = useState({ lat: null, lng: null });

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     captureLocation();
//   }, []);

//   const captureLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
//         () => toast.error("Geolocation access required")
//       );
//     }
//   };

//   const startCamera = async () => {
//     setCameraActive(true);
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } }
//       });
//       if (videoRef.current) videoRef.current.srcObject = stream;
//     } catch (err) {
//       toast.error("Camera access denied");
//       setCameraActive(false);
//     }
//   };

//   const takeSelfie = () => {
//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     const context = canvas.getContext("2d");
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);
//     const data = canvas.toDataURL("image/jpeg", 0.9);
//     setCapturedImage(data);

//     // Stop tracks
//     const stream = video.srcObject;
//     stream.getTracks().forEach(track => track.stop());
//     setCameraActive(false);
//   };

//   // API SYNC LOGIC
// //   const handlePunchRegistry = async () => {
// //     if (!capturedImage) return toast.error("Selfie verification required");
// //     if (!location.lat || !location.lng) return toast.error("Awaiting valid coordinates");

// //     setLoading(true);
// //     // Logic: If status is not_checked_in, we are punching 'in'. If working, we are punching 'out'.
// //     const punchType = status === "not_checked_in" ? "in" : "out";
// //     const loadingToast = toast.loading(`Committing ${punchType.toUpperCase()} registry...`);

// //     try {
// //       // Create Multipart Form Data
// //       const apiData = new FormData();

// //       // 1. Append Punch Type (String: 'in' or 'out')
// //       apiData.append("punch_type", punchType);

// //       // 2. Append Coordinates (Numbers)
// //       apiData.append("latitude", location.lat);
// //       apiData.append("longitude", location.lng);

// //       // 3. Append Remarks
// //       apiData.append("remarks", `Mobile Terminal Registry - ${new Date().toISOString()}`);

// //       // 4. Convert Base64 Preview to actual Binary File for 'picture' key
// //       const blob = await fetch(capturedImage).then(r => r.blob());
// //       apiData.append("picture", blob, "verification_selfie.jpg");

// //       // POST Request execution
// //       const response = await fetch(
// //         `https://apihrr.goelectronix.co.in/employees/${employeeId}/attendance/punch`,
// //         {
// //           method: "POST",
// //           body: apiData // Fetch automatically sets content-type to multipart/form-data
// //         }
// //       );

// //       if (response.ok) {
// //         toast.success(`Protocol ${punchType.toUpperCase()} Complete ✔`, { id: loadingToast });
// //         // Toggle working state
// //         setStatus(punchType === "in" ? "working" : "not_checked_in");
// //         setCapturedImage(null);
// //       } else {
// //         const errorData = await response.json();
// //         throw new Error(errorData.message || "Registry Rejected");
// //       }
// //     } catch (err) {
// //       toast.error(`Sync Failed: ${err.message}`, { id: loadingToast });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
// // API SYNC LOGIC
// // API SYNC LOGIC with Enhanced Accuracy
//   const handlePunchRegistry = async () => {
//     if (!capturedImage) return toast.error("Selfie verification required");

//     setLoading(true);

//     // Protocol: Force High Accuracy GPS to satisfy geofence requirements
//     navigator.geolocation.getCurrentPosition(
//       async (pos) => {
//         const { latitude, longitude } = pos.coords;
//         const punchType = status === "not_checked_in" ? "in" : "out";
//         const loadingToast = toast.loading(`Synchronizing ${punchType.toUpperCase()}...`);

//         try {
//           const apiData = new FormData();
//           apiData.append("punch_type", punchType);
//           apiData.append("latitude", latitude.toString());
//           apiData.append("longitude", longitude.toString());
//           apiData.append("remarks", `Terminal Sync - ${new Date().toISOString()}`);

//           // 🛠️ CRITICAL FIX: Convert Base64 to a standard Blob/File
//           const res = await fetch(capturedImage);
//           const blob = await res.blob();
//           const file = new File([blob], `selfie_${Date.now()}.jpg`, { type: "image/jpeg" });
//           apiData.append("picture", file);

//           // PROOF OF DATA IN CONSOLE
//           console.log("--- Syncing Payload ---");
//           for (let [key, value] of apiData.entries()) {
//             console.log(`${key}:`, value);
//           }

//           const apiResponse = await fetch(
//             `https://apihrr.goelectronix.co.in/employees/${employeeId}/attendance/punch`,
//             {
//               method: "POST",
//               body: apiData,
//               // DO NOT set headers manually. Browser must set boundary for multipart.
//             }
//           );

//           const result = await apiResponse.json();

//           if (apiResponse.ok) {
//             toast.success(`Registry Updated ✔`, { id: loadingToast });
//             setStatus(punchType === "in" ? "working" : "not_checked_in");
//             setCapturedImage(null);
//           } else {
//             // This is where your "Away from company" error is caught
//             console.error("Geofence Rejection:", result.detail);
//             toast.error(result.detail || "Location Error", { id: loadingToast, duration: 6000 });
//           }
//         } catch (err) {
//           console.error("Sync Error:", err);
//           toast.error("Registry Sync Failed", { id: loadingToast });
//         } finally {
//           setLoading(false);
//         }
//       },
//       (err) => {
//         setLoading(false);
//         toast.error("GPS Signal Denied. Please enable Location Services.");
//       },
//       {
//         enableHighAccuracy: true, // Forces phone to use GPS instead of Cell Towers
//         timeout: 10000,
//         maximumAge: 0
//       }
//     );
//   };

//   return (
//     <div className="max-w-md mx-auto min-h-screen bg-slate-50 flex flex-col antialiased font-sans">
//       {/* HEADER */}
//       <div className="bg-white px-6 py-8 border-b border-slate-200 rounded-b-[2.5rem] shadow-sm">
//         <div className="flex justify-between items-center mb-6">
//           <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-white"><Fingerprint size={24} /></div>
//           <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
//             <ShieldCheck size={14} className="text-blue-600" />
//             <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Secure Registry</span>
//           </div>
//         </div>
//         <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Good Morning, Raj 👋</h2>
//         <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
//           <Clock size={12} /> {new Date().toLocaleDateString('en-GB')} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//         </p>
//       </div>

//       <div className="flex-1 p-6 space-y-6">
//         {/* STATUS BAR */}
//         <div className={`p-4 rounded-2xl border flex items-center justify-between ${status === 'working' ? 'bg-emerald-50 border-emerald-100' : 'bg-blue-50 border-blue-100'}`}>
//            <div className="flex items-center gap-3">
//              <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-white ${status === 'working' ? 'bg-emerald-500' : 'bg-blue-500'}`}>
//                {status === 'working' ? <CheckCircle size={18} /> : <Loader2 className="animate-spin" size={18} />}
//              </div>
//              <div>
//                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">System Status</p>
//                <p className="text-xs font-bold text-slate-900">{status === 'working' ? 'Active: Working' : 'Ready to Punch In'}</p>
//              </div>
//            </div>
//         </div>

//         {/* VERIFICATION BOX */}
//         <div className="bg-white rounded-[2.5rem] border border-slate-200 p-6 shadow-xl shadow-slate-200/50 flex flex-col items-center gap-6 overflow-hidden">
//           {capturedImage ? (
//             <div className="relative w-full animate-in zoom-in-95 duration-300">
//               <img src={capturedImage} className="w-full h-auto rounded-[2rem] border-4 border-slate-50 shadow-lg object-contain" alt="Captured" />
//               <button onClick={() => setCapturedImage(null)} className="absolute -top-2 -right-2 bg-slate-900 text-white p-2 rounded-full shadow-xl border-2 border-white hover:bg-red-500 transition-all">
//                 <RotateCcw size={16} />
//               </button>
//             </div>
//           ) : (
//             <div className="h-48 w-full bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 gap-2">
//               <Camera size={40} strokeWidth={1} />
//               <span className="text-[9px] font-black uppercase tracking-widest">Biometric Identity Check</span>
//             </div>
//           )}

//           <div className="text-center space-y-1">
//             <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Selfie Verification</h4>
//             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Required for registry commit</p>
//           </div>

//           {!capturedImage && (
//             <button onClick={startCamera} className="px-8 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-100 active:scale-95 transition-all">
//               Launch Scanner
//             </button>
//           )}
//         </div>

//         {/* GEO LOCATION */}
//         <div className="bg-slate-900 rounded-2xl p-4 flex items-center gap-4 text-white">
//           <MapPin size={20} className="text-blue-400" />
//           <div className="min-w-0 flex-1">
//             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Coordinates</p>
//             <p className="text-[11px] font-bold truncate mt-1">
//               {location.lat ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` : "Locating Node..."}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* FOOTER ACTION BUTTON */}
//       <div className="p-6 bg-white border-t border-slate-100">
//         <button
//           disabled={loading || (!capturedImage && status === 'not_checked_in')}
//           onClick={handlePunchRegistry}
//           className={`w-full py-5 rounded-[1.5rem] text-[13px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${
//             status === 'working' ? 'bg-red-600 text-white shadow-red-100' : 'bg-emerald-600 text-white shadow-emerald-100 disabled:opacity-30'
//           }`}
//         >
//           {loading ? <Loader2 className="animate-spin" size={20} /> : <><ArrowRightLeft size={18} /> {status === 'working' ? 'Commit Punch Out' : 'Commit Punch In'}</>}
//         </button>
//       </div>

//       {/* CAMERA OVERLAY */}
//       {cameraActive && (
//         <div className="fixed inset-0 bg-black z-[100] flex flex-col">
//           <div className="absolute top-8 left-0 right-0 flex justify-center z-[110]">
//              <span className="bg-black/40 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.3em] px-6 py-2 rounded-full border border-white/20">Identity Verification</span>
//           </div>
//           <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
//           <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-12 z-[110]">
//             <button onClick={() => { const s = videoRef.current.srcObject; s.getTracks().forEach(t => t.stop()); setCameraActive(false); }} className="text-white text-[10px] font-black uppercase tracking-widest">Cancel</button>
//             <button onClick={takeSelfie} className="h-20 w-20 bg-white rounded-full border-8 border-white/30 flex items-center justify-center active:scale-90 transition-transform shadow-2xl">
//               <div className="h-14 w-14 rounded-full border-2 border-slate-900 bg-white" />
//             </button>
//             <div className="w-12" />
//           </div>
//         </div>
//       )}
//       <canvas ref={canvasRef} className="hidden" />
//     </div>
//   );
// };

// export default AttendanceTerminal;
//************************************************************************************************************* */
// import React, { useState, useEffect, useRef } from "react";
// import {
//   Camera, MapPin, CheckCircle, Clock, ShieldCheck,
//   RotateCcw, Fingerprint, Loader2, ArrowRightLeft, X
// } from "lucide-react";
// import toast from "react-hot-toast";

// const AttendanceTerminal = ({ employeeId = "1" }) => {
//   const [status, setStatus] = useState("not_checked_in");
//   const [loading, setLoading] = useState(false);
//   const [cameraActive, setCameraActive] = useState(false);
//   const [capturedImage, setCapturedImage] = useState(null);
//   const [location, setLocation] = useState({ lat: null, lng: null });

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     captureLocation();
//   }, []);

//   const captureLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
//         () => toast.error("Geolocation access required")
//       );
//     }
//   };

//   const startCamera = async () => {
//     setCameraActive(true);
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } }
//       });
//       if (videoRef.current) videoRef.current.srcObject = stream;
//     } catch (err) {
//       toast.error("Camera access denied");
//       setCameraActive(false);
//     }
//   };

//   const takeSelfie = () => {
//     const video = videoRef.current;
//     const canvas = canvasRef.current;

//     // Set canvas to actual video dimensions to avoid cropping/stretching
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;

//     const context = canvas.getContext("2d");
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);

//     const data = canvas.toDataURL("image/jpeg", 0.9);
//     setCapturedImage(data);

//     // Stop tracks
//     const stream = video.srcObject;
//     stream.getTracks().forEach(track => track.stop());
//     setCameraActive(false);
//   };

//   const handlePunchRegistry = async () => {
//     if (!capturedImage) return toast.error("Selfie verification required");
//     setLoading(true);
//     const punchType = status === "not_checked_in" ? "in" : "out";
//     const loadingToast = toast.loading(`Processing ${punchType.toUpperCase()}...`);

//     try {
//       const apiData = new FormData();
//       apiData.append("punch_type", punchType);
//       apiData.append("latitude", location.lat || 0);
//       apiData.append("longitude", location.lng || 0);
//       apiData.append("remarks", "Mobile Terminal");

//       const blob = await fetch(capturedImage).then(r => r.blob());
//       apiData.append("picture", blob, "selfie.jpg");

//       const response = await fetch(
//         `https://apihrr.goelectronix.co.in/employees/${employeeId}/attendance/punch`,
//         { method: "POST", body: apiData }
//       );

//       if (response.ok) {
//         toast.success(`Protocol ${punchType.toUpperCase()} Success`, { id: loadingToast });
//         setStatus(punchType === "in" ? "working" : "not_checked_in");
//         setCapturedImage(null);
//       } else { throw new Error(); }
//     } catch (err) {
//       toast.error("Sync Failed", { id: loadingToast });
//     } finally { setLoading(false); }
//   };

//   return (
//     <div className="max-w-md mx-auto min-h-screen bg-slate-50 flex flex-col antialiased">
//       {/* HEADER SECTION */}
//       <div className="bg-white px-6 py-8 border-b border-slate-200 rounded-b-[2.5rem] shadow-sm">
//         <div className="flex justify-between items-center mb-6">
//           <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-white"><Fingerprint size={24} /></div>
//           <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
//             <ShieldCheck size={14} className="text-blue-600" />
//             <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Secure Registry</span>
//           </div>
//         </div>
//         <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Good Morning, Raj 👋</h2>
//         <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
//           <Clock size={12} /> {new Date().toLocaleDateString('en-GB')} • 09:12 AM
//         </p>
//       </div>

//       <div className="flex-1 p-6 space-y-6">
//         {/* STATUS BAR */}
//         <div className={`p-4 rounded-2xl border flex items-center justify-between ${status === 'working' ? 'bg-emerald-50 border-emerald-100' : 'bg-blue-50 border-blue-100'}`}>
//            <div className="flex items-center gap-3">
//              <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-white ${status === 'working' ? 'bg-emerald-500' : 'bg-blue-500'}`}>
//                {status === 'working' ? <CheckCircle size={18} /> : <Loader2 className="animate-spin" size={18} />}
//              </div>
//              <div>
//                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">System Status</p>
//                <p className="text-xs font-bold text-slate-900">{status === 'working' ? 'Active: Working' : 'Ready to Punch In'}</p>
//              </div>
//            </div>
//         </div>

//         {/* VERIFICATION BOX */}
//         <div className="bg-white rounded-[2.5rem] border border-slate-200 p-6 shadow-xl shadow-slate-200/50 flex flex-col items-center gap-6 overflow-hidden">
//           {capturedImage ? (
//             <div className="relative w-full animate-in zoom-in-95 duration-300">
//               {/* REMOVED rounded-full TO SHOW FULL IMAGE */}
//               <img src={capturedImage} className="w-full h-auto rounded-[2rem] border-4 border-slate-50 shadow-lg object-contain" alt="Captured" />
//               <button onClick={() => setCapturedImage(null)} className="absolute -top-2 -right-2 bg-slate-900 text-white p-2 rounded-full shadow-xl border-2 border-white hover:bg-red-500 transition-all">
//                 <RotateCcw size={16} />
//               </button>
//             </div>
//           ) : (
//             <div className="h-48 w-full bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 gap-2">
//               <Camera size={40} strokeWidth={1} />
//               <span className="text-[9px] font-black uppercase tracking-widest">Biometric Identity Check</span>
//             </div>
//           )}

//           <div className="text-center space-y-1">
//             <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Selfie Verification</h4>
//             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Required for registry commit</p>
//           </div>

//           {!capturedImage && (
//             <button onClick={startCamera} className="px-8 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-100 active:scale-95 transition-all">
//               Launch Scanner
//             </button>
//           )}
//         </div>

//         {/* GEO LOCATION */}
//         <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-4">
//           <MapPin size={20} className="text-slate-400" />
//           <div className="min-w-0 flex-1">
//             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Coordinates</p>
//             <p className="text-[11px] font-bold text-slate-700 truncate mt-1">
//               {location.lat ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` : "Locating Node..."}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* FIXED FOOTER BUTTON */}
//       <div className="p-6 bg-white border-t border-slate-100">
//         <button
//           disabled={loading || (!capturedImage && status === 'not_checked_in')}
//           onClick={handlePunchRegistry}
//           className={`w-full py-5 rounded-[1.5rem] text-[13px] font-black uppercase tracking-[0.2em] shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 ${
//             status === 'working' ? 'bg-red-600 text-white shadow-red-100' : 'bg-emerald-600 text-white shadow-emerald-100 disabled:opacity-30'
//           }`}
//         >
//           {loading ? <Loader2 className="animate-spin" size={20} /> : <><ArrowRightLeft size={18} /> {status === 'working' ? 'Commit Punch Out' : 'Commit Punch In'}</>}
//         </button>
//       </div>

//       {/* FULLSCREEN CAMERA OVERLAY - FIXED POSITION FOR MOBILE */}
//       {cameraActive && (
//         <div className="fixed inset-0 bg-black z-[100] flex flex-col">
//           <div className="absolute top-8 left-0 right-0 flex justify-center z-[110]">
//              <span className="bg-black/40 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.3em] px-6 py-2 rounded-full border border-white/20">Identity Verification</span>
//           </div>

//           <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />

//           {/* CAMERA CONTROLS - Positioned at bottom center */}
//           <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-12 z-[110]">
//             <button onClick={() => { const s = videoRef.current.srcObject; s.getTracks().forEach(t => t.stop()); setCameraActive(false); }} className="text-white text-[10px] font-black uppercase tracking-widest">Cancel</button>

//             <button
//               onClick={takeSelfie}
//               className="h-20 w-20 bg-white rounded-full border-8 border-white/30 flex items-center justify-center active:scale-90 transition-transform shadow-2xl"
//             >
//               <div className="h-14 w-14 rounded-full border-2 border-slate-900 bg-white" />
//             </button>

//             <div className="w-12" /> {/* Layout Balance */}
//           </div>
//         </div>
//       )}
//       <canvas ref={canvasRef} className="hidden" />
//     </div>
//   );
// };

// export default AttendanceTerminal;
//**************************************************************************************************************** */
// import React, { useState, useEffect, useRef } from "react";
// import {
//   Camera, MapPin, CheckCircle, Clock, ShieldCheck,
//   RotateCcw, Fingerprint, Loader2, ArrowRightLeft
// } from "lucide-react";
// import toast from "react-hot-toast";

// const AttendanceTerminal = ({ employeeId = "12" }) => {
//   const [status, setStatus] = useState("not_checked_in"); // not_checked_in | working
//   const [loading, setLoading] = useState(false);
//   const [cameraActive, setCameraActive] = useState(false);
//   const [capturedImage, setCapturedImage] = useState(null);
//   const [location, setLocation] = useState({ lat: null, lng: null });

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   // Initial Sync: Fetch current status if needed
//   useEffect(() => {
//     captureLocation();
//   }, []);

//   const captureLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
//         () => toast.error("Geolocation access required for registry")
//       );
//     }
//   };

//   const startCamera = async () => {
//     setCameraActive(true);
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
//       if (videoRef.current) videoRef.current.srcObject = stream;
//     } catch (err) {
//       toast.error("Camera access denied");
//       setCameraActive(false);
//     }
//   };

//   const takeSelfie = () => {
//     const context = canvasRef.current.getContext("2d");
//     context.drawImage(videoRef.current, 0, 0, 300, 300);
//     const data = canvasRef.current.toDataURL("image/jpeg");
//     setCapturedImage(data);

//     // Stop camera stream
//     const stream = videoRef.current.srcObject;
//     stream.getTracks().forEach(track => track.stop());
//     setCameraActive(false);
//   };

//   const handlePunchRegistry = async () => {
//     if (!capturedImage) return toast.error("Selfie verification required");

//     setLoading(true);
//     const punchType = status === "not_checked_in" ? "in" : "out";
//     const loadingToast = toast.loading(`Synchronizing ${punchType.toUpperCase()} node...`);

//     try {
//       const apiData = new FormData();
//       apiData.append("punch_type", punchType);
//       apiData.append("latitude", location.lat || 0);
//       apiData.append("longitude", location.lng || 0);
//       apiData.append("remarks", "Terminal Mobile Registry");

//       // Convert base64 to file blob
//       const blob = await fetch(capturedImage).then(r => r.blob());
//       apiData.append("picture", blob, "selfie.jpg");

//       const response = await fetch(
//         `https://apihrr.goelectronix.co.in/employees/${employeeId}/attendance/punch`,
//         { method: "POST", body: apiData }
//       );

//       if (response.ok) {
//         toast.success(`Protocol ${punchType.toUpperCase()} Complete ✔`, { id: loadingToast });
//         setStatus(punchType === "in" ? "working" : "not_checked_in");
//         setCapturedImage(null);
//       } else {
//         throw new Error();
//       }
//     } catch (err) {
//       toast.error("Registry Rejection: Sync Failed", { id: loadingToast });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto min-h-screen bg-slate-50 flex flex-col antialiased font-sans">
//       {/* HEADER SECTION */}
//       <div className="bg-white px-6 py-8 border-b border-slate-200 rounded-b-[2.5rem] shadow-sm">
//         <div className="flex justify-between items-center mb-6">
//           <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
//             <Fingerprint size={24} />
//           </div>
//           <div className="text-right">
//             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Security Status</p>
//             <div className="flex items-center gap-1.5 mt-1 justify-end text-blue-600">
//               <ShieldCheck size={14} />
//               <span className="text-[11px] font-black uppercase tracking-tight">Terminal Active</span>
//             </div>
//           </div>
//         </div>

//         <div className="space-y-1">
//           <h2 className="text-2xl font-black text-slate-900 tracking-tight">Good Morning, Raj 👋</h2>
//           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
//             <Clock size={12} className="text-blue-500" /> 17 Feb 2026 • 09:12:45 AM
//           </p>
//         </div>
//       </div>

//       {/* TERMINAL BODY */}
//       <div className="flex-1 p-6 space-y-6">

//         {/* STATUS INDICATOR STRIP */}
//         <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
//           status === 'working' ? 'bg-emerald-50 border-emerald-100' : 'bg-blue-50 border-blue-100'
//         }`}>
//           <div className="flex items-center gap-3">
//             <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
//               status === 'working' ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'
//             }`}>
//               {status === 'working' ? <CheckCircle size={18} /> : <Loader2 className="animate-spin" size={18} />}
//             </div>
//             <div>
//               <p className={`text-[10px] font-black uppercase tracking-widest ${
//                 status === 'working' ? 'text-emerald-700' : 'text-blue-700'
//               }`}>
//                 Current Registry
//               </p>
//               <p className="text-xs font-bold text-slate-900">
//                 {status === 'working' ? 'Shift Active: Working' : 'Status: Ready for Punch In'}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* VERIFICATION NODE (CAMERA/PREVIEW) */}
//         <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
//           <div className="flex flex-col items-center gap-6 relative z-10">
//             {capturedImage ? (
//               <div className="relative animate-in zoom-in-95 duration-500">
//                 <img src={capturedImage} className="w-full h-64 rounded-full border-4 border-white shadow-2xl object-cover ring-4 ring-slate-50" alt="Selfie Verification" />
//                 <button onClick={() => setCapturedImage(null)} className="absolute -right-2 -top-2 bg-slate-900 text-white p-2 rounded-full shadow-lg hover:bg-red-500 transition-all">
//                   <RotateCcw size={14} />
//                 </button>
//               </div>
//             ) : (
//               <div className="h-32 w-32 bg-slate-50 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300">
//                 <Camera size={40} strokeWidth={1.5} />
//               </div>
//             )}

//             <div className="text-center space-y-2">
//               <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Selfie Verification</h4>
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Required for node synchronization</p>
//             </div>

//             {!capturedImage && !cameraActive && (
//               <button
//                 onClick={startCamera}
//                 className="px-8 py-3 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-200 active:scale-95 transition-all"
//               >
//                 Launch Scanner
//               </button>
//             )}
//           </div>

//           {/* CAMERA OVERLAY */}
//           {/* {cameraActive && (
//             <div className="absolute inset-0 bg-slate-900 z-20 flex flex-col">
//               <video ref={videoRef} autoPlay playsInline className="flex-1 object-cover" />
//               <div className="p-6 bg-slate-900 flex justify-center items-center gap-8">
//                 <button onClick={() => setCameraActive(false)} className="text-white text-[10px] font-black uppercase">Cancel</button>
//                 <button
//                   onClick={takeSelfie}
//                   className="h-16 w-16 bg-white rounded-full border-4 border-slate-700 flex items-center justify-center active:scale-90 transition-all shadow-2xl"
//                 >
//                   <div className="h-12 w-12 rounded-full border-2 border-slate-900" />
//                 </button>
//                 <div className="w-10" />
//               </div>
//             </div>
//           )} */}

//           {cameraActive && (
//   <div className="absolute inset-0 bg-black z-50 flex flex-col">
//     <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" />

//     {/* Overlay Controls */}
//     <div className="absolute bottom-5 left-0 right-0 flex justify-center items-center gap-10">
//       <button
//         onClick={() => setCameraActive(false)}
//         className="text-white font-bold uppercase text-xs"
//       >
//         Cancel
//       </button>

//       <button
//         onClick={takeSelfie}
//         className="h-20 w-20 bg-white rounded-full border-8 border-slate-800 flex items-center justify-center shadow-2xl active:scale-90 transition-transform"
//       >
//         <div className="h-14 w-14 rounded-full border-2 border-slate-900 bg-slate-100" />
//       </button>

//       <div className="w-12" /> {/* Visual Spacer */}
//     </div>
//   </div>
// )}
//           <canvas ref={canvasRef} width="300" height="100" className="hidden" />
//         </div>

//         {/* GEOLOCATION NODE */}
//         <div className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 flex items-center gap-4">
//           <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">
//             <MapPin size={20} />
//           </div>
//           <div>
//             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Registry Coordinates</p>
//             <p className="text-[11px] font-bold text-slate-700 truncate w-48 mt-0.5">
//               {location.lat ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "Acquiring Signal..."}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* FOOTER ACTION TERMINAL */}
//       <div className="p-6 bg-white border-t border-slate-100">
//         <button
//           disabled={loading || (!capturedImage && status === 'not_checked_in')}
//           onClick={handlePunchRegistry}
//           className={`w-full py-5 rounded-[1.5rem] text-[13px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${
//             status === 'working'
//               ? 'bg-red-600 text-white shadow-red-100 hover:bg-red-700'
//               : 'bg-emerald-600 text-white shadow-emerald-100 hover:bg-emerald-700 disabled:opacity-50'
//           }`}
//         >
//           {loading ? (
//             <Loader2 className="animate-spin" size={20} />
//           ) : (
//             <>
//               <ArrowRightLeft size={18} />
//               {status === 'working' ? 'Commit Punch Out' : 'Commit Punch In'}
//             </>
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AttendanceTerminal;
//******************************************************************************************************* */
// import React, { useState, useEffect, useRef } from "react";
// import {
//   Camera, MapPin, CheckCircle, Clock, ShieldCheck,
//   RotateCcw, Fingerprint, Loader2, ArrowRightLeft
// } from "lucide-react";
// import toast from "react-hot-toast";

// const AttendanceTerminal = ({ employeeId = "12" }) => {
//   const [status, setStatus] = useState("not_checked_in"); // not_checked_in | working
//   const [loading, setLoading] = useState(false);
//   const [cameraActive, setCameraActive] = useState(false);
//   const [capturedImage, setCapturedImage] = useState(null);
//   const [location, setLocation] = useState({ lat: null, lng: null });

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   // Initial Sync: Fetch current status if needed
//   useEffect(() => {
//     captureLocation();
//   }, []);

//   const captureLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
//         () => toast.error("Geolocation access required for registry")
//       );
//     }
//   };

//   const startCamera = async () => {
//     setCameraActive(true);
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
//       if (videoRef.current) videoRef.current.srcObject = stream;
//     } catch (err) {
//       toast.error("Camera access denied");
//       setCameraActive(false);
//     }
//   };

//   const takeSelfie = () => {
//     const context = canvasRef.current.getContext("2d");
//     context.drawImage(videoRef.current, 0, 0, 300, 300);
//     const data = canvasRef.current.toDataURL("image/jpeg");
//     setCapturedImage(data);

//     // Stop camera stream
//     const stream = videoRef.current.srcObject;
//     stream.getTracks().forEach(track => track.stop());
//     setCameraActive(false);
//   };

//   const handlePunchRegistry = async () => {
//     if (!capturedImage) return toast.error("Selfie verification required");

//     setLoading(true);
//     const punchType = status === "not_checked_in" ? "in" : "out";
//     const loadingToast = toast.loading(`Synchronizing ${punchType.toUpperCase()} node...`);

//     try {
//       const apiData = new FormData();
//       apiData.append("punch_type", punchType);
//       apiData.append("latitude", location.lat || 0);
//       apiData.append("longitude", location.lng || 0);
//       apiData.append("remarks", "Terminal Mobile Registry");

//       // Convert base64 to file blob
//       const blob = await fetch(capturedImage).then(r => r.blob());
//       apiData.append("picture", blob, "selfie.jpg");

//       const response = await fetch(
//         `https://apihrr.goelectronix.co.in/employees/${employeeId}/attendance/punch`,
//         { method: "POST", body: apiData }
//       );

//       if (response.ok) {
//         toast.success(`Protocol ${punchType.toUpperCase()} Complete ✔`, { id: loadingToast });
//         setStatus(punchType === "in" ? "working" : "not_checked_in");
//         setCapturedImage(null);
//       } else {
//         throw new Error();
//       }
//     } catch (err) {
//       toast.error("Registry Rejection: Sync Failed", { id: loadingToast });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto min-h-screen bg-slate-50 flex flex-col antialiased font-sans">
//       {/* HEADER SECTION */}
//       <div className="bg-white px-6 py-8 border-b border-slate-200 rounded-b-[2.5rem] shadow-sm">
//         <div className="flex justify-between items-center mb-6">
//           <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
//             <Fingerprint size={24} />
//           </div>
//           <div className="text-right">
//             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Security Status</p>
//             <div className="flex items-center gap-1.5 mt-1 justify-end text-blue-600">
//               <ShieldCheck size={14} />
//               <span className="text-[11px] font-black uppercase tracking-tight">Terminal Active</span>
//             </div>
//           </div>
//         </div>

//         <div className="space-y-1">
//           <h2 className="text-2xl font-black text-slate-900 tracking-tight">Good Morning, Raj 👋</h2>
//           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
//             <Clock size={12} className="text-blue-500" /> 17 Feb 2026 • 09:12:45 AM
//           </p>
//         </div>
//       </div>

//       {/* TERMINAL BODY */}
//       <div className="flex-1 p-6 space-y-6">

//         {/* STATUS INDICATOR STRIP */}
//         <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
//           status === 'working' ? 'bg-emerald-50 border-emerald-100' : 'bg-blue-50 border-blue-100'
//         }`}>
//           <div className="flex items-center gap-3">
//             <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
//               status === 'working' ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'
//             }`}>
//               {status === 'working' ? <CheckCircle size={18} /> : <Loader2 className="animate-spin" size={18} />}
//             </div>
//             <div>
//               <p className={`text-[10px] font-black uppercase tracking-widest ${
//                 status === 'working' ? 'text-emerald-700' : 'text-blue-700'
//               }`}>
//                 Current Registry
//               </p>
//               <p className="text-xs font-bold text-slate-900">
//                 {status === 'working' ? 'Shift Active: Working' : 'Status: Ready for Punch In'}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* VERIFICATION NODE (CAMERA/PREVIEW) */}
//         <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
//           <div className="flex flex-col items-center gap-6 relative z-10">
//             {capturedImage ? (
//               <div className="relative animate-in zoom-in-95 duration-500">
//                 <img src={capturedImage} className="w-32 h-32 rounded-full border-4 border-white shadow-2xl object-cover ring-4 ring-slate-50" alt="Selfie Verification" />
//                 <button onClick={() => setCapturedImage(null)} className="absolute -right-2 -top-2 bg-slate-900 text-white p-2 rounded-full shadow-lg hover:bg-red-500 transition-all">
//                   <RotateCcw size={14} />
//                 </button>
//               </div>
//             ) : (
//               <div className="h-32 w-32 bg-slate-50 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300">
//                 <Camera size={40} strokeWidth={1.5} />
//               </div>
//             )}

//             <div className="text-center space-y-2">
//               <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Selfie Verification</h4>
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Required for node synchronization</p>
//             </div>

//             {!capturedImage && !cameraActive && (
//               <button
//                 onClick={startCamera}
//                 className="px-8 py-3 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-200 active:scale-95 transition-all"
//               >
//                 Launch Scanner
//               </button>
//             )}
//           </div>

//           {/* CAMERA OVERLAY */}
//           {cameraActive && (
//             <div className="absolute inset-0 bg-slate-900 z-20 flex flex-col">
//               <video ref={videoRef} autoPlay playsInline className="flex-1 object-cover" />
//               <div className="p-6 bg-slate-900 flex justify-center items-center gap-8">
//                 <button onClick={() => setCameraActive(false)} className="text-white text-[10px] font-black uppercase">Cancel</button>
//                 <button
//                   onClick={takeSelfie}
//                   className="h-16 w-16 bg-white rounded-full border-4 border-slate-700 flex items-center justify-center active:scale-90 transition-all shadow-2xl"
//                 >
//                   <div className="h-12 w-12 rounded-full border-2 border-slate-900" />
//                 </button>
//                 <div className="w-10" /> {/* Spacer */}
//               </div>
//             </div>
//           )}
//           <canvas ref={canvasRef} width="300" height="300" className="hidden" />
//         </div>

//         {/* GEOLOCATION NODE */}
//         <div className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 flex items-center gap-4">
//           <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">
//             <MapPin size={20} />
//           </div>
//           <div>
//             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Registry Coordinates</p>
//             <p className="text-[11px] font-bold text-slate-700 truncate w-48 mt-0.5">
//               {location.lat ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "Acquiring Signal..."}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* FOOTER ACTION TERMINAL */}
//       <div className="p-6 bg-white border-t border-slate-100">
//         <button
//           disabled={loading || (!capturedImage && status === 'not_checked_in')}
//           onClick={handlePunchRegistry}
//           className={`w-full py-5 rounded-[1.5rem] text-[13px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${
//             status === 'working'
//               ? 'bg-red-600 text-white shadow-red-100 hover:bg-red-700'
//               : 'bg-emerald-600 text-white shadow-emerald-100 hover:bg-emerald-700 disabled:opacity-50'
//           }`}
//         >
//           {loading ? (
//             <Loader2 className="animate-spin" size={20} />
//           ) : (
//             <>
//               <ArrowRightLeft size={18} />
//               {status === 'working' ? 'Commit Punch Out' : 'Commit Punch In'}
//             </>
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AttendanceTerminal;
