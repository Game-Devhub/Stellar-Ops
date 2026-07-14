import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WalletState {
  address: string | null;
  balance: number;
  connect: () => void;
  disconnect: () => void;
}

const WalletContext = createContext<WalletState | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);

  const connect = () => {
    // Simulate Freighter wallet connection
    setTimeout(() => {
      setAddress('G' + Array.from({length: 55}, () => Math.floor(Math.random() * 36).toString(36).toUpperCase()).join(''));
      setBalance(Math.floor(Math.random() * 1000) + 100); // Random XLM balance
    }, 500);
  };

  const disconnect = () => {
    setAddress(null);
    setBalance(0);
  };

  return (
    <WalletContext.Provider value={{ address, balance, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
