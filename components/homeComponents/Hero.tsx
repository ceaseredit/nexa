"use client";
import { COLORS } from "@/constants/Theme";
import Link from "next/link";
import React from "react";
import { GoArrowRight } from "react-icons/go";
import { LuChartColumn, LuRotateCw, LuSparkles } from "react-icons/lu";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import { FaBoxOpen, FaRegChartBar, FaStar, FaSuitcase } from "react-icons/fa";
import { MdOutlineShield } from "react-icons/md";
import { AiOutlineBank } from "react-icons/ai";
import { BsArrowUpRight, BsSend } from "react-icons/bs";
import { SiMastercard } from "react-icons/si";
import { FaArrowsRotate } from "react-icons/fa6";
import { BiCameraMovie } from "react-icons/bi";

function Hero() {
  return (
    <section className="mt-32 gap-20 md:px-28 lg:px-10 flex-col lg:flex-row lg:justify-between flex lg:gap-10">
      <div className="flex flex-col gap-10 lg:gap-14">
        <div
          data-aos="fade-up"
          className="flex items-center gap-2  rounded-full px-8 py-2 justify-center w-fit font-semibold text-[#1447E5] text-sm bg-[#E9ECFE] border-[#BEDBFF] border-[1.5px]"
        >
          <LuSparkles size={16} />
          <h2>Voted #1 Digital Bank 2025</h2>
        </div>

        <div className="flex flex-col gap-2">
          <h1
            className="text-6xl font-bold md:text-7xl"
            style={{ color: COLORS.primaryBlack }}
            data-aos="fade-up"
          >
            Banking
          </h1>
          <h1
            data-aos="fade-up"
            className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-[#2A4CDB] via-[#713FEC] to-[#b293ff] bg-clip-text text-transparent"
          >
            Redefined.
          </h1>
          <p className="mt-10 text-lg text-gray-500" data-aos="fade-up">
            A smarter way to save, spend, and grow your wealth. SilverCapital
            combines institutional-grade technology with a consumer-first
            experience — and zero fees.
          </p>
        </div>
        <div className="flex flex-col gap-5 md:flex-row md:items-center ">
          <button
            className="px-5 py-3.5 font-semibold text-white transition-transform duration-300 rounded-xl drop-shadow-xl/20 hover:scale-105 flex flex-row gap-3 items-center justify-center "
            style={{ backgroundColor: COLORS.primaryBlack }}
            data-aos="fade-right"
            onClick={() =>
              alert("Please visit any of our branches to create an account")
            }
          >
            <h2 className="">Open Free Account</h2> <GoArrowRight size={20} />
          </button>

          <Link
            data-aos="fade-left"
            href="/signin"
            className=" px-5 py-3.5 text-gray-600 font-semibold transition-transform duration-300 rounded-xl drop-shadow-xl/20 hover:scale-105 border  flex items-center justify-center md:max-w-[100px] "
          >
            Sign in
          </Link>
        </div>

        <div
          data-aos="fade-up"
          className="flex flex-row items-center gap-2 mt-4 md:mt-6"
        >
          <AvatarGroup className="grayscale">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage
                src="https://github.com/maxleiter.png"
                alt="@maxleiter"
              />
              <AvatarFallback>LR</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage
                src="https://github.com/evilrabbit.png"
                alt="@evilrabbit"
              />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage
                src="https://github.com/evilrabbit.png"
                alt="@evilrabbit"
              />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>{" "}
            <Avatar>
              <AvatarImage
                src="https://github.com/evilrabbit.png"
                alt="@evilrabbit"
              />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
          </AvatarGroup>
          <div className="flex flex-row items-center">
            <div>
              <div className="flex flex-row">
                <FaStar color="#FFBA00" />
                <FaStar color="#FFBA00" />
                <FaStar color="#FFBA00" />
                <FaStar color="#FFBA00" />
                <FaStar color="#FFBA00" />
              </div>
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900 text-[12px]">
                  4.9/5
                </span>{" "}
                based on 120k+ verified reviews
              </p>
            </div>
            <div className="hidden w-px h-10 mx-4 bg-gray-500 md:block" />
            <div className="flex flex-row items-center hidden gap-2 md:flex">
              <MdOutlineShield size={20} color="green" />
              <p className="text-sm text-gray-500">FDIC insured</p>
            </div>
          </div>
        </div>
      </div>

      <div
        data-aos="fade-left"
        className="shadow-lg rounded-3xl flex flex-col gap-5  w-full h-fit bg-gradient-to-br from-[#2A4CDB] via-[#1D4CD0] to-[#3A49DF]"
      >
        <div className="mx-10 mt-8 mb-4">
          {/* balance */}
          <div className="flex flex-row justify-between w-full ">
            <div className="flex flex-col gap-2">
              <p className="text-[12px] font-semibold text-white/40">
                TOTAL PORTFOLIO
              </p>
              <h2 className="text-4xl font-semibold text-white">
                $48,290<span className="text-white/40">.50</span>
              </h2>

              <div className="flex flex-row items-center gap-2">
                <BsArrowUpRight size={15} color="#5EEAB4" />
                <p className="text-[#5EEAB4] text-[12px] font-semibold">
                  +$2,310 5.2% this month
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white/30">
              <AiOutlineBank size={25} color="white" />
            </div>
          </div>

          {/* atm card */}
          <div className="rounded-2xl border-[0.2px] border-white/20 p-5 bg-white/9 mt-4">
            <div className="flex flex-row items-center justify-between">
              <h2 className="font-semibold text-white/50 text-[12px]">
                SilverCapital Premium
              </h2>
              <SiMastercard size={25} className="text-white/50" />
            </div>
            <p className="mt-5 text-lg font-bold text-white/90">
              4291 **** **** 8204
            </p>

            <div className="flex flex-row items-center justify-between mt-5">
              <div>
                <p className="text-[12px] font-semibold text-white/40">
                  CARD HOLDER
                </p>
                <p className="text-white text-[13px] font-semibold">
                  Alex Johnson
                </p>
              </div>
              <div>
                <p className="text-[12px] font-semibold text-white/40">
                  EXPIRES
                </p>
                <p className="text-white text-[13px] font-semibold">09/28</p>
              </div>
            </div>
          </div>

          {/* icons */}
          <div className="flex flex-row items-center justify-between w-full gap-5 mt-4">
            <div className="flex flex-col items-center justify-center w-full h-20 gap-1 rounded-lg bg-white/9">
              <BsSend size={20} color="white" />
              <h3 className="text-sm font-semibold text-white">Send</h3>
            </div>
            <div className="flex flex-col items-center justify-center w-full h-20 gap-1 rounded-lg bg-white/9">
              <LuRotateCw size={20} color="white" />
              <h3 className="text-sm font-semibold text-white">Transfer</h3>
            </div>
            <div className="flex flex-col items-center justify-center w-full h-20 gap-1 rounded-lg bg-white/9">
              <LuChartColumn size={20} color="white" />
              <h3 className="text-sm font-semibold text-white">Invest</h3>
            </div>
          </div>
        </div>
        <div className="h-full px-10 pt-4 pb-8 bg-white rounded-b-3xl">
          <h1 className="font-bold text-[12px] text-gray-500">
            RECENT ACTIVITY
          </h1>

          <div className="flex flex-row items-center justify-between mt-3">
            <div className="flex flex-row items-center gap-3">
              <div className="p-4 bg-gray-100 border rounded-xl">
                <BiCameraMovie size={20} color="red" />
              </div>
              <div>
                <h2 className="font-semibold text-[15px]  text-gray-900">
                  Neflix Subscription
                </h2>
                <p className="text-gray-500 text-[12px]">Today</p>
              </div>
            </div>
            <div>
              <h2 className="font-semibold text-[15px] text-gray-900">
                -$15.99
              </h2>
            </div>
          </div>
          <div className="flex flex-row items-center justify-between mt-3">
            <div className="flex flex-row items-center gap-3">
              <div className="p-4 bg-gray-100 border rounded-xl">
                <FaSuitcase size={20} color="brown" />
              </div>
              <div>
                <h2 className="font-semibold text-[15px]  text-gray-900">
                  Salary Deposit
                </h2>
                <p className="text-gray-500 text-[12px]">Yesterday</p>
              </div>
            </div>
            <div>
              <h2 className="font-semibold text-[15px] text-green-700">
                +$4,200.00
              </h2>
            </div>
          </div>
          <div className="flex flex-row items-center justify-between mt-3">
            <div className="flex flex-row items-center gap-3">
              <div className="p-4 bg-gray-100 border rounded-xl">
                <FaBoxOpen size={20} color="orange" />
              </div>
              <div>
                <h2 className="font-semibold text-[15px]  text-gray-900">
                  Amazon Purchase
                </h2>
                <p className="text-gray-500 text-[12px]">Dec 18</p>
              </div>
            </div>
            <div>
              <h2 className="font-semibold text-[15px] text-gray-900">
                -$89.99
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
