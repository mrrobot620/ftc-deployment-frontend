"use client";
import React, { useState } from "react";
import PageTitle from "@/components/ui/PageTitle";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {};

export default function UsersPage({}: Props) {
    
  const [date, setDate] = React.useState<Date>();

  return (
    <>
      <PageTitle title="Add Casper" />
      <div className="min-h-screen flex flex-col items-center pt-10 gap-5">
        <div className="flex flex-col items-center w-full">
          <Card className="w-[500px]">
            <CardHeader>
              <CardTitle> Deployment </CardTitle>
              <CardDescription>
                Please Enter the Deployment Details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
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
                          {date ? format(date, "PPP") : <span></span>}
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
                    <Label htmlFor="casperId">Zone</Label>
                    <Input id="casperId" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Station</Label>
                    <Input id="name" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="designation">Casper</Label>
                    <Input id="designation" />
                  </div>
                </div>
                <CardFooter className="flex justify-between pt-8">
                  <Button type="submit">Add</Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
