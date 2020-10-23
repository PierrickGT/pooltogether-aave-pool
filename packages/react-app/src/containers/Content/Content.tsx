import React, { useEffect, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Button, Typography } from 'antd';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import { rem } from 'polished';
import styled from 'styled-components';

import { getAavePoolPrize, getPrizePeriodRemainingSeconds } from 'helpers/Pool';
import { useInterval } from 'hooks/useInterval';
import Dai from 'images/Dai';
import Trophy from 'images/Trophy';
import { spacingUnit } from 'styles/variables';

const { Title } = Typography;

const AppContent = styled.section`
    padding: ${spacingUnit(3)};
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

interface ContentProps {
    toggleJoinModal: () => void;
    toggleWithdrawModal: () => void;
    toggleWalletModal: () => void;
    walletModalIsOpen: boolean;
}

const Content: React.FC<ContentProps> = ({
    toggleJoinModal,
    toggleWithdrawModal,
    toggleWalletModal,
    walletModalIsOpen,
}) => {
    const { account, active: walletConnected, chainId, library } = useWeb3React<Web3Provider>();

    const [currentPrize, setCurrentPrize] = useState('');

    const [mountedAt, setMountedAt] = useState(0);
    const [secondsToPrizeAtMount, setSecondsToPrizeAtMount] = useState(0);
    const [secondsRemainingNow, setSecondsRemainingNow] = useState('');

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
        const { prizeInDai } = await getAavePoolPrize(
            account as string,
            chainId as number,
            library,
        );

        setCurrentPrize(Number(prizeInDai).toFixed());
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

    const handleJoinAavePool = () => {
        toggleJoinModal();
    };

    const handleWithdrawFromAavePool = () => {
        toggleWithdrawModal();
    };

    return (
        <AppContent>
            <Trophy width={65} />
            <StyledTitleApp level={2}>{`Next prize is in ${secondsRemainingNow}`}</StyledTitleApp>
            <Button type="primary" size="large" onClick={handleJoinAavePool}>
                Deposit into Aave Pool
            </Button>
            <PrizeContainer>
                <StyledTitlePrize level={3}>
                    Current Prize
                    <br />
                    <span className="vertical-align-middle">{currentPrize}</span> <Dai width={20} />
                </StyledTitlePrize>
            </PrizeContainer>
            <Button type="primary" size="large" onClick={handleWithdrawFromAavePool}>
                Withdraw from Aave Pool
            </Button>
        </AppContent>
    );
};

export default Content;
