import { rem } from 'polished';
import { css } from 'styled-components';

export const borderRadius = css`
    ${rem(4)}
`;

export const spacingUnit = (factor = 1) => {
    const value = 8 * factor;

    return rem(`${value}px`);
};

export const mediaMax = {
    sm: css`
        ${rem(768)}
    `,
};
