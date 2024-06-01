"use client";
import React, { useEffect, useState, useMemo } from "react";
import { ImageLoaderProps } from "next/image";

import Image from "next/image";

import axios from "axios";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";

export default function Cell({ row }: { row: any }) {
  const [showAlert, setShowAlert] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const [currentDeployment, setCurrentDeployment] = useState<String>("");
  const [currentZone, setCurrentZone] = useState<String>("");
  const [stationType, setStationType] = useState<String>("");

  type ImageLoader = (p: ImageLoaderProps) => string;

  const customLoader: ImageLoader = ({ src, width, quality }) => {
    return `https://api.dicebear.com/8.x/lorelei/svg?seed=${src}&w=${width}&q=${
      quality || 100
    }`;
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchCardDetails = (row: number) => {
    axios
      .get(`${API_URL}/get_current_deployment?casper=${row}`)
      .then((response) => {
        const data = response.data;
        const station = data.station?.station;
        const zone = data.station?.zone;
        const type = data.station?.type;
        if (station) {
          setCurrentDeployment(station);
          setCurrentZone(zone);
          setStationType(type);
        } else {
          setCurrentDeployment("Deployment Not Found");
        }
      })
      .catch((error) => {
        console.error("Error fetching card details:", error);
        setCurrentDeployment("NA");
        setCurrentZone("NA");
        setStationType("NA");
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
      <AlertDialog open={showAlert.isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{showAlert.title}</AlertDialogTitle>
          </AlertDialogHeader>
          <figure className="rounded-xl p-8 ">
            <Image
              className="w-24 h-24 rounded-full mx-auto"
              src={row.getValue("name")}
              loader={customLoader}
              alt="user image"
              width={100}
              quality={100}
              height={100}
            />
            <div className="pt-6 space-y-4">
              <blockquote>
                <p className="text-lg font-medium">
                  Name: {row.original.name}
                  <br></br>
                  Current Deployment: {currentDeployment}
                  <br></br>
                  Current Zone: {currentZone}
                  <br></br>
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
}
