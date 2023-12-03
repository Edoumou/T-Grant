import React from "react";
import { Grid, GridColumn, GridRow } from "semantic-ui-react";
import "../users.css";
import "../manager.css";
import { useSelector } from "react-redux";

function DealsFund() {
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
        </div>
    );
}

export default DealsFund;