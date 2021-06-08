import React, { Component } from 'react';
import axios from "axios";
import { connect } from "react-redux";
import LoadingRoutes from './routes/LoadingRoutes';
import Login from './pages/login';
import Main from './pages/main';
import { HashRouter as Router } from "react-router-dom";

class Auth extends Component {
    componentDidMount = () =>  {
        let prmLogin = localStorage.getItem("userData")
        if(prmLogin===null){
            this.props.dispatch({ type: "SETTOKEN", payload: "login" });
        } else {
            const dataToSend = {
              EMAIL: prmLogin
            };
            axios
            .post(`${process.env.REACT_APP_LINK}/avowstest/getToken`, dataToSend, {
              headers: {
                "Access-Control-Allow-Origin": "*"
              }
            })
            .then(async result => {
              if(result.data.status === "00"){
                await this.setState({
                  ...this.state,
                  buttonLoginPrm:false,
                  buttonLoginText:"Login"
                });
                let userData = Buffer.from(`${result.data.dataUSer.email_user}`).toString('base64')
                await localStorage.setItem("userData",userData)
                await this.props.dispatch({ type: "SETUSERINFO", payload: result.data.dataUSer });
                this.props.dispatch({ type: "SETTOKEN", payload: result.data.access_token });
              } else {
                await localStorage.removeItem("userData");
                await this.props.dispatch({ type: "SETTOKEN", payload: "login" });
                await this.props.dispatch({ type: "SETUSERINFO", payload: null });
                alert(result.data.pesan)
              }
            })
            .catch(error => {
              console.log(error);
              console.log(this.props);
            });
        } 
    }
    render() {
        if(this.props.token === null){
            return(
                <Router>
                    <LoadingRoutes />
                </Router>
            )
        } else if(this.props.token === "login"){
            return(
                <Router>
                    <Login />
                </Router>
            )
        } else{
            return(
                <Router>
                    <Main />
                </Router>
            )
        }
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.reducer.token
    };
};
  
export default connect(mapStateToProps)(Auth);