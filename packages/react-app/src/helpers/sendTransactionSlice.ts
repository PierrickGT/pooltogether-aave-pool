import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Contract, utils } from 'ethers';

import { AppThunk } from 'app/store';
import { DEFAULT_TOKEN_DECIMAL_PRECISION } from 'Constants';

export interface TransactionState {
    completed: boolean;
    error: boolean;
    hash: string | null;
    inWallet: boolean;
    sent: boolean;
    type: string | null;
    value?: number | null;
}

export const initialState: TransactionState = {
    completed: false,
    error: false,
    hash: null,
    inWallet: false,
    sent: false,
    type: null,
    value: null,
};

const transaction = createSlice({
    name: 'transaction',
    initialState,
    reducers: {
        sendTransactionStart(state, action: PayloadAction<number | undefined>) {
            state.inWallet = true;
            state.value = action.payload ? action.payload : null;
        },
        sendTransactionSuccess(state, action: PayloadAction<string>) {
            state.hash = action.payload;
            state.sent = true;
        },
        sendTransactionCompleted(state, action: PayloadAction<string>) {
            state.sent = false;
            state.completed = true;
            state.type = action.payload;
        },
        sendTransactionFailure(state) {
            state.completed = false;
            state.error = true;
            state.hash = null;
            state.inWallet = false;
            state.sent = false;
            state.type = null;
            state.value = null;
        },
        resetTransaction(state) {
            state.completed = false;
            state.error = false;
            state.hash = null;
            state.inWallet = false;
            state.sent = false;
            state.type = null;
            state.value = null;
        },
    },
});

export const {
    sendTransactionStart,
    sendTransactionSuccess,
    sendTransactionCompleted,
    sendTransactionFailure,
    resetTransaction,
} = transaction.actions;

export const sendTransaction = (
    transactionType: string,
    contract: Contract,
    methodName: string,
    params: any[] = [],
): AppThunk => async (dispatch) => {
    dispatch(resetTransaction());

    if (params && params[1] && params[1]._isBigNumber) {
        dispatch(
            sendTransactionStart(
                Number(utils.formatUnits(params[1].toString(), DEFAULT_TOKEN_DECIMAL_PRECISION)),
            ),
        );
    } else {
        dispatch(sendTransactionStart());
    }

    try {
        const newTransaction = await contract[methodName].apply(null, params);

        dispatch(sendTransactionSuccess(newTransaction.hash));

        await newTransaction.wait();

        dispatch(sendTransactionCompleted(transactionType));
    } catch (error) {
        console.error(error);

        dispatch(sendTransactionFailure());

        console.error(error.message);
    }
};

export default transaction.reducer;
