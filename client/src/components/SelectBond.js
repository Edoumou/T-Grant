import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { Button, Card, CardContent, Dropdown } from "semantic-ui-react";
import BankJSON from "../contracts/artifacts/contracts/Topos/Bank/ToposBank.sol/ToposBank.json";
import BondCallJSON from "../contracts/artifacts/contracts/BondCall.sol/BondCall.json";
import TokenCallJSON from "../contracts/artifacts/contracts/tests/tokens/TokenCall.sol/TokenCall.json";
import IssuerJSON from "../contracts/artifacts/contracts/Topos/Bank/Issuer.sol/Issuer.json";
import CouponPaymentJSON from "../contracts/artifacts/contracts/coupon/CouponPayment.sol/CouponPayment.json";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import Addresses from "../addresses/addr.json";
import { setInvestorsForSelectedActiveDeal, setSelectedActiveBond } from "../store";

function SelectBond() {
    const [dealID, setDealID] = useState('');

    const bonds = useSelector(state => {
        return state.bond;
    });

    const dispatch = useDispatch();

    const caseSensitiveSearch = (bondsOption, query) => {
        const re = new RegExp(_.escapeRegExp(query))
        return bondsOption.filter((opt) => re.test(opt.text))
    }

    const bondsOption = [];
    for (let i = 0; i < bonds.activeBondsDealID.length; i++) {
        bondsOption.push(
            {
                key: i+1,
                text:  bonds.activeBondsDealID[i],
                value: bonds.activeBondsDealID[i]
            }
        );
    }

    const setSelectedBond = async () => {
        let { web3, account } = await web3Connection();
        let bankContract = await getContract(web3, BankJSON, Addresses.ToposBankContract);
        let bondCallContract = await getContract(web3, BondCallJSON, Addresses.BondCallContract);
        let tokenCallContract = await getContract(web3, TokenCallJSON, Addresses.TokenCallContract);
        let issuerContract = await getContract(web3, IssuerJSON, Addresses.IssuerContract);
        let couponPayment = await getContract(web3, CouponPaymentJSON, Addresses.CouponPaymentContract);

        let deal = await bankContract.methods.deals(dealID).call({ from: account });
        let tokenAddress = deal.currency;
        let issuerAddress = deal.issuerAddress;
        let issuer = await issuerContract.methods.issuers(issuerAddress).call({ from: account });
        let logo = issuer.logoURI;
        let tokenSymbol = await tokenCallContract.methods.symbol(tokenAddress).call({ from: account });
        
        let address = await bankContract.methods.dealBondContracts(dealID).call({ from: account });
        
        let isin = await bondCallContract.methods.isin(address).call({ from: account });
        let name = await bondCallContract.methods.name(address).call({ from: account });
        let symbol = await bondCallContract.methods.symbol(address).call({ from: account });
        let denomination = await bondCallContract.methods.denomination(address).call({ from: account });
        let volume = await bondCallContract.methods.issueVolume(address).call({ from: account });
        let couponRate = await bondCallContract.methods.couponRate(address).call({ from: account });
        let maturityDate = await bondCallContract.methods.maturityDate(address).call({ from: account });

        //let listOfInterestsPaid = await couponPayment.methods.getListOfInterestsPaid(address).call({ from: account });
        
        let bond = {
            dealID: dealID,
            isin: isin,
            name: name,
            symbol: symbol,
            denomination: denomination.toString(),
            issueVolume: volume.toString(),
            couponRate: couponRate.toString(),
            maturityDate: maturityDate.toString(),
            tokenSymbol: tokenSymbol,
            logo: logo
        };

        let investors = await bondCallContract.methods.listOfInvestors(address).call({ from: account });

        let lisOfInvestors = [];
        for(let i = 0; i < investors.length; i++) {
            let investor = investors[i].investor;
            let principal = await bondCallContract.methods.principalOf(investor, address).call({ from: account });
            let denomination = await bondCallContract.methods.denomination(address).call({ from: account });
            let couponRate = await bondCallContract.methods.couponRate(address).call({ from: account });

            let balance = principal / denomination;

            if(balance !== 0) {
               let interest = principal * couponRate / 10000;

                let investorData = {
                    address: investor,
                    principal: principal,
                    balance: balance,
                    interest: interest,
                    tokenSymbol: tokenSymbol,
                    bondSymbol: symbol
                }

                lisOfInvestors.push(investorData); 
            }
        }

        dispatch(setSelectedActiveBond(bond));
        dispatch(setInvestorsForSelectedActiveDeal(lisOfInvestors));
    }

    return (
        <div className="list-card">
            <Card fluid className="account-check">
                <CardContent textAlign="left">
                    <h3><strong>Select Bond</strong></h3>
                    <Dropdown
                        placeholder="Select"
                        options={bondsOption}
                        search={caseSensitiveSearch}
                        onChange={(e, data) => setDealID(data.value)}
                    />
                    <br></br>
                    <br></br>
                    <Button type='submit' color="orange" fluid size='large' onClick={setSelectedBond}>
                        Confirm
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default SelectBond;