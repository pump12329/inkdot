#!/usr/bin/env node

/**
 * InkDot 开发环境自动设置脚本
 * 
 * 功能：
 * - 检查系统环境要求
 * - 安装项目依赖
 * - 配置开发工具
 * - 设置Git hooks
 * - 验证环境配置
 * 
 * 使用方法：
 * node scripts/setup-dev-environment.js [options]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置
const CONFIG = {
  requiredNodeVersion: '18.0.0',
  requiredNpmVersion: '8.0.0',
  projectName: 'InkDot',
  setupSteps: [
    'checkEnvironment',
    'installDependencies',
    'setupGitHooks',
    'configureEnvironment',
    'verifySetup'
  ]
};

/**
 * 检查系统环境
 */
function checkEnvironment() {
  console.log('🔍 检查系统环境...');

  // 检查Node.js版本
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    const version = nodeVersion.replace('v', '');
    console.log(`✅ Node.js版本: ${nodeVersion}`);

    if (!isVersionGreaterOrEqual(version, CONFIG.requiredNodeVersion)) {
      throw new Error(`Node.js版本过低，需要 >= ${CONFIG.requiredNodeVersion}`);
    }
  } catch (error) {
    console.error('❌ Node.js未安装或版本过低');
    console.error('请访问 https://nodejs.org/ 下载安装Node.js');
    process.exit(1);
  }

  // 检查npm版本
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    console.log(`✅ npm版本: ${npmVersion}`);

    if (!isVersionGreaterOrEqual(npmVersion, CONFIG.requiredNpmVersion)) {
      throw new Error(`npm版本过低，需要 >= ${CONFIG.requiredNpmVersion}`);
    }
  } catch (error) {
    console.error('❌ npm未安装或版本过低');
    process.exit(1);
  }

  // 检查Git
  try {
    const gitVersion = execSync('git --version', { encoding: 'utf8' }).trim();
    console.log(`✅ Git版本: ${gitVersion}`);
  } catch (error) {
    console.error('❌ Git未安装');
    console.error('请访问 https://git-scm.com/ 下载安装Git');
    process.exit(1);
  }

  console.log('✅ 环境检查通过\n');
}

/**
 * 安装项目依赖
 */
function installDependencies() {
  console.log('📦 安装项目依赖...');

  try {
    // 检查package.json是否存在
    if (!fs.existsSync('package.json')) {
      throw new Error('package.json文件不存在');
    }

    // 安装依赖
    console.log('正在安装依赖，这可能需要几分钟...');
    execSync('npm install', { stdio: 'inherit' });

    console.log('✅ 依赖安装完成\n');
  } catch (error) {
    console.error('❌ 依赖安装失败:', error.message);
    process.exit(1);
  }
}

/**
 * 设置Git hooks
 */
function setupGitHooks() {
  console.log('🪝 设置Git hooks...');

  try {
    // 检查是否在Git仓库中
    execSync('git status', { stdio: 'ignore' });

    // 安装husky
    console.log('安装husky...');
    execSync('npm install --save-dev husky lint-staged', { stdio: 'inherit' });

    // 设置pre-commit hook
    console.log('配置pre-commit hook...');
    execSync('npx husky add .husky/pre-commit "npx lint-staged"', { stdio: 'inherit' });

    console.log('✅ Git hooks设置完成\n');
  } catch (error) {
    console.log('⚠️ Git hooks设置跳过（不在Git仓库中）\n');
  }
}

/**
 * 配置环境变量
 */
function configureEnvironment() {
  console.log('⚙️ 配置环境变量...');

  try {
    // 检查.env.local是否存在
    if (!fs.existsSync('.env.local')) {
      // 复制.env.example到.env.local
      if (fs.existsSync('.env.example')) {
        fs.copyFileSync('.env.example', '.env.local');
        console.log('✅ 已创建.env.local文件');
      } else {
        // 创建默认的.env.local
        const defaultEnv = `# InkDot 开发环境配置
VITE_APP_TITLE=InkDot
VITE_APP_VERSION=1.0.0
VITE_API_BASE_URL=http://localhost:3000
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key_here
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here

# 开发模式
NODE_ENV=development
VITE_DEV_SERVER_PORT=5173
`;
        fs.writeFileSync('.env.local', defaultEnv);
        console.log('✅ 已创建默认.env.local文件');
      }

      console.log('📝 请编辑.env.local文件配置你的API密钥');
    } else {
      console.log('✅ .env.local文件已存在');
    }

    console.log('✅ 环境变量配置完成\n');
  } catch (error) {
    console.error('❌ 环境变量配置失败:', error.message);
  }
}

/**
 * 验证设置
 */
function verifySetup() {
  console.log('🔍 验证开发环境设置...');

  try {
    // 检查关键文件
    const requiredFiles = [
      'package.json',
      'vite.config.ts',
      'tsconfig.json',
      'tailwind.config.js'
    ];

    for (const file of requiredFiles) {
      if (!fs.existsSync(file)) {
        throw new Error(`缺少必要文件: ${file}`);
      }
    }
    console.log('✅ 项目文件检查通过');

    // 运行类型检查
    console.log('运行TypeScript类型检查...');
    execSync('npm run type-check', { stdio: 'inherit' });
    console.log('✅ TypeScript类型检查通过');

    // 运行代码检查
    console.log('运行ESLint检查...');
    execSync('npm run lint', { stdio: 'inherit' });
    console.log('✅ ESLint检查通过');

    console.log('\n🎉 开发环境设置完成！');
    console.log('\n📋 下一步：');
    console.log('1. 编辑.env.local文件配置API密钥');
    console.log('2. 运行 npm run dev 启动开发服务器');
    console.log('3. 访问 http://localhost:5173 查看应用');
    console.log('4. 阅读 docs/development/initial-development-guide.md 了解开发指南');

  } catch (error) {
    console.error('❌ 环境验证失败:', error.message);
    console.log('\n🔧 故障排除：');
    console.log('1. 确保所有依赖已正确安装');
    console.log('2. 检查TypeScript配置');
    console.log('3. 运行 npm run lint:fix 修复代码风格问题');
  }
}

/**
 * 比较版本号
 */
function isVersionGreaterOrEqual(version1, version2) {
  const v1parts = version1.split('.').map(Number);
  const v2parts = version2.split('.').map(Number);

  for (let i = 0; i < Math.max(v1parts.length, v2parts.length); i++) {
    const v1part = v1parts[i] || 0;
    const v2part = v2parts[i] || 0;

    if (v1part > v2part) return true;
    if (v1part < v2part) return false;
  }

  return true;
}

/**
 * 显示帮助信息
 */
function showHelp() {
  console.log(`
InkDot 开发环境自动设置脚本

用法: node scripts/setup-dev-environment.js [options]

功能:
  - 检查系统环境要求 (Node.js >= 18.0.0, npm >= 8.0.0)
  - 安装项目依赖
  - 配置Git hooks (husky + lint-staged)
  - 设置环境变量文件
  - 验证开发环境配置

环境要求:
  - Node.js >= 18.0.0
  - npm >= 8.0.0
  - Git >= 2.30.0

示例:
  node scripts/setup-dev-environment.js

注意:
  - 请确保在项目根目录下运行此脚本
  - 脚本会自动创建.env.local文件
  - 需要手动配置API密钥
  `);
}

/**
 * 主函数
 */
function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }

  console.log(`🚀 开始设置 ${CONFIG.projectName} 开发环境...\n`);

  // 检查是否在项目根目录
  if (!fs.existsSync('package.json')) {
    console.error('❌ 请在项目根目录下运行此脚本');
    process.exit(1);
  }

  // 执行设置步骤
  for (const step of CONFIG.setupSteps) {
    try {
      eval(`${step}()`);
    } catch (error) {
      console.error(`❌ 步骤 ${step} 执行失败:`, error.message);
      process.exit(1);
    }
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  checkEnvironment,
  installDependencies,
  setupGitHooks,
  configureEnvironment,
  verifySetup
};
