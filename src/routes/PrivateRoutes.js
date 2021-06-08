import React, { lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Main from '../pages/main';

function PrivateRoutes() {
    return (
        <Switch>
            <Route exact path={"/"} component={Main} />
            <Redirect to={"/"} />
        </Switch>
    );
}

export default PrivateRoutes;
