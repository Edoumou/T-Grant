import React from "react";
import { useSelector } from "react-redux";
import 'semantic-ui-css/semantic.min.css';
import { Card, CardContent, Table, TableHeader, TableRow, TableHeaderCell, TableBody, TableCell } from "semantic-ui-react";
import Formate from "../utils/Formate";
import "../manager.css";

function IssuersList() {
    let issuers = useSelector(state => {
        return state.issuer.listOfIssuers;
    });

    const renderedIssuers = issuers.map((issuer, index) => {
        return (
            <TableRow key={0}>
                <TableCell>{issuer.name}</TableCell>
                <TableCell positive>{issuer.country}</TableCell>
                <TableCell textAlign="center">{issuer.issuerType}</TableCell>
                <TableCell textAlign="center">{issuer.creditRating}</TableCell>
                <TableCell warning textAlign="right">{Formate(issuer.carbonCredit)}</TableCell>
            </TableRow>
        );
    });

    return (
        <div className="list-card">
            <Card fluid>
                <CardContent textAlign="left">
                    <strong>Issuers Requests</strong>
                    <br></br>
                    <br></br>
                    {
                        issuers.length > 0 &&
                        <Table celled>
                            <TableHeader>
                                <TableRow>
                                    <TableHeaderCell>Name</TableHeaderCell>
                                    <TableHeaderCell>Country</TableHeaderCell>
                                    <TableHeaderCell textAlign="center">Type</TableHeaderCell>
                                    <TableHeaderCell textAlign="center">Credit Rating</TableHeaderCell>
                                    <TableHeaderCell textAlign="right">Carbon Credit</TableHeaderCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {renderedIssuers}
                            </TableBody>
                        </Table>
                    }
                </CardContent>
            </Card>
        </div>
    );
}

export default IssuersList;