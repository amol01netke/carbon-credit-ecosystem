import Web3 from "web3";

const getWeb3=async()=>{
    if(window.ethereum){
        const web3=new Web3(window.ethereum);

        try{
            await window.ethereum.request({method:'eth_requestAccounts'});
            return web3;
        }catch(error){
            console.error('User denied account access!');
            throw new Error('User denied account access!');
        }
    }else{
        alert('MetMask is not installed! Please install MetaMask!');
        throw new Error('MetMask is not installed! Please install MetaMask!')
    }
}

export default getWeb3;