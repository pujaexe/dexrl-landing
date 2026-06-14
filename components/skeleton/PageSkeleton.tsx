export const PageSkeleton = () => {
    return (
        <div className="fixed inset-0 z-50 flex min-h-screen w-full items-center justify-center bg-[#f8fafc] dark:bg-slate-900">
            <div className="flex flex-col items-center gap-6">
                <div className="loader" />
            </div>
        </div>
    );
};

export default PageSkeleton;
