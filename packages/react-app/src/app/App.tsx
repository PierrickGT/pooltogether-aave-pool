import React, { useEffect, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Button, Typography } from 'antd';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import { rem } from 'polished';
import styled, { createGlobalStyle } from 'styled-components';

import Header from 'components/Header';
import Modal, { useModal } from 'components/Modal';
import RenderJoinModal from 'components/Modal/RenderJoin';
import RenderWalletModal from 'components/Modal/RenderWallet';
import RenderWithdrawModal from 'components/Modal/RenderWithdraw';
import { getAavePoolPrize, getPrizePeriodRemainingSeconds } from 'helpers/Pool';
import { useInterval } from 'hooks/useInterval';
import AaveLogo from 'images/AaveLogo';
import Dai from 'images/Dai';
import backgroundAave from 'images/DiamondBackground.png';
import Trophy from 'images/Trophy';
import { globalStyles } from 'styles/global';
import { spacingUnit } from 'styles/variables';

import 'antd/dist/antd.css';

const { Title } = Typography;

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

const LandingContent = styled.section`
    padding: ${spacingUnit(3)} ${spacingUnit(3)} 0;
`;

const AppContent = styled.section`
    padding: ${spacingUnit(3)};
`;

const StyledButton = styled(Button)`
    margin: ${spacingUnit(3)} 0;
`;

const StyledTitle = styled(Title)`
    color: white !important;
    max-width: ${rem(800)};
    margin: 0 auto;
`;

const StyledTitleApp = styled(Title)`
    color: white !important;
    max-width: ${rem(800)};
    margin: ${spacingUnit(4)} auto ${spacingUnit(6)} !important;
`;

const StyledTitlePrize = styled(StyledTitle)`
    margin-top: 0 !important;
`;

const PrizeContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 650px;
    margin: ${spacingUnit(5)} auto;
`;

momentDurationFormatSetup(moment);

const App: React.FC = () => {
    const { active: walletConnected, chainId } = useWeb3React<Web3Provider>();
    const { modalIsOpen: walletModalIsOpen, toggleModal: toggleWalletModal } = useModal();
    const { modalIsOpen: joinModalIsOpen, toggleModal: toggleJoinModal } = useModal();
    const { modalIsOpen: withdrawModalIsOpen, toggleModal: toggleWithdrawModal } = useModal();

    const [currentPrize, setCurrentPrize] = useState('');
    const [estimatedPrize, setEstimatedPrize] = useState('');

    const [mountedAt, setMountedAt] = useState(0);
    const [secondsToPrizeAtMount, setSecondsToPrizeAtMount] = useState(0);
    const [secondsRemainingNow, setSecondsRemainingNow] = useState('');

    const handleJoinAavePool = () => {
        toggleJoinModal();
    };

    const handleWithdrawFromAavePool = () => {
        toggleWithdrawModal();
    };

    const setPrizePeriodRemainingSecondsAtMount = async () => {
        const prizePeriodRemainingSeconds = await getPrizePeriodRemainingSeconds(chainId as number);
        const formattedPrizePeriodRemainingSeconds = parseInt(
            prizePeriodRemainingSeconds.toString(),
            10,
        );

        setSecondsToPrizeAtMount(formattedPrizePeriodRemainingSeconds);
        setMountedAt(parseInt((Date.now() / 1000).toString(), 10));
    };

    const getAsyncValues = async () => {
        const { prizeInDai, prizeEstimateInDai } = await getAavePoolPrize(chainId as number);

        setCurrentPrize(Number(prizeInDai).toFixed(4));
        setEstimatedPrize(Math.ceil(Number(prizeEstimateInDai)).toString());
    };

    useEffect(() => {
        if (walletConnected) {
            getAsyncValues();
            setPrizePeriodRemainingSecondsAtMount();

            if (walletModalIsOpen) {
                toggleWalletModal();
            }
        }
    }, [walletConnected]); // eslint-disable-line react-hooks/exhaustive-deps

    useInterval(() => {
        const diffInSeconds = parseInt((Date.now() / 1000).toString(), 10) - mountedAt;
        const remaining = secondsToPrizeAtMount - diffInSeconds;

        setSecondsRemainingNow(
            remaining <= 0
                ? '0'
                : moment.duration(remaining, 'seconds').format('d [days] [and] h:m:s [hours]'),
        );
    }, 1000);

    return (
        <StyledApp>
            <div className="container full-height-viewport">
                <Header toggleWalletModal={toggleWalletModal} />
                {!walletConnected ? (
                    <LandingContent>
                        <AaveLogo />
                        <StyledTitle>Welcome to Aave Pool!</StyledTitle>
                        <StyledButton type="primary" size="large" onClick={toggleWalletModal}>
                            Come on in, the water’s fine!
                        </StyledButton>
                        <StyledTitle level={2}>Built for the ETH Online Hackathon</StyledTitle>
                        <StyledTitle level={3}>
                            PoolTogether Pools generate prize money from the accrued interest of
                            yield protocols; making for a no-loss money lottery.
                        </StyledTitle>
                        <StyledTitle level={3}>
                            The aptly named Aave Pool indeed uses Aave protocol to generate and pool
                            the yield prize money.
                        </StyledTitle>
                        <StyledTitle level={4}>
                            This project is currently only available on Ropsten test network and
                            tickets may only be purchased in DAI. With further development, I hope
                            to make Aave Pool tickets available for purchase on Mainnet with the
                            option for users to create their own Pool backed by the aToken of their
                            choice. Bonus points if you’ve gotten this far and had to read the word
                            pool 10 times in less than 133 words, sawry!
                        </StyledTitle>
                    </LandingContent>
                ) : (
                    <AppContent>
                        <Trophy width={65} />
                        <StyledTitleApp
                            level={2}
                        >{`Next prize is in ${secondsRemainingNow}`}</StyledTitleApp>
                        <Button type="primary" size="large" onClick={handleJoinAavePool}>
                            Deposit into Aave Pool
                        </Button>
                        <PrizeContainer>
                            <StyledTitlePrize level={3}>
                                Current Prize
                                <br />
                                <span className="vertical-align-middle">{currentPrize}</span>{' '}
                                <Dai width={20} />
                            </StyledTitlePrize>
                            <StyledTitlePrize level={3}>
                                Estimated prize
                                <br />
                                <span className="vertical-align-middle">{estimatedPrize}</span>{' '}
                                <Dai width={20} />
                            </StyledTitlePrize>
                        </PrizeContainer>
                        <Button type="primary" size="large" onClick={handleWithdrawFromAavePool}>
                            Withdraw from Aave Pool
                        </Button>
                    </AppContent>
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
