import { useState, useCallback } from "react";

/**
 * Custom hook for managing disclosure state (open/close)
 * Commonly used for modals, dropdowns, drawers, and other toggleable UI elements
 * 
 * @param defaultIsOpen - Initial open state (default: false)
 * @returns Object containing isOpen state and control functions
 * 
 * @example
 * const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
 * 
 * // In your component
 * <button onClick={onOpen}>Open Modal</button>
 * <Modal isOpen={isOpen} onClose={onClose}>
 *   Content
 * </Modal>
 * 
 * @example
 * // With initial state
 * const { isOpen, onOpen, onClose, onToggle } = useDisclosure(true);
 */
export const useDisclosure = (defaultIsOpen: boolean = false) => {
    const [isOpen, setIsOpen] = useState<boolean>(defaultIsOpen);

    const onOpen = useCallback(() => {
        setIsOpen(true);
    }, []);

    const onClose = useCallback(() => {
        setIsOpen(false);
    }, []);

    const onToggle = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    return {
        isOpen,
        onOpen,
        onClose,
        onToggle,
    };
};
