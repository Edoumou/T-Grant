import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Formate from "../utils/Formate";
import FormateAddress from "../utils/FormateAddress";
import { Button, Modal, ModalActions, ModalContent, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "semantic-ui-react";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import BankJSON from "../contracts/artifacts/contracts/Topos/Bank/ToposBank.sol/ToposBank.json";
import TokenCallJSON from "../../src/contracts/artifacts/contracts/tests/tokens/TokenCall.sol/TokenCall.json";
import USDCJSON from "../../src/contracts/artifacts/contracts/tests/tokens/assets/USDC.sol/USDC.json";
import USDTJSON from "../../src/contracts/artifacts/contracts/tests/tokens/assets/USDT.sol/USDT.json";
import EURCJSON from "../../src/contracts/artifacts/contracts/tests/tokens/assets/EURC.sol/EURC.json";
import EURTJSON from "../../src/contracts/artifacts/contracts/tests/tokens/assets/EURT.sol/EURT.json";
import CNYCJSON from "../../src/contracts/artifacts/contracts/tests/tokens/assets/CNYC.sol/CNYC.json";
import CNYTJSON from "../../src/contracts/artifacts/contracts/tests/tokens/assets/CNYT.sol/CNYT.json";
import DAIJSON from "../../src/contracts/artifacts/contracts/tests/tokens/assets/DAI.sol/DAI.json";
import Addresses from "../addresses/addr.json";
import { setListOfIRS, setLoading } from "../store";

function IRSList() {
    const irs = useSelector(state => {
        return state.irs;
    });

    const dispatch = useDispatch();

    const [loader, setLoader] = useState(true);
    const [explorerLink, setExplorerLink] = useState('');
    const [loadingMessage, setLoadingMessage] = useState('Transaction in Process');
    const [open, setOpen] = useState(false);

    const swapIRS = async (contract, index) => {
        let { web3, account } = await web3Connection();
        let bankContract = await getContract(web3, BankJSON, Addresses.ToposBankContract);

        await bankContract.methods.swapIRS(contract)
            .send({ from: account })
            .on('transactionHash', hash => {
                setLoadingMessage('Swaping Interest Rates! ⌛️');
                setExplorerLink(`https://topos.blockscout.testnet-1.topos.technology/tx/${hash}`);
                dispatch(setLoading(true));
            })
            .on('receipt', receipt => {
                setLoadingMessage('Transaction Completed! ✅');
                setLoader(false);
                dispatch(setLoading(false));
            });

        let listOfIRS = await bankContract.methods.getListOfIRS().call({ from: account });
        dispatch(setListOfIRS(listOfIRS));
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

    const renderedIRS = irs.listOfIRS.map((swap, index) => {
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
                                onClick={() => swapIRS(swap.irsContract, index)}
                            >
                                Swap
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
        <>
            <div className="managerDealList">
                <strong>List of Interest Rate Swaps</strong>
            </div>
            {
                irs.listOfIRS.length > 0 ?
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
        </>
    );
}

export default IRSList;