import { createContext, useContext, useState } from "react";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const [userWalletAddress, setUserWalletAddress] = useState("");
   
    return (
        <WalletContext.Provider value={{ userWalletAddress, setUserWalletAddress }}>
            {children}
        </WalletContext.Provider>
    );
};


export const useWallet = () => useContext(WalletContext);