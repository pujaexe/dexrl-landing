import { useEffect, useState } from 'react';

/**
 * Custom hook for debouncing a value
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds (default: 500ms)
 * @returns The debounced value
 * 
 * @example
 * const [searchInput, setSearchInput] = useState('');
 * const debouncedSearch = useDebounce(searchInput, 500);
 * 
 * useEffect(() => {
 *   // This will only run after user stops typing for 500ms
 *   fetchSearchResults(debouncedSearch);
 * }, [debouncedSearch]);
 */
export const useDebounce = <T>(value: T, delay: number = 500): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [value, delay]);

    return debouncedValue;
};

/**
 * Custom hook for managing search state with debounce
 * @param initialValue - Initial value for the search (default: '')
 * @param delay - The delay in milliseconds (default: 500ms)
 * @returns Object containing search value, debounced value, and setter function
 * 
 * @example
 * const { search, debouncedSearch, setSearch } = useDebouncedSearch('', 500);
 * 
 * // In your component
 * <input value={search} onChange={(e) => setSearch(e.target.value)} />
 * 
 * // Use debouncedSearch for API calls
 * useQuery(['data', debouncedSearch], () => fetchData(debouncedSearch));
 */
export const useDebouncedSearch = (initialValue: string = '', delay: number = 500) => {
    const [search, setSearch] = useState(initialValue);
    const debouncedSearch = useDebounce(search, delay);

    return {
        search,
        debouncedSearch,
        setSearch,
    };
};
