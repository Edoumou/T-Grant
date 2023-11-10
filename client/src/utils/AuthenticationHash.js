import SignData from './SignData';

const AuthenticationHash = async (accountAddress, digiCode, web3) => {
    let signedMessage = await SignData(digiCode, accountAddress, web3);
    let accountDigiCodeHash = await web3.eth.accounts.hashMessage(accountAddress + digiCode);

    return await web3.eth.accounts.hashMessage(signedMessage + accountDigiCodeHash);
}

export default AuthenticationHash;