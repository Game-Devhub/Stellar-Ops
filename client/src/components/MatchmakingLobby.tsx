import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crosshair, Users, Activity } from 'lucide-react';
interface MatchmakingLobbyProps {
  onMatchFound: () => void;
}

export const MatchmakingLobby: React.FC<MatchmakingLobbyProps> = ({ onMatchFound }) => {
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isSearching) {
      // Simulate matchmaking delay
      timer = setTimeout(() => {
        setIsSearching(false);
        onMatchFound();
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [isSearching, onMatchFound]);

  return (
    <motion.div 
      className="glass-panel matchmaking-lobby"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5, type: 'spring' }}
    >
      <div className="lobby-header">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Crosshair size={28} color="#0ea5e9" /> Tactical Deployment
        </h2>
        <div className="squad-info">
          <Users size={18} /> Squad: 1/5
        </div>
      </div>

      <div className="lobby-content">
        <div className="loadout-preview">
          <h3>Active Loadout</h3>
          <div className="loadout-slots">
            <motion.div whileHover={{ scale: 1.05 }} className="loadout-slot">
              <img src="/character.png" alt="Operator" className="slot-img" />
              <span>Operator</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="loadout-slot">
              <img src="/assault_rifle.png" alt="Primary" className="slot-img" />
              <span>Primary</span>
            </motion.div>
          </div>
        </div>

        <div className="matchmaking-controls">
          <AnimatePresence mode="wait">
            {!isSearching ? (
              <motion.button 
                key="find-match"
                className="primary-action-btn pulse-btn"
                onClick={() => setIsSearching(true)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Find Match (Sector Alpha)
              </motion.button>
            ) : (
              <motion.div 
                key="searching"
                className="searching-indicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Activity className="spin-icon" size={24} color="#0ea5e9" />
                <span>Locating suitable targets...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
