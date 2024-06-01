import React  from "react";
import PageTitle from "@/components/ui/PageTitle";
import { ModeToggle } from "@/components/ui/theme-button";
type Props = {}

export default function UsersPage({} : Props){
    return (
       <>
        <div className="flex flex-col gap-5 w-full">
    <PageTitle title="Settings"/>
    <ModeToggle></ModeToggle>
  </div> 
  </>
    )
}