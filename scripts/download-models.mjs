#!/usr/bin/env node

import { existsSync, mkdirSync } from 'fs'
import { execSync } from 'child_process'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const publicDir = join(__dirname, '..', 'public')
const modelsDir = join(publicDir, 'models')

if (!existsSync(publicDir)) {
	mkdirSync(publicDir, { recursive: true })
}

if (existsSync(modelsDir)) {
	process.exit(0)
}

try {
	execSync('npx degit vladmandic/face-api/model public/models', {
		stdio: 'inherit',
		cwd: join(__dirname, '..'),
	})
} catch (error) {
	console.error('❌ Failed to download models:', error.message)
	process.exit(1)
}
