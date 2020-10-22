import { rem } from 'polished';
import { css } from 'styled-components';

export const lineHeight = {
    base: css`
        ${rem(24)}
    `,
    large: css`
        ${rem(32)}
    `,
};

export const size = {
    h4: css`
        ${rem(17)}
    `,
    h5: css`
        ${rem(15)}
    `,
    small: css`
        ${rem(14)}
    `,
    medium: css`
        ${rem(18)}
    `,
    big: css`
        ${rem(20)}
    `,
    large: css`
        ${rem(22)}
    `,
    extraLarge: css`
        ${rem(30)}
    `,
};

export const weight = {
    title: 500,
};
