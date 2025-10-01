#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 清理脚本
function cleanup() {
  console.log('🧹 开始清理项目文件...');

  // 要清理的文件和目录
  const _cleanupItems = [
    // 临时文件
    '*.tmp',
    '*.temp',
    '*.log',
    '*.cache',

    // 测试输出文件（除了screenshots目录）
    'debug-*.png',
    'test-*.png',
    'chinese-*.png',
    'font-test-*.png',
    'debug-*.json',

    // 构建输出
    'dist/',
    'build/',
    'coverage/',

    // 依赖目录
    'node_modules/',

    // 编辑器文件
    '.vscode/',
    '.idea/',
    '*.swp',
    '*.swo',
    '*~',

    // 系统文件
    '.DS_Store',
    'Thumbs.db',
    '.directory'
  ];

  // 清理根目录的临时文件
  const rootDir = process.cwd();
  const files = fs.readdirSync(rootDir);

  let cleanedCount = 0;

  files.forEach(file => {
    const filePath = path.join(rootDir, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile()) {
      // 清理临时文件
      if (
        file.match(/\.(tmp|temp|log|cache)$/) ||
        file.match(/^(debug-|test-|chinese-|font-test-).*\.(png|json)$/)
      ) {
        try {
          fs.unlinkSync(filePath);
          console.log(`  ✅ 删除文件: ${file}`);
          cleanedCount++;
        } catch (error) {
          console.log(`  ⚠️  无法删除: ${file} (${error.message})`);
        }
      }
    }
  });

  // 清理screenshots目录中的旧文件
  const screenshotsDir = path.join(rootDir, 'tools', 'screenshots');
  if (fs.existsSync(screenshotsDir)) {
    const screenshotFiles = fs.readdirSync(screenshotsDir);
    screenshotFiles.forEach(file => {
      if (file.match(/\.(png|json)$/)) {
        try {
          fs.unlinkSync(path.join(screenshotsDir, file));
          console.log(`  ✅ 清理截图: ${file}`);
          cleanedCount++;
        } catch (error) {
          console.log(`  ⚠️  无法删除截图: ${file} (${error.message})`);
        }
      }
    });
  }

  console.log(`\n🎉 清理完成！共清理了 ${cleanedCount} 个文件`);
  console.log('\n📁 当前项目结构:');
  console.log('├── src/                    # 源代码');
  console.log('├── docs/                   # 文档');
  console.log('├── tools/                  # 工具脚本');
  console.log('│   └── screenshots/       # 测试截图');
  console.log('├── tests/                  # 测试文件');
  console.log('└── 配置文件...');
}

// 运行清理
cleanup();
