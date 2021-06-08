import React, { Component } from 'react';
import axios from "axios";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import validator from 'validator'
import '../shadow.css';
import {
    Input,
    Row,
    Col,
    FormGroup,
    Label
} from 'reactstrap';
import { ScaleLoader } from 'react-spinners';

class login extends Component {
    constructor(props) {
      super(props);
      this.state = {
          loginEmail:"",
          loginPass:"",
          prmInputEmail:null,
          buttonLoginPrm:false,
          buttonLoginText:"Login",
      };
    }
    loginCheck = async () =>{
        const dataToSend = {
            EMAIL:this.state.loginEmail,
            PASS:this.state.loginPass
        };
        if(dataToSend.NIK === "" || dataToSend.PASS === ""){
            alert("Isi semua field !")
        } else if(this.state.prmInputEmail===false){
            alert("Isi email dengan benar !")
        } else {
            this.setState({
            ...this.state,
            buttonLoginPrm:true,
            buttonLoginText:""
            });
            axios
            .post(`${process.env.REACT_APP_LINK}/avowstest/login`, dataToSend, {
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
            })
            .then(async result => {
                console.log(result);
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
                    this.setState({
                    ...this.state,
                    buttonLoginPrm:false,
                    buttonLoginText:"Login"
                    });
                    alert(result.data.pesan)
                }
            })
            .catch(error => {
            console.log(error);
            console.log(this.props);
            });
        }
    }
    handleChange = event =>  {
      this.setState({
        ...this.state,
        [event.target.name]: event.target.value
      });
    }
    handleChangeEmail = event =>  {
        if (validator.isEmail(event.target.value)) {
            this.setState({
              ...this.state,
              [event.target.name]: event.target.value,
              prmInputEmail:true
            });
        } else {
            this.setState({
              ...this.state,
              [event.target.name]: event.target.value,
              prmInputEmail:false
            });
        }
    }
    render() {
        return (
            <div className="container-fluid" style={{backgroundColor:"#ecf0f5"}}>
                <Row className="justify-content-center align-items-center" style={{height:"100vh"}}>
                    <Col xs="10" sm="10" md="6">
                        <div className="card shadow-diffuse">
                            <div className="card-body">
                                <Row style={{marginTop:"6vh",marginBottom:"3vh"}}>
                                    <Col>
                                        <div className="d-flex flex-column justify-content-center align-items-center">
                                            <span style={{fontWeight:"bold",fontSize:"18pt"}}>ANBYA ARMY ALI</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row style={{marginTop:"3vh",marginBottom:"6vh"}}>
                                    <Col>
                                        <div className="d-flex flex-column justify-content-center align-items-center">
                                            <blockquote className="blockquote text-center">
                                                <footer className="blockquote-footer"><cite title="Source Title" style={{textAlign:"center"}}>AVOWS Test React</cite></footer>
                                            </blockquote>
                                        </div>
                                    </Col>
                                </Row>
                                <Row style={{marginBottom:"4vh"}}>
                                    <Col>
                                        <FormGroup>
                                            <Label for="loginEmail">Email</Label>
                                            <Input
                                                type="email"
                                                name="loginEmail"
                                                id="loginEmail"
                                                value={this.state.loginEmail}
                                                onChange={this.handleChangeEmail}
                                                placeholder="Input Email"
                                                disabled={this.state.buttonLoginPrm===true?true:false}
                                                valid={this.state.prmInputEmail===null?false:this.state.prmInputEmail===true?true:false}
                                                invalid={this.state.prmInputEmail===null?false:this.state.prmInputEmail===true?false:true}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row style={{marginTop:"4vh",marginBottom:"4vh"}}>
                                    <Col>
                                        <FormGroup>
                                            <Label for="loginPass">Password</Label>
                                            <Input
                                                type="password"
                                                name="loginPass"
                                                id="loginPass"
                                                value={this.state.loginPass}
                                                onChange={this.handleChange}
                                                placeholder="Input Password"
                                                disabled={this.state.buttonLoginPrm===true?true:false}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row style={{marginTop:"4vh",marginBottom:"4vh"}}>
                                    <Col className="d-grid gap-2">
                                        <button className="btn btn-outline-dark btn-lg" onClick={() => this.loginCheck()}>
                                        <ScaleLoader
                                            height={18}
                                            width={4}
                                            radius={2}
                                            margin={2}
                                            color={'#FFFFFF'}
                                            loading={this.state.buttonLoginPrm}
                                        />
                                        {this.state.buttonLoginText}
                                        </button>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
  return {
    authToken: state.reducer.authToken
  };
};

export default withRouter(connect(mapStateToProps)(login));