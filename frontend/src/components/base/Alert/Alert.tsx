import React from "react";
import "./Alert.css";

export interface AlertProps {
    type: "error" | "warning" | "info" | "success";
    message: string;
    className?: string;
    dismissible?: boolean;
    onDismiss?: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, message, className = "", dismissible = false, onDismiss }) => {
    const getIcon = () => {
        switch (type) {
            case "error":
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                );
            case "warning":
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                    </svg>
                );
            case "info":
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                    </svg>
                );
            case "success":
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const getDismissIcon = () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
    );

    const alertClasses = `alert alert-${type} ${dismissible ? 'alert-dismissible' : ''} ${className}`.trim();

    return (
        <div className={alertClasses} role="alert">
            <div className="alert-icon">{getIcon()}</div>
            <div className="alert-message">{message}</div>
            {dismissible && onDismiss && (
                <button
                    className="alert-dismiss-button"
                    onClick={onDismiss}
                    type="button"
                    aria-label="Fechar alerta"
                >
                    {getDismissIcon()}
                </button>
            )}
        </div>
    );
};

export default Alert;