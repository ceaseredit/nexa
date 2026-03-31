import { COLORS } from "@/constants/Theme";
import React from "react";
import { AiOutlineBank } from "react-icons/ai";
import { BsBank } from "react-icons/bs";
import { IoLockClosedOutline } from "react-icons/io5";
import { MdOutlineShield } from "react-icons/md";
import { RiVerifiedBadgeLine } from "react-icons/ri";

function Tape() {
  return (
    <div
      data-aos="fade-up"
      className="flex flex-col items-center justify-center h-20 gap-10 py-20 mt-20 md:h-10 md:flex-row md:py-10 "
      style={{ backgroundColor: COLORS.primaryBlack }}
    >
      <div className="flex flex-row gap-10">
        <div className="flex flex-row items-center gap-3">
          <AiOutlineBank className="text-white/70" size={23} />
          <p className="text-sm font-semibold text-white/70">FCID Insured</p>
        </div>
        <div className="flex flex-row items-center gap-3">
          <MdOutlineShield className="text-white/70" size={23} />
          <p className="text-sm font-semibold text-white/70">256-bit SSL</p>
        </div>
      </div>
      <div className="flex flex-row gap-10">
        <div className="flex flex-row items-center gap-3">
          <RiVerifiedBadgeLine className="text-white/70" size={23} />
          <p className="text-sm font-semibold text-white/70">SOC 2 Certified</p>
        </div>
        <div className="flex flex-row items-center gap-3">
          <IoLockClosedOutline className="text-white/70" size={23} />
          <p className="text-sm font-semibold text-white/70">PCI DSS Level 1</p>
        </div>
      </div>
    </div>
  );
}

export default Tape;
