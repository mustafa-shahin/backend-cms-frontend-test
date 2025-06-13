import { useState, useMemo } from "react";

interface UsePaginationProps {
  totalCount: number;
  defaultPageSize?: number;
  defaultPage?: number;
}

interface UsePaginationResult {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startIndex: number;
  endIndex: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
}

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZES = [10, 20, 50, 100] as const;

/**
 * Hook for managing pagination state and calculations
 */
export function usePagination({
  totalCount,
  defaultPageSize = DEFAULT_PAGE_SIZE,
  defaultPage = 1,
}: UsePaginationProps): UsePaginationResult {
  const [currentPage, setCurrentPage] = useState(defaultPage);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalCount / pageSize));
  }, [totalCount, pageSize]);

  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount);

  const setPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  const handleSetPageSize = (newPageSize: number) => {
    const validPageSize = Math.max(
      1,
      Math.min(newPageSize, PAGE_SIZES[PAGE_SIZES.length - 1])
    );
    setPageSize(validPageSize);

    // Adjust current page if necessary
    const newTotalPages = Math.ceil(totalCount / validPageSize);
    if (currentPage > newTotalPages) {
      setCurrentPage(Math.max(1, newTotalPages));
    }
  };

  const nextPage = () => {
    if (hasNextPage) {
      setPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (hasPreviousPage) {
      setPage(currentPage - 1);
    }
  };

  const goToFirstPage = () => {
    setPage(1);
  };

  const goToLastPage = () => {
    setPage(totalPages);
  };

  return {
    currentPage,
    pageSize,
    totalPages,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    startIndex,
    endIndex,
    setPage,
    setPageSize: handleSetPageSize,
    nextPage,
    previousPage,
    goToFirstPage,
    goToLastPage,
  };
}
