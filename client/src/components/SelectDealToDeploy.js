import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import 'semantic-ui-css/semantic.min.css';
import _ from "lodash";
import { Button, Card, CardContent, Dropdown } from "semantic-ui-react";
import BankJSON from "../contracts/artifacts/contracts/Topos/Bank/ToposBank.sol/ToposBank.json";
import IssuerJSON from "../contracts/artifacts/contracts/Topos/Bank/Issuer.sol/Issuer.json";
import TokenCallJSON from "../contracts/artifacts/contracts/tests/tokens/TokenCall.sol/TokenCall.json";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import Addresses from "../../src/addresses/addr.json";
import { setCountryForDealToIssue, setCurrencyForDealToIssue, setDealToIssue, setIssuerNameForDealToIssue, setShowIssueDealForm } from "../store";
import "../users.css";
import "../manager.css";

function SelectDealToDeploy() {
    const [dealID, setDealID] = useState('');

    const bonds = useSelector(state => {
        return state.bond;
    });

    const dispatch = useDispatch();

    const caseSensitiveSearch = (dealOptions, query) => {
        const re = new RegExp(_.escapeRegExp(query))
        return dealOptions.filter((opt) => re.test(opt.text))
    }

    const dealOptions = [];
    for (let i = 0; i < bonds.dealsToIssue.length; i++) {
        dealOptions.push(
            {
                key: i+1,
                text:  bonds.dealsToIssue[i],
                value: bonds.dealsToIssue[i]
            }
        );
    }

    const selectDeal = async () => {
        let { web3, account } = await web3Connection();
        let bank = await getContract(web3, BankJSON, Addresses.ToposBankContract);
        let issuerContract = await getContract(web3, IssuerJSON, Addresses.IssuerContract);
        let tokenCallContract = await getContract(web3, TokenCallJSON, Addresses.TokenCallContract);

        let deal = await bank.methods.deals(dealID).call({ from: account });

        let issuerAddress = deal.issuerAddress;
        let issuer = await issuerContract.methods.issuers(issuerAddress).call({ from: account });

        let tokenAddress = deal.currency;
        let tokenSymbol = await tokenCallContract.methods.symbol(tokenAddress).call({ from: account });

        dispatch(setDealToIssue(deal));
        dispatch(setIssuerNameForDealToIssue(issuer.name));
        dispatch(setCountryForDealToIssue(issuer.country));
        dispatch(setCurrencyForDealToIssue(tokenSymbol));
        dispatch(setShowIssueDealForm(true));
    }

    return (
        <div className="list-card">
            <Card fluid className="account-check">
                <CardContent textAlign="left">
                    <h3><strong>Select Deal</strong></h3>
                    <Dropdown
                        placeholder="Select"
                        options={dealOptions}
                        search={caseSensitiveSearch}
                        value={dealID}
                        onChange={(e, data) => setDealID(data.value)}
                    />
                    <br></br>
                    <br></br>
                    <Button type='submit' color="orange" fluid size='large' onClick={selectDeal}>
                        Confirm
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default SelectDealToDeploy;