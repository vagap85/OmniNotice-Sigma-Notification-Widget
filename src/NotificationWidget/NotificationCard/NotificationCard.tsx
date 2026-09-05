import { useEffect, useId, useRef } from "react";
import "./NotificationCard.css";
import type { NotificationCardProps } from "../types";
import { renderIcon } from "../helpers/renderIcon";
import notificationSettings from "../notification.config";

export default function NotificationCard({
    title,
    description,
    buttonText,
    buttonHref = "#", // можете поменять на свой дефолтный путь
    Icon,
    onClose,
}: NotificationCardProps) {
    const titleId = useId();
    const descriptionId = useId();

    const containerRef = useRef<HTMLDivElement>(null);
    const previouslyFocusedElement = useRef<HTMLElement | null>(null);

    const hasButton = Boolean(buttonText) && buttonHref;

    // При появлении карточки: запоминаем, что было в фокусе,
    // и переводим фокус на карточку, чтобы скринридер её анонсировал
    // и клавиатурный пользователь сразу мог с ней взаимодействовать.
    useEffect(() => {
        previouslyFocusedElement.current = document.activeElement as HTMLElement;
        containerRef.current?.focus();

        return () => {
            // При закрытии/размонтировании возвращаем фокус туда, где он был
            previouslyFocusedElement.current?.focus?.();
        };
    }, []);

    // Автоматическое закрытие по таймауту
    useEffect(() => {
        if (!notificationSettings.autoCloseMs) return;

        const timer = window.setTimeout(() => {
            onClose();
        }, notificationSettings.autoCloseMs);

        return () => window.clearTimeout(timer);
    }, [onClose]);

    // Закрытие по Escape
    useEffect(() => {
        if (!notificationSettings.closeWithEscape) return
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onClose();
                return;
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    return (
        <div
            ref={containerRef}
            className="notification-card"
            role="alert"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            tabIndex={-1}
        >
            <div className="notification-card__inner">
                <div className="notification-card__icon" aria-hidden="true">
                    {renderIcon(Icon)}
                </div>
                <div className="notification-card__content">
                    <p id={titleId} className="notification-card__title">
                        {title}
                    </p>
                    <p id={descriptionId} className="notification-card__description">
                        {description}
                    </p>
                    {hasButton && (
                        <a
                            href={buttonHref}
                            className="notification-card__button"
                        >
                            {buttonText}
                        </a>
                    )
                    }
                </div>
            </div>
            <button
                className="notification-card__close"
                type="button"
                onClick={onClose}
                aria-label="Закрыть уведомление"
            >
                <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    focusable="false"
                >
                    <path
                        d="M0.5 0.5L5 5M5 5L0.5 9.5M5 5L9.5 9.5M5 5L9.5 0.5"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
        </div>
    );
}