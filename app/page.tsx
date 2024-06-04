"use client";
import React, { useState, ReactNode } from "react";
import PageTitle from "@/components/ui/PageTitle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ModeToggle } from "@/components/ui/theme-button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { DeploymentDataTable } from "@/components/ui/deployment-table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { StationDataTable } from "@/components/ui/station-wise-table";
import { title } from "process";

import { CardTable } from "@/components/ui/card-table";

import BarCharComponent from "@/components/ui/bar-chart";
import BarChartComponent from "@/components/ui/bar-chart";


export default function Home() {
  const [date, setDate] = useState<Date>();
  const [overView, setOverView] = useState<any>({});
  const [shift, setShift] = useState<string>("");
  const [apiUrl, setApiUrl] = useState<string>("");
  const [showAlert, setShowAlert] = useState({
    isOpen: false,
    title: "",
    message: "",
    content: undefined as ReactNode,
  });
  const [stationView, setStationView] = useState<any>({});

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const formattedDate = date ? format(date, "yyyy-MM-dd") : null;

  const fetchDeployment = async () => {
    if (date && shift) {
      const url = `${API_URL}/get_deployment?date=${formattedDate}&shift=${shift}`;
      setApiUrl(url); // Update apiUrl state

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setOverView(data.overview);
        setStationView(data.stations_wise);
        console.log("", data.stations_wise);
      } catch (error) {
        console.error("Error fetching zones:", error);
        setShowAlert({
          isOpen: true,
          title: "Deployment Not Found",
          message: `Deployment Not Found For:  ${shift} Shift ${formattedDate}`,
          content: "",
        });
      }
    } else {
      console.error("Date and shift must be selected");
    }
  };

  const handleShiftChange = (value: string) => {
    setShift(value);
  };

  const handleDeleteSuccess = () => {
    console.log("Updated Deployment Numbers");
    fetchDeployment();
  };

  const primaryCount = overView?.type?.Primary || 0;
  const secondaryCount = overView?.type?.Secondary || 0;
  const gridCount = overView?.type?.Grid || 0;
  const trolleyMovementCount = overView?.type?.tm || 0;
  const supCount = overView?.type?.sup || 0;

  return (
    <>
   
      <div className="flex-1 space-y-4 p-6 pt-5 pl-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight"></h2>
          <div className="flex items-center space-x-2">
            <ModeToggle></ModeToggle>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    style={{ width: "10rem" }}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Select Date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div style={{ width: "10rem" }}>
              <Select onValueChange={handleShiftChange}>
                <SelectTrigger id="shift">
                  <SelectValue placeholder="Shift" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="Morning">Morning</SelectItem>
                  <SelectItem value="Evening">Evening</SelectItem>
                  <SelectItem value="Night">Night</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={fetchDeployment}>Get Deployment</Button>
          </div>
        </div>
      </div>

      <div className="card-container">

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6 pt-2 p-5">
        <div
          onClick={() =>
            setShowAlert({
              isOpen: true,
              title: "Total WF",
              message: "",
              content: <CardTable apiUrl={apiUrl} type=""></CardTable>,
            })
          }
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total WF</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {primaryCount +
                  supCount +
                  secondaryCount +
                  trolleyMovementCount +
                  gridCount}
              </div>
              <p className="text-xs text-muted-foreground"></p>
            </CardContent>
          </Card>
        </div>
        <div
          onClick={() =>
            setShowAlert({
              isOpen: true,
              title: "Total WF",
              message: "",
              content: <CardTable apiUrl={apiUrl} type="Primary"></CardTable>,
            })
          }
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Primary</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold"> {primaryCount}</div>
              <p className="text-xs text-muted-foreground"></p>
            </CardContent>
          </Card>
        </div>
        <div
          onClick={() =>
            setShowAlert({
              isOpen: true,
              title: "Total WF",
              message: "",
              content: <CardTable apiUrl={apiUrl} type="Secondary"></CardTable>,
            })
          }
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Secondary</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{secondaryCount}</div>
              <p className="text-xs text-muted-foreground"></p>
            </CardContent>
          </Card>
        </div>
        <div
          onClick={() =>
            setShowAlert({
              isOpen: true,
              title: "Total WF",
              message: "",
              content: <CardTable apiUrl={apiUrl} type="Grid"></CardTable>,
            })
          }
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Grid</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{gridCount}</div>
              <p className="text-xs text-muted-foreground"></p>
            </CardContent>
          </Card>
        </div>
        <div
          onClick={() =>
            setShowAlert({
              isOpen: true,
              title: "Total WF",
              message: "",
              content: <CardTable apiUrl={apiUrl} type="tm"></CardTable>,
            })
          }
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Trolley Movement
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trolleyMovementCount}</div>
              <p className="text-xs text-muted-foreground"></p>
            </CardContent>
          </Card>
        </div>
        <div
          onClick={() =>
            setShowAlert({
              isOpen: true,
              title: "Total WF",
              message: "",
              content: <CardTable apiUrl={apiUrl} type="sup"></CardTable>,
            })
          }
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SUP/SME</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{supCount}</div>
              <p className="text-xs text-muted-foreground"></p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 pt-3 p-5">
        <Card className="col-span-7 md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle>Data</CardTitle>
            {shift && formattedDate && (
              <CardDescription>
                {" "}
                Date: {formattedDate} Shift: {shift}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="pl-2">
            <DeploymentDataTable
              apiUrl={apiUrl}
              onUpdateDeployment={handleDeleteSuccess}
            />
          </CardContent>
        </Card>
        <Card className="col-span-7 md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Stations</CardTitle>
            <CardDescription>Station Wise Deployment</CardDescription>
          </CardHeader>
          <CardContent>
            <StationDataTable apiUrl={apiUrl} />
          </CardContent>
        </Card>
      
      </div>
      </div>

      <AlertDialog open={showAlert.isOpen}>
        <AlertDialogContent style={{ width: "800px", maxWidth: "90%" }}>
          <AlertDialogHeader>
            <AlertDialogTitle>{showAlert.title}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>{showAlert.message}</AlertDialogDescription>
          {showAlert.content}
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowAlert({ ...showAlert, isOpen: false })}
            >
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
