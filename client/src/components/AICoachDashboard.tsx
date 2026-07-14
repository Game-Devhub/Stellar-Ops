import React from 'react';
import { Brain } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { match: 'Match 1', accuracy: 35, positioning: 60 },
  { match: 'Match 2', accuracy: 40, positioning: 65 },
  { match: 'Match 3', accuracy: 38, positioning: 70 },
  { match: 'Match 4', accuracy: 45, positioning: 72 },
  { match: 'Match 5', accuracy: 50, positioning: 78 },
  { match: 'Match 6', accuracy: 48, positioning: 82 },
];

export const AICoachDashboard: React.FC = () => {
  return (
    <div className="glass-panel">
      <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Brain size={24} color="#8b5cf6"/> Post-Action Intelligence
      </h2>
      
      <div className="ai-coach-grid">
        <div className="chart-container stat-card" style={{ height: '350px', padding: '1rem' }}>
          <h3 style={{ marginBottom: '1rem', paddingLeft: '1rem' }}>Performance Metrics (Last 6 Matches)</h3>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="match" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="accuracy" name="Accuracy %" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="positioning" name="Positioning" stroke="#4ade80" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="ai-recommendations-wrapper">
          <div className="stat-card" style={{ background: 'rgba(139, 92, 246, 0.1)', borderColor: 'rgba(139, 92, 246, 0.3)', height: '100%' }}>
            <h3 style={{ color: '#c4b5fd' }}>AI Improvement Regimen</h3>
            <p style={{ marginTop: '1rem', lineHeight: '1.6' }}>
              Your accuracy with assault rifles is steadily improving, but dropped slightly in Match 6. Focus on burst firing at medium range.
            </p>
            <div className="metric-highlight">
              <span className="label">Current Accuracy Trend:</span>
              <span className="value up">↗ +13%</span>
            </div>
            <p style={{ marginTop: '1.5rem', lineHeight: '1.6' }}>
              <strong>Next Step:</strong> Spend 10 minutes in the firing range aiming at strafing targets before your next Ranked Arena match.
            </p>
            <button className="primary-action-btn">
              Start Training Routine
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
