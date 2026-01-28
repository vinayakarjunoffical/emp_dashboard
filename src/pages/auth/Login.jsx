import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import React, { useState, useEffect } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  const navigate = useNavigate();
  const { login, auth } = useAuth(); // ✅ correct source

  // async function handleSubmit(e) {
  //   e.preventDefault();
  //   setError("");
  //   setLoading(true);

  //   try {
  //     const res = await fetch("https://emp-onbd-1.onrender.com/auth/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email, password }),
  //     });

  //     const result = await res.json();

  //     if (!res.ok || !result.status) {
  //       throw new Error("Invalid email or password");
  //     }

  //     login({
  //       token: result.access_token,
  //       tokenType: result.token_type,
  //       user: result.user,
  //     });
  //     // ✅ context login
  //     navigate("/dashboard", { replace: true });
  //   } catch (err) {
  //     setError(err.message || "Login failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // }

 useEffect(() => {
  if (auth?.token) {
    navigate("/dashboard", { replace: true });
  } else {
    setCheckingAuth(false);
  }
}, [auth, navigate]);


  async function handleSubmit(e) {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const payload = {
      email,
      password,
    };

    // add phone ONLY if provided
    if (phone) {
      payload.phone = phone;
    }

    const res = await fetch("http://72.62.242.223:8000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!res.ok || !result.access_token) {
      throw new Error("Invalid email or password");
    }

    login({
      token: result.access_token,
      tokenType: result.token_type,
      user: result.user,
    });

    navigate("/dashboard", { replace: true });
  } catch (err) {
    setError(err.message || "Login failed");
  } finally {
    setLoading(false);
  }
}

if (checkingAuth) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white"></div>
    </div>
  );
}



  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-6xl flex overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
        {/* LEFT IMAGE CARD */}
        <section className="w-[520px] relative">
          <div className="relative h-[520px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400"
              alt="team"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-blue-600/80" />

            <div className="relative h-full p-10 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  ✨
                </div>

                <h2 className="mt-10 text-4xl font-bold leading-tight">
                  Start turning your ideas <br />
                  into reality.
                </h2>

                <p className="mt-5 text-sm text-white/80 max-w-md leading-6">
                  Sign up now and start taking advantage of a wealth of
                  information to grow your business.
                </p>

                <div className="mt-10 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <img
                        key={i}
                        src={`https://i.pravatar.cc/100?img=${i}`}
                        alt="user"
                        className="w-9 h-9 rounded-full border-2 border-blue-600 object-cover"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-white/90">
                    Join <span className="font-semibold">30,000+</span> users
                  </p>
                </div>
              </div>

              <div className="flex gap-4 text-white/80">
                {["f", "t", "in", "⦿"].map((x) => (
                  <div
                    key={x}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
                  >
                    {x}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT LOGIN FORM */}
        <section className="flex-1 bg-[#111111]">
          <div className="px-10 pt-12 h-[520px] w-[520px] flex flex-col justify-center">
            <h2 className="text-4xl font-bold">Sign In</h2>

            {error && (
              <div className="mt-4 text-sm text-red-400 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div>
                <label className="text-sm text-white/60">Email</label>
                <input
                  type="email"
                  value={email}
                  placeholder="Enter the Email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-full bg-transparent border border-white/10 px-5 py-3 outline-none focus:border-blue-500 transition"
                  required
                />
              </div>

              

              <div>
                <label className="text-sm text-white/60">Password</label>
                <input
                  type="password"
                  value={password}
                  placeholder="Enter the Password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full rounded-full bg-transparent border border-white/10 px-5 py-3 outline-none focus:border-blue-500 transition"
                  required
                />
              </div>

              <div>
  <label className="text-sm text-white/60">
    Phone <span className="text-white/40">(optional)</span>
  </label>
  <input
    type="text"
    value={phone}
    placeholder="Enter phone number"
    onChange={(e) => setPhone(e.target.value)}
    className="mt-2 w-full rounded-full bg-transparent border border-white/10 px-5 py-3 outline-none focus:border-blue-500 transition"
  />
</div>


              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-white/60">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="accent-white"
                  />
                  Remember Me
                </label>

                <button type="button" className="text-blue-500 hover:underline">
                  Forget Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-white text-black font-semibold py-3 hover:bg-white/90 transition disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <p className="text-sm text-white/50 text-center mt-4">
                Don't have an account?{" "}
                <span className="text-white font-semibold cursor-pointer hover:underline">
                  Create Account
                </span>
              </p>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
