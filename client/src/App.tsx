import React from 'react';

function App() {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', padding: '2rem' }}>
      <header>
        <h1 style={{ color: '#38bdf8' }}>Stellar Ops Dashboard</h1>
        <p>Welcome to the decentralised tactical shooter.</p>
      </header>
      <main>
        <div style={{ border: '1px solid #334155', padding: '1rem', borderRadius: '8px', marginTop: '2rem', backgroundColor: '#1e293b' }}>
          <h2>AI Tactical Coach Status: <span style={{ color: '#4ade80' }}>Online</span></h2>
          <p>Awaiting match data...</p>
        </div>
      </main>
    </div>
  );
}

export default App;
