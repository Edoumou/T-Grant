const SignData = async (digicode, accountAddress, web3) => {
    let signedData;

    await web3.eth.personal.sign(
        digicode,
        accountAddress,
        (err, signature) => {
            if (err) {
                signedData = err;
            } else {
                signedData = web3.eth.accounts.hashMessage(signature);
            }
        }
    ); 

    return signedData;
}

export default SignData;