import { rem } from 'polished';
import styled from 'styled-components';

import { purple } from 'styles/colors';
import { lineHeight, size as fontSize, weight as fontWeight } from 'styles/fonts';
import { borderRadius, mediaMax, spacingUnit } from 'styles/variables';

const closeButtonSizeDesktop = rem(40);
const closeButtonSizeMobile = rem(32);

export const ModalHeader = styled.div`
    background-color: ${purple[4]};
    border-top-left-radius: ${borderRadius};
    border-top-right-radius: ${borderRadius};
    padding: ${spacingUnit(2)} 0;
    text-align: center;

    h4 {
        color: ${purple[0]};
        font-size: ${rem(18)};
    }

    @media (max-width: ${mediaMax.sm}) {
        padding: ${spacingUnit()} ${spacingUnit(8)} ${spacingUnit()} ${spacingUnit(2)};
        text-align: left;
    }
`;

export const ModalTitle = styled.h4`
    font-size: ${fontSize.h4};
    font-weight: ${fontWeight.title};
    line-height: ${lineHeight.base};
    margin: 0;
`;

export const ModalContent = styled.div`
    font-size: ${fontSize.h5};
    line-height: ${lineHeight.base};
    padding: ${spacingUnit(5)} ${rem(84)} ${spacingUnit(4)};
    text-align: center;

    @media (max-width: ${mediaMax.sm}) {
        padding: ${spacingUnit(5)} ${spacingUnit(2)} ${spacingUnit(2)};
    }
`;

export const CloseButton = styled.button`
    align-items: center;
    background-color: ${purple[3]};
    border-radius: 100%;
    border: 0;
    color: ${purple[0]};
    cursor: pointer;
    display: flex;
    height: ${closeButtonSizeDesktop};
    justify-content: center;
    line-height: ${closeButtonSizeDesktop};
    padding: 0;
    position: absolute;
    right: ${spacingUnit(2)};
    top: ${spacingUnit()};
    width: ${closeButtonSizeDesktop};

    &:hover {
        background-color: ${purple[2]};
        color: white;
    }

    @media (max-width: ${mediaMax.sm}) {
        height: ${closeButtonSizeMobile};
        line-height: ${closeButtonSizeMobile};
        top: ${rem(4)};
        width: ${closeButtonSizeMobile};
    }
`;
