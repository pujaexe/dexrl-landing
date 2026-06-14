"use client";

import clsx from "clsx";

export const HeaderSkeleton = () => {
    return (
        <div className="w-full flex flex-col gap-2 items-center">
            <div className="w-40 h-6 bg-[#ECF0EF] rounded animate-pulse"></div>
            <div className="w-full h-4 bg-[#ECF0EF] rounded animate-pulse"></div>
            <div className="w-40 h-4 bg-[#ECF0EF] rounded animate-pulse"></div>
        </div>
    );
};

export const IconSkeleton = () => {
    return (
        <div className="w-[40px] h-[40px] p-1.5 bg-[#ECF0EF] animate-pulse rounded-full"></div>
    );
};

export const ItemStatusSkeleton = () => {
    return (
        <div className="w-[85px] h-4 bg-[#ECF0EF] animate-pulse rounded-full"></div>
    );
};

export const LabelSkeleton = () => {
    return (
        <div className="flex flex-col flex-1 gap-2 items-center">
            <div className="w-full h-5 bg-[#ECF0EF] rounded animate-pulse"></div>
            <div className="w-full h-4 bg-[#ECF0EF] rounded animate-pulse"></div>
        </div>
    );
};

export const StepItemSkeleton = () => {
    return (
        <div className="flex gap-3 items-start pb-1">
            <IconSkeleton />
            <LabelSkeleton />
            <ItemStatusSkeleton />
        </div>
    );
};

export const StepsSkeleton = () => {
    return (
        <div className={clsx("rounded-3xl py-3 px-4 w-full", "bg-[#ECF0EF]/15")}>
            <p className="font-semibold mb-4 text-[#003E2C]">Transaction Progress</p>
            <div className="space-y-3">
                <StepItemSkeleton />
                <StepItemSkeleton />
                <StepItemSkeleton />
                <StepItemSkeleton />
                <StepItemSkeleton />
            </div>
        </div>
    );
};

export const StatusSkeleton = () => {
    return (
        <div className={clsx("rounded-3xl py-3 px-4 w-full", "bg-[#ECF0EF]/15")}>
            <div className="flex gap-3 items-start pb-1">
                <IconSkeleton />
                <LabelSkeleton />
            </div>
        </div>
    );
};

export const ButtonSkeleton = () => {
    return <div className="w-full h-12 bg-[#ECF0EF] rounded animate-pulse"></div>;
};

export const ButtonsSkeleton = () => {
    return (
        <div className="flex justify-between gap-4 w-full">
            <ButtonSkeleton />
            <ButtonSkeleton />
        </div>
    );
};

export const QRCodeSkeleton = () => {
    return (
        <div className={clsx("rounded-3xl py-4 px-4 w-full", "bg-[#ECF0EF]/15")}>
            <div className="flex justify-center mb-4">
                <div className="w-[176px] h-[176px] bg-[#ECF0EF] rounded-xl animate-pulse"></div>
            </div>
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <div className="w-24 h-4 bg-[#ECF0EF] rounded animate-pulse"></div>
                    <div className="w-20 h-4 bg-[#ECF0EF] rounded animate-pulse"></div>
                </div>
                <div className="flex justify-between items-center">
                    <div className="w-24 h-4 bg-[#ECF0EF] rounded animate-pulse"></div>
                    <div className="w-16 h-4 bg-[#ECF0EF] rounded animate-pulse"></div>
                </div>
                <div className="flex justify-between items-center">
                    <div className="w-24 h-4 bg-[#ECF0EF] rounded animate-pulse"></div>
                    <div className="w-28 h-4 bg-[#ECF0EF] rounded animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export const DepositInstructionSkeleton = () => {
    return (
        <div className="flex flex-col items-start gap-5 w-full">
            <HeaderSkeleton />
            <QRCodeSkeleton />
            <StatusSkeleton />
            <ButtonsSkeleton />
        </div>
    );
};

export const OfframpSkeleton = () => {
    return (
        <div className="flex flex-col items-start gap-3 w-full">
            <HeaderSkeleton />
            <StepsSkeleton />
            <StatusSkeleton />
            <ButtonsSkeleton />
        </div>
    );
};
