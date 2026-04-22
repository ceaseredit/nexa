"use client";
import { RootState } from "@/store";
import React from "react";
import { FaCcVisa } from "react-icons/fa6";
import { SiMastercard } from "react-icons/si";
import { useSelector } from "react-redux";

function Page() {
  const user = useSelector((state: RootState) => state.user?.user ?? null);
  const currentYear = new Date().getFullYear();
  const expiryYear2 = String(currentYear + 2).slice(-2); // last 2 digits
  const expiryYear3 = String(currentYear + 3).slice(-2);
  return (
    <div className="bg-[#F9FAFC] p-4 lg:px-14 md:px-10 md:pt-10 lg:pt-10 h-full">
      <h1 className="text-[20px] lg:text-[25px] font-semibold">My Cards</h1>
      <p className="text-[14px] lg:text-[15px] text-gray-500">
        Manage your payments card
      </p>
      <div className="flex flex-col w-full gap-6 mt-10 lg:flex-row">
        {/* atm card */}
        <div className="flex flex-col min-h-[220px] md:w-[400px] rounded-2xl border-[0.2px] border-white/20 p-5 bg-linear-to-br from-[#6C7787] to-[#4C515F]">
          <div className="flex flex-row items-center justify-between ">
            <h2 className="font-semibold text-white/50 text-[12px]">
              SilverCapital Premium
            </h2>
            <SiMastercard size={25} className="text-white/50" />
          </div>
          <p className="mt-5 text-lg font-bold text-white/90">
            4291 **** **** 8204
          </p>

          <div className="flex flex-row items-center justify-between mt-auto">
            <div>
              <p className="text-[12px] font-semibold text-white/40">
                CARD HOLDER
              </p>
              <p className="text-white text-[13px] font-semibold capitalize">
                {user?.name}
              </p>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-white/40">EXPIRES</p>
              <p className="text-white text-[13px] font-semibold">
                09/{expiryYear2}
              </p>
            </div>
          </div>
        </div>
        {/* atm card */}
        <div className="flex flex-col min-h-[220px]  md:w-[400px] rounded-2xl border-[0.2px] border-white/20 p-5 bg-linear-to-br from-[#155CFA] via-[#1D44D8] to-[#302E8B] ">
          <div className="flex flex-row items-center justify-between ">
            <h2 className="font-semibold text-white/50 text-[12px]">
              SilverCapital Premium
            </h2>
            <FaCcVisa size={25} className="text-white/50" />
          </div>
          <p className="mt-5 text-lg font-bold text-white/90">
            9402 **** **** 3351
          </p>

          <div className="flex flex-row items-center justify-between mt-auto">
            <div>
              <p className="text-[12px] font-semibold text-white/40">
                CARD HOLDER
              </p>
              <p className="text-white text-[13px] font-semibold capitalize">
                {user?.name}
              </p>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-white/40">EXPIRES</p>
              <p className="text-white text-[13px] font-semibold">
                02/{expiryYear3}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
