"use client";
import React, { useState, useEffect } from "react";
import PageTitle from "@/components/ui/PageTitle";
import { Button } from "@/components/ui/button";
import MultipleSelector, { Option } from "@/components/ui/MultipleSelect";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";


import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogDescription
} from "@/components/ui/alert-dialog";


import { captureRejectionSymbol } from "events";

type Props = {};

interface Station {
  id: number;
  station: string;
  type: string;
  zone: string;
}

interface Casper {
  casper_id: string;
  id: String;
  name: string;
  search: string;
}

export default function UsersPage({ }: Props) {
  const [date, setDate] = useState<Date>();
  const [zones, setZones] = useState<string[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [selectedStation, setSelectedStation] = useState<string>("");
  const [casperOptions, setCasperOptions] = useState<Option[]>([]);
  const [caspers, setCaspers] = useState<string[]>([]);
  const [shift, setShift] = useState("");
  const [selectorKey, setSelectorKey] = useState(0);

  const [showAlert, setShowAlert] = useState({ isOpen: false, title: "", message: "" });



  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await fetch("http://localhost:8000/get_zone");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setZones(data);
      } catch (error) {
        console.error("Error fetching zones:", error);
      }
    };

    fetchZones();
  }, []);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        if (!selectedZone) return;
        const response = await fetch(
          `http://localhost:8000/get_zonewise_station?zone=${selectedZone}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setStations(data);
      } catch (error) {
        console.error("Error fetching stations:", error);
      }
    };

    fetchStations();
  }, [selectedZone]);

  useEffect(() => {
    const fetchCaspers = async () => {
      try {
        const response = await fetch("http://localhost:8000/get_all_caspers");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Casper[] = await response.json();
        const options = data.map((casper) => ({
          label: `${casper.name} (${casper.casper_id})`,
          value: casper.casper_id,
          id: casper.id,
          name: casper.name
        }));
        console.log(options)
        setCasperOptions(options);
      } catch (error) {
        console.error("Error fetching caspers:", error);
      }
    };

    fetchCaspers();
  }, []);

  const handleZoneChange = (value: string) => {
    setSelectedZone(value);
  };

  const handleStationChange = (value: string) => {
    setSelectedStation(value);
  };

  const handleShiftChange = (value: string) => {
    setShift(value);
  };

  const handleCaspersChange = (selectedOptions: Option[]) => {
    setCaspers(selectedOptions.map(option => option.id));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      casper_ids: caspers,
      date: date ? format(date, "yyyy-MM-dd") : "",
      shift: shift,
      station_id: selectedStation
    };

    try {
      const response = await fetch("http://localhost:8000/add_deployment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();

        // Constructing the message
        const deployedNames = result.Deployed.map(casperId => {
          const casper = casperOptions.find(option => option.id === casperId);
          return casper ? casper.label : `ID: ${casperId}`;
        }).join(", ");

        const alreadyDeployedNames = result["Already Deployed"].map(casperId => {
          const casper = casperOptions.find(option => option.id === casperId);
          return casper ? casper.label : `ID: ${casperId}`;
        }).join(", ");

        const message = `
          ${deployedNames ? `Deployed: ${deployedNames}` : ""}
          ${alreadyDeployedNames ? `Already Deployed: ${alreadyDeployedNames}` : ""}
        `;

        setCaspers([]);
        setSelectorKey(prevKey => prevKey + 1);
        setSelectedStation("");
        setShowAlert({ isOpen: true, title: "Deployment Added Sucessfully", message: message.trim() });
      } else if (response.status === 400) { 
        const data = await response.json()
        const m = data["Error"]
        setShowAlert({ isOpen: true, title: "Error in Adding Deployment", message:`Error: ${m}`  });

      } 
      else { 
        console.error("Failed to add deployment");
      }
    } catch (error) {
      console.error("Error adding deployment:", error);
    }


  };

  return (
    <>
      <PageTitle title="Deployment Page" />
      <div className="min-h-screen flex flex-col items-center pt-10 gap-5">
        <div className="flex flex-col items-center w-full">
          <Card className="w-[500px]">
            <CardHeader>
              <CardTitle>Deployment</CardTitle>
              <CardDescription>
                Please Enter the Deployment Details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="datePicker">Select Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
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

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="shift">Shift</Label>
                    <Select onValueChange={handleShiftChange}>
                      <SelectTrigger id="shift">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="Morning">Morning</SelectItem>
                        <SelectItem value="Evening">Evening</SelectItem>
                        <SelectItem value="Night">Night</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="zone">Zone</Label>
                    <Select
                      value={selectedZone}
                      onValueChange={handleZoneChange}
                    >
                      <SelectTrigger id="zone">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {zones.map((zone) => (
                          <SelectItem key={zone} value={zone}>
                            {zone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="station">Station</Label>
                    <Select
                      value={selectedStation}
                      onValueChange={handleStationChange}
                    >
                      <SelectTrigger id="station">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {stations.map((station) => (
                          <SelectItem
                            key={station.id}
                            value={station.id.toString()}
                          >
                            {station.station}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="caspers">Casper</Label>
                    <MultipleSelector
                     key={selectorKey}
                      options={casperOptions}
                      placeholder="Select Caspers"
                      onChange={handleCaspersChange}
                      emptyIndicator={
                        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                          Casper ID not found
                        </p>
                      }
                      customFilter={(option, searchText) => {
                        return (
                          option.value.toLowerCase().includes(searchText.toLowerCase()) ||                           
                          option.label.toLowerCase().includes(searchText.toLowerCase()) 

                        );
                      }}
                      customRenderOption={(option) => (
                        <div className="flex justify-between">
                          <span>{option.label}</span>
                          <span className="text-gray-500">{option.value}</span>
                        </div>
                      )}
                    />
                  </div>
                </div>
                <CardFooter className="flex justify-between pt-8">
                  <Button type="submit">Add Deployment</Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog
        open={showAlert.isOpen}
        onDismiss={() => setShowAlert({ ...showAlert, isOpen: false })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{showAlert.title}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>{showAlert.message}</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowAlert({ ...showAlert, isOpen: false })}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
