import React, { useState } from "react";
import 'semantic-ui-css/semantic.min.css';
import { Table, TableRow, TableCell, TableHeader, TableHeaderCell, TableBody, Icon } from "semantic-ui-react";
import "../users.css";
import "../manager.css";
import { useSelector } from "react-redux";
import Formate from "../utils/Formate";
import FormateAddress from "../utils/FormateAddress";

function IssuerListOfDeals() {
    const connection = useSelector(state => {
        return state.connection;
    });

    const issuer = useSelector(state => {
        return state.issuer;
    });

    let issuerDeals = connection.deals.filter(
        deal => deal.issuerAddress.toLowerCase() === connection.account.toLowerCase()
    );

    let symbols = connection.dealsCurrencySymbols;

    const status = issuerDeals.map((deal, index) => {
        if(deal.status === '1') {
            return <Icon key={index} color="yellow" name="hourglass outline" />;
        } else if(deal.status === '2') {
            return <Icon key={index} color='yellow' name='checkmark' />;
        } else if(deal.status === '3') {
            return <Icon key={index} color='red' name='times circle' />;
        } else if(deal.status === '4') {
            return <Icon key={index} color='green' name='shop' />;
        } else {
            return <Icon key={index} color='yellow' name='checked calendar' />;
        }
    });

    const couponType = issuerDeals.map((deal, index) => {
        if(deal.couponType === '0') {
            return <span>Zero Coupon</span>
        } else if(deal.couponType === '1') {
            return <span>Fixed Rate</span>
        } else {
            return <span>Floating Rate</span>
        }
    });

    const renderedDeals = issuerDeals.map((deal, index) => {
        return (
            <TableRow key={index}>
                <TableCell textAlign="center">{deal.dealID}</TableCell>
                <TableCell textAlign="left"><a href={deal.prospectusURI} target="_blank"><strong>{deal.prospectusURI}</strong></a></TableCell>
                <TableCell positive textAlign="left">{FormateAddress(deal.issuerAddress)}</TableCell>
                <TableCell negative textAlign="right">{Formate(deal.debtAmount)} USDC</TableCell>
                <TableCell warning textAlign="center">{deal.couponRate / 100}%</TableCell>
                <TableCell textAlign="center">{deal.couponFrequency}</TableCell>
                <TableCell textAlign="center">{couponType[index]}</TableCell>
                <TableCell warning textAlign="right">{(new Date(deal.maturityDate * 1000)).toLocaleDateString()}</TableCell>
                <TableCell textAlign="center">{status[index]}</TableCell>
            </TableRow>
        );
    });

    return (
        <>
            <div className="issuerDealList">
                <strong>Your Deals</strong>
            </div>
            <Table celled>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell textAlign="center">Deal ID</TableHeaderCell>
                        <TableHeaderCell textAlign="left">Prospectus URL</TableHeaderCell>
                        <TableHeaderCell textAlign="left">Issuer Addresse</TableHeaderCell>
                        <TableHeaderCell textAlign="right">Volume</TableHeaderCell>
                        <TableHeaderCell textAlign="center">Coupon Rate</TableHeaderCell>
                        <TableHeaderCell textAlign="center">Coupon Frequency</TableHeaderCell>
                        <TableHeaderCell textAlign="center">Coupon Type</TableHeaderCell>
                        <TableHeaderCell textAlign="right">Maturity date</TableHeaderCell>
                        <TableHeaderCell textAlign="center">Status</TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {renderedDeals}
                </TableBody>
            </Table>
        </>
    );
}

export default IssuerListOfDeals;