import React, { useState } from "react";
import { Button, Card, CardContent, Dropdown, Grid, GridColumn, GridRow, Input } from "semantic-ui-react";
import _ from "lodash";
import BankJSON from "../contracts/artifacts/contracts/Topos/Bank/ToposBank.sol/ToposBank.json";
import IRSFactoryJSON from "../contracts/artifacts/contracts/Topos/Factory/IRSFactory.sol/IRSFactory.json";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import Addresses from "../addresses/addr.json";
import "../users.css";
import "../manager.css";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../store";

function IssueIRS() {
    const dispatch = useDispatch();

    const [fixpayerDealID, setFixPayerDealID] = useState('');
    const [floatPayerDealID, setFloatPayerDealID] = useState('');
    const [numberOfSwaps, setNumberOfSwaps] = useState('');
    const [tokenName, setTokenName] = useState('');
    const [tokenSymbol, setTokenSymbol] = useState('');
    const [fixedInterestRate, setFixedInterestrate] = useState('');
    const [floatingInterestSpread, setFloatingInterestSpread] = useState('');
    const [notionalAmount, setNotionalAmount] = useState('');
    const [paymentFrequency, setPaymentFrequency] = useState('');
    const [maturityDate, setMaturityDate] = useState('');
    const [loader, setLoader] = useState(true);
    const [open, setOpen] = useState(false);
    const [explorerLink, setExplorerLink] = useState('');
    const [loadingMessage, setLoadingMessage] = useState('Transaction in Process');

    const bonds = useSelector(state => {
        return state.bond;
    });

    const caseSensitiveSearch = (bondsOption, query) => {
        const re = new RegExp(_.escapeRegExp(query))
        return bondsOption.filter((opt) => re.test(opt.text))
    }

    const dealsOption = [];
    for (let i = 0; i < bonds.activeBondsDealID.length; i++) {
        dealsOption.push(
            {
                key: i+1,
                text:  bonds.activeBondsDealID[i],
                value: bonds.activeBondsDealID[i]
            }
        );
    }

    const deploy = async () => {
        let { web3, account } = await web3Connection();
        let bankContract = await getContract(web3, BankJSON, Addresses.ToposBankContract);
        let irsFactory = await getContract(web3, IRSFactoryJSON, Addresses.IRSFactory);

        let fixPayerBondContract = await bankContract.methods.dealBondContracts(fixpayerDealID).call({ from: account });
        let floatingPayerBondContract = await bankContract.methods.dealBondContracts(floatPayerDealID).call({ from: account });
        let benchmark = await bankContract.methods.getBenchmark().call({ from: account });

        let _issueDate = Math.floor(Date.now() / 1000) + '';
        let _maturityDate = Date.parse(maturityDate) / 1000;

        let fixedRateDeal = await bankContract.methods.deals(fixpayerDealID).call({ from: account });
        let floatingRateDeal = await bankContract.methods.deals(floatPayerDealID).call({ from: account });

        let assetContract = fixedRateDeal.currency;

        let irs = {
            fixedInterestPayer: fixedRateDeal.issuerAddress,
            floatingInterestPayer: floatingRateDeal.issuerAddress,
            ratesDecimals: "2",
            swapRate: fixedInterestRate,
            spread: floatingInterestSpread,
            assetContract: assetContract,
            notionalAmount: notionalAmount,
            paymentFrequency: paymentFrequency,
            startingDate: _issueDate,
            maturityDate: _maturityDate,
            benchmark: benchmark
        }

        await irsFactory.methods.deployIRSContract(
            fixPayerBondContract,
            floatingPayerBondContract,
            numberOfSwaps,
            tokenName,
            tokenSymbol,
            irs,
            bankContract._address
        ).send({ from: account })
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
    }

    return (
        <div className="list-card">
            <Card fluid className="account-check">
                <CardContent textAlign="left">
                    <h3><strong>Deploy IRS Contract</strong></h3>
                    <br></br>
                    <Grid stackable columns={2}>
                        <GridRow>
                            <GridColumn>
                                <Dropdown
                                    placeholder="Fix Payer Deal ID"
                                    options={dealsOption}
                                    search={caseSensitiveSearch}
                                    onChange={(e, data) => setFixPayerDealID(data.value)}
                                />
                            </GridColumn>
                            <GridColumn textAlign="right">
                                <Dropdown
                                    placeholder="Floating Payer Deal ID"
                                    options={dealsOption}
                                    search={caseSensitiveSearch}
                                    onChange={(e, data) => setFloatPayerDealID(data.value)}
                                />
                            </GridColumn>
                        </GridRow>
                    </Grid>
                    <br></br>
                    <br></br>
                    <Input
                        fluid
                        size="large"
                        placeholder='number of swaps'
                        value={numberOfSwaps}
                        onChange={e => setNumberOfSwaps(e.target.value)}
                    />
                    <br></br>
                    <Input
                        fluid
                        size="large"
                        placeholder='IRS Swap Name'
                        value={tokenName}
                        onChange={e => setTokenName(e.target.value)}
                    />
                    <br></br>
                    <Input
                        fluid
                        size="large"
                        placeholder='IRS Swap Symbol'
                        value={tokenSymbol}
                        onChange={e => setTokenSymbol(e.target.value)}
                    />
                    <br></br>
                    <Input
                        fluid
                        size="large"
                        placeholder='Fixed Rate'
                        value={fixedInterestRate}
                        onChange={e => setFixedInterestrate(e.target.value)}
                    />
                    <br></br>
                    <Input
                        fluid
                        size="large"
                        placeholder='Floating rate spread'
                        value={floatingInterestSpread}
                        onChange={e => setFloatingInterestSpread(e.target.value)}
                    />
                    <br></br>
                    <Input
                        fluid
                        size="large"
                        placeholder='Notional amount'
                        value={notionalAmount}
                        onChange={e => setNotionalAmount(e.target.value)}
                    />
                    <br></br>
                    <Input
                        fluid
                        size="large"
                        placeholder='Payment Frequancy'
                        value={paymentFrequency}
                        onChange={e => setPaymentFrequency(e.target.value)}
                    />
                    <br></br>
                    <Input
                        fluid
                        type="datetime-local"
                        size="large"
                        placeholder='Maturity Date'
                        value={maturityDate}
                        onChange={e => setMaturityDate(e.target.value)}
                    />
                    <br></br>
                    <br></br>
                    <Button type='submit' color="orange" fluid size='large' onClick={deploy}>
                        Deploy
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default IssueIRS;