import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import 'semantic-ui-css/semantic.min.css';
import { Button, Grid, GridRow, GridColumn, Card, CardContent, Input, Menu, Modal, Dropdown } from "semantic-ui-react";
import BankJSON from "../contracts/artifacts/contracts/Topos/Bank/ToposBank.sol/ToposBank.json";
import { setLoading, setShowForm } from "../store";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import Addresses from "../addresses/addr.json";
import "../users.css";
import "../manager.css";

function DealForm() {
    const connection = useSelector(state => {
        return state.connection;
    });

    const dispatch = useDispatch();

    const [loader, setLoader] = useState(true);
    const [open, setOpen] = useState(false);
    const [explorerLink, setExplorerLink] = useState('');
    const [loadingMessage, setLoadingMessage] = useState('Transaction in Process');
    const [url, setUrl] = useState("");
    const [issueVolume, setIssueVolume] = useState("");
    const [couponRate, setCouponRate] = useState("");
    const [couponFrequency, setCouponFrequency] = useState("");
    const [couponType, setCouponType] = useState("");
    const [maturityDate, setMaturityDate] = useState("");
    const [currency, setCurrency] = useState("");
    const [status, setStatus] = useState("SUBMISSION");
    const [accountAddress, setAccountAddress] = useState(connection.account);



    const couponTypeOptions = [
        { key: 1, text: 'GOV', value: 'GOV' },
        { key: 2, text: 'MUNI', value: 'MUNI' },
        { key: 3, text: 'CORP', value: 'CORP' },
        { key: 4, text: 'CEX', value: 'CEX' },
        { key: 5, text: 'DEX', value: 'DEX' },
        { key: 6, text: 'OTHER', value: 'OTHER' },
    ];

    const currencyOptions = [
        { key: 1, text: 'GOV', value: 'GOV' },
        { key: 2, text: 'MUNI', value: 'MUNI' },
        { key: 3, text: 'CORP', value: 'CORP' },
        { key: 4, text: 'CEX', value: 'CEX' },
        { key: 5, text: 'DEX', value: 'DEX' },
        { key: 6, text: 'OTHER', value: 'OTHER' },
    ];


    const issuer = useSelector(state => {
        return state.issuer;
    });

    const submiDeal = async () => {
        let { web3, account } = await web3Connection();
        let contract = await getContract(web3, BankJSON, Addresses.ToposBankContract);

        await contract.methods.submitDeal(_dealID, _deal)
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

        dispatch(setShowForm(false));
    }

    const goToExplorer = () => {
        const newWindow = window.open(explorerLink, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
    }

    return (
        <div className="list-card">
            <Card fluid>
                <CardContent textAlign="left">
                    <strong>Submit Deal</strong>
                    <br></br>
                    <br></br>
                    <div className="deal-form">
                        <Grid stackable columns={3}>
                            <GridRow>
                                <GridColumn>
                                    <Input
                                        fluid
                                        size="mini"
                                        placeholder='Prospectus URL'
                                        value={url}
                                        onChange={e => setUrl(e.target.value)}
                                    />
                                </GridColumn>
                                <GridColumn>
                                    <Input
                                        fluid
                                        size="mini"
                                        placeholder='Issue Volume'
                                        value={issueVolume}
                                        onChange={e => setIssueVolume(e.target.value)}
                                    />
                                </GridColumn>
                                <GridColumn>
                                    <Input
                                        fluid
                                        size="mini"
                                        placeholder='Coupon Rate'
                                        value={couponRate}
                                        onChange={e => setCouponRate(e.target.value)}
                                    />
                                </GridColumn>
                            </GridRow>
                            <GridRow>
                                <GridColumn>
                                    <Menu>
                                        <Dropdown
                                            placeholder="Issuer Type"
                                            options={couponTypeOptions}
                                            value={couponType}
                                            onChange={(e, data) => setCouponType(data.value)}
                                        />
                                    </Menu>
                                </GridColumn>
                                <GridColumn>
                                    <Input
                                        fluid
                                        size="mini"
                                        placeholder='Coupon Frequency'
                                        value={couponFrequency}
                                        onChange={e => setCouponFrequency(e.target.value)}
                                    />
                                </GridColumn>
                                <GridColumn>
                                    <Input
                                        fluid
                                        size="mini"
                                        placeholder='Maturity Date'
                                        value={maturityDate}
                                        onChange={e => setMaturityDate(e.target.value)}
                                    />
                                </GridColumn>
                            </GridRow>
                            <GridRow>
                                <GridColumn>
                                    <Menu>
                                        <Dropdown
                                            placeholder="Currency"
                                            options={currencyOptions}
                                            value={currency}
                                            onChange={(e, data) => setCurrency(data.value)}
                                        />
                                    </Menu>
                                </GridColumn>
                                <GridColumn>
                                    <Input
                                        fluid
                                        disabled
                                        size="mini"
                                        placeholder='Issuer Address'
                                        value={accountAddress}
                                        onChange={e => setAccountAddress(e.target.value)}
                                    />
                                </GridColumn>
                                <GridColumn>
                                    <Input
                                        fluid
                                        disabled
                                        size="mini"
                                        placeholder='Status'
                                        value={status}
                                        onChange={e => setStatus(e.target.value)}
                                    />
                                </GridColumn>
                            </GridRow>
                        </Grid>
                    </div>
                    <br></br>
                    <br></br>
                    <div className="deal-button">
                        <Modal
                            size="tiny"
                            open={open}
                            trigger={
                                <Button type='submit' color="vk" fluid size='large' onClick={submiDeal}>
                                    Submit
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
                                            <Button inverted basic loading size="massive">Loading</Button>
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
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default DealForm;