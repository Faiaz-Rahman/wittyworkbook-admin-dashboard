"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { imageAsssetCollection } from "@/constants/dummy-data";
import Image from "next/image";

export default function ByGradeSheets() {
  return (
    <div className="flex flex-col">
      <Tabs defaultValue="overview" className="space-y-4 w-full">
        <TabsList className="px-1">
          <TabsTrigger value="kindergarten" className="">
            Kindergarten
          </TabsTrigger>
          <TabsTrigger value="grade-1">Grade-1</TabsTrigger>
          <TabsTrigger value="grade-2">Grade-2</TabsTrigger>
          <TabsTrigger value="grade-3">Grade-3</TabsTrigger>
          <TabsTrigger value="grade-4">Grade-4</TabsTrigger>
          <TabsTrigger value="grade-5">Grade-5</TabsTrigger>
          <TabsTrigger value="grade-6">Grade-6</TabsTrigger>
        </TabsList>
        <TabsContent value="kindergarten" className="space-y-4">
          Kindergarten
        </TabsContent>

        <div className="grid grid-cols-6 gap-y-5">
          {[1, 2, 3, 4, 5, 6, 7].map((item, ind) => {
            return (
              <TabsContent value="grade-1" className="">
                <Card
                  className="h-[200px] w-[150px] flex items-center 
                hover:cursor-pointer"
                  onClick={() => {
                    console.log("@here ... redirect to details page");
                  }}
                >
                  {/* <CardHeader className="bg-red-50">
              <CardTitle className="text-sm font-medium"></CardTitle>
            </CardHeader> */}
                  <CardContent
                    className="flex items-center 
                  justify-center h-full"
                  >
                    <Image
                      height={200}
                      width={150}
                      src={`${imageAsssetCollection[0]}`}
                      alt={"question paper images "}
                      objectFit="contain"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </div>
        <TabsContent value="grade-2" className="space-y-4">
          Grade-2 sheets
        </TabsContent>
        <TabsContent value="grade-3" className="space-y-4">
          Grade-3 sheets
        </TabsContent>
        <TabsContent value="grade-4" className="space-y-4">
          Grade-4 sheets
        </TabsContent>
        <TabsContent value="grade-5" className="space-y-4">
          Grade-5 sheets
        </TabsContent>
        <TabsContent value="grade-6" className="space-y-4">
          Grade-6 sheets
        </TabsContent>
      </Tabs>
    </div>
  );
}
