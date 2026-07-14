import { useState } from 'react';
import './index.css';
import { PhaserGame } from './game/PhaserGame';
import { WalletProvider } from './context/WalletContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { ArmoryGrid } from './components/ArmoryGrid';
import { AICoachDashboard } from './components/AICoachDashboard';
import { MatchmakingLobby } from './components/MatchmakingLobby';
import { GlobalChat } from './components/GlobalChat';
import { Shield, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence, Transition } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: 20 }
};

const pageTransition: Transition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.3
};

function Dashboard() {
  const [activeTab, setActiveTab] = useState<'play' | 'coach' | 'armory'>('play');
  const [gameState, setGameState] = useState<'lobby' | 'game'>('lobby');

  return (
    <div className="dashboard-container">
      <Header />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="main-content">
        <AnimatePresence mode="wait">
          {activeTab === 'play' && gameState === 'lobby' && (
            <motion.div key="lobby" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
              <MatchmakingLobby onMatchFound={() => setGameState('game')} />
            </motion.div>
          )}

          {activeTab === 'play' && gameState === 'game' && (
            <motion.div key="game" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="glass-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Shield size={24} color="#0ea5e9"/> Sector Alpha - Live Combat
                </h2>
                <button className="filter-btn" onClick={() => setGameState('lobby')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ChevronLeft size={18} /> Evacuate (Leave Match)
                </button>
              </div>
              <div className="game-container-wrapper">
                <PhaserGame />
              </div>
            </motion.div>
          )}

          {activeTab === 'coach' && (
            <motion.div key="coach" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
              <AICoachDashboard />
            </motion.div>
          )}

          {activeTab === 'armory' && (
            <motion.div key="armory" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
              <ArmoryGrid />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <GlobalChat />
    </div>
  );
}

function App() {
  return (
    <WalletProvider>
      <div className="app-wrapper">
        <div className="ambient-light light-1"></div>
        <div className="ambient-light light-2"></div>
        <Dashboard />
      </div>
    </WalletProvider>
  );
}

export default App;
