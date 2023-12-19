import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'semantic-ui-css/semantic.min.css';
import { Menu, MenuItem, Image, Button, Icon, Segment } from 'semantic-ui-react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import ToposBankJSON from "../src/contracts/artifacts/contracts/Topos/Bank/ToposBank.sol/ToposBank.json";
import BondCallJSON from "../src/contracts/artifacts/contracts/BondCall.sol/BondCall.json";
import RolesJSON from "../src/contracts/artifacts/contracts/utils/Roles.sol/Roles.json";
import IssuerJSON from "../src/contracts/artifacts/contracts/Topos/Bank/Issuer.sol/Issuer.json";
import InvestorJSON from "../src/contracts/artifacts/contracts/Topos/Bank/Investor.sol/Investor.json";
import TokenCallJSON from "../src/contracts/artifacts/contracts/tests/tokens/TokenCall.sol/TokenCall.json";
import IssuersFundJSON from "../src/contracts/artifacts/contracts/treasury/IssuersFund.sol.sol/IssuersFund.json";
import ExchangeBondsStorageJSON from "../src/contracts/artifacts/contracts/Topos/Exchange/ExchangeBondsStorage.sol/ExchangeBondsStorage.json";
import Addresses from "../src/addresses/addr.json";
import { web3Connection } from './utils/web3Connection';
import { getContract } from './utils/getContract';
import FormateAddress from './utils/FormateAddress';
import HeaderLogo from './img/header-logo.png';
import "./App.css";
import { setActiveItem, setColor, setAccount, setRole, setLoggedIn, setListOfIssuers, setListOfInvestors, setIssuerRequest, setInvestorRequest, setBalance, setTokenSymbols, setDeals, setTokenAddresses, setIssuerDealsCurrencySymbols, setInvestorBonds, setInvestorBondsIssuers } from './store';
import Home from './components/Home';
import Register from './components/Register';
import Connect from './components/Connect';
import IssuerRequest from './components/IssuerRequest';
import InvestorRequest from './components/InvestorRequest';
import SubmitDeal from './components/SubmitDeal';
import ManagerRequests from './components/ManagerRequests';
import ManagerDeals from './components/ManagerDeals';
import { setActiveBondsDealID, setApprovedDeals, setBondSymbols, setBonds, setBondsCurrency, setBondsDealIDs, setBondsIssuers, setDealsFund, setDealsListed, setDealsToIssue, setIssuersForApprovedDelas, setIssuersLogo, setIssuersName, setIssuersNameForApprovedDeals, setSelectedDealID, setShowInvestForm, setTokenSymbolForApprovedDeals } from './store/slices/bondSlice';
import InvestorDeals from './components/InvestorDeals';
import MintTokens from './components/MintTokens';
import IssueBonds from './components/IssueBonds';
import InvestorBonds from './components/InvestorBonds';
import ManagerCoupons from './components/ManagerCoupons';
import DealsFund from './components/DealsFund';
import Exchange from './components/Exchange';
import BondMarket from './components/BondMarket';
import RedeemBonds from './components/RedeemBonds';

function App() {
  const dispatch = useDispatch();
  
  const connection = useSelector(state => {
    return state.connection;
  });
  
  const fetchOnchainData = useCallback(async () => {
    let { web3, account } = await web3Connection();

    dispatch(setAccount(account));

    let toposBank = await getContract(web3, ToposBankJSON, Addresses.ToposBankContract);
    let rolesContract = await getContract(web3, RolesJSON, Addresses.RolesContract);
    let issuerContract = await getContract(web3, IssuerJSON, Addresses.IssuerContract);
    let investorContract = await getContract(web3, InvestorJSON, Addresses.InvestorContract);
    let tokenCallContract = await getContract(web3, TokenCallJSON, Addresses.TokenCallContract);
    let bondCallContract = await getContract(web3, BondCallJSON, Addresses.BondCallContract);
    let issuersFundContract = await getContract(web3, IssuersFundJSON, Addresses.IssuersFundContract);
    let exchangeBondsStorage = await getContract(web3, ExchangeBondsStorageJSON, Addresses.ExchangeBondsStorageContract);

    let role = await rolesContract.methods.getRole(account).call({ from: account });

    let tokenAddresses = await tokenCallContract.methods.getTokenAddresses().call({ from: account });
    let tokenSymbols = await tokenCallContract.methods.getTokenSymbols().call({ from: account });
    let deals = await toposBank.methods.getListOfDeals().call({ from: account });
    let bonds = await toposBank.methods.getListOfBonds().call({ from: account });
    let bondsDealIDs = await toposBank.methods.getListOfBondsDealIDs().call({ from: account });
    let listOfBondsListed = await exchangeBondsStorage.methods.getDealsListed().call({ from: account });

    //=== store bonds currency symbols
    let bondSymbols = [];
    let issuersNames = [];
    let issuersLogo = [];
    let issuersNameForApprovedDeals = [];
    let approvedDeals = [];
    let issuersForApprovedDeals = [];
    let tokenSymbolForApprovedDeals = [];
    let dealsToIssue = [];
    for(let i = 0; i < deals.length; i++) {
      let tokenAddress = deals[i].currency;
      let tokenSymbol = await tokenCallContract.methods.symbol(tokenAddress).call({ from: account });

      let issuer = await issuerContract.methods.issuers(deals[i].issuerAddress).call({ from: account });

      bondSymbols.push(tokenSymbol);
      issuersNames.push(issuer.name);
      issuersLogo.push(issuer.logoURI);
      
      if(deals[i].status === "2") {
        let issuerForApprovedDeals = issuer;

        let dealID = deals[i].dealID;
        let dealDebtAmount = deals[i].debtAmount;
        let totalAmountInvested = await toposBank.methods.totalAmountInvestedForDeal(dealID).call({ from: account });

        approvedDeals.push(deals[i]);
        issuersForApprovedDeals.push(issuerForApprovedDeals);
        issuersNameForApprovedDeals.push(issuer.name);
        tokenSymbolForApprovedDeals.push(tokenSymbol);

        if (dealDebtAmount === totalAmountInvested) {
          dealsToIssue.push(dealID);
        }
      }
    }

    //=== Bonds
    let bondsIssuers = [];
    let bondsCurrency = [];
    for(let i = 0; i < bondsDealIDs.length; i++) {
      let deal = await toposBank.methods.deals(bondsDealIDs[i]).call({ from: account });
      let issuerAddress = deal.issuerAddress;
      let currency = deal.currency;

      let issuer = await issuerContract.methods.issuers(issuerAddress).call({ from: account });

      let tokenSymbol = await tokenCallContract.methods.symbol(currency).call({ from: account });

      bondsIssuers.push(issuer);
      bondsCurrency.push(tokenSymbol);
    }

    //=== Exchange
    let bondsListed = [];
    for(let i = 0; i < listOfBondsListed.length; i++) {
      let dealID = listOfBondsListed[i].dealID;
      let deal = await toposBank.methods.deals(dealID).call({ from: account });
      let bondContract = await toposBank.methods.dealBondContracts(dealID).call({ from: account });
      
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

    dispatch(setDealsToIssue(dealsToIssue));
    dispatch(setBondSymbols(bondSymbols));
    dispatch(setIssuersName(issuersNames));
    dispatch(setIssuersLogo(issuersLogo));
    dispatch(setApprovedDeals(approvedDeals));
    dispatch(setIssuersForApprovedDelas(issuersForApprovedDeals));
    dispatch(setIssuersNameForApprovedDeals(issuersNameForApprovedDeals));
    dispatch(setTokenSymbolForApprovedDeals(tokenSymbolForApprovedDeals));
    dispatch(setBonds(bonds));
    dispatch(setBondsDealIDs(bondsDealIDs));
    dispatch(setBondsIssuers(bondsIssuers));
    dispatch(setBondsCurrency(bondsCurrency));
    dispatch(setDealsListed(bondsListed));
    
    //=== Invstors bonds
    let investorBonds = [];
    let activeBondsDealID = [];
    let investorBondsIssuers = [];
    let DealsFund = [];
    for(let i = 0; i < deals.length; i++) {
      if(deals[i].status === "4") {
        let dealID = deals[i].dealID;
        let tokenAddress = deals[i].currency;
        let tokenSymbol = await tokenCallContract.methods.symbol(tokenAddress).call({ from: account });
        let issuer = await issuerContract.methods.issuers(deals[i].issuerAddress).call({ from: account });
        let address = await toposBank.methods.dealBondContracts(dealID).call({ from: account });

        activeBondsDealID.push(dealID);

        let funds = await issuersFundContract.methods.totalAmount(dealID).call({ from: account });

        if(Number(funds) !== 0) {
          DealsFund.push(dealID);
        }

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
    
    dispatch(setInvestorBonds(investorBonds));
    dispatch(setActiveBondsDealID(activeBondsDealID));
    dispatch(setInvestorBondsIssuers(investorBondsIssuers));
    dispatch(setDealsFund(DealsFund));

    //=== issuers filtering
    if (role === "ISSUER") {
      let issuerDeals = deals.filter(
        deal => deal.issuerAddress.toLowerCase() === account.toLowerCase()
      );

      let issuerDealsCurrencySymbols = [];
      for(let i = 0; i < issuerDeals.length; i++) {
        let tokenAddress = issuerDeals[i].currency;
        let tokenSymbol = await tokenCallContract.methods.symbol(tokenAddress).call({ from: account });

        issuerDealsCurrencySymbols.push(tokenSymbol);
      }

      dispatch(setIssuerDealsCurrencySymbols(issuerDealsCurrencySymbols));
    }
    
    let listOfIssuers = await issuerContract.methods.getIssuers().call({ from: account });
    let listOfInvestors = await investorContract.methods.getInvestors().call({ from: account });
    let issuerRequest = await issuerContract.methods.issuers(account).call({ from: account });
    let investorRequest = await investorContract.methods.investors(account).call({ from: account });
    let balance = await web3.eth.getBalance(account);
    balance = web3.utils.fromWei(balance);

    dispatch(setRole(role));
    dispatch(setTokenAddresses(tokenAddresses));
    dispatch(setTokenSymbols(tokenSymbols));
    dispatch(setDeals(deals));
    dispatch(setListOfIssuers(listOfIssuers));
    dispatch(setListOfInvestors(listOfInvestors));
    dispatch(setIssuerRequest(issuerRequest));
    dispatch(setInvestorRequest(investorRequest));
    dispatch(setBalance(balance)); 

    const cleanUp = () => {

    };

    return cleanUp;
  }, [dispatch]);

  const checkAccountChange = useCallback(async () => {
    let { web3 } = await web3Connection();

    let toposBank = await getContract(web3, ToposBankJSON, Addresses.ToposBankContract);
    let rolesContract = await getContract(web3, RolesJSON, Addresses.RolesContract);
    let issuerContract = await getContract(web3, IssuerJSON, Addresses.IssuerContract);
    let investorContract = await getContract(web3, InvestorJSON, Addresses.InvestorContract);
    let tokenCallContract = await getContract(web3, TokenCallJSON, Addresses.TokenCallContract);
    let bondCallContract = await getContract(web3, BondCallJSON, Addresses.BondCallContract);
    let issuersFundContract = await getContract(web3, IssuersFundJSON, Addresses.IssuersFundContract);
    let exchangeBondsStorage = await getContract(web3, ExchangeBondsStorageJSON, Addresses.ExchangeBondsStorageContract);

    if(typeof window.ethereum !== 'undefined') {
      await window.ethereum.on('accountsChanged', async accounts => {
        let account = accounts[0];
        
        let role = await rolesContract.methods.getRole(account).call({ from: account });

        let tokenAddresses = await tokenCallContract.methods.getTokenAddresses().call({ from: account });
        let tokenSymbols = await tokenCallContract.methods.getTokenSymbols().call({ from: account });
        let deals = await toposBank.methods.getListOfDeals().call({ from: account });
        let bonds = await toposBank.methods.getListOfBonds().call({ from: account });
        let bondsDealIDs = await toposBank.methods.getListOfBondsDealIDs().call({ from: account });
        let listOfBondsListed = await exchangeBondsStorage.methods.getDealsListed().call({ from: account });

        //=== store bonds currency symbols
        let bondSymbols = [];
        let issuersNames = [];
        let issuersLogo = [];
        let issuersNameForApprovedDeals = [];
        let approvedDeals = [];
        let issuersForApprovedDeals = [];
        let tokenSymbolForApprovedDeals = [];
        for(let i = 0; i < deals.length; i++) {
          let tokenAddress = deals[i].currency;
          let tokenSymbol = await tokenCallContract.methods.symbol(tokenAddress).call({ from: account });

          let issuer = await issuerContract.methods.issuers(deals[i].issuerAddress).call({ from: account });

          bondSymbols.push(tokenSymbol);
          issuersNames.push(issuer.name);
          issuersLogo.push(issuer.logoURI);

          if(deals[i].status === "2") {
            let issuerForApprovedDeals = issuer;

            approvedDeals.push(deals[i]);
            issuersForApprovedDeals.push(issuerForApprovedDeals);
            issuersNameForApprovedDeals.push(issuer.name);
            tokenSymbolForApprovedDeals.push(tokenSymbol);
          }
        }

        //=== Bonds
        let bondsIssuers = [];
        let bondsCurrency = [];
        for(let i = 0; i < bondsDealIDs.length; i++) {
          let deal = await toposBank.methods.deals(bondsDealIDs[i]).call({ from: account });
          let issuerAddress = deal.issuerAddress;
          let currency = deal.currency;

          let issuer = await issuerContract.methods.issuers(issuerAddress).call({ from: account });

          let tokenSymbol = await tokenCallContract.methods.symbol(currency).call({ from: account });

          bondsIssuers.push(issuer);
          bondsCurrency.push(tokenSymbol);
        }

        //=== Exchange
        let bondsListed = [];
        for(let i = 0; i < listOfBondsListed.length; i++) {
          let dealID = listOfBondsListed[i].dealID;
          let deal = await toposBank.methods.deals(dealID).call({ from: account });
          let bondContract = await toposBank.methods.dealBondContracts(dealID).call({ from: account });

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

        dispatch(setBondSymbols(bondSymbols));
        dispatch(setIssuersName(issuersNames));
        dispatch(setIssuersLogo(issuersLogo));
        dispatch(setApprovedDeals(approvedDeals));
        dispatch(setIssuersForApprovedDelas(issuersForApprovedDeals));
        dispatch(setIssuersNameForApprovedDeals(issuersNameForApprovedDeals));
        dispatch(setTokenSymbolForApprovedDeals(tokenSymbolForApprovedDeals));
        dispatch(setBonds(bonds));
        dispatch(setBondsDealIDs(bondsDealIDs));
        dispatch(setBondsIssuers(bondsIssuers));
        dispatch(setBondsCurrency(bondsCurrency));
        dispatch(setDealsListed(bondsListed));

        //=== Invstors bonds
        let investorBonds = [];
        let investorBondsIssuers = [];
        let DealsFund = [];
        for(let i = 0; i < deals.length; i++) {
          if(deals[i].status === "4") {
            let dealID = deals[i].dealID;
            let tokenAddress = deals[i].currency;
            let tokenSymbol = await tokenCallContract.methods.symbol(tokenAddress).call({ from: account });
            let issuer = await issuerContract.methods.issuers(deals[i].issuerAddress).call({ from: account });
            let address = await toposBank.methods.dealBondContracts(dealID).call({ from: account });

            let funds = await issuersFundContract.methods.totalAmount(dealID).call({ from: account });

            if(Number(funds) !== 0) {
              DealsFund.push(dealID);
            }

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

        dispatch(setInvestorBonds(investorBonds));
        dispatch(setInvestorBondsIssuers(investorBondsIssuers));
        dispatch(setDealsFund(DealsFund));

        //=== issuers filtering
        if (role === "ISSUER") {
          let issuerDeals = deals.filter(
            deal => deal.issuerAddress.toLowerCase() === account.toLowerCase()
          );

          let issuerDealsCurrencySymbols = [];
          for(let i = 0; i < issuerDeals.length; i++) {
            let tokenAddress = issuerDeals[i].currency;
            let tokenSymbol = await tokenCallContract.methods.symbol(tokenAddress).call({ from: account });

            issuerDealsCurrencySymbols.push(tokenSymbol);
          }

          dispatch(setIssuerDealsCurrencySymbols(issuerDealsCurrencySymbols));
        }

        
        let listOfIssuers = await issuerContract.methods.getIssuers().call({ from: account });
        let listOfInvestors = await investorContract.methods.getInvestors().call({ from: account });
        let issuerRequest = await issuerContract.methods.issuers(account).call({ from: account });
        let investorRequest = await investorContract.methods.investors(account).call({ from: account });
        let balance = await web3.eth.getBalance(account);
        balance = web3.utils.fromWei(balance);

        dispatch(setAccount(account));
        dispatch(setRole(role));
        dispatch(setTokenAddresses(tokenAddresses));
        dispatch(setTokenSymbols(tokenSymbols));
        dispatch(setDeals(deals));
        dispatch(setListOfIssuers(listOfIssuers));
        dispatch(setListOfInvestors(listOfInvestors));
        dispatch(setIssuerRequest(issuerRequest));
        dispatch(setInvestorRequest(investorRequest));
        dispatch(setBalance(balance)); 
        dispatch(setLoggedIn(false));
        dispatch(setSelectedDealID(''));
        dispatch(setShowInvestForm(false));
      });
    }

    const cleanUp = () => {

    };

    return cleanUp;
  }, [dispatch]);

  useEffect(() => {
    checkAccountChange();
    fetchOnchainData();
  }, [checkAccountChange, fetchOnchainData]);

  const handleItemClick = (e, { name }) => {
    dispatch(setActiveItem(name));
    dispatch(setColor('pink'));
  }

  const handleDisconnect = async () => {
    dispatch(setLoggedIn(false));
    dispatch(setActiveItem("home"));
    dispatch(setSelectedDealID(''));
    dispatch(setShowInvestForm(false));
  }

  return (
    <div className='App'>
      <BrowserRouter>
        <div className='header'>
          <Menu stackable pointing inverted secondary size='large'>
            <MenuItem name='home' onClick={handleItemClick} as={Link} to='/'>
              <Image src={HeaderLogo} size='medium' />
            </MenuItem>
            {
              !connection.loggedIn ?
                <>
                  <MenuItem
                      position='right'
                      name='bond market'
                      active={connection.activeItem === 'bond market'}
                      onClick={handleItemClick}
                      as={Link}
                      to='/bond-market'
                  />
                  <MenuItem
                      name='register'
                      active={connection.activeItem === 'register'}
                      onClick={handleItemClick}
                      as={Link}
                      to='/register'
                  />
                  <MenuItem
                      name='connect'
                      active={connection.activeItem === 'connect'}
                      onClick={handleItemClick}
                      as={Link}
                      to='/connect'
                  />
                </>
              :
                <>
                 {
                    connection.role === "" ?
                      <>
                        <MenuItem
                          position='right'
                          name='issuers'
                          active={connection.activeItem === 'issuers'}
                          onClick={handleItemClick}
                          as={Link}
                          to='/register/become-issuer'
                        />
                        <MenuItem
                          name='investors'
                          active={connection.activeItem === 'investors'}
                          onClick={handleItemClick}
                          as={Link}
                          to='/register/become-investor'
                        />
                      </>
                    : connection.role === "MANAGER" ?
                      <>
                        <MenuItem
                          position='right'
                          name='requests'
                          active={connection.activeItem === 'requests'}
                          onClick={handleItemClick}
                          as={Link}
                          to='/manager/requests'
                        />
                        <MenuItem
                          name='deals'
                          active={connection.activeItem === 'deals'}
                          onClick={handleItemClick}
                          as={Link}
                          to='/manager/deals'
                        />
                        <MenuItem
                          name='issue bonds'
                          active={connection.activeItem === 'issue bonds'}
                          onClick={handleItemClick}
                          as={Link}
                          to='/manager/issue-bonds'
                        />
                        <MenuItem
                          name='redeem bonds'
                          active={connection.activeItem === 'redeem bonds'}
                          onClick={handleItemClick}
                          as={Link}
                          to='/manager/redeem-bonds'
                        />
                        <MenuItem
                          name='coupons'
                          active={connection.activeItem === 'coupons'}
                          onClick={handleItemClick}
                          as={Link}
                          to='/manager/coupons'
                        />
                        <MenuItem
                          name='funds'
                          active={connection.activeItem === 'funds'}
                          onClick={handleItemClick}
                          as={Link}
                          to='/manager/funds'
                        />
                        <MenuItem
                          name='mint tokens'
                          active={connection.activeItem === 'mint tokens'}
                          onClick={handleItemClick}
                          as={Link}
                          to='/investor/mint-tokens'
                        />
                        <MenuItem
                          name='exchange'
                          active={connection.activeItem === 'exchange'}
                          onClick={handleItemClick}
                          as={Link}
                          to='/exchange'
                        />
                      </>
                    : connection.role === "ISSUER" ?
                      <>
                        <MenuItem
                          position='right'
                          name='deals'
                          active={connection.activeItem === 'submit deals'}
                          onClick={handleItemClick}
                          as={Link}
                          to='/issuer/submit-deal'
                        />
                        <MenuItem
                          name='exchange'
                          active={connection.activeItem === 'exchange'}
                          onClick={handleItemClick}
                          as={Link}
                          to='/exchange'
                        />
                      </>
                    : connection.role === "INVESTOR" ?
                      <>
                        <MenuItem
                          position='right'
                          name='deals'
                          active={connection.activeItem === 'deals'}
                          onClick={handleItemClick}
                          as={Link}
                          to='/investor/deals'
                        />
                        <MenuItem
                          name='bonds'
                          active={connection.activeItem === 'bonds'}
                          onClick={handleItemClick}
                          as={Link}
                          to='/investor/bonds'
                        />
                        <MenuItem
                          name='exchange'
                          active={connection.activeItem === 'exchange'}
                          onClick={handleItemClick}
                          as={Link}
                          to='/exchange'
                        />
                        <MenuItem
                          name='mint tokens'
                          active={connection.activeItem === 'mint tokens'}
                          onClick={handleItemClick}
                          as={Link}
                          to='/investor/mint-tokens'
                        />
                      </>
                    :
                      <></>
                 }
                  <MenuItem
                    name='disconnect'
                    onClick={handleDisconnect}
                    as={Link}
                    to='/'
                    className='sign-out'
                  >
                    <Icon fitted color='red'  name='sign-out' />
                    <div className='hover-text'>disconnect</div>
                  </MenuItem>
                  <MenuItem>
                    <Button disabled color='purple'>
                      {FormateAddress(connection.account)}
                    </Button>
                  </MenuItem>
                </>
            }
          </Menu>
        </div>
        <Routes>
          <Route path='/' element={<Home />}/>
          {
            connection.loggedIn ?
              <>
                <Route path='*' element={<Navigate to='/' />}/>
                <Route path='/disconnect' element={<Navigate to='/' />}/>
                {
                  connection.role === "" ?
                    <>
                      <Route path='/register/become-issuer' element={<IssuerRequest />}/>
                      <Route path='/register/become-investor' element={<InvestorRequest />}/>
                    </>
                  : connection.role === "MANAGER" ?
                    <>
                      <Route path='/manager/requests' element={<ManagerRequests />} />
                      <Route path='/manager/deals' element={<ManagerDeals />} />
                      <Route path='/manager/issue-bonds' element={<IssueBonds />} />
                      <Route path='/manager/redeem-bonds' element={<RedeemBonds />} />
                      <Route path='/manager/coupons' element={<ManagerCoupons />} />
                      <Route path='/manager/funds' element={<DealsFund />} />
                      <Route path='/investor/mint-tokens' element={<MintTokens />} />
                      <Route path='/exchange' element={<Exchange />} />
                    </>
                  : connection.role === "ISSUER" ?
                    <>
                      <Route path='/issuer/submit-deal' element={<SubmitDeal />} />
                      <Route path='/exchange' element={<Exchange />} />
                    </>
                  : connection.role === "INVESTOR" ?
                    <>
                      <Route path='/investor/deals' element={<InvestorDeals />} />
                      <Route path='/investor/bonds' element={<InvestorBonds />} />
                      <Route path='/exchange' element={<Exchange />} />
                      <Route path='/investor/mint-tokens' element={<MintTokens />} />
                    </>
                  :
                    <></>
                }
              </>
            :
              <>
                <Route path='/bond-market' element={<BondMarket />}/>
                <Route path='/connect' element={<Connect />}/>
                <Route path='/register' element={<Register />}/>
              </>
          }
        </Routes>
      </BrowserRouter>
      <div className='footer'>
          <Segment inverted>
            <Icon name='phone' />
            <a href="tel:+33758404077">
              (+33) 7 58 40 40 77
            </a>
            <span className='mail-foot'>
              <Icon name='mail' />
              <a href="mailto:saimelgwlanold@gmail.com">
                saimelgwlanold@gmail.com
              </a>
            </span>
          </Segment>
      </div>
    </div>
  );
}

export default App;