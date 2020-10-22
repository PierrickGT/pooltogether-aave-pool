import React from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Button } from 'antd';
import pluralize from 'pluralize';
import { rem } from 'polished';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { RootState } from 'app/rootReducer';
import PurchaseTickets from 'components/Purchase';
import Throbber from 'components/Throbber';
import { getEtherscanUrl } from 'helpers/Network';
import AaveLogo from 'images/AaveLogo';
import Ticket from 'images/Ticket';
import { green, purple } from 'styles/colors';
import { lineHeight, size as fontSize } from 'styles/fonts';
import { spacingUnit } from 'styles/variables';

const TicketContainer = styled.div`
    align-items: center;
    background-color: ${purple[4]};
    border-radius: 50%;
    display: flex;
    height: ${rem(96)};
    justify-content: center;
    margin: 0 auto ${spacingUnit(3)};
    width: ${rem(96)};
`;

const StyledTextLarge = styled.p`
    font-size: ${fontSize.large};
    letter-spacing: ${rem(2)};
    line-height: ${lineHeight.large};
    width: 100%;
`;

const StyledHref = styled.a`
    color: ${purple[4]};
    display: inline-block;
    font-size: ${fontSize.large};
    margin-top: ${spacingUnit(2)};
    max-width: ${rem(520)};

    &:hover {
        color: ${green[0]};
    }
`;

const TransactionProggress: React.FC = () => {
    const { chainId } = useWeb3React<Web3Provider>();

    const {
        type: transactionType,
        value: transactionValue,
        hash: transactionHash,
        sent: transactionSent,
        completed: transactionCompleted,
        error: transactionError,
    } = useSelector((state: RootState) => state.transaction);

    if (transactionHash && transactionSent) {
        return (
            <React.Fragment>
                <Button type="link" size="large" style={{ color: purple[4] }}></Button>
                <StyledTextLarge>Transaction in progress...</StyledTextLarge>
                <div>
                    <Throbber />
                </div>
                <StyledHref
                    className="ellipsis"
                    target="_blank"
                    href={getEtherscanUrl(chainId as number, 'tx', transactionHash as string)}
                >
                    {transactionHash}
                </StyledHref>
            </React.Fragment>
        );
    }

    if (transactionCompleted && transactionType === 'deposit') {
        return (
            <React.Fragment>
                <AaveLogo width={48} />
                <StyledTextLarge>
                    <span>You've sucessfully purchased </span>
                    <span>
                        {transactionValue}&nbsp;Aave&nbsp;Pool&nbsp;
                        {pluralize('ticket', transactionValue as number)}&nbsp;!
                    </span>
                </StyledTextLarge>
                <StyledHref
                    className="ellipsis"
                    href={getEtherscanUrl(chainId as number, 'tx', transactionHash as string)}
                >
                    {transactionHash}
                </StyledHref>
            </React.Fragment>
        );
    }

    if (
        transactionCompleted &&
        (transactionType === 'withdrawWithTimelock' ||
            transactionType === 'withdrawInstantly' ||
            transactionType === 'redeem' ||
            transactionType === 'withdrawAndRedeemCollateral')
    ) {
        return (
            <React.Fragment>
                <AaveLogo width={48} />
                <StyledTextLarge>
                    <span>You've sucessfully withdrawn </span>
                    <span>
                        {transactionValue}&nbsp;Aave&nbsp;Pool&nbsp;
                        {pluralize('ticket', transactionValue as number)}
                    </span>
                </StyledTextLarge>
                <StyledHref
                    className="ellipsis"
                    href={getEtherscanUrl(chainId as number, 'tx', transactionHash as string)}
                >
                    {transactionHash}
                </StyledHref>
            </React.Fragment>
        );
    }

    if (transactionCompleted && transactionType === 'approve') {
        return <PurchaseTickets />;
    }

    if (!transactionSent && !transactionCompleted && transactionError) {
        return (
            <React.Fragment>
                <StyledTextLarge> An error occurred, please retry</StyledTextLarge>
                <StyledHref
                    href={getEtherscanUrl(chainId as number, 'tx', transactionHash as string)}
                >
                    {transactionHash}
                </StyledHref>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <TicketContainer>
                <Ticket />
            </TicketContainer>
            <StyledTextLarge>Please, approve the transaction in your wallet</StyledTextLarge>
        </React.Fragment>
    );
};

export default TransactionProggress;
