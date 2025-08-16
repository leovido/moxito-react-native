#!/usr/bin/env node

const { execSync } = require('node:child_process');
const path = require('node:path');

console.log('🧹 Clearing Metro bundler cache...');

try {
  // Clear metro cache
  execSync('npx expo start --clear', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
  });
} catch (error) {
  console.error('❌ Error clearing cache:', error.message);
  console.log('\n💡 Try running these commands manually:');
  console.log('1. npx expo start --clear');
  console.log('2. Or: npx expo start --reset-cache');
}
