import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import AOSProvider from "@/lib/AOSProvider";
import { Provider } from "react-redux";
import { store } from "@/store";
import Providers from "./providers";
import { BalanceVisibilityProvider } from "@/context/BalanceVisibilityContext";
import CrispChat from "@/components/CrispChat";
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Silver Capital Bank",
  description: "Secure banking that moves at your speed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AOSProvider />
      <BalanceVisibilityProvider>
        <body
          className={`${inter.variable}  antialiased`}
          suppressHydrationWarning
        >
          <CrispChat />
          <Providers>{children}</Providers>
        </body>
      </BalanceVisibilityProvider>
    </html>
  );
}
