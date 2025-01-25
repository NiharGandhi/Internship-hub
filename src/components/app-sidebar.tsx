"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Command,
  GalleryVerticalEnd,
  Network,
  Home,
  Building,
  BriefcaseBusiness
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"


// This is sample data.
const data = {
  teams: [
    {
      name: "InterVista",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    }
  ],
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: Home,
      isActive: true,
      collapsible: true,
      items: [
        {
          title: "Home",
          url: "/home",
        },
        {
          title: "Events",
          url: "/home/events",
        },
        {
          title: "Resources",
          url: "/home/resources",
        },
      ],
    },
    {
      title: "Users",
      url: "/users",
      icon: Network,
      collapsible: false
    },
    {
      title: "Projects",
      url: "/projects",
      icon: BookOpen,
      collapsible: false
    },
    {
      title: "Organnizations",
      url: "/organizations",
      icon: Building,
      collapsible: false
    },
    {
      title: "Internships",
      url: "/home",
      icon: BriefcaseBusiness,
      isActive: true,
      collapsible: true,
      items: [
        {
          title: "Explore",
          url: "/internships",
        },
        {
          title: "Applied",
          url: "/intern/myInternships",
        },
      ],
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const { user } = useUser();
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
