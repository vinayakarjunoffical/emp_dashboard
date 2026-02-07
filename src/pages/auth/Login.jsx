import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  Lock,
  Mail,
  Phone,
  Loader2,
  ShieldCheck,
  ArrowRight,
  Smartphone,
  KeyRound,
} from "lucide-react";
import Logo from "../../assets/images/logo-bg.webp";

export default function Login() {
  const [email, setEmail] = useState("");
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loginMethod, setLoginMethod] = useState("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  const navigate = useNavigate();
  const { login, auth } = useAuth();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[6-9]\d{9}$/;
  const otpRegex = /^\d{6}$/;

  useEffect(() => {
    if (auth?.token) {
      navigate("/dashboard", { replace: true });
    } else {
      setCheckingAuth(false);
    }
  }, [auth, navigate]);

  useEffect(() => {
    if (!otpCooldown) return;
    const timer = setInterval(() => {
      setOtpCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [otpCooldown]);

  useEffect(() => {
    setOtp("");
  }, [phone]);

  const validateForm = () => {
    if (loginMethod === "email") {
      if (!emailRegex.test(email)) {
        setError("Please enter a valid work email address.");
        return false;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return false;
      }
    } else {
      const cleanPhone = phone.replace(/\s+/g, "");
      if (!phoneRegex.test(cleanPhone)) {
        setError("Invalid phone format. Enter 10 digits starting with 6-9.");
        return false;
      }
      if (!otpRegex.test(otp)) {
        setError("Please enter the 6-digit verification code.");
        return false;
      }
    }
    return true;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload =
        loginMethod === "email"
          ? { email, password }
          : { phone: phone.replace(/\s+/g, ""), otp };

      const res = await fetch("https://apihrr.goelectronix.co.in/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok || !result.access_token)
        throw new Error("Authentication failed");

      login({
        token: result.access_token,
        tokenType: result.token_type,
        user: result.user,
      });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  const handleSendOtp = () => {
    const cleanPhone = phone.replace(/\s+/g, "");

    if (!phoneRegex.test(cleanPhone)) {
      toast.error("Enter a valid 10-digit mobile number starting with 6-9");
      return;
    }

    toast.success("OTP sent successfully 📲");
    setOtpCooldown(30);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <Loader2 className="animate-spin text-white w-10 h-10 opacity-20" />
      </div>
    );
  }

  return (
    // Added 'h-screen' and 'overflow-hidden' to the wrapper to kill page scroll
    <div className="h-screen w-screen bg-[#050505] text-slate-200 flex items-center justify-center p-4 md:p-8 antialiased selection:bg-blue-500/30 overflow-hidden">
      {/* Changed min-h to a fixed height that scales with the viewport height (max 720px) */}
      <div className="w-full max-w-[1100px] h-full max-h-[550px] md:max-h-[720px] flex overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-[#0A0A0A] shadow-[0_0_100px_rgba(0,0,0,0.8)] relative">
        {/* ABSOLUTE BRAND LOGO */}
        {/* <div className="absolute top-8 left-8 z-50 lg:left-12">
          <div className="flex flex-col gap-0.5">
             <img
                src={Logo}
                alt="GoElectronix"
                className="h-7 md:h-9 w-auto brightness-110"
              />
              <p className="text-[9px] font-black text-blue-500/50 uppercase tracking-[0.2em] ml-1">Innovating Future</p>
          </div>
        </div> */}
        {/* ABSOLUTE BRAND LOGO - Hidden on mobile, visible on md (tablets) and lg (laptops) */}
        <div className="absolute top-8 left-8 z-50 lg:left-12 hidden md:block">
          <div className="flex flex-col gap-0.5">
            <img
              src={Logo}
              alt="GoElectronix"
              className="h-7 md:h-9 w-auto brightness-110"
            />
            <p className="text-[9px] font-black text-blue-500/50 uppercase tracking-[0.2em] ml-1">
              Innovating Future
            </p>
          </div>
        </div>

        {/* LEFT PANEL */}
        <section className="hidden lg:flex w-[45%] relative overflow-hidden border-r border-white/[0.08] bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:32px_32px]" />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 p-12 flex flex-col justify-center h-full w-full">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl">
                <ShieldCheck size={14} className="text-white" />
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white">
                  Enterprise Core
                </span>
              </div>
              <h2 className="text-5xl font-black tracking-tighter leading-[1] text-white">
                Secure Access <br /> Terminal.
              </h2>
              <p className="max-w-sm text-blue-100/60 leading-relaxed font-medium text-base">
                Unified governance and multi-factor authentication for elite HR
                operations.
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-blue-800 bg-slate-800"
                  />
                ))}
              </div>
              <div className="text-[10px]">
                <p className="font-bold text-white tracking-tight italic">
                  "The gold standard for security."
                </p>
                <p className="text-blue-200/50 font-medium">
                  — Global Compliance Review
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT PANEL - Optimized for no-scroll */}
        <section className="flex-1 flex flex-col relative bg-zinc-950/20 overflow-hidden">
          {/* Internal scroll area ensures the card never expands beyond the screen height */}
          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col md:justify-center p-6 md:p-12">
            <div className="max-w-[340px] w-full mx-auto py-4">
              <header className="mb-8">
                <div className="mb-6 flex justify-center">
                  <img
                    src={Logo}
                    alt="GoElectronix Logo"
                    className="h-12 w-auto object-contain"
                  />
                </div>
              </header>

              {/* SWITCHER TABS */}
              <div className="flex p-1 bg-white/[0.04] border border-white/[0.08] rounded-2xl mb-6">
                <button
                  onClick={() => {
                    setLoginMethod("email");
                    setError("");
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${loginMethod === "email" ? "bg-white text-black shadow-xl" : "text-slate-500 hover:text-slate-300"}`}
                >
                  <Mail size={14} /> Email
                </button>
                <button
                  onClick={() => {
                    setLoginMethod("phone");
                    setError("");
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${loginMethod === "phone" ? "bg-white text-black shadow-xl" : "text-slate-500 hover:text-slate-300"}`}
                >
                  <Smartphone size={14} /> Phone
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {loginMethod === "email" ? (
                  <>
                    <div className="group space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 ml-1">
                        Work Email
                      </label>
                      <div className="relative">
                        <Mail
                          // className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={16}
                          className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${email && !emailRegex.test(email) ? "text-red-400" : "text-slate-600 group-focus-within:text-blue-500"}`}
                          size={16}
                        />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@company.com"
                          className={`w-full bg-white/[0.03] border rounded-2xl py-4 pl-12 pr-4 outline-none transition-all text-sm placeholder:text-slate-700 ${email && !emailRegex.test(email) ? "border-red-500/40" : "border-white/[0.08] focus:border-blue-500/50 focus:bg-white/[0.06]"}`}
                          // className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:border-blue-500/50 transition-all text-sm"
                          required
                        />
                      </div>
                    </div>
                    <div className="group space-y-1.5">
                      <div className="flex justify-between items-center ml-1">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                          Password
                        </label>
                      </div>
                      <div className="relative">
                        <Lock
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors"
                          size={16}
                        />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:border-blue-500/50 transition-all text-sm"
                          required
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="group space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 ml-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                          size={16}
                        />
                        <input
                          type="text"
                          value={phone}
                          maxLength={10}
                          //  onChange={(e) => setPhone(e.target.value)}
                          onChange={(e) =>
                            setPhone(
                              e.target.value.replace(/\D/g, "").slice(0, 10),
                            )
                          }
                          placeholder="98765 43210"
                          className={`w-full bg-white/[0.03] border rounded-2xl py-4 pl-12 pr-4 outline-none transition-all text-sm placeholder:text-slate-700 ${phone && !phoneRegex.test(phone.replace(/\s+/g, "")) ? "border-red-500/40" : "border-white/[0.08] focus:border-blue-500/50 focus:bg-white/[0.06]"}`}
                          required
                        />
                        <button
                          onClick={handleSendOtp}
                          disabled={otpCooldown > 0}
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-black text-blue-500 uppercase px-3 py-1.5 bg-blue-500/10 rounded-lg"
                        >
                          {otpCooldown > 0
                            ? `Resend (${otpCooldown}s)`
                            : "Send"}
                        </button>
                      </div>
                    </div>
                    <div className="group space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 ml-1">
                        OTP
                      </label>
                      <div className="relative">
                        <KeyRound
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                          size={16}
                        />
                        <input
                          type="text"
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="000000"
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:border-blue-500/50 transition-all text-sm tracking-[0.4em] font-black"
                          required
                          autoComplete="one-time-code"
                          inputMode="numeric"
                        />
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full group mt-4 relative flex items-center justify-center gap-3 bg-white text-black font-black py-3.5 rounded-2xl hover:bg-blue-50 transition-all active:scale-[0.98] text-xs"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      Verify & Enter <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <footer className="mt-8 text-center border-t border-white/[0.04] pt-6">
                <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.2em]">
                  Secure Cloud Infrastructure v4.2.0
                </p>
              </footer>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

//*************************************************ui code but scrollable dont change********************************************************************* */

// return (
//   <div className="min-h-screen bg-[#050505] text-slate-200 flex items-center justify-center p-4 antialiased selection:bg-blue-500/30">
//     <div className="w-full max-w-[1100px] flex min-h-[700px] overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-[#0A0A0A] shadow-[0_0_100px_rgba(0,0,0,0.8)] relative">
//       {/* ABSOLUTE BRAND LOGO (Top Left for Standard Feel) */}
//       <div className="absolute top-8 left-8 z-50 lg:left-12">
//         <img
//           src={Logo}
//           alt="GoElectronix"
//           className="h-8 md:h-10 w-auto brightness-110"
//         />
//       </div>

//       {/* LEFT PANEL */}
//       <section className="hidden lg:flex w-[45%] relative overflow-hidden border-r border-white/[0.08] bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950">
//         {/* Enhanced Background Texture */}
//         <div className="absolute inset-0 opacity-30 pointer-events-none">
//           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:32px_32px]" />
//           <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent" />
//         </div>

//         <div className="relative z-10 p-16 flex flex-col justify-center h-full w-full">
//           <div className="space-y-6">
//             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl">
//               <ShieldCheck size={14} className="text-white" />
//               <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white">
//                 Enterprise Core
//               </span>
//             </div>
//             <h2 className="text-5xl font-black tracking-tighter leading-[1] text-white">
//               Secure Access <br /> Terminal.
//             </h2>
//             <p className="max-w-sm text-blue-100/60 leading-relaxed font-medium text-lg">
//               Unified governance and multi-factor authentication for elite HR
//               operations.
//             </p>
//           </div>

//           <div className="mt-20 pt-8 border-t border-white/10 flex items-center gap-4">
//             <div className="flex -space-x-2">
//               {[1, 2, 3].map((i) => (
//                 <div
//                   key={i}
//                   className="w-8 h-8 rounded-full border-2 border-blue-800 bg-slate-800"
//                 />
//               ))}
//             </div>
//             <div className="text-[11px]">
//               <p className="font-bold text-white tracking-tight italic">
//                 "The gold standard for security."
//               </p>
//               <p className="text-blue-200/50 font-medium">
//                 — Global Compliance Review
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* RIGHT PANEL */}
//       <section className="flex-1 flex flex-col justify-center p-2 md:p-5 relative bg-zinc-950/20">
//         <div className="max-w-[360px] w-full mx-auto">
//           <header className="mb-10 lg:mt-6">
//             <div className="mb-6 flex justify-center">
//               <img
//                 src={Logo}
//                 alt="GoElectronix Logo"
//                 className="h-14 w-auto object-contain"
//               />
//             </div>
//           </header>

//           {/* SWITCHER TABS */}
//           <div className="flex p-1 bg-white/[0.04] border border-white/[0.08] rounded-2xl mb-8">
//             <button
//               onClick={() => {
//                 setLoginMethod("email");
//                 setError("");
//               }}
//               className={`flex-1 flex items-center justify-center gap-2 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${loginMethod === "email" ? "bg-white text-black shadow-xl scale-[1.02]" : "text-slate-500 hover:text-slate-300"}`}
//             >
//               <Mail size={14} /> Email
//             </button>
//             <button
//               onClick={() => {
//                 setLoginMethod("phone");
//                 setError("");
//               }}
//               className={`flex-1 flex items-center justify-center gap-2 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${loginMethod === "phone" ? "bg-white text-black shadow-xl scale-[1.02]" : "text-slate-500 hover:text-slate-300"}`}
//             >
//               <Smartphone size={14} /> Phone
//             </button>
//           </div>

//           {error && (
//             <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-bold flex items-center gap-3">
//               <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {loginMethod === "email" ? (
//               <>
//                 <div className="group space-y-2">
//                   <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 ml-1 group-focus-within:text-blue-500 transition-colors">
//                     Work Email
//                   </label>
//                   <div className="relative">
//                     <Mail
//                       className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${email && !emailRegex.test(email) ? "text-red-400" : "text-slate-600 group-focus-within:text-blue-500"}`}
//                       size={18}
//                     />
//                     <input
//                       type="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       placeholder="name@company.com"
//                       className={`w-full bg-white/[0.03] border rounded-2xl py-4 pl-12 pr-4 outline-none transition-all text-sm placeholder:text-slate-700 ${email && !emailRegex.test(email) ? "border-red-500/40" : "border-white/[0.08] focus:border-blue-500/50 focus:bg-white/[0.06]"}`}
//                       required
//                     />
//                   </div>
//                 </div>
//                 <div className="group space-y-2">
//                   <div className="flex justify-between items-center ml-1">
//                     <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 group-focus-within:text-blue-500 transition-colors">
//                       Password
//                     </label>
//                     <button
//                       type="button"
//                       className="text-[11px] font-bold text-blue-500 hover:text-blue-400 transition"
//                     >
//                       Forgot?
//                     </button>
//                   </div>
//                   <div className="relative">
//                     <Lock
//                       className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors"
//                       size={18}
//                     />
//                     <input
//                       type="password"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       placeholder="••••••••"
//                       className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50 focus:bg-white/[0.06] transition-all text-sm"
//                       required
//                     />
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="group space-y-2">
//                   <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 ml-1 group-focus-within:text-blue-500 transition-colors">
//                     Phone Number
//                   </label>
//                   <div className="relative">
//                     <Phone
//                       className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${phone && !phoneRegex.test(phone.replace(/\s+/g, "")) ? "text-red-400" : "text-slate-600 group-focus-within:text-blue-500"}`}
//                       size={18}
//                     />
//                     <input
//                       type="text"
//                       value={phone}
//                       onChange={(e) => setPhone(e.target.value)}
//                       placeholder="98765 43210"
//                       className={`w-full bg-white/[0.03] border rounded-2xl py-4 pl-12 pr-4 outline-none transition-all text-sm placeholder:text-slate-700 ${phone && !phoneRegex.test(phone.replace(/\s+/g, "")) ? "border-red-500/40" : "border-white/[0.08] focus:border-blue-500/50 focus:bg-white/[0.06]"}`}
//                       required
//                     />
//                     <button
//                       onClick={handleSendOtp}
//                       type="button"
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-blue-500 uppercase px-4 py-2 bg-blue-500/10 rounded-xl hover:bg-blue-500/20 active:scale-95 transition-all"
//                     >
//                       Send
//                     </button>
//                   </div>
//                 </div>
//                 <div className="group space-y-2">
//                   <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 ml-1 group-focus-within:text-blue-500 transition-colors">
//                     One-Time Password
//                   </label>
//                   <div className="relative">
//                     <KeyRound
//                       className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${otp && !otpRegex.test(otp) ? "text-red-400" : "text-slate-600 group-focus-within:text-blue-500"}`}
//                       size={18}
//                     />
//                     <input
//                       type="text"
//                       maxLength={6}
//                       value={otp}
//                       onChange={(e) => setOtp(e.target.value)}
//                       placeholder="000000"
//                       className={`w-full bg-white/[0.03] border rounded-2xl py-4 pl-12 pr-4 outline-none transition-all text-sm tracking-[0.6em] font-black placeholder:text-slate-800 ${otp && !otpRegex.test(otp) ? "border-red-500/40" : "border-white/[0.08] focus:border-blue-500/50 focus:bg-white/[0.06]"}`}
//                       required
//                     />
//                   </div>
//                 </div>
//               </>
//             )}

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full group mt-6 relative flex items-center justify-center gap-3 bg-white text-black font-black py-4.5 rounded-2xl hover:bg-blue-50 transition-all duration-300 disabled:opacity-50 shadow-[0_10px_20px_-10px_rgba(255,255,255,0.2)] active:scale-[0.98]"
//             >
//               {loading ? (
//                 <Loader2 className="animate-spin" size={20} />
//               ) : (
//                 <>
//                   Verify & Enter{" "}
//                   <ArrowRight
//                     size={18}
//                     className="group-hover:translate-x-1 transition-transform"
//                   />
//                 </>
//               )}
//             </button>
//           </form>

//           <footer className="mt-12 text-center border-t border-white/[0.04] pt-8">
//             <div className="flex justify-center gap-6 mb-4">
//               <span className="text-[10px] font-bold text-slate-700 hover:text-slate-500 cursor-pointer transition-colors uppercase tracking-widest">
//                 Privacy
//               </span>
//               <span className="text-[10px] font-bold text-slate-700 hover:text-slate-500 cursor-pointer transition-colors uppercase tracking-widest">
//                 Terms
//               </span>
//               <span className="text-[10px] font-bold text-slate-700 hover:text-slate-500 cursor-pointer transition-colors uppercase tracking-widest">
//                 Support
//               </span>
//             </div>
//             <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.2em]">
//               Secure Cloud Infrastructure v4.2.0
//             </p>
//           </footer>
//         </div>
//       </section>
//     </div>
//   </div>
// );
//************************************************working code pahse 254********************************************************************* */
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import React, { useState, useEffect } from "react";
// import { toast } from "react-hot-toast";
// import { Lock, Mail, Phone, Loader2, ShieldCheck, ArrowRight, Smartphone, KeyRound } from "lucide-react";
// import Logo from '../../assets/images/logo-bg.webp'

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [phone, setPhone] = useState("");
//   const [otp, setOtp] = useState(""); // State for OTP
//   const [loginMethod, setLoginMethod] = useState("email"); // 'email' or 'phone'
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [checkingAuth, setCheckingAuth] = useState(true);

//   const navigate = useNavigate();
//   const { login, auth } = useAuth();

//   // --- REGEX PATTERNS ---
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//  const phoneRegex = /^[6-9]\d{9}$/;
//   const otpRegex = /^\d{6}$/; // Strict 6-digit verification

//   useEffect(() => {
//     if (auth?.token) {
//       navigate("/dashboard", { replace: true });
//     } else {
//       setCheckingAuth(false);
//     }
//   }, [auth, navigate]);

//   // --- VALIDATION LOGIC ---
//   const validateForm = () => {
//     if (loginMethod === "email") {
//       if (!emailRegex.test(email)) {
//         setError("Please enter a valid work email address.");
//         return false;
//       }
//       if (password.length < 6) {
//         setError("Password must be at least 6 characters long.");
//         return false;
//       }
//     } else {
//       const cleanPhone = phone.replace(/\s+/g, ""); // Remove spaces for testing
//       if (!phoneRegex.test(cleanPhone)) {
//         setError("Invalid phone format. Please include country code.");
//         return false;
//       }
//       if (!otpRegex.test(otp)) {
//         setError("Please enter the 6-digit verification code.");
//         return false;
//       }
//     }
//     return true;
//   };

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError("");

//     // Execute validation before starting the request
//     if (!validateForm()) return;

//     setLoading(true);

//     try {
//       // Existing payload logic adaptation
//       const payload = loginMethod === "email"
//         ? { email, password }
//         : { phone: phone.replace(/\s+/g, ""), otp };

//       const res = await fetch("https://apihrr.goelectronix.co.in/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const result = await res.json();
//       if (!res.ok || !result.access_token) throw new Error("Authentication failed");

//       login({
//         token: result.access_token,
//         tokenType: result.token_type,
//         user: result.user,
//       });

//       navigate("/dashboard", { replace: true });
//     } catch (err) {
//       setError(err.message || "Invalid credentials");
//     } finally {
//       setLoading(false);
//     }
//   }

//   const handleSendOtp = () => {
//   const cleanPhone = phone.replace(/\s+/g, "");

//   if (!phoneRegex.test(cleanPhone)) {
//     toast.error("Enter a valid 10-digit mobile number starting with 6-9");
//     return;
//   }

//   toast.success("OTP sent successfully 📲");
// };

//   if (checkingAuth) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#050505]">
//         <Loader2 className="animate-spin text-white w-10 h-10 opacity-20" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#050505] text-slate-200 flex items-center justify-center p-4 antialiased selection:bg-blue-500/30">
//       <div className="w-full max-w-[1100px] flex min-h-[660px] overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0A0A0A] shadow-2xl shadow-black">

//         {/* LEFT PANEL */}
//         <section className="hidden lg:flex w-[45%] relative overflow-hidden border-r border-white/[0.08] bg-gradient-to-b from-blue-600 to-blue-800">
//           <div className="absolute inset-0 opacity-20 pointer-events-none">
//             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:24px_24px]" />
//           </div>

//           <div className="relative z-10 p-12 flex flex-col justify-between w-full">
//             <div>
//               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-12">
//                 <ShieldCheck size={14} className="text-white" />
//                 <span className="text-[10px] font-black uppercase tracking-[0.1em] text-white">Enterprise Core</span>
//               </div>
//               <h2 className="text-5xl font-black tracking-tighter leading-[1.1] text-white">
//                 Secure Access <br /> Terminal.
//               </h2>
//               <p className="mt-6 text-blue-100/70 leading-relaxed font-medium">
//                 Unified governance and multi-factor <br /> authentication for elite HR operations.
//               </p>
//             </div>
//             <div className="text-xs">
//               <p className="font-bold text-white tracking-tight italic">"The gold standard for workforce security."</p>
//               <p className="text-blue-200/60 font-medium mt-1">— Global Compliance Review</p>
//             </div>
//           </div>
//         </section>

//         {/* RIGHT PANEL */}
//         <section className="flex-1 flex flex-col justify-center p-8 md:p-16 relative">
//           <div className="max-w-[380px] w-full mx-auto">
//             {/* <header className="mb-8">
//               <h1 className="text-3xl font-black tracking-tight text-white mb-2">Gatekeeper</h1>
//               <p className="text-slate-500 text-sm font-medium">Select your preferred entry method.</p>
//             </header> */}
//             <header className="mb-8">
//               {/* COMPANY LOGO ADDED HERE */}
//               <div className="mb-6 border-2 flex justify-center">
//                 <img src={Logo} alt="GoElectronix Logo" className="h-14 w-auto object-contain" />
//               </div>

//             </header>

//             {/* SWITCHER TABS */}
//             <div className="flex p-1 bg-white/[0.04] border border-white/[0.08] rounded-2xl mb-8">
//               <button
//                 onClick={() => { setLoginMethod('email'); setError(""); }}
//                 className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${loginMethod === 'email' ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
//               >
//                 <Mail size={14} /> Email
//               </button>
//               <button
//                 onClick={() => { setLoginMethod('phone'); setError(""); }}
//                 className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${loginMethod === 'phone' ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
//               >
//                 <Smartphone size={14} /> Phone
//               </button>
//             </div>

//             {error && (
//               <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-3">
//                 <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
//                 {error}
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-5">
//               {loginMethod === 'email' ? (
//                 <>
//                   <div className="space-y-2">
//                     <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 ml-1">Work Email</label>
//                     <div className="relative">
//                       <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${email && !emailRegex.test(email) ? 'text-red-400' : 'text-slate-600'}`} size={18} />
//                       <input
//                         type="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         placeholder="name@company.com"
//                         className={`w-full bg-white/[0.03] border rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all text-sm ${email && !emailRegex.test(email) ? 'border-red-500/40' : 'border-white/[0.08] focus:border-blue-500/50'}`}
//                         required
//                       />
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <div className="flex justify-between items-center ml-1">
//                       <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Password</label>
//                       <button type="button" className="text-[11px] font-bold text-blue-500 hover:text-blue-400 transition">Forgot?</button>
//                     </div>
//                     <div className="relative">
//                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
//                       <input
//                         type="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         placeholder="••••••••"
//                         className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all text-sm"
//                         required
//                       />
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div className="space-y-2">
//                     <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 ml-1">Phone Number</label>
//                     <div className="relative">
//                       <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${phone && !phoneRegex.test(phone.replace(/\s+/g, "")) ? 'text-red-400' : 'text-slate-600'}`} size={18} />
//                       <input
//                         type="text"
//                         value={phone}
//                         onChange={(e) => setPhone(e.target.value)}
//                         placeholder="+91 00000 00000"
//                         className={`w-full bg-white/[0.03] border rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all text-sm ${phone && !phoneRegex.test(phone.replace(/\s+/g, "")) ? 'border-red-500/40' : 'border-white/[0.08] focus:border-blue-500/50'}`}
//                         required
//                       />
//                       <button onClick={handleSendOtp} type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-blue-500 uppercase px-3 py-1 bg-blue-500/10 rounded-lg hover:bg-blue-500/20">Send</button>
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 ml-1">One-Time Password</label>
//                     <div className="relative">
//                       <KeyRound className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${otp && !otpRegex.test(otp) ? 'text-red-400' : 'text-slate-600'}`} size={18} />
//                       <input
//                         type="text"
//                         maxLength={6}
//                         value={otp}
//                         onChange={(e) => setOtp(e.target.value)}
//                         placeholder="6-digit code"
//                         className={`w-full bg-white/[0.03] border rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all text-sm tracking-[0.5em] font-bold ${otp && !otpRegex.test(otp) ? 'border-red-500/40' : 'border-white/[0.08] focus:border-blue-500/50'}`}
//                         required
//                       />
//                     </div>
//                   </div>
//                 </>
//               )}

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full group mt-4 relative flex items-center justify-center gap-2 bg-white text-black font-black py-4 rounded-2xl hover:bg-slate-200 transition-all disabled:opacity-50 overflow-hidden shadow-xl shadow-white/5"
//               >
//                 {loading ? <Loader2 className="animate-spin" size={20} /> : (
//                   <>Verify & Enter <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
//                 )}
//               </button>
//             </form>

//             <footer className="mt-10 text-center border-t border-white/[0.04] pt-8">
//               <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
//                 Protected by Biometric Encryption
//               </p>
//             </footer>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }
//*****************************************working code phase 33************************************************************* */
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import React, { useState, useEffect } from "react";
// import { Lock, Mail, Phone, Loader2, ShieldCheck, ArrowRight, Smartphone, KeyRound } from "lucide-react";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [phone, setPhone] = useState("");
//   const [otp, setOtp] = useState(""); // New state for OTP
//   const [loginMethod, setLoginMethod] = useState("email"); // 'email' or 'phone'
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [checkingAuth, setCheckingAuth] = useState(true);

//   const navigate = useNavigate();
//   const { login, auth } = useAuth();

//   useEffect(() => {
//     if (auth?.token) {
//       navigate("/dashboard", { replace: true });
//     } else {
//       setCheckingAuth(false);
//     }
//   }, [auth, navigate]);

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       // Maintaining your existing payload logic
//       const payload = loginMethod === "email"
//         ? { email, password }
//         : { phone, otp }; // Adapt payload based on method

//       const res = await fetch("https://apihrr.goelectronix.co.in/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const result = await res.json();
//       if (!res.ok || !result.access_token) throw new Error("Authentication failed");

//       login({
//         token: result.access_token,
//         tokenType: result.token_type,
//         user: result.user,
//       });

//       navigate("/dashboard", { replace: true });
//     } catch (err) {
//       setError(err.message || "Invalid credentials");
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (checkingAuth) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#050505]">
//         <Loader2 className="animate-spin text-white w-10 h-10 opacity-20" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#050505] text-slate-200 flex items-center justify-center p-4 antialiased selection:bg-blue-500/30">
//       <div className="w-full max-w-[1100px] flex min-h-[660px] overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0A0A0A] shadow-2xl shadow-black">

//         {/* LEFT PANEL: BRAND & SOCIAL PROOF */}
//         <section className="hidden lg:flex w-[45%] relative overflow-hidden border-r border-white/[0.08] bg-gradient-to-b from-blue-600 to-blue-800">
//           <div className="absolute inset-0 opacity-20 pointer-events-none">
//             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:24px_24px]" />
//           </div>

//           <div className="relative z-10 p-12 flex flex-col justify-between w-full">
//             <div>
//               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-12">
//                 <ShieldCheck size={14} className="text-white" />
//                 <span className="text-[10px] font-black uppercase tracking-[0.1em] text-white">Enterprise Core</span>
//               </div>
//               <h2 className="text-5xl font-black tracking-tighter leading-[1.1] text-white">
//                 Secure Access <br /> Terminal.
//               </h2>
//               <p className="mt-6 text-blue-100/70 leading-relaxed font-medium">
//                 Unified governance and multi-factor <br /> authentication for elite HR operations.
//               </p>
//             </div>
//             <div className="text-xs">
//               <p className="font-bold text-white tracking-tight italic">"The gold standard for workforce security."</p>
//               <p className="text-blue-200/60 font-medium mt-1">— Global Compliance Review</p>
//             </div>
//           </div>
//         </section>

//         {/* RIGHT PANEL: AUTHENTICATION FORM */}
//         <section className="flex-1 flex flex-col justify-center p-8 md:p-16 relative">
//           <div className="max-w-[380px] w-full mx-auto">
//             <header className="mb-8">
//               <h1 className="text-3xl font-black tracking-tight text-white mb-2">Gatekeeper</h1>
//               <p className="text-slate-500 text-sm font-medium">Select your preferred entry method.</p>
//             </header>

//             {/* SWITCHER TABS */}
//             <div className="flex p-1 bg-white/[0.04] border border-white/[0.08] rounded-2xl mb-8">
//               <button
//                 onClick={() => setLoginMethod('email')}
//                 className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${loginMethod === 'email' ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
//               >
//                 <Mail size={14} /> Email
//               </button>
//               <button
//                 onClick={() => setLoginMethod('phone')}
//                 className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${loginMethod === 'phone' ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
//               >
//                 <Smartphone size={14} /> Phone
//               </button>
//             </div>

//             {error && (
//               <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-3">
//                 <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
//                 {error}
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-5">
//               {loginMethod === 'email' ? (
//                 <>
//                   <div className="space-y-2">
//                     <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 ml-1">Work Email</label>
//                     <div className="relative">
//                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
//                       <input
//                         type="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         placeholder="name@company.com"
//                         className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all text-sm"
//                         required
//                       />
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <div className="flex justify-between items-center ml-1">
//                       <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Password</label>
//                       <button type="button" className="text-[11px] font-bold text-blue-500 hover:text-blue-400 transition">Forgot?</button>
//                     </div>
//                     <div className="relative">
//                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
//                       <input
//                         type="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         placeholder="••••••••"
//                         className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all text-sm"
//                         required
//                       />
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div className="space-y-2">
//                     <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 ml-1">Phone Number</label>
//                     <div className="relative">
//                       <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
//                       <input
//                         type="text"
//                         value={phone}
//                         onChange={(e) => setPhone(e.target.value)}
//                         placeholder="+91 00000 00000"
//                         className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all text-sm"
//                         required
//                       />
//                       <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-blue-500 uppercase px-3 py-1 bg-blue-500/10 rounded-lg hover:bg-blue-500/20">Send</button>
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 ml-1">One-Time Password</label>
//                     <div className="relative">
//                       <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
//                       <input
//                         type="text"
//                         value={otp}
//                         onChange={(e) => setOtp(e.target.value)}
//                         placeholder="6-digit code"
//                         className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all text-sm tracking-[0.5em] font-bold"
//                         required
//                       />
//                     </div>
//                   </div>
//                 </>
//               )}

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full group mt-4 relative flex items-center justify-center gap-2 bg-white text-black font-black py-4 rounded-2xl hover:bg-slate-200 transition-all disabled:opacity-50 overflow-hidden shadow-xl shadow-white/5"
//               >
//                 {loading ? <Loader2 className="animate-spin" size={20} /> : (
//                   <>Verify & Enter <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
//                 )}
//               </button>
//             </form>

//             <footer className="mt-10 text-center border-t border-white/[0.04] pt-8">
//               <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
//                 Protected by Biometric Encryption
//               </p>
//             </footer>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }
//**************************************************working code phase 555******************************************************* */
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import React, { useState, useEffect } from "react";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [phone, setPhone] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [checkingAuth, setCheckingAuth] = useState(true);

//   const navigate = useNavigate();
//   const { login, auth } = useAuth(); // ✅ correct source

//   // async function handleSubmit(e) {
//   //   e.preventDefault();
//   //   setError("");
//   //   setLoading(true);

//   //   try {
//   //     const res = await fetch("https://emp-onbd-1.onrender.com/auth/login", {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify({ email, password }),
//   //     });

//   //     const result = await res.json();

//   //     if (!res.ok || !result.status) {
//   //       throw new Error("Invalid email or password");
//   //     }

//   //     login({
//   //       token: result.access_token,
//   //       tokenType: result.token_type,
//   //       user: result.user,
//   //     });
//   //     // ✅ context login
//   //     navigate("/dashboard", { replace: true });
//   //   } catch (err) {
//   //     setError(err.message || "Login failed");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // }

//  useEffect(() => {
//   if (auth?.token) {
//     navigate("/dashboard", { replace: true });
//   } else {
//     setCheckingAuth(false);
//   }
// }, [auth, navigate]);

//   async function handleSubmit(e) {
//   e.preventDefault();
//   setError("");
//   setLoading(true);

//   try {
//     const payload = {
//       email,
//       password,
//     };

//     // add phone ONLY if provided
//     if (phone) {
//       payload.phone = phone;
//     }

//     const res = await fetch("https://apihrr.goelectronix.co.in/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     const result = await res.json();

//     if (!res.ok || !result.access_token) {
//       throw new Error("Invalid email or password");
//     }

//     login({
//       token: result.access_token,
//       tokenType: result.token_type,
//       user: result.user,
//     });

//     navigate("/dashboard", { replace: true });
//   } catch (err) {
//     setError(err.message || "Login failed");
//   } finally {
//     setLoading(false);
//   }
// }

// if (checkingAuth) {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] text-white">
//       <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white"></div>
//     </div>
//   );
// }

//   return (
//     <div className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center px-6">
//       <div className="w-full max-w-6xl flex overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
//         {/* LEFT IMAGE CARD */}
//         <section className="w-[520px] relative">
//           <div className="relative h-[520px] overflow-hidden">
//             <img
//               src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400"
//               alt="team"
//               className="absolute inset-0 w-full h-full object-cover"
//             />
//             <div className="absolute inset-0 bg-blue-600/80" />

//             <div className="relative h-full p-10 flex flex-col justify-between">
//               <div>
//                 <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
//                   ✨
//                 </div>

//                 <h2 className="mt-10 text-4xl font-bold leading-tight">
//                   Start turning your ideas <br />
//                   into reality.
//                 </h2>

//                 <p className="mt-5 text-sm text-white/80 max-w-md leading-6">
//                   Sign up now and start taking advantage of a wealth of
//                   information to grow your business.
//                 </p>

//                 <div className="mt-10 flex items-center gap-3">
//                   <div className="flex -space-x-2">
//                     {[1, 2, 3, 4, 5].map((i) => (
//                       <img
//                         key={i}
//                         src={`https://i.pravatar.cc/100?img=${i}`}
//                         alt="user"
//                         className="w-9 h-9 rounded-full border-2 border-blue-600 object-cover"
//                       />
//                     ))}
//                   </div>
//                   <p className="text-sm text-white/90">
//                     Join <span className="font-semibold">30,000+</span> users
//                   </p>
//                 </div>
//               </div>

//               <div className="flex gap-4 text-white/80">
//                 {["f", "t", "in", "⦿"].map((x) => (
//                   <div
//                     key={x}
//                     className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
//                   >
//                     {x}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* RIGHT LOGIN FORM */}
//         <section className="flex-1 bg-[#111111]">
//           <div className="px-10 pt-12 h-[520px] w-[520px] flex flex-col justify-center">
//             <h2 className="text-4xl font-bold">Sign In</h2>

//             {error && (
//               <div className="mt-4 text-sm text-red-400 text-center">
//                 {error}
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="mt-7 space-y-5">
//               <div>
//                 <label className="text-sm text-white/60">Email</label>
//                 <input
//                   type="email"
//                   value={email}
//                   placeholder="Enter the Email"
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="mt-2 w-full rounded-full bg-transparent border border-white/10 px-5 py-3 outline-none focus:border-blue-500 transition"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="text-sm text-white/60">Password</label>
//                 <input
//                   type="password"
//                   value={password}
//                   placeholder="Enter the Password"
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="mt-2 w-full rounded-full bg-transparent border border-white/10 px-5 py-3 outline-none focus:border-blue-500 transition"
//                   required
//                 />
//               </div>

//               <div>
//   <label className="text-sm text-white/60">
//     Phone <span className="text-white/40">(optional)</span>
//   </label>
//   <input
//     type="text"
//     value={phone}
//     placeholder="Enter phone number"
//     onChange={(e) => setPhone(e.target.value)}
//     className="mt-2 w-full rounded-full bg-transparent border border-white/10 px-5 py-3 outline-none focus:border-blue-500 transition"
//   />
// </div>

//               <div className="flex items-center justify-between text-sm">
//                 <label className="flex items-center gap-2 text-white/60">
//                   <input
//                     type="checkbox"
//                     defaultChecked
//                     className="accent-white"
//                   />
//                   Remember Me
//                 </label>

//                 <button type="button" className="text-blue-500 hover:underline">
//                   Forget Password?
//                 </button>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full rounded-full bg-white text-black font-semibold py-3 hover:bg-white/90 transition disabled:opacity-60"
//               >
//                 {loading ? "Signing in..." : "Sign in"}
//               </button>

//               <p className="text-sm text-white/50 text-center mt-4">
//                 Don't have an account?{" "}
//                 <span className="text-white font-semibold cursor-pointer hover:underline">
//                   Create Account
//                 </span>
//               </p>
//             </form>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }
