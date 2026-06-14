import { useState } from 'react';

export interface UsePaginationOptions {
    initialPage?: number;
    initialPageSize?: number;
}

export interface PaginationState {
    page: number;
    pageSize: number;
}

export interface UsePaginationReturn extends PaginationState {
    setPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;
    reset: () => void;
}

/**
 * Custom hook for managing pagination state
 * @param options - Initial pagination options
 * @returns Pagination state and helper functions
 * 
 * @example
 * const pagination = usePagination({ initialPage: 1, initialPageSize: 10 });
 * 
 * // Use in API call
 * const { data } = useQuery(
 *   ['items', pagination.page, pagination.pageSize],
 *   () => fetchItems(pagination.page, pagination.pageSize)
 * );
 * 
 * // Change page
 * pagination.setPage(2);
 */
export const usePagination = (options: UsePaginationOptions = {}): UsePaginationReturn => {
    const { initialPage = 1, initialPageSize = 10 } = options;

    const [page, setPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);

    const reset = () => {
        setPage(initialPage);
        setPageSize(initialPageSize);
    };

    return {
        page,
        pageSize,
        setPage,
        setPageSize,
        reset,
    };
};
