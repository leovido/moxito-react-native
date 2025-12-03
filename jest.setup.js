// Mock @react-native/js-polyfills before any imports
jest.mock('@react-native/js-polyfills/error-guard', () => ({
  ErrorUtils: {
    setGlobalHandler: jest.fn(),
    getGlobalHandler: jest.fn(),
    reportFatalError: jest.fn(),
  },
}));

// Mock global functions
global.clearInterval = jest.fn();
global.setInterval = jest.fn();

// Suppress console warnings for cleaner test output
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('ProgressBarAndroid') ||
      args[0].includes('Clipboard') ||
      args[0].includes('PushNotificationIOS') ||
      args[0].includes('NativeEventEmitter'))
  ) {
    return;
  }
  originalWarn(...args);
};
