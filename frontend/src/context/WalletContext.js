import { createContext, useContext, useState } from "react";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const [generatorAddress, setGeneratorAddress] = useState("");
   
    return (
        <WalletContext.Provider value={{ generatorAddress, setGeneratorAddress }}>
            {children}
        </WalletContext.Provider>
    );
};


export const useWallet = () => useContext(WalletContext);