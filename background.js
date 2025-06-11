let currentTab = null;
let startTime = null;
let idleStartTime = null;
let isIdle = false;

// Track tab changes
chrome.tabs.onActivated.addListener((activeInfo) => {
  trackTabChange(activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    trackTabChange(tabId);
  }
});

// Track idle state
chrome.idle.onStateChanged.addListener((newState) => {
  if (newState === 'idle') {
    isIdle = true;
    idleStartTime = Date.now();
    if (currentTab) {
      saveTime(currentTab, startTime, idleStartTime);
    }
  } else {
    isIdle = false;
    if (currentTab) {
      startTime = Date.now();
    }
  }
});

function trackTabChange(tabId) {
  chrome.tabs.get(tabId, (tab) => {
    if (!tab.url) return;
    
    const url = new URL(tab.url);
    const domain = url.hostname;
    
    // Save previous tab's time
    if (currentTab) {
      saveTime(currentTab, startTime, Date.now());
    }
    
    // Start tracking new tab
    currentTab = {
      url: tab.url,
      domain: domain,
      title: tab.title
    };
    startTime = Date.now();
  });
}

function saveTime(tab, start, end) {
  const duration = (end - start) / 1000; // in seconds
  if (duration < 2) return; // ignore very short durations
  
  chrome.storage.local.get(['timeData'], (result) => {
    const timeData = result.timeData || {};
    const date = new Date().toISOString().split('T')[0];
    
    if (!timeData[date]) {
      timeData[date] = {};
    }
    
    if (!timeData[date][tab.domain]) {
      timeData[date][tab.domain] = {
        totalTime: 0,
        productiveTime: 0,
        unproductiveTime: 0,
        title: tab.title,
        url: tab.url
      };
    }
    
    // Classify the website
    chrome.storage.sync.get(['websiteClassification'], (settings) => {
      const classification = settings.websiteClassification || {};
      const isProductive = classification[tab.domain] === 'productive' || 
                          (classification[tab.domain] === undefined && 
                           isDefaultProductive(tab.domain));
      
      timeData[date][tab.domain].totalTime += duration;
      if (isProductive) {
        timeData[date][tab.domain].productiveTime += duration;
      } else {
        timeData[date][tab.domain].unproductiveTime += duration;
      }
      
      chrome.storage.local.set({ timeData: timeData });
    });
  });
}

function isDefaultProductive(domain) {
  // Default productive sites (can be expanded)
  const productiveDomains = [
    'github.com',
    'stackoverflow.com',
    'docs.google.com',
    'trello.com',
    'notion.so',
    'code.visualstudio.com'
  ];
  
  return productiveDomains.some(d => domain.includes(d));
}
