"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { FiEdit2, FiTrash2, FiSlash, FiSearch } from "react-icons/fi";
import { COLORS } from "@/constants/Theme";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { div } from "framer-motion/client";
import { supabase } from "@/lib/supabase";

const fmtDate = (dateStr: string) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function AccountsPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [blocking, setBlocking] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Inside the component, add:
  const admin = useSelector((state: RootState) => state.admin?.admin ?? null);

  console.log(admin);
  useEffect(() => {
    if (!admin) return;

    const fetchAccounts = async () => {
      setLoading(true);

      let query = supabase
        .from("users")
        .select(
          "id, name,image, routingNumber, created_at, admin, blocked, currencySymbol, savingsBalance",
        )
        .order("created_at", { ascending: false });

      // subadmin only sees their own accounts
      if (admin.role === "subAdmin") {
        query = query.eq("admin", admin.username);
      }

      const { data, error } = await query;
      if (!error) setAccounts(data || []);
      setLoading(false);
    };

    fetchAccounts();
  }, [admin]);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (!error) setAccounts((prev) => prev.filter((a) => a.id !== id));
    setDeleting(null);
    setConfirmDelete(null);
  };

  const handleBlock = async (acc: any) => {
    setBlocking(acc.id);
    const { error } = await supabase
      .from("users")
      .update({ blocked: !acc.blocked })
      .eq("id", acc.id);
    if (!error) {
      setAccounts((prev) =>
        prev.map((a) => (a.id === acc.id ? { ...a, blocked: !a.blocked } : a)),
      );
    }
    setBlocking(null);
  };

  const filtered = useMemo(() => {
    if (!search) return accounts;
    return accounts.filter((acc) =>
      [acc.name, acc.routingNumber, acc.admin]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [accounts, search]);

  return (
    <div className="bg-[#F9FAFC] p-4 lg:px-14 md:px-10 md:pt-10 lg:pt-10 min-h-full">
      <h1 className="text-[20px] lg:text-[25px] font-semibold">Accounts</h1>
      <p className="text-[14px] text-gray-500">Manage all user accounts</p>

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 mt-6">
        <div className="relative flex-1 max-w-sm">
          <FiSearch
            className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2"
            size={15}
          />
          <Input
            placeholder="Search name, routing, admin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white h-11 pl-9"
          />
        </div>
        <span className="text-[13px] text-gray-400">
          {filtered.length} account{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Table ── */}
      <div className="mt-5 overflow-hidden bg-white shadow-xl rounded-3xl">
        {/* Header */}
        <div className="hidden md:grid grid-cols-[2fr_1.5fr_1.5fr_1fr_120px] gap-4 px-6 py-3 border-b bg-[#F9FAFC]">
          {["Account name", "Routing number", "Date created", "Actions"].map(
            (h) => (
              <span
                key={h}
                className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide"
              >
                {h}
              </span>
            ),
          )}
        </div>

        {loading ? (
          <div className="flex flex-col gap-4 p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="flex-1 h-4 bg-gray-100 rounded" />
                <div className="w-32 h-4 bg-gray-100 rounded" />
                <div className="h-4 bg-gray-100 rounded w-28" />
                <div className="w-20 h-4 bg-gray-100 rounded" />
                <div className="w-24 h-4 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-gray-400 text-[14px]">No accounts found.</p>
          </div>
        ) : (
          <div className="divide-y">
            {filtered.map((acc) => (
              <div key={acc.id}>
                {/* Desktop row */}
                <div className="hidden md:grid grid-cols-[2fr_1.5fr_1.5fr_1fr_120px] gap-4 px-6 py-4 items-center hover:bg-[#F9FAFC] transition-colors">
                  {/* Name */}
                  <div className="flex items-center gap-3">
                    <div className="shrink-0">
                      {acc.image ? (
                        <img
                          src={acc.image}
                          alt={acc.name}
                          className="object-cover w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold"
                          style={{ backgroundColor: COLORS.primaryBlack }}
                        >
                          {acc.name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-[14px] text-[#324158]">
                        {acc.name}
                      </p>
                      {acc.blocked && (
                        <span className="text-[10px] font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                          Blocked
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Routing */}
                  <p className="text-[13px] text-gray-500 font-mono">
                    {acc.routingNumber}
                  </p>

                  {/* Date */}
                  <p className="text-[13px] text-gray-500">
                    {fmtDate(acc.created_at)}
                  </p>

                  {/* Admin */}
                  {admin?.role !== "subAdmin" && (
                    <p className="text-[13px] text-gray-500">
                      {acc.admin ?? "—"}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* Edit */}
                    <button
                      onClick={() =>
                        router.push(`/admin/dashboard/accounts/${acc.id}`)
                      }
                      className="flex items-center justify-center w-8 h-8 text-blue-500 transition-colors rounded-lg bg-blue-50 hover:bg-blue-100"
                      title="Edit"
                    >
                      <FiEdit2 size={14} />
                    </button>

                    {/* Block / Unblock */}
                    {admin?.role !== "subAdmin" && (
                      <button
                        onClick={() => handleBlock(acc)}
                        disabled={blocking === acc.id}
                        className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors disabled:opacity-50
                        ${
                          acc.blocked
                            ? "bg-green-50 text-green-500 hover:bg-green-100"
                            : "bg-yellow-50 text-yellow-500 hover:bg-yellow-100"
                        }`}
                        title={acc.blocked ? "Unblock" : "Block"}
                      >
                        <FiSlash size={14} />
                      </button>
                    )}

                    {/* Delete */}

                    {admin?.role !== "subAdmin" && (
                      <button
                        onClick={() => setConfirmDelete(acc.id)}
                        disabled={deleting === acc.id}
                        className="flex items-center justify-center w-8 h-8 text-red-400 transition-colors rounded-lg bg-red-50 hover:bg-red-100 disabled:opacity-50"
                        title="Delete"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Mobile card */}
                <div className="flex flex-col gap-3 p-4 md:hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0">
                        {acc.image ? (
                          <img
                            src={acc.image}
                            alt={acc.name}
                            className="object-cover rounded-full w-9 h-9"
                          />
                        ) : (
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-bold"
                            style={{ backgroundColor: COLORS.primaryBlack }}
                          >
                            {acc.name?.[0]?.toUpperCase() ?? "?"}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-[14px] text-[#324158]">
                          {acc.name}
                        </p>
                        <p className="text-[12px] text-gray-400 font-mono">
                          {acc.routingNumber}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          router.push(`/admin/dashboard/accounts/${acc.id}`)
                        }
                        className="flex items-center justify-center w-8 h-8 text-blue-500 rounded-lg bg-blue-50"
                      >
                        <FiEdit2 size={14} />
                      </button>
                      {admin?.role !== "subAdmin" && (
                        <button
                          onClick={() => handleBlock(acc)}
                          className={`flex items-center justify-center w-8 h-8 rounded-lg ${acc.blocked ? "bg-green-50 text-green-500" : "bg-yellow-50 text-yellow-500"}`}
                        >
                          <FiSlash size={14} />
                        </button>
                      )}

                      {admin?.role !== "subAdmin" && (
                        <button
                          onClick={() => setConfirmDelete(acc.id)}
                          className="flex items-center justify-center w-8 h-8 text-red-400 rounded-lg bg-red-50"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-4 text-[12px] text-gray-400">
                    <span>{fmtDate(acc.created_at)}</span>
                    {admin?.role !== "subAdmin" && (
                      <>
                        <span>·</span>
                        <span>Admin: {acc.admin ?? "—"}</span>
                      </>
                    )}
                    {acc.blocked && (
                      <span className="font-semibold text-red-500">
                        Blocked
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Delete confirmation modal ── */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm p-6 mx-4 bg-white shadow-2xl rounded-3xl">
            <h2 className="text-[18px] font-semibold text-[#324158]">
              Delete account?
            </h2>
            <p className="text-[13px] text-gray-400 mt-1">
              This action is permanent and cannot be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl border text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deleting === confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-60 transition-colors"
              >
                {deleting === confirmDelete ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
