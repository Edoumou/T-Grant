import React from "react";
import { useSelector } from "react-redux";
import 'semantic-ui-css/semantic.min.css';
import { Grid, GridColumn, GridRow } from "semantic-ui-react";
import DealForm from "./DealForm";
import IssuerListOfDeals from "./IssuerListOfDeals";

function SubmitDeal() {
    const connection = useSelector(state => {
        return state.connection;
    });

    let issuerDeals = connection.deals.filter(
        deal => deal.issuerAddress.toLowerCase() === connection.account.toLowerCase()
    );

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
                <Grid stackable columns={1}>
                    <GridRow>
                        <GridColumn width={16}>
                            <DealForm />
                        </GridColumn>
                    </GridRow>
                </Grid>
                <div style={{ marginTop: 5 }}>
                    {
                        issuerDeals.length > 0 ?
                            <IssuerListOfDeals />
                        :
                            <></>
                    }
                </div>
            </div>
        </div>
    );
}

export default SubmitDeal;