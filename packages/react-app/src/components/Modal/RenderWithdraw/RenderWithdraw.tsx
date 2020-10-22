import React from 'react';
import { rem } from 'polished';
import styled from 'styled-components';

import { ModalProps } from 'components/Modal';
import { ModalContent, ModalHeader, ModalTitle } from 'components/Modal/style';
import Withdraw from 'components/Withdraw';

const StyledModalContent = styled(ModalContent)`
    min-height: ${rem(270)};
`;

const WithdrawModal: React.FC<ModalProps> = ({ title }) => {
    return (
        <React.Fragment>
            <ModalHeader>
                <ModalTitle>{title}</ModalTitle>
            </ModalHeader>
            <StyledModalContent>
                <Withdraw />
            </StyledModalContent>
        </React.Fragment>
    );
};

export default WithdrawModal;
