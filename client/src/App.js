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

function App() {
  const dispatch = useDispatch();

  const data = useSelector(state => {
    return {
      signedUp: state.connection.signedUp,
      loggedIn: state.connection.loggedIn,
      account: state.connection.account
    }
  });
  
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
                  <MenuItem
                    position='right'
                    name='disconnect'
                    active={data.activeItem === 'disconnect'}
                    onClick={handleDisconnect}
                    as={Link}
                    to='/'
                  />
                  <MenuItem>
                    <Button disabled color='purple'>
                      {FormateAddress(data.account)}
                    </Button>
                  </MenuItem>
                </>
            }
          </Menu>
        </div>
        <Routes>
          <Route path='/' element={<Home />}/>
          {
            data.loggedIn ?
              <>
                <Route path='*' element={<Navigate to='/' />}/>
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