const RegistrationHash = async (accountAddress, fullname, phone, email, web3) => {
    return await web3.eth.accounts.hashMessage(accountAddress + fullname + phone + email);
}

export default RegistrationHash;