import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Image, Button, Card, CardContent, Dropdown, Grid, GridColumn, GridRow, Modal, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow, Label, List, ListContent, ListItem, ModalContent, Input, ModalActions, Icon } from "semantic-ui-react";
import TokenCallJSON from "../../src/contracts/artifacts/contracts/tests/tokens/TokenCall.sol/TokenCall.json";
import BondCallJSON from "../../src/contracts/artifacts/contracts/BondCall.sol/BondCall.json";
import BankJSON from "../../src/contracts/artifacts/contracts/Topos/Bank/ToposBank.sol/ToposBank.json";
import IssuerJSON from "../../src/contracts/artifacts/contracts/Topos/Bank/Issuer.sol/Issuer.json";
import ExchangeJSON from "../../src/contracts/artifacts/contracts/Topos/Exchange/Exchange.sol/Exchange.json";
import ExchangeBondsStorageJSON from "../../src/contracts/artifacts/contracts/Topos/Exchange/ExchangeBondsStorage.sol/ExchangeBondsStorage.json";
import USDCJSON from "../../src/contracts/artifacts/contracts/tests/tokens/assets/USDC.sol/USDC.json";
import USDTJSON from "../../src/contracts/artifacts/contracts/tests/tokens/assets/USDT.sol/USDT.json";
import EURCJSON from "../../src/contracts/artifacts/contracts/tests/tokens/assets/EURC.sol/EURC.json";
import EURTJSON from "../../src/contracts/artifacts/contracts/tests/tokens/assets/EURT.sol/EURT.json";
import CNYCJSON from "../../src/contracts/artifacts/contracts/tests/tokens/assets/CNYC.sol/CNYC.json";
import CNYTJSON from "../../src/contracts/artifacts/contracts/tests/tokens/assets/CNYT.sol/CNYT.json";
import DAIJSON from "../../src/contracts/artifacts/contracts/tests/tokens/assets/DAI.sol/DAI.json";
import Formate from "../utils/Formate";
import FormateAddress from "../utils/FormateAddress";
import Addresses from "../addresses/addr.json";
import { web3Connection } from "../utils/web3Connection";
import { getContract } from "../utils/getContract";
import { setDealsListed, setInvestorBonds, setInvestorBondsIssuers, setLoading } from "../store";
import "../users.css";
import "../manager.css";

function Exchange() {
    const [open, setOpen] = useState(false);
    const [explorerLink, setExplorerLink] = useState('');
    const [loader, setLoader] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [bondSelected, setBondSelected] = useState({});
    const [showBuyBondsForm, setShowBuyBondsForm] = useState(false);
    const [showEditBondsForm, setShowEditBondsForm] = useState(false);
    const [buyerTokenBalance, setBuyerTokenBalance] = useState('');
    const [sellerBondBalance, setSellerBondBalance] = useState('');
    const [amountToBuy, setAmountToBuy] = useState('');
    const [amountToAdd, setAmountToAdd] = useState('');
    const [newPrice, setNewPrice] = useState('');
    
    const connection = useSelector(state => {
        return state.connection;
    });

    const bonds = useSelector(state => {
        return state.bond;
    });

    const dispatch = useDispatch();

    const setBond = async (index) => {
        let { web3, account } = await web3Connection();
        let tokenCallContract = await getContract(web3, TokenCallJSON, Addresses.TokenCallContract);
        let bondCallContract = await getContract(web3, BondCallJSON, Addresses.BondCallContract);

        let balance = await tokenCallContract.methods.balanceOf(
            account,
            bonds.dealsListed[index].currencyContract
        ).call({ from: account });

        balance = web3.utils.fromWei(balance, 'ether');

        let principal = await bondCallContract.methods.principalOf(
            account,
            bonds.dealsListed[index].bondContract
        ).call({ from: account });

        let denomination = await bondCallContract.methods.denomination(
            bonds.dealsListed[index].bondContract
        ).call({ from: account });

        let bondBalance = principal / denomination;

        setBondSelected(bonds.dealsListed[index]);
        setShowBuyBondsForm(true);
        setShowEditBondsForm(false);
        setBuyerTokenBalance(balance);
        setSellerBondBalance(bondBalance);
    }

    const setEdit = async (index) => {
        let { web3, account } = await web3Connection();
        let tokenCallContract = await getContract(web3, TokenCallJSON, Addresses.TokenCallContract);
        let bondCallContract = await getContract(web3, BondCallJSON, Addresses.BondCallContract);

        let balance = await tokenCallContract.methods.balanceOf(
            account,
            bonds.dealsListed[index].currencyContract
        ).call({ from: account });

        balance = web3.utils.fromWei(balance, 'ether');

        let principal = await bondCallContract.methods.principalOf(
            account,
            bonds.dealsListed[index].bondContract
        ).call({ from: account });

        let denomination = await bondCallContract.methods.denomination(
            bonds.dealsListed[index].bondContract
        ).call({ from: account });

        let bondBalance = principal / denomination;

        setBondSelected(bonds.dealsListed[index]);
        setBondSelected(bonds.dealsListed[index]);
        setShowBuyBondsForm(false);
        setShowEditBondsForm(true);
        setSellerBondBalance(bondBalance);
    }

    const renderedBonds = bonds.dealsListed.map((list, index) => {
        return (
            <TableRow key={index}>
                <TableCell textAlign="left">
                    <Image
                        size='tiny'
                        src={list.logo}
                    />
                </TableCell>
                <TableCell textAlign='center'>
                    <a href={`https://topos.blockscout.testnet-1.topos.technology/address/${list.bondContract}`} target="_blank">
                        {FormateAddress(list.bondContract)}
                    </a>
                </TableCell>
                <TableCell textAlign='center'>{list.dealID}</TableCell>
                <TableCell textAlign='center'>
                    <a href={`https://topos.blockscout.testnet-1.topos.technology/address/${list.seller}`} target="_blank">
                        {FormateAddress(list.seller)}
                    </a>
                </TableCell>
                <TableCell textAlign='center'>{list.bondSymbol}</TableCell>
                <TableCell textAlign='center'>{Formate(list.quantity)}</TableCell>
                <TableCell textAlign='center'>{Formate(list.coupon / 100)}%</TableCell>
                <TableCell textAlign='center'>{(new Date(list.maturityDate * 1000)).toLocaleDateString()}</TableCell>
                <TableCell textAlign='center'>{Formate(list.denomination)} {list.tokenSymbol}</TableCell>
                {
                    Number(list.price) > Number(list.denomination) ?
                        <TableCell textAlign='center'>
                            <span style={{ color: "red" }}><strong>{Formate(list.price)}</strong></span> {list.tokenSymbol}
                        </TableCell>
                    : Number(list.price) < Number(list.denomination) ?
                        <TableCell textAlign='center'>
                            <span style={{ color: "green" }}><strong>{Formate(list.price)}</strong></span> {list.tokenSymbol}
                        </TableCell>
                    :
                        <TableCell textAlign='center'>{Formate(list.price)} {list.tokenSymbol}</TableCell>
                }
                <TableCell>
                    {
                        connection.account.toLowerCase() !== list.seller.toLowerCase() ?
                            <Label
                                as='a'
                                ribbon='right'
                                color="orange"
                                onClick={() => setBond(index)}
                            >
                                <strong>Buy</strong>
                            </Label>
                        :
                            <Label
                                as='a'
                                ribbon='right'
                                color="teal"
                                onClick={() => setEdit(index)}
                            >
                                <strong>Edit</strong>
                            </Label>
                    }
                </TableCell>
            </TableRow>
        );
    });

    const buyBond = async () => {
        let { web3, account } = await web3Connection();
        let bankContract = await getContract(web3, BankJSON, Addresses.ToposBankContract);
        let exchangeContract = await getContract(web3, ExchangeJSON, Addresses.ExchangeContract);
        let exchangeBondsStorage = await getContract(web3, ExchangeBondsStorageJSON, Addresses.ExchangeBondsStorageContract);
        let tokenCallContract = await getContract(web3, TokenCallJSON, Addresses.TokenCallContract);
        let bondCallContract = await getContract(web3, BondCallJSON, Addresses.BondCallContract);
        let issuerContract = await getContract(web3, IssuerJSON, Addresses.IssuerContract);


        let tokenContract = null;

        if(bondSelected.tokenSymbol === "USDC") {
            tokenContract = await getContract(web3, USDCJSON, Addresses.USDCContract);
        }
        if(bondSelected.tokenSymbol === "USDT") {
            tokenContract = await getContract(web3, USDTJSON, Addresses.USDTContract);
        }
        if(bondSelected.tokenSymbol === "EURC") {
            tokenContract = await getContract(web3, EURCJSON, Addresses.EURCContract);
        }
        if(bondSelected.tokenSymbol === "EURT") {
            tokenContract = await getContract(web3, EURTJSON, Addresses.EURTContract);
        }
        if(bondSelected.tokenSymbol === "CNYC") {
            tokenContract = await getContract(web3, CNYCJSON, Addresses.CNYCContract);
        }
        if(bondSelected.tokenSymbol === "CNYT") {
            tokenContract = await getContract(web3, CNYTJSON, Addresses.CNYTContract);
        }
        if(bondSelected.tokenSymbol === "DAI") {
            tokenContract = await getContract(web3, DAIJSON, Addresses.DAIContract);
        }

        let amount = amountToBuy * bondSelected.price;
        amount = web3.utils.toWei(amount + '', 'ether');

        await tokenContract.methods.approve(Addresses.ExchangeContract, amount)
            .send({ from: account })
            .on('transactionHash', hash => {
                setLoadingMessage('Approve Exchange Contract in Process! ⌛️');
                setExplorerLink(`https://topos.blockscout.testnet-1.topos.technology/tx/${hash}`);
                dispatch(setLoading(true));
            })
            .on('receipt', receipt => {
                setLoadingMessage('Approve Exchange Contract Completed! ✅');
            }); 

        await exchangeContract.methods.buyBonds(
            bondSelected.dealID, bondSelected.seller, amountToBuy
        ).send({ from: account })
            .on('transactionHash', hash => {
                setLoadingMessage('Buying Bonds in Process! ⌛️');
                setExplorerLink(`https://topos.blockscout.testnet-1.topos.technology/tx/${hash}`);
                dispatch(setLoading(true));
            })
            .on('receipt', receipt => {
                setLoadingMessage(`You have bought ${amountToBuy} ${bondSelected.bondSymbol}! ✅`);
                setLoader(false);
                dispatch(setLoading(false));
            });

        let deals = await bankContract.methods.getListOfDeals().call({ from: account });
        let listOfBondsListed = await exchangeBondsStorage.methods.getDealsListed().call({ from: account });

        let bondsListed = [];
        for(let i = 0; i < listOfBondsListed.length; i++) {
            let dealID = listOfBondsListed[i].dealID;
            let deal = await bankContract.methods.deals(dealID).call({ from: account });
            let bondContract = await bankContract.methods.dealBondContracts(dealID).call({ from: account });
            
            let tokenAddress = deal.currency;
            let tokenSymbol = await tokenCallContract.methods.symbol(tokenAddress).call({ from: account });
            let bondName = await bondCallContract.methods.name(bondContract).call({ from: account });
            let bondSymbol = await bondCallContract.methods.symbol(bondContract).call({ from: account });
            let denomination = await bondCallContract.methods.denomination(bondContract).call({ from: account });
            let maturityDate = await bondCallContract.methods.maturityDate(bondContract).call({ from: account });
            let coupon = await bondCallContract.methods.couponRate(bondContract).call({ from: account });

            let issuer = await issuerContract.methods.issuers(deal.issuerAddress).call({ from: account });

            if(Number(listOfBondsListed[i].amount) !== 0) {
                let data = {
                dealID: dealID,
                seller: listOfBondsListed[i].owner,
                quantity: listOfBondsListed[i].amount,
                price: listOfBondsListed[i].price,
                index: listOfBondsListed[i].index,
                tokenSymbol: tokenSymbol,
                bondName: bondName,
                bondSymbol: bondSymbol,
                logo: issuer.logoURI,
                denomination: denomination,
                maturityDate: maturityDate,
                coupon: coupon,
                bondContract: bondContract,
                currencyContract: tokenAddress
                }

                bondsListed.push(data);
            } 
        }

        let investorBonds = [];
        let investorBondsIssuers = [];
        for(let i = 0; i < deals.length; i++) {
            if(deals[i].status === "4") {
                let dealID = deals[i].dealID;
                let tokenAddress = deals[i].currency;
                let tokenSymbol = await tokenCallContract.methods.symbol(tokenAddress).call({ from: account });
                let issuer = await issuerContract.methods.issuers(deals[i].issuerAddress).call({ from: account });
                let address = await bankContract.methods.dealBondContracts(dealID).call({ from: account });

                let principal = await bondCallContract.methods.principalOf(account, address).call({ from: account });

                if(principal !== '0') {
                    let isin = await bondCallContract.methods.isin(address).call({ from: account });
                    let denomination = await bondCallContract.methods.denomination(address).call({ from: account });
                    let volume = await bondCallContract.methods.issueVolume(address).call({ from: account });
                    let couponRate = await bondCallContract.methods.couponRate(address).call({ from: account });
                    let couponFrequency = await bondCallContract.methods.couponFrequency(address).call({ from: account });
                    let maturityDate = await bondCallContract.methods.maturityDate(address).call({ from: account });
                    let symbol = await bondCallContract.methods.symbol(address).call({ from: account });
                    let name = await bondCallContract.methods.name(address).call({ from: account });

                    investorBonds.push(
                        {
                        isin: isin,
                        dealID: dealID,
                        name: name,
                        symbol: symbol,
                        denomination: denomination.toString(),
                        volume: volume.toString(),
                        couponRate: couponRate.toString(),
                        couponFrequency: couponFrequency.toString(),
                        maturityDate: maturityDate.toString(),
                        principal: principal.toString(),
                        tokenSymbol: tokenSymbol,
                        logo: issuer.logoURI,
                        prospectus: deals[i].prospectusURI
                        }
                    );

                    investorBondsIssuers.push(issuer);
                }
            }
        }

        setAmountToBuy('');
        setShowBuyBondsForm(false);

        dispatch(setDealsListed(bondsListed));
        dispatch(setInvestorBonds(investorBonds));
        dispatch(setInvestorBondsIssuers(investorBondsIssuers));
    }

    const unlistBond = async () => {
        let { web3, account } = await web3Connection();
        let bankContract = await getContract(web3, BankJSON, Addresses.ToposBankContract);
        let exchangeContract = await getContract(web3, ExchangeJSON, Addresses.ExchangeContract);
        let exchangeBondsStorage = await getContract(web3, ExchangeBondsStorageJSON, Addresses.ExchangeBondsStorageContract);
        let tokenCallContract = await getContract(web3, TokenCallJSON, Addresses.TokenCallContract);
        let bondCallContract = await getContract(web3, BondCallJSON, Addresses.BondCallContract);
        let issuerContract = await getContract(web3, IssuerJSON, Addresses.IssuerContract);

        await exchangeContract.methods.unlistBonds(
            bondSelected.dealID
        ).send({ from: account })
            .on('transactionHash', hash => {
                setLoadingMessage('Unlisting Bonds in Process! ⌛️');
                setExplorerLink(`https://topos.blockscout.testnet-1.topos.technology/tx/${hash}`);
                dispatch(setLoading(true));
            })
            .on('receipt', receipt => {
                setLoadingMessage(`You have unlisted ${amountToBuy} ${bondSelected.bondSymbol}! ✅`);
                setLoader(false);
                dispatch(setLoading(false));
            });

        let deals = await bankContract.methods.getListOfDeals().call({ from: account });
        let listOfBondsListed = await exchangeBondsStorage.methods.getDealsListed().call({ from: account });

        let bondsListed = [];
        for(let i = 0; i < listOfBondsListed.length; i++) {
            let dealID = listOfBondsListed[i].dealID;
            let deal = await bankContract.methods.deals(dealID).call({ from: account });
            let bondContract = await bankContract.methods.dealBondContracts(dealID).call({ from: account });
            
            let tokenAddress = deal.currency;
            let tokenSymbol = await tokenCallContract.methods.symbol(tokenAddress).call({ from: account });
            let bondName = await bondCallContract.methods.name(bondContract).call({ from: account });
            let bondSymbol = await bondCallContract.methods.symbol(bondContract).call({ from: account });
            let denomination = await bondCallContract.methods.denomination(bondContract).call({ from: account });
            let maturityDate = await bondCallContract.methods.maturityDate(bondContract).call({ from: account });
            let coupon = await bondCallContract.methods.couponRate(bondContract).call({ from: account });

            let issuer = await issuerContract.methods.issuers(deal.issuerAddress).call({ from: account });

            if(Number(listOfBondsListed[i].amount) !== 0) {
                let data = {
                dealID: dealID,
                seller: listOfBondsListed[i].owner,
                quantity: listOfBondsListed[i].amount,
                price: listOfBondsListed[i].price,
                index: listOfBondsListed[i].index,
                tokenSymbol: tokenSymbol,
                bondName: bondName,
                bondSymbol: bondSymbol,
                logo: issuer.logoURI,
                denomination: denomination,
                maturityDate: maturityDate,
                coupon: coupon,
                bondContract: bondContract,
                currencyContract: tokenAddress
                }

                bondsListed.push(data);
            } 
        }

        let investorBonds = [];
        let investorBondsIssuers = [];
        for(let i = 0; i < deals.length; i++) {
            if(deals[i].status === "4") {
                let dealID = deals[i].dealID;
                let tokenAddress = deals[i].currency;
                let tokenSymbol = await tokenCallContract.methods.symbol(tokenAddress).call({ from: account });
                let issuer = await issuerContract.methods.issuers(deals[i].issuerAddress).call({ from: account });
                let address = await bankContract.methods.dealBondContracts(dealID).call({ from: account });

                let principal = await bondCallContract.methods.principalOf(account, address).call({ from: account });

                if(principal !== '0') {
                    let isin = await bondCallContract.methods.isin(address).call({ from: account });
                    let denomination = await bondCallContract.methods.denomination(address).call({ from: account });
                    let volume = await bondCallContract.methods.issueVolume(address).call({ from: account });
                    let couponRate = await bondCallContract.methods.couponRate(address).call({ from: account });
                    let couponFrequency = await bondCallContract.methods.couponFrequency(address).call({ from: account });
                    let maturityDate = await bondCallContract.methods.maturityDate(address).call({ from: account });
                    let symbol = await bondCallContract.methods.symbol(address).call({ from: account });
                    let name = await bondCallContract.methods.name(address).call({ from: account });

                    investorBonds.push(
                        {
                        isin: isin,
                        dealID: dealID,
                        name: name,
                        symbol: symbol,
                        denomination: denomination.toString(),
                        volume: volume.toString(),
                        couponRate: couponRate.toString(),
                        couponFrequency: couponFrequency.toString(),
                        maturityDate: maturityDate.toString(),
                        principal: principal.toString(),
                        tokenSymbol: tokenSymbol,
                        logo: issuer.logoURI,
                        prospectus: deals[i].prospectusURI
                        }
                    );

                    investorBondsIssuers.push(issuer);
                }
            }
        }
        
        setShowEditBondsForm(false);

        dispatch(setDealsListed(bondsListed));
        dispatch(setInvestorBonds(investorBonds));
        dispatch(setInvestorBondsIssuers(investorBondsIssuers));
    }

    const updatePrice = async () => {
        let { web3, account } = await web3Connection();
        let bankContract = await getContract(web3, BankJSON, Addresses.ToposBankContract);
        let exchangeContract = await getContract(web3, ExchangeJSON, Addresses.ExchangeContract);
        let exchangeBondsStorage = await getContract(web3, ExchangeBondsStorageJSON, Addresses.ExchangeBondsStorageContract);
        let tokenCallContract = await getContract(web3, TokenCallJSON, Addresses.TokenCallContract);
        let bondCallContract = await getContract(web3, BondCallJSON, Addresses.BondCallContract);
        let issuerContract = await getContract(web3, IssuerJSON, Addresses.IssuerContract);

        await exchangeContract.methods.updateDealPrice(
            bondSelected.dealID,
            newPrice
        ).send({ from: account })
            .on('transactionHash', hash => {
                setLoadingMessage('Updating Bonds Price in Process! ⌛️');
                setExplorerLink(`https://topos.blockscout.testnet-1.topos.technology/tx/${hash}`);
                dispatch(setLoading(true));
            })
            .on('receipt', receipt => {
                setLoadingMessage(`Bonds Price Updated! ✅`);
                setLoader(false);
                dispatch(setLoading(false));
            });

        let deals = await bankContract.methods.getListOfDeals().call({ from: account });
        let listOfBondsListed = await exchangeBondsStorage.methods.getDealsListed().call({ from: account });

        let bondsListed = [];
        for(let i = 0; i < listOfBondsListed.length; i++) {
            let dealID = listOfBondsListed[i].dealID;
            let deal = await bankContract.methods.deals(dealID).call({ from: account });
            let bondContract = await bankContract.methods.dealBondContracts(dealID).call({ from: account });
            
            let tokenAddress = deal.currency;
            let tokenSymbol = await tokenCallContract.methods.symbol(tokenAddress).call({ from: account });
            let bondName = await bondCallContract.methods.name(bondContract).call({ from: account });
            let bondSymbol = await bondCallContract.methods.symbol(bondContract).call({ from: account });
            let denomination = await bondCallContract.methods.denomination(bondContract).call({ from: account });
            let maturityDate = await bondCallContract.methods.maturityDate(bondContract).call({ from: account });
            let coupon = await bondCallContract.methods.couponRate(bondContract).call({ from: account });

            let issuer = await issuerContract.methods.issuers(deal.issuerAddress).call({ from: account });

            if(Number(listOfBondsListed[i].amount) !== 0) {
                let data = {
                dealID: dealID,
                seller: listOfBondsListed[i].owner,
                quantity: listOfBondsListed[i].amount,
                price: listOfBondsListed[i].price,
                index: listOfBondsListed[i].index,
                tokenSymbol: tokenSymbol,
                bondName: bondName,
                bondSymbol: bondSymbol,
                logo: issuer.logoURI,
                denomination: denomination,
                maturityDate: maturityDate,
                coupon: coupon,
                bondContract: bondContract,
                currencyContract: tokenAddress
                }

                bondsListed.push(data);
            } 
        }

        let investorBonds = [];
        let investorBondsIssuers = [];
        for(let i = 0; i < deals.length; i++) {
            if(deals[i].status === "4") {
                let dealID = deals[i].dealID;
                let tokenAddress = deals[i].currency;
                let tokenSymbol = await tokenCallContract.methods.symbol(tokenAddress).call({ from: account });
                let issuer = await issuerContract.methods.issuers(deals[i].issuerAddress).call({ from: account });
                let address = await bankContract.methods.dealBondContracts(dealID).call({ from: account });

                let principal = await bondCallContract.methods.principalOf(account, address).call({ from: account });

                if(principal !== '0') {
                    let isin = await bondCallContract.methods.isin(address).call({ from: account });
                    let denomination = await bondCallContract.methods.denomination(address).call({ from: account });
                    let volume = await bondCallContract.methods.issueVolume(address).call({ from: account });
                    let couponRate = await bondCallContract.methods.couponRate(address).call({ from: account });
                    let couponFrequency = await bondCallContract.methods.couponFrequency(address).call({ from: account });
                    let maturityDate = await bondCallContract.methods.maturityDate(address).call({ from: account });
                    let symbol = await bondCallContract.methods.symbol(address).call({ from: account });
                    let name = await bondCallContract.methods.name(address).call({ from: account });

                    investorBonds.push(
                        {
                        isin: isin,
                        dealID: dealID,
                        name: name,
                        symbol: symbol,
                        denomination: denomination.toString(),
                        volume: volume.toString(),
                        couponRate: couponRate.toString(),
                        couponFrequency: couponFrequency.toString(),
                        maturityDate: maturityDate.toString(),
                        principal: principal.toString(),
                        tokenSymbol: tokenSymbol,
                        logo: issuer.logoURI,
                        prospectus: deals[i].prospectusURI
                        }
                    );

                    investorBondsIssuers.push(issuer);
                }
            }
        }

        setNewPrice('');
        setShowEditBondsForm(false);

        dispatch(setDealsListed(bondsListed));
        dispatch(setInvestorBonds(investorBonds));
        dispatch(setInvestorBondsIssuers(investorBondsIssuers));
    }

    const updateAmount = async () => {
        let { web3, account } = await web3Connection();
        let bankContract = await getContract(web3, BankJSON, Addresses.ToposBankContract);
        let exchangeContract = await getContract(web3, ExchangeJSON, Addresses.ExchangeContract);
        let exchangeBondsStorage = await getContract(web3, ExchangeBondsStorageJSON, Addresses.ExchangeBondsStorageContract);
        let tokenCallContract = await getContract(web3, TokenCallJSON, Addresses.TokenCallContract);
        let bondCallContract = await getContract(web3, BondCallJSON, Addresses.BondCallContract);
        let issuerContract = await getContract(web3, IssuerJSON, Addresses.IssuerContract);

        await bondCallContract.methods.approve(
            Addresses.ExchangeContract,
            amountToAdd,
            bondSelected.bondContract
        ).send({ from: account })
            .on('transactionHash', hash => {
                setLoadingMessage('Approving Exchange Contract! ⌛️');
                setExplorerLink(`https://topos.blockscout.testnet-1.topos.technology/tx/${hash}`);
                dispatch(setLoading(true));
            })
            .on('receipt', receipt => {
                setLoadingMessage(`Exchange Contract Approved! ✅`);
            });

        await exchangeContract.methods.increaseListingAmount(
            bondSelected.dealID,
            amountToAdd
        ).send({ from: account })
            .on('transactionHash', hash => {
                setLoadingMessage('Updating Listing Amount in Process! ⌛️');
                setExplorerLink(`https://topos.blockscout.testnet-1.topos.technology/tx/${hash}`);
                dispatch(setLoading(true));
            })
            .on('receipt', receipt => {
                setLoadingMessage(`Listing Amount Updated! ✅`);
                setLoader(false);
                dispatch(setLoading(false));
            });

        let deals = await bankContract.methods.getListOfDeals().call({ from: account });
        let listOfBondsListed = await exchangeBondsStorage.methods.getDealsListed().call({ from: account });

        let bondsListed = [];
        for(let i = 0; i < listOfBondsListed.length; i++) {
            let dealID = listOfBondsListed[i].dealID;
            let deal = await bankContract.methods.deals(dealID).call({ from: account });
            let bondContract = await bankContract.methods.dealBondContracts(dealID).call({ from: account });
            
            let tokenAddress = deal.currency;
            let tokenSymbol = await tokenCallContract.methods.symbol(tokenAddress).call({ from: account });
            let bondName = await bondCallContract.methods.name(bondContract).call({ from: account });
            let bondSymbol = await bondCallContract.methods.symbol(bondContract).call({ from: account });
            let denomination = await bondCallContract.methods.denomination(bondContract).call({ from: account });
            let maturityDate = await bondCallContract.methods.maturityDate(bondContract).call({ from: account });
            let coupon = await bondCallContract.methods.couponRate(bondContract).call({ from: account });

            let issuer = await issuerContract.methods.issuers(deal.issuerAddress).call({ from: account });

            if(Number(listOfBondsListed[i].amount) !== 0) {
                let data = {
                dealID: dealID,
                seller: listOfBondsListed[i].owner,
                quantity: listOfBondsListed[i].amount,
                price: listOfBondsListed[i].price,
                index: listOfBondsListed[i].index,
                tokenSymbol: tokenSymbol,
                bondName: bondName,
                bondSymbol: bondSymbol,
                logo: issuer.logoURI,
                denomination: denomination,
                maturityDate: maturityDate,
                coupon: coupon,
                bondContract: bondContract,
                currencyContract: tokenAddress
                }

                bondsListed.push(data);
            } 
        }

        let investorBonds = [];
        let investorBondsIssuers = [];
        for(let i = 0; i < deals.length; i++) {
            if(deals[i].status === "4") {
                let dealID = deals[i].dealID;
                let tokenAddress = deals[i].currency;
                let tokenSymbol = await tokenCallContract.methods.symbol(tokenAddress).call({ from: account });
                let issuer = await issuerContract.methods.issuers(deals[i].issuerAddress).call({ from: account });
                let address = await bankContract.methods.dealBondContracts(dealID).call({ from: account });

                let principal = await bondCallContract.methods.principalOf(account, address).call({ from: account });

                if(principal !== '0') {
                    let isin = await bondCallContract.methods.isin(address).call({ from: account });
                    let denomination = await bondCallContract.methods.denomination(address).call({ from: account });
                    let volume = await bondCallContract.methods.issueVolume(address).call({ from: account });
                    let couponRate = await bondCallContract.methods.couponRate(address).call({ from: account });
                    let couponFrequency = await bondCallContract.methods.couponFrequency(address).call({ from: account });
                    let maturityDate = await bondCallContract.methods.maturityDate(address).call({ from: account });
                    let symbol = await bondCallContract.methods.symbol(address).call({ from: account });
                    let name = await bondCallContract.methods.name(address).call({ from: account });

                    investorBonds.push(
                        {
                        isin: isin,
                        dealID: dealID,
                        name: name,
                        symbol: symbol,
                        denomination: denomination.toString(),
                        volume: volume.toString(),
                        couponRate: couponRate.toString(),
                        couponFrequency: couponFrequency.toString(),
                        maturityDate: maturityDate.toString(),
                        principal: principal.toString(),
                        tokenSymbol: tokenSymbol,
                        logo: issuer.logoURI,
                        prospectus: deals[i].prospectusURI
                        }
                    );

                    investorBondsIssuers.push(issuer);
                }
            }
        }

        setAmountToAdd('');
        setShowEditBondsForm(false);

        dispatch(setDealsListed(bondsListed));
        dispatch(setInvestorBonds(investorBonds));
        dispatch(setInvestorBondsIssuers(investorBondsIssuers));
    }

    const cancel = async () => {
        setShowBuyBondsForm(false);
        setShowEditBondsForm(false);
    }

    const goToExplorer = () => {
        const newWindow = window.open(explorerLink, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
    }

    return (
        <div className="exchange">
            <div className="manager-head">
                <Grid columns={2}>
                    <GridRow>
                        <GridColumn textAlign="left">
                            <strong>{connection.role}</strong>
                        </GridColumn>
                        <GridColumn textAlign="right">
                            <strong>{Number(connection.balance).toFixed(2)} TOPOS</strong>
                        </GridColumn>
                    </GridRow>
                </Grid>
            </div>
            <div>
                {
                    showBuyBondsForm ?
                        <>
                            <div className="buy-bond-head">
                                <h2>{bondSelected.bondName} - Bond</h2>
                                <hr style={{ width: 450, marginTop: 20 }}></hr>
                            </div>
                            <div className="buy-bond-body">
                                <Grid columns={3}>
                                    <GridRow>
                                        <GridColumn textAlign='left'>
                                            <h4>Your Balance:</h4>
                                            <span>
                                                {Formate(buyerTokenBalance)} {bondSelected.tokenSymbol}
                                            </span>
                                        </GridColumn>
                                        <GridColumn textAlign='center'>
                                            <h4>Bond Price:</h4>
                                            <span>{Formate(bondSelected.price)} {bondSelected.tokenSymbol}</span>
                                        </GridColumn>
                                        <GridColumn textAlign='right'>
                                            <h4>Qty in Sell:</h4>
                                            <span>
                                                {Formate(bondSelected.quantity)} {bondSelected.bondSymbol}
                                            </span>
                                        </GridColumn>
                                    </GridRow>
                                </Grid>
                                <br></br>
                                <List relaxed='very'>
                                    <ListItem>
                                        <ListContent>
                                            <div style={{ textAlign: 'center'}}>
                                                <div style={{ marginBottom: 10 }}>
                                                    <div className="can-buy-color">
                                                        <strong>You can buy up To</strong>:
                                                    </div> 
                                                </div>
                                                {
                                                    Math.trunc(buyerTokenBalance / bondSelected.price) >= bondSelected.quantity ?
                                                        <>
                                                            {Formate(bondSelected.quantity)} {bondSelected.bondSymbol}
                                                        </>
                                                    :
                                                        <>
                                                            {Formate(Math.trunc(buyerTokenBalance / bondSelected.price))} {bondSelected.bondSymbol}
                                                        </>
                                                }
                                            </div>
                                        </ListContent>
                                    </ListItem>
                                </List>
                                <br></br>
                                <br></br>
                                <Input
                                    fluid
                                    action={bondSelected.bondSymbol}
                                    size="large"
                                    placeholder='Amount to buy'
                                    value={amountToBuy}
                                    onChange={e => setAmountToBuy(e.target.value)}
                                />
                                <br></br>
                                <Modal
                                    size="tiny"
                                    open={open}
                                    trigger={
                                        <Button type='submit' primary fluid size='large' onClick={buyBond}>
                                            Buy
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
                                        <Button color='black' onClick={() => setOpen(false)}>
                                            Go to Dashboard
                                        </Button>
                                    </ModalActions>
                                </Modal>
                                <br></br>
                                <div className="buy-bond-button">
                                    <Button color="red" onClick={cancel}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </>
                    : showEditBondsForm ?
                        <>
                            <div className="buy-bond-head">
                                <h2>{bondSelected.bondName} - Bond</h2>
                                <hr style={{ width: 450, marginTop: 20 }}></hr>
                            </div>
                            <div className="edit-bond-body">
                                <Grid columns={5}>
                                    <GridRow>
                                        <GridColumn textAlign='center' width={5}>
                                            <h4>Update Price</h4>
                                            <h5>Current Price:</h5>
                                            <span>{Formate(bondSelected.price)} {bondSelected.tokenSymbol}</span>
                                            <br></br>
                                            <br></br>
                                            <Input
                                                fluid
                                                action={bondSelected.tokenSymbol}
                                                size="large"
                                                placeholder='New Price'
                                                value={newPrice}
                                                onChange={e => setNewPrice(e.target.value)}
                                            />
                                            <br></br>
                                            <Modal
                                                size="tiny"
                                                open={open}
                                                trigger={
                                                    <Button type='submit' primary fluid size='large' onClick={updatePrice}>
                                                        Update Price
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
                                                                <Button inverted basic loading size="massive">Updating Price</Button>
                                                            :
                                                                <p style={{ color: 'green' }}><strong>Price Updated successfully</strong></p>
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
                                        </GridColumn>
                                        <GridColumn  width={1}></GridColumn>
                                        <GridColumn  width={5} textAlign='center'>
                                            <h4>Increase Amount</h4>
                                            <h5>Your Balance:</h5>
                                            <span>{Formate(sellerBondBalance)} {bondSelected.bondSymbol}</span>
                                            <br></br>
                                            <br></br>
                                            <Input
                                                fluid
                                                action={bondSelected.bondSymbol}
                                                size="large"
                                                placeholder='Amount to Add'
                                                value={amountToAdd}
                                                onChange={e => setAmountToAdd(e.target.value)}
                                            />
                                            <br></br>
                                            <Modal
                                                size="tiny"
                                                open={open}
                                                trigger={
                                                    <Button type='submit' primary fluid size='large' onClick={updateAmount}>
                                                        Add Bonds
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
                                                                <Button inverted basic loading size="massive">Adding New Bonds</Button>
                                                            :
                                                                <p style={{ color: 'green' }}><strong>New Bonds Added successfully</strong></p>
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
                                        </GridColumn>
                                        <GridColumn width={1}></GridColumn>
                                        <GridColumn  width={4} textAlign='right'>
                                            <h4>Unlist Bonds</h4>
                                            <Modal
                                                size="tiny"
                                                open={open}
                                                trigger={
                                                    <Button type='submit' primary size='large' onClick={unlistBond}>
                                                        Unlist
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
                                                                <Button inverted basic loading size="massive">unlisting Bonds</Button>
                                                            :
                                                                <p style={{ color: 'green' }}><strong>Bonds Unlisted successfully</strong></p>
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
                                        </GridColumn>
                                    </GridRow>
                                </Grid>
                                <br></br>
                                <br></br>
                                <br></br>
                                <br></br>
                                <div className="buy-bond-button">
                                    <Button color="red" onClick={cancel}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </>
                    :
                        <>
                            <div className="exchangelList">
                                <h2>Bond Market</h2>
                            </div>
                            {
                                bonds.dealsListed.length > 0 ?
                                    <div className="exchange-tab-scroll">
                                        <Table padded selectable inverted>
                                            <TableHeader className="header-sticky">
                                                <TableRow>
                                                    <TableHeaderCell>Issuer</TableHeaderCell>
                                                    <TableHeaderCell textAlign='center'>Bond Contract</TableHeaderCell>
                                                    <TableHeaderCell textAlign='center'>Deal ID</TableHeaderCell>
                                                    <TableHeaderCell textAlign='center'>Seller</TableHeaderCell>
                                                    <TableHeaderCell textAlign='center'>Symbol</TableHeaderCell>
                                                    <TableHeaderCell textAlign='center'>Quantity</TableHeaderCell>
                                                    <TableHeaderCell textAlign='center'>Coupon</TableHeaderCell>
                                                    <TableHeaderCell textAlign='center'>Maturity</TableHeaderCell>
                                                    <TableHeaderCell textAlign='center'>Par Value</TableHeaderCell>
                                                    <TableHeaderCell textAlign='center'>Price</TableHeaderCell>
                                                    <TableHeaderCell textAlign='center'></TableHeaderCell>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {renderedBonds}
                                            </TableBody>
                                        </Table>
                                    </div>
                                :
                                    <div  className="no-approved-deal">
                                        There are no Bonds Listed on the Exchange at the moment
                                        <br></br>
                                        <br></br>
                                        Come back later
                                    </div>
                            }
                        </>
                }
            </div>
        </div>
    );
}

export default Exchange;