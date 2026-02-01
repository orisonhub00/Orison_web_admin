"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { loginAction, loginWithPhoneAction } from "@/actions/auth";
import { getFirebaseAuth } from "@/lib/firebase"; 
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { setAdminToken } from "@/lib/getToken";
import LoadingOverlay from "@/components/reuseble_components/LoadingOverlay";

// declare global removed

export default function Login() {
  // ✅ Stages
  const STAGES = {
    SELECT_ROLE: "select_role",
    SELECT_METHOD: "select_method",

    EMAIL_LOGIN: "email_login",
    FORGOT_PASSWORD: "forgot_password",
    RESET_PASSWORD: "reset_password",

    MOBILE_LOGIN: "mobile_login",
    OTP: "otp",
  };

  const [stage, setStage] = useState(STAGES.SELECT_ROLE);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ role
  const [role, setRole] = useState(""); // "admin" | "principal"
  const router = useRouter();

  // ✅ email login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  // ✅ forgot password
  const [forgotEmail, setForgotEmail] = useState("");

  // ✅ reset password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // ✅ mobile login
  const [mobile, setMobile] = useState(""); // only digits
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  // ---------- Validations ----------
  const isValidEmail = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  const isValidMobile = (val: string) => /^\d{10}$/.test(val); // Indian 10 digits only

  const isRoleSelected = useMemo(
    () => role === "admin" || role === "principal",
    [role]
  );

  const isEmailLoginValid = useMemo(() => {
    return isValidEmail(email) && password.trim().length >= 4;
  }, [email, password]);

  const isForgotEmailValid = useMemo(
    () => isValidEmail(forgotEmail),
    [forgotEmail]
  );

  const isResetValid = useMemo(() => {
    return (
      newPassword.length >= 6 &&
      confirmPassword.length >= 6 &&
      newPassword === confirmPassword
    );
  }, [newPassword, confirmPassword]);

  const isMobileValid = useMemo(() => isValidMobile(mobile), [mobile]);

  const otpString = useMemo(() => otp.join(""), [otp]);
  const isOtpValid = useMemo(
    () => otpString.length === 6 && /^\d{6}$/.test(otpString),
    [otpString]
  );

  // ---------- Actions (Demo Only) ----------
  const handleGoSelectMethod = () => {
    if (!isRoleSelected) return;
    setStage(STAGES.SELECT_METHOD);
  };

  const handleEmailLogin = async () => {
    if (!isEmailLoginValid) return;

    try {
      setLoading(true);
      setError("");

      console.log("🔐 Starting login...");
      console.log("📨 Email:", email);

      // Call Server Action
      const data = await loginAction(email, password);

      if (!data.success) {
         throw new Error(data.message || "Login failed");
      }

      console.log("🎯 Login success response:", data);

      // Token is used by client-side APIs
      if (data.token) {
        setAdminToken(data.token);
      }
      
      // Optional: store user
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("👤 User stored in localStorage:", data.user);
      }

      // Toast instead of alert
      toast.success("Login successful!");

      // Redirect
      router.push("/dashboard");

    } catch (err: any) {
      console.error("❌ Login failed:", err);
      setError(err.message || "Invalid credentials");
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSendForgotLink = () => {
    // reference flow
    setStage(STAGES.RESET_PASSWORD);
  };

  const handleResetPassword = () => {
    toast.success("✅ Password updated successfully!");
    setStage(STAGES.EMAIL_LOGIN);
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSendOtp = async () => {
    if (loading) return;
    try {
      setLoading(true);
      setError("");

      const phoneNumber = `+91${mobile}`; // Assuming India +91, user input implies 10 digits
      console.log("📱 Sending OTP to:", phoneNumber);

      // Lazy load auth only when user clicks send
      const auth = getFirebaseAuth();

      if (!(window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
          callback: (response: any) => {
            // reCAPTCHA solved
            console.log("reCAPTCHA solved");
          }, 
        });
      }

      const appVerifier = (window as any).recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      
      setConfirmationResult(confirmation);
      toast.success("OTP Sent successfully!");

      setStage(STAGES.OTP);
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => otpRefs.current[0]?.focus(), 50);

    } catch (err: any) {
      console.error("❌ Send OTP failed:", err);
      
      let friendlyMessage = "Failed to send OTP";
      if (err.code === "auth/billing-not-enabled") {
        friendlyMessage = "Firebase SMS requires billing or Test Numbers. Please use a Test Phone Number (see walkthrough).";
      } else if (err.code === "auth/invalid-api-key") {
        friendlyMessage = "Firebase Configuration Error: Invalid API Key.";
      } else {
        friendlyMessage = err.message || "Something went wrong";
      }

      setError(friendlyMessage);
      toast.error(friendlyMessage);

      if ((window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
        } catch (e) {
          console.warn("reCAPTCHA clear failed:", e);
        }
        (window as any).recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!confirmationResult) {
      setError("Session expired. Please request OTP again.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const otpValue = otp.join("");
      console.log("🔢 Verifying OTP...");

      // 1. Verify with Firebase
      const result = await confirmationResult.confirm(otpValue);
      const user = result.user;
      console.log("✅ Firebase Auth Success:", user.uid);

      // 2. Get ID Token
      const idToken = await user.getIdToken();

      // 3. Verify with Backend via Server Action
      const data = await loginWithPhoneAction(idToken);

      if (!data.success) {
        throw new Error(data.message || "Backend verification failed");
      }

      console.log("🎯 Backend Login Success:", data);

      // 4. Store token for client-side API calls
      if (data.token) {
        setAdminToken(data.token);
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      toast.success("Login successful!");
      router.push("/dashboard");

    } catch (err: any) {
      console.error("❌ OTP Verification failed:", err);
      setError(err.message || "Invalid OTP");
      toast.error(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // OTP typing
  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(0, 1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpBackspace = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // ---------- Common UI ----------
  return (
    // <div className="min-h-screen w-full bg-[#f5f5f5] flex flex-col items-center justify-center px-4">
    <div className="min-h-screen w-full bg-[#f5f5f5] px-4 flex flex-col">
      {loading && <LoadingOverlay message="Authenticating... Please wait." />}
      {/* MAIN CARD AREA */}
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-[520px] flex flex-col items-center">
          {/* LOGO */}
          <div className="mb-4">
            <Image
              src="/logo.png"
              alt="Orison Services"
              width={220}
              height={70}
              priority
              className="object-contain"
            />
          </div>

          {/* ✅ STAGE: SELECT ROLE */}
          {stage === STAGES.SELECT_ROLE && (
            <div className="w-full flex flex-col items-center justify-center">
              <div className="w-full max-w-[280px] space-y-3">
                <button
                  onClick={() => {
                    setRole("admin");
                    setStage(STAGES.SELECT_METHOD);
                  }}
                  className="w-full rounded-2xl bg-primary px-4 py-2 text-[12px] font-semibold text-white hover:opacity-90 transition"
                >
                  Login as Admin
                </button>

                <button
                  onClick={() => {
                    setRole("principal");
                    setStage(STAGES.SELECT_METHOD);
                  }}
                  className="w-full rounded-2xl bg-primary px-4 py-2 text-[12px] font-semibold text-white hover:opacity-90 transition"
                >
                  Login as Principal
                </button>
              </div>
            </div>
          )}

          {/* ✅ STAGE: SELECT METHOD */}
          {stage === STAGES.SELECT_METHOD && (
            <div className="w-full flex flex-col items-center">
              <div className="w-full max-w-[280px] space-y-3">
                <button
                  onClick={() => setStage(STAGES.MOBILE_LOGIN)}
                  className="w-full rounded-md bg-primary px-4 py-2 text-[12px] font-semibold text-white hover:opacity-90 transition"
                >
                  Login with phone number
                </button>

                <button
                  onClick={() => setStage(STAGES.EMAIL_LOGIN)}
                  className="w-full rounded-md border border-primary/70 bg-white px-4 py-2 text-[12px] font-semibold text-primary hover:bg-primary hover:text-white transition"
                >
                  Login with Email
                </button>

                <button
                  onClick={() => setStage(STAGES.SELECT_ROLE)}
                  className="w-full text-[12px] font-medium text-gray-500 hover:text-black transition pt-2"
                >
                  ← Back
                </button>
              </div>
            </div>
          )}

          {/* ✅ STAGE: EMAIL LOGIN */}
          {stage === STAGES.EMAIL_LOGIN && (
            <div className="w-full flex flex-col items-center">
              <p className="text-[13px] font-semibold text-primary mb-5">
                Log in with Email
              </p>

              <div className="w-full max-w-[360px] space-y-4">
                {/* Email */}
                <div>
                  <label className="text-[11px] font-semibold text-black">
                    Email <span className="text-primary">*</span>
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="eg: orisonservices@gmail.com"
                    className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-[12px] outline-none focus:border-primary"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="text-[11px] font-semibold text-black">
                    Password <span className="text-primary">*</span>
                  </label>

                  <div className="relative mt-1">
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPass ? "text" : "password"}
                      placeholder="Password"
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-[12px] outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-500 hover:text-black"
                    >
                      {showPass ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Forgot */}
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setForgotEmail(email);
                      setStage(STAGES.FORGOT_PASSWORD);
                    }}
                    className="text-[11px] text-gray-600 hover:text-black"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Login Button */}
                <button
                  disabled={!isEmailLoginValid || loading}
                  onClick={handleEmailLogin}
                  className={`w-full rounded-md px-4 py-2 text-[12px] font-semibold transition
                  ${
                    !isEmailLoginValid || loading
                      ? "bg-gray-200 text-gray-400"
                      : "bg-primary text-white hover:opacity-90"
                  }`}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

                <button
                  onClick={() => setStage(STAGES.SELECT_METHOD)}
                  className="w-full text-[12px] font-medium text-gray-500 hover:text-black transition pt-2"
                >
                  ← Back
                </button>
              </div>
            </div>
          )}

          {/* ✅ STAGE: FORGOT PASSWORD */}
          {stage === STAGES.FORGOT_PASSWORD && (
            <div className="w-full flex flex-col items-center">
              <p className="text-[16px] font-bold text-black mb-1">
                Forgot Password
              </p>
              <p className="text-[11px] text-gray-500 mb-5">
                Please enter your registered Email Id to send Reset link
              </p>

              <div className="w-full max-w-[360px] space-y-4">
                <div>
                  <label className="text-[11px] font-semibold text-black">
                    Email <span className="text-primary">*</span>
                  </label>
                  <input
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="eg: plotix@gmail.com"
                    className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-[12px] outline-none focus:border-primary"
                  />
                </div>

                <button
                  disabled={!isForgotEmailValid}
                  onClick={handleSendForgotLink}
                  className={`w-full rounded-md px-4 py-2 text-[12px] font-semibold transition
                  ${
                    !isForgotEmailValid
                      ? "bg-gray-200 text-gray-400"
                      : "bg-primary text-white hover:opacity-90"
                  }`}
                >
                  Send
                </button>

                <div className="text-center text-[11px] text-gray-500">
                  Didn’t get link?{" "}
                  <button className="text-black font-semibold hover:underline">
                    Re-Send
                  </button>
                </div>

                <button
                  onClick={() => setStage(STAGES.EMAIL_LOGIN)}
                  className="w-full text-[12px] font-medium text-gray-500 hover:text-black transition pt-2"
                >
                  ← Back
                </button>
              </div>
            </div>
          )}

          {/* ✅ STAGE: RESET PASSWORD */}
          {stage === STAGES.RESET_PASSWORD && (
            <div className="w-full flex flex-col items-center">
              <p className="text-[14px] font-bold text-black mb-1">
                Create new password
              </p>
              <p className="text-[11px] text-gray-500 mb-5">
                Set your new password here.
              </p>

              <div className="w-full max-w-[360px] space-y-4">
                {/* New password */}
                <div className="relative">
                  <input
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    type={showNewPass ? "text" : "password"}
                    placeholder="Create Password"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-14 text-[12px] outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-500 hover:text-black"
                  >
                    {showNewPass ? "Hide" : "Show"}
                  </button>
                </div>

                {/* Confirm password */}
                <div className="relative">
                  <input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type={showConfirmPass ? "text" : "password"}
                    placeholder="Re-enter password"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-14 text-[12px] outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-500 hover:text-black"
                  >
                    {showConfirmPass ? "Hide" : "Show"}
                  </button>
                </div>

                <button
                  disabled={!isResetValid}
                  onClick={handleResetPassword}
                  className={`w-full rounded-md px-4 py-2 text-[12px] font-semibold transition
                  ${
                    !isResetValid
                      ? "bg-gray-200 text-gray-400"
                      : "bg-primary text-white hover:opacity-90"
                  }`}
                >
                  Submit
                </button>

                <div className="text-center text-[11px] text-gray-500">
                  Didn’t get link?{" "}
                  <button className="text-black font-semibold hover:underline">
                    Re-Send
                  </button>
                </div>

                <button
                  onClick={() => setStage(STAGES.EMAIL_LOGIN)}
                  className="w-full text-[12px] font-medium text-gray-500 hover:text-black transition pt-2"
                >
                  ← Back
                </button>
              </div>
            </div>
          )}

          {/* ✅ STAGE: MOBILE LOGIN */}
          {stage === STAGES.MOBILE_LOGIN && (
            <div className="w-full flex flex-col items-center">
              <p className="text-[13px] font-bold text-black mb-5">
                Log in with Mobile number
              </p>

              <div className="w-full max-w-[360px] space-y-4">
                <div>
                  <label className="text-[11px] font-semibold text-black">
                    Enter Mobile Number <span className="text-primary">*</span>
                  </label>

                  <input
                    value={mobile}
                    onChange={(e) => {
                      const digits = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);
                      setMobile(digits);
                    }}
                    placeholder="eg: 9876543210"
                    className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-[12px] outline-none focus:border-primary"
                  />
                </div>

                <button
                  disabled={!isMobileValid || loading}
                  onClick={handleSendOtp}
                  className={`w-full rounded-md px-4 py-2 text-[12px] font-semibold transition
                  ${
                    !isMobileValid || loading
                      ? "bg-gray-200 text-gray-400"
                      : "bg-primary text-white hover:opacity-90"
                  }`}
                >
                  {loading ? "Sending..." : "Get Otp"}
                </button>

                <button
                  onClick={() => setStage(STAGES.SELECT_METHOD)}
                  className="w-full text-[12px] font-medium text-gray-500 hover:text-black transition pt-2"
                >
                  ← Back
                </button>
              </div>
            </div>
          )}

          {/* ✅ STAGE: OTP */}
          {stage === STAGES.OTP && (
            <div className="w-full flex flex-col items-center">
              <p className="text-[14px] font-bold text-black mb-5">Enter OTP</p>

              <div className="w-full max-w-[360px] space-y-5">
                {/* OTP inputs */}
                <div className="flex justify-center gap-4">
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        otpRefs.current[i] = el;
                      }}
                      value={d}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpBackspace(i, e)}
                      inputMode="numeric"
                      maxLength={1}
                      className="h-10 w-10 border-b-2 border-gray-400 bg-transparent text-center text-[16px] outline-none focus:border-primary"
                    />
                  ))}
                </div>

                <button
                  disabled={!isOtpValid}
                  onClick={handleVerifyOtp}
                  className={`w-full rounded-md px-4 py-2 text-[12px] font-semibold transition
                  ${
                    !isOtpValid
                      ? "bg-gray-200 text-gray-400"
                      : "bg-gray-300 text-gray-600 hover:bg-primary hover:text-white"
                  }`}
                >
                  Login
                </button>

                <button
                  onClick={() => setStage(STAGES.MOBILE_LOGIN)}
                  className="w-full text-[12px] font-medium text-gray-500 hover:text-black transition pt-2"
                >
                  ← Back
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="pb-6 text-center text-[12px] text-primary">
        © Copyright 2025 Orison services
      </div>
      <div id="recaptcha-container"></div>
    </div>
  );
}
