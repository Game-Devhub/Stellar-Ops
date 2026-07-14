import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { requestAccess, isConnected, getPublicKey } from '@stellar/freighter-api';

interface WalletState {
  address: string | null;
  balance: number;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletState | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);

  const connect = async () => {
    try {
      const connected = await isConnected();
      if (connected) {
        // Real Freighter connection
        const access = await requestAccess();
        if (access) {
          const pk = await getPublicKey();
          setAddress(pk);
          setBalance(1500); // We'd fetch real balance from Horizon API here
          return;
        }
      }
    } catch (e) {
      console.warn("Freighter connection failed, falling back to simulation.", e);
    }
    
    // Fallback: Simulate Freighter wallet connection if extension not found
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
