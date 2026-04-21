"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { COLORS } from "@/constants/Theme";
import { AiOutlineBank } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "../ui/avatar";
import { PiSignOutLight } from "react-icons/pi";
import {
  IoSettingsOutline,
  IoTrendingUpSharp,
  IoWalletOutline,
} from "react-icons/io5";
import {
  LuArrowRightLeft,
  LuCreditCard,
  LuLayoutDashboard,
} from "react-icons/lu";
import { MdChevronRight } from "react-icons/md";
import { RiArrowUpDownLine, RiCustomerService2Line } from "react-icons/ri";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { userLogout } from "@/store/slices/userAuthSlice";

const navItems = [
  { href: "/dashboard", icon: LuLayoutDashboard, label: "Overview" },
  { href: "/dashboard/transfer", icon: RiArrowUpDownLine, label: "Transfer" },
  { href: "/dashboard/history", icon: LuArrowRightLeft, label: "History" },
  { href: "/dashboard/cards", icon: LuCreditCard, label: "Cards" },
  {
    href: "/dashboard/investments",
    icon: IoTrendingUpSharp,
    label: "Investments",
  },
  { href: "/dashboard/settings", icon: IoSettingsOutline, label: "Settings" },
  // {
  //   href: "/dashboard/support",
  //   icon: RiCustomerService2Line,
  //   label: "Support",
  // },
];

export function AppSidebar() {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();

  const dispatch = useDispatch<any>();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user?.user ?? null);

  console.log(user);

  const handleLogout = () => {
    dispatch(userLogout());

    // optional: clear persisted redux (if using redux-persist)
    localStorage.removeItem("persist:root");

    router.push("/signin");
  };

  const getInitials = (name?: string) => {
    if (!name) return "NA";

    const parts = name.trim().split(" ");

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
  };
  return (
    <Sidebar
      collapsible="icon"
      className=" group-data-[collapsible=icon]:w-15 z-50"
    >
      <SidebarHeader className="bg-white">
        <div className="px-5 pt-5  group-data-[collapsible=icon]:px-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                style={{ backgroundColor: COLORS.primaryBlue }}
              >
                <AiOutlineBank size={20} color="white" />
              </div>
              {/* Hide text when collapsed — the sidebar handles this via group-data */}
              <h1
                style={{ color: COLORS.primaryBlack }}
                className="text-xl font-bold group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:size-6"
              >
                Silver<span style={{ color: COLORS.primaryBlue }}>Capital</span>
              </h1>
            </div>
            <IoMdClose
              size={20}
              className="text-gray-500 md:hidden group-data-[collapsible=icon]:hidden"
              onClick={toggleSidebar}
            />
          </div>
        </div>
      </SidebarHeader>
      <hr className="mt-4" />
      <SidebarContent className="mx-2 bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="font-bold tracking-wider text-gray-400 group-data-[collapsible=icon]:hidden">
            MAIN MENU
          </SidebarGroupLabel>

          <SidebarMenu>
            {navItems.map(({ href, icon: Icon, label }) => {
              const isActive = pathname === href;
              return (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    tooltip={label}
                    className={`px-3 py-6 font-semibold flex flex-row justify-between transition-colors group-data-[collapsible=icon]:px-0 ${
                      isActive
                        ? "!bg-[#155DFC] !text-white hover:!bg-[#155DFC] hover:!text-white"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    <Link
                      href={href}
                      onClick={() => {
                        // close sidebar on mobile after navigation
                        if (window.innerWidth < 768) {
                          toggleSidebar();
                        }
                      }}
                      className="flex items-center justify-between w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mb-5"
                    >
                      <div className="flex flex-row items-center gap-3">
                        <Icon className="size-5 shrink-0 group-data-[collapsible=icon]:size-5" />
                        <span className="group-data-[collapsible=icon]:hidden">
                          {label}
                        </span>
                      </div>
                      {isActive && (
                        <MdChevronRight className="group-data-[collapsible=icon]:hidden" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-5 pb-5 bg-white">
        <SidebarMenu className="flex flex-col gap-5">
          <SidebarMenuItem className="flex flex-row gap-5 items-center group-data-[collapsible=icon]:justify-center">
            <Avatar size="lg" className="shrink-0">
              <AvatarImage src={user?.image} alt="@shadcn" />
              <AvatarFallback> {getInitials(user?.name)}</AvatarFallback>
              <AvatarBadge className="bg-green-600" />
            </Avatar>
            <div className="group-data-[collapsible=icon]:hidden">
              <h2 className="font-semibold">{user?.name}</h2>
              <p className="text-[12px] text-gray-500">Premium user</p>
            </div>
          </SidebarMenuItem>

          <SidebarMenuItem className="group-data-[collapsible=icon]:hidden items-center px-5 py-3 font-semibold text-white bg-red-500/70 rounded-xl cursor-pointer">
            <div
              className="flex flex-row items-center justify-center gap-5 text-center"
              onClick={handleLogout}
            >
              <PiSignOutLight size={20} />
              <h2 className="font-bold text-md">Sign Out</h2>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail /> {/* ← this adds the drag handle to collapse/expand */}
    </Sidebar>
  );
}
