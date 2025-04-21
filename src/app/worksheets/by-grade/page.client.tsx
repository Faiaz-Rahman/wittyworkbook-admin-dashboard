"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { imageAsssetCollection } from "@/constants/dummy-data";
import Image from "next/image";
import { LoaderCircle, Pencil } from "lucide-react";
import { useFetch } from "@/hooks/useFetchFb";
import { UpdateWorksheet, updateWorksheetDataType } from "@/components/common/UpdateWorksheet";

export default function ByGradeSheets() {
  const [selectedTab, setSelectedTab] = useState<string>("Kindergarten");
  const grades: Array<string> = ["Kindergarten", "Grade-1", "Grade-2", "Grade-3", "Grade-4", "Grade-5", "Grade-6"];

  const { data, loading } = useFetch(selectedTab);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedForEditing, setSelectedForEditing] = useState<updateWorksheetDataType>();

  // React.useEffect(() => {
  //   console.log("the selected tab is =>", selectedTab);
  // }, [selectedTab]);

  // React.useEffect(() => {
  //   console.log("the data is =>", selectedForEditing);
  // }, [selectedForEditing]);

  return (
    <div className="flex flex-col min-h-screen">
      <Tabs defaultValue="Kindergarten" className="flex flex-col w-full">
        <TabsList className="grid grid-cols-2 mb-3 sm:flex bg-gray-100">
          <TabsTrigger
            value="Kindergarten"
            className=""
            onClick={() => {
              setIsEditing(false);
              setSelectedTab("Kindergarten");
            }}
          >
            Kindergarten
          </TabsTrigger>
          <TabsTrigger
            value="Grade-1"
            onClick={() => {
              setIsEditing(false);

              setSelectedTab("Grade-1");
            }}
          >
            Grade-1
          </TabsTrigger>
          <TabsTrigger
            value="Grade-2"
            onClick={() => {
              setIsEditing(false);

              setSelectedTab("Grade-2");
            }}
          >
            Grade-2
          </TabsTrigger>
          <TabsTrigger
            value="Grade-3"
            onClick={() => {
              setIsEditing(false);

              setSelectedTab("Grade-3");
            }}
          >
            Grade-3
          </TabsTrigger>
          <TabsTrigger
            value="Grade-4"
            onClick={() => {
              setIsEditing(false);

              setSelectedTab("Grade-4");
            }}
          >
            Grade-4
          </TabsTrigger>
          <TabsTrigger
            value="Grade-5"
            onClick={() => {
              setIsEditing(false);
              setSelectedTab("Grade-5");
            }}
          >
            Grade-5
          </TabsTrigger>
          <TabsTrigger
            value="Grade-6"
            onClick={() => {
              setIsEditing(false);
              setSelectedTab("Grade-6");
            }}
          >
            Grade-6
          </TabsTrigger>
        </TabsList>

        {grades.map((_grade_item, _ind) => {
          return (
            <TabsContent value={`${_grade_item}`} className="flex flex-col space-y-4">
              <div
                className="grid grid-cols-1 gap-y-3 gap-x-2 w-full
                    sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
              >
                {data.length > 0 &&
                  !loading &&
                  data.map((item, ind) => {
                    return (
                      <Card
                        key={`tab_content_grade_1${ind}`}
                        className="h-[200px] w-[160px] flex items-center relative
                        hover:cursor-pointer overflow-hidden group/slider transition-all ease-in-out"
                        onClick={() => {
                          setSelectedForEditing((prev) => {
                            return {
                              ...prev,
                              gradeLevel: _grade_item,
                              imageFormik: item.publicUrl,
                              subtitle: item.subtitle,
                              title: item.title,
                              tags: item.tags,
                              topicName: item.topicName,
                              isPaid: item.isPaid,
                            };
                          });

                          setIsEditing(true);
                        }}
                      >
                        {/* <CardHeader className="bg-red-50">
                        <CardTitle className="text-sm font-medium"></CardTitle>
                        </CardHeader> */}
                        <CardContent
                          className="flex items-center 
                          justify-center h-full w-full"
                        >
                          <Image
                            src={`${item.publicUrl}`}
                            alt={"question paper images "}
                            fill
                            className="h-full w-full object-cover"
                          />

                          <div
                            className="w-full h-full bg-[rgba(169,169,169,.5)] absolute top-full flex 
                            items-center justify-center group-hover/slider:top-0 transition-all ease-out gap-x-2"
                            onClick={() => {
                              console.log("edit me!!");
                            }}
                          >
                            <Pencil className="h-[1.2rem] w-[1.2rem]" />
                            <span>Edit</span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
              {loading && (
                <div className="w-full flex justify-center h-10 items-center">
                  <LoaderCircle className="h-[2rem] w-[2rem] animate-spin" />
                </div>
              )}

              {!loading && data.length === 0 && (
                <div className="w-full h-10 flex items-center justify-center">No worksheets here! ...</div>
              )}

              {isEditing && selectedForEditing && <UpdateWorksheet worksheetData={selectedForEditing} />}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
