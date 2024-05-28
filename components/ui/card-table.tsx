"use client";
import React, { useState, useEffect } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
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

export type Deployment = {
  id: string;
  casper: string;
  name: string;
  department: string;
  shift: string;
  type: string;
  station: string;
};

type DeploymentDataTableProps = {
  apiUrl: string;
  type: string;
};

export function CardTable ({ apiUrl , type }: DeploymentDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<Deployment[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const fetchDeployment = async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();

      const transformedData = result.data
      .map((item: any) => ({
        id: item.id.toString(),
        casper: item.casper.casper_id,
        department: item.casper.department,
        shift: item.shift,
        name: item.casper.name,
        type: item.station.type,
        station: item.station.station,
      }))
      .filter((item: Deployment) => type === "" || item.type === type);

    setData(transformedData);
    console.log(transformedData);

      
      setData(transformedData);
      console.log(transformedData);
    } catch (error) {
      console.error("Error fetching deployment data:", error);
    }
  };

  useEffect(() => {
    fetchDeployment();
  }, [apiUrl]);





  const columns: ColumnDef<Deployment>[] = [
    {
      accessorKey: "casper",
      header: "Casper",
      cell: ({ row }) => <div>{row.getValue("casper")}</div>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "department",
      header: () => <div className="text-right">Department</div>,
      cell: ({ row }) => (
        <div className="text-right">{row.getValue("department")}</div>
      ),
    },
    {
      accessorKey: "shift",
      header: () => <div className="text-right">Shift</div>,
      cell: ({ row }) => <div className="text-right">{row.getValue("shift")}</div>,
    },
    {
      accessorKey: "type",
      header: () => <div className="text-right">Type</div>,
      cell: ({ row }) => <div className="text-right">{row.getValue("type")}</div>,
    },
    {
      accessorKey: "station",
      header: () => <div className="text-right">Station</div>,
      cell: ({ row }) => <div className="text-right">{row.getValue("station")}</div>,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter Casper"
          value={(table.getColumn("casper")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("casper")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
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
  );
}
