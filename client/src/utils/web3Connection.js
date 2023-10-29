import Web3 from 'web3';

export const web3Connection = async () => {
    let web3;
    let accounts

    if(typeof window.ethereum !== 'undefined') {
        accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });

        web3 = new Web3(window.ethereum);
    } else {
        alert('Please install Metamask');
    }

    return {
        web3: web3,
        account: accounts[0]
    };
}