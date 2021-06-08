import React, { Component } from 'react';
import './App.css';
import { Provider } from "react-redux";
import store from "./redux/store";
import Auth from './auth';

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Auth />
            </Provider>
        );
    }
}

export default App;
