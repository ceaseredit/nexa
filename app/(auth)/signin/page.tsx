"use client";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { COLORS } from "@/constants/Theme";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "@/store/slices/userAuthSlice";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AiOutlineBank } from "react-icons/ai";
import { GoArrowLeft } from "react-icons/go";
import { MdFingerprint, MdLock, MdOutlineShield } from "react-icons/md";
import { VscRobot } from "react-icons/vsc";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { RootState } from "@/store";

type Step = "credentials" | "otp";

function Page() {
  const dispatch = useDispatch<any>();
  const router = useRouter();
  const { loading, error } = useSelector((state: RootState) => state?.user);

  const [step, setStep] = useState<Step>("credentials");
  const [showPassword, setShowPassword] = useState(false);
  const [routingNumber, setRoutingNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resolvedUser, setResolvedUser] = useState<any>(null);

  // Step 1 — validate credentials
  const handleCredentialsSubmit = async () => {
    if (!routingNumber.trim() || !password.trim()) return;

    const result = await dispatch(userLogin({ routingNumber, password }));

    if (userLogin.fulfilled.match(result)) {
      setResolvedUser(result.payload);
      setStep("otp");
    }
  };

  // Step 2 — validate OTP
  const handleOtpSubmit = () => {
    if (!resolvedUser) return;
    if (otp === String(resolvedUser.otp)) {
      router.push("/dashboard");
    } else {
      setOtpError("Incorrect verification code. Please try again.");
      setOtp("");
    }
  };

  const handleBack = () => {
    if (step === "otp") {
      setStep("credentials");
      setOtp("");
      setOtpError("");
    } else {
      router.push("/");
    }
  };

  return (
    <div>
      <div className="grid flex-1 w-full grid-col-1 lg:grid-cols-2">
        {/* ── Left panel ── */}
        <div className="py-20 px-20 h-screen hidden lg:flex flex-col justify-between bg-linear-to-r from-[#1E3B8E] via-[#1E4DD8] to-[#2E45D3]">
          <div>
            <Link href="/">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg md:w-10 md:h-10 bg-white/20">
                  <AiOutlineBank size={20} color="white" />
                </div>
                <h1 className="text-xl font-bold text-white">
                  Silver<span>Capital</span>
                </h1>
              </div>
            </Link>
          </div>
          <div className="flex flex-col gap-5">
            <p className="font-bold tracking-wider uppercase text-[#6D9FEE] text-[15px]">
              trusted worldwide
            </p>
            <h1 className="text-5xl font-bold text-white">
              Secure banking
              <br />
              that moves
              <br />
              at your speed
            </h1>
            <div className="grid grid-cols-2 gap-5">
              {[
                {
                  icon: <MdOutlineShield size={18} color="white" />,
                  title: "FDIC Insured",
                  sub: "Up to $250,000",
                },
                {
                  icon: <MdLock size={18} color="white" />,
                  title: "256-bit SSL",
                  sub: "Bank-grade encryption",
                },
                {
                  icon: <MdFingerprint size={18} color="white" />,
                  title: "Biometric Auth",
                  sub: "Face ID and Touch",
                },
                {
                  icon: <VscRobot size={18} color="white" />,
                  title: "AI Fraud Guard",
                  sub: "Real-time protection",
                },
              ].map(({ icon, title, sub }) => (
                <div key={title} className="bg-[#325CDC] py-3 px-3 rounded-xl">
                  <div className="flex flex-row items-center gap-3">
                    <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-[#5173DC]">
                      {icon}
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-[14px]">
                        {title}
                      </h2>
                      <p className="text-[12px] text-white/40">{sub}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[12px] text-white/30">
            © {new Date().getFullYear()} SilverCapital, inc. Member FDIC
          </p>
        </div>

        {/* ── Right panel ── */}
        <div className="w-full h-screen grid-cols-1 bg-white">
          {/* Top bar */}
          <div className="py-5 border-b">
            <div className="flex flex-row items-center gap-20 px-5 md:gap-[300px] lg:gap-[350px]">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 font-semibold text-gray-400 transition-colors hover:text-gray-600"
              >
                <GoArrowLeft size={25} />
              </button>
              <Link href="/" className="lg:hidden">
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg md:w-10 md:h-10"
                    style={{ backgroundColor: COLORS.primaryBlue }}
                  >
                    <AiOutlineBank size={20} color="white" />
                  </div>
                  <h1 className="text-lg font-bold">
                    Silver<span>Capital</span>
                  </h1>
                </div>
              </Link>
            </div>
          </div>

          {/* ── Step 1: Credentials ── */}
          {step === "credentials" && (
            <div className="w-full px-5 mt-36 md:mt-40 lg:mt-52 md:px-48">
              <div>
                <h1
                  className="font-bold text-[35px]"
                  style={{ color: COLORS.primaryBlack }}
                >
                  Welcome back
                </h1>
                <p className="text-[13px] font-medium text-gray-400">
                  Sign in to your SilverCapital account
                </p>
              </div>

              <div className="flex flex-col gap-5 mt-10 md:gap-6">
                <Field>
                  <FieldLabel htmlFor="routing-number">
                    Routing / Account Number
                  </FieldLabel>
                  <Input
                    id="routing-number"
                    type="text"
                    placeholder="Enter your routing number"
                    value={routingNumber}
                    onChange={(e) => setRoutingNumber(e.target.value)}
                    className="px-4 h-14 bg-[#F9FAFC] font-semibold"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <InputGroup className="h-14 bg-[#F9FAFC]">
                    <InputGroupInput
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleCredentialsSubmit()
                      }
                      className="px-4 font-semibold"
                    />
                    <InputGroupAddon
                      align="inline-end"
                      className="px-4 cursor-pointer"
                      onClick={() => setShowPassword((p) => !p)}
                    >
                      {showPassword ? (
                        <EyeIcon size={18} />
                      ) : (
                        <EyeOffIcon size={18} />
                      )}
                    </InputGroupAddon>
                  </InputGroup>
                </Field>

                {/* Error */}
                {error && (
                  <p className="px-4 py-2 text-sm font-medium text-red-500 rounded-lg bg-red-50">
                    {error}
                  </p>
                )}

                <button
                  onClick={handleCredentialsSubmit}
                  disabled={
                    loading || !routingNumber.trim() || !password.trim()
                  }
                  className="w-full py-4 mt-5 font-bold tracking-wide text-white transition-opacity rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ backgroundColor: COLORS.primaryBlack }}
                >
                  {loading ? "Checking..." : "Continue"}
                </button>

                <div className="mx-auto md:mt-5">
                  <p className="text-gray-500 flex flex-row gap-2">
                    Don't have an account?{" "}
                    <div
                      onClick={() =>
                        alert(
                          "Please visit any of our branches to create an account",
                        )
                      }
                      style={{ color: COLORS.primaryBlue }}
                      className="font-semibold"
                    >
                      Open Account
                    </div>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: OTP ── */}
          {step === "otp" && (
            <div className="w-full px-5 mt-36 md:mt-40 lg:mt-52 md:px-48">
              {/* Avatar */}
              <div className="flex items-center justify-center mb-8">
                <Avatar className="size-20">
                  <AvatarImage
                    src={resolvedUser?.image ?? ""}
                    alt={resolvedUser?.name ?? "User"}
                  />
                  <AvatarFallback className="text-lg font-bold">
                    {resolvedUser?.name?.[0]?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                  <AvatarBadge className="bg-green-500" />
                </Avatar>
              </div>

              <div className="text-center">
                <h1
                  className="font-bold text-[28px]"
                  style={{ color: COLORS.primaryBlack }}
                >
                  Verify it's you
                </h1>
                <p className="text-[13px] font-medium text-gray-400 mt-1">
                  Enter the 6-digit code for{" "}
                  <span className="font-semibold text-gray-600">
                    {resolvedUser?.name ?? "your account"}
                  </span>
                </p>
              </div>

              <div className="flex flex-col items-center gap-5 mt-10">
                <InputOTP
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                  value={otp}
                  onChange={(val) => {
                    setOtp(val);
                    setOtpError("");
                  }}
                  onComplete={handleOtpSubmit}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="w-10 h-16" />
                    <InputOTPSlot index={1} className="w-10 h-16" />
                    <InputOTPSlot index={2} className="w-10 h-16" />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} className="w-10 h-16" />
                    <InputOTPSlot index={4} className="w-10 h-16" />
                    <InputOTPSlot index={5} className="w-10 h-16" />
                  </InputOTPGroup>
                </InputOTP>

                {/* OTP error */}
                {otpError && (
                  <p className="w-full px-4 py-2 text-sm font-medium text-center text-red-500 rounded-lg bg-red-50">
                    {otpError}
                  </p>
                )}

                <button
                  onClick={handleOtpSubmit}
                  disabled={otp.length < 6}
                  className="w-full py-4 mt-4 font-bold tracking-wide text-white transition-opacity rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ backgroundColor: COLORS.primaryBlack }}
                >
                  Verify & Sign in
                </button>

                <button
                  onClick={() => {
                    setStep("credentials");
                    setOtp("");
                    setOtpError("");
                  }}
                  className="text-[13px] text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Use a different account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
