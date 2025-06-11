import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import { NavigationItem } from "../../../types/index";
import { navigation } from "../../../data/navigation";
import Icon from "../../ui/Icon";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href)
        ? prev.filter((item) => item !== href)
        : [...prev, href]
    );
  };

  const isActive = (href: string) => {
    return (
      location.pathname === href || location.pathname.startsWith(href + "/")
    );
  };

  const isExpanded = (href: string) => {
    return expandedItems.includes(href);
  };

  const renderNavItem = (item: NavigationItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const active = isActive(item.href);
    const expanded = isExpanded(item.href);

    return (
      <div key={item.href}>
        <div
          className={clsx(
            "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
            active
              ? "bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100"
              : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700",
            depth > 0 && "ml-6"
          )}
        >
          {hasChildren ? (
            <button
              onClick={() => toggleExpanded(item.href)}
              className="flex items-center w-full text-left"
            >
              <Icon
                name={item.icon}
                className={clsx(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  active
                    ? "text-primary-500 dark:text-primary-400"
                    : "text-gray-400 group-hover:text-gray-500"
                )}
              />
              {item.name}
              <Icon
                name={expanded ? "chevron-up" : "chevron-down"}
                className="ml-auto h-4 w-4"
              />
            </button>
          ) : (
            <Link
              to={item.href}
              onClick={onClose}
              className="flex items-center w-full"
            >
              <Icon
                name={item.icon}
                className={clsx(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  active
                    ? "text-primary-500 dark:text-primary-400"
                    : "text-gray-400 group-hover:text-gray-500"
                )}
              />
              {item.name}
            </Link>
          )}
        </div>

        {hasChildren && expanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => renderNavItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Icon
                  name="building"
                  size="lg"
                  className="text-primary-600 dark:text-primary-400"
                />
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  CMS Dashboard
                </h1>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => renderNavItem(item))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              CMS Dashboard v1.0.0
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
