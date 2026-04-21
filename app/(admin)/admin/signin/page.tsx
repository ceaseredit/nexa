"use client";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { adminLogin } from "@/store/slices/adminAuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { COLORS } from "@/constants/Theme";
import { Eye, EyeOff, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiOutlineBank } from "react-icons/ai";
import { GoArrowLeft } from "react-icons/go";
import { MdFingerprint, MdLock, MdOutlineShield } from "react-icons/md";
import { VscRobot } from "react-icons/vsc";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";

// ── Validation helpers ────────────────────────────────────────────────────────

interface FormErrors {
  username?: string;
  password?: string;
}

function validateForm(form: {
  username: string;
  password: string;
}): FormErrors {
  const errors: FormErrors = {};

  const trimmedUsername = form.username.trim();
  if (!trimmedUsername) {
    errors.username = "Username is required.";
  } else if (trimmedUsername.length < 2) {
    errors.username = "Username must be at least 2 characters.";
  } else if (trimmedUsername.length > 50) {
    errors.username = "Username must be under 50 characters.";
  } else if (!/^[a-zA-Z'-]+$/.test(trimmedUsername)) {
    errors.username = "Username cannot contain spaces or special characters.";
  }

  if (!form.password) {
    errors.password = "Password is required.";
  }

  return errors;
}

// ── Component ─────────────────────────────────────────────────────────────────

function SignIn() {
  const dispatch = useDispatch<any>();
  const router = useRouter();

  const { loading, error, admin } = useSelector(
    (state: RootState) => state.admin,
  );

  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ username: false, password: false });
  const [form, setForm] = useState({ username: "", password: "" });
  const [clientErrors, setClientErrors] = useState<FormErrors>({});

  // Re-validate whenever form changes (only for touched fields)
  useEffect(() => {
    const errs = validateForm(form);
    setClientErrors({
      username: touched.username ? errs.username : undefined,
      password: touched.password ? errs.password : undefined,
    });
  }, [form, touched]);

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = () => {
    setTouched({ username: true, password: true });
    const errs = validateForm(form);
    if (Object.keys(errs).length > 0) return;
    dispatch(adminLogin(form));
  };

  // Redirect on success
  useEffect(() => {
    if (admin && !loading) {
      router.replace("/admin/dashboard");
    }
  }, [admin, loading]);

  return (
    <div>
      <div className="grid flex-1 w-full grid-col-1 lg:grid-cols-2">
        {/* ── Left panel ─────────────────────────────────────────────────── */}
        <div className="py-20 px-20 h-screen hidden lg:flex flex-col justify-between grid-cols-1 bg-linear-to-r from-[#1E3B8E] via-[#1E4DD8] to-[#2E45D3]">
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
          <div>
            <p className="text-[12px] text-white/30">
              © {new Date().getFullYear()} SilverCapitalBank
            </p>
          </div>
        </div>

        {/* ── Right panel ────────────────────────────────────────────────── */}
        <div className="w-full h-screen grid-cols-1 overflow-y-auto bg-white">
          <div className="py-5 border-b">
            <div className="flex flex-row items-center gap-20 px-5 md:gap-[300px] lg:gap-[350px]">
              <button
                className="flex items-center gap-2 font-semibold text-gray-400 transition-colors hover:text-gray-600"
                onClick={() => router.back()}
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

          <div className="w-full px-5 pb-12 mt-36 md:mt-40 lg:mt-52 md:px-48">
            <div>
              <h1
                className="font-bold text-[35px]"
                style={{ color: COLORS.primaryBlack }}
              >
                Welcome back
              </h1>
              <p className="text-[13px] font-medium text-gray-400">
                Sign in to your NexaBank admin account
              </p>
            </div>

            <div className="flex flex-col gap-5 mt-10 md:gap-6">
              {/* ── Name field ─────────────────────────────────────────── */}
              <Field>
                <FieldLabel htmlFor="input-field-username">Username</FieldLabel>
                <Input
                  id="input-field-username"
                  type="text"
                  placeholder="Enter your username"
                  value={form.username}
                  className={`px-4 h-14 bg-[#F9FAFC] font-semibold border transition-colors ${
                    clientErrors.username
                      ? "border-red-400 focus:border-red-500"
                      : touched.username &&
                          !clientErrors.username &&
                          form.username
                        ? "border-green-400 focus:border-green-500"
                        : "border-gray-200"
                  }`}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  onBlur={() => handleBlur("username")}
                  disabled={loading}
                  aria-invalid={!!clientErrors.username}
                  aria-describedby={
                    clientErrors.username ? "name-error" : undefined
                  }
                />
                {clientErrors.username && (
                  <p
                    id="name-error"
                    className="flex items-center gap-1 mt-1 text-xs text-red-500"
                  >
                    <XCircle size={13} /> {clientErrors.username}
                  </p>
                )}
              </Field>

              {/* ── Password field ─────────────────────────────────────── */}
              <Field>
                <FieldLabel htmlFor="inline-end-input">Password</FieldLabel>
                <InputGroup
                  className={`h-14 bg-[#F9FAFC] border rounded-lg transition-colors ${
                    clientErrors.password
                      ? "border-red-400"
                      : touched.password &&
                          !clientErrors.password &&
                          form.password
                        ? "border-green-400"
                        : "border-gray-200"
                  }`}
                >
                  <InputGroupInput
                    id="inline-end-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={form.password}
                    className="px-4 font-semibold"
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    onBlur={() => handleBlur("password")}
                    disabled={loading}
                    aria-invalid={!!clientErrors.password}
                    aria-describedby={
                      clientErrors.password ? "password-error" : undefined
                    }
                  />
                  <InputGroupAddon
                    align="inline-end"
                    className="px-4 text-gray-400 transition-colors cursor-pointer hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </InputGroupAddon>
                </InputGroup>
                {clientErrors.password && (
                  <p
                    id="password-error"
                    className="flex items-center gap-1 mt-1 text-xs text-red-500"
                  >
                    <XCircle size={13} /> {clientErrors.password}
                  </p>
                )}
              </Field>

              {/* ── Server error ───────────────────────────────────────── */}
              {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-50 border border-red-200">
                  <XCircle size={16} className="text-red-500 shrink-0" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* ── Submit button ──────────────────────────────────────── */}
              <button
                className="flex items-center justify-center w-full gap-2 py-4 mt-5 font-bold tracking-wide text-white transition-opacity rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: COLORS.primaryBlack }}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
