import React from "react";
import { useSelector } from "react-redux";
import 'semantic-ui-css/semantic.min.css';
import { Grid, GridColumn, GridRow } from "semantic-ui-react";
import IssuersList from "./IssuersList";
import InvestorsList from "./InvestorsList";
import IssuerRequierement from "./IssuerRequierement";
import AccountCheck from "./AccountCheck";
import "../manager.css";
import "../users.css";

function ManagerRequests() {
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
                            <IssuerRequierement />
                            <AccountCheck />
                        </GridColumn>
                        <GridColumn width={12}>
                            <IssuersList />
                            <InvestorsList />
                        </GridColumn>
                    </GridRow>
                </Grid>
            </div>
        </div>
    );
}

export default ManagerRequests;