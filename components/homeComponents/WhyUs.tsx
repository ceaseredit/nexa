import { COLORS } from "@/constants/Theme";
import React from "react";
import { CiMobile2 } from "react-icons/ci";
import { IoMdTrendingUp } from "react-icons/io";
import { LuGlobe, LuPiggyBank } from "react-icons/lu";
import { MdOutlineShield } from "react-icons/md";
import { RxLightningBolt } from "react-icons/rx";

function WhyUs() {
  const data = [
    {
      title: "Military-Grade Security",
      description:
        "256-bit AES encryption, biometric authentication, and AI-powered fraud detection running 24/7.",
      icon: <MdOutlineShield size={20} color="#165DFC" />,
      tag: "SECURITY",
      iconBg: "#EEF6FF",
    },
    {
      title: "Instant Everything",
      description:
        "Transfers land in seconds, not days. Real-time notifications on every dollar that moves.",
      icon: <RxLightningBolt size={20} color="#8023FE" />,
      tag: "SPEED",
      iconBg: "#F5F3FF",
    },
    {
      title: "Automated Wealth Growth",
      description:
        "AI-optimized portfolios that rebalance automatically. Your money works harder than you do.",
      icon: <IoMdTrendingUp size={20} color="#009866" />,
      tag: "INVESTMENTS",
      iconBg: "#EBFDF5",
    },
    {
      title: "Borderless Banking",
      description:
        "Spend in 180+ countries, hold 30+ currencies, transfer globally — all with zero hidden fees.",
      icon: <LuGlobe size={20} color="#E17100" />,
      tag: "GLOBAL",
      iconBg: "#FFFBEA",
    },
    {
      title: "Mobile-First Design",
      description:
        "Everything at your fingertips. Apple Pay, Google Pay, instant card controls, all from the app.",
      icon: <CiMobile2 size={20} color="#E60076" />,
      tag: "MOBILE",
      iconBg: "#FDF1F8",
    },
    {
      title: "Intelligent Savings",
      description:
        "Behavioral rules that round up, save on payday, or set micro-goals. Effortless wealth building.",
      icon: <LuPiggyBank size={20} color="#0092B9" />,
      tag: "SAVINGS",
      iconBg: "#EBFEFF",
    },
  ];
  return (
    <div className="px-4 mx-auto max-w-300 md:px-8 lg:px-0 " data-aos="fade-up">
      <div className="flex flex-col md:flex-row md:justify-between md:gap-2 md:items-center">
        <div className="flex flex-col gap-5 md:w-[60%]   ">
          <p
            className="font-semibold text-[13px] tracking-widest"
            style={{ color: COLORS.primaryBlue }}
          >
            WHY NEXABANK
          </p>
          <div>
            <h1
              className="text-[40px]  md:text-[55px] lg:text-[60px] font-bold leading-9"
              style={{ color: COLORS.primaryBlack }}
            >
              Banking built for
            </h1>
            <h1
              className="text-[40px] md:text-[55px] lg:text-[60px] font-bold "
              style={{ color: COLORS.primaryBlue }}
            >
              the modern world
            </h1>
          </div>
        </div>
        <div className="mt-7 md:w-[40%] lg:w-[30%]  ">
          <p className="text-left md:text-right text-[17px] lg:text-[17px] md:text-[16px] leading-7 text-gray-500">
            We've rethought every touchpoint — from onboarding to wire transfers
            — to give you an experience that actually makes sense.
          </p>
        </div>
      </div>

      <div
        className="grid grid-cols-1 gap-10 mt-20 md:grid-cols-2 lg:grid-cols-3"
        data-aos="fade-up"
        data-delay-aos="3000"
      >
        {data.map((item, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 border-[0.3px] border-gray-200 rounded-2xl p-8 bg-white group hover:drop-shadow-xl"
          >
            <div className="flex flex-row items-center justify-between">
              <div
                className="flex items-center justify-center w-12 h-12 rounded-2xl"
                style={{ backgroundColor: item.iconBg }}
              >
                {item.icon}
              </div>

              <h3 className="font-semibold text-[12px] text-gray-300 group-hover:text-[#155DFC]/60">
                {item.tag}
              </h3>
            </div>

            <div className="flex flex-col gap-5 mt-5">
              <h1 className="text-lg font-bold">{item.title}</h1>
              <p className="text-gray-500 text-[15px]">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WhyUs;
