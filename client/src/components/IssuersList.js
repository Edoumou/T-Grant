import React from "react";
import { useSelector } from "react-redux";
import 'semantic-ui-css/semantic.min.css';
import { Card, CardContent, Table, TableHeader, TableRow, TableHeaderCell, TableBody, TableCell, Button } from "semantic-ui-react";
import Formate from "../utils/Formate";
import FormateAddress from "../utils/FormateAddress";
import "../manager.css";

function IssuersList() {
    let issuers = useSelector(state => {
        return state.issuer.listOfIssuers;
    });

    const approve = account => {
        console.log(account);
    }

    const reject = account => {
        console.log(account);
    }

    const renderedIssuers = issuers.map((issuer, index) => {
        return (
            <TableRow key={index}>
                <TableCell>{issuer.name}</TableCell>
                <TableCell warning>{issuer.country}</TableCell>
                <TableCell positive textAlign="center">{issuer.issuerType}</TableCell>
                <TableCell positive textAlign="center">{issuer.creditRating}</TableCell>
                <TableCell warning textAlign="right">{Formate(issuer.carbonCredit)}</TableCell>
                <TableCell textAlign="right">{FormateAddress(issuer.walletAddress)}</TableCell>
                <TableCell textAlign="right"><a href={issuer.documentURI} target="_blank">{issuer.documentURI}</a></TableCell>
                <TableCell textAlign="center">
                    <Button
                        key={index}
                        compact
                        color="vk"
                        size="tiny"
                        onClick={() => approve(issuer.walletAddress)}
                    >
                        Approve
                    </Button>
                </TableCell>
                <TableCell textAlign="center">
                    <Button
                        key={index}
                        color="red"
                        size="tiny"
                        onClick={() => reject(issuer.walletAddress)}
                    >
                        Reject
                    </Button>
                </TableCell>
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
                                    <TableHeaderCell textAlign="right">Address</TableHeaderCell>
                                    <TableHeaderCell textAlign="right">Document</TableHeaderCell>
                                    <TableHeaderCell textAlign="center">Approve</TableHeaderCell>
                                    <TableHeaderCell textAlign="center">Reject</TableHeaderCell>
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