import {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import "./NotificationCardList.css";
import type { NotificationCardListHandle, NotificationCardListProps, NotificationListItem } from "../types";
import NotificationCard from "../NotificationCard/NotificationCard";
import { createId } from "../helpers/createId";
import notificationSettings from "../notification.config";

const NotificationCardList = forwardRef<NotificationCardListHandle, NotificationCardListProps>
    (function NotificationCardList(
        { 
            maxVisible = notificationSettings.maxVisible, 
            removalAnimationMs = notificationSettings.removalAnimationMs 
        },
        ref
    ) {
        const [items, setItems] = useState<NotificationListItem[]>([]);
        const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

        const containerRef = useRef<HTMLDivElement>(null);
        const positionsRef = useRef<Map<string, DOMRect>>(new Map());

        // Синхронный источник правды о том, что уже поставлено на удаление,
        // нужен, чтобы не запланировать повторный таймер для одного и того же id
        // при частых быстрых добавлениях.
        const removingIdsRef = useRef<Set<string>>(new Set());

        const removeItem = useCallback((id: string) => {
            if (removingIdsRef.current.has(id)) return;
            removingIdsRef.current.add(id);

            setRemovingIds((prev) => {
                const next = new Set(prev);
                next.add(id);
                return next;
            });

            window.setTimeout(() => {
                removingIdsRef.current.delete(id);
                setItems((prev) => prev.filter((item) => item.id !== id));
                setRemovingIds((prev) => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                });
            }, removalAnimationMs);
        }, [removalAnimationMs]);

        useImperativeHandle(ref, () => ({
            add: (notification) => {
                const id = createId();
                const newItem: NotificationListItem = {
                    id,
                    ...notification,
                    onClose: () => removeItem(id),
                };

                setItems((prev) => [newItem, ...prev]);
            },
            remove: removeItem,
        }), [removeItem]);

        // Следим за превышением лимита отдельно от add() — здесь мы всегда смотрим
        // на актуальное состояние items и removingIdsRef, поэтому корректно вытесняем
        // ВЕСЬ избыток карточек, а не только одну, даже при очень частых добавлениях подряд.
        useEffect(() => {
            const activeItems = items.filter((item) => !removingIdsRef.current.has(item.id));

            if (activeItems.length > maxVisible) {
                const excess = activeItems.slice(maxVisible);
                excess.forEach((item) => removeItem(item.id));
            }
        }, [items, maxVisible, removeItem]);

        // FLIP-анимация: при изменении списка карточки плавно "доезжают"
        // до новой позиции вместо мгновенного скачка.
        useLayoutEffect(() => {
            const container = containerRef.current;
            if (!container) return;

            const newPositions = new Map<string, DOMRect>();
            const children = Array.from(
                container.querySelectorAll<HTMLElement>("[data-notification-id]")
            );

            children.forEach((child) => {
                const id = child.dataset.notificationId as string;
                newPositions.set(id, child.getBoundingClientRect());
            });

            children.forEach((child) => {
                const id = child.dataset.notificationId as string;
                const oldRect = positionsRef.current.get(id);
                const newRect = newPositions.get(id);
                if (!oldRect || !newRect) return;

                const deltaY = oldRect.top - newRect.top;
                if (deltaY === 0) return;

                child.style.transition = "none";
                child.style.transform = `translateY(${deltaY}px)`;

                requestAnimationFrame(() => {
                    child.style.transition = "";
                    child.style.transform = "";
                });
            });

            positionsRef.current = newPositions;
        }, [items]);

        if (items.length === 0) return null;

        return (
            <div
                ref={containerRef}
                className="notification-card-list"
                role="region"
                aria-label="Уведомления"
            >
                {items.map((item) => (
                    <div
                        key={item.id}
                        data-notification-id={item.id}
                        className={
                            "notification-card-list__item" +
                            (removingIds.has(item.id)
                                ? " notification-card-list__item--removing"
                                : "")
                        }
                    >
                        <NotificationCard {...item} />
                    </div>
                ))}
            </div>
        );
    });

export default NotificationCardList;