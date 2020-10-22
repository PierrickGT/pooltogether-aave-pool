import { combineReducers } from '@reduxjs/toolkit';
import { connectRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';

import transactionReducer from 'helpers/sendTransactionSlice';

export const history = createBrowserHistory();

const rootReducer = combineReducers({
    router: connectRouter(history),
    transaction: transactionReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
