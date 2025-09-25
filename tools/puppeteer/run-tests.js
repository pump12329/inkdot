#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

// 测试脚本列表
const tests = [
  {
    name: '调试浏览器',
    script: 'debug-browser.js',
    description: '捕获控制台日志和页面错误'
  },
  {
    name: '按钮功能测试',
    script: 'test-buttons.js',
    description: '测试按钮点击和交互功能'
  },
  {
    name: '中文支持测试',
    script: 'test-chinese.js',
    description: '验证中文字符显示和输入'
  },
  {
    name: '中文渲染测试',
    script: 'test-chinese-render.js',
    description: '测试中文字体渲染效果'
  }
];

// 运行单个测试
function runTest(scriptName) {
  const scriptPath = path.join(__dirname, scriptName);
  console.log(`\n🚀 运行测试: ${scriptName}`);
  console.log('='.repeat(50));

  try {
    execSync(`node ${scriptPath}`, {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..', '..')
    });
    console.log(`\n✅ ${scriptName} 测试完成`);
  } catch (error) {
    console.error(`\n❌ ${scriptName} 测试失败:`, error.message);
  }
}

// 运行所有测试
function runAllTests() {
  console.log('🧪 开始运行所有 Puppeteer 测试');
  console.log('='.repeat(50));

  tests.forEach(test => {
    console.log(`\n📋 ${test.name}: ${test.description}`);
    runTest(test.script);
  });

  console.log('\n🎉 所有测试完成');
}

// 显示帮助信息
function showHelp() {
  console.log('Puppeteer 测试工具');
  console.log('='.repeat(30));
  console.log('\n可用命令:');
  console.log('  node run-tests.js all     - 运行所有测试');
  console.log('  node run-tests.js debug   - 运行调试测试');
  console.log('  node run-tests.js buttons - 运行按钮测试');
  console.log('  node run-tests.js chinese - 运行中文测试');
  console.log('  node run-tests.js render  - 运行中文渲染测试');
  console.log('  node run-tests.js help    - 显示帮助信息');
  console.log('\n可用测试:');
  tests.forEach(test => {
    console.log(`  ${test.script.padEnd(20)} - ${test.description}`);
  });
}

// 主函数
function main() {
  const command = process.argv[2];

  switch (command) {
    case 'all':
      runAllTests();
      break;
    case 'debug':
      runTest('debug-browser.js');
      break;
    case 'buttons':
      runTest('test-buttons.js');
      break;
    case 'chinese':
      runTest('test-chinese.js');
      break;
    case 'render':
      runTest('test-chinese-render.js');
      break;
    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;
    default:
      console.log('❌ 未知命令:', command);
      showHelp();
      process.exit(1);
  }
}

// 检查是否在正确的目录运行
if (!process.argv[1].includes('run-tests.js')) {
  console.log('请确保在 tools/puppeteer 目录下运行此脚本');
  process.exit(1);
}

main();
