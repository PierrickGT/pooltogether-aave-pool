import React, { FunctionComponent, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { rem } from 'polished';
import ReactModal from 'react-modal';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { resetTransaction } from 'helpers/sendTransactionSlice';
import { purple } from 'styles/colors';
import { borderRadius, mediaMax } from 'styles/variables';

import { CloseButton } from './style';

export interface ModalProps {
    className?: string;
    isOpen: boolean;
    title?: string;
    toggleModal: () => void;
}

interface Modal extends ModalProps {
    component: FunctionComponent<ModalProps>;
}

export const useModal = () => {
    const [modalIsOpen, setIsOpen] = useState(false);

    function toggleModal() {
        setIsOpen(!modalIsOpen);
    }

    return {
        modalIsOpen,
        toggleModal,
    };
};

const Modal: React.FC<Modal> = ({ className, component, isOpen, title, toggleModal }) => {
    const dispatch = useDispatch();

    const closeModal = () => {
        toggleModal();
        dispatch(resetTransaction());
    };

    const contentClassName = `${className}__content`;
    const overlayClassName = `${className}__overlay`;

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel={title}
            overlayClassName={overlayClassName}
            className={contentClassName}
        >
            {React.createElement(component, { className, isOpen, title, toggleModal })}
            <CloseButton type="button" title="Close" onClick={closeModal}>
                <CloseOutlined />
            </CloseButton>
        </ReactModal>
    );
};

const StyledModal = styled(Modal)`
    &__overlay {
        align-items: center;
        background-color: rgba(0, 0, 0, 0.7);
        bottom: 0;
        display: flex;
        justify-content: center;
        left: 0;
        position: fixed;
        right: 0;
        top: 0;
        z-index: 1;
    }

    &__content {
        background-color: ${purple[3]};
        border-radius: ${borderRadius};
        max-width: ${rem(920)};
        position: relative;
        width: 100%;

        @media (max-width: ${mediaMax.sm}) {
            height: 100%;
            max-width: 100%;
        }
    }
`;

export default StyledModal;
