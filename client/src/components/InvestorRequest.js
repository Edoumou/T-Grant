import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, Grid, GridRow, GridColumn, Menu, Dropdown, Input, Modal } from 'semantic-ui-react';
import InvestorJSON from "../../src/contracts/artifacts/contracts/Topos/Bank/Investor.sol/Investor.json";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import Addresses from "../../src/addresses/addr.json";

function InvestorRequest() {
    const [url, setUrl] = useState('');
    const [name, setName] = useState('');
    const [country, setCountry] = useState('');
    const [issuerType, setIssuerType] = useState('');
    const [creditRating, setCreditRating] = useState('');
    const [carbonCredit, setCarbonCredit] = useState('');
    const [txHash, setTxHash] = useState('');
    const [loader, setLoader] = useState(true);
    const [explorerLink, setExplorerLink] = useState('');
    const [loadingMessage, setLoadingMessage] = useState('Transaction in Process');

    const [open, setOpen] = useState(false);

    const dispatch = useDispatch();

    const investor = useSelector(state => {
        return {
          status: state.investor.registrationStatus
        }
    });

    const options = [
        { key: 1, text: 'PERSONAL', value: 'Personal Investors' },
        { key: 2, text: 'ANGEL INV', value: 'Angel Investors' },
        { key: 3, text: 'VC', value: 'Venture Capitalist' },
        { key: 3, text: 'P2P LEND', value: 'Peer-to-peer lenders' },
        { key: 4, text: 'INCUBATOR', value: 'Incubators' },
        { key: 5, text: 'FINANCIAL INST', value: 'Financial Institues' },
        { key: 6, text: 'CORPORATION', value: 'Corporate investors' },
    ];

    const request = async () => {
        let { web3, account } = await web3Connection();
        let contract = await getContract(web3, InvestorJSON, Addresses.InvestorContract);

        if (url !== '' && name !== '' && country !== '' && issuerType !== '' && creditRating !== '' && carbonCredit !== '') {
            let urlToUse = url.trim();
            let nameToUse = name.trim();
            let countryToUse = country.trim();
            let issuerTypeToUse = issuerType.trim();
            let creditRatingToUse = creditRating.trim();
            let carbonCreditToUse = carbonCredit.trim();

            let issuer = {
                documentURI: urlToUse,
                name: nameToUse,
                country: countryToUse,
                issuerType: issuerTypeToUse,
                creditRating: creditRatingToUse,
                carbonCredit: carbonCreditToUse,
                walletAddress: account
            }

            await contract.methods.requestRegistrationIssuer(issuer)
                .send({ from: account })
                .on('transactionHash', hash => {
                    setLoadingMessage('Transaction in Process! ⌛️');
                    setExplorerLink(`https://explorer.testnet-1.topos.technology/subnet/0xe93335e1ec5c2174dfcde38dbdcc6fd39d741a74521e0e01155c49fa77f743ae/transaction/${hash}`);
                    setTxHash(hash);
                    setUrl('');
                    setName('');
                    setCountry('');
                    setIssuerType('');
                    setCreditRating('');
                    setCarbonCredit('');
                })
                .on('receipt', receipt => {
                    setLoadingMessage('Transaction Completed! ✅');
                    setLoader(false);
                });

            setUrl('');
            setName('');
            setCountry('');
            setIssuerType('');
            setCreditRating('');
            setCarbonCredit('');
            setLoader(false);
        }

        setUrl('');
        setName('');
        setCountry('');
        setIssuerType('');
        setCreditRating('');
        setCarbonCredit('');
        setLoader(false);
    }

    const goToExplorer = () => {
        setUrl('');
        setName('');
        setCountry('');
        setIssuerType('');
        setCreditRating('');
        setCarbonCredit('');

        const newWindow = window.open(explorerLink, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
    }

    return (
        <div className="deal-main">
            {
                investor.status === '0' ?
                    <>
                        <div className="deal-head">
                            Become an Investor
                        </div>
                        <div className="deal-form">
                            <Grid stackable columns={3}>
                                <GridRow>
                                    <GridColumn>
                                        <Input
                                            fluid
                                            size="mini"
                                            placeholder='Document URL'
                                            value={url}
                                            onChange={e => setUrl(e.target.value)}
                                        />
                                    </GridColumn>
                                    <GridColumn>
                                        <Input
                                            fluid
                                            size="mini"
                                            placeholder='Name'
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                        />
                                    </GridColumn>
                                    <GridColumn>
                                        <Input
                                            fluid
                                            size="mini"
                                            placeholder='Country'
                                            value={country}
                                            onChange={e => setCountry(e.target.value)}
                                        />
                                    </GridColumn>
                                </GridRow>
                                <GridRow>
                                    <GridColumn>
                                        <Menu>
                                            <Dropdown
                                                placeholder="Issuer Type"
                                                options={options}
                                                value={issuerType}
                                                onChange={(e, data) => setIssuerType(data.value)}
                                            />
                                        </Menu>
                                    </GridColumn>
                                    <GridColumn>
                                        <Input
                                            fluid
                                            size="mini"
                                            placeholder='Credit Rating'
                                            value={creditRating}
                                            onChange={e => setCreditRating(e.target.value)}
                                        />
                                    </GridColumn>
                                    <GridColumn>
                                        <Input
                                            fluid
                                            size="mini"
                                            placeholder='Carbon Credit'
                                            value={carbonCredit}
                                            onChange={e => setCarbonCredit(e.target.value)}
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
                                    <Button type='submit' color="vk" fluid size='large' onClick={request}>
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
                    </>
                :
                    <>
                        <div style={{ paddingTop: 80, paddingBottom: 40, fontSize: 25, fontFamily: "-moz-initial" }}>
                            Your request to get the Investor status is in progress
                        </div>
                        <div style={{ fontSize: 17, fontFamily: "-moz-initial" }}>
                            <p>
                                Check again later
                            </p>
                            <p>
                                ⏰⏱️⌛️⏱️⏰ {investor.status}
                            </p>  
                        </div>
                    </>
            }   
        </div>
    );
}

export default InvestorRequest;