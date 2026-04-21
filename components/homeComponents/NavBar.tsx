"use client";

import React, { useState, useRef, useEffect } from "react";
import { COLORS } from "@/constants/Theme";
import { TbInvoice } from "react-icons/tb";
import { RxHamburgerMenu } from "react-icons/rx";
import { AiOutlineBank, AiOutlineClose } from "react-icons/ai";
import { motion } from "framer-motion";
import Link from "next/link";

const navItems = [
  { label: "Hero", id: "hero" }, // tracking only
  { label: "Performance", id: "performance" },
  { label: "Why Us", id: "whyus" },
  { label: "Testimonials", id: "testimonials" },
  { label: "About", id: "about" },
];

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState("");

  const menuRef = useRef<HTMLDivElement>(null);
  const [menuHeight, setMenuHeight] = useState(0);

  useEffect(() => {
    if (menuRef.current) {
      setMenuHeight(menuRef.current.scrollHeight);
    }
  }, []);

  // scroll with offset
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    const navbar = document.querySelector("nav");

    if (!element) return;

    const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 90;

    const y =
      element.getBoundingClientRect().top + window.scrollY - navbarHeight;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });

    // update URL hash
    history.replaceState(null, "", `#${id}`);

    setIsOpen(false);
  };

  // active section detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;

            setActive(id);
            history.replaceState(null, "", `#${id}`);
          }
        });
      },
      {
        rootMargin: "-30% 0px -60% 0px",
        threshold: 0,
      },
    );

    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    // detect current section on page load
    const hash = window.location.hash.replace("#", "");
    if (hash) setActive(hash);

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="px-4 pt-5 pb-3 mx-auto max-w-300 md:px-8 lg:px-0">
      <div className="flex items-center justify-between">
        <Link href="/">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg md:w-10 md:h-10"
              style={{ backgroundColor: COLORS.primaryBlue }}
            >
              <AiOutlineBank size={20} color="white" />
            </div>

            <h1
              style={{ color: COLORS.primaryBlack }}
              className="text-xl font-bold md:text-2xl"
            >
              Silver<span style={{ color: COLORS.primaryBlue }}>Capital</span>
            </h1>
          </div>
        </Link>
        {/* Desktop menu */}
        <ul className="relative items-center hidden gap-10 text-sm font-semibold text-gray-500 lg:flex">
          {navItems
            .filter((item) => item.id !== "hero")
            .map((item) => (
              <li
                key={item.id}
                onClick={() => handleScrollTo(item.id)}
                className={`relative cursor-pointer transition-colors duration-300 hover:text-[#0F172B]
              ${active === item.id ? "text-[#0F172B]" : ""}`}
              >
                {item.label}

                {active === item.id && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute left-0 right-0 h-[2px] -bottom-2"
                    style={{ backgroundColor: COLORS.primaryBlue }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
              </li>
            ))}
        </ul>

        {/* Desktop buttons */}
        <div className="hidden lg:block">
          <div className="flex items-center gap-10 text-sm font-semibold">
            <Link href="/signin">
              <button className="text-[#0F172B]  px-5 py-3 rounded-lg hover:border-[0.6px] hover:bg-[#F7F8FC]">
                Sign in
              </button>
            </Link>
            <div
              className="px-5 py-3 text-white transition-transform duration-300 rounded-lg drop-shadow-xl/20 hover:scale-110"
              style={{ backgroundColor: COLORS.primaryBlack }}
            >
              <button
                onClick={() =>
                  alert("Please visit any of our branches to create an account")
                }
              >
                <button>Open Account</button>
              </button>
            </div>
          </div>
        </div>

        {/* Hamburger */}
        <button
          className="relative w-5 h-5 transition-transform duration-300 lg:hidden active:scale-90"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div
            className="absolute inset-0 flex items-center justify-center transition-all duration-300"
            style={{
              opacity: isOpen ? 0 : 1,
              transform: isOpen
                ? "rotate(90deg) scale(0.5)"
                : "rotate(0deg) scale(1)",
            }}
          >
            <RxHamburgerMenu size={20} />
          </div>

          <div
            className="absolute inset-0 flex items-center justify-center transition-all duration-300"
            style={{
              opacity: isOpen ? 1 : 0,
              transform: isOpen
                ? "rotate(0deg) scale(1)"
                : "rotate(-90deg) scale(0.5)",
            }}
          >
            <AiOutlineClose size={20} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`grid transition-all duration-500 lg:hidden ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="flex flex-col gap-8 py-5 mt-5 mb-5 text-sm font-semibold text-gray-500 border-y">
            {navItems
              .filter((item) => item.id !== "hero")
              .map((item) => (
                <li
                  key={item.id}
                  onClick={() => handleScrollTo(item.id)}
                  className={`cursor-pointer transition-colors
              ${active === item.id ? "text-black" : ""}`}
                >
                  {item.label}
                </li>
              ))}
          </ul>

          <div className="flex flex-col gap-4 pb-5">
            <Link href="/signin">
              <div className="py-3 text-sm font-semibold text-center border rounded-lg hover:bg-[#F7F8FC]">
                <button>Sign in</button>
              </div>
            </Link>
            <Link href="/signup">
              <div
                className="py-3 text-sm font-semibold text-center text-white border rounded-lg "
                style={{ backgroundColor: COLORS.primaryBlue }}
              >
                <button>Open Account</button>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
