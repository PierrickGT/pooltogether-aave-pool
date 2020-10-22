import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router-dom';

import App from './App';
import { history } from './rootReducer';

const routing = (
    <ConnectedRouter history={history}>
        <Switch>
            <Route exact path="/" component={App} />
        </Switch>
    </ConnectedRouter>
);

export default routing;
