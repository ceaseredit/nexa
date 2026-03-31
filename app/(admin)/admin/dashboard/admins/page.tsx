"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  LuSearch,
  LuUsers,
  LuUser,
  LuWallet,
  LuShieldCheck,
  LuShieldOff,
  LuChevronRight,
  LuPencil,
} from "react-icons/lu";
import { FiChevronDown, FiChevronUp, FiX } from "react-icons/fi";
import { COLORS } from "@/constants/Theme";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

interface AdminRow {
  id: string;
  username: string;
  role: string;
  blocked: boolean;
  image?: string;
}

interface AccountRow {
  id: string;
  name: string;
  routingNumber: string;
  savingsBalance: number;
  checkingBalance: number;
  currency: string;
  currencySymbol: string;
  image?: string;
  admin: string;
}

export default function AdminsPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [accounts, setAccounts] = useState<AccountRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedAdmin, setExpandedAdmin] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [modal, setModal] = useState<{
    open: boolean;
    adminId: string;
    adminUsername: string;
    newBlocked: boolean;
  } | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const [{ data: adminsData }, { data: accountsData }] = await Promise.all([
        supabase
          .from("admins")
          .select("*")
          .neq("role", "masterAdmin") // exclude masterAdmin from list
          .order("username", { ascending: true }),
        supabase
          .from("users")
          .select(
            "id, name, routingNumber, savingsBalance, checkingBalance, currency, currencySymbol, image, admin",
          ),
      ]);
      setAdmins(adminsData ?? []);
      setAccounts(accountsData ?? []);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const filteredAdmins = admins.filter((a) =>
    a.username.toLowerCase().includes(search.toLowerCase()),
  );

  const getAdminAccounts = (username: string) =>
    accounts.filter((acc) => acc.admin === username);

  const handleToggleRequest = (admin: AdminRow) => {
    setModal({
      open: true,
      adminId: admin.id,
      adminUsername: admin.username,
      newBlocked: !admin.blocked,
    });
  };

  const confirmToggle = async () => {
    if (!modal) return;
    setTogglingId(modal.adminId);

    const { error } = await supabase
      .from("admins")
      .update({ blocked: modal.newBlocked })
      .eq("id", modal.adminId);

    if (!error) {
      setAdmins((prev) =>
        prev.map((a) =>
          a.id === modal.adminId ? { ...a, blocked: modal.newBlocked } : a,
        ),
      );
    }

    setTogglingId(null);
    setModal(null);
  };

  const totalAccounts = accounts.length;
  const blockedAdmins = admins.filter((a) => a.blocked === true).length;

  return (
    <div className="min-h-screen bg-[#F9FAFC] p-4 lg:px-14 md:px-10 md:pt-10 lg:pt-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[20px] lg:text-[25px] font-semibold text-[#324158]">
          Admins
        </h1>
        <p className="text-[14px] lg:text-[15px] text-gray-500">
          Manage admin access and view their created accounts
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          {
            icon: LuUsers,
            label: "Total Admins",
            value: admins.length,
            color: "text-blue-500",
            bg: "bg-blue-50",
          },
          {
            icon: LuWallet,
            label: "Total Accounts",
            value: totalAccounts,
            color: "text-green-500",
            bg: "bg-green-50",
          },
          {
            icon: LuShieldOff,
            label: "Blocked",
            value: blockedAdmins,
            color: "text-red-500",
            bg: "bg-red-50",
          },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div
            key={label}
            className="flex items-center gap-3 p-4 bg-white shadow-md rounded-2xl"
          >
            <div className={`p-2 rounded-xl ${bg} shrink-0`}>
              <Icon size={18} className={color} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-gray-400 font-medium truncate">
                {label}
              </p>
              <p className="text-[20px] font-bold text-[#324158]">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <LuSearch
          size={15}
          className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2"
        />
        <Input
          placeholder="Search admins..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 pl-9 bg-white shadow-sm text-sm text-[#324158] font-medium rounded-xl border-gray-200"
        />
      </div>

      {/* Admin list */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-full h-20 bg-white rounded-2xl shadow-md animate-pulse"
            />
          ))}
        </div>
      ) : filteredAdmins.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
          <LuUser size={40} />
          <p className="text-sm font-medium">No admins found</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredAdmins.map((admin) => {
            const adminAccounts = getAdminAccounts(admin.username);
            const isExpanded = expandedAdmin === admin.id;
            const isBlocked = admin.blocked === true;
            const isToggling = togglingId === admin.id;

            return (
              <div
                key={admin.id}
                className="bg-white shadow-md rounded-2xl overflow-hidden"
              >
                {/* Admin row */}
                <div className="flex items-center gap-3 p-4">
                  {/* Avatar */}
                  <Avatar className="w-10 h-10 shrink-0">
                    <AvatarImage src={admin.image} />
                    <AvatarFallback className="bg-[#F9FAFC] text-[#324158] font-semibold text-sm">
                      {admin.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[14px] font-semibold text-[#324158] truncate">
                        {admin.username}
                      </p>
                      <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                        Sub
                      </span>
                    </div>
                    <p className="text-[12px] text-gray-400 mt-0.5">
                      {adminAccounts.length}{" "}
                      {adminAccounts.length === 1 ? "account" : "accounts"}{" "}
                      created
                    </p>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Block/Unblock pill button */}
                    <button
                      onClick={() => handleToggleRequest(admin)}
                      disabled={isToggling}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        isBlocked
                          ? "bg-red-50 text-red-500 hover:bg-red-100"
                          : "bg-green-50 text-green-600 hover:bg-green-100"
                      }`}
                    >
                      {isToggling ? (
                        <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : isBlocked ? (
                        <LuShieldOff size={12} />
                      ) : (
                        <LuShieldCheck size={12} />
                      )}
                      {isBlocked ? "Blocked" : "Active"}
                    </button>

                    {/* Expand accounts */}
                    {adminAccounts.length > 0 && (
                      <button
                        onClick={() =>
                          setExpandedAdmin(isExpanded ? null : admin.id)
                        }
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-semibold transition-all ${
                          isExpanded
                            ? "bg-[#324158] text-white"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {adminAccounts.length}
                        {isExpanded ? (
                          <FiChevronUp size={12} />
                        ) : (
                          <FiChevronDown size={12} />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Accounts drawer */}
                {isExpanded && adminAccounts.length > 0 && (
                  <div className="border-t border-gray-100 bg-[#F9FAFC] px-4 py-3">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-3">
                      Accounts · {admin.username}
                    </p>
                    <div className="flex flex-col gap-2">
                      {adminAccounts.map((acc) => (
                        <button
                          key={acc.id}
                          type="button"
                          onClick={() =>
                            router.push(`/admin/dashboard/accounts/${acc.id}`)
                          }
                          className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-[#324158]/20 hover:shadow-md transition-all text-left w-full group"
                        >
                          <Avatar className="w-9 h-9 shrink-0">
                            <AvatarImage src={acc.image} />
                            <AvatarFallback className="bg-gray-100 text-[#324158] text-xs font-semibold">
                              {acc.name?.slice(0, 2).toUpperCase() ?? "U"}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-[#324158] truncate">
                              {acc.name}
                            </p>
                            <p className="text-[11px] text-gray-400 font-mono">
                              #{acc.routingNumber}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <div className="text-right">
                              <p className="text-[12px] font-bold text-[#324158]">
                                {acc.currencySymbol}
                                {(
                                  (acc.savingsBalance ?? 0) +
                                  (acc.checkingBalance ?? 0)
                                ).toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </p>
                              <p className="text-[10px] text-gray-400">
                                {acc.currency} · Total
                              </p>
                            </div>
                            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-50 group-hover:bg-[#324158] transition-colors">
                              <LuPencil
                                size={11}
                                className="text-gray-400 group-hover:text-white transition-colors"
                              />
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Confirm Modal */}
      {modal?.open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4 pb-4 sm:pb-0">
          <div className="w-full max-w-sm bg-white shadow-2xl rounded-2xl overflow-hidden">
            {/* Top accent bar */}
            <div
              className={`h-1 w-full ${modal.newBlocked ? "bg-red-500" : "bg-green-500"}`}
            />

            <div className="p-6">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl ${modal.newBlocked ? "bg-red-50" : "bg-green-50"}`}
                  >
                    {modal.newBlocked ? (
                      <LuShieldOff size={20} className="text-red-500" />
                    ) : (
                      <LuShieldCheck size={20} className="text-green-500" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-[15px] font-semibold text-[#324158]">
                      {modal.newBlocked ? "Block admin" : "Unblock admin"}
                    </h2>
                    <p className="text-[12px] text-gray-400 font-medium">
                      @{modal.adminUsername}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setModal(null)}
                  className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors"
                >
                  <FiX size={14} />
                </button>
              </div>

              <p className="text-[13px] text-gray-500 mb-6 leading-relaxed">
                {modal.newBlocked
                  ? `${modal.adminUsername} will immediately lose access to create or edit accounts.`
                  : `${modal.adminUsername} will regain full access to create and edit accounts.`}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setModal(null)}
                  className="flex-1 py-2.5 text-sm font-semibold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmToggle}
                  disabled={togglingId !== null}
                  className={`flex-1 py-2.5 text-sm font-semibold text-white rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2 ${
                    modal.newBlocked
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {togglingId && (
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {togglingId
                    ? "Saving..."
                    : modal.newBlocked
                      ? "Yes, block"
                      : "Yes, unblock"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
