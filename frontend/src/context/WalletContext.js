import { createContext, useContext, useState } from "react";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const [userWalletAddress, setUserWalletAddress] = useState("");
    const [sequestrationType, setSequestrationType] = useState("");

    return (
        <WalletContext.Provider value={{ userWalletAddress, setUserWalletAddress, sequestrationType, setSequestrationType }}>
            {children}
        </WalletContext.Provider>
    );
};


export const useWallet = () => useContext(WalletContext);