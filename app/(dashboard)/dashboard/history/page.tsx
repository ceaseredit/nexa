"use client";
import { COLORS } from "@/constants/Theme";
import { RootState } from "@/store";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useHistory } from "@/hooks/useHistory";
import { useBalanceVisibility } from "@/context/BalanceVisibilityContext";

const fmtDate = (dateStr: string) => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const fmt = (n: number) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const PAGE_SIZE = 20;

function Page() {
  const user = useSelector((state: RootState) => state.user?.user ?? null);
  const symbol = user?.customCurrencySymbol || user?.currencySymbol || "$";

    const { visible } = useBalanceVisibility();
    const mask = (n: number) => (visible ? fmt(n) : "••••••");

  const userHistory = Array.isArray(user?.history) ? user.history : [];
  const { history, loading } = useHistory(
    user?.id ?? "",
    user?.hasHistory ?? false,
  );  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(history.length / PAGE_SIZE));
  const paginated = history.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="bg-[#F9FAFC] p-4 lg:px-14 md:px-10 md:pt-10 lg:pt-10 h-full">
      <h1 className="text-[20px] lg:text-[25px] font-semibold">
        Transaction History
      </h1>
      <p className="text-[14px] lg:text-[15px] text-gray-500">
        Your complete activity log
      </p>

      <div className="flex flex-col max-w-2xl p-5 bg-white shadow-xl mt-7 rounded-3xl">

        {history.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-gray-400 text-[14px]">No transactions found.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-lg font-semibold"
                style={{ color: COLORS.primaryBlack }}
              >
                History
              </h2>
              <span className="text-[13px] text-gray-400">
                {history.length} transactions
              </span>
            </div>

            <hr />

            <div className="flex flex-col gap-6 mt-6">
              {paginated.map((item, idx) => {
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
                        {mask(amount)}
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

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 mt-8 border-t">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 bg-[#F9FAFC] border hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <FiChevronLeft size={15} /> Prev
                </button>
                <span className="text-[13px] text-gray-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 bg-[#F9FAFC] border hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Next <FiChevronRight size={15} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Page;
