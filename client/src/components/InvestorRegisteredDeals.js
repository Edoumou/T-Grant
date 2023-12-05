import React from "react";
import { useSelector } from "react-redux";
import "../users.css";
import "../manager.css";
import { Image, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "semantic-ui-react";
import Formate from "../utils/Formate";

function InvestorRegisteredDeals() {
    const investor = useSelector(state => {
        return state.investor;
    });

    const renderedDeals = investor.investorBonds.map((bond, index) => {
        return (
            <TableRow key={index}>
                <TableCell textAlign="left">
                    <Image
                        size='tiny'
                        src={bond.logo}
                    />
                </TableCell>
                <TableCell textAlign="left">{bond.dealID}</TableCell>
                <TableCell textAlign="left"><a href={bond.prospectus} target="_blank"><strong>{bond.dealID.toLowerCase()}</strong></a></TableCell>
                <TableCell positive textAlign="right">{Formate(bond.volume)} {bond.tokenSymbol}</TableCell>
                <TableCell positive textAlign="right">{Formate(bond.denomination)} {bond.tokenSymbol}</TableCell>
                <TableCell warning textAlign="center">{bond.couponRate / 100}%</TableCell>
                <TableCell positive textAlign="right">{(new Date(bond.maturityDate * 1000)).toLocaleDateString()}</TableCell>
            </TableRow>
        );
    });

    return (
        <>
            {
                investor.investorBonds.length > 0 &&
                <div className="tab-scroll">
                    <Table padded selectable>
                        <TableHeader className="header-sticky">
                            <TableRow>
                                <TableHeaderCell textAlign="left">Issuer</TableHeaderCell>
                                <TableHeaderCell textAlign="left">Deal ID</TableHeaderCell>
                                <TableHeaderCell textAlign="left">Prospectus</TableHeaderCell>
                                <TableHeaderCell textAlign="right">Volume</TableHeaderCell>
                                <TableHeaderCell textAlign="right">Denomination</TableHeaderCell>
                                <TableHeaderCell textAlign="center">Coupon</TableHeaderCell>
                                <TableHeaderCell textAlign="right">Maturity</TableHeaderCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {renderedDeals}
                        </TableBody>
                    </Table>
                </div>
            }
        </>
    );
}

export default InvestorRegisteredDeals;