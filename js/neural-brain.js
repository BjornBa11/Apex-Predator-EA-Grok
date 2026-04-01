// ================================================
// Apex Predator EA — Neural Core v1.0
// Modular Brain - Separate JS File
// ================================================

const LAYERS = [
  {id: "rsi",      name: "RSI Momentum + Div",      weight: 0.12},
  {id: "macd",     name: "MACD Structure",          weight: 0.11},
  {id: "ema",      name: "EMA Stack",               weight: 0.13},
  {id: "bbvp",     name: "BB + Volume Profile",     weight: 0.10},
  {id: "atr",      name: "ATR Regime Filter",       weight: 0.09},
  {id: "volume",   name: "Volume Delta Surge",      weight: 0.11},
  {id: "whale",    name: "Whale Conviction",        weight: 0.18},
  {id: "orderflow",name: "Order Flow Imbalance",    weight: 0.09},
  {id: "regime",   name: "Market Regime & Entropy", weight: 0.07}
];

let liveActive = true;

// Generate realistic layer scores with whale boost
function generateLayerScores() {
  const whaleBoost = document.getElementById('whaleBoost')?.checked ?? true;
  return LAYERS.map(layer => {
    let score = 48 + Math.random() * 52;
    if (layer.id === "whale" && whaleBoost) score = Math.min(99, score + 28);
    if (layer.id === "regime") score = 68 + Math.random() * 27;
    return { ...layer, score: Math.round(score) };
  });
}

// Calculate weighted confidence (0-100%)
function calculateConfidence(scores) {
  let total = 0, weightSum = 0;
  scores.forEach(l => {
    total += l.score * l.weight;
    weightSum += l.weight;
  });
  return Math.round(total / weightSum);
}

// Render the 9-layer checklist
function renderNeuralChecks(scores) {
  const container = document.getElementById('signalChecks');
  if (!container) return;
  
  let html = '';
  scores.forEach(l => {
    const color = l.score >= 75 ? 'var(--buy)' : l.score >= 55 ? 'var(--skip)' : 'var(--sell)';
    html += `<div class="check-item">
      <span>${l.name}</span>
      <span class="check-score" style="color:${color}">${l.score}</span>
    </div>`;
  });
  container.innerHTML = html;
}

// Main signal decision engine (the new brain)
function updateSignal() {
  const scores = generateLayerScores();
  const confidence = calculateConfidence(scores);
  const minConf = parseInt(document.getElementById('minConfRange')?.value) || 75;

  let direction = (confidence >= minConf) 
    ? (Math.random() > 0.46 ? 'BUY' : 'SELL') 
    : 'SKIP';

  const pair = ['XAU/USD', 'BTC/USDT', 'ETH/USDT'][Math.floor(Math.random() * 3)];

  // Update signal box
  const box = document.getElementById('signalBox');
  if (box) {
    box.className = `signal-box ${direction}`;
    
    document.getElementById('signalLabel').textContent = direction;
    document.getElementById('signalPair').textContent = `${pair} · 2s cycle`;
    
    const confEl = document.getElementById('confPct');
    if (confEl) {
      confEl.textContent = `${confidence}%`;
      confEl.style.color = direction === 'BUY' ? 'var(--buy)' : direction === 'SELL' ? 'var(--sell)' : 'var(--skip)';
    }
    
    const bar = document.getElementById('confBar');
    if (bar) {
      bar.style.width = `${confidence}%`;
      bar.style.background = direction === 'BUY' ? 'var(--buy)' : 'var(--sell)';
    }
  }

  renderNeuralChecks(scores);

  // Trigger trade if conditions met (calls original addTrade if it exists)
  if (direction !== 'SKIP' && liveActive && typeof addTrade === 'function') {
    addTrade(direction, pair, confidence);
  }
}

// Initialize the Neural Core
function initNeuralCore() {
  console.log('🚀 Apex Neural Core v1.0 - Activated');
  // Start the brain ticking
  setInterval(updateSignal, 1650);
}

// Make it available globally
window.initNeuralCore = initNeuralCore;
