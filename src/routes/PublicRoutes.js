import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Login from '../pages/login';

function PublicRoutes() {
    return (
        <Switch>
            <Route exact path={"/"} component={Login} />
            <Redirect to={"/"} />
        </Switch>
    );
}

export default PublicRoutes;
