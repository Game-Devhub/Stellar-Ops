import React, { useState } from 'react';
import { Shield, Loader2 } from 'lucide-react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { useWallet } from '../context/WalletContext';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

export const ArmoryGrid: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'weapons' | 'operators'>('all');
  const [isMinting, setIsMinting] = useState(false);
  const [hasMinted, setHasMinted] = useState(false);
  const { address, connect } = useWallet();

  const handlePurchase = async () => {
    if (!address) {
      await connect();
    }
    
    setIsMinting(true);
    // Simulate smart contract interaction (signing and network consensus)
    setTimeout(() => {
      setIsMinting(false);
      setHasMinted(true);
    }, 3000);
  };

  return (
    <motion.div 
      className="glass-panel"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.4 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={24} color="#0ea5e9"/> Armory & NFT Collection
        </h2>
        <div className="filters">
          <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`filter-btn ${filter === 'weapons' ? 'active' : ''}`} onClick={() => setFilter('weapons')}>Weapons</button>
          <button className={`filter-btn ${filter === 'operators' ? 'active' : ''}`} onClick={() => setFilter('operators')}>Operators</button>
        </div>
      </div>
      
      <motion.div 
        className="armory-grid"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <AnimatePresence mode="popLayout">
          {(filter === 'all' || filter === 'weapons') && (
            <motion.div key="weapon-1" variants={itemVariants} layout initial="hidden" animate="show" exit="exit" className="armory-card rarity-legendary" whileHover={{ y: -10, scale: 1.02 }}>
              <div className="card-image-wrapper">
                <img src="/assault_rifle.png" alt="Axion-7 Plasma Rifle" className="card-image" />
              </div>
              <div className="card-content">
                <h3>Axion-7 Plasma Rifle</h3>
                <p className="rarity">Legendary Weapon</p>
                <div className="stats-hover">
                  <p>Damage: 95</p>
                  <p>Fire Rate: 850 RPM</p>
                </div>
              </div>
            </motion.div>
          )}

          {(filter === 'all' || filter === 'operators') && (
            <motion.div key="operator-1" variants={itemVariants} layout initial="hidden" animate="show" exit="exit" className="armory-card rarity-epic" whileHover={{ y: -10, scale: 1.02 }}>
              <div className="card-image-wrapper">
                <img src="/character.png" alt="Apex-07 Cyber Soldier" className="card-image" />
              </div>
              <div className="card-content">
                <h3>Apex-07 Soldier</h3>
                <p className="rarity">Epic Operator</p>
                <div className="stats-hover">
                  <p>Mobility: 88</p>
                  <p>Armor: 75</p>
                </div>
              </div>
            </motion.div>
          )}
          
          {(filter === 'all' || filter === 'weapons') && hasMinted && (
            <motion.div key="new-mint" variants={itemVariants} layout initial="hidden" animate="show" exit="exit" className="armory-card rarity-legendary" whileHover={{ y: -10, scale: 1.02 }}>
              <div className="card-image-wrapper">
                <img src="/assets/plasma_cannon.png" alt="Voidreaver Cannon" className="card-image" />
              </div>
              <div className="card-content">
                <h3>Voidreaver Cannon</h3>
                <p className="rarity" style={{ color: '#d946ef' }}>Mythic NFT</p>
                <div className="stats-hover">
                  <p>Damage: 250</p>
                  <p>Charge Time: 1.2s</p>
                </div>
              </div>
            </motion.div>
          )}

          {(filter === 'all') && !hasMinted && (
            <motion.div 
              key="supply-drop" 
              variants={itemVariants} 
              layout 
              initial="hidden" 
              animate="show" 
              exit="exit" 
              className={`armory-card rarity-common ${isMinting ? 'minting' : 'locked'}`} 
              whileHover={isMinting ? {} : { y: -5 }} 
              onClick={isMinting ? undefined : handlePurchase}
              style={{ cursor: isMinting ? 'wait' : 'pointer' }}
            >
              <div className="card-image-wrapper placeholder">
                {isMinting ? (
                  <Loader2 className="spinner" size={48} color="#0ea5e9" />
                ) : (
                  <span>{address ? 'Purchase (50 XLM)' : 'Connect Wallet to Buy'}</span>
                )}
              </div>
              <div className="card-content">
                <h3>Mystery Supply Drop</h3>
                <p className="rarity">{isMinting ? 'Awaiting Signature...' : 'Soroban Smart Contract'}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
