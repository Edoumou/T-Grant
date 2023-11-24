import React from "react";
import "../users.css";
import "../manager.css";
import { Grid, GridColumn, GridRow } from "semantic-ui-react";
import { useSelector } from "react-redux";
import IssuerRequierement from "./IssuerRequierement";
import AccountCheck from "./AccountCheck";
import IssuersList from "./IssuersList";
import InvestorsList from "./InvestorsList";
import SelectDealToDeploy from "./SelectDealToDeploy";

function IssueBonds() {
    const connection = useSelector(state => {
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
                            <SelectDealToDeploy />
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

export default IssueBonds;