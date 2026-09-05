import type { ComponentType, ReactNode } from "react";

export interface NotificationCardProps {
    title: string;
    description: string;
    Icon: ReactNode | ComponentType;
    onClose: () => void;
    buttonText?: string;
    buttonHref?: string;
}

export interface NotificationListItem extends NotificationCardProps {
    id: string;
}

export interface NotificationCardListHandle {
    add: (notification: Omit<NotificationListItem, "id" | "onClose">) => void;
    remove: (id: string) => void;
}

export interface NotificationCardListProps {
    maxVisible?: number;
    removalAnimationMs?: number;
}