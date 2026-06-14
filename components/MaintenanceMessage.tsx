"use client";

import { HoverPopover } from "./ui/Popover";

interface MaintenanceMessageProps extends React.PropsWithChildren {
    content?: string;
    title?: string;
    isMaintenance?: boolean;
}
const MaintenanceMessage = ({
    children,
    content = "This feature is currently being maintained. We are working on it and will be available soon.",
    title = "Under Maintenance",
    isMaintenance = false,
}: MaintenanceMessageProps) => {
    if (!isMaintenance) {
        return children;
    }
    return (
        <HoverPopover
            content={<p className="text-sm max-w-64 text-white">{content}</p>}
            title={<span className="text-white font-semibold">{title}</span>}
        >
            {children}
        </HoverPopover>
    );
};

export default MaintenanceMessage;
