'use client'
import Link from 'next/link';
import React from 'react'
import { GoArrowRight, GoLock } from 'react-icons/go';

function JoinUs() {
  return (
    <div className="px-4 mx-auto max-w-300 md:px-8 lg:px-0">
      <div className="flex flex-col items-center text-center gap-9 md:gap-10 lg:gap-14 ">
        <p
          className="font-semibold text-[13px] tracking-widest text-white/60"
          data-aos="fade-up"
        >
          JOIN NEXABANK
        </p>

        <h1
          data-aos="fade-up"
          className="text-[50px] md:text-[70px] font-semibold text-center leading-11 md:leading-14 text-white/85"
        >
          Join 4.2 million <br className="md:hidden" />
          people
          <br />
          banking smarter
        </h1>

        <p
          className="text-white/70 text-[18px] lg:text-[19px] lg:max-w-[600px]"
          data-aos="fade-up"
        >
          Open your account in minutes. No minimum balance, no hidden fees —
          just banking that genuinely works for you.
        </p>

        <div className="flex flex-col w-full gap-5 md:flex-row md:items-center md:justify-center">
          <button
            data-aos="fade-right"
            data-duration-aos="4000"
            data-delay-aos="3000"
            onClick={() =>
              alert("Please visit any of our branches to create an account")
            }
            className="px-5 py-3.5 font-semibold transition-transform duration-300 rounded-xl drop-shadow-xl/20 hover:scale-105 hover:bg-blue-50 flex flex-row gap-3 items-center justify-center bg-[#FFFFFF]"
          >
            <h2 className="">Open Free Account</h2> <GoArrowRight size={20} />
          </button>

          <Link
            data-aos="fade-left"
            data-duration-aos="4000"
            data-delay-aos="3000"
            href="/signin"
            className=" px-5 py-3.5 text-white font-semibold transition-transform duration-300 rounded-xl drop-shadow-xl/20 hover:scale-105 border border-white/20 hover:bg-white/20 flex items-center justify-center md:max-w-[200px] bg-[#455CE0] flex flex-row gap-3"
          >
            <GoLock />
            Sign In Securely
          </Link>
        </div>
      </div>
    </div>
  );
}

export default JoinUs
