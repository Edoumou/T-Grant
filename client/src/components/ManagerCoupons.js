import React from "react";
import { useSelector } from "react-redux";
import { Grid, GridColumn, GridRow } from "semantic-ui-react";
import SelectBond from "./SelectBond";
import ShowSelectedBond from "./ShowSelectedBond";
import BondListOfInvestors from "./BondListOfInvestors";
import "../users.css";
import "../manager.css";
import BondsCouponsPaid from "./BondsCouponsPaid";
import PayInterests from "./PayInterests";

function ManagerCoupons() {
    const connection = useSelector(state => {
        return state.connection;
    });

    const bonds = useSelector(state => {
        return state.bond;
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
                            {
                                Number(bonds.selectedActiveBond.issueVolume) > 0 &&
                                <PayInterests />
                            }
                        </GridColumn>
                        <GridColumn width={12}>
                            <ShowSelectedBond />
                            <BondListOfInvestors />
                            <BondsCouponsPaid />
                        </GridColumn>
                    </GridRow>
                </Grid>
            </div>
        </div>
    );
}

export default ManagerCoupons;