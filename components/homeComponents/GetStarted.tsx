import { COLORS } from "@/constants/Theme";
import React from "react";

function GetStarted() {
  return (
    <div className="py-28">
      <div className="flex flex-col items-center gap-5">
        <h3
          className="text-[#155DFC] tracking-widest font-bold text-[13px]"
          data-aos="fade-up"
        >
          GET STARTED
        </h3>
        <div data-aos="fade-up" data-delay-aos="3000">
          <h1
            className="text-[40px] md:text-[60px] font-semibold text-center leading-11 md:leading-14"
            style={{ color: COLORS.primaryBlack }}
          >
            From zero to banking
          </h1>
          <h1
            className="text-[40px] md:text-[60px] font-semibold text-center leading-11 md:leading-14 lg:leading-20"
            style={{ color: COLORS.primaryBlack }}
          >
            in under 3 minutes
          </h1>
        </div>
      </div>

      <div className="grid items-center grid-cols-1 gap-10 mt-16 md:grid-cols-3 lg:gap-20">
        <div
          className="flex flex-col items-center justify-center gap-4 text-center "
          data-aos="fade-up"

        >
          <div className="flex justify-center items-center border-2 rounded-2xl w-24 h-24  border-[#DBEAFF]">
            <h2
              className="font-semibold text-[23px]"
              style={{ color: COLORS.primaryBlue }}
            >
              01
            </h2>
          </div>

          <h2 className="font-semibold text-[18px] tracking-wider mt-4">
            Create Your Account
          </h2>
          <p className="text-gray-500 text-[15px]">
            Sign up in minutes with just your email and basic details. No
            paperwork, no branch visits, no waiting.
          </p>
        </div>
        <div
          className="flex flex-col items-center justify-center gap-4 text-center "
          data-aos="fade-up"
          data-delay-aos="3500"
        >
          <div className="relative">
            <div className="absolute border-[#155DFC]/50 border-1 w-[300px] lg:w-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block -z-200"></div>

            <div className="flex justify-center items-center border-2 rounded-2xl w-24 h-24  border-[#DBEAFF] z-10 bg-white">
              <h2
                className="font-semibold text-[23px]"
                style={{ color: COLORS.primaryBlue }}
              >
                02
              </h2>
            </div>
          </div>

          <h2 className="font-semibold text-[18px] tracking-wider mt-4">
            Verify Identity
          </h2>
          <p className="text-gray-500 text-[15px]">
            Quick, secure identity verification using your government ID.
            Typically done in under 90 seconds.
          </p>
        </div>
        <div
          className="flex flex-col items-center justify-center gap-4 text-center "
          data-aos="fade-up"
          data-delay-aos="4000"
        >
          <div className="flex justify-center items-center border-2 rounded-2xl w-24 h-24  border-[#DBEAFF]">
            <h2
              className="font-semibold text-[23px]"
              style={{ color: COLORS.primaryBlue }}
            >
              03
            </h2>
          </div>

          <h2 className="font-semibold text-[18px] tracking-wider mt-5">
            Start Banking
          </h2>
          <p className="text-gray-500 text-[15px]">
            Instant account access. Fund your account, get your virtual card,
            and make your first transaction.
          </p>
        </div>
      </div>
    </div>
  );
}

export default GetStarted;
