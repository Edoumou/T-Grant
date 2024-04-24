import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Grid, GridColumn, GridRow } from "semantic-ui-react";
import IssueIRS from "./IssueIRS";

function IRS() {
    const connection = useSelector(state => {
        return state.connection;
    });

    return (
        <div  className="manager">
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
                        <GridColumn width={5}>
                            <IssueIRS />
                        </GridColumn>
                        <GridColumn width={11}>
                            Col2
                        </GridColumn>
                    </GridRow>
                </Grid>
            </div>
        </div>
    );
}

export default IRS;