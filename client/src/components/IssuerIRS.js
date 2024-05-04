import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Grid, GridColumn, GridRow, Label, Modal, ModalActions, ModalContent, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "semantic-ui-react";
//import BankJSON from "../contracts/artifacts/contracts/IRSCall.sol/IRSCall.json";
import IRSCallJSON from "../contracts/artifacts/contracts/IRSCall.sol/IRSCall.json";
import TokenCallJSON from "../../src/contracts/artifacts/contracts/tests/tokens/TokenCall.sol/TokenCall.json";
import USDCJSON from "../../src/contracts/artifacts/contracts/tests/tokens/assets/USDC.sol/USDC.json";
import USDTJSON from "../../src/contracts/artifacts/contracts/tests/tokens/assets/USDT.sol/USDT.json";
import EURCJSON from "../../src/contracts/artifacts/contracts/tests/tokens/assets/EURC.sol/EURC.json";
import EURTJSON from "../../src/contracts/artifacts/contracts/tests/tokens/assets/EURT.sol/EURT.json";
import CNYCJSON from "../../src/contracts/artifacts/contracts/tests/tokens/assets/CNYC.sol/CNYC.json";
import CNYTJSON from "../../src/contracts/artifacts/contracts/tests/tokens/assets/CNYT.sol/CNYT.json";
import DAIJSON from "../../src/contracts/artifacts/contracts/tests/tokens/assets/DAI.sol/DAI.json";
import Addresses from "../addresses/addr.json";
import Formate from "../utils/Formate";
import FormateAddress from "../utils/FormateAddress";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import { setLoading } from "../store";

function IssuerIRS() {
    const connection = useSelector(state => {
        return state.connection;
    });

    const irs = useSelector(state => {
        return state.irs;
    });

    const dispatch = useDispatch();

    const [loader, setLoader] = useState(true);
    const [explorerLink, setExplorerLink] = useState('');
    const [loadingMessage, setLoadingMessage] = useState('Transaction in Process');
    const [open, setOpen] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [receipt, setReceipt] = useState([]);
    const [symbol, setSymbol] = useState('');

    const approveIRSContract = async (contract, index) => {
        let { web3, account } = await web3Connection();
        let tokenCallContract = await getContract(web3, TokenCallJSON, Addresses.TokenCallContract);

        let symbol = await tokenCallContract.methods.symbol(
            irs.issuerIRS[index].assetContract
        ).call({ from: account });

        let balance = await tokenCallContract.methods.balanceOf(
            account,
            irs.issuerIRS[index].assetContract
        ).call({ from: account });
        
        let tokenContract = null;

        if(symbol === "USDC") {
            tokenContract = await getContract(web3, USDCJSON, Addresses.USDCContract);
        }
        if(symbol === "USDT") {
            tokenContract = await getContract(web3, USDTJSON, Addresses.USDTContract);
        }
        if(symbol === "EURC") {
            tokenContract = await getContract(web3, EURCJSON, Addresses.EURCContract);
        }
        if(symbol === "EURT") {
            tokenContract = await getContract(web3, EURTJSON, Addresses.EURTContract);
        }
        if(symbol === "CNYC") {
            tokenContract = await getContract(web3, CNYCJSON, Addresses.CNYCContract);
        }
        if(symbol === "CNYT") {
            tokenContract = await getContract(web3, CNYTJSON, Addresses.CNYTContract);
        }
        if(symbol === "DAI") {
            tokenContract = await getContract(web3, DAIJSON, Addresses.DAIContract);
        }

        if(symbol === '' || symbol === undefined) {
            return;
        }

        await tokenContract.methods.approve(contract, balance)
            .send({ from: account })
            .on('transactionHash', hash => {
                setLoadingMessage('Approve IRS swap Contract in Process! ⌛️');
                setExplorerLink(`https://topos.blockscout.testnet-1.topos.technology/tx/${hash}`);
                dispatch(setLoading(true));
            })
            .on('receipt', receipt => {
                setLoader(false);
                setLoadingMessage('Approve IRS Swap Contract Completed! ✅');
            });
    }

    const goToExplorer = () => {
        const newWindow = window.open(explorerLink, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
    }

    const goToDashboard = () => {
        setOpen(false);
        setLoader(true);
        setLoadingMessage('');
        setExplorerLink('');
    }

    const loadReceipt = async irsContract => {
        // Fetch receipt for the selected contract
        // Store the receipt in the store or maybe in states
        let { web3, account } = await web3Connection();
        let irsCallContract = await getContract(web3, IRSCallJSON, Addresses.IRSCallContract);
        let tokenCallContract = await getContract(web3, TokenCallJSON, Addresses.TokenCallContract);

        let receipt = await irsCallContract.methods.getIRSReceipt(irsContract).call({ from: account });

        let _symbol = await tokenCallContract.methods.symbol(
            receipt[0].currency
        ).call({ from: account });

        setReceipt(receipt);
        setSymbol(_symbol);

        setShowReceipt(!showReceipt);
    }

    const closeReceipt = async () => {
        setShowReceipt(!showReceipt);
    }

    const renderedReceipt = receipt.map((r, index) => {
        return (
            <TableRow key={index}>
                <TableCell textAlign="left">{FormateAddress(r.from)}</TableCell>
                <TableCell textAlign="left">{FormateAddress(r.to)}</TableCell>
                <TableCell positive textAlign="right">{Formate(r.amount / 10000)} {symbol}</TableCell>
            </TableRow>
        );
    });

    const renderedIRS = irs.issuerIRS.map((swap, index) => {
        return (
            <TableRow key={index}>
                <TableCell>
                    <Label ribbon as='a' color="teal" onClick={() => loadReceipt(swap.irsContract)}>
                        <strong>Check</strong>
                    </Label>
                </TableCell>
                <TableCell textAlign="left">{FormateAddress(swap.floatingInterestPayer)}</TableCell>
                <TableCell textAlign="left">{FormateAddress(swap.fixedInterestPayer)}</TableCell>
                <TableCell textAlign="center">
                    <a
                        href={`https://topos.blockscout.testnet-1.topos.technology/address/${swap.irsContract}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {FormateAddress(swap.irsContract)}
                    </a>
                </TableCell>
                <TableCell positive textAlign="center">{swap.swapRate / 100}%</TableCell>
                <TableCell warning textAlign="center">{swap.spread / 100}%</TableCell>
                <TableCell warning textAlign="center">{irs.benchmark / 100}%</TableCell>
                <TableCell textAlign="right">{Formate(swap.notionalAmount)}</TableCell>
                <TableCell positive textAlign="right">{(new Date(swap.maturityDate * 1000)).toLocaleDateString()}</TableCell>
                <TableCell warning textAlign="center">
                    <Modal
                        size="tiny"
                        open={open}
                        trigger={
                            <Button
                                compact
                                color='pink'
                                onClick={() => approveIRSContract(swap.irsContract, index)}
                            >
                                Approve
                            </Button>
                        }
                        onClose={() => setOpen(false)}
                        onOpen={() => setOpen(true)}
                    >
                        <ModalContent>
                            <div style={{ textAlign: 'center' }}>
                                <h3>{loadingMessage}</h3>
                                {
                                    loader ?
                                        <Button inverted basic loading size="massive">processing</Button>
                                    :
                                        <p style={{ color: 'green' }}><strong>transaction processed successfully</strong></p>
                                }
                            </div>
                        </ModalContent>
                        <ModalActions>
                            <Button basic floated="left" onClick={goToExplorer}>
                                <strong>Check on Topos Explorer</strong>
                            </Button>
                            <Button color='black' onClick={goToDashboard}>
                                Go to Dashboard
                            </Button>
                        </ModalActions>
                    </Modal>
                </TableCell>
            </TableRow>
        );
    });

    return (
        <div className="manager">
            <div className="manager-head">
                <Grid columns={2}>
                    <GridRow>
                        <GridColumn textAlign="left">
                            <strong>{connection.role}</strong>
                        </GridColumn>
                        <GridColumn textAlign="right">
                            <strong>{Number(connection.balance).toFixed(2)} TOPO</strong>
                        </GridColumn>
                    </GridRow>
                </Grid>
            </div>
            <br></br>
            <br></br>
            <div className="managerDealList">
                <strong>List of Interest Rate Swaps</strong>
            </div>
            <p style={{ color: 'white' }}>
                You MUST approve the IRS contract to transfer the Asset from your account
            </p>
            <br></br>
            {
                irs.issuerIRS.length > 0 ?
                    <>
                        {
                            showReceipt ?
                                <Grid stackable columns={2}>
                                    <GridRow>
                                        <GridColumn width={9}>
                                            <div className="tab-scroll">
                                                <Table padded selectable>
                                                    <TableHeader className="header-sticky">
                                                        <TableRow>
                                                            <TableHeaderCell />
                                                            <TableHeaderCell textAlign="left">Payer</TableHeaderCell>
                                                            <TableHeaderCell textAlign="left">Receiver</TableHeaderCell>
                                                            <TableHeaderCell textAlign="center">IRS contract</TableHeaderCell>
                                                            <TableHeaderCell textAlign="center">Swap Rate</TableHeaderCell>
                                                            <TableHeaderCell textAlign="center">Spread</TableHeaderCell>
                                                            <TableHeaderCell textAlign="center">benchmark</TableHeaderCell>
                                                            <TableHeaderCell textAlign="right">Notional</TableHeaderCell>
                                                            <TableHeaderCell textAlign="right">Maturity Date</TableHeaderCell>
                                                            <TableHeaderCell textAlign="right"></TableHeaderCell>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {renderedIRS}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </GridColumn>
                                        <GridColumn width={1} />
                                        <GridColumn width={6}>
                                            {
                                                receipt.length > 0 ?
                                                    <div className="tab-scroll">
                                                        <Table padded selectable>
                                                            <TableHeader className="header-sticky">
                                                                <Label ribbon as='a' color="pink" onClick={closeReceipt} >
                                                                    <strong>Close</strong>
                                                                </Label>
                                                                <TableRow>
                                                                    <TableHeaderCell textAlign="left">From</TableHeaderCell>
                                                                    <TableHeaderCell textAlign="left">To</TableHeaderCell>
                                                                    <TableHeaderCell textAlign="right">Amount</TableHeaderCell>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {renderedReceipt}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                :
                                                    <div  className="no-deal">
                                                        No swap found
                                                    </div>
                                            }
                                        </GridColumn>
                                    </GridRow>
                                </Grid>
                            :
                                <div className="tab-scroll">
                                    <Table padded selectable>
                                        <TableHeader className="header-sticky">
                                            <TableRow>
                                                <TableHeaderCell />
                                                <TableHeaderCell textAlign="left">Payer</TableHeaderCell>
                                                <TableHeaderCell textAlign="left">Receiver</TableHeaderCell>
                                                <TableHeaderCell textAlign="center">IRS contract</TableHeaderCell>
                                                <TableHeaderCell textAlign="center">Swap Rate</TableHeaderCell>
                                                <TableHeaderCell textAlign="center">Spread</TableHeaderCell>
                                                <TableHeaderCell textAlign="center">benchmark</TableHeaderCell>
                                                <TableHeaderCell textAlign="right">Notional</TableHeaderCell>
                                                <TableHeaderCell textAlign="right">Maturity Date</TableHeaderCell>
                                                <TableHeaderCell textAlign="right"></TableHeaderCell>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {renderedIRS}
                                        </TableBody>
                                    </Table>
                                </div>
                        } 
                    </>
                :
                    <div  className="no-deal">
                        No active Interest Rate Swap Contract
                    </div>
                    
            }
        </div>
    );
}

export default IssuerIRS;