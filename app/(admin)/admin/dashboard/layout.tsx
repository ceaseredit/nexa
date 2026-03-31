'use client'
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
import { IoEyeOutline } from "react-icons/io5";
import { AdminSidebar } from "@/components/dashboardComponents/AdminSideBar";
import { useSelector } from "react-redux";
import { RootState } from "@/store";


export default function Layout({ children }: { children: React.ReactNode }) {

  
  const { loading, error, admin } = useSelector(
    (state: RootState) => state.admin,
  );



  const getInitials = (name?: string) => {
    if (!name) return "NA";

    const parts = name.trim().split(" ");

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
  };
  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex w-full min-h-screen">
          <AdminSidebar />

          <div className="flex flex-col flex-1">
            {/* Sticky Navbar */}
            <header className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4 md:py-auto bg-white border-b border-gray-100 shadow-sm md:h-[84px]">
              <SidebarTrigger />
              {/* Add whatever you want here */}
              <div className="flex flex-row items-center gap-7">

                <Avatar className="shrink-0 size-9">
            
                  <AvatarFallback>
                    {getInitials(admin?.username)}
                  </AvatarFallback>
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
