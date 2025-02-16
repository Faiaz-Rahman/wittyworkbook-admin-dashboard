"use client";

import React, { ReactNode } from "react";

import { AppSidebar } from "@/app/dashboard/components/sidebar/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

interface ByGradeSheetsLayoutType {
  readonly children: ReactNode;
}

export default function WorksheetLayout({ children }: ByGradeSheetsLayoutType) {
  const pathName = usePathname();
  var breadcrumbString;

  const pathNameSlice = pathName.split("/");
  if (pathNameSlice[2] != "") {
    const sliceBasedOnDash = pathNameSlice[2].split("-");

    breadcrumbString = sliceBasedOnDash
      .map((_item, _ind) => {
        return _item.charAt(0).toUpperCase() + _item.slice(1);
      })
      .join(" ");
  }

  return (
    <main>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="mx-auto max-w-screen-2xl">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href={`${pathName}`}>{breadcrumbString}</BreadcrumbLink>
                  </BreadcrumbItem>
                  {/* <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem> */}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
