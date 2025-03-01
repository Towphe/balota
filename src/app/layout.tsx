import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AppSidebar } from "@/components/AppSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Balota",
  description: "Balota generator for the 2025 Midterm Philippine Elections",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
          <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
            <header className="min-w-[calc(100vw-16rem)] max-w-screen px-2 py-4 flex justify-between items-center">
              <SidebarTrigger />
              <h1 className="!text-xl">Balota</h1>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="!bg-yellow-500 !rounded-md">
                    Donate
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-11/12 md:w-full">
                  <DialogHeader>
                    <DialogTitle>Buy me a coffee!</DialogTitle>
                    <div className="w-full flex flex-col md:flex-row items-center space-between">
                      <img src="/tope-gcash.png" className="w-[12rem]" alt="Tope's GCash QR Code" />
                      <div>
                        <h3 className="font-semibold">GCash Account Info</h3>
                        <p>Name: CH********R JA**S C.</p>
                        <p>Mobile No.: 096*****469</p>
                        <p>User ID: ***********3GV0T4</p>
                      </div>
                    </div>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </header>
            <main>
              {/* main */}
              {children}
            </main>
            <footer className="px-4 pb-3">
              {/* footer */}
              <p className="text-xs opacity-60">Balota.io, by Tope, All rights reserved</p>
            </footer>
          </div>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
