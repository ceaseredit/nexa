import { COLORS } from "@/constants/Theme";
import React from "react";
import { FaStar } from "react-icons/fa";

function Testimonials() {
  return (
    <div className="bg-[#0E172B] py-20">
      <div className="px-4 mx-auto max-w-300 md:px-8 lg:px-0">
        <div className="flex flex-col md:flex-row md:justify-between md:gap-1 md:items-end">
          <div
            className="flex flex-col gap-5 md:w-[70%]  "
            data-aos="fade-left"
          >
            <p
              className="font-semibold text-[13px] tracking-widest"
              style={{ color: COLORS.primaryBlue }}
            >
              TESTIMONIALS
            </p>
            <div>
              <h1 className="text-[40px]  md:text-[55px] lg:text-[60px] font-bold leading-9 md:leading-15 text-white">
                Trusted by millions
              </h1>
              <h1 className="text-[40px] md:text-[55px] lg:text-[60px] font-bold text-white md:leading-12">
                of people
              </h1>
            </div>
          </div>
          <div className="mt-7 md:w-[50%] lg:w-[30%] " data-aos="fade-right">
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-row">
                <FaStar color="#FFBA00" size={19} />
                <FaStar color="#FFBA00" size={19} />
                <FaStar color="#FFBA00" size={19} />
                <FaStar color="#FFBA00" size={19} />
                <FaStar color="#FFBA00" size={19} />
              </div>
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-200 text-[12px]">
                  4.9/5
                </span>{" "}
                . 120k+ verified reviews
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 lg:gap-10">
          <div
            className="border-[0.1px] border-gray-500 mt-20 rounded-4xl flex flex-col h-fit px-10 py-14 gap-9 bg-[#172136] hover:bg-slate-800"
            data-aos="flip-left"
            data-delay-aos="1000"
          >
            <div className="flex flex-row gap-1">
              <FaStar color="#FFBA00" size={18} />
              <FaStar color="#FFBA00" size={18} />
              <FaStar color="#FFBA00" size={18} />
              <FaStar color="#FFBA00" size={18} />
              <FaStar color="#FFBA00" size={18} />
            </div>

            <p className="text-white/70 font-medium text-[16px] leading-7">
              "NexaBank fundamentally changed how I manage business finances.
              The instant transfers and zero fees saved us over $12,000 last
              year alone."
            </p>

            <div className="flex flex-row items-center gap-3">
              <div className=" rounded-full size-12 flex items-center justify-center bg-linear-to-r from-[#FF6B72] via-[#FF775C] to-[#FF8335]">
                <h1 className="font-semibold text-white/90">SR</h1>
              </div>
              <div className="flex flex-col">
                <h2 className="font-semibold text-white/70">Sophia Reyes</h2>
                <p className="text-gray-500 text-[12px]">
                  Founder, Luminary Co.
                </p>
              </div>
            </div>
          </div>
          <div
            className="border-[0.1px] border-gray-500 mt-20 rounded-4xl flex flex-col h-fit px-10 py-14 gap-9 bg-[#172136] hover:bg-slate-800"
            data-aos="flip-left"
            data-delay-aos="2000"
          >
            <div className="flex flex-row gap-1">
              <FaStar color="#FFBA00" size={18} />
              <FaStar color="#FFBA00" size={18} />
              <FaStar color="#FFBA00" size={18} />
              <FaStar color="#FFBA00" size={18} />
              <FaStar color="#FFBA00" size={18} />
            </div>

            <p className="text-white/70 font-medium text-[16px] leading-7">
              "I've used every neobank out there. NexaBank is the only one that
              actually feels like it was built for people who understand money."
            </p>

            <div className="flex flex-row items-center gap-3">
              <div className=" rounded-full size-12 flex items-center justify-center bg-linear-to-r from-[#1990FF] via-[#00B3FB] to-[#00C1F8]">
                <h1 className="font-semibold text-white/90">MC</h1>
              </div>
              <div className="flex flex-col">
                <h2 className="font-semibold text-white/70">Marcus Chen</h2>
                <p className="text-gray-500 text-[12px]">
                  Lead Engineer, Vercel
                </p>
              </div>
            </div>
          </div>
          <div
            className="border-[0.1px] border-gray-500 mt-20 rounded-4xl flex flex-col h-fit px-10 py-14 gap-9 bg-[#172136] hover:bg-slate-800"
            data-aos="flip-left"
            data-delay-aos="3000"
          >
            <div className="flex flex-row gap-1">
              <FaStar color="#FFBA00" size={18} />
              <FaStar color="#FFBA00" size={18} />
              <FaStar color="#FFBA00" size={18} />
              <FaStar color="#FFBA00" size={18} />
              <FaStar color="#FFBA00" size={18} />
            </div>

            <p className="text-white/70 font-medium text-[16px] leading-7">
              "Traveling 9 months a year, zero foreign fees has saved me
              hundreds. The multi-currency wallet is genuinely magic."
            </p>

            <div className="flex flex-row items-center gap-3">
              <div className=" rounded-full size-12 flex items-center justify-center bg-linear-to-r from-[#965AFF] via-[#A767FF] to-[#B874FF]">
                <h1 className="font-semibold text-white/90">AO</h1>
              </div>
              <div className="flex flex-col">
                <h2 className="font-semibold text-white/70">Aisha Okafor</h2>
                <p className="text-gray-500 text-[12px]">
                  Travel Content Creator
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testimonials;
