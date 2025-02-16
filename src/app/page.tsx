"use client";

import React from "react";

import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

export default function Home() {
  const router = useRouter();

  // redirect("/dashboard");
  router.push("/auth/login");
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <LoaderCircle className="mr-2 size-4 animate-spin" />
      <p className="text-black font-medium text-md">Getting User Status ...</p>
    </div>
  );
}
