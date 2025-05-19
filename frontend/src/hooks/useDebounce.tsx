import { useRef } from "react";

export const useDebounce = (callback: (value: string) => void, delay: number) => {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    return (value: string) => {
        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            callback(value);
        }, delay);
    };
};
