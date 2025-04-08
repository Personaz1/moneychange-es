/**
 * Test script for MoneyChange app
 * This file runs basic tests for the API and App modules
 */

// Import necessary modules
try {
  // Browser mode
  var api = window.api;
  var app = window.app;
} catch (e) {
  // Node.js mode (for running tests with npm test)
  var api = require('./api.js');
  var app = require('./app.js');
}

/**
 * Test the API module
 */
async function testAPI() {
  console.log('✅ Starting API tests...');
  
  // Test getting exchange rates
  const rates = await api.getExchangeRates('EUR', ['USD', 'GBP']);
  console.log('Exchange rates:', rates);
  
  // Test currency conversion
  const converted = await api.convertCurrency(100, 'EUR', 'USD');
  console.log('Converted 100 EUR to USD:', converted);
  
  // Test demo rates update
  api.updateDemoRates();
  console.log('Demo rates updated');
  
  console.log('✅ API tests completed successfully');
}

/**
 * Test the App module
 */
function testApp() {
  console.log('✅ Starting App tests...');
  
  // Mock DOM elements for testing
  document.body.innerHTML = `
    <div id="rates-table-body"></div>
    <div id="last-update-time"></div>
    <input id="exchange-amount" value="100" />
    <select id="exchange-from"></select>
    <select id="exchange-to"></select>
    <div id="exchange-result"></div>
    <button id="theme-toggle"></button>
  `;
  
  // Test app initialization
  app.init();
  console.log('App initialized');
  
  // Test exchange calculator update
  app.updateExchangeCalculator();
  console.log('Exchange calculator updated');
  
  // Test dark mode toggle
  app.toggleDarkMode();
  console.log('Dark mode toggled');
  
  console.log('✅ App tests completed successfully');
}

/**
 * Run all tests
 */
function runTests() {
  console.log('🚀 Starting tests for MoneyChange app...');
  
  // Run API tests
  testAPI()
    .then(() => {
      // Run App tests
      testApp();
      console.log('🎉 All tests completed successfully');
    })
    .catch(error => {
      console.error('❌ Test failed:', error);
    });
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testAPI,
    testApp,
    runTests
  };
} else {
  // Run tests if executed directly
  runTests();
} 