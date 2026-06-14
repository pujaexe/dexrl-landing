import React from "react";
import clsx from "clsx";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton = ({ className, ...props }: SkeletonProps) => {
  return (
    <div
      className={clsx(
        "animate-pulse rounded-md bg-gray-100/60 dark:bg-gray-400/40",
        className
      )}
      {...props}
    />
  );
};

export const SkeletonCard = () => (
  <div className="rounded-xl border p-4 space-y-3 dark:border-gray-700">
    <Skeleton className="h-40 w-full" />
    <Skeleton className="h-4 w-2/3" />
    <Skeleton className="h-4 w-1/3" />
  </div>
);

export const SkeletonText = ({ lines = 3 }: { lines?: number }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} className="h-3 w-full" />
    ))}
  </div>
);

export const SkeletonAvatar = ({ size = 48 }: { size?: number }) => (
  <Skeleton className="rounded-full" style={{ height: size, width: size }} />
);