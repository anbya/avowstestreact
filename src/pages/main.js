import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Redirect, Route, Switch } from 'react-router-dom';
// pages
import Dashboard from './dashboard';
// pages --

class main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            navCollapse:false,
            fixedNav:"",
            dropdownState:false,
            sideBarState:false,
            outlet:""
        };
        this.baseState = {
            data:[],
            navCollapse:false,
            fixedNav:"",
            dropdownState:false,
            sideBarState:false,
            outlet:""
        };
    }
    componentDidMount = () => {
        let dataOutlet = JSON.parse(localStorage.getItem("outlettoken"))
        this.setState({
            ...this.state,
            outlet:dataOutlet
        })
    }
    sidebarToggle = () =>  {
      this.setState({
        ...this.state,
        sideBarState: !this.state.sideBarState
      });
    }
    logout = async () =>{
        await localStorage.removeItem("authToken");
        await this.props.dispatch({ type: "SETAUTHTOKEN", payload: "login" });
        await this.props.dispatch({ type: "SETUSERINFO", payload: null });
        this.props.history.push({
            pathname: "/"
        })
    }
    render() {
        return (
            <Switch>
                <Route exact path={"/"} component={Dashboard} />
                <Redirect to={"/"} />
            </Switch>
        );
    }
}

const mapStateToProps = (state) => {
    return {
      authToken: state.reducer.authToken,
      userinfo: state.reducer.userinfo
    };
  };
  
  export default withRouter(connect(mapStateToProps)(main));