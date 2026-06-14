"use client";

import Confirmation from '@/components/modal/Confirmation';
import Information from '@/components/modal/Information';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useState } from 'react';

interface ModalOptions {
    title: string;
    description: ReactNode;
    icon?: ReactNode;
    onCancel?: () => void;
    onConfirm?: () => void | Promise<void>;
    confirmText?: string;
    cancelText?: string;
}

interface ModalState extends ModalOptions {
    isOpen: boolean;
    variant: 'default' | 'danger';
    isLoading: boolean;
    type: 'confirmation' | 'information';
}

interface ModalContextValue {
    confirm: (options: ModalOptions) => void;
    delete: (options: ModalOptions) => void;
    information: (options: ModalOptions) => void;
    close: () => void;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<ModalState>({
        isOpen: false,
        variant: 'default',
        title: '',
        description: '',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        isLoading: false,
        type: 'confirmation',
    });

    const openConfirmation = useCallback((
        options: ModalOptions,
        variant: 'default' | 'danger'
    ) => {
        setState({
            isOpen: true,
            variant,
            type: 'confirmation',
            title: options.title,
            description: options.description,
            icon: options.icon,
            onCancel: options.onCancel,
            onConfirm: options.onConfirm,
            confirmText: options.confirmText || (variant === 'danger' ? 'Delete' : 'Confirm'),
            cancelText: options.cancelText || 'Cancel',
            isLoading: false,
        });
    }, []);

    const openInformation = useCallback((
        options: ModalOptions,
        variant: 'default' | 'danger'
    ) => {
        setState({
            isOpen: true,
            variant,
            type: 'information',
            title: options.title,
            description: options.description,
            icon: options.icon,
            onCancel: options.onCancel,
            onConfirm: options.onConfirm,
            confirmText: options.confirmText || 'Confirm',
            cancelText: options.cancelText || 'Cancel',
            isLoading: false,
        });
    }, []);
    const confirm = useCallback((options: ModalOptions) => {
        openConfirmation(options, 'default');
    }, [openConfirmation]);

    const deleteConfirm = useCallback((options: ModalOptions) => {
        openConfirmation(options, 'danger');
    }, [openConfirmation]);

    const information = useCallback((options: ModalOptions) => {
        openInformation(options, 'default');
    }, [openInformation]);

    const handleCancel = useCallback(() => {
        if (state.isLoading) return;

        if (state.onCancel) {
            state.onCancel();
        }
        setState(prev => ({ ...prev, isOpen: false }));
    }, [state]);

    const handleSuccess = useCallback(async () => {
        if (state.onConfirm) {
            try {
                setState(prev => ({ ...prev, isLoading: true }));
                await Promise.resolve(state.onConfirm());
                setState(prev => ({ ...prev, isOpen: false, isLoading: false }));
            } catch (error) {
                setState(prev => ({ ...prev, isLoading: false }));
                console.error('Confirmation error:', error);
            }
        } else {
            setState(prev => ({ ...prev, isOpen: false }));
        }
    }, [state]);

    const handleClose = useCallback(() => {
        setState(prev => ({ ...prev, isOpen: false }));
    }, []);

    const value: ModalContextValue = {
        confirm,
        delete: deleteConfirm,
        close: handleClose,
        information,
    };

    return (
        <ModalContext.Provider value={value}>
            {children}

            <Confirmation
                open={state.isOpen && state.type === 'confirmation'}
                onClose={() => {
                    handleCancel();
                }}
                onConfirm={handleSuccess}
                title={state.title}
                icon={state.icon}
                confirmText={state.confirmText}
                cancelText={state.cancelText}
                isDanger={state.variant === 'danger'}
                isLoading={state.isLoading}
            >
                {state.description}
            </Confirmation>

            <Information
                open={state.isOpen && state.type === 'information'}
                onClose={handleCancel}
                title={state.title}
                icon={state.icon}
            >
                {state.description}
            </Information>
        </ModalContext.Provider>
    );
}

export function useModal(): ModalContextValue {
    const context = useContext(ModalContext);

    if (!context) {
        throw new Error('useModal must be used within ModalProvider');
    }

    return context;
}

