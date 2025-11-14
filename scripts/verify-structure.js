#!/usr/bin/env node

/**
 * ✅ Проверка структуры проекта
 * Запуск: node scripts/verify-structure.js
 */

const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'index.html',
  'vite.config.js',
  'package.json',
  'src/main.js',
  'src/App.vue',
  'src/utils.js',
  'src/store/chatStore.js',
  'src/models/Message.js',
  'src/components/Chat.vue',
  'src/components/Message.vue',
  'src/components/YourNameComponent.vue',
  'src/components/ui/CustomInput.vue',
  'src/components/ui/CustomButton.vue',
  'src/assets/css/main.css',
];

const projectRoot = path.join(__dirname, '..');

console.log('\n🔍 Проверка структуры проекта...\n');

let allExists = true;

requiredFiles.forEach(file => {
  const filePath = path.join(projectRoot, file);
  const exists = fs.existsSync(filePath);
  const icon = exists ? '✅' : '❌';
  console.log(`${icon} ${file}`);
  if (!exists) allExists = false;
});

console.log('\n' + (allExists ? '✅ Все файлы на месте!' : '❌ Некоторые файлы отсутствуют!'));
console.log('\n📦 Следующий шаг: npm install && npm run dev\n');
