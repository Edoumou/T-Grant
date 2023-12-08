import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, CardContent, Dropdown, Grid, GridColumn, GridRow, Modal, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "semantic-ui-react";
import "../users.css";
import "../manager.css";
import Formate from "../utils/Formate";
import FormateAddress from "../utils/FormateAddress";

function Exchange() {
    const connection = useSelector(state => {
        return state.connection;
    });

    const bonds = useSelector(state => {
        return state.bond;
    });

    const dispatch = useDispatch();

    const renderedBonds = bonds.dealsListed.map((list, index) => {
        return (
            <TableRow key={index}>
                <TableCell>{list.dealID}</TableCell>
                <TableCell>{FormateAddress(list.owner)}</TableCell>
                <TableCell>{Formate(list.amount)}</TableCell>
                <TableCell>{Formate(list.price)}</TableCell>
            </TableRow>
        );
    })

    return (
        <div className="exchange">
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
            <div>
                <div className="exchangelList">
                    Bond Markets
                </div>
                {
                    bonds.dealsListed.length > 0 &&
                    <div className="exchange-tab-scroll">
                        <Table padded selectable inverted>
                            <TableHeader className="header-sticky">
                                <TableRow>
                                    <TableHeaderCell>Deal ID</TableHeaderCell>
                                    <TableHeaderCell>Seller</TableHeaderCell>
                                    <TableHeaderCell>Qty</TableHeaderCell>
                                    <TableHeaderCell>Price</TableHeaderCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {renderedBonds}
                            </TableBody>
                        </Table>
                    </div>
                }
            </div>
        </div>
    );
}

export default Exchange;