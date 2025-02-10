import { File, Inbox, Send, Receipt, KeySquare, LucideIcon, PanelsTopLeft, StickyNote } from "lucide-react";

export interface NavSubItem {
  title: string;
  path: string;
}

export interface NavMainItem {
  title: string;
  path: string;
  icon?: LucideIcon;
  isActive?: boolean;
  subItems?: NavSubItem[];
}

export interface NavGroup {
  id: number;
  label: string;
  items: NavMainItem[];
}

const basePath = "";

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        path: `/dashboard`,
        icon: PanelsTopLeft,
        isActive: true,
      },
    ],
  },
  {
    id: 2,
    label: "Apps & Pages",
    items: [
      {
        title: "Inbox",
        path: `${basePath}/inbox`,
        icon: Inbox,
      },
      {
        title: "Worksheets",
        path: "#",
        icon: StickyNote,
        subItems: [
          { title: "All Sheets", path: `${basePath}/worksheets/all-sheets` },
          { title: "By Grade", path: `${basePath}/worksheets/by-grade` },
          { title: "New Sheet", path: `${basePath}/worksheets/new-sheet` },
          // { title: "", path: `${basePath}/worksheets/` },
        ],
      },
      {
        title: "Auth",
        path: "#",
        icon: KeySquare,
        subItems: [{ title: "Unauthorized", path: `${basePath}/auth/unauthorized` }],
      },
      // {
      //   title: "Drafts",
      //   path: `${basePath}/drafts`,
      //   icon: File,
      // },
      // {
      //   title: "Sent",
      //   path: `${basePath}/sent`,
      //   icon: Send,
      // },
    ],
  },
  {
    id: 3,
    label: "Billing",
    items: [
      {
        title: "Billing",
        path: `${basePath}/billing`,
        icon: Receipt,
      },
    ],
  },
];
