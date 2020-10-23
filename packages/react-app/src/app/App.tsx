import React from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import styled, { createGlobalStyle } from 'styled-components';

import Header from 'components/Header';
import Modal, { useModal } from 'components/Modal';
import RenderJoinModal from 'components/Modal/RenderJoin';
import RenderWalletModal from 'components/Modal/RenderWallet';
import RenderWithdrawModal from 'components/Modal/RenderWithdraw';
import Content from 'containers/Content';
import Landing from 'containers/Landing';
import backgroundAave from 'images/DiamondBackground.png';
import { globalStyles } from 'styles/global';

import 'antd/dist/antd.css';

const GlobalStyle = createGlobalStyle`${globalStyles}`;

const StyledApp = styled.div`
    background-image: url(${backgroundAave});
    background-color: #230548;
    background-position: center center;
    background-attachment: fixed;
    background-size: 187.85px;
    color: white;
    height: 100%;
    text-align: center;
`;

const App: React.FC = () => {
    const { active: walletConnected } = useWeb3React<Web3Provider>();
    const { modalIsOpen: walletModalIsOpen, toggleModal: toggleWalletModal } = useModal();
    const { modalIsOpen: joinModalIsOpen, toggleModal: toggleJoinModal } = useModal();
    const { modalIsOpen: withdrawModalIsOpen, toggleModal: toggleWithdrawModal } = useModal();

    return (
        <StyledApp>
            <div className="container full-height-viewport">
                <Header toggleWalletModal={toggleWalletModal} />
                {!walletConnected ? (
                    <Landing toggleWalletModal={toggleWalletModal} />
                ) : (
                    <Content
                        toggleJoinModal={toggleJoinModal}
                        toggleWithdrawModal={toggleWithdrawModal}
                        toggleWalletModal={toggleWalletModal}
                        walletModalIsOpen={walletModalIsOpen}
                    />
                )}
            </div>
            <Modal
                component={RenderWalletModal}
                isOpen={walletModalIsOpen}
                toggleModal={toggleWalletModal}
                title="Select a Wallet"
            />
            <Modal
                component={RenderJoinModal}
                isOpen={joinModalIsOpen}
                toggleModal={toggleJoinModal}
            />
            <Modal
                component={RenderWithdrawModal}
                isOpen={withdrawModalIsOpen}
                toggleModal={toggleWithdrawModal}
                title="Weekly Aave Pool: Withdraw Tickets"
            />
            <GlobalStyle />
        </StyledApp>
    );
};

export default App;
