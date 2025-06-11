document.addEventListener('DOMContentLoaded', () => {
  let currentWeekStart = getStartOfWeek(new Date());
  
  updateWeekDisplay();
  loadDataForWeek(currentWeekStart);
  
  document.getElementById('prevWeek').addEventListener('click', () => {
    currentWeekStart = new Date(currentWeekStart);
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    updateWeekDisplay();
    loadDataForWeek(currentWeekStart);
  });
  
  document.getElementById('nextWeek').addEventListener('click', () => {
    currentWeekStart = new Date(currentWeekStart);
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    updateWeekDisplay();
    loadDataForWeek(currentWeekStart);
  });
});

function updateWeekDisplay() {
  const weekEnd = new Date(currentWeekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  
  document.getElementById('weekRange').textContent = 
    `Week of ${formatDate(currentWeekStart)} to ${formatDate(weekEnd)}`;
}

function loadDataForWeek(weekStart) {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  
  chrome.storage.local.get(['timeData'], (result) => {
    const timeData = result.timeData || {};
    const weekData = {};
    const weekDates = [];
    
    // Initialize week data structure
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      weekDates.push(dateStr);
      
      if (timeData[dateStr]) {
        weekData[dateStr] = timeData[dateStr];
      } else {
        weekData[dateStr] = {};
      }
    }
    
    // Process data for charts and table
    const dailyData = processDailyData(weekData, weekDates);
    const categoryData = processCategoryData(weekData);
    const topSites = processTopSites(weekData);
    
    renderDailyChart(dailyData, weekDates);
    renderCategoryChart(categoryData);
    renderSitesTable(topSites);
  });
}

// Helper functions for data processing and rendering would go here
// ...