import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Image, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "semantic-ui-react";
import Formate from "../utils/Formate";
import FormateAddress from "../utils/FormateAddress";
import "../users.css";
import "../manager.css";

function BondMarket() {
    const bonds = useSelector(state => {
        return state.bond;
    });

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
            </TableRow>
        );
    });

    return (
        <div className="exchange">
            <div className="exchangelList">
                <h2>Bond Market</h2>
            </div>
            {
                bonds.dealsListed.length > 0 ?
                    <div className="exchange-tab-scroll">
                        <Table padded selectable inverted>
                            <TableHeader className="header-sticky">
                                <TableRow>
                                    <TableHeaderCell>Issuer</TableHeaderCell>
                                    <TableHeaderCell textAlign='center'>Bond Contract</TableHeaderCell>
                                    <TableHeaderCell textAlign='center'>Deal ID</TableHeaderCell>
                                    <TableHeaderCell textAlign='center'>Seller</TableHeaderCell>
                                    <TableHeaderCell textAlign='center'>Symbol</TableHeaderCell>
                                    <TableHeaderCell textAlign='center'>Quantity</TableHeaderCell>
                                    <TableHeaderCell textAlign='center'>Coupon</TableHeaderCell>
                                    <TableHeaderCell textAlign='center'>Maturity</TableHeaderCell>
                                    <TableHeaderCell textAlign='center'>Par Value</TableHeaderCell>
                                    <TableHeaderCell textAlign='center'>Price</TableHeaderCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {renderedBonds}
                            </TableBody>
                        </Table>
                    </div>
                :
                    <div  className="no-approved-deal">
                        There are no Bonds Listed on the Exchange at the moment
                        <br></br>
                        <br></br>
                        Come back later
                    </div>
            }
        </div>
    );
}

export default BondMarket;