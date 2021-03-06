import React from 'react';

interface PoolTogetherTokenProps {
    width: number;
}

const PoolTogetherToken: React.FC<PoolTogetherTokenProps> = ({ width }) => (
    <svg width={width} viewBox="0 0 318 318" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0)">
            <circle cx="159" cy="159" r="159" fill="url(#paint0_linear)" />
            <path
                d="M166.159 43.503c36.084 0 65.336 29.74 65.336 66.427v38.196c0 36.686-29.252 66.427-65.336 66.427a64.452 64.452 0 01-16.412-2.113l.001 4.509c0 26.837-21.502 48.644-48.192 49.078l-.81.006V119.894l.075-.001.002-9.963c0-36.686 29.252-66.427 65.336-66.427zm0 49.82c-9.021 0-16.334 7.436-16.334 16.607v38.196c0 9.171 7.313 16.606 16.334 16.606s16.334-7.435 16.334-16.606V109.93c0-9.171-7.313-16.606-16.334-16.606z"
                fill="#fff"
            />
        </g>
        <defs>
            <linearGradient
                id="paint0_linear"
                x1="159"
                y1="0"
                x2="159"
                y2="318"
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="#7E46F2" />
                <stop offset="1" stopColor="#46279A" />
            </linearGradient>
            <clipPath id="clip0">
                <path fill="#fff" d="M0 0h318v318H0z" />
            </clipPath>
        </defs>
    </svg>
);

export default PoolTogetherToken;
