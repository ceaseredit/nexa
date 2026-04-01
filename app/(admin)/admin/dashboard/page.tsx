"use client";
export const dynamic = "force-dynamic";
import { COLORS } from "@/constants/Theme";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { FiUsers, FiUserCheck, FiUserX, FiTrendingUp } from "react-icons/fi";
import { BsArrowUpRight, BsSend } from "react-icons/bs";
import { IoWalletOutline } from "react-icons/io5";
import { IoTrendingUpSharp } from "react-icons/io5";
import { FaArrowsRotate } from "react-icons/fa6";
import { COLORS as C } from "@/constants/Theme";
import { supabase } from "@/lib/supabase";

const fmt = (n: number) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const fmtDate = (dateStr: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

function Page() {
  const { admin } = useSelector((state: RootState) => state.admin);

  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [signUpOpen, setSignUpOpen] = useState<boolean>(false);
  const [configLoading, setConfigLoading] = useState(true);
  const [configToggling, setConfigToggling] = useState(false);

  // Lazy‑initialize the Supabase client only on the client side

  // Fetch config only after supabase is available
  useEffect(() => {
    if (!supabase) return;

    const fetchConfig = async () => {
      const { data } = await supabase
        .from("config")
        .select("openAdminSignUp")
        .single();
      setSignUpOpen((data as any)?.openAdminSignUp ?? false);
      setConfigLoading(false);
    };
    fetchConfig();
  }, [supabase]);

  const handleSignUpToggle = async () => {
    if (!supabase) return;

    setConfigToggling(true);
    const { data: current } = await supabase
      .from("config")
      .select("openAdminSignUp")
      .single();
    const newVal = !(current as any)?.openAdminSignUp;

    // Cast supabase to any to bypass strict type checking
    const { error } = await (supabase as any)
      .from("config")
      .update({ openAdminSignUp: newVal })
      .eq("id", 1);

    if (!error) setSignUpOpen(newVal);
    setConfigToggling(false);
  };

  useEffect(() => {
    if (!admin || !supabase) return;

    const fetchData = async () => {
      setLoading(true);
      let query = supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });
      if (admin.role === "subAdmin") {
        query = query.eq("admin", admin.username);
      }
      const { data } = await query;
      setAccounts(data || []);
      setLoading(false);
    };
    fetchData();
  }, [admin, supabase]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // ── Derived stats ──
  const total = accounts.length;
  const active = accounts.filter((a) => !a.blocked).length;
  const blocked = accounts.filter((a) => a.blocked).length;
  const canSend = accounts.filter((a) => a.canSendFunds).length;
  const totalSavings = accounts.reduce(
    (s, a) => s + (a.savingsBalance ?? 0),
    0,
  );
  const totalChecking = accounts.reduce(
    (s, a) => s + (a.checkingBalance ?? 0),
    0,
  );
  const recentAccounts = accounts.slice(0, 5);

  const statCards = [
    {
      label: "Total Accounts",
      value: total,
      icon: <FiUsers size={20} color="white" />,
      gradient: "from-[#1D4CD1] via-[#213EA8] to-[#2E3187]",
      isMoney: false,
    },
    {
      label: "Active",
      value: active,
      icon: <FiUserCheck size={20} color="white" />,
      gradient: "from-[#00B580] via-[#009689] to-[#007963]",
      isMoney: false,
    },
    {
      label: "Blocked",
      value: blocked,
      icon: <FiUserX size={20} color="white" />,
      gradient: "from-[#E53E3E] via-[#C53030] to-[#9B2C2C]",
      isMoney: false,
    },
    {
      label: "Can Send Funds",
      value: canSend,
      icon: <BsSend size={18} color="white" />,
      gradient: "from-[#801CF6] via-[#7E00D6] to-[#5815A7]",
      isMoney: false,
    },
  ];

  return (
    <div className="bg-[#F9FAFC] p-4 lg:px-14 md:px-10 md:pt-10 lg:pt-10 min-h-full">
      <h1 className="text-[20px] lg:text-[25px] font-semibold">
        {getGreeting()}, {admin?.username || "Admin"} 👋
      </h1>
      <p className="text-[14px] lg:text-[15px] text-gray-500">
        Here's your admin overview
      </p>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 gap-4 mt-8 lg:grid-cols-3">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="flex flex-col gap-4 p-5 bg-white shadow-xl rounded-3xl"
          >
            <div
              className={`size-10 rounded-lg flex items-center justify-center bg-linear-to-br ${card.gradient}`}
            >
              {card.icon}
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wide">
                {card.label}
              </p>
              {loading ? (
                <div className="w-20 h-6 bg-gray-100 rounded animate-pulse" />
              ) : (
                <h2
                  className="text-xl font-semibold"
                  style={{ color: COLORS.primaryBlack }}
                >
                  {card.isMoney ? `$${fmt(card.value)}` : card.value}
                </h2>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Quick actions ── */}
      <div className="mt-8">
        <h2
          className="text-[16px] font-semibold mb-4"
          style={{ color: COLORS.primaryBlack }}
        >
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            {
              label: "Create Account",
              href: "/admin/dashboard/create",
              icon: <FiUsers size={18} />,
              color: COLORS.primaryBlack,
            },
            {
              label: "View Accounts",
              href: "/admin/dashboard/accounts",
              icon: <FiUserCheck size={18} />,
              color: "#1D4CD1",
            },
          ].map(({ label, href, icon, color }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-3 p-4 transition-shadow bg-white shadow-md rounded-2xl hover:shadow-lg"
            >
              <div
                className="flex items-center justify-center text-white w-9 h-9 rounded-xl shrink-0"
                style={{ backgroundColor: color }}
              >
                {icon}
              </div>
              <span className="text-[13px] font-semibold text-[#324158]">
                {label}
              </span>
            </Link>
          ))}
        </div>
        {admin?.role === "masterAdmin" && (
          <div className="mt-8">
            <h2
              className="text-[16px] font-semibold mb-4"
              style={{ color: COLORS.primaryBlack }}
            >
              System Settings
            </h2>
            <div className="p-5 bg-white shadow-xl rounded-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-colors ${
                      signUpOpen ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <FiUsers size={18} color="white" />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#324158]">
                      Admin Sign-Up
                    </p>
                    <p className="text-[12px] text-gray-400">
                      {signUpOpen
                        ? "New admins can currently register"
                        : "Registration is currently closed"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {configLoading ? (
                    <div className="w-12 h-6 bg-gray-100 rounded-full animate-pulse" />
                  ) : (
                    <>
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                          signUpOpen
                            ? "bg-green-50 text-green-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {signUpOpen ? "Open" : "Closed"}
                      </span>
                      <button
                        onClick={handleSignUpToggle}
                        disabled={configToggling}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                          signUpOpen ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                            signUpOpen ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Recent accounts ── */}
      <div className="p-5 mt-8 bg-white shadow-xl rounded-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2
              className="text-[16px] font-semibold"
              style={{ color: COLORS.primaryBlack }}
            >
              Recent Accounts
            </h2>
            <p className="text-[13px] text-gray-400">Latest accounts created</p>
          </div>
          <Link
            href="/admin/dashboard/accounts"
            className="px-4 py-1.5 rounded-lg text-[13px] font-semibold bg-[#EEF6FF] text-[#165DFC]"
          >
            View all
          </Link>
        </div>

        <hr />

        {loading ? (
          <div className="flex flex-col gap-4 mt-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 rounded-full w-9 h-9" />
                  <div className="flex flex-col gap-1.5">
                    <div className="h-3.5 w-28 bg-gray-100 rounded" />
                    <div className="w-20 h-3 bg-gray-100 rounded" />
                  </div>
                </div>
                <div className="h-3.5 w-16 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : recentAccounts.length === 0 ? (
          <p className="text-gray-400 text-[14px] mt-5">No accounts yet.</p>
        ) : (
          <div className="flex flex-col gap-5 mt-5">
            {recentAccounts.map((acc) => (
              <Link
                key={acc.id}
                href={`/admin/dashboard/accounts/${acc.id}`}
                className="flex items-center justify-between transition-opacity hover:opacity-70"
              >
                <div className="flex items-center gap-3">
                  {acc.image ? (
                    <img
                      src={acc.image}
                      alt={acc.name}
                      className="object-cover rounded-full w-9 h-9 shrink-0"
                    />
                  ) : (
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-bold shrink-0"
                      style={{ backgroundColor: COLORS.primaryBlack }}
                    >
                      {acc.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                  )}
                  <div>
                    <p className="text-[14px] font-semibold text-[#324158]">
                      {acc.name}
                    </p>
                    <p className="text-[12px] text-gray-400 font-mono">
                      {acc.routingNumber}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-semibold text-[#324158]">
                    {acc.currencySymbol ?? "$"}
                    {fmt(acc.checkingBalance ?? 0)}
                  </p>
                  <div className="flex items-center gap-1 justify-end mt-0.5">
                    {acc.blocked ? (
                      <span className="text-[10px] font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                        Blocked
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
