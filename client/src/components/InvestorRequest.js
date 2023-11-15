import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, Grid, GridRow, GridColumn, Menu, Dropdown, Input, Modal } from 'semantic-ui-react';
import InvestorJSON from "../../src/contracts/artifacts/contracts/Topos/Bank/Investor.sol/Investor.json";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import Addresses from "../../src/addresses/addr.json";
import { setInvestorRegistrationStatus, setListOfInvestors } from "../store";

function InvestorRequest() {
    const [name, setName] = useState('');
    const [country, setCountry] = useState('');
    const [investorType, setInvestorType] = useState('');
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

        if (name !== '' && country !== '' && investorType !== '') {
            let nameToUse = name.trim();
            let countryToUse = country.trim();
            let investorTypeToUse = investorType.trim();

            let investor = {
                name: nameToUse,
                country: countryToUse,
                investorType: investorTypeToUse,
                walletAddress: account,
                StakeHolderStatus: 0,
                index: 0
            }

            await contract.methods.requestRegistrationInvestor(investor)
                .send({ from: account })
                .on('transactionHash', hash => {
                    setLoadingMessage('Transaction in Process! ⌛️');
                    setExplorerLink(`https://explorer.testnet-1.topos.technology/subnet/0xe93335e1ec5c2174dfcde38dbdcc6fd39d741a74521e0e01155c49fa77f743ae/transaction/${hash}`);
                    setName('');
                    setCountry('');
                    setInvestorType('');
                })
                .on('receipt', receipt => {
                    setLoadingMessage('Transaction Completed! ✅');
                    setLoader(false);
                });

            setName('');
            setCountry('');
            setInvestorType('');
            setLoader(false);
        }

        setName('');
        setCountry('');
        setInvestorType('');
        setLoader(false);

        let investorRequest = await contract.methods.investors(account).call({ from: account });
        let investorRegistrationStatus = investorRequest.status;

        let listOfInvestors = await contract.methods.getInvestors().call({ from: account });

        dispatch(setInvestorRegistrationStatus(investorRegistrationStatus));
        dispatch(setListOfInvestors(listOfInvestors));
    }

    const goToExplorer = () => {
        setName('');
        setCountry('');
        setInvestorType('');

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
                                    <GridColumn>
                                        <Menu>
                                            <Dropdown
                                                placeholder="Investor Type"
                                                options={options}
                                                value={investorType}
                                                onChange={(e, data) => setInvestorType(data.value)}
                                            />
                                        </Menu>
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