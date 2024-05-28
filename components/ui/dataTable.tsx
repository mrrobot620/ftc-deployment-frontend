// DataTableDemo.tsx
"use client";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

export type Casper = {
  id: number;
  casper_id: string;
  name: string;
  designation: string;
  department: string;
};

export const columns: ColumnDef<Casper>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 items-center">
          <img
            className="h-10 w-10"
            src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${row.getValue(
              "name"
            )}`}
            alt="user image"
          />
          <p>{row.getValue("name")}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "casper_id",
    header: "Casper ID",
  },
  {
    accessorKey: "designation",
    header: "Designation",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "button",
    header: "Details",
    cell: ({ row }) => {
      const [showAlert, setShowAlert] = useState({
        isOpen: false,
        title: "",
        message: "",
      });

      const [currentDeployment , setCurrentDeployment] = useState<String>("");
      const [currentZone , setCurrentZone] = useState<String>("");
      const [stationType , setStationType] = useState<String>("");
      const fetchCardDetails = (id: number) => {
        axios
          .get(`http://localhost:8000/get_current_deployment?casper=${id}`)
          .then((response) => {
            const data = response.data;
            const station = data.station?.station;
            const zone = data.station?.zone;
            const type = data.station?.type;
            if (station) {
              setCurrentDeployment(station);
              setCurrentZone(zone)
              setStationType(type);
            } else {
              setCurrentDeployment("Deployment Not Found");

            }
          })
          .catch((error) => {
            console.error("Error fetching card details:", error);
            setCurrentDeployment("NA");
            setCurrentZone("NA")
            setStationType("NA")
          });
      };

      
      return (
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchCardDetails(row.original.id);
              setShowAlert({
                isOpen: true,
                title: "Details",
                message: "Hi I am Here",
              });
            }}
          >
           
            Get
          </Button>
          <AlertDialog
            open={showAlert.isOpen}
            onDismiss={() => setShowAlert({ ...showAlert, isOpen: false })}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{showAlert.title}</AlertDialogTitle>
              </AlertDialogHeader>
            <figure className="rounded-xl p-8 ">
  <img className="w-24 h-24 rounded-full mx-auto" src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${row.getValue(
              "name"
            )}`} alt="" width="384" height="512"/>
  <div className="pt-6 space-y-4">
    <blockquote>
      <p className="text-lg font-medium">
      Name: {row.original.name}<br>
              </br>
                 Current Deployment: {currentDeployment}<br>
                </br>
                Current Zone: {currentZone}<br>
              </br>
              Station Type: {stationType}
      </p>
    </blockquote>
  </div>
</figure>
          
              <AlertDialogFooter>
                <AlertDialogAction
                  onClick={() => setShowAlert({ ...showAlert, isOpen: false })}
                >
                  Close
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];

export function DataTableDemo() {
  const [data, setData] = useState<Casper[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [showAlert, setShowAlert] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  useEffect(() => {
    // Fetch data from Flask API\
    axios
      .get("http://localhost:8000/get_all_caspers")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    return data.filter(
      (item) =>
        item.casper_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.designation.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            placeholder="Search Casper "
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}> 
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
