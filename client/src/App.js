import React, { useCallback, useEffect, useState } from 'react';
import ToposCoreJSON from '@topos-protocol/topos-smart-contracts/artifacts/contracts/topos-core/ToposCore.sol/ToposCore.json';
import SubnetRegistratorJSON from '@topos-protocol/topos-smart-contracts/artifacts/contracts/topos-core/SubnetRegistrator.sol/SubnetRegistrator.json';
import { web3Connection } from './utils/web3Connection';
import { getContract } from './utils/getContract';
import { toposData } from './utils/toposData';
import "./App.css";

function App() {
  const [subnetID, setSubnetID] = useState('');

  const loadWeb3 = useCallback(async () => {
    let { web3, account } = await web3Connection();
    let coreData = toposData();

    let toposCore = await getContract(web3, ToposCoreJSON, coreData.toposCoreProxyContractAddress);
    let subnetRegistrator = await getContract(web3, SubnetRegistratorJSON, coreData.subnetRegistratorContractAddress);

    let id = await toposCore.methods.networkSubnetId().call({ from: account });
    let subnetAt = await subnetRegistrator.methods.getSubnetIdAtIndex('0').call({ from: account });
    let subnets = await subnetRegistrator.methods.subnets(subnetAt).call({ from: account });

    setSubnetID(id);

    console.log('subnet id;', id);
    console.log('subnet at;', subnetAt);
    console.log('subnets;', subnets);
  });

  useEffect(() => {
    loadWeb3();
  });

  return (
    <div className='App'>
      <h2>This quasi-empty page will become a full Dapp</h2>

      Stange, yeah!!! let's keep building 💪🦾💪
      <p>Topos</p>
    </div>
  );
}

export default App;