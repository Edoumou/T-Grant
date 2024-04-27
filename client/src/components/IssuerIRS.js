import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Grid, GridColumn, GridRow, Modal, ModalActions, ModalContent, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "semantic-ui-react";
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

    const renderedIRS = irs.issuerIRS.map((swap, index) => {
        return (
            <TableRow key={index}>
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
                <TableCell warning textAlign="center">{swap.benchmark / 100}%</TableCell>
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
                    <div className="tab-scroll">
                        <Table padded selectable>
                            <TableHeader className="header-sticky">
                                <TableRow>
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
                :
                    <div  className="no-deal">
                        No active Interest Rate Swap Contract
                    </div>
                    
            }
        </div>
    );
}

export default IssuerIRS;