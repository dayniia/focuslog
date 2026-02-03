import React from 'react';

interface LogoProps {
    size?: number;
    className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 24, className }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <rect width="100" height="100" rx="24" fill="currentColor" />
            {/* Bold Vertical Stem */}
            <path
                d="M42 75V40C42 34 46 30 52 30C58 30 62 34 62 40"
                stroke="white"
                strokeWidth="12"
                strokeLinecap="round"
            />
            {/* Bold Leaf Crossbar */}
            <path
                d="M28 52C28 52 38 42 56 42C74 42 70 52 56 52C42 52 28 52 28 52Z"
                fill="white"
            />
        </svg>
    );
};
