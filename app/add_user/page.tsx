"use client"
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
import { Input } from "@/components/ui/input";
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

export default function AddUser() {
  const [casper, setCasper] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [showAlert, setShowAlert] = useState({ isOpen: false, title: "", message: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      casper: casper,
      name: name,
      department: department,
      designation: designation,
    };

    try {
      const response = await fetch("http://10.244.18.160:8000/add_casper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowAlert({ isOpen: true, title: "User Added Successfully", message: "" });
        setCasper("");
        setName("");
        setDepartment("");
        setDesignation("");
      } else if (response.status === 409) {
        const responseData = await response.json();
        const error = responseData["Error"]
        setShowAlert({ isOpen: true, title: "User Already Exists", message: error });
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <>
      <PageTitle title="Add Casper" />
      <div className="min-h-screen flex flex-col items-center pt-10 gap-5">
        <div className="flex flex-col items-center w-full">
          <Card className="w-[500px]">
            <CardHeader>
              <CardTitle>Add FTC</CardTitle>
              <CardDescription>Please enter the below details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="casperId">Casper ID</Label>
                    <Input id="casperId" value={casper} onChange={(e) => setCasper(e.target.value)} />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="designation">Designation</Label>
                    <Input id="designation" value={designation} onChange={(e) => setDesignation(e.target.value)} />
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
      {/* Alert Dialog */}
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
