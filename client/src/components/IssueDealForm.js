import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalActions, ModalContent, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "semantic-ui-react";
import BankJSON from "../contracts/artifacts/contracts/Topos/Bank/ToposBank.sol/ToposBank.json";
import BondFactoryJSON from "../contracts/artifacts/contracts/Topos/Factory/BondFactory.sol/BondFactory.json";
import Formate from "../utils/Formate";
import Addresses from "../addresses/addr.json";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import "../users.css";
import "../manager.css";
import { setLoading } from "../store";

function IssueDealForm() {
    const [loader, setLoader] = useState(true);
    const [showBondForm, setShowBondForm] = useState(true);
    const [open, setOpen] = useState(false);
    const [explorerLink, setExplorerLink] = useState('');
    const [loadingMessage, setLoadingMessage] = useState('Transaction in Process');

    const bonds = useSelector(state => {
        return state.bond;
    });

    const dispatch = useDispatch();

    const deploy = async () => {
        let { web3, account } = await web3Connection();
        let bankContract = await getContract(web3, BankJSON, Addresses.ToposBankContract);
        let bondFactory = await getContract(web3, BondFactoryJSON, Addresses.BondFactoryContract);

        await bondFactory.methods.DeployBondContract(
            bonds.dealToIssue.dealID,
            bonds.dealToIssue.issuerAddress,
            Addresses.ToposBankContract,
            bonds.countryForDealToIssue
        ).send({ from: account })
            .on('transactionHash', hash => {
                setLoadingMessage('Deploying the Bond Contract: ERC-7092! ⌛️');
                setExplorerLink(`https://topos.blockscout.testnet-1.topos.technology/tx/${hash}`);
                dispatch(setLoading(true));
            })
            .on('receipt', receipt => {
                setLoadingMessage('Bond Contract Deployed! ✅');
                setLoader(false);
                dispatch(setLoading(false));
            });

        setShowBondForm(false);
    }

    const goToExplorer = () => {
        const newWindow = window.open(explorerLink, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
    }

    return (
        <>
            <div>
                <Table padded>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderCell textAlign="left">Deal ID</TableHeaderCell>
                            <TableHeaderCell textAlign="left">Issuer</TableHeaderCell>
                            <TableHeaderCell textAlign="left">Country</TableHeaderCell>
                            <TableHeaderCell textAlign="right">Volume</TableHeaderCell>
                            <TableHeaderCell textAlign="center">Coupon Rate</TableHeaderCell>
                            <TableHeaderCell textAlign="right">Maturity Date</TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>{bonds.dealToIssue.dealID}</TableCell>
                            <TableCell warning>{bonds.issuerNameForDealToIssue}</TableCell>
                            <TableCell>{bonds.countryForDealToIssue}</TableCell>
                            <TableCell positive textAlign="right">{Formate(bonds.dealToIssue.debtAmount)} {bonds.currencyForDealToIssue}</TableCell>
                            <TableCell warning textAlign="center">{bonds.dealToIssue.couponRate / 100}%</TableCell>
                            <TableCell textAlign="right">{(new Date(bonds.dealToIssue.maturityDate * 1000)).toLocaleDateString()}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
            {
                showBondForm &&
                <div className="deploy-bond-contract">
                    <div className="deploy-bond-head">
                        Deploy the Bond Contract for {bonds.dealToIssue.dealID}
                    </div>
                    <br></br>
                    <br></br>
                    <div className="deal-button">
                        <Modal
                            size="tiny"
                            open={open}
                            trigger={
                                <Button type='submit' color="vk" fluid size='large' onClick={deploy}>
                                    Deploy
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
                                            <Button inverted basic loading size="massive">Loading</Button>
                                        :
                                            <p style={{ color: 'green' }}><strong>transaction processed successfully</strong></p>
                                    }
                                </div>
                            </ModalContent>
                            <ModalActions>
                            <Button basic floated="left" onClick={goToExplorer}>
                                <strong>Check on Topos Explorer</strong>
                            </Button>
                            <Button color='black' onClick={() => setOpen(false)}>
                                Go to Dashboard
                            </Button>
                            </ModalActions>
                        </Modal>
                    </div>
                </div>
            }
        </>
    );
}

export default IssueDealForm;