export const isSpecialInputType = (type: string): boolean =>
    type === "number" || type === "date";

export const shouldShowValidationIcons = (
    type: string,
    value: string
): boolean =>
    !isSpecialInputType(type) && value.length > 0;

export const generateInputId = (id?: string, name?: string): string =>
    id || name || `input-${Math.random().toString(36).substr(2, 9)}`;

export const buildClassNames = (...classes: (string | boolean | undefined)[]): string =>
    classes.filter(Boolean).join(" ");