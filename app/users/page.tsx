import React  from "react";
import PageTitle from "@/components/ui/PageTitle";
import { DataTableDemo } from "@/components/ui/dataTable";


type Props = {}

export default function UsersPage({} : Props){
    return ( <div className="flex flex-col gap-5 w-full">
    <PageTitle title="Active Users"/>
    <DataTableDemo />
  </div> )
}