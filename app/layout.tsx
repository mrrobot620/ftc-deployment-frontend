import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "../lib/utils";
import SideNavBar from "@/components/ui/SideNavBar";
import { ThemeProvider } from "@/components/ui/theme-provider";
import ClientSideLayout from "@/components/ui/navbar-checker"; 
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Deployment Manager",
  description: "All in one Solution for Deployment",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn("min-h-screen w-full flex", inter.className, {
          "debug-screens": process.env.NODE_ENV === "development",
        })}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
            <ClientSideLayout>
            {children}
          </ClientSideLayout>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
