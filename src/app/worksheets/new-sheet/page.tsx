import { Metadata } from "next";
import NewSheetClient from "./page.client";

export const metadata: Metadata = {
  title: "Add New Sheet",
  description: "Admin Dashboard",
};

const NewSheetServer = () => {
  return <NewSheetClient />;
};

export default NewSheetServer;
