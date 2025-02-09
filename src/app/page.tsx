"use client";

import React from "react";

import { redirect, useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // redirect("/dashboard");
  router.push("/login");
  return <>Coming Soon</>;
}
