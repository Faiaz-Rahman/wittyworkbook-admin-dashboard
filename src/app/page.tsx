"use client";

import React from "react";

import { redirect, useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // redirect("/dashboard");
  router.push("/auth/login");
  return <>Coming Soon</>;
}
