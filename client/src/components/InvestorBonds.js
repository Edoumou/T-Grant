import React from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardDescription, CardMeta, Grid, GridColumn, GridRow, Image } from "semantic-ui-react";
import Formate from "../utils/Formate";
import "../users.css";
import "../manager.css";

function InvestorBonds() {
    const connection = useSelector(state => {
        return state.connection;
    });

    const bonds = useSelector(state => {
        return state.investor.investorBonds;
    });

    const issuers = useSelector(state => {
        return state.investor.investorBondsIssuers;
    });

    const renderedBonds = bonds.map((bond, index) => {
        return (
            <span className="bond-card" key={index}>
                <Card>
                    <CardContent>
                        <Image
                            floated='left'
                            size='tiny'
                            src={issuers[index].logoURI}
                        />
                        
                        <div className="bond-head">
                            <strong>{issuers[index].name}</strong>
                        </div>
                        <br></br>
                        <CardMeta textAlign='right'><strong>{bonds[index].name}</strong></CardMeta>
                        <br></br>
                        <hr></hr>
                        <br></br>
                        <CardDescription className="card-desc" textAlign='left'>
                            isin: <span style={{ paddingLeft: 5, color:'grey' }}><strong>{bonds[index].isin}</strong></span> 
                            <br></br>
                            <br></br>
                            coupon rate: <span style={{ paddingLeft: 5, color:'grey' }}><strong>{bonds[index].couponRate / 100}%</strong></span>
                            <br></br>
                            <br></br>
                            denomination: <span style={{ paddingLeft: 5, color:'grey' }}><strong>{Formate(bonds[index].denomination)} {bonds[index].tokenSymbol}</strong></span>
                            <br></br>
                            <br></br>
                            coupon frequency: <span style={{ paddingLeft: 5, color:'grey' }}><strong>{bonds[index].couponFrequency}</strong></span>
                            <br></br>
                            <br></br>
                            maturity date: <span style={{ paddingLeft: 5, color:'grey' }}>
                                    <strong>
                                        {(new Date(bonds[index].maturityDate * 1000)).toLocaleDateString()}
                                    </strong>
                                </span>
                            <br></br>
                            <br></br>
                            Balance: <span style={{ paddingLeft: 5, color:'grey' }}><strong>{Formate(bonds[index].principal / bonds[index].denomination)} {bonds[index].symbol}</strong></span>
                            <br></br>
                            <br></br>
                            <hr></hr>
                            <br></br>
                            Principal: <span style={{ paddingLeft: 5, color: 'purple' }}><strong>{Formate(bonds[index].principal)} {bonds[index].tokenSymbol}</strong></span>
                        </CardDescription>
                    </CardContent>  
                </Card>
            </span>
        );
    });

    return (
        <div className="manager">
            <div className="manager-head">
                <Grid columns={2}>
                    <GridRow>
                        <GridColumn textAlign="left">
                            <strong>{connection.role}</strong>
                        </GridColumn>
                        <GridColumn textAlign="right">
                            <strong>{Number(connection.balance).toFixed(2)} TOPOS</strong>
                        </GridColumn>
                    </GridRow>
                </Grid>
            </div>
            <div className="manager-body">
                <Grid stackable columns={2}>
                    <GridRow>
                        <GridColumn width={11}>
                            <div className="user-bond-list ">
                                <Grid stackable textAlign="right">
                                    {renderedBonds}
                                </Grid>
                            </div>
                        </GridColumn>
                        <GridColumn width={5}>
                            Transfer Deals
                        </GridColumn>
                    </GridRow>
                </Grid>
            </div>
        </div>
    );
}

export default InvestorBonds;