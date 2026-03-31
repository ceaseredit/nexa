"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { usePathname } from "next/navigation";

export default function AOSProvider() {
  const pathname = usePathname();

  useEffect(() => {
    AOS.init({
      duration: 650,
      once: true,
      offset: 100,
      easing: "ease-out-cubic",
    });
  }, []);

  // Refresh animations on route change
  useEffect(() => {
    AOS.refresh();
  }, [pathname]);

  return null;
}
