import React from "react";
import { useSelector } from "react-redux";
import 'semantic-ui-css/semantic.min.css';
import { Grid, GridColumn, GridRow } from "semantic-ui-react";
import "../manager.css";
import AccountCheck from "./AccountCheck";
import DealSideBar from "./DealSideBar";
import ManagerListOfDeals from "./ManagerListOfDeals";

function ManagerDeals() {
    let connection = useSelector(state => {
        return state.connection;
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
                        <GridColumn width={4}>
                            <DealSideBar />
                            <AccountCheck />
                        </GridColumn>
                        <GridColumn width={12}>
                            <ManagerListOfDeals />
                        </GridColumn>
                    </GridRow>
                </Grid>
            </div>
        </div>
    );
}

export default ManagerDeals;