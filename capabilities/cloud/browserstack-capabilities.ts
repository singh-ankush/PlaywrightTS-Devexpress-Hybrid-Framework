// Import Playwright dependencies

import { chromium } from "playwright";

export const caps = {
    'browser': 'chrome',
    'os': 'osx',
    'os_version': 'catalina',
    'name': 'Blazor Hybrid Framework Sample Test',
    'build': 'playwright-build-1',
    'browserstack.username': process.env.BROWSERSTACK_USERNAME || 'YOUR_USERNAME',
    'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY || 'YOUR_ACCESS_KEY',
    'args': ['--incognito']  // You can specify an array of strings here. Valid only if the browser is chromium based
  };
// Add CDP endpoint here to connect to BrowserStack  
  const browser = chromium.connect({
    wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(caps))}`,
});
