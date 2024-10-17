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

// //first hook to run
// useEffect(()=>{
//     const initializeWeb3=async()=>{
//         try{
//             const web3=await getWeb3();
//             console.log('Web 3 initialized!',web3);

//             const accounts = await web3.eth.getAccounts();

//             if (accounts.length > 0) {
//                 setUserWalletAddress(accounts[0]);
//                 console.log(`Connected Wallet Address: ${accounts[0]}`);
//             }
//         }catch(error){
//             console.error(`Falied to initialize Web 3!`,)
//         }
//     };

//     initializeWeb3();
// },[]);