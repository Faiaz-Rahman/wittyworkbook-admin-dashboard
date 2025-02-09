import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AllSheets() {
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

        <TabsContent value="grade-1" className="space-y-4">
          Grade-1 sheets
        </TabsContent>
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
