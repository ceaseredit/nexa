// components/CrispChat.tsx
"use client";
import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export default function CrispChat() {
  useEffect(() => {
    Crisp.configure("afc4b56a-6deb-4fe5-857c-26f012fb1c52");
  }, []);

  return null;
}
