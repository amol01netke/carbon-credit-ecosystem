import Web3 from "web3";

const getWeb3=async()=>{
    if(window.ethereum){
        const web3=new Web3(window.ethereum);

        try{
            await window.ethereum.request({method:'eth_requestAccounts'});
            return web3;
        }catch(error){
            return 'User denied account access!';
        }
    }else{
        return 'Please install MetaMask!';
    }
}

export default getWeb3;