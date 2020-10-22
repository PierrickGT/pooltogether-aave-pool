import React, { useEffect, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Button } from 'antd';
import { Form, Formik } from 'formik';
import { rem } from 'polished';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { RootState } from 'app/rootReducer';
import TransactionProgress from 'components/Transaction';
import { unlockDai } from 'helpers/Dai';
import Lock from 'images/Lock';
import { purple } from 'styles/colors';
import { lineHeight, size as fontSize } from 'styles/fonts';
import { spacingUnit } from 'styles/variables';

const LockContainer = styled.div`
    align-items: center;
    background-color: ${purple[4]};
    border-radius: 50%;
    display: flex;
    height: ${rem(96)};
    justify-content: center;
    margin: 0 auto ${spacingUnit(3)};
    width: ${rem(96)};
`;

const StyledText = styled.p`
    font-size: ${fontSize.large};
    letter-spacing: ${rem(2)};
    line-height: ${lineHeight.large};
    margin: 0 auto ${spacingUnit(3)};
    max-width: ${rem(410)};
    width: 100%;
`;

export const useUnlockedDai = () => {
    const [isDaiUnlocked, setDaiUnlocked] = useState(false);

    return {
        isDaiUnlocked,
        setDaiUnlocked,
    };
};

const UnlockDai: React.FC = () => {
    const { account, chainId, library } = useWeb3React<Web3Provider>();

    const { setDaiUnlocked } = useUnlockedDai();
    const [formSubmitted, setFormSubmitted] = useState(false);

    const UnlockDaiForm: React.FC = () => {
        const { completed: transactionCompleted } = useSelector(
            (state: RootState) => state.transaction,
        );

        const dispatch = useDispatch();

        const handleSubmit = () => {
            unlockDai(account as string, chainId as number, library, dispatch);
            setFormSubmitted(true);
        };

        useEffect(() => {
            if (transactionCompleted) {
                setDaiUnlocked(true);
            }
        }, [transactionCompleted]);

        return (
            <Formik initialValues={{}} onSubmit={handleSubmit}>
                {(props) => (
                    <Form>
                        <LockContainer>
                            <Lock />
                        </LockContainer>
                        <StyledText>
                            PoolTogether requires your approval to transact DAI with the Pool
                        </StyledText>
                        <Button htmlType="submit" type="primary" size="large">
                            Allow DAI
                        </Button>
                    </Form>
                )}
            </Formik>
        );
    };

    if (formSubmitted) {
        return <TransactionProgress />;
    }

    return <UnlockDaiForm />;
};

export default UnlockDai;
