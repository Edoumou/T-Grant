import React, { useState } from "react";
import 'semantic-ui-css/semantic.min.css';
import { Grid, GridColumn, GridRow } from "semantic-ui-react";
import BankJSON from "../contracts/artifacts/contracts/Topos/Bank/ToposBank.sol/ToposBank.json";
import TokenCallJSON from "../contracts/artifacts/contracts/tests/tokens/TokenCall.sol/TokenCall.json";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import Addresses from "../addresses/addr.json";
import "../users.css";
import "../manager.css";

function IssuerListOfDeals() {
    const [deals, setDeals] = useState([]);
    const [currencySymbold, setCurrencySymbold] = useState([]);

    const fetchOnchainData = useCallback(async () => {
        let { web3, account } = await web3Connection();
        let bankContract = await getContract(web3, BankJSON, Addresses.ToposBankContract);
        let tokenCallContract = await getContract(web3, TokenCallJSON, Addresses.TokenCallContract);

        let allDeals = await bankContract.methods.getListOfDeals().call({ from: account });

        // get the current issuer deals
        let issuerDeals = allDeals.filter(
            deal => deal.issuerAddress.toLowerCase() === account.toLowerCase()
        );

        let dealsCurrencySymbols = [];
        for(let i = 0; i < issuerDeals.length; i++) {
            let tokenAddress = issuerDeals[i].currency;
            let symbol = await tokenCallContract.methods.symbol(tokenAddress).call({ from: account });

            dealsCurrencySymbols.push(symbol);
        }
    }, []);
 
    useEffect(() => {
        fetchOnchainData();
    }, [fetchOnchainData])

    return (
        <div>

        </div>
    );
}

export default IssuerListOfDeals;