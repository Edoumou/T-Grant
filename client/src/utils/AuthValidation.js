import SignData from './SignData';

const AuthValidation = async (accountAddress, digiCode, web3, contract) => {

    let userAddress = await contract.methods.getUserAddress().call({ from: accountAddress });

    if (userAddress.toLowerCase() !== accountAddress.toLowerCase()) {
        return false;
    } else {
        let signedData = await SignData(digiCode, accountAddress, web3);
        let accountDigiCodeHash = await web3.eth.accounts.hashMessage(accountAddress + digiCode);

        let hash = await web3.eth.accounts.hashMessage(signedData + accountDigiCodeHash);

        // get hash from the contract
        let hashFromContract = await contract.methods.getSignatureHash().call({ from: accountAddress });

        if (hash === hashFromContract) {
            return true;
        } else {
            return false;
        }
    }
}

export default AuthValidation;