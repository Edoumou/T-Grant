import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'semantic-ui-css/semantic.min.css';
import { Menu, MenuItem, Image, Button, Modal } from 'semantic-ui-react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import ToposCoreJSON from '@topos-protocol/topos-smart-contracts/artifacts/contracts/topos-core/ToposCore.sol/ToposCore.json';
import SubnetRegistratorJSON from '@topos-protocol/topos-smart-contracts/artifacts/contracts/topos-core/SubnetRegistrator.sol/SubnetRegistrator.json';
import ToposBankJSON from "../src/contracts/artifacts/contracts/Topos/Bank/ToposBank.sol/ToposBank.json";
import RolesJSON from "../src/contracts/artifacts/contracts/utils/Roles.sol/Roles.json";
import Addresses from "../src/addresses/addr.json";
import { web3Connection } from './utils/web3Connection';
import { getContract } from './utils/getContract';
import { toposData } from './utils/toposData';
import FormateAddress from './utils/FormateAddress';
import HeaderLogo from './img/header-logo.png';
import "./App.css";
import { setActiveItem, setColor, setIsConnected, setAccount, setRole, setLoggedIn } from './store';
import Home from './components/Home';
import Register from './components/Register';
import Connect from './components/Connect';
import IssuerRequest from './components/IssuerRequest';
import InvestorRequest from './components/InvestorRequest';

function App() {
  const dispatch = useDispatch();
  
  const connection = useSelector(state => {
    return {
      activeItem: state.connection.activeItem,
      color: state.connection.color,
      isConnected: state.connection.isConnected,
      role: state.connection.role,
      account: state.connection.account,
      accountChanged: state.connection.accountChanged, 
      signedUp: state.connection.signedUp,
      loggedIn: state.connection.loggedIn
    };
  });

  const [subnetID, setSubnetID] = useState('');
  const loadWeb3 = useCallback(async () => {
    let { web3, account } = await web3Connection();
    let coreData = toposData();

    let toposCore = await getContract(web3, ToposCoreJSON, coreData.toposCoreProxyContractAddress);
    let subnetRegistrator = await getContract(web3, SubnetRegistratorJSON, coreData.subnetRegistratorContractAddress);

    //=== ToposBank Contract
    let toposBank = await getContract(web3, ToposBankJSON, Addresses.ToposBankContract);
    let rolesContract = await getContract(web3, RolesJSON, Addresses.RolesContract);

    let role = await rolesContract.methods.getRole(account).call({ from: account });

    dispatch(setRole(role));
  });

  useEffect(() => {
    loadWeb3();
  });

  const handleItemClick = (e, { name }) => {
    dispatch(setActiveItem(name));
    dispatch(setColor('pink'));
  }

  const handleDisconnect = () => {
    dispatch(setLoggedIn(false));
    dispatch(setActiveItem("home"));
  }

  const becomeIssuer = async (e, { name }) => {
    dispatch(setActiveItem(name));
    dispatch(setColor('pink'));
  }

  const becomeInvestor = async (e, { name }) => {
    dispatch(setActiveItem(name));
    dispatch(setColor('pink'));
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
                        onClick={becomeIssuer}
                        as={Link}
                        to='/register/become-issuer'
                      />
                      <MenuItem
                        name='investors'
                        active={connection.activeItem === 'investors'}
                        onClick={becomeInvestor}
                        as={Link}
                        to='/register/become-investor'
                      />
                      </>
                    : connection.role === "MANAGER" ?
                      <></>
                    : connection.role === "ISSUER" ?
                      <></>
                    : connection.role === "INVESTOR" ?
                      <></>
                    :
                      <></>
                 }
                  <MenuItem
                    name='disconnect'
                    active={connection.activeItem === 'disconnect'}
                    onClick={handleDisconnect}
                    as={Link}
                    to='/'
                  />
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
                {
                  connection.role === "" ?
                    <>
                      <Route path='/register/become-issuer' element={<IssuerRequest to='/' />}/>
                      <Route path='/register/become-investor' element={<InvestorRequest to='/' />}/>
                    </>
                  : connection.role === "MANAGER" ?
                    <></>
                  : connection.role === "ISSUER" ?
                    <></>
                  : connection.role === "ISSUER" ?
                    <></>
                  :
                    <></>
                }
                <Route path='/disconnect' element={<Navigate to='/' />}/>
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