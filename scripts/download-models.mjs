#!/usr/bin/env node

import { existsSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');
const modelsDir = join(publicDir, 'models');

console.log('📦 Downloading face-api.js models...');

// Create public directory if it doesn't exist
if (!existsSync(publicDir)) {
  mkdirSync(publicDir, { recursive: true });
  console.log('✅ Created public directory');
}

// Check if models already exist
if (existsSync(modelsDir)) {
  console.log('ℹ️  Models directory already exists. Skipping download.');
  console.log('💡 To re-download, delete the public/models directory first.');
  process.exit(0);
}

try {
  // Download models using degit
  console.log('⬇️  Downloading models from vladmandic/face-api...');
  execSync('npx degit vladmandic/face-api/model public/models', { 
    stdio: 'inherit',
    cwd: join(__dirname, '..')
  });
  console.log('✅ Models downloaded successfully!');
  console.log('📁 Models are now available in public/models');
} catch (error) {
  console.error('❌ Failed to download models:', error.message);
  console.log('\n💡 Manual download instructions:');
  console.log('1. Visit: https://github.com/vladmandic/face-api/tree/master/model');
  console.log('2. Download the model folder');
  console.log('3. Place it in your public/models directory');
  process.exit(1);
}
