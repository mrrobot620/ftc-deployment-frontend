
"use client"
import React, { useState } from "react";
import { Nav } from "./nav";
type Props = {}

import {
    LayoutDashboard,
    Send,
    Users2, Settings , ChevronRight
  } from "lucide-react"
import { Input } from "postcss";
import { Button } from "../ui/button";
  
export default function SideNavBar({} : Props) {
  const [isCollapsed , setIsCollapsed] = useState(true);

  function toggleSidebar(){
    setIsCollapsed(!isCollapsed)
  }
    return (
        <div className="relative min-w-[80px] border-r px-3 pb-3 pt-20">
          <div className="absolute right-[-20px] top-7">
          <Button onClick={toggleSidebar} variant="secondary" className="rounded-full p-2">
            <ChevronRight></ChevronRight>
          </Button>
          </div>
             <Nav
            isCollapsed={isCollapsed}
            links={[
              { 
                title: "Dashboard",
                href: "/",
                label: "",
                icon: LayoutDashboard,
                variant: "default",
              },
              {
                title: "Deployment",
                label: "",
                icon: Send,
                variant: "ghost",
                href: "/deployment"
              },
              {
                title: "User",
                label: "",
                icon: Users2,
                variant: "ghost",
                href: "/users"
              },
              {
                title: "Settings",
                label: "",
                icon: Settings,
                variant: 'ghost',
                href: "/set"
              }
            ]}
          />
        </div>
    )
}