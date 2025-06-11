import { NavigationItem } from "../types";

export const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "home",
    iconSolid: "home",
  },
  {
    name: "Pages",
    href: "/dashboard/pages",
    icon: "file-text",
    iconSolid: "file-text",
  },
  {
    name: "Users",
    href: "/dashboard/users",
    icon: "users",
    iconSolid: "users",
  },
  {
    name: "Company",
    href: "/dashboard/company",
    icon: "building",
    iconSolid: "building",
  },
  {
    name: "Locations",
    href: "/dashboard/locations",
    icon: "map-pin",
    iconSolid: "map-pin",
  },
  {
    name: "Files",
    href: "/dashboard/files",
    icon: "folder",
    iconSolid: "folder",
    children: [
      {
        name: "All Files",
        href: "/dashboard/files",
        icon: "folder",
        iconSolid: "folder",
      },
      {
        name: "Folders",
        href: "/dashboard/files/folders",
        icon: "folder",
        iconSolid: "folder",
      },
      {
        name: "Documents",
        href: "/dashboard/files/documents",
        icon: "file",
        iconSolid: "file",
      },
      {
        name: "Photos",
        href: "/dashboard/files/photos",
        icon: "image",
        iconSolid: "image",
      },
      {
        name: "Videos",
        href: "/dashboard/files/videos",
        icon: "video",
        iconSolid: "video",
      },
      {
        name: "Audio",
        href: "/dashboard/files/audio",
        icon: "music",
        iconSolid: "music",
      },
      {
        name: "Archives",
        href: "/dashboard/files/archives",
        icon: "archive",
        iconSolid: "archive",
      },
    ],
  },
  {
    name: "Jobs",
    href: "/dashboard/jobs",
    icon: "briefcase",
    iconSolid: "briefcase",
    children: [
      {
        name: "Triggers",
        href: "/dashboard/jobs/triggers",
        icon: "play",
        iconSolid: "play",
      },
      {
        name: "Jobs History",
        href: "/dashboard/jobs/history",
        icon: "clock",
        iconSolid: "clock",
      },
    ],
  },
];
