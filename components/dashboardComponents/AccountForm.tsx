"use client";
import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { COLORS } from "@/constants/Theme";
import { BsSend } from "react-icons/bs";
import { FiEdit3 } from "react-icons/fi";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FiPlus, FiTrash2, FiCamera } from "react-icons/fi";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import { supabase } from "@/lib/supabase";

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "C$",
  AUD: "A$",
  JPY: "¥",
  CHF: "Fr",
  CNY: "¥",
  INR: "₹",
  MXN: "$",
  BRL: "R$",
  NGN: "₦",
};

type TransactionType = "credit" | "debit" | "pending";

interface HistoryRow {
  id: string;
  date: string;
  name: string;
  type: TransactionType | "";
  amount: string;
}

interface InvestmentRow {
  id: string;
  name: string;
  numberOfShares: string;
  amount: string;
}

interface FormState {
  accountName: string;
  routingNumber: string;
  otp: string;
  password: string;
  currency: string;
  customCurrency: string;
  currencySymbol: string;
  customCurrencySymbol: string;
  errorMsg: string;
  savings: string;
  checking: string;
  oldHistory: boolean;
  canSendFunds: boolean;
  transferError: string;
  avatarFile: File | null;
  avatarPreview: string;
  histories: HistoryRow[];
  investments: InvestmentRow[];
  assignedAdmin: string;
}

const makeHistoryRow = (): HistoryRow => ({
  id: crypto.randomUUID(),
  date: "",
  name: "",
  type: "",
  amount: "",
});

const makeInvestmentRow = (): InvestmentRow => ({
  id: crypto.randomUUID(),
  name: "",
  numberOfShares: "",
  amount: "",
});

// Convert a raw DB history entry to a HistoryRow (adds a local id)
const toHistoryRow = (h: any): HistoryRow => ({
  id: crypto.randomUUID(),
  date: h.date ?? "",
  name: h.name ?? "",
  type: h.type ?? "",
  amount: String(h.amount ?? ""),
});

const toInvestmentRow = (i: any): InvestmentRow => ({
  id: crypto.randomUUID(),
  name: i.name ?? "",
  numberOfShares: String(i.numberOfShares ?? ""),
  amount: String(i.amount ?? ""),
});

interface AccountFormProps {
  mode: "create" | "edit";
  initialData?: any; // raw Supabase row when editing
}

export default function AccountForm({ mode, initialData }: AccountFormProps) {
  const { admin } = useSelector((state: RootState) => state.admin);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [savingsFocused, setSavingsFocused] = useState(false);
  const [checkingFocused, setCheckingFocused] = useState(false);
  const [adminsList, setAdminsList] = useState<string[]>([]);

  const isEdit = mode === "edit";

  useEffect(() => {
    const fetchAdmins = async () => {
      const { data } = await supabase
        .from("admins")
        .select("username")
        .order("username", { ascending: true });
      setAdminsList(data?.map((a: any) => a.username) ?? []);
    };
    fetchAdmins();
  }, []);

  useEffect(() => {
    if (isEdit) return;

    const now = new Date();

    // Pull time parts
    const ms = now.getMilliseconds(); // 0–999
    const sec = now.getSeconds(); // 0–59
    const min = now.getMinutes(); // 0–59
    const hour = now.getHours(); // 0–23
    const day = now.getDate(); // 1–31
    const month = now.getMonth() + 1; // 1–12

    // Mix them up — interleave and scramble so it doesn't look like a date
    const digits = [
      sec % 10,
      day % 10,
      (hour + sec) % 10,
      Math.floor(ms / 100),
      (min + day) % 10,
      Math.floor((ms % 100) / 10),
      (sec + month) % 10,
      (hour + min) % 10,
      ms % 10,
      (day + hour) % 10,
    ];

    const routing = digits.join("");
    setForm((prev) => ({ ...prev, routingNumber: routing }));
  }, []);

  const [createdAccount, setCreatedAccount] = useState<{
    avatar: string;
    routingNumber: string;
    password: string;
  } | null>(null);

  // ── Determine initial currency key ──
  const resolveInitialCurrencyKey = (data: any): string => {
    if (!data) return "USD";
    const known = Object.keys(CURRENCY_SYMBOLS);
    return known.includes(data.currency) ? data.currency : "custom";
  };

  const buildInitialForm = (data?: any): FormState => ({
    accountName: data?.name ?? "",
    routingNumber: data?.routingNumber ?? "",
    otp: data?.otp ? String(data.otp) : "",
    password: data?.password ?? "",
    currency: resolveInitialCurrencyKey(data),
    currencySymbol: data?.currencySymbol ?? "$",
    customCurrency:
      resolveInitialCurrencyKey(data) === "custom"
        ? (data?.currency ?? "")
        : "",
    customCurrencySymbol:
      resolveInitialCurrencyKey(data) === "custom"
        ? (data?.currencySymbol ?? "")
        : "",
    errorMsg: data?.topErrorMsg ?? "",
    savings: String(data?.savingsBalance ?? ""),
    checking: String(data?.checkingBalance ?? ""),
    oldHistory: data?.hasHistory ?? true,
    canSendFunds: data?.canSendFunds ?? false,
    transferError: data?.transferError ?? "",
    avatarFile: null,
    avatarPreview: data?.image ?? "",
    assignedAdmin: data?.admin ?? admin?.username ?? "",
    histories:
      Array.isArray(data?.history) && data.history.length > 0
        ? data.history.map(toHistoryRow)
        : [makeHistoryRow()],
    investments:
      Array.isArray(data?.investments) && data.investments.length > 0
        ? data.investments.map(toInvestmentRow)
        : [makeInvestmentRow()],
  });

  const [form, setForm] = useState<FormState>(() =>
    buildInitialForm(initialData),
  );

  // Re-populate if initialData arrives late (edit page async fetch)
  useEffect(() => {
    if (isEdit && initialData) {
      setForm(buildInitialForm(initialData));
    }
  }, [initialData]);

  const handleChange = (field: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({
      ...prev,
      avatarFile: file,
      avatarPreview: URL.createObjectURL(file),
    }));
  };

  // ── History rows ──
  const handleHistoryChange = (
    id: string,
    field: keyof HistoryRow,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      histories: prev.histories.map((r) =>
        r.id === id ? { ...r, [field]: value } : r,
      ),
    }));
  };
  const addHistoryRow = () =>
    setForm((prev) => ({
      ...prev,
      histories: [...prev.histories, makeHistoryRow()],
    }));
  const removeHistoryRow = (id: string) =>
    setForm((prev) => ({
      ...prev,
      histories: prev.histories.filter((r) => r.id !== id),
    }));

  // ── Investment rows ──
  const handleInvestmentChange = (
    id: string,
    field: keyof InvestmentRow,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      investments: prev.investments.map((r) =>
        r.id === id ? { ...r, [field]: value } : r,
      ),
    }));
  };
  const addInvestmentRow = () =>
    setForm((prev) => ({
      ...prev,
      investments: [...prev.investments, makeInvestmentRow()],
    }));
  const removeInvestmentRow = (id: string) =>
    setForm((prev) => ({
      ...prev,
      investments: prev.investments.filter((r) => r.id !== id),
    }));

  const investmentTotal = form.investments.reduce(
    (sum, r) => sum + (parseFloat(r.amount) || 0),
    0,
  );

  const activeSymbol =
    form.currency === "custom"
      ? form.customCurrencySymbol || "?"
      : (CURRENCY_SYMBOLS[form.currency] ?? form.currency);

  // validation
  function validate(form: FormState, isEdit: boolean): string | null {
    const accountName = String(form.accountName ?? "").trim();
    const routingNumber = String(form.routingNumber ?? "").trim();
    const password = String(form.password ?? "").trim();
    const otp = String(form.otp ?? "").trim();

    if (!accountName) return "Account name is required.";

    if (!routingNumber) return "Routing number is required.";
    if (!/^\d+$/.test(routingNumber))
      return "Routing number must contain digits only.";
    if (routingNumber.length < 6)
      return "Routing number must be at least 6 digits.";

    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";

    if (!otp || otp.length !== 6) return "OTP must be exactly 6 digits.";

    if (form.currency === "custom") {
      if (!String(form.customCurrencySymbol ?? "").trim())
        return "Custom currency symbol is required.";
      if (!String(form.customCurrency ?? "").trim())
        return "Custom currency code is required.";
    }

    const savings = parseFloat(String(form.savings ?? ""));
    const checking = parseFloat(String(form.checking ?? ""));

    if (!form.savings || isNaN(savings) || savings < 0)
      return "Savings balance is required and must be a valid number.";
    if (!form.checking || isNaN(checking) || checking < 0)
      return "Checking balance is required and must be a valid number.";

    return null;
  }

  // ── Submit ──
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg("");
    setErrorMsg("");

    // Strip spaces from password before validating
    const cleanedPassword = form.password.replace(/\s/g, "");
    if (cleanedPassword !== form.password) {
      setForm((prev) => ({ ...prev, password: cleanedPassword }));
    }
    const formToValidate = { ...form, password: cleanedPassword };

    // ── Block check ──
    const { data: adminData, error: adminFetchError } = await supabase
      .from("admins")
      .select("blocked")
      .eq("username", admin?.username)
      .single();

    if (adminFetchError || !adminData) {
      setErrorMsg("Unable to verify admin status. Please try again.");
      setSubmitting(false);
      return;
    }

    if (adminData.blocked === true) {
      setErrorMsg(
        "Your account has been blocked. You cannot perform this action.",
      );
      setSubmitting(false);
      return;
    }

    // ── Ownership check ──
    // subAdmins can only edit accounts assigned to them
    if (isEdit && admin?.role !== "masterAdmin") {
      const accountAdmin = initialData?.admin;
      if (accountAdmin !== admin?.username) {
        setErrorMsg("You can only edit accounts you created.");
        setSubmitting(false);
        return;
      }
    }
    const validationError = validate(formToValidate, isEdit);
    if (validationError) {
      setErrorMsg(validationError);
      setSubmitting(false);
      return;
    }

    try {
      // Avatar upload — only if a new file was selected
      let avatarUrl = form.avatarPreview; // keep existing URL in edit mode
      if (form.avatarFile) {
        const fileExt = form.avatarFile.name.split(".").pop();
        const fileName = `avatars/${crypto.randomUUID()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("profile-pictures")
          .upload(fileName, form.avatarFile, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from("profile-pictures")
          .getPublicUrl(fileName);
        avatarUrl = urlData.publicUrl;
      }

      const validHistories = form.histories
        .filter((h) => h.name || h.date || h.type || h.amount)
        .map(({ id, ...rest }) => ({
          date: rest.date,
          name: rest.name,
          type: rest.type,
          amount: parseFloat(rest.amount) || 0,
        }));

      const validInvestments = form.investments
        .filter((i) => i.name || i.numberOfShares || i.amount)
        .map(({ id, ...rest }) => ({
          name: rest.name,
          numberOfShares: parseInt(rest.numberOfShares) || 0,
          amount: parseFloat(rest.amount) || 0,
        }));

      const payload = {
        name: form.accountName,
        routingNumber: form.routingNumber,
        password: form.password,
        otp: form.otp,
        currency:
          form.currency === "custom" ? form.customCurrency : form.currency,
        currencySymbol:
          form.currency === "custom"
            ? form.customCurrencySymbol
            : (CURRENCY_SYMBOLS[form.currency] ?? form.currency),
        topErrorMsg: form.errorMsg,
        savingsBalance: parseFloat(form.savings) || 0,
        checkingBalance: parseFloat(form.checking) || 0,
        hasHistory: form.oldHistory,
        canSendFunds: form.canSendFunds,
        image: avatarUrl,
        history: validHistories,
        investments: validInvestments,
        transferError: form.transferError,
        admin: form.assignedAdmin,
      };

      if (isEdit) {
        // ── UPDATE ──

        // ── VALIDATION ──
        if (!form.otp || form.otp.length !== 6) {
          setErrorMsg("OTP must be 6 digits.");
          setSubmitting(false);
          return;
        }

        if (!form.savings || isNaN(Number(form.savings))) {
          setErrorMsg("Savings is required.");
          setSubmitting(false);
          return;
        }

        if (!form.checking || isNaN(Number(form.checking))) {
          setErrorMsg("Checking is required.");
          setSubmitting(false);
          return;
        }
        const { error } = await supabase
          .from("users")
          .update(payload)
          .eq("id", initialData.id);

        if (error) throw error;
        setSuccessMsg("Account updated successfully!");
      } else {
        // ── VALIDATION ──
        if (!form.otp || form.otp.length !== 6) {
          setErrorMsg("OTP must be 6 digits.");
          setSubmitting(false);
          return;
        }

        if (!form.savings || isNaN(Number(form.savings))) {
          setErrorMsg("Savings is required.");
          setSubmitting(false);
          return;
        }

        if (!form.checking || isNaN(Number(form.checking))) {
          setErrorMsg("Checking is required.");
          setSubmitting(false);
          return;
        }
        // check if routing number already exists
        const { data: existingUser, error: checkError } = await supabase
          .from("users")
          .select("id")
          .eq("routingNumber", form.routingNumber)
          .maybeSingle();

        if (checkError) throw checkError;

        if (existingUser) {
          throw new Error("Routing number already exists.");
        }

        const { data: createdUser, error } = await supabase
          .from("users")
          .insert({ ...payload, admin: admin?.username })
          .select()
          .single();

        if (error) throw error;

        setSuccessMsg("Account created successfully!");
        await fetch("/api/email/account-created", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // name: form.accountName,
            routingNumber: form.routingNumber,
            password: form.password,
            // currency: activeSymbol,
            // savingsBalance: form.savings,
            // checkingBalance: form.checking,
          }),
        });

        // 👉 trigger modal
        setCreatedAccount({
          avatar: avatarUrl,
          routingNumber: form.routingNumber,
          password: form.password,
        });

        // reset form
        setForm(buildInitialForm());
      }
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F9FAFC] p-4 lg:px-14 md:px-10 md:pt-10 lg:pt-10 h-full">
      <h1 className="text-[20px] lg:text-[25px] font-semibold">
        {isEdit ? "Edit account" : "Create account"}
      </h1>
      <p className="text-[14px] lg:text-[15px] text-gray-500">
        {isEdit
          ? "Update the account information below"
          : "Here's where you create account"}
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-w-2xl gap-5 p-5 mt-8 bg-white shadow-xl rounded-3xl"
      >
        {/* ── Avatar ── */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <Avatar
              className="w-24 h-24 cursor-pointer ring-2 ring-offset-2 ring-gray-200"
              onClick={() => fileInputRef.current?.click()}
            >
              <AvatarImage src={form.avatarPreview} alt="Profile picture" />
              <AvatarFallback className="bg-[#F9FAFC] text-gray-400 flex flex-col items-center gap-1">
                <FiCamera size={22} />
                <span className="text-[10px]">Upload</span>
              </AvatarFallback>
            </Avatar>
            {isEdit && form.avatarPreview && (
              <div
                className="absolute bottom-0 right-0 flex items-center justify-center bg-white border border-gray-200 rounded-full shadow cursor-pointer w-7 h-7"
                onClick={() => fileInputRef.current?.click()}
              >
                <FiEdit3 size={13} className="text-gray-500" />
              </div>
            )}
          </div>
          <p className="text-[12px] text-gray-400">
            Click avatar to {isEdit ? "change" : "upload"} photo
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        {/* ── Core Fields ── */}
        <div className="flex flex-col gap-5">
          {[
            { label: "Account name", field: "accountName", type: "text" },
            { label: "Routing number", field: "routingNumber", type: "text" },
            { label: "Password", field: "password", type: "text" },
            {
              label: "Top error message (shown to user)",
              field: "errorMsg",
              type: "text",
            },
          ].map(({ label, field, type }) => {
            const isSubAdmin = admin?.role === "subAdmin";
            const isLocked =
              isEdit &&
              isSubAdmin &&
              ["accountName", "routingNumber", "password"].includes(field);

            return (
              <div key={field} className="flex flex-col gap-2">
                <label
                  htmlFor={field}
                  className="text-[14px] font-semibold text-gray-500"
                >
                  {label}
                </label>
                <Input
                  id={field}
                  name={field}
                  type={type}
                  value={form[field as keyof FormState] as string}
                  onChange={(e) => {
                    if (isLocked) return;
                    const val =
                      field === "password" || field === "routingNumber"
                        ? e.target.value.replace(/\s/g, "")
                        : e.target.value;
                    handleChange(field as keyof FormState, val);
                  }}
                  readOnly={isLocked}
                  disabled={isLocked}
                  className={`h-14 bg-[#F9FAFC] text-sm font-semibold text-[#324158] ${
                    isLocked ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                />
              </div>
            );
          })}

          {/* OTP */}
          <Field>
            <FieldLabel
              htmlFor="otp"
              className="text-[14px] font-semibold text-gray-500"
            >
              OTP
            </FieldLabel>
            <InputOTP
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              name="otp"
              value={form.otp}
              onChange={(val) => handleChange("otp", val)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className="w-10 h-14" />
                <InputOTPSlot index={1} className="w-10 h-14" />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={2} className="w-10 h-14" />
                <InputOTPSlot index={3} className="w-10 h-14" />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={4} className="w-10 h-14" />
                <InputOTPSlot index={5} className="w-10 h-14" />
              </InputOTPGroup>
            </InputOTP>
          </Field>

          {/* Currency */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="currency"
              className="text-[14px] font-semibold text-gray-500"
            >
              Currency
            </label>
            <Select
              value={form.currency}
              onValueChange={(val) => {
                handleChange("currency", val);
                handleChange("currencySymbol", CURRENCY_SYMBOLS[val] ?? "");
              }}
            >
              <SelectTrigger className="h-14 bg-[#F9FAFC] text-sm font-semibold text-[#324158]">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">🇺🇸 USD — US Dollar ($)</SelectItem>
                <SelectItem value="EUR">🇪🇺 EUR — Euro (€)</SelectItem>
                <SelectItem value="GBP">🇬🇧 GBP — British Pound (£)</SelectItem>
                <SelectItem value="CAD">
                  🇨🇦 CAD — Canadian Dollar (C$)
                </SelectItem>
                <SelectItem value="AUD">
                  🇦🇺 AUD — Australian Dollar (A$)
                </SelectItem>
                <SelectItem value="JPY">🇯🇵 JPY — Japanese Yen (¥)</SelectItem>
                <SelectItem value="CHF">🇨🇭 CHF — Swiss Franc (Fr)</SelectItem>
                <SelectItem value="CNY">🇨🇳 CNY — Chinese Yuan (¥)</SelectItem>
                <SelectItem value="INR">🇮🇳 INR — Indian Rupee (₹)</SelectItem>
                <SelectItem value="MXN">🇲🇽 MXN — Mexican Peso ($)</SelectItem>
                <SelectItem value="BRL">
                  🇧🇷 BRL — Brazilian Real (R$)
                </SelectItem>
                <SelectItem value="NGN">🇳🇬 NGN — Nigerian Naira (₦)</SelectItem>
                <SelectItem value="custom">✏️ Custom...</SelectItem>
              </SelectContent>
            </Select>
            {form.currency === "custom" && (
              <div className="flex gap-2">
                <div className="flex flex-col w-24 gap-1">
                  <label className="text-[12px] font-semibold text-gray-400 uppercase tracking-wide">
                    Symbol
                  </label>
                  <Input
                    id="customCurrencySymbol"
                    placeholder="e.g. ₿"
                    value={form.customCurrencySymbol}
                    onChange={(e) =>
                      handleChange("customCurrencySymbol", e.target.value)
                    }
                    className="h-12 bg-[#F9FAFC] text-sm font-semibold text-center text-[#324158]"
                  />
                </div>
                <div className="flex flex-col flex-1 gap-1">
                  <label className="text-[12px] font-semibold text-gray-400 uppercase tracking-wide">
                    Code
                  </label>
                  <Input
                    id="customCurrency"
                    placeholder="e.g. AED, ZAR, SGD..."
                    value={form.customCurrency}
                    onChange={(e) =>
                      handleChange("customCurrency", e.target.value)
                    }
                    className="h-12 bg-[#F9FAFC] text-sm font-semibold text-[#324158]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Assigned Admin */}
          {admin?.role === "masterAdmin" && (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="assignedAdmin"
                className="text-[14px] font-semibold text-gray-500"
              >
                Created by / Assigned admin
              </label>

              <Select
                value={form.assignedAdmin}
                onValueChange={(val) => handleChange("assignedAdmin", val)}
              >
                <SelectTrigger className="h-14 bg-[#F9FAFC] text-sm font-semibold text-[#324158]">
                  <SelectValue placeholder="Select admin" />
                </SelectTrigger>
                <SelectContent>
                  {adminsList.map((username) => (
                    <SelectItem key={username} value={username}>
                      {username}
                    </SelectItem>
                  ))}
                  {adminsList.length === 0 && (
                    <SelectItem value={admin?.username ?? ""} disabled>
                      {admin?.username ?? "Loading..."}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Savings */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="savings"
              className="text-[14px] font-semibold text-gray-500"
            >
              Savings
            </label>
            <InputGroup className="h-20! bg-[#F9FAFC]">
              <InputGroupAddon>
                <InputGroupText>{activeSymbol}</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="savings"
                name="savings"
                placeholder="0.00"
                value={
                  savingsFocused
                    ? form.savings
                    : form.savings
                      ? parseFloat(form.savings).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : ""
                }
                onChange={(e) =>
                  handleChange("savings", e.target.value.replace(/,/g, ""))
                }
                onFocus={() => setSavingsFocused(true)}
                onBlur={() => setSavingsFocused(false)}
                className="text-[25px]! font-medium"
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>
                  {form.currency === "custom"
                    ? form.customCurrency || "—"
                    : form.currency}
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </div>

          {/* Checking */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="checking"
              className="text-[14px] font-semibold text-gray-500"
            >
              Checking
            </label>
            <InputGroup className="h-20! bg-[#F9FAFC]">
              <InputGroupAddon>
                <InputGroupText>{activeSymbol}</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="checking"
                name="checking"
                placeholder="0.00"
                value={
                  checkingFocused
                    ? form.checking
                    : form.checking
                      ? parseFloat(form.checking).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : ""
                }
                onChange={(e) =>
                  handleChange("checking", e.target.value.replace(/,/g, ""))
                }
                onFocus={() => setCheckingFocused(true)}
                onBlur={() => setCheckingFocused(false)}
                className="text-[25px]! font-medium"
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>
                  {form.currency === "custom"
                    ? form.customCurrency || "—"
                    : form.currency}
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </div>

          {/* Toggles */}
          <div className="flex flex-row items-center justify-between mt-7">
            <div>
              <h2 className="text-[16px] font-semibold">Old history</h2>
              <p className="text-[13px] text-gray-500">Has old history?</p>
            </div>
            <Switch
              id="old-history"
              size="default"
              className="h-7! w-12!"
              checked={form.oldHistory}
              onCheckedChange={(val) => handleChange("oldHistory", val)}
            />
          </div>

          <div className="flex flex-row items-center justify-between">
            <div>
              <h2 className="text-[16px] font-semibold">Can send funds?</h2>
              <p className="text-[13px] text-gray-500">
                If it can send money and to be controlled at the backend
              </p>
            </div>
            <Switch
              id="can-send-funds"
              size="default"
              className="h-7! w-12!"
              checked={form.canSendFunds}
              onCheckedChange={(val) => handleChange("canSendFunds", val)}
            />
          </div>
        </div>

        {/* Transfer error — only relevant when canSendFunds is false */}
        {!form.canSendFunds && (
          <div className="flex flex-col gap-2">
            <label
              htmlFor="transferError"
              className="text-[14px] font-semibold text-gray-500"
            >
              Transfer error message
              <span className="ml-2 text-[11px] font-normal text-gray-400">
                (shown to user when they try to send)
              </span>
            </label>
            <Input
              id="transferError"
              name="transferError"
              type="text"
              placeholder="e.g. Your account is under review..."
              value={form.transferError}
              onChange={(e) => handleChange("transferError", e.target.value)}
              className="h-14 bg-[#F9FAFC] text-sm font-semibold text-[#324158]"
            />
          </div>
        )}

        {/* ── Transaction History ── */}
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[16px] font-semibold">Transaction History</h2>
              <p className="text-[13px] text-gray-500">Add past transactions</p>
            </div>
            <button
              type="button"
              onClick={addHistoryRow}
              className="flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg border border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
            >
              <FiPlus size={14} /> Add row
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <div className="hidden sm:grid grid-cols-[1fr_1fr_1fr_1fr_32px] gap-2 px-1">
              {["Date", "Name", "Type", "Amount", ""].map((h) => (
                <span
                  key={h}
                  className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide"
                >
                  {h}
                </span>
              ))}
            </div>

            {form.histories.map((row, idx) => (
              <div key={row.id}>
                {/* Desktop */}
                <div className="hidden sm:grid grid-cols-[1fr_1fr_1fr_1fr_32px] gap-2 items-center">
                  <Input
                    type="date"
                    value={row.date}
                    onChange={(e) =>
                      handleHistoryChange(row.id, "date", e.target.value)
                    }
                    className="h-10 bg-[#F9FAFC] text-xs font-medium text-[#324158]"
                  />
                  <Input
                    placeholder="Name"
                    value={row.name}
                    onChange={(e) =>
                      handleHistoryChange(row.id, "name", e.target.value)
                    }
                    className="h-10 bg-[#F9FAFC] text-xs font-medium text-[#324158]"
                  />
                  <Select
                    value={row.type}
                    onValueChange={(val) =>
                      handleHistoryChange(row.id, "type", val)
                    }
                  >
                    <SelectTrigger className="h-10 bg-[#F9FAFC] text-xs font-medium">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit">
                        <span className="font-medium text-green-600">
                          Credit
                        </span>
                      </SelectItem>
                      <SelectItem value="debit">
                        <span className="font-medium text-red-500">Debit</span>
                      </SelectItem>
                      <SelectItem value="pending">
                        <span className="font-medium text-yellow-500">
                          Pending
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="0.00"
                    type="number"
                    value={row.amount}
                    onChange={(e) =>
                      handleHistoryChange(row.id, "amount", e.target.value)
                    }
                    className="h-10 bg-[#F9FAFC] text-xs font-medium text-[#324158]"
                  />
                  <button
                    type="button"
                    onClick={() => removeHistoryRow(row.id)}
                    disabled={form.histories.length === 1}
                    className="flex items-center justify-center w-8 h-8 text-gray-400 transition-colors rounded-md hover:text-red-400 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>

                {/* Mobile */}
                <div className="sm:hidden bg-[#F9FAFC] rounded-2xl p-3 flex flex-col gap-2 border border-gray-100">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                      #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeHistoryRow(row.id)}
                      disabled={form.histories.length === 1}
                      className="flex items-center justify-center text-gray-400 transition-colors rounded-md w-7 h-7 hover:text-red-400 hover:bg-red-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                        Date
                      </span>
                      <Input
                        type="date"
                        value={row.date}
                        onChange={(e) =>
                          handleHistoryChange(row.id, "date", e.target.value)
                        }
                        className="h-10 bg-white text-xs font-medium text-[#324158] border-gray-200"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                        Name
                      </span>
                      <Input
                        placeholder="Name"
                        value={row.name}
                        onChange={(e) =>
                          handleHistoryChange(row.id, "name", e.target.value)
                        }
                        className="h-10 bg-white text-xs font-medium text-[#324158] border-gray-200"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                        Type
                      </span>
                      <Select
                        value={row.type}
                        onValueChange={(val) =>
                          handleHistoryChange(row.id, "type", val)
                        }
                      >
                        <SelectTrigger className="h-10 text-xs font-medium bg-white border-gray-200">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="credit">
                            <span className="font-medium text-green-600">
                              Credit
                            </span>
                          </SelectItem>
                          <SelectItem value="debit">
                            <span className="font-medium text-red-500">
                              Debit
                            </span>
                          </SelectItem>
                          <SelectItem value="pending">
                            <span className="font-medium text-yellow-500">
                              Pending
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                        Amount
                      </span>
                      <Input
                        placeholder="0.00"
                        type="number"
                        value={row.amount}
                        onChange={(e) =>
                          handleHistoryChange(row.id, "amount", e.target.value)
                        }
                        className="h-10 bg-white text-xs font-medium text-[#324158] border-gray-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Investments ── */}
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[16px] font-semibold">Investments</h2>
              <p className="text-[13px] text-gray-500">
                Add investment positions
              </p>
            </div>
            <button
              type="button"
              onClick={addInvestmentRow}
              className="flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg border border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
            >
              <FiPlus size={14} /> Add row
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-[1fr_1fr_1fr_32px] gap-2 px-1">
              {["Name", "Shares", "Amount", ""].map((h) => (
                <span
                  key={h}
                  className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide"
                >
                  {h}
                </span>
              ))}
            </div>

            {form.investments.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-[1fr_1fr_1fr_32px] gap-2 items-center"
              >
                <Input
                  placeholder="e.g. AAPL"
                  value={row.name}
                  onChange={(e) =>
                    handleInvestmentChange(row.id, "name", e.target.value)
                  }
                  className="h-10 bg-[#F9FAFC] text-xs font-medium text-[#324158]"
                />
                <Input
                  placeholder="0"
                  type="number"
                  value={row.numberOfShares}
                  onChange={(e) =>
                    handleInvestmentChange(
                      row.id,
                      "numberOfShares",
                      e.target.value,
                    )
                  }
                  className="h-10 bg-[#F9FAFC] text-xs font-medium text-[#324158]"
                />
                <Input
                  placeholder="0.00"
                  type="number"
                  value={row.amount}
                  onChange={(e) =>
                    handleInvestmentChange(row.id, "amount", e.target.value)
                  }
                  className="h-10 bg-[#F9FAFC] text-xs font-medium text-[#324158]"
                />
                <button
                  type="button"
                  onClick={() => removeInvestmentRow(row.id)}
                  disabled={form.investments.length === 1}
                  className="flex items-center justify-center w-8 h-8 text-gray-400 transition-colors rounded-md hover:text-red-400 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            ))}

            {form.investments.some((r) => r.amount) && (
              <div className="flex items-center justify-between px-2 py-2.5 mt-1 bg-[#F9FAFC] rounded-xl border border-gray-100">
                <span className="text-[13px] font-semibold text-gray-500">
                  Total investment value
                </span>
                <span className="text-[15px] font-bold text-[#324158]">
                  {activeSymbol}
                  {investmentTotal.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Feedback ── */}
        {successMsg && (
          <p className="px-4 py-2 text-sm font-medium text-green-600 rounded-lg bg-green-50">
            {successMsg}
          </p>
        )}
        {errorMsg && (
          <p className="px-4 py-2 text-sm font-medium text-red-500 rounded-lg bg-red-50">
            {errorMsg}
          </p>
        )}

        {/* ── Submit ── */}
        <button
          type="submit"
          disabled={submitting}
          className="flex flex-row items-center justify-center w-full gap-2 py-3 mt-3 text-white transition-opacity rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ backgroundColor: COLORS.primaryBlack }}
        >
          {isEdit ? (
            <FiEdit3 size={18} color="white" />
          ) : (
            <BsSend size={18} color="white" />
          )}
          {submitting
            ? isEdit
              ? "Saving..."
              : "Creating..."
            : isEdit
              ? "Save changes"
              : "Create account"}
        </button>
      </form>

      {createdAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm p-6 bg-white shadow-2xl rounded-2xl">
            <h2 className="text-lg font-semibold text-center">
              Account Created 🎉
            </h2>

            <div className="flex flex-col items-center gap-4 mt-5">
              <Avatar className="w-20 h-20">
                <AvatarImage src={createdAccount.avatar} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>

              <div className="w-full text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Routing Number</span>
                  <span className="font-semibold">
                    {createdAccount.routingNumber}
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Password</span>
                  <span className="font-semibold">
                    {createdAccount.password}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCreatedAccount(null)}
              className="w-full py-2 mt-6 text-white rounded-lg"
              style={{ backgroundColor: COLORS.primaryBlack }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
