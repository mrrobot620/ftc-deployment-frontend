import React  from "react";
import { ModeToggle } from "@/components/ui/theme-button";

type Props = {}

export default function UsersPage({} : Props){
    return (
       <>
   <div className="flex-1 space-y-4 p-6 pt-5 pl-10">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight "></h2>
          <div className="flex items-center space-x-2">
          <ModeToggle></ModeToggle>
        </div>
      </div>
      </div>
  </>
    )
}