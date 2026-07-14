import React from 'react';
import { Shield, Brain, Swords } from 'lucide-react';

interface NavigationProps {
  activeTab: 'play' | 'coach' | 'armory';
  setActiveTab: (tab: 'play' | 'coach' | 'armory') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="nav-tabs">
      <button 
        className={`tab ${activeTab === 'play' ? 'active' : ''}`}
        onClick={() => setActiveTab('play')}
      >
        <Shield size={18} />
        Deployment
      </button>
      <button 
        className={`tab ${activeTab === 'coach' ? 'active' : ''}`}
        onClick={() => setActiveTab('coach')}
      >
        <Brain size={18} />
        AI Coach
      </button>
      <button 
        className={`tab ${activeTab === 'armory' ? 'active' : ''}`}
        onClick={() => setActiveTab('armory')}
      >
        <Swords size={18} />
        Armory
      </button>
    </nav>
  );
};
