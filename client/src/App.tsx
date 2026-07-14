import { useState } from 'react';
import './index.css';
import { PhaserGame } from './game/PhaserGame';
import { WalletProvider } from './context/WalletContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { ArmoryGrid } from './components/ArmoryGrid';
import { AICoachDashboard } from './components/AICoachDashboard';
import { Shield } from 'lucide-react';

function Dashboard() {
  const [activeTab, setActiveTab] = useState<'play' | 'coach' | 'armory'>('play');

  return (
    <div className="dashboard-container">
      <Header />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="main-content">
        {activeTab === 'play' && (
          <div className="glass-panel slide-in">
            <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={24} color="#0ea5e9"/> Sector Alpha - Live Combat
            </h2>
            <div className="game-container-wrapper">
              <PhaserGame />
            </div>
          </div>
        )}

        {activeTab === 'coach' && (
          <div className="slide-in">
            <AICoachDashboard />
          </div>
        )}

        {activeTab === 'armory' && (
          <div className="slide-in">
            <ArmoryGrid />
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <WalletProvider>
      <div className="app-wrapper">
        {/* Background ambient light effects */}
        <div className="ambient-light light-1"></div>
        <div className="ambient-light light-2"></div>
        <Dashboard />
      </div>
    </WalletProvider>
  );
}

export default App;
