"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboardComponents/AppSidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { SlBell } from "react-icons/sl";
import { AdminSidebar } from "@/components/dashboardComponents/AdminSideBar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useEffect } from "react";
import { checkAuth } from "@/store/slices/userAuthSlice";
import { BalanceVisibilityProvider } from "@/context/BalanceVisibilityContext";
import { useBalanceVisibility } from "@/context/BalanceVisibilityContext";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
export default function Layout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<any>();
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const user = useSelector((state: RootState) => state.user?.user ?? null);
  console.log(user?.name);

  const getInitials = (name?: string) => {
    if (!name) return "NA";

    const parts = name.trim().split(" ");

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
  };

  const { visible, toggle } = useBalanceVisibility();
  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex w-full min-h-screen">
          <AppSidebar />

          <div className="flex flex-col flex-1">
            {/* Sticky Navbar */}
            <header className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4 md:py-auto bg-white border-b border-gray-100 shadow-sm md:h-[84px]">
              <SidebarTrigger />
              {/* Add whatever you want here */}
              <div className="flex flex-row items-center gap-7">
                <SlBell size={20} className="text-gray-500" />
                <button
                  onClick={toggle}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {visible ? (
                    <IoEyeOutline size={20} />
                  ) : (
                    <IoEyeOffOutline size={20} />
                  )}
                </button>

                <Avatar className="shrink-0 size-9">
                  <AvatarImage src={user?.image} alt="@shadcn" />
                  <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                  <AvatarBadge className="bg-green-600" />
                </Avatar>
              </div>
            </header>

            {/* Page content */}
            <main className="flex-1 ">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
