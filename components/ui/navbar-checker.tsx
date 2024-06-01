"use client";

import SideNavBar from "@/components/ui/SideNavBar";
import { useMediaQuery } from "usehooks-ts";

import MobileSideBar from "./mobileSideBar";

const ClientSideLayout = ({ children }: { children: React.ReactNode }) => {
  const isDesktop = useMediaQuery("(min-width: 640px)" , {
    initializeWithValue: false,
  });


  return (
    <div className="w-full flex">
      {isDesktop ? <SideNavBar /> : <MobileSideBar/>}
      <div className="p-2 w-full">{children}</div>
    </div>
  );
};

export default ClientSideLayout;
