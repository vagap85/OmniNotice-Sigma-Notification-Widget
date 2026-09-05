import { ComponentType, isValidElement, ReactNode } from "react";

export function renderIcon(Icon: ReactNode | ComponentType): ReactNode {
    // Уже готовый JSX-элемент (например, инлайновый <svg />) - рендерим как есть
    if (isValidElement(Icon)) {
        return Icon;
    }

    // Компонент (function/class) — рендерим через JSX
    if (typeof Icon === "function") {
        const IconComponent = Icon as ComponentType;
        return <IconComponent />;
    }

    // Любой другой ReactNode (строка, число, null, массив и т.д.)
    return Icon as ReactNode;
}