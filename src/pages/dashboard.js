import React, { Component } from 'react';
import axios from "axios";
import {
    Row,
    Col
} from 'reactstrap';
import { connect } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPowerOff,faFilter } from '@fortawesome/free-solid-svg-icons'
import { Pie ,Bar ,Line } from 'react-chartjs-2';
import DataTable from 'react-data-table-component';

class dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pieBarData:{},
            LineData:{},
            tabelData:[],
            itemFilter:[]
        };
        this.handleInputChange = this.handleInputChange.bind(this);
    }
    componentDidMount = () => {
        this.fetchData()
    }
    fetchData = () =>{
        const dataToSend = {
            ITEMFILTER:this.state.itemFilter
        };
        axios
        .post(`${process.env.REACT_APP_LINK}/avowstest/getSales`, dataToSend, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            'Authorization': `Bearer ${this.props.token}`
        }
        })
        .then(async result => {
            this.processPieBarData(result.data.result)
            this.processLineData(result.data.result)
            this.setState({
                ...this.state,
                tabelData:result.data.result
            });
        })
        .catch(error => {
            console.log(error);
            console.log(this.props);
        });
    }
    processPieBarData = (data) =>{
        let groupData=data.filter((v,i,a)=>a.findIndex(t=>(t.id_item === v.id_item))===i)
        let labelData = []
        let dataChart = []
        for (let i1 = 0; i1 < groupData.length; i1++) {
            labelData.push(`${groupData[i1].nama_item}`)
            let qtySales = 0
            for (let i2 = 0; i2 < data.length; i2++) {
                groupData[i1].id_item == data[i2].id_item && qtySales++
            }
            dataChart.push(qtySales)
            qtySales = 0
        }
        let newData = {
            labels: labelData,
            datasets: [
              {
                label: 'Last 7 days sales',
                data: dataChart,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
              },
            ],
        }
        this.setState({
            ...this.state,
            pieBarData:newData
        });
    }
    processLineData = (data) =>{
        let backgroundColor= [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
        ]
        let borderColor=[
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
        ]
        let groupDataUnsort=data.filter((v,i,a)=>a.findIndex(t=>(t.date_sales === v.date_sales))===i)
        let groupDataItem=data.filter((v,i,a)=>a.findIndex(t=>(t.id_item === v.id_item))===i)
        let groupData = groupDataUnsort.sort(function(a, b){
            return new Date(a.date_sales) - new Date(b.date_sales)
        })
        let labelData = []
        let dataChart = []
        for (let i1 = 0; i1 < groupData.length; i1++) {
            labelData.push(`${groupData[i1].date_sales}`)
        }
        for (let i2 = 0; i2 < groupDataItem.length; i2++) {
            let dataSales = []
            for (let i3 = 0; i3 < groupData.length; i3++) {
                let salesFilter = data.filter(function(data) {
                    return data.id_item == groupDataItem[i2].id_item && data.date_sales == groupData[i3].date_sales;
                });
                dataSales.push(salesFilter.length)
            }
            dataChart.push({
                label: `${groupDataItem[i2].nama_item}`,
                data: dataSales,
                fill: false,
                backgroundColor: backgroundColor[i2],
                borderColor: borderColor[i2],
            })
        }
        let newData = {
            labels: labelData,
            datasets: dataChart,
        }
        this.setState({
            ...this.state,
            LineData:newData
        });
    }
    handleInputChange(event) {
        let target = event.target
        let value = target.value
        let DataTest = this.state.itemFilter
        if(target.checked){
        DataTest.push(value)
        this.setState({
            ...this.state,
            itemFilter: DataTest
        }); 
        }else{
        let isLargeNumber = (element) => element == value
        let dataKey = DataTest.findIndex(isLargeNumber)
        DataTest.splice(dataKey, 1)
        this.setState({
            ...this.state,
            itemFilter: DataTest
        }); 
        }
    }
    logout = async () =>{
        await localStorage.removeItem("userData");
        await this.props.dispatch({ type: "SETTOKEN", payload: "login" });
        await this.props.dispatch({ type: "SETUSERINFO", payload: null });
    }
    render() {
        const columns = [
            {
              name: 'Id Item',
              selector: 'id_item',
              sortable: true,
            },
            {
              name: 'Nama Item',
              selector: 'nama_item',
              sortable: true,
            },
            {
              name: 'Tanggal',
              selector: 'date_sales',
              sortable: true,
            },
        ];
        return (
            <div className="container-fluid">
                <Row>
                    <Col md="4" lg="2" style={{padding:0}}>
                        <div style={{width:"100%",height:"8vh",backgroundColor:"#1D1D1D"}}>
                            <div
                            style={{
                                padding: '24px',
                                textTransform: 'uppercase',
                                fontWeight: 'bold',
                                fontSize: 14,
                                letterSpacing: '1px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                textAlign:"center",
                                color:"#adadad"
                            }}
                            >
                                {'AVOWS-TEST'}
                            </div>
                        </div>
                        <div style={{width:"100%",height:"92vh",backgroundColor:"#1D1D1D"}}>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="itemFilter" id="checkbox1" value="1" onChange={this.handleInputChange} checked={this.state.itemFilter.includes("1")?true:false} />
                                <label className="form-check-label" for="inlineCheckboxh1" style={{color:"#fff"}}>Filter - Coffee</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="itemFilter" id="checkbox2" value="2" onChange={this.handleInputChange} checked={this.state.itemFilter.includes("2")?true:false} />
                                <label className="form-check-label" for="inlineCheckboxh2" style={{color:"#fff"}}>Turkey - Oven Roast Breast</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="itemFilter" id="checkbox3" value="3" onChange={this.handleInputChange} checked={this.state.itemFilter.includes("3")?true:false} />
                                <label className="form-check-label" for="inlineCheckboxh3" style={{color:"#fff"}}>Salmon - Sockeye Raw</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="itemFilter" id="checkbox4" value="4" onChange={this.handleInputChange} checked={this.state.itemFilter.includes("4")?true:false} />
                                <label className="form-check-label" for="inlineCheckboxh3" style={{color:"#fff"}}>Clementine</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="itemFilter" id="checkbox5" value="5" onChange={this.handleInputChange} checked={this.state.itemFilter.includes("5")?true:false} />
                                <label className="form-check-label" for="inlineCheckboxh3" style={{color:"#fff"}}>Wine - Barolo Fontanafredda</label>
                            </div>
                            <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                                <button className="btn btn-secondary btn-block" onClick={() => this.fetchData()}>
                                    <FontAwesomeIcon icon={faFilter} />
                                    <span style={{marginLeft:5,color:"#ffffff",fontWeight:"bold"}}>Filter</span>
                                </button>
                            </div>
                        </div>
                    </Col>
                    <Col md="8" lg="10" style={{padding:0}}>
                        <div style={{width:"100%",height:"8vh",backgroundColor:"#f8f9fa",display:"flex",flexDirection:"row"}}>
                            <div style={{height:"100%",width:"80%",display:"flex",justifyContent:"center",alignItems:"center"}}>
                            </div>
                            <div style={{height:"100%",width:"20%",display:"flex",flexDirection:"column"}}>
                                <div style={{height:"50%",width:"100%",display:"flex",justifyContent:"flex-end",alignItems:"center"}}>
                                    <span style={{fontWeight:"bold",marginRight:"10px"}}>{`Welcome, ${this.props.userinfo.nama_user}`}</span>
                                </div>
                                <div style={{height:"50%",width:"100%",display:"flex",justifyContent:"flex-end",alignItems:"center"}}>
                                    <button className="myBtn" onClick={() => this.logout()}>
                                        <FontAwesomeIcon icon={faPowerOff} />
                                        <span style={{marginLeft:5,color:"#000",fontWeight:"bold"}}>Log out</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div style={{width:"100%",height:"92vh",display:"flex",flexDirection:"column"}}>
                            <div style={{height:"40%",width:"100%",display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
                                <div style={{height:"100%",width:"33%",padding:20}}>
                                    <div className="card">
                                        <div className="card-header">
                                            <span style={{fontWeight:"bold"}}>Pie chart</span>
                                        </div>
                                        <div className="card-body">
                                            <Pie
                                                data={this.state.pieBarData} 
                                                width={"100%"}
                                                height={"200%"}
                                                redraw={false}
                                                options={{ maintainAspectRatio: false }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div style={{height:"100%",width:"33%",padding:20}}>
                                    <div className="card">
                                        <div className="card-header">
                                            <span style={{fontWeight:"bold"}}>Bar chart</span>
                                        </div>
                                        <div className="card-body">
                                            <Bar
                                                data={this.state.pieBarData} 
                                                width={"100%"}
                                                height={"200%"}
                                                options={{ maintainAspectRatio: false }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div style={{height:"100%",width:"33%",padding:20}}>
                                    <div className="card">
                                        <div className="card-header">
                                            <span style={{fontWeight:"bold"}}>Line chart</span>
                                        </div>
                                        <div className="card-body">
                                            <Line
                                                data={this.state.LineData} 
                                                width={"100%"}
                                                height={"200%"}
                                                options={{ maintainAspectRatio: false }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{height:"50%",width:"100%",padding:20}}>
                                <div className="card">
                                    <div className="card-header">
                                        <span style={{fontWeight:"bold"}}>Tabel data</span>
                                    </div>
                                    <div className="card-body">
                                        <DataTable
                                            defaultSortField="title"
                                            columns={columns}
                                            data={this.state.tabelData}
                                            pagination={true}
                                            highlightOnHover={true}
                                            striped={false}
                                            // progressPending={this.state.loading}
                                            noHeader={true}
                                            fixedHeader={false}
                                            fixedHeaderScrollHeight="300px"
                                            paginationPerPage={5}
                                            paginationRowsPerPageOptions={[5]}
                                        />
                                    </div>
                                </div>
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
        token: state.reducer.token,
        userinfo: state.reducer.userinfo
    };
  };
  
export default connect(mapStateToProps)(dashboard);