import React from 'react';

function App() {
  return (
    <div className="App" style={{ fontFamily: 'Arial', maxWidth: 700, margin: '0 auto', padding: 32 }}>
      <h1>AI Debate Lab</h1>
      <input type="text" placeholder="Enter research topic..." style={{ width: '100%', padding: 8, fontSize: 16 }} />
      <button style={{ marginTop: 16, padding: '8px 24px', fontSize: 16 }}>Start Research</button>
      <div style={{ marginTop: 32, minHeight: 200, background: '#f9f9f9', borderRadius: 8, padding: 16 }}>
        {/* Live chat-style agent discussion will appear here */}
      </div>
      <button style={{ marginTop: 24, padding: '8px 24px', fontSize: 16 }}>Download Report</button>
    </div>
  );
}

export default App;
