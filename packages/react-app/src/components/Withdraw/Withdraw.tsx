import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Button, Checkbox, Input } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { utils } from 'ethers';
import {
    ErrorMessage,
    Field,
    FieldInputProps,
    Form,
    Formik,
    FormikErrors,
    FormikHelpers,
    FormikProps,
} from 'formik';
import pluralize from 'pluralize';
import { rem } from 'polished';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import * as Yup from 'yup';

import TransactionProgress from 'components/Transaction';
import { DEFAULT_TOKEN_DECIMAL_PRECISION, TYPE_DEBOUNCE_TIMEOUT } from 'Constants';
import { formatBigNumberToNumber } from 'helpers/Bignumber';
import {
    calculateInstantWithdrawAmount,
    getUserExitFees,
    getUserTicketsBalance,
    getUserTimelockDuration,
    withdrawInstantly,
    withdrawWithTimelock,
} from 'helpers/Pool';
import PoolTogetherToken from 'images/PoolTogetherToken';
import { green, purple, red, yellow } from 'styles/colors';
import { size as fontSize } from 'styles/fonts';
import { spacingUnit } from 'styles/variables';

const StyledCurrency = styled.p`
    display: inline;
    font-size: ${fontSize.medium};
    font-weight: bold;
    margin: 0 0 0 ${spacingUnit()};
    vertical-align: middle;
`;

const StyledLabelContainer = styled.span`
    color: white;
    display: flex;
    font-size: ${fontSize.medium};
    justify-content: space-between;
    padding: ${spacingUnit()} ${spacingUnit(2)};
`;

const StyledBalance = styled.span`
    cursor: pointer;

    &:hover {
        color: ${green[0]};
    }
`;

const StyledInput = styled(Input as any)`
    background-color: ${purple[4]};
    border-radius: 16px;
    color: white;
    font-size: ${fontSize.extraLarge};
    height: ${rem(62)};
    line-height: ${rem(42)};
    padding: ${spacingUnit()} ${spacingUnit(2)};
    width: 100%;

    input {
        background-color: ${purple[4]};
        border-color: transparent;
        color: white;
        font-size: ${fontSize.extraLarge};
    }

    &:hover,
    &:focus {
        border-color: ${green[0]};
    }
`;

const InputContainer = styled.div`
    flex: 1;
`;

const WithdrawInstantContainer = styled.div`
    height: ${rem(65)};
    text-align: left;
`;

const StyledCheckbox = styled(Checkbox)`
    color: ${yellow[0]};
    font-size: ${fontSize.h4};
    padding: ${spacingUnit()} 0 0 ${spacingUnit(2)};

    .ant-checkbox {
        .ant-checkbox-inner {
            border-color: ${yellow[1]};
        }
    }

    .ant-checkbox.ant-checkbox-checked {
        .ant-checkbox-inner {
            background-color: ${yellow[1]};
            border-color: ${yellow[1]};
        }
    }
`;

const StyledWithdrawMessage = styled.p`
    color: ${yellow[0]};
    font-size: ${fontSize.medium};
    margin: ${spacingUnit()} 0 0;
    text-align: right;
`;

const StyledErrorMessage = styled(ErrorMessage)`
    color: ${red[0]};
    margin: ${spacingUnit()} 0 0 ${spacingUnit(2)};
    text-align: left;
`;

const InputTicketSuffix: React.FC = () => {
    return (
        <React.Fragment>
            <PoolTogetherToken width={25} />
            <StyledCurrency>TICKET</StyledCurrency>
        </React.Fragment>
    );
};

const StyledForm = styled(Form)`
    display: flex;
    flex-direction: column;
    min-height: ${rem(254)};
`;

const SubmitButtonContainer = styled.div`
    align-items: flex-end;
    display: flex;
    flex: 1;
    justify-content: flex-end;
    margin-top: ${spacingUnit(2)};
`;

const Withdraw: React.FC = (): any => {
    const { account, chainId, library } = useWeb3React<Web3Provider>();

    const dispatch = useDispatch();

    const [userTicketsBalance, setUserTicketsBalance] = useState(0);

    const [timelockDuration, setTimelockDuration] = useState(0); // in seconds
    const [timelockBurnedCredit, setTimelockBurnedCredit] = useState(0);

    const [burnedCredit, setBurnedCredit] = useState(0);
    const [exitFee, setExitFee] = useState(0);

    const [instantWithdrawAmount, setInstantWithdrawAmount] = useState(0);
    const [isWithdrawInstant, setIsWithdrawInstant] = useState(false);

    const [formSubmitted, setFormSubmitted] = useState(false);

    interface FormValues {
        withdraw: string | number;
    }

    const formInitialValues: FormValues = {
        withdraw: '',
    };

    const ticketInputValidationSchema = Yup.object({
        withdraw: Yup.number()
            .min(1, 'The value must be superior to 0')
            .max(userTicketsBalance, "You don't have enough tickets")
            .required('Enter the amount of tickets you wish to withdraw'),
    });

    type DaInput = {
        field: FieldInputProps<string>;
        form: FormikProps<FormValues>;
        title: string;
        type: string;
    };

    const RenderTicketInput: React.FC<DaInput> = ({
        field: { name: fieldName, ...fieldRest },
        form,
        title,
        type,
    }) => {
        let timeoutRef = useRef(null) as MutableRefObject<null | NodeJS.Timeout>;

        const setUserTimelockDuration = async (formValues: FormValues) => {
            const userTimelockDuration = await getUserTimelockDuration(
                Number(formValues.withdraw),
                account as string,
                chainId as number,
                library,
            );

            const { burnedCredit, durationSeconds } = userTimelockDuration;

            const formattedUserTimelockBurnedCredit = formatBigNumberToNumber(burnedCredit);
            const formattedUserTimelockDuration = formatBigNumberToNumber(durationSeconds, 2);

            setTimelockDuration(formattedUserTimelockDuration);
            setTimelockBurnedCredit(formattedUserTimelockBurnedCredit);
        };

        const setInstantWithdrawValues = async (formValues: FormValues) => {
            const userExitFee = await getUserExitFees(
                Number(formValues.withdraw),
                account as string,
                chainId as number,
                library,
            );

            const { burnedCredit, exitFee } = userExitFee;

            const formattedInstantWithdrawAmount = formatBigNumberToNumber(
                calculateInstantWithdrawAmount(Number(formValues.withdraw), exitFee),
            );

            const formattedExitFee = formatBigNumberToNumber(exitFee);
            const formattedBurnedCredit = formatBigNumberToNumber(burnedCredit);

            setBurnedCredit(formattedBurnedCredit);
            setExitFee(formattedExitFee);
            setInstantWithdrawAmount(formattedInstantWithdrawAmount);
        };

        const handleInput = (
            event: React.ChangeEvent<HTMLInputElement>,
            formValues: FormValues,
        ) => {
            // User can only input round numbers
            event.target.value = event.target.value.slice(0, Infinity);
        };

        const handleMaxBalance = () => {
            form.setFieldValue(fieldName, userTicketsBalance);
        };

        const handleInstantWithdraw = async (
            event: CheckboxChangeEvent,
            formValues: FormValues,
        ) => {
            await setInstantWithdrawValues(formValues);
            setIsWithdrawInstant(!isWithdrawInstant);
        };

        useEffect(() => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(async () => {
                if (isWithdrawInstant) {
                    setInstantWithdrawValues(form.values);
                } else {
                    setUserTimelockDuration(form.values);
                }
            }, TYPE_DEBOUNCE_TIMEOUT);
        }, [form.values, form.values.withdraw, timeoutRef]);

        const fieldHasErrors = form.errors[fieldName as keyof FormikErrors<FormValues>];

        return (
            <React.Fragment>
                <InputContainer>
                    <StyledLabelContainer>
                        <label htmlFor={fieldName}>{title}</label>
                        <StyledBalance
                            onClick={handleMaxBalance}
                        >{`Max - Balance: ${userTicketsBalance}`}</StyledBalance>
                    </StyledLabelContainer>
                    <StyledInput
                        {...fieldRest}
                        type={type}
                        id={fieldName}
                        name={fieldName}
                        onInput={(event: React.ChangeEvent<HTMLInputElement>) =>
                            handleInput(event as React.ChangeEvent<HTMLInputElement>, form.values)
                        }
                        size="large"
                        style={fieldHasErrors && { borderColor: `${red[0]}` }}
                        suffix={<InputTicketSuffix />}
                    />
                    <StyledErrorMessage name={fieldName} component="div" />
                </InputContainer>
                <WithdrawInstantContainer>
                    <StyledCheckbox
                        checked={isWithdrawInstant}
                        onChange={(event) => handleInstantWithdraw(event, form.values)}
                    >
                        Withdraw instantly
                    </StyledCheckbox>
                    {isWithdrawInstant && Number(form.values.withdraw) > 0 && (
                        <StyledWithdrawMessage>
                            You will receive {instantWithdrawAmount.toFixed(2)} Aave Pool{' '}
                            {pluralize('ticket', instantWithdrawAmount)}{' '}
                            {exitFee === 0 ? (
                                <React.Fragment>
                                    now and burn {burnedCredit} from your credit
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    and forfeit {exitFee.toFixed(2)} as interest
                                </React.Fragment>
                            )}
                        </StyledWithdrawMessage>
                    )}
                    {!isWithdrawInstant && Number(form.values.withdraw) > 0 && (
                        <StyledWithdrawMessage>
                            You will receive {Number(form.values.withdraw)} Aave Pool{' '}
                            {pluralize('ticket', instantWithdrawAmount)}{' '}
                            {timelockDuration === 0 ? (
                                <React.Fragment>
                                    now and burn {timelockBurnedCredit} from your credit
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    in {parseInt(timelockDuration.toString(), 10)} seconds and burn{' '}
                                    {timelockBurnedCredit} from your credit
                                </React.Fragment>
                            )}
                        </StyledWithdrawMessage>
                    )}
                </WithdrawInstantContainer>
            </React.Fragment>
        );
    };

    const RenderForm: React.FC<{ values: FormValues }> = ({ values }) => (
        <StyledForm>
            <Field
                component={RenderTicketInput}
                type="number"
                name="withdraw"
                title="How many tickets do you wish to withdraw?"
            />
            <SubmitButtonContainer>
                <Button htmlType="submit" type="primary" size="large">
                    {`Withdraw ${values.withdraw} Aave Pool ${pluralize(
                        'ticket',
                        Number(values.withdraw),
                    )}`}
                </Button>
            </SubmitButtonContainer>
        </StyledForm>
    );

    const handleSubmit = (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
        if (isWithdrawInstant) {
            withdrawInstantly(
                Number(values.withdraw),
                account as string,
                chainId as number,
                library,
                dispatch,
            );
        } else {
            withdrawWithTimelock(
                Number(values.withdraw),
                account as string,
                chainId as number,
                library,
                dispatch,
            );
        }

        setFormSubmitted(true);
    };

    const getAsyncValues = async () => {
        const userTicketsBalance = await getUserTicketsBalance(
            account as string,
            chainId as number,
            library,
        );

        const formattedUserTicketsBalance = Number(
            utils.formatUnits(userTicketsBalance.toString(), DEFAULT_TOKEN_DECIMAL_PRECISION),
        );

        setUserTicketsBalance(formattedUserTicketsBalance);
    };

    // We only get these values when the modal open or if the account changes
    useEffect(() => {
        getAsyncValues();
    }, [account]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <React.Fragment>
            <Formik
                initialValues={formInitialValues}
                onSubmit={handleSubmit}
                validationSchema={ticketInputValidationSchema}
                validateOnBlur
            >
                {({ values }) =>
                    !formSubmitted ? <RenderForm values={values} /> : <TransactionProgress />
                }
            </Formik>
        </React.Fragment>
    );
};

export default Withdraw;
