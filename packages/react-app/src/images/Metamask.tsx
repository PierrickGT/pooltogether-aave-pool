import React from 'react';

export type MetamaskProps = {
    fill?: string;
};

const Metamask: React.FC<MetamaskProps> = ({ fill = 'white' }) => (
    <svg
        viewBox="0 0 159 144"
        width="40"
        height="36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ verticalAlign: 'middle' }}
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M22 2l37.5 15h43l28-11-42 32v7l24 19.5L146 74l11 32-10 32.5-31-8.5h-6l-17 14H67l-18-14h-6.5l-29 8.5-11-32.5 11-32L49 64.5 71 45v-7L22 2zm29.5 91v-4l8.5-4h3.5l4 11-16-3zm56-4v4l-16 3 4-11H99l8.5 4zM67 132.5V120l4.5-3H88l4.5 3v12.5l-2-2H69l-2 2z"
            fill={fill}
        />
        <path
            d="M95 41l55-41 9 23.5-7.5 24.5 4 2-4 5.5h2.5l-4 5.5 4 3-6.5 5-31-10L95 41zM64 41L9 0 0 23.5 7.5 48l-4 2 4 5.5H5L9 61l-4 3 6.5 5 31-10L64 41z"
            fill={fill}
        />
    </svg>
);

export default Metamask;
