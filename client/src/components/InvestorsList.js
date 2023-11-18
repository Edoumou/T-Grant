import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import 'semantic-ui-css/semantic.min.css';
import { Card, CardContent, Table, TableHeader, TableRow, TableHeaderCell, TableBody, TableCell, Button, Modal } from "semantic-ui-react";
import InvestorJSON from "../contracts/artifacts/contracts/Topos/Bank/Investor.sol/Investor.json";
import FormateAddress from "../utils/FormateAddress";
import "../manager.css";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import Addresses from "../addresses/addr.json"
import { setBalance, setListOfInvestors, setLoading } from "../store";

function InvestorsList() {
    const [open, setOpen] = useState(false);
    const [loader, setLoader] = useState(true);
    const [explorerLink, setExplorerLink] = useState('');
    const [loadingMessage, setLoadingMessage] = useState('Transaction in Process');

    let dispatch = useDispatch();

    let investorsList = useSelector(state => {
        return state.investor.listOfInvestors;
    });

    let investors = investorsList.filter(investor => {
        return investor.status === "1";
    });

    const approve = async investorAccount => {
        let { web3, account } = await web3Connection();
        let contract = await getContract(web3, InvestorJSON, Addresses.InvestorContract);

        await contract.methods.approveInvestor(investorAccount)
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

        let listOfInvestors = await contract.methods.getInvestors().call({ from: account });
        let balance = await web3.eth.getBalance(account);
        balance = web3.utils.fromWei(balance);

        dispatch(setListOfInvestors(listOfInvestors));
        dispatch(setBalance(balance));
    }

    const reject = async investorAccount => {
        let { web3, account } = await web3Connection();
        let contract = await getContract(web3, InvestorJSON, Addresses.InvestorContract);

        await contract.methods.rejectInvestor(investorAccount)
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

        let listOfInvestors = await contract.methods.getInvestors().call({ from: account });
        let balance = await web3.eth.getBalance(account);
        balance = web3.utils.fromWei(balance);

        dispatch(setListOfInvestors(listOfInvestors));
        dispatch(setBalance(balance));
    }

    const goToExplorer = () => {
        const newWindow = window.open(explorerLink, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
    }

    const renderedInvestors = investors.map((investor, index) => {
        return (
            <TableRow key={index}>
                <TableCell>{investor.name}</TableCell>
                <TableCell warning>{investor.country}</TableCell>
                <TableCell positive textAlign="center">{investor.investorType}</TableCell>
                <TableCell textAlign="right">{FormateAddress(investor.walletAddress)}</TableCell>
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
                                onClick={() => approve(investor.walletAddress)}
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
                                onClick={() => reject(investor.walletAddress)}
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
        <div className="list-card">
            <Card fluid>
                <CardContent textAlign="left">
                    <strong>Investors Requests</strong>
                    <br></br>
                    <br></br>
                    {
                        investors.length > 0 &&
                        <Table celled>
                            <TableHeader>
                                <TableRow>
                                    <TableHeaderCell>Name</TableHeaderCell>
                                    <TableHeaderCell>Country</TableHeaderCell>
                                    <TableHeaderCell textAlign="center">Type</TableHeaderCell>
                                    <TableHeaderCell textAlign="right">Address</TableHeaderCell>
                                    <TableHeaderCell textAlign="center">Approve</TableHeaderCell>
                                    <TableHeaderCell textAlign="center">Reject</TableHeaderCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {renderedInvestors}
                            </TableBody>
                        </Table>
                    }
                </CardContent>
            </Card>
        </div>
    );
}

export default InvestorsList;