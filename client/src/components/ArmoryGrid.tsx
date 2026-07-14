import React from 'react';
import { Shield } from 'lucide-react';

export const ArmoryGrid: React.FC = () => {
  return (
    <div className="glass-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={24} color="#0ea5e9"/> Armory & NFT Collection
        </h2>
        <div className="filters">
          <button className="filter-btn active">All</button>
          <button className="filter-btn">Weapons</button>
          <button className="filter-btn">Operators</button>
        </div>
      </div>
      
      <div className="armory-grid">
        <div className="armory-card rarity-legendary">
          <div className="card-image-wrapper">
            <img src="/assault_rifle.png" alt="Axion-7 Plasma Rifle" className="card-image" />
          </div>
          <div className="card-content">
            <h3>Axion-7 Plasma Rifle</h3>
            <p className="rarity">Legendary</p>
            <div className="stats-hover">
              <p>Damage: 95</p>
              <p>Fire Rate: 850 RPM</p>
            </div>
          </div>
        </div>

        <div className="armory-card rarity-epic">
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
        </div>
        
        {/* Placeholder for more items */}
        <div className="armory-card rarity-common locked">
          <div className="card-image-wrapper placeholder">
            <span>Locked</span>
          </div>
          <div className="card-content">
            <h3>Mystery Supply Drop</h3>
            <p className="rarity">Purchase on Soroban</p>
          </div>
        </div>
      </div>
    </div>
  );
};
