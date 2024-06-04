import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LayoutDashboard, Send, Users2, Settings, UserPlus } from "lucide-react";
import { Nav2 } from "./nav2";

export default function MobileSideBar() {
  const mobileWidth = false; 
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost" className="fixed top-6 pl-3">
          <Menu size="30" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left">
        <SheetHeader className="flex flex-row justify-between items-center">
          <span>Deployment Manager</span>
        </SheetHeader>
        <Nav2
          links={[
            {
              title: "Dashboard",
              href: "/",
              label: "",
              icon: LayoutDashboard,
              variant: "default",
            },
            {
              title: "Add User",
              label: "",
              icon: UserPlus,
              variant: "ghost",
              href: "/add_user",
            },
            {
              title: "Deployment",
              label: "",
              icon: Send,
              variant: "ghost",
              href: "/deployment",
            },
            {
              title: "User",
              label: "",
              icon: Users2,
              variant: "ghost",
              href: "/users",
            },
            {
              title: "Settings",
              label: "",
              icon: Settings,
              variant: "ghost",
              href: "/set",
            },
          ]}
        />
      </SheetContent>
    </Sheet>
  );
}
