import React from "react";
import "./SecondaryLink.css";

export interface SecondaryLinkProps {
    /** O texto do link */
    children: React.ReactNode;
    /** URL de destino para navegação */
    href?: string;
    /** Função a ser executada ao clicar no link */
    onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
    /** Classes CSS adicionais */
    className?: string;
    /** Target do link (ex: "_blank" para nova aba) */
    target?: string;
    /** Rel attribute para segurança */
    rel?: string;
    /** Se o link está desabilitado */
    disabled?: boolean;
}

const SecondaryLink: React.FC<SecondaryLinkProps> = ({
    children,
    href,
    onClick,
    className = "",
    target,
    rel,
    disabled = false,
}) => {
    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (disabled) {
            event.preventDefault();
            return;
        }

        if (onClick) {
            onClick(event);
        }
    };

    const linkClasses = `secondary-link ${disabled ? 'secondary-link--disabled' : ''} ${className}`.trim();

    return (
        <a
            href={disabled ? undefined : href}
            onClick={handleClick}
            className={linkClasses}
            target={target}
            rel={rel}
            tabIndex={disabled ? -1 : 0}
            aria-disabled={disabled}
        >
            {children}
        </a>
    );
};

export default SecondaryLink;