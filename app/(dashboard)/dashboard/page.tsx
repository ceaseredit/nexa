"use client";
import { COLORS } from "@/constants/Theme";
import { RootState } from "@/store";
import Link from "next/link";
import React from "react";
import { AiOutlineBank } from "react-icons/ai";
import { BsArrowUpRight, BsSend } from "react-icons/bs";
import { FaArrowsRotate } from "react-icons/fa6";
import { FiMoreHorizontal } from "react-icons/fi";
import { IoTrendingUpSharp, IoWalletOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useHistory } from "@/hooks/useHistory";
import { AlertTriangleIcon } from "lucide-react";
import { useBalanceVisibility } from "@/context/BalanceVisibilityContext";
// Fallback static history shown when user has no history

function Page() {
  const { visible } = useBalanceVisibility();
  const mask = (n: number) => (visible ? fmt(n) : "••••••");
  const user = useSelector((state: RootState) => state.user?.user ?? null);

  const userHistory = Array.isArray(user?.history) ? user.history : [];
  const { history, loading } = useHistory(user?.id ?? "");
  const symbol = user?.customCurrencySymbol || user?.currencySymbol || "$";
  const currencyCode = user?.currency || "USD";

  // ── Balances ──
  const checkingBalance = user?.checkingBalance ?? 0;
  const savingsBalance = user?.savingsBalance ?? 0;

  // ── Investments total ──
  const investmentsTotal: number = Array.isArray(user?.investments)
    ? user.investments.reduce(
        (sum: number, inv: any) => sum + (parseFloat(inv.amount) || 0),
        0,
      )
    : 0;

  // ── Portfolio total ──
  const portfolioTotal = checkingBalance + savingsBalance + investmentsTotal;

  const fmt = (n: number) =>
    n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const fmtDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr; // already formatted, return as-is
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const displayHistory = history.slice(0, 5);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };
  return (
    <div className="bg-[#F9FAFC] p-4 lg:px-14 md:px-10 md:pt-10 lg:pt-10 h-full">
      <h1 className="text-[20px] lg:text-[25px] font-semibold">
        {getGreeting()}, {user?.name} 👋
      </h1>
      <p className="text-[14px] lg:text-[15px] text-gray-500">
        Here's your financial snapshot
      </p>

      {user?.topErrorMsg && (
        <div className="mt-8">
          <div
            role="alert"
            className="border-2 bg-red-100 p-4 text-red-900 shadow-[4px_4px_0_0]"
          >
            <div className="flex items-start gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="mt-0.5 size-4"
              >
                <path
                  fillRule="evenodd"
                  d="M6.701 2.25c.577-1 2.02-1 2.598 0l5.196 9a1.5 1.5 0 0 1-1.299 2.25H2.804a1.5 1.5 0 0 1-1.3-2.25l5.197-9ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 1 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                  clipRule="evenodd"
                ></path>
              </svg>

              <strong className="flex-1 block font-semibold leading-tight">
                {user?.topErrorMsg}
              </strong>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col mt-8 lg:flex-row lg:gap-10">
        {/* ── Portfolio card ── */}
        <div className="shadow-md p-5 border rounded-3xl bg-linear-to-br from-[#1D4CD1] via-[#213EA8] to-[#2E3187] lg:flex-1">
          <div className="flex flex-row justify-between w-full">
            <div className="flex flex-col gap-2">
              <p className="text-[12px] font-semibold text-white/40">
                TOTAL PORTFOLIO
              </p>
              <h2 className="text-4xl font-semibold text-white lg:text-5xl">
                {symbol}

                {mask(portfolioTotal)}
              </h2>
              <div className="flex flex-row items-center gap-2">
                <BsArrowUpRight size={15} color="#5EEAB4" />
                <p className="text-[#5EEAB4] text-[12px] lg:text-[14px] font-semibold">
                  +5.2% this month
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/30">
              <AiOutlineBank size={20} color="white" />
            </div>
          </div>

          <div className="mt-10 lg:mt-14">
            <div className="flex flex-row items-center justify-between w-full gap-8">
              <div className="flex items-center justify-center w-full h-16 gap-1 rounded-lg bg-white/9">
                <Link
                  href="/dashboard/transfer"
                  className="h-10 w-12 bg-[#165DFC] rounded-lg flex items-center justify-center"
                >
                  <BsSend size={18} color="white" />
                </Link>
              </div>
              <div className="flex flex-col items-center justify-center w-full gap-1 rounded-lg h-14 bg-white/9">
                <Link
                  href="/dashboard/history"
                  className="h-10 w-12 bg-[#00BD7D] rounded-lg flex items-center justify-center"
                >
                  <FaArrowsRotate size={18} color="white" />
                </Link>
              </div>
              <div className="flex flex-col items-center justify-center w-full gap-1 rounded-lg h-14 bg-white/9">
                <Link
                  href="/dashboard/investments"
                  className="h-10 w-12 bg-[#8023FE] rounded-lg flex items-center justify-center"
                >
                  <IoTrendingUpSharp size={18} color="white" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Balance cards ── */}
        <div className="flex flex-col lg:flex-row gap-7 mt-10 lg:mt-0 lg:flex-1 lg:min-w-[60%]">
          {/* Checking */}
          <div className="flex flex-col w-full gap-5 p-5 bg-white shadow-xl rounded-3xl">
            <div className="size-10 rounded-lg flex items-center justify-center bg-linear-to-br from-[#1D4CD1] via-[#213EA8] to-[#2E3187]">
              <IoWalletOutline size={20} color="white" />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[12px] font-semibold text-gray-400">
                CHECKING
              </p>
              <h2
                className="text-xl font-semibold"
                style={{ color: COLORS.primaryBlack }}
              >
                {symbol}

                {mask(checkingBalance)}
              </h2>
              <div className="flex flex-row items-center gap-2">
                <BsArrowUpRight size={10} color="#00BD7D" />
                <p className="text-[#00BD7D] text-[12px] font-semibold">
                  +5.2%
                </p>
              </div>
            </div>
          </div>

          {/* Savings */}
          <div className="flex flex-col w-full gap-5 p-5 bg-white shadow-xl rounded-3xl">
            <div className="size-10 rounded-lg flex items-center justify-center bg-linear-to-br from-[#801CF6] via-[#7E00D6] to-[#5815A7]">
              <IoWalletOutline size={20} color="white" />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[12px] font-semibold text-gray-400">SAVINGS</p>
              <h2
                className="text-xl font-semibold"
                style={{ color: COLORS.primaryBlack }}
              >
                {symbol}
                {mask(savingsBalance)}
              </h2>
              <div className="flex flex-row items-center gap-2">
                <BsArrowUpRight size={10} color="#00BD7D" />
                <p className="text-[#00BD7D] text-[12px] font-semibold">
                  +4.8%
                </p>
              </div>
            </div>
          </div>

          {/* Investments */}
          <div className="flex flex-col w-full gap-5 p-5 bg-white shadow-xl rounded-3xl">
            <div className="size-10 rounded-lg flex items-center justify-center bg-linear-to-br from-[#00B580] via-[#009689] to-[#007963]">
              <IoWalletOutline size={20} color="white" />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[12px] font-semibold text-gray-400">
                INVESTMENTS
              </p>
              <h2
                className="text-xl font-semibold"
                style={{ color: COLORS.primaryBlack }}
              >
                {symbol}
                {mask(investmentsTotal)}
              </h2>
              <div className="flex flex-row items-center gap-2">
                <BsArrowUpRight size={10} color="#00BD7D" />
                <p className="text-[#00BD7D] text-[12px] font-semibold">
                  +4.8%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Transactions ── */}
      <div className="flex flex-col p-5 bg-white shadow-xl rounded-3xl mt-7">
        <div className="flex flex-row items-center justify-between">
          <div>
            <h2
              className="text-lg font-semibold"
              style={{ color: COLORS.primaryBlack }}
            >
              Recent Transactions
            </h2>
            <p className="text-gray-400 text-[13px]">Your latest activity</p>
          </div>
          <div className="px-5 rounded-lg py-2 font-semibold bg-[#EEF6FF] text-[#165DFC] text-[15px]">
            <Link href="/dashboard/history">View all</Link>
          </div>
        </div>

        <hr className="mt-3" />

        <div className="mt-5">
          <div className="flex flex-col gap-6">
            {displayHistory.map((item, idx) => {
              const isDebit = item.type === "debit" || item.type === "Debit";
              const isPending =
                item.type === "pending" || item.type === "Pending";
              const amount =
                parseFloat(String(item.amount).replace(/,/g, "")) || 0;
              const color = isDebit
                ? COLORS.primaryBlack
                : isPending
                  ? "#F59E0B"
                  : "#009866";

              return (
                <div
                  key={idx}
                  className="flex flex-row items-center justify-between"
                >
                  <div>
                    <h2
                      className="font-semibold"
                      style={{ color: COLORS.primaryBlack }}
                    >
                      {item.name}
                    </h2>
                    <p className="text-gray-400 text-[13px]">
                      {fmtDate(item.date)}
                    </p>
                  </div>
                  <div className="text-end">
                    <h2 className="font-semibold" style={{ color }}>
                      {isDebit ? "−" : isPending ? "·" : "+"} {symbol}
                      {visible ? fmt(amount) : "••••••"}
                    </h2>
                    <p
                      className="text-[13px]"
                      style={{ color: isPending ? "#F59E0B" : "#9CA3AF" }}
                    >
                      {isPending ? "Pending" : (item.status ?? "Completed")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
