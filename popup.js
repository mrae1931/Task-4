document.addEventListener('DOMContentLoaded', () => {
  updateSummary();
  
  document.getElementById('viewDashboard').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
  });
  
  document.getElementById('settings').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
});

function updateSummary() {
  const today = new Date().toISOString().split('T')[0];
  
  chrome.storage.local.get(['timeData'], (result) => {
    const timeData = result.timeData || {};
    const todayData = timeData[today] || {};
    
    let totalSeconds = 0;
    let productiveSeconds = 0;
    let unproductiveSeconds = 0;
    
    Object.values(todayData).forEach(site => {
      totalSeconds += site.totalTime;
      productiveSeconds += site.productiveTime;
      unproductiveSeconds += site.unproductiveTime;
    });
    
    const productiveRatio = totalSeconds > 0 ? 
      Math.round((productiveSeconds / totalSeconds) * 100) : 0;
    
    document.getElementById('totalTime').textContent = formatTime(totalSeconds);
    document.getElementById('productiveTime').textContent = formatTime(productiveSeconds);
    document.getElementById('unproductiveTime').textContent = formatTime(unproductiveSeconds);
    document.getElementById('productivityRatio').textContent = `${productiveRatio}%`;
  });
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}