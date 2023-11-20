import React, { useState } from "react";
import 'semantic-ui-css/semantic.min.css';
import { Table, TableRow, TableCell, TableHeader, TableHeaderCell, TableBody, Icon } from "semantic-ui-react";
import "../users.css";
import "../manager.css";
import { useSelector } from "react-redux";
import Formate from "../utils/Formate";
import FormateAddress from "../utils/FormateAddress";

function ManagerListOfDeals() {
    const connection = useSelector(state => {
        return state.connection;
    });

    const issuer = useSelector(state => {
        return state.issuer;
    });

    const deals = useSelector(state => {
        return state.bond;
    })

    const status = connection.deals.map((deal, index) => {
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

    const couponType = connection.deals.map((deal, index) => {
        if(deal.couponType === '0') {
            return <span>Zero Coupon</span>
        } else if(deal.couponType === '1') {
            return <span>Fixed Rate</span>
        } else {
            return <span>Floating Rate</span>
        }
    });

    const renderedDeals = connection.deals.map((deal, index) => {
        return (
            <TableRow key={index}>
                <TableCell textAlign="left">{deal.dealID}</TableCell>
                <TableCell textAlign="left"><a href={deal.prospectusURI} target="_blank"><strong>{deal.dealID.toLowerCase()}</strong></a></TableCell>
                <TableCell positive textAlign="right">{Formate(deal.debtAmount)} {deals.bondSymbols[index]}</TableCell>
                <TableCell warning textAlign="center">{deal.couponRate / 100}%</TableCell>
                <TableCell textAlign="center">{deal.couponFrequency}</TableCell>
                <TableCell warning textAlign="center">{couponType[index]}</TableCell>
                <TableCell positive textAlign="right">{(new Date(deal.maturityDate * 1000)).toLocaleDateString()}</TableCell>
                <TableCell textAlign="center">{status[index]}</TableCell>
            </TableRow>
        );
    });

    return (
        <>
            <div className="managerDealList">
                <strong>Approve or Reject Deals</strong>
            </div>
            <div className="tab-scroll">
                <Table padded>
                    <TableHeader className="header-sticky">
                        <TableRow>
                            <TableHeaderCell textAlign="left">Deal ID</TableHeaderCell>
                            <TableHeaderCell textAlign="left">Prospectus</TableHeaderCell>
                            <TableHeaderCell textAlign="right">Volume</TableHeaderCell>
                            <TableHeaderCell textAlign="center">Coupon</TableHeaderCell>
                            <TableHeaderCell textAlign="center">Frequency</TableHeaderCell>
                            <TableHeaderCell textAlign="center">Type</TableHeaderCell>
                            <TableHeaderCell textAlign="right">Maturity</TableHeaderCell>
                            <TableHeaderCell textAlign="center">Status</TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {renderedDeals}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}

export default ManagerListOfDeals;