"use client";
import { COLORS } from "@/constants/Theme";
import { useBalanceVisibility } from "@/context/BalanceVisibilityContext";
import { RootState } from "@/store";
import React from "react";
import { BsArrowUpRight, BsArrowDownRight } from "react-icons/bs";
import { useSelector } from "react-redux";


// Derive a 2–4 char abbreviation from the investment name
function getAbbreviation(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 4).toUpperCase();
  return words
    .map((w) => w[0])
    .join("")
    .slice(0, 4)
    .toUpperCase();
}

const fmt = (n: number) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function Page() {
  const user = useSelector((state: RootState) => state.user?.user ?? null);

  const symbol = user?.customCurrencySymbol || user?.currencySymbol || "$";

  const userInvestments: any[] =
    Array.isArray(user?.investments) && user.investments.length > 0
      ? user.investments
      : [];

      const investments = userInvestments; 

  const investmentsTotal = investments.reduce(
    (sum: number, inv: any) =>
      sum + (parseFloat(String(inv.amount).replace(/,/g, "")) || 0),
    0,
  );

    const { visible } = useBalanceVisibility();
    const mask = (n: number) => (visible ? fmt(n) : "••••••");

  return (
    <div className="bg-[#F9FAFC] p-4 lg:px-14 md:px-10 md:pt-10 lg:pt-10 h-full">
      <h1 className="text-[20px] lg:text-[25px] font-semibold">Investments</h1>
      <p className="text-[14px] lg:text-[15px] text-gray-500">
        Your portfolio performance
      </p>

      <div className="flex flex-col max-w-2xl mt-8 lg:gap-10">
        {/* ── Total card ── */}
        <div className="p-5 border-[1.5px] border-[#D1FAE4] rounded-3xl bg-[#EFFDF9]">
          <div className="flex flex-col gap-3">
            <p className="text-[12px] font-semibold text-gray-500">
              TOTAL PORTFOLIO VALUE
            </p>
            <h2 className="text-4xl font-semibold lg:text-5xl">
              {symbol}
              {mask(investmentsTotal)}
            </h2>
            <div className="flex flex-row items-center gap-2 mt-1">
              <p className="text-[13px] text-gray-400">
                {investments.length} position
                {investments.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* ── Investment rows ── */}
        <div className="flex flex-col gap-4 mt-6">
          {investments.map((item: any, idx: number) => {
            const amount =
              parseFloat(String(item.amount).replace(/,/g, "")) || 0;
            const shares =
              parseFloat(String(item.numberOfShares ?? item.shares ?? 0)) || 0;
            const abbrev = getAbbreviation(item.name);
            const pct =
              investmentsTotal > 0
                ? ((amount / investmentsTotal) * 100).toFixed(1)
                : "0.0";

            return (
              <div
                key={idx}
                className="flex flex-row items-center justify-between w-full gap-5 p-5 bg-white shadow-xl rounded-3xl"
              >
                <div className="flex flex-row items-center gap-4">
                  {/* Icon badge */}
                  <div className="h-12 w-12 rounded-xl bg-[#EFFDF9] flex justify-center items-center shrink-0">
                    <h2 className="text-[11px] font-bold text-[#009866]">
                      {abbrev}
                    </h2>
                  </div>

                  <div>
                    <h2 className="font-semibold text-[15px]">{item.name}</h2>
                    <div className="flex flex-row items-center gap-2">
                      <p className="text-gray-400 text-[12px]">
                        {shares} {abbrev}
                      </p>
                      <span className="text-gray-200">·</span>
                      <p className="text-gray-400 text-[12px]">
                        {pct}% of portfolio
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <h2 className="font-semibold text-[15px]">
                    {symbol}
                    {mask(amount)}
                  </h2>
                  <p className="text-[12px] text-gray-400">
                    {shares > 0
                      ? `${symbol}${fmt(amount / shares)}/share`
                      : "—"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Empty state ── */}
        {investments.length === 0 && (
          <div className="flex items-center justify-center py-16">
            <p className="text-gray-400 text-[14px]">No investments found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
