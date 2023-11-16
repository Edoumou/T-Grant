import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import 'semantic-ui-css/semantic.min.css';
import { Grid, GridColumn, GridRow } from "semantic-ui-react";
import IssuersList from "./IssuersList";
import "../manager.css";

function ManagerRequests() {
    let issuers = useSelector(state => {
        return state.issuer.listOfIssuers;
    });

    let connection = useSelector(state => {
        return state.connection;
    })

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
                        <GridColumn width={5}>1</GridColumn>
                        <GridColumn width={11}>
                            <IssuersList />
                        </GridColumn>
                    </GridRow>
                </Grid>
            </div>
        </div>
    );
}

export default ManagerRequests;