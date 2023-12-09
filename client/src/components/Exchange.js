import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Image, Button, Card, CardContent, Dropdown, Grid, GridColumn, GridRow, Modal, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow, Label } from "semantic-ui-react";
import "../users.css";
import "../manager.css";
import Formate from "../utils/Formate";
import FormateAddress from "../utils/FormateAddress";
import { Link } from "react-router-dom";

function Exchange() {
    const connection = useSelector(state => {
        return state.connection;
    });

    const bonds = useSelector(state => {
        return state.bond;
    });

    const dispatch = useDispatch();

    const buyBonds = async () => {
        console.log('Buy Bonds')
    }

    const renderedBonds = bonds.dealsListed.map((list, index) => {
        return (
            <TableRow key={index}>
                <TableCell textAlign="left">
                    <Image
                        size='tiny'
                        src={list.logo}
                    />
                </TableCell>
                <TableCell textAlign='center'>
                    <a href={`https://topos.blockscout.testnet-1.topos.technology/address/${list.bondContract}`} target="_blank">
                        {FormateAddress(list.bondContract)}
                    </a>
                </TableCell>
                <TableCell textAlign='center'>{list.dealID}</TableCell>
                <TableCell textAlign='center'>
                    <a href={`https://topos.blockscout.testnet-1.topos.technology/address/${list.seller}`} target="_blank">
                        {FormateAddress(list.seller)}
                    </a>
                </TableCell>
                <TableCell textAlign='center'>{list.bondSymbol}</TableCell>
                <TableCell textAlign='center'>{Formate(list.quantity)}</TableCell>
                <TableCell textAlign='center'>{Formate(list.coupon / 100)}%</TableCell>
                <TableCell textAlign='center'>{(new Date(list.maturityDate * 1000)).toLocaleDateString()}</TableCell>
                <TableCell textAlign='center'>{Formate(list.denomination)} {list.tokenSymbol}</TableCell>
                {
                    Number(list.price) > Number(list.denomination) ?
                        <TableCell textAlign='center'>
                            <span style={{ color: "red" }}><strong>{Formate(list.price)}</strong></span> {list.tokenSymbol}
                        </TableCell>
                    : Number(list.price) < Number(list.denomination) ?
                        <TableCell textAlign='center'>
                            <span style={{ color: "green" }}><strong>{Formate(list.price)}</strong></span> {list.tokenSymbol}
                        </TableCell>
                    :
                        <TableCell textAlign='center'>{Formate(list.price)} {list.tokenSymbol}</TableCell>
                }
                <TableCell>
                    {
                        connection.account.toLowerCase() !== list.seller.toLowerCase() &&
                        <Label
                            as='a'
                            ribbon='right'
                            color="orange"
                            onClick={buyBonds}
                        >
                            <strong>Buy</strong>
                        </Label>
                    }
                </TableCell>
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
                                    <TableHeaderCell>Issuer</TableHeaderCell>
                                    <TableHeaderCell textAlign='center'>Bond Contract</TableHeaderCell>
                                    <TableHeaderCell textAlign='center'>Deal ID</TableHeaderCell>
                                    <TableHeaderCell textAlign='center'>Seller</TableHeaderCell>
                                    <TableHeaderCell textAlign='center'>Symbol</TableHeaderCell>
                                    <TableHeaderCell textAlign='center'>Qty</TableHeaderCell>
                                    <TableHeaderCell textAlign='center'>Coupon</TableHeaderCell>
                                    <TableHeaderCell textAlign='center'>Maturity</TableHeaderCell>
                                    <TableHeaderCell textAlign='center'>Par Value</TableHeaderCell>
                                    <TableHeaderCell textAlign='center'>Price</TableHeaderCell>
                                    <TableHeaderCell textAlign='center'></TableHeaderCell>
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