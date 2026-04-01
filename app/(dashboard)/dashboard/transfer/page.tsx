"use client";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { COLORS } from "@/constants/Theme";
import { RootState } from "@/store";
import { checkAuth } from "@/store/slices/userAuthSlice";
import React, { useState } from "react";
import { BsSend } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";

import { supabase } from "@/lib/supabase";

const fmt = (n: number) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function Page() {
  const dispatch = useDispatch<any>();
  const user = useSelector((state: RootState) => state.user?.user ?? null);
  const symbol = user?.customCurrencySymbol || user?.currencySymbol || "$";

  const checkingBalance = user?.checkingBalance ?? 0;
  const savingsBalance = user?.savingsBalance ?? 0;

  const [form, setForm] = useState({
    fromAccount: "",
    recipientName: "",
    routingNumber: "",
    accountNumber: "",
    bankName: "",
    amount: "",
    note: "",
  });
  const [amountFocused, setAmountFocused] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [transferError, setTransferError] = useState("");

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setTransferError("");
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};

    if (!form.fromAccount) e.fromAccount = "Please select an account.";

    if (!form.recipientName.trim())
      e.recipientName = "Recipient name is required.";

    if (!form.routingNumber.trim())
      e.routingNumber = "Routing number / IBAN is required.";
    else if (!/^\d+$/.test(form.routingNumber.trim()))
      e.routingNumber = "Must contain digits only.";

    // if (!form.accountNumber.trim())
    //   e.accountNumber = "Account number is required.";
    // else if (!/^\d+$/.test(form.accountNumber.trim()))
    //   e.accountNumber = "Must contain digits only.";

    if (!form.bankName.trim()) e.bankName = "Bank name is required.";

    const amount = parseFloat(form.amount);
    if (!form.amount || isNaN(amount) || amount <= 0)
      e.amount = "Enter a valid amount greater than 0.";
    else {
      const balance =
        form.fromAccount === "checking" ? checkingBalance : savingsBalance;
      if (amount > balance)
        e.amount = `Insufficient balance. Available: ${symbol}${fmt(balance)}`;
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransferError("");
    setSuccessMsg("");

    if (!validate()) return;

    setSubmitting(true);

    try {
      // ── 1. Fetch fresh user data from Supabase ──
      const { data: freshUser, error: fetchError } = await supabase
        .from("users")
        .select("canSendFunds, transferError, history")
        .eq("id", user.id)
        .single();

      if (fetchError) throw fetchError;

      // ── 2. Check canSendFunds ──
      if (!freshUser.canSendFunds) {
        setTransferError(
          freshUser.transferError ||
            "Transfers are currently disabled on this account. Please contact support.",
        );
        setSubmitting(false);
        return;
      }

      // ── 3. Build new history entry ──
      const today = new Date().toISOString().split("T")[0];
      const newEntry = {
        date: today,
        name: form.recipientName.trim(),
        type: "pending",
        amount: parseFloat(form.amount),
        ...(form.note.trim() ? { note: form.note.trim() } : {}),
      };

      // ── 4. Append to existing history ──
      const existingHistory = Array.isArray(freshUser.history)
        ? freshUser.history
        : [];
      const updatedHistory = [...existingHistory, newEntry];

      const { error: updateError } = await supabase
        .from("users")
        .update({ history: updatedHistory })
        .eq("id", user.id);

      if (updateError) throw updateError;

      // ── 5. Refresh Redux state so UI reflects new history ──
      await dispatch(checkAuth());

      setSuccessMsg(
        "Transfer submitted successfully! It is currently pending.",
      );
      setForm({
        fromAccount: "",
        recipientName: "",
        routingNumber: "",
        accountNumber: "",
        bankName: "",
        amount: "",
        note: "",
      });
    } catch (err: any) {
      setTransferError(
        err?.message ?? "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F9FAFC] p-4 lg:px-14 md:px-10 md:pt-10 lg:pt-10 h-full">
      <h1 className="text-[20px] lg:text-[25px] font-semibold">Send Money</h1>
      <p className="text-[14px] lg:text-[15px] text-gray-500">
        Transfer funds instantly to anyone
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-w-2xl gap-5 p-5 mt-8 bg-white shadow-xl rounded-3xl"
      >
        {/* FROM ACCOUNT */}
        <div className="flex flex-col gap-2">
          <p className="text-[14px] font-semibold text-gray-500">
            FROM ACCOUNT <span className="text-red-400">*</span>
          </p>
          <NativeSelect
            value={form.fromAccount}
            onChange={(e: any) => handleChange("fromAccount", e.target.value)}
            className={`w-full ${errors.fromAccount ? "border-red-400" : ""}`}
          >
            <NativeSelectOption value="">Select account</NativeSelectOption>
            <NativeSelectOption value="checking">
              Checking — {symbol}
              {fmt(checkingBalance)}
            </NativeSelectOption>
            <NativeSelectOption value="savings">
              Savings — {symbol}
              {fmt(savingsBalance)}
            </NativeSelectOption>
          </NativeSelect>
          {errors.fromAccount && (
            <p className="text-[12px] text-red-500">{errors.fromAccount}</p>
          )}
        </div>

        {/* RECIPIENT NAME */}
        <div className="flex flex-col gap-2">
          <p className="text-[14px] font-semibold text-gray-500">
            RECIPIENT NAME <span className="text-red-400">*</span>
          </p>
          <Input
            value={form.recipientName}
            onChange={(e) => handleChange("recipientName", e.target.value)}
            className={`h-14 bg-[#F9FAFC] text-sm font-semibold text-[#324158] ${errors.recipientName ? "border-red-400" : ""}`}
          />
          {errors.recipientName && (
            <p className="text-[12px] text-red-500">{errors.recipientName}</p>
          )}
        </div>

        {/* ROUTING NUMBER */}
        <div className="flex flex-col gap-2">
          <p className="text-[14px] font-semibold text-gray-500">
            ROUTING NUMBER / IBAN
          </p>
          <Input
            value={form.routingNumber}
            onChange={(e) =>
              handleChange("routingNumber", e.target.value.replace(/\s/g, ""))
            }
            className={`h-14 bg-[#F9FAFC] text-sm font-semibold text-[#324158] ${errors.routingNumber ? "border-red-400" : ""}`}
          />
          {errors.routingNumber && (
            <p className="text-[12px] text-red-500">{errors.routingNumber}</p>
          )}
        </div>

        {/* ACCOUNT NUMBER */}
        <div className="flex flex-col gap-2">
          <p className="text-[14px] font-semibold text-gray-500">
            ACCOUNT NUMBER
          </p>
          <Input
            value={form.accountNumber}
            onChange={(e) =>
              handleChange("accountNumber", e.target.value.replace(/\s/g, ""))
            }
            className={`h-14 bg-[#F9FAFC] text-sm font-semibold text-[#324158] ${errors.accountNumber ? "border-red-400" : ""}`}
          />
          {errors.accountNumber && (
            <p className="text-[12px] text-red-500">{errors.accountNumber}</p>
          )}
        </div>

        {/* BANK NAME */}
        <div className="flex flex-col gap-2">
          <p className="text-[14px] font-semibold text-gray-500">
            BANK NAME <span className="text-red-400">*</span>
          </p>
          <Input
            value={form.bankName}
            onChange={(e) => handleChange("bankName", e.target.value)}
            className={`h-14 bg-[#F9FAFC] text-sm font-semibold text-[#324158] ${errors.bankName ? "border-red-400" : ""}`}
          />
          {errors.bankName && (
            <p className="text-[12px] text-red-500">{errors.bankName}</p>
          )}
        </div>

        {/* AMOUNT */}
        <div className="flex flex-col gap-2">
          <p className="text-[14px] font-semibold text-gray-500">
            AMOUNT <span className="text-red-400">*</span>
          </p>
          <InputGroup
            className={`h-20 bg-[#F9FAFC] ${errors.amount ? "border border-red-400 rounded-lg" : ""}`}
          >
            <InputGroupAddon>
              <InputGroupText>{symbol}</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              placeholder="0.00"
              value={
                amountFocused
                  ? form.amount
                  : form.amount
                    ? parseFloat(form.amount).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : ""
              }
              onChange={(e) =>
                handleChange("amount", e.target.value.replace(/,/g, ""))
              }
              onFocus={() => setAmountFocused(true)}
              onBlur={() => setAmountFocused(false)}
              className="text-[25px]! font-medium"
            />
          </InputGroup>
          {form.fromAccount && (
            <p className="text-[12px] text-gray-400">
              Available: {symbol}
              {fmt(
                form.fromAccount === "checking"
                  ? checkingBalance
                  : savingsBalance,
              )}
            </p>
          )}
          {errors.amount && (
            <p className="text-[12px] text-red-500">{errors.amount}</p>
          )}
        </div>

        {/* NOTE */}
        <div className="flex flex-col gap-2">
          <p className="text-[14px] font-semibold text-gray-500">
            NOTE <span className="text-gray-300 text-[12px]">(optional)</span>
          </p>
          <Textarea
            placeholder="Type your purpose here."
            value={form.note}
            onChange={(e) => handleChange("note", e.target.value)}
            className="h-20 bg-[#F9FAFC] text-sm font-semibold text-[#324158]"
          />
        </div>

        {/* Transfer error — from DB transferError column */}
        {transferError && (
          <div className="flex flex-col gap-1 px-4 py-3 border border-red-200 rounded-xl bg-red-50">
            <p className="text-sm font-semibold text-red-600">
              Transfer Failed
            </p>
            <p className="text-[13px] text-red-500">{transferError}</p>
          </div>
        )}

        {/* Success */}
        {successMsg && (
          <div className="flex flex-col gap-1 px-4 py-3 border border-green-200 rounded-xl bg-green-50">
            <p className="text-sm font-semibold text-green-600">
              Transfer Submitted
            </p>
            <p className="text-[13px] text-green-500">{successMsg}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="flex flex-row items-center justify-center w-full gap-2 py-3 mt-3 text-white transition-opacity rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ backgroundColor: COLORS.primaryBlack }}
        >
          <BsSend size={18} color="white" />
          {submitting ? "Sending..." : "Send Money"}
        </button>
      </form>
    </div>
  );
}

export default Page;
