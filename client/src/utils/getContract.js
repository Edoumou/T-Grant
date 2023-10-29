export const getContract = async (web3, contractInterface, contractAddress) => {
    return new web3.eth.Contract(
        contractInterface.abi,
        contractAddress
    );
}