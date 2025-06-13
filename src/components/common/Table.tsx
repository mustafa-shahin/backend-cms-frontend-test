import React, { useState } from "react";
import clsx from "clsx";
import { TableColumn, TableAction } from "../../types/entities";
import Icon from "./Icon";
import Button from "./Button";

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  loading?: boolean;
  emptyMessage?: string;
  selectable?: boolean;
  selectedRows?: T[];
  onSelectionChange?: (selectedRows: T[]) => void;
  sortable?: boolean;
  onSort?: (column: string, direction: "asc" | "desc") => void;
  className?: string;
}

interface SortState {
  column: string | null;
  direction: "asc" | "desc";
}

function Table<T extends { id: number | string }>({
  data = [],
  columns,
  actions = [],
  loading = false,
  emptyMessage = "No data available",
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  sortable = false,
  onSort,
  className,
}: TableProps<T>) {
  const [sortState, setSortState] = useState<SortState>({
    column: null,
    direction: "asc",
  });

  const handleSort = (columnKey: string) => {
    if (!sortable) return;

    const newDirection =
      sortState.column === columnKey && sortState.direction === "asc"
        ? "desc"
        : "asc";

    setSortState({
      column: columnKey,
      direction: newDirection,
    });

    onSort?.(columnKey, newDirection);
  };

  const handleSelectAll = () => {
    if (!onSelectionChange) return;

    if (selectedRows.length === data.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(data);
    }
  };

  const handleSelectRow = (row: T) => {
    if (!onSelectionChange) return;

    const isSelected = selectedRows.some((selected) => selected.id === row.id);
    if (isSelected) {
      onSelectionChange(
        selectedRows.filter((selected) => selected.id !== row.id)
      );
    } else {
      onSelectionChange([...selectedRows, row]);
    }
  };

  const isRowSelected = (row: T) =>
    selectedRows.some((selected) => selected.id === row.id);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Icon name="spinner" size="lg" spin className="text-primary-600" />
      </div>
    );
  }

  const totalColumns =
    columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0);

  return (
    <div
      className={clsx(
        "overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg",
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {selectable && (
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                    checked={
                      selectedRows.length === data.length && data.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </th>
              )}

              {columns.map((column) => (
                <th
                  key={column.key as string}
                  className={clsx(
                    "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider",
                    column.sortable &&
                      sortable &&
                      "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700",
                    column.width && `w-${column.width}`
                  )}
                  onClick={() =>
                    column.sortable && handleSort(column.key as string)
                  }
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && sortable && (
                      <div className="flex flex-col">
                        <Icon
                          name={
                            sortState.column === column.key
                              ? sortState.direction === "asc"
                                ? "sort-up"
                                : "sort-down"
                              : "sort"
                          }
                          size="xs"
                          className={clsx(
                            sortState.column === column.key
                              ? "text-primary-600"
                              : "text-gray-400"
                          )}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}

              {actions.length > 0 && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={totalColumns}
                  className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={row.id}
                  className={clsx(
                    "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                    isRowSelected(row) && "bg-primary-50 dark:bg-primary-900/20"
                  )}
                >
                  {selectable && (
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                        checked={isRowSelected(row)}
                        onChange={() => handleSelectRow(row)}
                      />
                    </td>
                  )}

                  {columns.map((column) => (
                    <td
                      key={column.key as string}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                    >
                      {column.render
                        ? column.render((row as any)[column.key], row)
                        : (row as any)[column.key]}
                    </td>
                  ))}

                  {actions.length > 0 && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {actions
                          .filter((action) => !action.show || action.show(row))
                          .map((action, actionIndex) => (
                            <Button
                              key={actionIndex}
                              size="xs"
                              variant={action.variant || "ghost"}
                              leftIcon={action.icon}
                              onClick={() => action.onClick(row)}
                              className="!px-2 !py-1"
                            >
                              {action.label}
                            </Button>
                          ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
