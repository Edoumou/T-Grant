import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import 'semantic-ui-css/semantic.min.css';
import { Card, CardContent, Table, TableHeader, TableRow, TableHeaderCell, TableBody, TableCell, Button, Modal } from "semantic-ui-react";
import IssuerJSON from "../contracts/artifacts/contracts/Topos/Bank/Issuer.sol/Issuer.json";
import Formate from "../utils/Formate";
import FormateAddress from "../utils/FormateAddress";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import Addresses from "../addresses/addr.json";
import { setBalance, setListOfIssuers, setLoading } from "../store";
import "../users.css";
import "../manager.css";

function IssuersList() {
    const [open, setOpen] = useState(false);
    const [loader, setLoader] = useState(true);
    const [explorerLink, setExplorerLink] = useState('');
    const [loadingMessage, setLoadingMessage] = useState('Transaction in Process');

    let dispatch = useDispatch();

    let issuersList = useSelector(state => {
        return state.issuer.listOfIssuers;
    });

    let issuers = issuersList.filter(issuer => {
        return issuer.status === "1";
    });

    const approve = async issuerAccount => {
        let { web3, account } = await web3Connection();
        let contract = await getContract(web3, IssuerJSON, Addresses.IssuerContract);

        setLoader(true);

        await contract.methods.approveIssuer(issuerAccount)
            .send({ from: account })
            .on('transactionHash', hash => {
                setLoadingMessage('Transaction in Process! ⌛️');
                setExplorerLink(`https://topos.blockscout.testnet-1.topos.technology/tx/${hash}`);
                dispatch(setLoading(true));
            })
            .on('receipt', receipt => {
                setLoadingMessage('Transaction Completed! ✅');
                setLoader(false);
                dispatch(setLoading(false));
            });

        let listOfIssuers = await contract.methods.getIssuers().call({ from: account });
        let balance = await web3.eth.getBalance(account);
        balance = web3.utils.fromWei(balance);

        dispatch(setListOfIssuers(listOfIssuers));
        dispatch(setBalance(balance));
    }

    const reject = async issuerAccount => {
        let { web3, account } = await web3Connection();
        let contract = await getContract(web3, IssuerJSON, Addresses.IssuerContract);

        setLoader(true);

        await contract.methods.rejectIssuer(issuerAccount)
            .send({ from: account })
            .on('transactionHash', hash => {
                setLoadingMessage('Transaction in Process! ⌛️');
                setExplorerLink(`https://explorer.testnet-1.topos.technology/subnet/0xe93335e1ec5c2174dfcde38dbdcc6fd39d741a74521e0e01155c49fa77f743ae/transaction/${hash}`);
                dispatch(setLoading(true));
            })
            .on('receipt', receipt => {
                setLoadingMessage('Transaction Completed! ✅');
                setLoader(false);
                dispatch(setLoading(false));
            });

        let listOfIssuers = await contract.methods.getIssuers().call({ from: account });
        let balance = await web3.eth.getBalance(account);
        balance = web3.utils.fromWei(balance);

        dispatch(setListOfIssuers(listOfIssuers));
        dispatch(setBalance(balance));
    }

    const goToExplorer = () => {
        const newWindow = window.open(explorerLink, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
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
                <TableCell textAlign="right">
                    <a href={issuer.documentURI} target="_blank" rel="noopener noreferrer">
                        {issuer.documentURI}
                    </a>
                </TableCell>
                <TableCell textAlign="center">
                    <Modal
                        size="tiny"
                        open={open}
                        trigger={
                            <Button
                                key={index}
                                compact
                                color="vk"
                                size="tiny"
                                onClick={() => approve(issuer.walletAddress)}
                            >
                                Approve
                            </Button>
                        }
                        onClose={() => setOpen(false)}
                        onOpen={() => setOpen(true)}
                    >
                        <Modal.Content>
                            <div style={{ textAlign: 'center' }}>
                                <h3>{loadingMessage}</h3>
                                {
                                    loader ?
                                        <Button inverted basic loading size="massive">processing</Button>
                                    :
                                        <p style={{ color: 'green' }}><strong>transaction processed successfully</strong></p>
                                }
                            </div>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button basic floated="left" onClick={goToExplorer}>
                                <strong>Check on Topos Explorer</strong>
                            </Button>
                            <Button color='black' onClick={() => setOpen(false)}>
                                Go to Dashboard
                            </Button>
                        </Modal.Actions>
                    </Modal>
                </TableCell>
                <TableCell textAlign="center">
                    <Modal
                        size="tiny"
                        open={open}
                        trigger={
                            <Button
                                key={index}
                                compact
                                color="red"
                                size="tiny"
                                onClick={() => reject(issuer.walletAddress)}
                            >
                                Reject
                            </Button>
                        }
                        onClose={() => setOpen(false)}
                        onOpen={() => setOpen(true)}
                    >
                        <Modal.Content>
                            <div style={{ textAlign: 'center' }}>
                                <h3>{loadingMessage}</h3>
                                {
                                    loader ?
                                        <Button inverted basic loading size="massive">processing</Button>
                                    :
                                        <p style={{ color: 'green' }}><strong>transaction processed successfully</strong></p>
                                }
                            </div>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button basic floated="left" onClick={goToExplorer}>
                                <strong>Check on Topos Explorer</strong>
                            </Button>
                            <Button color='black' onClick={() => setOpen(false)}>
                                Go to Dashboard
                            </Button>
                        </Modal.Actions>
                    </Modal>
                </TableCell>
            </TableRow>
        );
    });

    return (
        <>
            <div className="managerDealList">
                Issuers Requests
            </div>
            {
                issuers.length > 0 ?
                    <div className="tab-scroll">
                        <Table padded selectable>
                            <TableHeader className="header-sticky">
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
                    </div>
                :
                    <div className="list-card-head-no">
                        There are No Requests from Issuers
                    </div>
            }
        </>
    );
}

export default IssuersList;