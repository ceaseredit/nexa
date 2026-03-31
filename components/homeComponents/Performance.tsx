import { COLORS } from "@/constants/Theme";
import React from "react";
import { GoDotFill } from "react-icons/go";

function Performance() {
  const data = [
    {
      title: "4.2M+",
      description: "Customers Worldwide",
      tag: "Growing 40% YoY",
    },
    {
      title: "$12B+",
      description: "Assets Managed",
      tag: "Across 180+ Countries",
    },
    {
      title: "99.9%",
      description: "Uptime Guarantee",
      tag: "Industry-Leading Reliability",
    },
    {
      title: "0.3s",
      description: "Average Transfer Speed",
      tag: "Lightning-Fast Performance",
    },
  ];
  return (
    <div className="mt-20 mb-20 lg:mt-32 lg:mb-32">
      <div className="grid grid-cols-2 gap-5 mx-auto lg:grid-cols-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 border rounded-4xl px-5 py-6 bg-[#F9FAFC] hover:bg-[#EFF6FF]  group transition-colors duration-300 "
            data-aos="fade-up"
          >
            <GoDotFill
              size={20}
              className="self-end text-[#BEDBFF] group-hover:text-[#2B7FFF]"
            />
            <p
              className="text-[40px] lg:ext-[50px]  font-bold"
              style={{ color: COLORS.primaryBlack }}
            >
              {item.title}
            </p>
            <p className="text-[15px] lg:text-[20px] font-semibold text-gray-600">
              {item.description}
            </p>
            <p className="text-[12px] lg:text-[13px] text-gray-500">
              {item.tag}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Performance;
