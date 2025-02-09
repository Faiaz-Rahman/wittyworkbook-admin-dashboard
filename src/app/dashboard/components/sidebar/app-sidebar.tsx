"use client";

import * as React from "react";

import { AudioWaveform, Command, Frame, GalleryVerticalEnd, Map, PieChart } from "lucide-react";

import { TeamSwitcher } from "@/app/dashboard/components/sidebar/team-switcher";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { sidebarItems } from "@/navigation/sidebar/sidebar-items";

import SidebarFooterMenu from "./sidebar-footer-menu";
import SidebarNavigation from "./sidebar-navigation";
import SidebarProjects from "./sidebar-projects";
import Image from "next/image";

import LogoImage from "@/assets/wittyworkbooks_logo.png";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

// const user = {
//   name: "shadcn",
//   email: "m@example.com",
//   avatar: "",
// };

const user = {
  name: "Admin",
  email: "faiazrahman70@gmail.com",
  avatar: "",
};

const teams = [
  {
    name: "Acme Inc",
    logo: GalleryVerticalEnd,
    plan: "Enterprise",
  },
  {
    name: "Acme Corp.",
    logo: AudioWaveform,
    plan: "Startup",
  },
  {
    name: "Evil Corp.",
    logo: Command,
    plan: "Free",
  },
];

const projects = [
  {
    name: "Design Engineering",
    url: "#",
    icon: Frame,
  },
  {
    name: "Sales & Marketing",
    url: "#",
    icon: PieChart,
  },
  {
    name: "Travel",
    url: "#",
    icon: Map,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user: userStore } = useSelector((state: RootState) => state.auth);

  const userData = {
    name: userStore?.displayName ? userStore?.displayName : "Admin User",
    email: userStore?.email ? userStore?.email : "",
    avatar: "",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="">
        {/* <TeamSwitcher teams={teams} /> */}
        <Image
          height={90}
          width={80}
          alt="logo"
          src={LogoImage}
          style={{
            objectFit: "contain",
          }}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavigation sidebarItems={sidebarItems} />
        {/* <SidebarProjects projects={projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <SidebarFooterMenu user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
