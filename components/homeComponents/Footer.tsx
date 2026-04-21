import React from "react";
// import image66 from "@/public/66.webp";
import Image from "next/image";
import {
  PiFacebookLogoThin,
  PiInstagramLogoLight,
  PiLinkedinLogoLight,
  PiTiktokLogoLight,
} from "react-icons/pi";
import { RiTwitterXFill } from "react-icons/ri";
import { AiOutlineBank } from "react-icons/ai";
import { COLORS } from "@/constants/Theme";
import Link from "next/link";

function Footer() {
  return (
    <footer className="overflow-x-clip">
      <div className="bg-[#020617] pt-5 lg:pt-5">
        <div>
          <div className="flex flex-col mx-auto px-7 py-28 max-w-300 md:px-12 lg:px-0 lg:flex-row lg:gap-20">
            <div className="flex flex-col gap-2 lg:max-w-[500px]  lg:justify-between">
              <Link href="/">
                {/* Logo */}
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg md:w-10 md:h-10"
                    style={{ backgroundColor: COLORS.primaryBlue }}
                  >
                    <AiOutlineBank size={20} color="white" />
                  </div>

                  <h1 className="text-xl font-bold text-white md:text-2xl">
                    Silver
                    <span style={{ color: COLORS.primaryBlue }}>Capital</span>
                  </h1>
                </div>
              </Link>

              <p className="text-sm text-gray-500">
                The modern financial platform built for the way you actually
                live.
              </p>
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} SilverCapitalBank
              </p>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between lg:w-full">
              <div className="flex flex-col gap-5 mt-10">
                <h2 className="font-bold text-white">PRODUCTS</h2>
                <p className="text-gray-500">Business</p>
                <p className="text-gray-500">Investments</p>
                <p className="text-gray-500">Crypto</p>
              </div>
              <div className="flex flex-col gap-5 mt-10">
                <h2 className="font-bold text-white">COMPANY</h2>
                <p className="text-gray-500">About</p>
                <p className="text-gray-500">Careers</p>
                <p className="text-gray-500">Blog</p>
                <p className="text-gray-500">Press</p>
              </div>
              <div className="flex flex-col gap-5 mt-10">
                <h2 className="font-bold text-white">LEGAL</h2>
                <p className="text-gray-500">Privacy</p>
                <p className="text-gray-500">Terms</p>
                <p className="text-gray-500">Security</p>
                <p className="text-gray-500">FDIC Notice</p>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden ">
          <h1 className="text-[#62748E]/10 font-bold text-[80px] md:text-[170px] lg:text-[300px] leading-none whitespace-nowrap translate-y-6 md:translate-y-8 lg:translate-y-16 text-center mx-auto">
            SilverCapital
          </h1>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
