import React from "react";
import { useSelector } from "react-redux";
import { Grid, GridColumn, GridRow } from "semantic-ui-react";
import SelectDealToDeploy from "./SelectDealToDeploy";
import SelectBond from "./SelectBond";
import "../users.css";
import "../manager.css";
import ShowSelectedBond from "./ShowSelectedBond";

function ManagerCoupons() {
    const connection = useSelector(state => {
        return state.connection;
    });

    return(
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
                            <SelectBond />
                        </GridColumn>
                        <GridColumn width={12}>
                            <ShowSelectedBond />
                        </GridColumn>
                    </GridRow>
                </Grid>
            </div>
        </div>
    );
}

export default ManagerCoupons;