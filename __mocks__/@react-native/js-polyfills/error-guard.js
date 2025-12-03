// Mock for @react-native/js-polyfills/error-guard
export const ErrorUtils = {
  setGlobalHandler: jest.fn(),
  getGlobalHandler: jest.fn(),
  reportFatalError: jest.fn(),
};
