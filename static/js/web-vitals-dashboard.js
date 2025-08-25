// Web Vitals Dashboard - Simple viewer for Core Web Vitals data
// Usage: Add ?debug=vitals to any page URL to view the dashboard

(function() {
  'use strict';
  
  // Check if debug mode is enabled
  const urlParams = new URLSearchParams(window.location.search);
  if (!urlParams.get('debug') === 'vitals') return;
  
  // Create dashboard styles
  const styles = `
    #vitals-dashboard {
      position: fixed;
      top: 10px;
      right: 10px;
      width: 400px;
      max-height: 80vh;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 15px;
      border-radius: 8px;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 12px;
      z-index: 10000;
      overflow-y: auto;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }
    
    #vitals-dashboard h3 {
      margin: 0 0 15px 0;
      color: #4CAF50;
      font-size: 14px;
      border-bottom: 1px solid #333;
      padding-bottom: 5px;
    }
    
    .vital-item {
      margin: 10px 0;
      padding: 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      border-left: 4px solid;
    }
    
    .vital-item.good { border-left-color: #4CAF50; }
    .vital-item.needs-improvement { border-left-color: #FF9800; }
    .vital-item.poor { border-left-color: #F44336; }
    
    .vital-name { font-weight: bold; color: #2196F3; }
    .vital-value { color: #FFC107; }
    .vital-rating { text-transform: uppercase; font-size: 10px; }
    .vital-time { color: #9E9E9E; font-size: 10px; }
    
    #vitals-close {
      position: absolute;
      top: 5px;
      right: 10px;
      background: none;
      border: none;
      color: white;
      font-size: 16px;
      cursor: pointer;
      padding: 5px;
    }
    
    #vitals-clear {
      background: #F44336;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 3px;
      cursor: pointer;
      font-size: 11px;
      margin-top: 10px;
    }
  `;
  
  // Add styles to page
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
  
  // Create dashboard HTML
  function createDashboard() {
    const dashboard = document.createElement('div');
    dashboard.id = 'vitals-dashboard';
    dashboard.innerHTML = `
      <button id="vitals-close">&times;</button>
      <h3>🚀 Core Web Vitals Monitor</h3>
      <div id="vitals-content">Loading...</div>
      <button id="vitals-clear">Clear Data</button>
    `;
    
    document.body.appendChild(dashboard);
    
    // Add event listeners
    document.getElementById('vitals-close').onclick = () => dashboard.remove();
    document.getElementById('vitals-clear').onclick = clearVitalsData;
    
    return dashboard;
  }
  
  // Format vital value based on metric type
  function formatValue(name, value) {
    switch (name.toUpperCase()) {
      case 'CLS':
        return (value / 1000).toFixed(3);
      case 'FCP':
      case 'LCP':
      case 'TTFB':
        return Math.round(value) + 'ms';
      case 'FID':
      case 'INP':
        return Math.round(value) + 'ms';
      default:
        return Math.round(value);
    }
  }
  
  // Get rating class for styling
  function getRatingClass(rating) {
    switch (rating.toLowerCase()) {
      case 'good': return 'good';
      case 'needs-improvement': return 'needs-improvement';
      case 'poor': return 'poor';
      default: return '';
    }
  }
  
  // Render vitals data
  function renderVitals() {
    const vitalsData = JSON.parse(localStorage.getItem('webVitals') || '[]');
    const content = document.getElementById('vitals-content');
    
    if (vitalsData.length === 0) {
      content.innerHTML = '<div style="color: #9E9E9E;">No vitals data collected yet.<br>Navigate around the site to collect data.</div>';
      return;
    }
    
    // Group by metric type and show latest value
    const latestVitals = {};
    vitalsData.forEach(vital => {
      if (!latestVitals[vital.name] || vital.timestamp > latestVitals[vital.name].timestamp) {
        latestVitals[vital.name] = vital;
      }
    });
    
    let html = '';
    
    // Core Web Vitals order
    const coreOrder = ['LCP', 'FID', 'CLS', 'INP'];
    const otherOrder = ['FCP', 'TTFB'];
    
    // Render Core Web Vitals first
    html += '<div style="margin-bottom: 15px; color: #4CAF50; font-weight: bold;">Core Web Vitals:</div>';
    coreOrder.forEach(metric => {
      if (latestVitals[metric]) {
        const vital = latestVitals[metric];
        html += `
          <div class="vital-item ${getRatingClass(vital.rating)}">
            <div class="vital-name">${vital.name}</div>
            <div class="vital-value">${formatValue(vital.name, vital.value)}</div>
            <div class="vital-rating">${vital.rating}</div>
            <div class="vital-time">${new Date(vital.timestamp).toLocaleTimeString()}</div>
          </div>
        `;
      }
    });
    
    // Render other metrics
    const hasOtherMetrics = otherOrder.some(metric => latestVitals[metric]);
    if (hasOtherMetrics) {
      html += '<div style="margin: 15px 0 10px; color: #2196F3; font-weight: bold;">Other Metrics:</div>';
      otherOrder.forEach(metric => {
        if (latestVitals[metric]) {
          const vital = latestVitals[metric];
          html += `
            <div class="vital-item ${getRatingClass(vital.rating)}">
              <div class="vital-name">${vital.name}</div>
              <div class="vital-value">${formatValue(vital.name, vital.value)}</div>
              <div class="vital-rating">${vital.rating}</div>
              <div class="vital-time">${new Date(vital.timestamp).toLocaleTimeString()}</div>
            </div>
          `;
        }
      });
    }
    
    html += `<div style="margin-top: 15px; color: #9E9E9E; font-size: 10px;">
      Total measurements: ${vitalsData.length}<br>
      Page: ${window.location.pathname}
    </div>`;
    
    content.innerHTML = html;
  }
  
  // Clear vitals data
  function clearVitalsData() {
    localStorage.removeItem('webVitals');
    renderVitals();
  }
  
  // Initialize dashboard when page loads
  function init() {
    // Wait for page to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }
    
    const dashboard = createDashboard();
    renderVitals();
    
    // Update dashboard every 5 seconds
    setInterval(renderVitals, 5000);
    
    console.log('Web Vitals Dashboard loaded. Data is stored in localStorage under "webVitals" key.');
  }
  
  init();
})();