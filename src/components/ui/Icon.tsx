import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faHome,
  faFileText,
  faUsers,
  faBuilding,
  faMapPin,
  faFolder,
  faFile,
  faImage,
  faVideo,
  faMusic,
  faArchive,
  faBriefcase,
  faPlay,
  faClock,
  faMoon,
  faSun,
  faPlus,
  faEdit,
  faTrash,
  faEye,
  faDownload,
  faUpload,
  faSearch,
  faFilter,
  faSort,
  faSortUp,
  faSortDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faChevronDown,
  faTimes,
  faCheck,
  faExclamationTriangle,
  faInfoCircle,
  faSpinner,
  faBars,
  faUser,
  faCog,
  faSignOutAlt,
  faSignInAlt,
  faUserPlus,
  faLock,
  faUnlock,
  faEllipsisV,
  faRefresh,
  faSave,
  faCancel,
  faGlobe,
  faPhone,
  faEnvelope,
  faCalendar,
  faMapMarkerAlt,
  faExternalLinkAlt,
  faFlag,
  faToggleOn,
  faToggleOff,
  faBell, // Added bell icon
} from "@fortawesome/free-solid-svg-icons";

export type IconName =
  | "home"
  | "file-text"
  | "users"
  | "building"
  | "map-pin"
  | "folder"
  | "file"
  | "image"
  | "video"
  | "music"
  | "archive"
  | "briefcase"
  | "play"
  | "clock"
  | "moon"
  | "sun"
  | "plus"
  | "edit"
  | "trash"
  | "eye"
  | "download"
  | "upload"
  | "search"
  | "filter"
  | "sort"
  | "sort-up"
  | "sort-down"
  | "chevron-left"
  | "chevron-right"
  | "chevron-up"
  | "chevron-down"
  | "times"
  | "check"
  | "exclamation-triangle"
  | "info-circle"
  | "spinner"
  | "bars"
  | "user"
  | "cog"
  | "sign-out-alt"
  | "sign-in-alt"
  | "user-plus"
  | "lock"
  | "unlock"
  | "ellipsis-v"
  | "refresh"
  | "save"
  | "cancel"
  | "globe"
  | "phone"
  | "envelope"
  | "calendar"
  | "map-marker-alt"
  | "external-link-alt"
  | "flag"
  | "toggle-on"
  | "toggle-off"
  | "bell"; // Added bell to the type

const iconMap: Record<IconName, IconDefinition> = {
  home: faHome,
  "file-text": faFileText,
  users: faUsers,
  building: faBuilding,
  "map-pin": faMapPin,
  folder: faFolder,
  file: faFile,
  image: faImage,
  video: faVideo,
  music: faMusic,
  archive: faArchive,
  briefcase: faBriefcase,
  play: faPlay,
  clock: faClock,
  moon: faMoon,
  sun: faSun,
  plus: faPlus,
  edit: faEdit,
  trash: faTrash,
  eye: faEye,
  download: faDownload,
  upload: faUpload,
  search: faSearch,
  filter: faFilter,
  sort: faSort,
  "sort-up": faSortUp,
  "sort-down": faSortDown,
  "chevron-left": faChevronLeft,
  "chevron-right": faChevronRight,
  "chevron-up": faChevronUp,
  "chevron-down": faChevronDown,
  times: faTimes,
  check: faCheck,
  "exclamation-triangle": faExclamationTriangle,
  "info-circle": faInfoCircle,
  spinner: faSpinner,
  bars: faBars,
  user: faUser,
  cog: faCog,
  "sign-out-alt": faSignOutAlt,
  "sign-in-alt": faSignInAlt,
  "user-plus": faUserPlus,
  lock: faLock,
  unlock: faUnlock,
  "ellipsis-v": faEllipsisV,
  refresh: faRefresh,
  save: faSave,
  cancel: faCancel,
  globe: faGlobe,
  phone: faPhone,
  envelope: faEnvelope,
  calendar: faCalendar,
  "map-marker-alt": faMapMarkerAlt,
  "external-link-alt": faExternalLinkAlt,
  flag: faFlag,
  "toggle-on": faToggleOn,
  "toggle-off": faToggleOff,
  bell: faBell, // Added bell to the map
};

interface IconProps {
  name: IconName;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  spin?: boolean;
  pulse?: boolean;
  color?: string;
  onClick?: () => void;
}

const sizeMap = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = "md",
  className = "",
  spin = false,
  pulse = false,
  color,
  onClick,
}) => {
  const icon = iconMap[name];

  if (!icon) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  const baseClasses = sizeMap[size];
  const combinedClassName = `${baseClasses} ${className}`;

  return (
    <FontAwesomeIcon
      icon={icon}
      className={combinedClassName}
      spin={spin}
      pulse={pulse}
      style={color ? { color } : undefined}
      onClick={onClick}
    />
  );
};

export default Icon;
