"use client";
import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { PiMoneyWavyThin } from "react-icons/pi";
import { COLORS } from "@/constants/Theme";
import { BsSend } from "react-icons/bs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@supabase/supabase-js";
import { FiPlus, FiTrash2, FiCamera } from "react-icons/fi";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import AccountForm from "@/components/dashboardComponents/AccountForm";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

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
  avatarFile: File | null;
  avatarPreview: string;
  histories: HistoryRow[];
  investments: InvestmentRow[];
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

function Page() {
  const { admin } = useSelector((state: RootState) => state.admin);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [savingsFocused, setSavingsFocused] = useState(false);
  const [checkingFocused, setCheckingFocused] = useState(false);

  const [form, setForm] = useState<FormState>({
    accountName: "",
    routingNumber: "",
    otp: "",
    password: "",
    currency: "USD",
    currencySymbol: "$",
    customCurrency: "",
    customCurrencySymbol: "",
    errorMsg: "",
    savings: "",
    checking: "",
    oldHistory: true,
    canSendFunds: false,
    avatarFile: null,
    avatarPreview: "",
    histories: [makeHistoryRow()],
    investments: [makeInvestmentRow()],
  });

  // Add this map above the component
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
  // --- Generic field change ---
  const handleChange = (field: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // --- Avatar ---
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, avatarFile: file, avatarPreview: preview }));
  };

  // --- History rows ---
  const handleHistoryChange = (
    id: string,
    field: keyof HistoryRow,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      histories: prev.histories.map((row) =>
        row.id === id ? { ...row, [field]: value } : row,
      ),
    }));
  };

  const addHistoryRow = () => {
    setForm((prev) => ({
      ...prev,
      histories: [...prev.histories, makeHistoryRow()],
    }));
  };

  const removeHistoryRow = (id: string) => {
    setForm((prev) => ({
      ...prev,
      histories: prev.histories.filter((row) => row.id !== id),
    }));
  };

  // --- Investment rows ---
  const handleInvestmentChange = (
    id: string,
    field: keyof InvestmentRow,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      investments: prev.investments.map((row) =>
        row.id === id ? { ...row, [field]: value } : row,
      ),
    }));
  };

  const addInvestmentRow = () => {
    setForm((prev) => ({
      ...prev,
      investments: [...prev.investments, makeInvestmentRow()],
    }));
  };

  const removeInvestmentRow = (id: string) => {
    setForm((prev) => ({
      ...prev,
      investments: prev.investments.filter((row) => row.id !== id),
    }));
  };

  const investmentTotal = form.investments.reduce(
    (sum, row) => sum + (parseFloat(row.amount) || 0),
    0,
  );

  // --- Submit ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg("");
    setErrorMsg("");

    // 2. Shape histories — strip internal id, skip empty rows
    const validHistories = form.histories
      .filter((h) => h.name || h.date || h.type || h.amount)
      .map(({ id, ...rest }) => ({
        date: rest.date,
        name: rest.name,
        type: rest.type,
        amount: parseFloat(rest.amount) || 0,
      }));

    // 3. Shape investments — strip internal id, skip empty rows
    const validInvestments = form.investments
      .filter((i) => i.name || i.numberOfShares || i.amount)
      .map(({ id, ...rest }) => ({
        name: rest.name,
        numberOfShares: parseInt(rest.numberOfShares) || 0,
        amount: parseFloat(rest.amount) || 0,
      }));
    
    
    try {
      // 1. Upload avatar to Supabase Storage
      let avatarUrl = "";
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

      // 2. Insert into users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .insert({
          admin: admin?.username,
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
          history: validHistories, // jsonb column
          investments: validInvestments, // jsonb column
        })
        .select()
        .single();

      if (userError) throw userError;

      const userId = userData.id;

      setSuccessMsg("Account created successfully!");



    } catch (err: any) {
      setErrorMsg(err?.message ?? "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };;


  const activeSymbol =
    form.currency === "custom"
      ? form.customCurrencySymbol || "?"
      : (CURRENCY_SYMBOLS[form.currency] ?? form.currency);
  return (
    <div className="bg-[#F9FAFC] p-4 lg:px-14 md:px-10 md:pt-10 lg:pt-10 h-full">

      <AccountForm mode="create" />


    </div>
  );
}

export default Page;
