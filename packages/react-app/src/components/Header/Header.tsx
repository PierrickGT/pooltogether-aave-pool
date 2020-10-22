import React, { useEffect, useState } from 'react';
import { CloseCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { useWeb3React } from '@web3-react/core';
import { Button, PageHeader } from 'antd';
import { utils } from 'ethers';
import pluralize from 'pluralize';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { RootState } from 'app/rootReducer';
import { DEFAULT_TOKEN_DECIMAL_PRECISION, NETWORK_CHAIN_ID } from 'Constants';
import { getWalletName } from 'helpers/Network';
import { getUserTicketsBalance } from 'helpers/Pool';
import AaveBanner from 'images/AaveBanner';
import PoolTogetherLogo from 'images/PoolTogetherLogo';

const StyledPageHeader = styled(PageHeader)`
    color: white;

    .ant-page-header-heading-sub-title {
        color: white;
    }

    .ant-page-header-heading {
        align-items: center;
    }

    .ant-page-header-heading-left,
    .ant-page-header-heading-extra {
        margin: 0;
    }

    .ant-page-header-heading-extra {
        align-items: center;
        display: flex;
        height: 66px;
    }
`;

const StyledWalletInfo = styled.div`
    text-align: right;
`;

const Title = () => {
    return (
        <React.Fragment>
            <PoolTogetherLogo />
            <CloseOutlined style={{ color: 'white', padding: '0 8px', verticalAlign: 'middle' }} />
            <AaveBanner width={150} />
        </React.Fragment>
    );
};

interface HeaderProps {
    toggleWalletModal: () => void;
}

const ToggleWalletModalButton: React.FC<HeaderProps> = ({ toggleWalletModal }): any => {
    const {
        account,
        active: walletConnected,
        chainId,
        connector: walletProvider,
        deactivate: disconnectWallet,
        library,
    } = useWeb3React();

    const { completed: transactionCompleted } = useSelector(
        (state: RootState) => state.transaction,
    );

    const [userBalance, setUserBalance] = useState(0);

    useEffect(() => {
        if (walletConnected) {
            const calculateBalance = async () => {
                const userBalance = await getUserTicketsBalance(
                    account as string,
                    chainId as number,
                    library,
                );

                const formattedUserBalance = Number(
                    utils.formatUnits(userBalance.toString(), DEFAULT_TOKEN_DECIMAL_PRECISION),
                );

                setUserBalance(formattedUserBalance);
            };

            calculateBalance();
        }
    }, [account, chainId, library, transactionCompleted, walletConnected]);

    return walletConnected ? (
        <StyledWalletInfo>
            <div className="inline-block margin-right-double vertical-align-middle">
                <p className="ellipsis no-margin">
                    {account &&
                        account.substr(0, 6) +
                            '...' +
                            account.substr(account.length - 4, account.length)}
                </p>
                <p className="no-margin">
                    {walletProvider && (
                        <span className="margin-right">{getWalletName(walletProvider)}</span>
                    )}
                    {chainId && <span>{NETWORK_CHAIN_ID[chainId]}</span>}
                </p>
                <p className="no-margin">{`You have ${userBalance.toFixed(2)} Aave Pool ${pluralize(
                    'ticket',
                    userBalance,
                )}`}</p>
            </div>
            <CloseCircleOutlined onClick={disconnectWallet} style={{ fontSize: '16px' }} />
        </StyledWalletInfo>
    ) : (
        <Button type="primary" onClick={toggleWalletModal}>
            Connect wallet
        </Button>
    );
};

const Header: React.FC<HeaderProps> = ({ toggleWalletModal }) => {
    return (
        <div>
            <StyledPageHeader
                title={<Title />}
                extra={[<ToggleWalletModalButton key="1" toggleWalletModal={toggleWalletModal} />]}
            />
        </div>
    );
};

export default Header;
