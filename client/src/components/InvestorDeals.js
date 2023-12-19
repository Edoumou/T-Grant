import React from "react";
import { useSelector } from "react-redux";
import 'semantic-ui-css/semantic.min.css';
import { Grid, GridRow, GridColumn } from "semantic-ui-react";
import InvestInDeal from "./InvestInDeal";
import ListOfApprovedDeals from "./ListOfApprovedDeals";
import InvestorRegisteredDeals from "./InvestorRegisteredDeals";
import InvestorDealSideBar from "./InvestorDealSideBar";
import "../users.css";
import "../manager.css";

function InvestorDeals() {
    const connection = useSelector(state => {
        return state.connection;
    });

    const bonds = useSelector(state => {
        return state.bond;
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
                        <GridColumn width={12}>
                            <ListOfApprovedDeals />
                            <InvestorRegisteredDeals />
                        </GridColumn>
                        <GridColumn width={4}>
                            {
                                bonds.showInvestForm ?
                                    <>
                                        <InvestInDeal />
                                        <br></br>
                                        <InvestorDealSideBar />
                                    </>
                                :
                                    <>
                                        <InvestorDealSideBar />
                                    </>
                            }
                        </GridColumn>
                    </GridRow>
                </Grid>
            </div>
        </div>
    );
}

export default InvestorDeals;