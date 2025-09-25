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
  },
  {
    name: '字体检测工具',
    script: 'check-fonts.js',
    description: '检查系统可用字体'
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
  console.log('🧪 开始运行所有 Playwright 测试');
  console.log('='.repeat(50));

  tests.forEach(test => {
    console.log(`\n📋 ${test.name}: ${test.description}`);
    runTest(test.script);
  });

  console.log('\n🎉 所有测试完成');
}

// 显示帮助信息
function showHelp() {
  console.log('Playwright 测试工具');
  console.log('='.repeat(30));
  console.log('\n可用命令:');
  console.log('  node run-tests.js all     - 运行所有测试');
  console.log('  node run-tests.js debug   - 运行调试测试');
  console.log('  node run-tests.js buttons - 运行按钮测试');
  console.log('  node run-tests.js chinese - 运行中文测试');
  console.log('  node run-tests.js render  - 运行中文渲染测试');
  console.log('  node run-tests.js fonts   - 运行字体检测测试');
  console.log('  node run-tests.js help    - 显示帮助信息');
  console.log('\n可用测试:');
  tests.forEach(test => {
    console.log(`  ${test.script.padEnd(20)} - ${test.description}`);
  });
  console.log('\n注意事项:');
  console.log('  - 确保已启动开发服务器 (npm run dev)');
  console.log('  - 测试将访问 http://localhost:3001');
  console.log('  - 截图将保存到 tools/screenshots/ 目录');
  console.log('  - 需要安装 @playwright/test 和 playwright');
}

// 检查环境
function checkEnvironment() {
  try {
    // 检查Playwright是否安装
    require('playwright');
    console.log('✅ Playwright 已安装');
  } catch (error) {
    console.error(
      '❌ Playwright 未安装，请运行: npm install --save-dev @playwright/test playwright'
    );
    process.exit(1);
  }

  // 检查screenshots目录
  const screenshotsDir = path.join(__dirname, '..', 'screenshots');
  const fs = require('fs');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
    console.log('✅ 创建了 screenshots 目录');
  }
}

// 主函数
function main() {
  const command = process.argv[2];

  // 检查环境
  checkEnvironment();

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
    case 'fonts':
      runTest('check-fonts.js');
      break;
    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;
    default:
      if (command) {
        console.log('❌ 未知命令:', command);
      }
      showHelp();
      process.exit(1);
  }
}

// 检查是否在正确的目录运行
if (!process.argv[1].includes('run-tests.js')) {
  console.log('请确保在 tools/playwright 目录下运行此脚本');
  process.exit(1);
}

main();
