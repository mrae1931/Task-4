document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  
  document.getElementById('addWebsite').addEventListener('click', addWebsiteRow);
  document.getElementById('saveSettings').addEventListener('click', saveSettings);
});

function loadSettings() {
  chrome.storage.sync.get(['websiteClassification'], (result) => {
    const classifications = result.websiteClassification || {};
    
    // Add rows for existing classifications
    for (const [website, classification] of Object.entries(classifications)) {
      addWebsiteRow(website, classification);
    }
    
    // Add one empty row by default
    if (Object.keys(classifications).length === 0) {
      addWebsiteRow();
    }
  });
}

function addWebsiteRow(website = '', classification = 'neutral') {
  const container = document.getElementById('classificationsContainer');
  const row = document.createElement('div');
  row.className = 'website-row';
  
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'website-input';
  input.placeholder = 'example.com';
  input.value = website;
  
  const select = document.createElement('select');
  select.className = 'classification-select';
  
  const options = [
    { value: 'productive', text: 'Productive' },
    { value: 'neutral', text: 'Neutral' },
    { value: 'unproductive', text: 'Unproductive' }
  ];
  
  options.forEach(opt => {
    const option = document.createElement('option');
    option.value = opt.value;
    option.textContent = opt.text;
    if (opt.value === classification) {
      option.selected = true;
    }
    select.appendChild(option);
  });
  
  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Remove';
  removeBtn.addEventListener('click', () => {
    container.removeChild(row);
  });
  
  row.appendChild(input);
  row.appendChild(select);
  row.appendChild(removeBtn);
  container.appendChild(row);
}

function saveSettings() {
  const rows = document.querySelectorAll('.website-row');
  const classifications = {};
  
  rows.forEach(row => {
    const input = row.querySelector('.website-input');
    const select = row.querySelector('.classification-select');
    
    if (input.value.trim()) {
      classifications[input.value.trim()] = select.value;
    }
  });
  
  chrome.storage.sync.set({ websiteClassification: classifications }, () => {
    alert('Settings saved successfully!');
  });
}