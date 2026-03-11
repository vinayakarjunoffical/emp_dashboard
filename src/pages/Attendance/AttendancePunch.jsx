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
