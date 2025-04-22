import React from 'react';

const Button = ({
    children,
    type = 'button',
    disabled = false,
    classname = '',
    variant = 'primary',
    size = 'medium',
    onClick,
    ...props
}) => {
    const baseStyles = "font-medium rounded focus: outline-none transitions-colors";

    const variantStyles = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50",
        success: "bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
    }

    const sizeStyles = {
        small: "py-1 px-3 text-sm",
        medium: "px-4 py-2 text-base",
        large: "px-6 py-3 text-lg"
    };

    const disabledStyles = "opacity-50 cursor-not-allowed";

    const buttonClasses = `
        ${baseStyles} 
        ${variantStyles[variant] || variantStyles.primary} 
        ${sizeStyles[size] || sizeStyles.medium} 
        ${disabled ? disabledStyles : ''} 
        ${classname}
    `.trim();

    return (
        <button
            type={type}
            className={buttonClasses}
            disabled={disabled}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;