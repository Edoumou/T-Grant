import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'semantic-ui-css/semantic.min.css';
import { Menu, MenuItem, Image, Button, Modal, Icon } from 'semantic-ui-react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import ToposCoreJSON from '@topos-protocol/topos-smart-contracts/artifacts/contracts/topos-core/ToposCore.sol/ToposCore.json';
import SubnetRegistratorJSON from '@topos-protocol/topos-smart-contracts/artifacts/contracts/topos-core/SubnetRegistrator.sol/SubnetRegistrator.json';
import ToposBankJSON from "../src/contracts/artifacts/contracts/Topos/Bank/ToposBank.sol/ToposBank.json";
import RolesJSON from "../src/contracts/artifacts/contracts/utils/Roles.sol/Roles.json";
import IssuerJSON from "../src/contracts/artifacts/contracts/Topos/Bank/Issuer.sol/Issuer.json";
import InvestorJSON from "../src/contracts/artifacts/contracts/Topos/Bank/Investor.sol/Investor.json";
import TokenCallJSON from "../src/contracts/artifacts/contracts/tests/tokens/TokenCall.sol/TokenCall.json";
import Addresses from "../src/addresses/addr.json";
import { web3Connection } from './utils/web3Connection';
import { getContract } from './utils/getContract';
import { toposData } from './utils/toposData';
import FormateAddress from './utils/FormateAddress';
import HeaderLogo from './img/header-logo.png';
import "./App.css";
import { setActiveItem, setColor, setIsConnected, setAccount, setRole, setLoggedIn, setIssuerRegistrationStatus, setInvestorRegistrationStatus, setListOfIssuers, setListOfInvestors, setIssuerRequest, setInvestorRequest, setBalance, setTokenSymbols, setDeals } from './store';
import Home from './components/Home';
import Register from './components/Register';
import Connect from './components/Connect';
import IssuerRequest from './components/IssuerRequest';
import InvestorRequest from './components/InvestorRequest';
import SubmitDeal from './components/SubmitDeal';
import ManagerRequests from './components/ManagerRequests';
import ManagerBonds from './components/ManagerBonds';
import ManagerDeals from './components/ManagerDeals';

function App() {
  const dispatch = useDispatch();
  
  const connection = useSelector(state => {
    return state.connection;
  });
  
  const fetchOnchainData = useCallback(async () => {

    let { web3, account } = await web3Connection();
    let coreData = toposData();

    dispatch(setAccount(account));

    //let toposCore = await getContract(web3, ToposCoreJSON, coreData.toposCoreProxyContractAddress);
    //let subnetRegistrator = await getContract(web3, SubnetRegistratorJSON, coreData.subnetRegistratorContractAddress);

    //const data = await loadOnchainData();

    //=== ToposBank Contract
    let toposBank = await getContract(web3, ToposBankJSON, Addresses.ToposBankContract);
    let rolesContract = await getContract(web3, RolesJSON, Addresses.RolesContract);
    let issuerContract = await getContract(web3, IssuerJSON, Addresses.IssuerContract);
    let investorContract = await getContract(web3, InvestorJSON, Addresses.InvestorContract);
    let tokenCallContract = await getContract(web3, TokenCallJSON, Addresses.TokenCallContract);

    let role = await rolesContract.methods.getRole(account).call({ from: account });
    dispatch(setRole(role));

    let tokenSymbols = await tokenCallContract.methods.getTokenSymbols().call({ from: account });
    dispatch(setTokenSymbols(tokenSymbols));

    let deals = await toposBank.methods.getListOfDeals().call({ from: account });
    dispatch(setDeals(deals));

    let balance = await web3.eth.getBalance(account);
    balance = web3.utils.fromWei(balance);
    dispatch(setBalance(balance));

    if (role === "") {
      let issuerRequest = await issuerContract.methods.issuers(account).call({ from: account });
      let investorRequest = await investorContract.methods.investors(account).call({ from: account });

      dispatch(setIssuerRequest(issuerRequest));
      dispatch(setInvestorRequest(investorRequest));
    }

    if (role === "MANAGER") {
      let listOfIssuers = await issuerContract.methods.getIssuers().call({ from: account });
      let listOfInvestors = await investorContract.methods.getInvestors().call({ from: account });
      dispatch(setListOfIssuers(listOfIssuers));
      dispatch(setListOfInvestors(listOfInvestors));
    }

    if (role === "ISSUER") {
      let issuerRequest = await issuerContract.methods.issuers(account).call({ from: account });
      dispatch(setIssuerRequest(issuerRequest));
    }

    if (role === "INVESTOR") {

    }
  });

  useEffect(() => {
    fetchOnchainData();
  });

  const handleItemClick = (e, { name }) => {
    dispatch(setActiveItem(name));
    dispatch(setColor('pink'));
  }

  const handleDisconnect = () => {
    dispatch(setLoggedIn(false));
    dispatch(setActiveItem("home"));
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
                          name='bonds'
                          active={connection.activeItem === 'bonds'}
                          onClick={handleItemClick}
                          as={Link}
                          to='/manager/bonds'
                        />
                      </>
                    : connection.role === "ISSUER" ?
                      <>
                        <MenuItem
                          position='right'
                          name='submit deal'
                          active={connection.activeItem === 'submit deal'}
                          onClick={handleItemClick}
                          as={Link}
                          to='/issuer/submit-deal'
                        />
                      </>
                    : connection.role === "INVESTOR" ?
                      <></>
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
                      <Route path='/manager/bonds' element={<ManagerBonds />} />
                    </>
                  : connection.role === "ISSUER" ?
                    <>
                      <Route path='/issuer/submit-deal' element={<SubmitDeal />} />
                    </>
                  : connection.role === "INVESTOR" ?
                    <></>
                  :
                    <></>
                }
              </>
            :
              <>
                <Route path='/connect' element={<Connect />}/>
                <Route path='/register' element={<Register />}/>
              </>
          }
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;