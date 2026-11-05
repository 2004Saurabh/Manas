import React, { useState } from "react";
import {
  Shield,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  MapPin,
  CheckCircle2,
  ArrowLeft,
  KeyRound,
} from "lucide-react";
import { authenticateUser, resetPortalDataToDefaults } from "./portalData";

export default function PortalLoginPage({
  employees,
  onLoginSuccess,
  onNavigateHome,
}) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotResetSuccess, setForgotResetSuccess] = useState(false);
  const [forgotId, setForgotId] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    const result = authenticateUser(identifier, password, employees);
    if (result.success) {
      onLoginSuccess(result.user, rememberMe);
    } else {
      setErrorMessage(result.error);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotResetSuccess(true);
    setTimeout(() => {
      setForgotResetSuccess(false);
      setShowForgotModal(false);
    }, 2500);
  };

  const handleResetData = () => {
    if (window.confirm("Reset all portal mock data & sessions to default factory state?")) {
      resetPortalDataToDefaults();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-foreground flex flex-col justify-between selection:bg-primary/40 selection:text-white">
      {/* Top Bar with Return to Public Site */}
      <header className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:bg-white/10 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Manas Website</span>
        </button>

        <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Indore HQ GPS Geofence Online</span>
        </div>
      </header>

      {/* Center Auth Card Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl grid gap-8 lg:grid-cols-12 items-center">
          {/* Left Hero / Brand Box */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <Shield className="h-3.5 w-3.5" />
              <span>Internal Personnel Portal · v1.0</span>
            </div>

            <div>
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                MANAS ADVERTISING
              </h1>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Employee Attendance, GPS Field Verification & Client Quotation Management System.
              </p>
            </div>

            {/* Geofence Info Notice */}
            <div className="rounded-2xl border border-white/10 bg-[#12131a] p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold">
                <MapPin className="h-4 w-4 text-accent" />
                <span>Geofence Monitored Access</span>
              </div>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Attendance timestamps and client visit recordings are authenticated with precision coordinates and server-authoritative timestamps.
              </p>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-[#12131a] p-7 shadow-2xl backdrop-blur-xl">
            <div className="border-b border-white/10 pb-4 mb-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                <span>Sign In to Your Workspace</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Enter your Employee ID, registered email, or mobile number
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                  Employee ID / Email / Mobile *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. EMP-001 or rahul.s@manasadvertising.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 pl-10 pr-3 py-2.5 text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-muted-foreground block">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] text-accent hover:underline font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your secret password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 pl-10 pr-10 py-2.5 text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-white/20 bg-white/5 text-primary focus:ring-primary"
                  />
                  <span>Keep me signed in</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-primary py-3 text-center text-xs font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Authorize & Sign In</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#12131a] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-primary" />
                <span>Password Recovery Assistance</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="grid h-7 w-7 place-items-center rounded-lg bg-white/5 text-muted-foreground hover:text-white"
              >
                ✕
              </button>
            </div>

            {forgotResetSuccess ? (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center space-y-2">
                <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
                <h4 className="text-xs font-bold text-emerald-300">
                  Password Reset Instructions Sent!
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Temporary login OTP has been dispatched to your registered phone number & company email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3.5 text-xs">
                <p className="text-muted-foreground leading-relaxed">
                  Enter your registered Employee ID or mobile number. The administrator desk will dispatch a reset code.
                </p>
                <div>
                  <label className="text-[11px] text-muted-foreground block mb-1">
                    Employee ID or Mobile *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EMP-003 or 9425088991"
                    value={forgotId}
                    onChange={(e) => setForgotId(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="rounded-xl border border-white/10 px-3 py-1.5 text-muted-foreground hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-primary px-4 py-1.5 font-bold text-primary-foreground hover:bg-primary/90"
                  >
                    Request Password Reset
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground border-t border-white/5">
        <div>
          Manas Advertising Internal Management Portal · Version 1.0 (9 October 2026) · All Rights Reserved
        </div>
        <button
          type="button"
          onClick={handleResetData}
          className="text-[11px] text-muted-foreground/60 hover:text-accent hover:underline cursor-pointer"
        >
          Reset Demo Data / Clear Cache
        </button>
      </footer>
    </div>
  );
}
