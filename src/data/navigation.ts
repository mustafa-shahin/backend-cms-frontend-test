import { NavigationItem } from "../types";
import { ROUTES } from "../config/constants";

export const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: ROUTES.DASHBOARD,
    icon: "home",
    iconSolid: "home",
  },
  {
    name: "Content",
    href: ROUTES.PAGES,
    icon: "file-text",
    iconSolid: "file-text",
  },
  {
    name: "Users",
    href: ROUTES.USERS,
    icon: "users",
    iconSolid: "users",
  },
  {
    name: "Company",
    href: ROUTES.COMPANY,
    icon: "building",
    iconSolid: "building",
  },
  {
    name: "Locations",
    href: ROUTES.LOCATIONS,
    icon: "map-pin",
    iconSolid: "map-pin",
  },
  {
    name: "Files",
    href: ROUTES.FILES,
    icon: "folder",
    iconSolid: "folder",
    children: [
      {
        name: "File Manager",
        href: ROUTES.FILES_MANAGER,
        icon: "folder",
        iconSolid: "folder",
      },
      {
        name: "Folders (Admin)",
        href: ROUTES.FILES_FOLDERS,
        icon: "folder",
        iconSolid: "folder",
      },
      {
        name: "Documents",
        href: ROUTES.FILES_DOCUMENTS,
        icon: "file",
        iconSolid: "file",
      },
      {
        name: "Photos",
        href: ROUTES.FILES_PHOTOS,
        icon: "image",
        iconSolid: "image",
      },
      {
        name: "Videos",
        href: ROUTES.FILES_VIDEOS,
        icon: "video",
        iconSolid: "video",
      },
      {
        name: "Audio",
        href: ROUTES.FILES_AUDIO,
        icon: "music",
        iconSolid: "music",
      },
      {
        name: "Archives",
        href: ROUTES.FILES_ARCHIVES,
        icon: "archive",
        iconSolid: "archive",
      },
    ],
  },
  {
    name: "Jobs",
    href: ROUTES.JOBS_TRIGGERS,
    icon: "briefcase",
    iconSolid: "briefcase",
    children: [
      {
        name: "Triggers",
        href: ROUTES.JOBS_TRIGGERS,
        icon: "play",
        iconSolid: "play",
      },
      {
        name: "History",
        href: ROUTES.JOBS_HISTORY,
        icon: "clock",
        iconSolid: "clock",
      },
    ],
  },
];

// Helper function to find navigation item by href
export const findNavigationItem = (href: string): NavigationItem | null => {
  const findInItems = (items: NavigationItem[]): NavigationItem | null => {
    for (const item of items) {
      if (item.href === href) {
        return item;
      }
      if (item.children) {
        const found = findInItems(item.children);
        if (found) return found;
      }
    }
    return null;
  };

  return findInItems(navigation);
};

// Helper function to get breadcrumbs for a given route
export const getBreadcrumbs = (href: string): NavigationItem[] => {
  const breadcrumbs: NavigationItem[] = [];

  const findPath = (
    items: NavigationItem[],
    currentPath: NavigationItem[] = []
  ): boolean => {
    for (const item of items) {
      const newPath = [...currentPath, item];

      if (item.href === href) {
        breadcrumbs.push(...newPath);
        return true;
      }

      if (item.children && findPath(item.children, newPath)) {
        return true;
      }
    }
    return false;
  };

  findPath(navigation);
  return breadcrumbs;
};
