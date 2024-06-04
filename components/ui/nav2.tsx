"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { usePathname } from "next/navigation";

import { SheetClose } from "@/components/ui/sheet"

interface NavProps {
  links: {
    title: string;
    label?: string;
    icon: LucideIcon;
    variant: "default" | "ghost";
    href: string;
  }[];
}

export function Nav2({ links }: NavProps) {
  const pathname = usePathname();
  return (
    <TooltipProvider>
       
      <div
        className="group flex flex-col gap-10 py-6 data-[collapsed=true]:py-6"
      >
         
        <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center pr-6 group-[[data-collapsed=true]]:px-2">
     
          {links.map((link, index) =>
             (
                
                <Link
                  href={link.href}
                  key = {link.href}
                  className={cn(
                    buttonVariants({
                      variant: link.href === pathname ? "default" : "ghost",
                      size: "sm",
                    }),
                    link.variant === "default" &&
                      "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                    "justify-start"
                  )}
                >
              
                  <link.icon className="mr-2 h-4 w-4" />
                  <SheetClose>
                  {link.title }
                  {link.label && (
                    <span
                      className={cn(
                        "ml-auto",
                        link.variant === "default" &&
                          "text-background dark:text-white"
                      )}
                    >
                      {link.label}
                    </span>
                  )}
                  </SheetClose>
                </Link>
            )
          )}
        </nav>
      </div>
    </TooltipProvider>
  );
}
