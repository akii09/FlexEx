#!/usr/bin/env node

import { createProject } from '../index.js';

try {
  createProject();
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}