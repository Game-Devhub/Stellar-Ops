import React from 'react';
import { Crosshair, Wallet, LogOut } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

export const Header: React.FC = () => {
  const { address, balance, connect, disconnect } = useWallet();

  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 5)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <header className="header">
      <div className="brand">
        <Crosshair size={32} color="#0ea5e9" className="brand-icon" />
        <h1>Stellar Ops</h1>
      </div>
      
      <div className="wallet-section">
        {address ? (
          <div className="wallet-info">
            <span className="balance">{balance} XLM</span>
            <div className="address-pill">
              {formatAddress(address)}
            </div>
            <button className="disconnect-btn" onClick={disconnect} title="Disconnect Wallet">
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <button className="wallet-btn" onClick={connect}>
            <Wallet size={18} />
            Connect Freighter
          </button>
        )}
      </div>
    </header>
  );
};
